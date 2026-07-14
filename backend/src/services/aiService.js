import OpenAI from "openai";

function createDemoInsights(client) {
  return {
    summary: `${client.name} is a ${client.industry.toLowerCase()} client looking for a practical plan based on the latest discussion.`,
    painPoints: [
      "The team needs a clearer follow-up process.",
      "Important client context is spread across meeting notes.",
    ],
    recommendations: [
      "Agree on one measurable short-term goal.",
      "Create a simple weekly follow-up routine with clear ownership.",
    ],
    nextAction: `Review the notes with ${client.name} and schedule the next working session.`,
  };
}

export async function generateInsights(client) {
  if (!process.env.GROQ_API_KEY) {
    return { insights: createDemoInsights(client), source: "demo" };
  }

  try {
    const groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
      response_format: { type: "json_object" },
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are a client success assistant. Return valid JSON with exactly these keys: summary (string), painPoints (array of strings), recommendations (array of strings), nextAction (string). Keep it concise and practical.",
        },
        {
          role: "user",
          content: `Client: ${client.name}\nIndustry: ${client.industry}\nMeeting notes: ${client.meetingNotes}`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    return { insights: JSON.parse(content), source: "groq" };
  } catch (error) {
    console.error("Groq request failed; using demo insights:", error.message);
    return { insights: createDemoInsights(client), source: "demo" };
  }
}
