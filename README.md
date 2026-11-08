# DocuMind AI

DocuMind AI is a full-stack document question-answering application. Users can upload PDF documents, extract and chunk their text, and ask natural-language questions about document contents using Retrieval-Augmented Generation (RAG).

## Problem Statement

Reading and searching large PDF documents is time-consuming. DocuMind AI helps users quickly retrieve relevant information from their own documents through an authenticated, document-scoped chat experience.

## Features

### Backend
- Express.js API with CORS and JSON parsing
- Supabase Auth registration, login, logout and protected profile route
- Authenticated PDF upload with Multer memory storage
- PDF text extraction with pdf-parse and Gemini OCR fallback for scanned PDFs
- Text chunking with overlap and persistent storage
- Document listing scoped to the authenticated user
- Document-based question answering using Gemini and simple term-overlap retrieval
- Conversation history and persistent chat messages
- User ownership enforcement for documents, conversations and messages

### Frontend
- React + Vite + TypeScript + Tailwind CSS dashboard
- Authentication pages with validation and password visibility
- Forgot password and reset password flows
- Protected routes and session restoration
- PDF upload with drag-and-drop, progress and validation
- Document library with real metadata
- AI assistant chat with conversation history and source references
- Chat history page
- Settings page with profile, security and logout
- Development-only preview mode for UI testing

## Technology Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, Axios, Lucide React
- Backend: Node.js, Express.js, Multer, pdf-parse
- Database/Auth/Storage: Supabase
- AI: Google Gemini API

## System Architecture

```text
Frontend (React/Vite) -> Axios -> Express API -> Supabase (Auth/DB/Storage)
                                    -> Google Gemini (OCR + RAG answers)
```

## Project Structure

```text
DocuMind-AI/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 18+
- Supabase project
- Google Gemini API key

## Installation

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

## Environment Variables

Backend `backend/.env`:

```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
```

Frontend `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_DEV_PREVIEW=false
```

## Running the Application

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

## API Endpoint Overview

- `GET /` and `GET /api/health/supabase`
- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `POST /api/documents/upload`, `GET /api/documents`
- `POST /api/documents/:documentId/ask`
- `POST /api/documents/:documentId/conversations`, `GET /api/documents/:documentId/conversations`
- `POST /api/conversations/:conversationId/messages`, `GET /api/conversations/:conversationId/messages`

## Database and Supabase Integration

- Supabase Auth manages users and sessions.
- The `documents` table stores document metadata.
- The `document_chunks` table stores extracted text chunks.
- The `conversations` and `messages` tables store chat history.
- A private Storage bucket named `documents` stores uploaded PDFs.
- The backend admin client bypasses RLS and enforces ownership explicitly.

## AI Tools and Third-Party Libraries Disclosure

- Google Gemini is used for OCR and question answering.
- Supabase is used for authentication, database and storage.
- Additional libraries include Express, React, Vite, Tailwind CSS, Axios, Lucide React, pdf-parse and Multer.

## Current Limitations

- Frontend authentication flows have not been fully verified with real Supabase accounts due to email rate limits.
- Development preview mode is available for UI testing but does not bypass backend authentication.
- Retrieval uses simple term overlap instead of embeddings/vector search.

## Future Improvements

- Add embedding-based vector search for better retrieval.
- Add automated tests and CI for frontend and backend.