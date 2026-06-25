import { FileText, Presentation, Workflow } from "lucide-react";

function ActionButton({ icon: Icon, title, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-md border bg-white p-4 text-left hover:border-teal-500"
    >
      <div className="rounded-md bg-slate-100 p-3 text-slate-700">
        <Icon size={24} />
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </button>
  );
}

function DocumentActions({ project, onGenerateProposal, onGeneratePpt, onTriggerAutomation }) {
  return (
    <section className="border-t p-5">
      <h2 className="text-lg font-semibold">Generate Documents & Automate</h2>
      <p className="mt-1 text-sm text-slate-500">Create deliverables, then trigger the n8n workflow.</p>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <ActionButton
          icon={FileText}
          title="Generate Word Proposal"
          description={project?.proposal_path ? "Proposal created" : "Create .docx file"}
          onClick={onGenerateProposal}
        />
        <ActionButton
          icon={Presentation}
          title="Generate PowerPoint Deck"
          description={project?.ppt_path ? "Deck created" : "Create .pptx file"}
          onClick={onGeneratePpt}
        />
        <ActionButton
          icon={Workflow}
          title="Trigger n8n Follow-up"
          description={project?.automation_status || "Send webhook payload"}
          onClick={onTriggerAutomation}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {project?.proposal_path && (
          <a
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            href={`http://localhost:8000/projects/${project.id}/download/proposal`}
          >
            Download Proposal
          </a>
        )}
        {project?.ppt_path && (
          <a
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            href={`http://localhost:8000/projects/${project.id}/download/ppt`}
          >
            Download PPT
          </a>
        )}
      </div>
    </section>
  );
}

export default DocumentActions;

