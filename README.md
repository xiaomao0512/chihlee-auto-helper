📘 Chihlee Auto Summary Helper
This is a simple browser userscript made for Chihlee Digital Learning exam pages.
It extracts visible question content and uses an LLM via OpenRouter API to generate helpful key-point summaries for each question — focused on learning, not just answers.

✨ Features
✅ Automatically detects page changes and new questions

🧠 Uses Claude (via OpenRouter) to summarize important concepts and reasoning

💬 Does not give direct answers — helps with review and understanding

📝 Press Ctrl + S to export all summaries into a .txt note file

🧪 How to Use
Install Tampermonkey extension in your browser

Add this script (click Install or paste it manually)

Visit dlc.chihlee.edu.tw/learn/exam/ and start answering

Open DevTools (F12) to view summaries in the Console

Press Ctrl + S anytime to download your notes

🔒 Privacy Notice
Script runs only in your browser

Parses only visible content on screen

No user data is stored or transmitted

This project is not affiliated with Chihlee University

📦 Tech Info
Model: anthropic/claude-3-haiku via OpenRouter

Language: JavaScript (userscript)

Runs on: Tampermonkey + Chrome / Edge / Firefox

Author: @xiaomao0512
