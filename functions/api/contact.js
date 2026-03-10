export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  let data;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Neispravan zahtjev." }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const { ime, prezime, email, mobitel, datum, osobe, prigoda, poruka, izvor } = data;

  if (!ime || !prezime || !email) {
    return new Response(JSON.stringify({ error: "Ime, prezime i e-mail su obavezni." }), {
      status: 422,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: "Neispravan e-mail." }), {
      status: 422,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const subject = izvor
    ? `Novi upit - ${izvor} | Mrav Burger`
    : `Novi upit | Mrav Burger`;

  const htmlBody = `
    <h2 style="font-family:sans-serif;color:#111;">Novi upit - Mrav Burger & Beer Bar</h2>
    <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse;width:100%;max-width:600px;">
      <tr><td style="padding:8px 12px;background:#f5f0e6;font-weight:bold;width:160px;">Ime</td><td style="padding:8px 12px;">${esc(ime)} ${esc(prezime)}</td></tr>
      <tr><td style="padding:8px 12px;background:#f5f0e6;font-weight:bold;">E-mail</td><td style="padding:8px 12px;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
      ${mobitel ? `<tr><td style="padding:8px 12px;background:#f5f0e6;font-weight:bold;">Mobitel</td><td style="padding:8px 12px;">${esc(mobitel)}</td></tr>` : ""}
      ${datum ? `<tr><td style="padding:8px 12px;background:#f5f0e6;font-weight:bold;">Datum događaja</td><td style="padding:8px 12px;">${esc(datum)}</td></tr>` : ""}
      ${osobe ? `<tr><td style="padding:8px 12px;background:#f5f0e6;font-weight:bold;">Broj osoba</td><td style="padding:8px 12px;">${esc(String(osobe))}</td></tr>` : ""}
      ${prigoda ? `<tr><td style="padding:8px 12px;background:#f5f0e6;font-weight:bold;">Prigoda</td><td style="padding:8px 12px;">${esc(prigoda)}</td></tr>` : ""}
      ${izvor ? `<tr><td style="padding:8px 12px;background:#f5f0e6;font-weight:bold;">Izvor</td><td style="padding:8px 12px;">${esc(izvor)}</td></tr>` : ""}
      ${poruka ? `<tr><td style="padding:8px 12px;background:#f5f0e6;font-weight:bold;vertical-align:top;">Poruka</td><td style="padding:8px 12px;white-space:pre-wrap;">${esc(poruka)}</td></tr>` : ""}
    </table>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Mrav Burger Web <onboarding@resend.dev>",
      to: ["mravgastro@gmail.com"],
      reply_to: email,
      subject,
      html: htmlBody,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error:", err);
    return new Response(JSON.stringify({ error: "Slanje nije uspjelo.", detail: err }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function esc(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
