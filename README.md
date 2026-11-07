# DocuMind AI

DocuMind AI is a backend-first full-stack application for uploading PDF documents and asking questions about their contents using Retrieval-Augmented Generation (RAG).

## Key Features

- Express.js backend with CORS and JSON parsing
- Supabase Auth-based user registration, login, logout, and protected profile route
- Authenticated PDF upload with Multer memory storage
- PDF text extraction using pdf-parse, with Gemini OCR fallback for scanned PDFs
- Text chunking with overlap and persistent storage in Supabase
- Document library endpoint for listing a user's documents
- Document-based question answering using Gemini and simple term-overlap retrieval
- Conversation history and persistent chat messages
- User ownership enforcement for documents, conversations, and messages
- Health-check endpoints for backend and Supabase

## Technology Stack

- Node.js
- Express.js
- Supabase (Auth, Database, Storage)
- Google Gemini API
- pdf-parse
- Multer
- dotenv
- CORS
- bcryptjs
- jsonwebtoken

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
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 18+
- A Supabase project
- A Google Gemini API key

## Backend Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file in `backend/` using placeholder values:

```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
```

3. Ensure a private Supabase Storage bucket named `documents` exists.

## Running the Backend

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoint Overview

- `GET /` - Backend health check
- `GET /api/health/supabase` - Supabase health check
- `POST /api/auth/register` - Register a user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user
- `GET /api/auth/me` - Get authenticated user
- `POST /api/documents/upload` - Upload a PDF
- `GET /api/documents` - List user's documents
- `POST /api/documents/:documentId/ask` - Ask a question about a document
- `POST /api/documents/:documentId/conversations` - Create a conversation
- `GET /api/documents/:documentId/conversations` - List conversations
- `POST /api/conversations/:conversationId/messages` - Send a message
- `GET /api/conversations/:conversationId/messages` - Get messages

## Current Limitations

- No frontend is implemented yet.
- Retrieval uses simple term overlap instead of embeddings/vector search.
- OCR depends on Gemini availability and may be slower for large scanned PDFs.
- No automated test suite is included yet.

## Future Improvements

- Add a frontend application for document upload and chat.
- Replace simple retrieval with embedding-based vector search.
- Add automated tests and CI checks.

## AI Tools and Third-Party Libraries Disclosure

This project uses Google Gemini for OCR and question answering, Supabase for authentication, database, and storage, and several open-source npm packages listed in `backend/package.json`.
