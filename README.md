# SLA Insights

## Solution Architecture

![IMAGE](https://github.com/Infosys-STG-Makeathon-KalingaWarriors/make-a-thon-18/blob/main/image.png)

## Available Scripts for the Frontend

In the project directory, you can run:

### Step 1. Install the dependencies
npm install

### Step 2. Running the Application
#### npm run dev
Runs the app in the development mode. Open http://localhost:5173 to view it in the browser.

#### npm run build
Builds the app for production to the dist folder.

### Frontend Project Structure
```bash
.
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── Chat
│   │   │   ├── Chatbot.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   └── ChatMessage.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DocumentList.tsx
│   │   ├── DocumentViewer.tsx
│   │   ├── FileUpload.tsx
│   │   ├── LoginForm.tsx
│   │   └── ProcessingStatus.tsx
│   ├── contexts
│   │   ├── AuthContext.tsx
│   │   ├── ChatbotContext.tsx
│   │   └── FileContext.tsx
│   ├── hooks
│   │   └── useClickOutside.ts
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

# Open Souce model setup in Backend

<div align="center">
  <a href="https://ollama.com" />
    <img alt="ollama" height="200px" src="https://github.com/ollama/ollama/assets/3325447/0d0b44e2-8f4a-4e99-9b52-a5c1c741c8f7">
  </a>
</div>

# Ollama

Get up and running with large language models.

### macOS

[Download](https://ollama.com/download/Ollama-darwin.zip)

### Windows

[Download](https://ollama.com/download/OllamaSetup.exe)

### Linux

```
curl -fsSL https://ollama.com/install.sh | sh
```

## Quickstart

To run and chat with [Llama 3.2](https://ollama.com/library/llama3.2):

```
ollama run llama3.2
```

## Model library

Ollama supports a list of models available on [ollama.com/library](https://ollama.com/library 'ollama model library')

Here are some example models that can be downloaded:

| Model              | Parameters | Size  | Download                         |
| ------------------ | ---------- | ----- | -------------------------------- |
| Llama 3.2          | 3B         | 2.0GB | `ollama run llama3.2`            |
| Phi 3 Mini         | 3.8B       | 2.3GB | `ollama run phi3`                |
| Gemma 2            | 2B         | 1.6GB | `ollama run gemma2:2b`           |
| Mistral            | 7B         | 4.1GB | `ollama run mistral`             |

> [!NOTE]
> You should have at least 8 GB of RAM available to run the 7B models, 16 GB to run the 13B models, and 32 GB to run the 33B models.

## Backend Project Structure

```Bash
.
├──__init__.py
├──chroma_utils.py
├──db_utils.py
├──langchain_utils.py
├──main.py
└──pydantic_models.py
```
