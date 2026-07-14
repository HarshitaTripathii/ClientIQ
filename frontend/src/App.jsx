import { useEffect, useMemo, useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import api from "./api";
import ClientFormModal from "./components/ClientFormModal";
import ClientList from "./components/ClientList";
import EmptyWorkspace from "./components/EmptyWorkspace";
import InsightsPanel from "./components/InsightsPanel";
import NotesPanel from "./components/NotesPanel";
import Sidebar from "./components/Sidebar";
import Toast from "./components/Toast";

function getErrorMessage(error) {
  return error.response?.data?.message || "Something went wrong. Please try again.";
}

function App() {
  const [clients, setClients] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeAction, setActiveAction] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const selectedClient = clients.find((client) => client.id === selectedId) || null;
  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return clients;
    return clients.filter((client) =>
      `${client.name} ${client.industry}`.toLowerCase().includes(query),
    );
  }, [clients, search]);

  useEffect(() => {
    async function loadClients() {
      try {
        const response = await api.get("/clients");
        setClients(response.data);
        setSelectedId(response.data[0]?.id ?? null);
      } catch (error) {
        setToast({ type: "error", message: getErrorMessage(error) });
      } finally {
        setIsLoading(false);
      }
    }

    loadClients();
  }, []);

  function replaceClient(updatedClient) {
    setClients((currentClients) =>
      currentClients.map((client) => (client.id === updatedClient.id ? updatedClient : client)),
    );
  }

  async function createClient(formData) {
    setActiveAction("create");
    try {
      const response = await api.post("/clients", formData);
      setClients((currentClients) => [response.data, ...currentClients]);
      setSelectedId(response.data.id);
      setIsModalOpen(false);
      setToast({ type: "success", message: `${response.data.name} was added.` });
    } catch (error) {
      setToast({ type: "error", message: getErrorMessage(error) });
    } finally {
      setActiveAction("");
    }
  }

  async function saveNotes(meetingNotes) {
    setActiveAction("notes");
    try {
      const response = await api.put(`/clients/${selectedId}`, { meetingNotes });
      replaceClient(response.data);
      setToast({ type: "success", message: "Meeting notes saved." });
    } catch (error) {
      setToast({ type: "error", message: getErrorMessage(error) });
    } finally {
      setActiveAction("");
    }
  }

  async function generateInsights(meetingNotes) {
    setActiveAction("generate");
    try {
      await api.put(`/clients/${selectedId}`, { meetingNotes });
      const response = await api.post(`/clients/${selectedId}/generate-insights`);
      replaceClient(response.data.client);
      const sourceMessage = response.data.source === "groq" ? "AI insights generated with Groq." : "Demo insights generated locally.";
      setToast({ type: "success", message: sourceMessage });
    } catch (error) {
      setToast({ type: "error", message: getErrorMessage(error) });
    } finally {
      setActiveAction("");
    }
  }

  async function saveInsights(insights) {
    setActiveAction("insights");
    try {
      const response = await api.put(`/clients/${selectedId}/insights`, { insights });
      replaceClient(response.data);
      setToast({ type: "success", message: "Insight edits saved." });
    } catch (error) {
      setToast({ type: "error", message: getErrorMessage(error) });
    } finally {
      setActiveAction("");
    }
  }

  async function triggerAutomation() {
    setActiveAction("automation");
    try {
      const response = await api.post(`/clients/${selectedId}/trigger-automation`);
      replaceClient(response.data);
      setToast({ type: "success", message: response.data.automationStatus });
    } catch (error) {
      setToast({ type: "error", message: getErrorMessage(error) });
    } finally {
      setActiveAction("");
    }
  }

  return (
    <div className="app-shell">
      <Sidebar clientCount={clients.length} />

      <main className="main-area">
        <header className="page-header">
          <div>
            <p className="mobile-brand">Client<span>IQ</span></p>
            <h1>Client workspace</h1>
            <p>Capture notes, generate useful insights, and automate the next follow-up.</p>
          </div>
          <button className="button button-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add client
          </button>
        </header>

        <div className="workspace">
          <ClientList
            clients={filteredClients}
            selectedId={selectedId}
            search={search}
            isLoading={isLoading}
            onSearch={setSearch}
            onSelect={setSelectedId}
          />

          <section className="client-workspace">
            {selectedClient ? (
              <>
                <div className="client-heading">
                  <div className="client-avatar">{selectedClient.name.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <div className="client-title-row">
                      <h2>{selectedClient.name}</h2>
                      <span className={`status-dot ${selectedClient.status.toLowerCase()}`}>{selectedClient.status}</span>
                    </div>
                    <p>{selectedClient.industry} · {selectedClient.email || "No email added"}</p>
                  </div>
                </div>

                <NotesPanel
                  key={`notes-${selectedClient.id}`}
                  client={selectedClient}
                  isSaving={activeAction === "notes"}
                  isGenerating={activeAction === "generate"}
                  onSave={saveNotes}
                  onGenerate={generateInsights}
                />

                {selectedClient.insights ? (
                  <InsightsPanel
                    key={`insights-${selectedClient.id}`}
                    client={selectedClient}
                    isSaving={activeAction === "insights"}
                    isAutomating={activeAction === "automation"}
                    onSave={saveInsights}
                    onAutomate={triggerAutomation}
                  />
                ) : (
                  <div className="insights-empty">
                    <span><Sparkles size={20} /></span>
                    <div>
                      <h3>Your AI insights will appear here</h3>
                      <p>Add useful meeting notes, then generate a summary and clear next steps.</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <EmptyWorkspace onAddClient={() => setIsModalOpen(true)} />
            )}
          </section>
        </div>
      </main>

      {isModalOpen ? (
        <ClientFormModal
          isSubmitting={activeAction === "create"}
          onClose={() => setIsModalOpen(false)}
          onSubmit={createClient}
        />
      ) : null}
      {toast ? <Toast toast={toast} onClose={() => setToast(null)} /> : null}
    </div>
  );
}

export default App;
