// @ts-nocheck
import { Resend } from "npm:resend";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  console.log("[ENTRY] Function started, method:", req.method);
  
  if (req.method === "OPTIONS") {
    console.log("[CORS] Handling OPTIONS request");
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("[ENV] Checking environment variables");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const adminEmail = Deno.env.get("ADMIN_EMAIL");

    if (!resendApiKey || !adminEmail) {
      console.error("[ENV_ERROR] Missing RESEND_API_KEY or ADMIN_EMAIL");
      return new Response(
        JSON.stringify({ error: "Missing RESEND_API_KEY or ADMIN_EMAIL" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("[RESEND] Creating Resend client");
    const resend = new Resend(resendApiKey);
    
    console.log("[JSON] Parsing request body");
    const body = await req.json();
    console.log("[JSON_OK] Body parsed successfully");

    const orderId = body.orderId;
    const customerName = body.customerName;
    const phone = body.phone;
    const address = body.address;
    const city = body.city || "-";
    const total = body.total;
    const items = Array.isArray(body.items) ? body.items : [];

    const itemsHtml = items
      .map(
        (item) => `
          <tr>
            <td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(String(item.title || ""))}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${Number(item.quantity || 0)}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">$${Number(item.price || 0).toFixed(2)}</td>
          </tr>
        `
      )
      .join("");

    const html = `
      <div style="font-family:Arial,sans-serif;padding:24px;color:#333;">
        <h2>New Order #${escapeHtml(String(orderId))}</h2>
        <p><strong>Name:</strong> ${escapeHtml(String(customerName || ""))}</p>
        <p><strong>Phone:</strong> ${escapeHtml(String(phone || ""))}</p>
        <p><strong>Address:</strong> ${escapeHtml(String(address || ""))}</p>
        <p><strong>City:</strong> ${escapeHtml(String(city))}</p>

        <h3>Items</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr>
              <th align="left">Product</th>
              <th align="center">Qty</th>
              <th align="right">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <h3>Total: $${Number(total || 0).toFixed(2)}</h3>
      </div>
    `;

    console.log("[EMAIL] Preparing to send email to:", adminEmail);
    console.log("[EMAIL] Email subject: New Order #" + orderId);

    // TIMEOUT WRAPPER: Race between email send and 25s timeout
    console.log("[RESEND_CALL] Starting resend.emails.send()");
    const sendPromise = resend.emails.send({
      from: "Bayti <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `New Order #${orderId}`,
      html,
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Resend API timeout (25s)")), 25000)
    );

    const result = await Promise.race([sendPromise, timeoutPromise]);
    console.log("[RESEND_RESPONSE] Got response from Resend");

    if (result.error) {
      console.error("[RESEND_ERROR] Email send failed:", result.error);
      return new Response(JSON.stringify({ error: result.error }), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    console.log("[SUCCESS] Email sent successfully, ID:", result.id);
    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[CATCH_ERROR] Exception caught:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}