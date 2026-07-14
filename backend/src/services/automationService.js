export async function triggerN8n(client) {
  if (!process.env.N8N_WEBHOOK_URL) {
    return "Demo complete — add N8N_WEBHOOK_URL to send a real webhook";
  }

  const response = await fetch(process.env.N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientName: client.name,
      clientEmail: client.email,
      industry: client.industry,
      insights: client.insights,
      nextAction: client.insights?.nextAction,
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`n8n returned status ${response.status}`);
  }

  return "Sent successfully";
}
