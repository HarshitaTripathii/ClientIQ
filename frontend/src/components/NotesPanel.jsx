import { Save, Sparkles } from "lucide-react";
import { useState } from "react";

function NotesPanel({ client, isSaving, isGenerating, onSave, onGenerate }) {
  const [notes, setNotes] = useState(client.meetingNotes);

  return (
    <section className="notes-panel">
      <div className="notes-editor">
        <div className="section-heading">
          <div><h3>Meeting notes</h3><p>Write the useful context from your latest client conversation.</p></div>
          <span>{notes.length} characters</span>
        </div>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Example: The client wants to improve customer retention..."
          rows={6}
        />
        <button className="button button-secondary" onClick={() => onSave(notes)} disabled={isSaving || isGenerating}>
          <Save size={16} /> {isSaving ? "Saving..." : "Save notes"}
        </button>
      </div>

      <div className="generate-panel">
        <div className="feature-icon"><Sparkles size={22} /></div>
        <h3>Generate AI insights</h3>
        <p>Turn the meeting notes into a summary, pain points, recommendations, and one clear next action.</p>
        <button className="button button-primary full-width" onClick={() => onGenerate(notes)} disabled={isSaving || isGenerating || !notes.trim()}>
          <Sparkles size={17} /> {isGenerating ? "Generating..." : "Generate AI insights"}
        </button>
      </div>
    </section>
  );
}

export default NotesPanel;
