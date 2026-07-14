import { Plus, Users } from "lucide-react";

function EmptyWorkspace({ onAddClient }) {
  return (
    <div className="empty-workspace">
      <span><Users size={25} /></span>
      <h2>Select or create a client</h2>
      <p>Choose a client from the list to start working with their notes and insights.</p>
      <button className="button button-primary" onClick={onAddClient}><Plus size={17} /> Add client</button>
    </div>
  );
}

export default EmptyWorkspace;
