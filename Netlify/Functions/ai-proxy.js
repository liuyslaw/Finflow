exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: { message: "GROQ_API_KEY not set. Add it in Netlify → Site Settings → Environment Variables." } })
    };
  }
  try {
    const body = JSON.parse(event.body);
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
        "Content-Type":  "application/json",
        "Authorization": "Bearer " + apiKey,
      },
      body: JSON.stringify(groqBody),
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: { message: data.error?.message || "Groq API error" } })
      };
    }
    // Convert Groq response back to Anthropic format so the app works unchanged
    const text = data.choices?.[0]?.message?.content || "";
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ content: [{ type: "text", text }] }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: { message: err.message } }),
    };
  }
};
