import { X } from "lucide-react";
import { useState } from "react";

const emptyForm = { name: "", industry: "", email: "", meetingNotes: "" };

function ClientFormModal({ isSubmitting, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function submitForm(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="add-client-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div><h2 id="add-client-title">Add a new client</h2><p>Start with only the information you need.</p></div>
          <button className="icon-button" onClick={onClose} aria-label="Close modal"><X size={19} /></button>
        </div>
        <form onSubmit={submitForm}>
          <label>Client name<input name="name" value={form.name} onChange={updateField} placeholder="FreshMart" required /></label>
          <label>Industry<input name="industry" value={form.industry} onChange={updateField} placeholder="Retail" required /></label>
          <label>Email<input type="email" name="email" value={form.email} onChange={updateField} placeholder="client@example.com" /></label>
          <label>Meeting notes<textarea name="meetingNotes" value={form.meetingNotes} onChange={updateField} placeholder="Add initial context (optional)" rows={4} /></label>
          <div className="modal-actions">
            <button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
            <button className="button button-primary" disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add client"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientFormModal;
