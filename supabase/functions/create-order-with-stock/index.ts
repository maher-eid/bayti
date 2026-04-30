// @ts-nocheck
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function randomToken(length = 32) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const values = crypto.getRandomValues(new Uint8Array(length));
  for (let i = 0; i < length; i += 1) {
    result += chars[values[i] % chars.length];
  }
  return result;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse({ error: "Missing Supabase environment variables" }, 500);
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();

    const customer_name = String(body.customer_name || "").trim();
    const phone = String(body.phone || "").trim();
    const address = String(body.address || "").trim();
    const city = String(body.city || "").trim();
    const items = Array.isArray(body.items) ? body.items : [];

    if (!customer_name || !phone || !address) {
      return jsonResponse({ error: "Missing required customer fields" }, 400);
    }

    if (!items.length) {
      return jsonResponse({ error: "Cart is empty" }, 400);
    }

    const normalizedItems = items.map((item: any) => ({
      product_id: Number(item.product_id),
      title: String(item.title || ""),
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 0),
    }));

    const invalidItem = normalizedItems.find(
      (item: any) =>
        !item.product_id ||
        !item.title ||
        item.price < 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0,
    );

    if (invalidItem) {
      return jsonResponse({ error: "Invalid cart items" }, 400);
    }

    const productIds = [...new Set(normalizedItems.map((item: any) => item.product_id))];

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, title, price, stock_quantity, is_active")
      .in("id", productIds);

    if (productsError) {
      return jsonResponse({ error: productsError.message }, 500);
    }

    const productMap = new Map((products || []).map((p: any) => [Number(p.id), p]));

    for (const item of normalizedItems) {
      const product = productMap.get(item.product_id);

      if (!product) {
        return jsonResponse({ error: `${item.title} no longer exists` }, 400);
      }

      if (product.is_active === false) {
        return jsonResponse({ error: `${product.title} is not available` }, 400);
      }

      const availableStock = Number(product.stock_quantity ?? 0);
      if (availableStock < item.quantity) {
        return jsonResponse(
          {
            error:
              availableStock <= 0
                ? `${product.title} is out of stock`
                : `Only ${availableStock} left for ${product.title}`,
          },
          400,
        );
      }
    }

    const orderItems = normalizedItems.map((item: any) => {
      const product = productMap.get(item.product_id);

      return {
        id: product.id,
        product_id: product.id,
        title: product.title,
        price: Number(product.price ?? item.price ?? 0),
        quantity: item.quantity,
      };
    });

    const total = orderItems.reduce(
      (sum: number, item: any) => sum + Number(item.price) * Number(item.quantity),
      0,
    );

    const lookup_token = randomToken(24);
    const cancel_token = randomToken(24);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          customer_name,
          phone,
          address,
          city,
          items: orderItems,
          total,
          status: "Pending",
          lookup_token,
          cancel_token,
        },
      ])
      .select()
      .single();

    if (orderError) {
      return jsonResponse({ error: orderError.message }, 500);
    }

    for (const item of orderItems) {
      const product = productMap.get(Number(item.product_id));
      const newStock = Number(product.stock_quantity ?? 0) - Number(item.quantity);

      const { error: updateError } = await supabase
        .from("products")
        .update({ stock_quantity: newStock })
        .eq("id", item.product_id);

      if (updateError) {
        return jsonResponse(
          {
            error: `Order created, but stock update failed for ${item.title}: ${updateError.message}`,
          },
          500,
        );
      }
    }

    console.log('Edge Function: Returning order:', order);
    return jsonResponse({
      success: true,
      order,
    });
  } catch (error) {
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : "Internal error",
      },
      500,
    );
  }
});