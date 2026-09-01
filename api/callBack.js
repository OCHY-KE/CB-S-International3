// api/callback.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body.Body.stkCallback;
    
    console.log('M-Pesa Callback Received:', JSON.stringify(data, null, 2));

    if (data.ResultCode === 0) {
      // SUCCESS: User entered PIN
      // You can send an email here or update a database
      console.log('Payment Successful');
    } else {
      // FAILURE: User cancelled or insufficient funds
      console.log('Payment Failed:', data.ResultDesc);
    }

    res.status(200).json({ ResultCode: 0, ResultDesc: "Success" });
  } else {
    res.status(405).send('Method Not Allowed');
  }
}