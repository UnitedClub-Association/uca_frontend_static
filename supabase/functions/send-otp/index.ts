import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts' // We'll create this file next

// Make sure to set EMAIL_API_KEY using `supabase secrets set`
const RESEND_API_KEY = Deno.env.get('re_Zt9efjo9_rDw8R1AojszX23Mb5B7cD7XA')
const RESEND_API_URL = 'https://api.resend.com/emails'

console.log('send-otp function booting up...') // Add a log to confirm startup

serve(async (req) => {
  // Handle CORS preflight requests (important for browser calls)
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Received request:', req.method);
    // 1. Parse incoming request data (expecting JSON with email and otp)
    const { email, otp } = await req.json()
    console.log(`Parsed request: email=${email}, otp=${otp}`);

    if (!email || !otp) {
      throw new Error('Missing email or otp in request body')
    }
    if (!RESEND_API_KEY) {
      console.error('EMAIL_API_KEY secret is not set!');
      throw new Error('Server configuration error: Missing email API key.')
    }

    // 2. Prepare email data for Resend
    const emailData = {
      // Update the 'from' address here
      from: 'UCA Verification <ucoofficial2024@gmail.com>', // Using the provided Gmail address
      to: [email],
      subject: 'Your UCA Verification Code',
      html: `
        <h1>Your Verification Code</h1>
        <p>Thank you for registering/logging in to the United Club Association.</p>
        <p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p>
        <p>This code is valid for a short time. If you did not request this, please ignore this email.</p>
      `,
      // text: `Your UCA Verification Code is: ${otp}` // Optional plain text version
    };
    console.log('Prepared email data for Resend');

    // 3. Send the email using Resend API
    console.log('Sending email via Resend...');
    const resendResponse = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        ...corsHeaders // Include CORS headers in the actual request too
      },
      body: JSON.stringify(emailData),
    })

    const resendResult = await resendResponse.json()

    if (!resendResponse.ok) {
      console.error('Resend API Error Response:', resendResult);
      // Provide more specific error if possible
      const errorMessage = resendResult?.message || resendResult?.error?.message || 'Unknown Resend API error';
      throw new Error(`Failed to send email via Resend: ${errorMessage} (Status: ${resendResponse.status})`)
    }

    console.log(`Email sent successfully to ${email} via Resend. ID: ${resendResult.id}`);

    // 4. Return success response to the client
    return new Response(JSON.stringify({ success: true, message: 'OTP email sent successfully.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error processing request in send-otp function:', error);
    // 5. Return error response to the client
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      // Use 500 for server errors (like missing API key), 400 for client errors (like missing email/otp)
      status: error.message.includes('Server configuration error') ? 500 : 400,
    })
  }
})

console.log('send-otp function listener started.');
