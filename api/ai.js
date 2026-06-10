// Vercel serverless function — same behaviour as netlify/functions/ai-proxy.js
// Lives at /api/ai automatically (no redirect config needed on Vercel).
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: { message: "GROQ_API_KEY not set. Add it in Vercel → Project Settings → Environment Variables." } });
  }
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    // Convert Anthropic format to Groq/OpenAI format
    const groqBody = {
      model: "llama-3.3-70b-versatile",
      max_tokens: body.max_tokens || 1000,
      messages: body.system
        ? [{ role: "system", content: body.system }, ...body.messages]
        : body.messages,
    };
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
      },
      body: JSON.stringify(groqBody),
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: { message: data.error?.message || "Groq API error" } });
    }
    // Convert Groq response back to Anthropic format so the app works unchanged
    const text = data.choices?.[0]?.message?.content || "";
    return res.status(200).json({ content: [{ type: "text", text }] });
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
}

