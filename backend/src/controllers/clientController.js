import { addClient, changeClient, getAllClients, getClientById } from "../db/clientRepository.js";
import { triggerN8n } from "../services/automationService.js";
import { generateInsights } from "../services/aiService.js";

function requireClient(id) {
  const client = getClientById(id);
  if (!client) {
    const error = new Error("Client not found");
    error.status = 404;
    throw error;
  }
  return client;
}

export function listClients(request, response) {
  response.json(getAllClients());
}

export function getClient(request, response) {
  response.json(requireClient(request.params.id));
}

export function createClient(request, response) {
  const { name, industry, email = "", meetingNotes = "" } = request.body;
  if (!name?.trim() || !industry?.trim()) {
    return response.status(400).json({ message: "Name and industry are required" });
  }
  response.status(201).json(addClient({ name: name.trim(), industry: industry.trim(), email: email.trim(), meetingNotes: meetingNotes.trim() }));
}

export function updateClient(request, response) {
  const client = requireClient(request.params.id);
  response.json(changeClient(client.id, {
    name: request.body.name ?? client.name,
    industry: request.body.industry ?? client.industry,
    email: request.body.email ?? client.email,
    meetingNotes: request.body.meetingNotes ?? client.meetingNotes,
  }));
}

export async function createInsights(request, response) {
  const client = requireClient(request.params.id);
  if (!client.meetingNotes.trim()) {
    return response.status(400).json({ message: "Add meeting notes before generating insights" });
  }
  const result = await generateInsights(client);
  const updatedClient = changeClient(client.id, { insights: result.insights, automationStatus: "Not sent" });
  response.json({ client: updatedClient, source: result.source });
}

export function updateInsights(request, response) {
  const client = requireClient(request.params.id);
  const { insights } = request.body;
  if (!insights || typeof insights !== "object") {
    return response.status(400).json({ message: "Valid insights are required" });
  }
  response.json(changeClient(client.id, { insights }));
}

export async function runAutomation(request, response) {
  const client = requireClient(request.params.id);
  if (!client.insights) {
    return response.status(400).json({ message: "Generate insights before triggering automation" });
  }
  const status = await triggerN8n(client);
  response.json(changeClient(client.id, { automationStatus: status }));
}
