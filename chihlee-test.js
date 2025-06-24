// ==UserScript==
// @name         chihlee-test
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  使用 OpenRouter API 產出每題重點摘要，非直接給答案，可匯出為筆記檔案
// @match        https://dlc.chihlee.edu.tw/learn/exam/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const API_KEY = 'iput your OpenRouter API key here';
    const MODEL = 'anthropic/claude-3-haiku';
    const records = [];

    function getQuestionAndOptions() {
        const tdList = Array.from(document.querySelectorAll('td[align="left"]'));
        const td = tdList.find(td => td.querySelector('ol'));
        if (!td) return null;

        const questionNode = td.childNodes[0];
        const questionText = questionNode?.textContent || td.innerText;

        const questionImg = td.querySelector('img');
        const imgSrc = questionImg ? questionImg.src : '';
        const questionBase = questionText.split(/\(\s*複選\s*\)|\(\s*單選\s*\)/)[0].trim();
        const question = imgSrc ? `${questionBase}\n[圖片] ${imgSrc}` : questionBase;

        const liElements = Array.from(td.querySelectorAll('ol > li'));
        const options = liElements.map(li => {
            const html = li.innerHTML;
            const match = html.match(/<\/span>([^<]+)/);
            return match ? match[1].trim() : li.textContent.trim();
        });

        const inputs = Array.from(td.querySelectorAll('input[type="radio"], input[type="checkbox"]'));
        const type = inputs.length > 0 && inputs[0].type === 'checkbox' ? 'multi' : 'single';

        return { question, options, inputs, type };
    }

    async function askGPTSummary(question, options, type) {
        if (options.length === 0 || !question) return null;

        const prompt = `以下是一個${type === "multi" ? "多選" : "單選"}題，請根據題目與選項整理出重點觀念摘要，而不是直接給出答案。例如可說明選項意義、判斷依據、知識點等，幫助複習理解：\n\n題目：${question}\n選項：\n${options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}\n\n請使用簡單清楚的方式整理這題的重點。`;

        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://dlc.chihlee.edu.tw/",
                "X-Title": "Chihlee test Script"
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.3
            })
        });

        const data = await res.json();
        return data.choices?.[0]?.message?.content?.trim() ?? null;
    }

    async function autoAnswer() {
        const data = getQuestionAndOptions();
        if (!data) return;

        const { question, options, type } = data;
        console.log('題目：', question);
        console.log('選項：', options);

        const summaryText = await askGPTSummary(question, options, type);
        console.log('重點整理：', summaryText);

        records.push({ question, options, type, summary: summaryText });
    }

    function downloadSummary() {
        const content = records.map((r, idx) => {
            return `【第 ${idx + 1} 題】\n題目：${r.question}\n選項：\n${r.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}\n\n🧠 重點整理：\n${r.summary}\n`;
        }).join('\n--------------------------\n');

        const fullText = "【題目複習筆記】\n\n" + content;

        const blob = new Blob(["\uFEFF" + fullText], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = '重點整理筆記.txt';
        link.click();
    }

    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            downloadSummary();
        }
    });

    let lastPage = '';
    let debounceTimer = null;

    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const nowPage = document.querySelector('#pagePanel')?.innerText;
            if (nowPage && nowPage !== lastPage) {
                lastPage = nowPage;
                const td = document.querySelector('td[align="left"]');
                const inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
                if (td && inputs.length > 0) {
                    console.clear();
                    console.log("偵測到新題目畫面，開始整理重點（非直接答案）");
                    autoAnswer();
                }
            }
        }, 500);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
