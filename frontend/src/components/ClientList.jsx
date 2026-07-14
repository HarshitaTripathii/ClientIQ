import { ChevronRight, Search } from "lucide-react";

function ClientList({ clients, selectedId, search, isLoading, onSearch, onSelect }) {
  return (
    <aside className="client-list" id="clients">
      <label className="search-box">
        <Search size={17} />
        <span className="sr-only">Search clients</span>
        <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search clients..." />
      </label>

      <div className="client-list-items">
        {isLoading ? <p className="list-message">Loading clients...</p> : null}
        {!isLoading && clients.length === 0 ? <p className="list-message">No matching clients.</p> : null}
        {clients.map((client) => (
          <button
            key={client.id}
            className={selectedId === client.id ? "client-row selected" : "client-row"}
            onClick={() => onSelect(client.id)}
          >
            <span className="small-avatar">{client.name.slice(0, 2).toUpperCase()}</span>
            <span className="client-row-copy">
              <strong>{client.name}</strong>
              <small>{client.industry}</small>
              <span className={`row-status ${client.status.toLowerCase()}`}>{client.status}</span>
            </span>
            <ChevronRight size={17} />
          </button>
        ))}
      </div>
      <p className="client-total">{clients.length} {clients.length === 1 ? "client" : "clients"}</p>
    </aside>
  );
}

export default ClientList;
