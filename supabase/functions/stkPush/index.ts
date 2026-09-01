import { createClient } from "https://esm.sh/@supabase/supabase-js";

// 1. Define centralized CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Use Deno.serve (the modern standard for Supabase Functions)
Deno.serve(async (req) => {
  
  // 2. Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response("ok", { 
      status: 200, // Explicitly return 200 OK
      headers: corsHeaders 
    });
  }

  try {
    // Only allow POST
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { phone, amount } = await req.json();

    const consumerKey = Deno.env.get("MPESA_CONSUMER_KEY");
    const consumerSecret = Deno.env.get("MPESA_CONSUMER_SECRET");
    const shortCode = Deno.env.get("MPESA_PAYBILL_OR_BUYGOODS");
    const passkey = Deno.env.get("MPESA_PASSKEY");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Get Access Token
    const auth = btoa(`${consumerKey}:${consumerSecret}`);
    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } }
    );
    const { access_token } = await tokenRes.json();

    // 2. Generate Password & Timestamp
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
    const password = btoa(`${shortCode}${passkey}${timestamp}`);

    // 3. Initiate STK Push
    const response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline", // Use 'CustomerBuyGoodsOnline' for Till
          Amount: amount,
          PartyA: phone,
          PartyB: shortCode,
          PhoneNumber: phone,
          CallBackURL: `https://cccevikzhxeyxsjvomzg.functions.supabase.co/callback`,
          AccountReference: "CbSiSafaris",
          TransactionDesc: "Safari Donation",
        }),
      }
    );

    const data = await response.json();

    // 4. Log to Supabase
    await supabase.from("donations").insert([
      {
        phone,
        amount,
        status: data.ResponseCode === "0" ? "initiated" : "failed",
        checkout_request_id: data.CheckoutRequestID,
      },
    ]);

    // Return Success with CORS headers
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    // Return Error with CORS headers
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});