export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Nur POST erlaubt", { status: 405, headers: corsHeaders });
    }

    try {
      const formData = await request.formData();

      const discordResponse = await fetch(env.DISCORD_WEBHOOK, {
        method: "POST",
        body: formData
      });

      const text = await discordResponse.text();

      return new Response(text, {
        status: discordResponse.status,
        headers: corsHeaders
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
