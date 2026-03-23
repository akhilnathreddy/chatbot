# Axon: Context-Aware AI Chatbot

Axon is a full-stack, hyper-personalized AI Chatbot application. It features real-time web search capabilities, long-term semantic memory, and a custom-built "Aurora Glass" UI. 

## 🏗️ Architecture Overview

The system is split into two independent domains: a robust **Node/Express Backend** handling the heavy LLM/Vector logic, and a lightweight **Next.js Frontend** managing the client interface and state.

### 1. The Frontend (`/client`)
- **Framework**: Next.js (App Router) + React + TypeScript
- **Styling**: Tailwind CSS utilizing an entirely bespoke "Aurora Glass" aesthetic (deep space animations, cyan/fuchsia frosted glass components).
- **Core Components**:
  - `ChatWindow.tsx`: The primary orchestrator. Maintains local chat state, auto-scrolling, loading indicators, and API communication.
  - `MessageBubble.tsx`: Renders individual messages using floating glass components. Supports UI badging for when the AI uses "Web Search" or "Memory".
  - `InputBar.tsx`: A dynamic, auto-expanding floating input pill at the bottom of the screen.

### 2. The Backend (`/server`)
- **Framework**: Node.js + Express + TypeScript
- **Memory Subsystems**:
  - *Short-Term Memory* (`memoryService.ts`): Keeps the immediate last 8 messages in a rolling buffer for conversational context.
  - *Long-Term Memory* (`mongoVectorService.ts`): Uses **MongoDB Atlas Vector Search**. It converts important facts about the user into embeddings and stores them. Upon a new query, it searches the database for semantically similar past topics to provide long-term recall.
- **External AI Providers**:
  - **Cohere AI** (`embeddingService.ts`): Responsible strictly for taking text strings (memories) and converting them into 1024-dimensional mathematical arrays (`embed-english-v3.0`).
  - **Google Gemini** (`llmService.ts`): The "brain" of the chatbot. We use a custom REST fallback loop that tries **Gemini 2.5 Flash** first, bypassing region-locked SDKs. 
  - **Serper API** (`serperService.ts`): Detects when a user asks about current events (e.g., "what is the score today", "2026", "IPL") and injects live Google Search results directly into the AI's prompt so it is never out of date.

## 🔄 The Data Workflow (How a request is processed)

When a user types a message and hits send, the following sequence occurs identically every time:

1. **Client Dispatch**: `ChatWindow.tsx` appends the User message to the UI and fires a POST request to `/api/chat`.
2. **Profile & Memory Retrieval**: 
   - The backend checks the user's Session ID.
   - It fetches their profile preferences.
   - It converts the user's message into an embedding vector via Cohere.
   - It queries MongoDB Atlas for any past memories that mathematically match that vector.
3. **Web Search Check**: 
   - The backend scans the user's prompt for time-sensitive words (like "today" or "recent").
   - If found, it rapidly fetches the top 5 live Google Search snippets via Serper.
4. **LLM Synthesis**: 
   - A massive "System Prompt" is dynamically assembled containing: the current date (anchoring it to 2026), the user's profile, the retrieved long-term memories, and the live web results.
   - This payload is sent to Gemini (Command-R-Plus / 2.5 Flash).
5. **Memory Storage**:
   - The backend asynchronously saves this new interaction to both short-term history and the long-term Vector database.
6. **Client Render**: The AI's generated response is streamed back to the Next.js frontend, sliding up smoothly into the glass UI.

## 🚀 Running the Project Locally

You will need two terminal windows open simultaneously to run the project.

### Step 1: Start the Backend
```bash
cd server
npm run dev
```
*(Runs on port 5001. Requires `.env` with MONGODB_URI, GEMINI_API_KEY, COHERE_API_KEY, and SERPER_API_KEY)*

### Step 2: Start the Frontend
```bash
cd client
npm run dev
```
*(Runs on port 3000. Requires `.env.local` pointing to `NEXT_PUBLIC_API_URL=http://localhost:5001`)*
