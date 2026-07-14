# ClientIQ

ClientIQ is a small React and Express application that turns meeting notes into useful client insights and sends the approved result to an n8n workflow.

The project is intentionally easy to run and explain. Its main focus is reusable React components, frontend states, REST API integration, and one clear workflow automation.

## Demo flow

```text
Select a client
  → Add meeting notes
  → Generate insights
  → Review or edit the result
  → Send the result to n8n
```

## Main features

- Responsive React dashboard
- Searchable client list
- Meeting-notes editor
- Editable insight sections
- Loading, empty, success, and error states
- Express REST API
- Optional free Groq AI integration
- Offline demo insight generator
- Importable n8n follow-up workflow

## Tech stack

- React, Vite, Axios, Lucide React
- Node.js and ExpressJS
- JSON file persistence using Node's filesystem API
- Groq's OpenAI-compatible API with the `openai/gpt-oss-20b` model
- n8n community edition

## Run the project

Open the first terminal:

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

No API key is required. Without a key, ClientIQ uses the built-in demo generator so every feature can still be shown.

## Optional free AI setup

Create a free Groq API key and add it to `backend/.env`:

```env
GROQ_API_KEY=your_key
GROQ_MODEL=openai/gpt-oss-20b
```

The API key stays in the Express backend and is never exposed to React.

## n8n workflow setup

1. Run n8n community edition locally.
2. Import `automation/client-follow-up-workflow.json`.
3. Open the imported workflow and select **Receive ClientIQ Insights**.
4. Copy its test or production webhook URL.
5. Add the URL to `backend/.env`:

```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/clientiq-follow-up
```

6. Start listening in n8n and click **Send to n8n** in ClientIQ.

The workflow receives the client details and approved insights, prepares a follow-up message, and returns a confirmation to Express. You can later add Gmail or Slack after the **Prepare Follow-up** node without changing the application.

## Project structure

```text
ClientIQ/
  automation/
    client-follow-up-workflow.json
  frontend/src/
    components/
    App.jsx
    api.js
    styles.css
  backend/src/
    controllers/
    db/
    middleware/
    routes/
    services/
    app.js
    server.js
```

The Express request flow is deliberately simple:

```text
Route → Controller → Service or Repository → JSON response
```

## API endpoints

```text
GET  /api/health
GET  /api/clients
POST /api/clients
GET  /api/clients/:id
PUT  /api/clients/:id
POST /api/clients/:id/generate-insights
PUT  /api/clients/:id/insights
POST /api/clients/:id/trigger-automation
```

## Interview explanation

> ClientIQ is a React and Express client follow-up dashboard. I divided the interface into reusable components for navigation, clients, notes, insights, automation, modals, and notifications. React manages the form and UI states and communicates with Express through Axios. Express stores demo data, optionally generates insights through Groq, and sends approved results to an n8n webhook. I also included an offline generator so the application remains reliable during a demonstration.

## Three files to show first

- `frontend/src/App.jsx` — application state and API calls
- `backend/src/controllers/clientController.js` — Express request handling
- `automation/client-follow-up-workflow.json` — the n8n automation
