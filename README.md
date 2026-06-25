# ClientIQ: AI-Powered Client Intelligence & Proposal Automation System

ClientIQ is a beginner-friendly full-stack project where a user creates a client project, uploads meeting notes and business data, generates insights, creates a Word proposal and PowerPoint deck, and optionally triggers an n8n webhook.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios
- Backend: Python, FastAPI, SQLAlchemy, SQLite
- Data processing: Pandas, OpenPyXL
- AI: OpenAI API if `OPENAI_API_KEY` is available, otherwise a local rule-based fallback
- Documents: python-docx and python-pptx
- Automation: n8n webhook through a normal HTTP request

## Folder Structure

```text
ClientIq/
  backend/
    app/
      main.py
      database.py
      models.py
      schemas.py
      services/
    generated/
    uploads/
    requirements.txt
    .env.example
  frontend/
    src/
      components/
      App.jsx
      api.js
    package.json
```

## Run Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

Backend URL: `http://localhost:8000`

API docs: `http://localhost:8000/docs`

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## Optional AI Setup

Add your key in `backend/.env`:

```text
OPENAI_API_KEY=your_key_here
```

If no key is provided, the project still works using simple generated insights from the uploaded notes and data.

## Optional n8n Setup

Create an n8n workflow with a Webhook node, then paste the production/test webhook URL in `backend/.env`:

```text
N8N_WEBHOOK_URL=https://your-n8n-url/webhook/clientiq
```

When documents are generated, click **Trigger n8n Follow-up** from the frontend.

