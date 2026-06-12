// Netlify Function: Claude API proxy
// Keeps ANTHROPIC_API_KEY server-side. Set it in Netlify -> Site settings ->
// Environment variables. Never ship the key in client code.
export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST only" }), { status: 405 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: { message: "ANTHROPIC_API_KEY not configured in Netlify environment variables" } }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    const body = await req.text();
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body,
    });
    return new Response(await r.text(), {
      status: r.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: { message: e.message } }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const config = { path: "/api/claude" };
