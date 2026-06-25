function ProjectForm({ formData, setFormData, onCreateProject, loading }) {
  function updateField(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  return (
    <section className="border-b bg-white p-5 lg:border-b-0 lg:border-r">
      <h2 className="text-lg font-semibold">Create Client Project</h2>
      <p className="mt-1 text-sm text-slate-500">Start with simple client and proposal details.</p>

      <form onSubmit={onCreateProject} className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Client Name</span>
          <input
            name="client_name"
            value={formData.client_name}
            onChange={updateField}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="FreshMart"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Industry</span>
          <input
            name="industry"
            value={formData.industry}
            onChange={updateField}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="Retail"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Business Goal</span>
          <textarea
            name="business_goal"
            value={formData.business_goal}
            onChange={updateField}
            className="mt-1 min-h-24 w-full rounded-md border px-3 py-2"
            placeholder="Improve customer retention"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Project Type</span>
          <input
            name="project_type"
            value={formData.project_type}
            onChange={updateField}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="Customer analytics proposal"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Your Email</span>
          <input
            name="user_email"
            type="email"
            value={formData.user_email}
            onChange={updateField}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="consultant@example.com"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Project"}
        </button>
      </form>
    </section>
  );
}

export default ProjectForm;

