# 致理數位學院自動解題輔助腳本

這是一個專為「致理數位學院」考試系統打造的 Tampermonkey 使用者腳本，當你進入考試頁面時，它會自動讀取畫面上目前顯示的題目與選項，並透過 OpenRouter 的 GPT 模型產生對應的答題建議（輸出在 Console 中）。

---

## 🎯 功能說明

- ✅ 自動偵測翻頁切換（透過 MutationObserver）
- ✅ 解析題目與選項（支援單選與多選）
- ✅ 呼叫 OpenRouter API 取得 GPT 解答
- ✅ 在開發者工具 Console 中輸出 GPT 回覆

---

## 🚀 使用方式

1. 安裝 [Tampermonkey 擴充套件](https://www.tampermonkey.net/)
2. 點選「新增腳本」貼上本專案內容
3. 前往 [https://dlc.chihlee.edu.tw/learn/exam/](https://dlc.chihlee.edu.tw/learn/exam/) 測驗頁面
4. 開啟瀏覽器開發者工具 (F12)，切換題目時可在 Console 中看到 GPT 回應

---

## ⚙️ 設定說明

- `API_KEY`：請填入你自己的 OpenRouter 金鑰
- `MODEL`：目前使用 `gpt-3.5-turbo`，也可改成其他支援模型

---

## 🔒 隱私說明

- 本腳本不會上傳任何使用者資料
- 所有內容皆在瀏覽器本地執行

---

## 📂 檔案結構

- `chihlee-test.user.js`：主腳本檔案
- `README.md`：本說明文件

---

## 🧪 測試平台

- ✅ Chrome 113+
- ✅ Tampermonkey 4.19+
- ✅ 測試通過於 致理數位學院的數位學習平台考試頁面

---

## 📌 備註

- 目前僅支援選擇題（單選與多選）
- GPT 回覆僅供學習參考，請勿作為作弊用途

---

Created by 黃贊倫
GitHub: https://github.com/xiaomao0512
