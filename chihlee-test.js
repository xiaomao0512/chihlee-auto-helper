// ==UserScript==
// @name         chihlee-test
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  openrouter test 
// @match        https://dlc.chihlee.edu.tw/learn/exam/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const API_KEY = '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';
    const MODEL = 'openai/gpt-3.5-turbo';

    function getQuestionAndOptions() {
        const tdList = Array.from(document.querySelectorAll('td[align="left"]'));
        const td = tdList.find(td => td.querySelector('ol'));
        if (!td) return null;

        const questionNode = td.childNodes[0];
        const questionText = questionNode?.textContent || td.innerText;
        const question = questionText.split(/\(\s*複選\s*\)|\(\s*單選\s*\)/)[0].trim();

        const liElements = Array.from(td.querySelectorAll('ol > li'));
        const options = liElements.map(li => {
            const raw = li.textContent.trim().replace(/\s+/g, ' ');
            return raw.replace(/^[A-Z][\.)]\s+/, '') || raw;
        });

        const inputs = Array.from(td.querySelectorAll('input[type="radio"], input[type="checkbox"]'));
        const type = inputs.length > 0 && inputs[0].type === 'checkbox' ? 'multi' : 'single';

        return { question, options, inputs, type };
    }

    async function askGPT(question, options, type) {
        if (options.length === 0 || !question) return null;

        const prompt = `請根據以下題目與選項選出正確答案，題型為「${type === "multi" ? "多選" : "單選"}」。\n題目：${question}\n選項：\n${options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}\n請只回傳正確答案內容，例如：\n單選：MapReduce\n多選：MapReduce, HDFS`;

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
                temperature: 0.2
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

        const answerText = await askGPT(question, options, type);
        console.log(' GPT 回答：', answerText);
    }

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
                    console.log(" 偵測到新題目畫面，開始解題！（OpenRouter 模式，偵測翻頁）");
                    autoAnswer();
                }
            }
        }, 500);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
