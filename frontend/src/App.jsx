import { useState } from "react";
import api from "./api";
import AnalysisSummary from "./components/AnalysisSummary";
import DocumentActions from "./components/DocumentActions";
import InsightsEditor from "./components/InsightsEditor";
import ProjectForm from "./components/ProjectForm";
import Sidebar from "./components/Sidebar";
import StepBar from "./components/StepBar";
import UploadPanel from "./components/UploadPanel";

const emptyForm = {
  client_name: "FreshMart",
  industry: "Retail",
  business_goal: "Improve customer retention using customer data and meeting notes",
  project_type: "Customer analytics proposal",
  user_email: "consultant@example.com",
};

function App() {
  const [formData, setFormData] = useState(emptyForm);
  const [project, setProject] = useState(null);
  const [analysis, setAnalysis] = useState({});
  const [insights, setInsights] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Create a project to begin.");
  const [currentStep, setCurrentStep] = useState(1);

  async function createProject(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/projects", formData);
      setProject(response.data);
      setCurrentStep(2);
      setMessage("Project created. Now upload notes and data.");
    } catch (error) {
      setMessage(error.response?.data?.detail || "Project could not be created.");
    } finally {
      setLoading(false);
    }
  }

  async function uploadFile(file, endpoint) {
    if (!project) {
      setMessage("Please create a project first.");
      return;
    }
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    try {
      const response = await api.post(`/projects/${project.id}/${endpoint}`, form);
      setProject(response.data);
      setCurrentStep(2);
      setMessage("File uploaded successfully.");
    } catch (error) {
      setMessage(error.response?.data?.detail || "Upload failed.");
    }
  }

  async function analyzeProject() {
    if (!project) {
      setMessage("Please create a project first.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/projects/${project.id}/analyze`);
      setAnalysis(response.data.analysis);
      setInsights(response.data.insights);
      setCurrentStep(3);
      setMessage("Analysis and insights generated.");
    } catch (error) {
      setMessage(error.response?.data?.detail || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  async function saveInsights() {
    if (!project) return;

    try {
      const response = await api.put(`/projects/${project.id}/insights`, { insights });
      setProject(response.data);
      setMessage("Insight edits saved.");
    } catch (error) {
      setMessage(error.response?.data?.detail || "Could not save insights.");
    }
  }

  async function refreshProject(response) {
    setProject(response.data);
  }

  async function generateProposal() {
    if (!project) return;
    try {
      const response = await api.post(`/projects/${project.id}/generate-proposal`);
      refreshProject(response);
      setCurrentStep(4);
      setMessage("Word proposal generated.");
    } catch (error) {
      setMessage(error.response?.data?.detail || "Proposal generation failed.");
    }
  }

  async function generatePpt() {
    if (!project) return;
    try {
      const response = await api.post(`/projects/${project.id}/generate-ppt`);
      refreshProject(response);
      setCurrentStep(4);
      setMessage("PowerPoint deck generated.");
    } catch (error) {
      setMessage(error.response?.data?.detail || "PowerPoint generation failed.");
    }
  }

  async function triggerAutomation() {
    if (!project) return;
    try {
      const response = await api.post(`/projects/${project.id}/trigger-automation`);
      refreshProject(response);
      setCurrentStep(5);
      setMessage(response.data.automation_status);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Automation trigger failed.");
    }
  }

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />

      <main className="flex-1">
        <div className="border-b bg-white px-5 py-4 lg:hidden">
          <div className="text-2xl font-bold">
            Client<span className="text-teal-600">IQ</span>
          </div>
        </div>

        <StepBar currentStep={currentStep} />

        <div className="bg-slate-50 p-5">
          <div className="mb-4 rounded-md border bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">Client Intelligence Workspace</h1>
                <p className="mt-1 text-sm text-slate-500">{message}</p>
              </div>
              <button
                onClick={analyzeProject}
                disabled={loading || !project}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? "Working..." : "Analyze Inputs"}
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-md border bg-white">
            <div className="grid lg:grid-cols-[360px_1fr]">
              <ProjectForm
                formData={formData}
                setFormData={setFormData}
                onCreateProject={createProject}
                loading={loading}
              />
              <div>
                <UploadPanel
                  project={project}
                  onUploadNotes={(event) => uploadFile(event.target.files[0], "upload-notes")}
                  onUploadData={(event) => uploadFile(event.target.files[0], "upload-data")}
                />
                <AnalysisSummary analysis={analysis} />
                <InsightsEditor insights={insights} setInsights={setInsights} onSaveInsights={saveInsights} />
                <DocumentActions
                  project={project}
                  onGenerateProposal={generateProposal}
                  onGeneratePpt={generatePpt}
                  onTriggerAutomation={triggerAutomation}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
