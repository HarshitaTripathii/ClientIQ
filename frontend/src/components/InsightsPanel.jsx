import { Bot, CheckCircle2, FileText, Flag, Lightbulb, Save, TriangleAlert } from "lucide-react";
import { useState } from "react";

const insightFields = [
  { key: "summary", title: "Summary", icon: FileText, multiline: false },
  { key: "painPoints", title: "Pain points", icon: TriangleAlert, multiline: true },
  { key: "recommendations", title: "Recommendations", icon: Lightbulb, multiline: true },
  { key: "nextAction", title: "Next action", icon: Flag, multiline: false },
];

function InsightsPanel({ client, isSaving, isAutomating, onSave, onAutomate }) {
  const [draft, setDraft] = useState(client.insights);

  function changeField(key, value, multiline) {
    setDraft((current) => ({
      ...current,
      [key]: multiline ? value.split("\n").filter(Boolean) : value,
    }));
  }

  return (
    <section className="insights-section">
      <div className="insights-heading">
        <div><h3>Client insights</h3><p>Review the output and edit anything before sending it.</p></div>
        <button className="button button-secondary" onClick={() => onSave(draft)} disabled={isSaving}>
          <Save size={16} /> {isSaving ? "Saving..." : "Save edits"}
        </button>
      </div>

      <div className="insight-list">
        {insightFields.map(({ key, title, icon: Icon, multiline }) => (
          <label className="insight-row" key={key}>
            <span className="insight-icon"><Icon size={19} /></span>
            <span className="insight-copy"><strong>{title}</strong><small>{multiline ? "One item per line" : "Click the text to edit"}</small></span>
            <textarea
              value={multiline ? (draft[key] || []).join("\n") : draft[key] || ""}
              onChange={(event) => changeField(key, event.target.value, multiline)}
              rows={multiline ? 3 : 2}
            />
          </label>
        ))}
      </div>

      <div className="automation-panel" id="automation">
        <div className="automation-copy">
          <span className="automation-icon"><Bot size={22} /></span>
          <div><h3>Follow-up automation</h3><p>Send the approved insights to your n8n workflow.</p></div>
        </div>
        <div className="automation-actions">
          <span className={client.automationStatus === "Not sent" ? "automation-status pending" : "automation-status complete"}>
            {client.automationStatus === "Not sent" ? null : <CheckCircle2 size={15} />}
            {client.automationStatus}
          </span>
          <button className="button button-dark" onClick={onAutomate} disabled={isAutomating}>
            <Bot size={17} /> {isAutomating ? "Sending..." : "Send to n8n"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default InsightsPanel;
