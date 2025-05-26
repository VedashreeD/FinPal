# FinPal: Your Finance Pal  
FinPal: Your sidekick for financial superpowers.

---

### Inspiration

Have you ever felt lost in the labyrinth of financial jargon, where economists speak in tongues and market reports read like ancient scrolls? That's precisely where FinPal was born.  
I firmly believe that financial literacy shouldn't be an exclusive club; it's a fundamental superpower everyone deserves. My inspiration was simple yet profound: to create a friendly, engaging, and genuinely intuitive "finance interpreter" that translates complex economic concepts into everyday language, making learning about money not just accessible, but actually fun.  
I wanted to build a companion that empowers you to confidently navigate your financial world, one delightful conversation at a time.

---

### What it does

FinPal is your personal financial literacy pal, ready to chat about anything money-related. It's an intelligent chatbot designed to:

- **Demystify Finance:** Ask it about inflation, compound interest, stock markets, or budgeting strategies, and FinPal will explain it clearly, concisely, and without the intimidating jargon.
- **Engage and Educate:** It doesn't just deliver facts; it uses a conversational, often witty, tone to make learning enjoyable. Expect helpful markdown formatting (like bolded terms, lists, and tables) to enhance understanding.
- **Provide Instant Answers:** Whether you're a beginner or looking to deepen your knowledge, FinPal offers quick, accurate explanations to your financial queries.
- **Make Learning Interactive:** With animated typing effects and a fluid chat interface, it feels less like a lesson and more like a helpful conversation with a friend.

---

### The Process

Bringing FinPal to life was an exhilarating journey, piecing together a robust backend with a delightful user experience:

- **The Brain (Backend):** I engineered the core intelligence using FastAPI for a speedy, scalable server. The conversational flow and complex logic are orchestrated by LangChain and LangGraph, providing a powerful framework for natural language interaction. Crucially, I leveraged Ollama to run Large Language Models (LLMs) locally, ensuring privacy and eliminating external API dependencies. This means you get powerful AI directly on your machine!
- **The Face (Frontend):** For the user interface, I chose React. I meticulously crafted a modern chat experience, focusing on a clean design, responsive layouts, and smooth animations. The animated typing effect and seamless markdown rendering (react-markdown) were key to creating that dynamic, engaging conversational feel.
- **Seamless Communication:** The backend exposes a lean `/chat` endpoint, which the frontend intuitively calls. This architecture ensures a smooth, real-time flow of conversation, delivering FinPal's insights word-by-word with a charming typewriter effect.

---

## Technologies Used

- **Languages:** Python (backend), React (frontend)
- **Frameworks & Libraries:**
  - **Backend:** FastAPI, LangChain, LangGraph, langchain-ollama, Ollama, Pydantic
  - **Frontend:** React, react-markdown
- **Platforms:** Local (Mac, Linux, Windows), can be deployed to any cloud supporting Python and Node.js
- **Other Tools:** Uvicorn (ASGI server), CSS for custom styling and animations
- **No external databases or cloud APIs required** (all LLM inference is local via Ollama)

---

## 3. Try It Out / See the Code

- **Live Demo:** https://youtu.be/5hh8IZiM7z0?si=vl3OYfMIdrSg5c5K

---

## 4. How to Run the Project

### Prerequisites

- Python 3.9+
- Node.js 18+
- [Ollama](https://ollama.com/) installed and running locally (for LLM inference)

### Backend (FastAPI + Chatbot)

1. **Install dependencies:**
   ```bash
   cd server
   pip install -r requirements.txt
   ```
2. **Download an LLM model using Ollama:**  
   For example, to pull a model trained on finance:
   ```bash
   ollama run 0xroyce/plutus:latest
   ```
   (You can use any model supported by Ollama, just make sure to update the `OLLAMA_MODEL` variable if you use something other than llama2).

3. **Run the FastAPI server:**
   ```bash
   uvicorn app:app --reload
   ```
   The backend will be accessible at `http://127.0.0.1:8000`.

4. **(Optional) Run the chatbot standalone (CLI):**
   ```bash
   python chatbot.py
   ```
   This allows you to interact with the chatbot directly in your terminal.

### Frontend (React)

1. **Install dependencies:**
   ```bash
   cd client
   npm install
   ```
2. **Start the React development server:**
   ```bash
   npm start
   ```
   The frontend will typically open in your browser at `http://localhost:3000` and proxy API requests to the backend.

---

## Disclaimer

**FinPal is powered by large language models (LLMs). The information and advice provided by this chatbot are for educational and informational purposes only. The results generated may not always be accurate, complete, or up-to-date. Please verify any financial advice or information with a trusted and qualified source before making decisions based on the chatbot's responses.**

---
