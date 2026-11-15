#  DocuMind AI

**Your knowledge, one question away.**

DocuMind AI is a full-stack AI-powered document question-answering application that allows users to upload PDF documents and interact with their content through natural-language conversations.

It uses Retrieval-Augmented Generation (RAG) to retrieve relevant document content and Google Gemini to generate context-aware answers with source references.

##  Live Demo

- **Frontend:** https://docu-mind-ai-pink-beta.vercel.app
- **Backend:** https://documind-ai-ckjo.onrender.com

The application is deployed using Vercel, Render, and Supabase.

##  Problem Statement

Reading and searching through lengthy PDF documents can be time-consuming and inefficient.

Users often struggle to locate specific information, understand technical content, and retrieve relevant details from large documents.

DocuMind AI addresses this problem by allowing users to upload their documents, ask questions in natural language, and receive AI-generated answers grounded in the extracted document content.

##  Features

###  Authentication & User Management
- User registration and login using Supabase Authentication.
- Protected routes and session restoration.
- Forgot password and password reset flows.
- Profile settings and avatar selection.
- Secure logout functionality.

###  Document Management
- PDF upload with drag-and-drop support.
- File validation and upload progress.
- PDF text extraction using pdf-parse.
- Gemini-powered OCR fallback for scanned PDFs.
- Text chunking with overlapping content.
- Persistent document and chunk storage.
- Document library with metadata.
- PDF viewing and downloading.

###  AI-Powered Document Assistant
- Ask natural-language questions about uploaded PDFs.
- Retrieval-Augmented Generation (RAG) workflow.
- Relevant document chunks retrieved using term-overlap matching.
- Google Gemini generates context-aware responses.
- Source references with page and chunk information.
- Document-specific conversations.

###  Conversation Management
- Create conversations for individual documents.
- Persistent user and assistant messages.
- Conversation history retrieval.
- Source references saved with assistant responses.

###  User Interface
- Modern React dashboard.
- Responsive interface.
- Authentication pages with form validation.
- Document library and AI assistant interface.
- Markdown-rendered AI responses.
- Settings and profile management.
- Light pastel visual design.

##  Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React, Vite, TypeScript |
| Styling | Tailwind CSS |
| Routing | React Router |
| HTTP Client | Axios |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| File Upload | Multer |
| PDF Processing | pdf-parse |
| Authentication | Supabase Auth |
| Database | Supabase PostgreSQL |
| File Storage | Supabase Storage |
| AI Integration | Google Gemini API |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |

##  System Architecture

```text
                  USER
                   |
                   v
          React + Vite Frontend
                   |
                   v
              Axios API
                   |
                   v
           Express.js Backend
             /           \
            /             \
           v               v
      Supabase          Google Gemini
      /   |   \          /         \
     /    |    \        /           \
    Auth  DB  Storage  OCR       AI Answers
           |
           v
     Document Chunks
           |
           v
      RAG Retrieval
           |
           v
     Context-aware Answer
           |
           v
       React Chat UI
```

##  How It Works

1. **Authentication:** Users register or log in through Supabase Authentication.
2. **PDF Upload:** Authenticated users upload PDF documents through the React frontend.
3. **Text Extraction:** The Express backend extracts PDF text using pdf-parse.
4. **OCR Fallback:** Gemini is used when scanned documents require visual text extraction.
5. **Chunking:** Extracted content is divided into smaller overlapping chunks.
6. **Storage:** Document metadata and extracted chunks are stored in Supabase.
7. **Question Retrieval:** When a user asks a question, relevant chunks are retrieved using term-overlap matching.
8. **AI Generation:** Retrieved content is provided to Google Gemini to generate a context-aware answer.
9. **Source References:** The response includes references to relevant document pages and chunks.
10. **Conversation Persistence:** User questions and AI responses are saved for future access.

##  Project Structure

```text
DocuMind-AI/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
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
│
├── .gitignore
└── README.md
```

##  Prerequisites

Before running the project locally, make sure you have:

- Node.js 18 or later.
- npm.
- A Supabase project.
- A Google Gemini API key.
- Git.

##  Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/KEERTI1010/DocuMind-AI.git

cd DocuMind-AI
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory.

```env
PORT=5000

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_KEY=your-secret-key

GEMINI_API_KEY=your-gemini-api-key
```

Start the backend development server:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` directory.

```env
VITE_API_BASE_URL=http://localhost:5000

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key

VITE_DEV_PREVIEW=false
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at the local URL provided by Vite, usually:

```text
http://localhost:5173
```

##  Environment Variables

### Backend

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `SUPABASE_SECRET_KEY` | Server-side Supabase secret key |
| `GEMINI_API_KEY` | Google Gemini API key |

### Frontend

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `VITE_DEV_PREVIEW` | Development preview configuration |

**Security Note:** Never commit `.env` files, Supabase secret keys, or Gemini API keys to GitHub. Keep all server-side secrets exclusively in the backend environment.

##  API Endpoint Overview

### General

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Backend status |
| GET | `/api/health/supabase` | Supabase health check |

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in a user |
| POST | `/api/auth/logout` | Log out a user |
| GET | `/api/auth/me` | Retrieve authenticated user profile |

### Documents

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/documents/upload` | Upload a PDF |
| GET | `/api/documents` | List user documents |
| POST | `/api/documents/:documentId/ask` | Ask a question about a document |

### Conversations

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/documents/:documentId/conversations` | Create a conversation |
| GET | `/api/documents/:documentId/conversations` | Retrieve document conversations |
| POST | `/api/conversations/:conversationId/messages` | Send a message |
| GET | `/api/conversations/:conversationId/messages` | Retrieve conversation messages |

##  Database & Supabase Integration

DocuMind AI uses Supabase for authentication, database management, and PDF storage.

The main database tables include:

- **documents:** Stores document metadata.
- **document_chunks:** Stores extracted document text chunks.
- **conversations:** Stores document-specific conversations.
- **messages:** Stores user and assistant messages.

A private Supabase Storage bucket named `documents` stores uploaded PDF files.

The backend uses a server-side Supabase administrative client for privileged operations and performs explicit ownership checks for user-specific resources.

##  Deployment Architecture

The application is deployed using three services:

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Authentication, Database & Storage | Supabase |

The frontend communicates with the deployed Express backend through Axios using the configured API base URL.

The backend communicates with Supabase and Google Gemini to process documents and generate AI responses.

##  AI Integration & Third-Party Libraries

- **Google Gemini API:** Used for OCR fallback and AI-powered question answering.
- **Supabase:** Used for authentication, database, and file storage.
- **pdf-parse:** Used for PDF text extraction.
- **Multer:** Handles PDF uploads.
- **Axios:** Handles frontend API requests.
- **Express.js:** Provides backend REST APIs.
- **React and Vite:** Power the frontend application.

##  Current Limitations

- Retrieval currently uses simple term-overlap matching rather than embedding-based vector search.
- OCR and AI answer generation depend on Gemini API availability and usage limits.
- AI answer quality depends on the quality of extracted document text.
- Automated frontend and backend test coverage can be improved.

##  Future Improvements

- Implement embedding-based semantic search and vector retrieval.
- Integrate a vector database for improved document retrieval.
- Improve OCR accuracy for complex document layouts and tables.
- Add automated frontend and backend testing.
- Optimize document processing and response times.
- Support additional document formats.
- Improve source highlighting and document navigation.

##  Developer

**Developed as a full-stack AI project.**

GitHub: https://github.com/KEERTI1010/DocuMind-AI

---

 If you find DocuMind AI interesting, feel free to explore the project and try the live demo!

**DocuMind AI — Your knowledge, one question away.**