const insightFields = [
  ["executive_summary", "Executive Summary"],
  ["client_pain_points", "Client Pain Points"],
  ["data_insights", "Data Insights"],
  ["recommendations", "Recommendations"],
  ["proposal_outline", "Proposal Outline"],
  ["risks", "Risks"],
  ["next_steps", "Next Steps"],
];

function InsightsEditor({ insights, setInsights, onSaveInsights }) {
  function updateInsight(key, value) {
    setInsights({ ...insights, [key]: value });
  }

  return (
    <section className="border-t p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">AI Insights</h2>
          <p className="mt-1 text-sm text-slate-500">Review and edit before creating documents.</p>
        </div>
        <button
          onClick={onSaveInsights}
          className="rounded-md border border-teal-600 px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50"
        >
          Save Edits
        </button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {insightFields.map(([key, label]) => (
          <label key={key} className="block">
            <span className="text-sm font-medium">{label}</span>
            <textarea
              value={insights[key] || ""}
              onChange={(event) => updateInsight(key, event.target.value)}
              className="mt-1 min-h-28 w-full rounded-md border bg-white px-3 py-2 text-sm"
            />
          </label>
        ))}
      </div>
    </section>
  );
}

export default InsightsEditor;

