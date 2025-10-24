export async function POST(request) {
  try {
    const body = await request.json();
    const upstreamResponse = await fetch(
      "http://130.107.74.13:8080/pato/cadastrar",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const text = await upstreamResponse.text();
    // Tenta devolver JSON se possível
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    return new Response(JSON.stringify(data), {
      status: upstreamResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Falha ao comunicar com a API externa", details: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


