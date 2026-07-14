import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.resolve(currentDirectory, "../../data");
const dataFile = path.join(dataDirectory, "clients.json");

const seedClients = [
  { id: 1, name: "FreshMart", industry: "Retail", email: "team@freshmart.example", status: "Active", meetingNotes: "FreshMart wants to improve customer retention. The team needs a simple loyalty campaign and a clearer follow-up plan for customers who have not purchased recently.", insights: null, automationStatus: "Not sent" },
  { id: 2, name: "BrightPath Consulting", industry: "Professional Services", email: "hello@brightpath.example", status: "Pending", meetingNotes: "", insights: null, automationStatus: "Not sent" },
  { id: 3, name: "CareWell Health", industry: "Healthcare", email: "contact@carewell.example", status: "Active", meetingNotes: "", insights: null, automationStatus: "Not sent" },
];

function addTimestamps(client) {
  const now = new Date().toISOString();
  return { ...client, createdAt: now, updatedAt: now };
}

function ensureDataFile() {
  fs.mkdirSync(dataDirectory, { recursive: true });
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(seedClients.map(addTimestamps), null, 2));
  }
}

function readClients() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

function writeClients(clients) {
  fs.writeFileSync(dataFile, JSON.stringify(clients, null, 2));
}

export function getAllClients() {
  return readClients().sort((first, second) => second.updatedAt.localeCompare(first.updatedAt));
}

export function getClientById(id) {
  return readClients().find((client) => client.id === Number(id)) || null;
}

export function addClient(clientData) {
  const clients = readClients();
  const nextId = clients.length ? Math.max(...clients.map((client) => client.id)) + 1 : 1;
  const client = addTimestamps({ id: nextId, status: "Active", meetingNotes: "", insights: null, automationStatus: "Not sent", ...clientData });
  clients.push(client);
  writeClients(clients);
  return client;
}

export function changeClient(id, changes) {
  const clients = readClients();
  const index = clients.findIndex((client) => client.id === Number(id));
  if (index === -1) return null;
  clients[index] = { ...clients[index], ...changes, updatedAt: new Date().toISOString() };
  writeClients(clients);
  return clients[index];
}
