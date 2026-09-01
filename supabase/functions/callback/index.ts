// Use the modern Deno.serve approach
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  // 1. Only allow POST requests (Safaricom sends POST)
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const callbackData = await req.json();
    console.log("Received M-Pesa Callback:", JSON.stringify(callbackData));

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callbackData.Body.stkCallback;

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 2. Extract metadata if transaction was successful
    let mpesa_receipt = null;
    if (ResultCode === 0 && CallbackMetadata) {
      const items = CallbackMetadata.Item;
      mpesa_receipt = items.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value;
    }

    // 3. Update the database
    const { error } = await supabase
      .from("donations")
      .update({
        status: ResultCode === 0 ? "success" : "failed",
        result_desc: ResultDesc,
        mpesa_receipt_number: mpesa_receipt, // Save the receipt if you have this column
        updated_at: new Date().toISOString(),
      })
      .eq("checkout_request_id", CheckoutRequestID);

    if (error) {
      console.error("Database Update Error:", error);
      throw error;
    }

    // 4. Safaricom expects a success response regardless of ResultCode
    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Success" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Callback Processing Failed:", err.message);
    // Even on error, return 200 to Safaricom to stop retries, or 400 if you want them to retry
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
});