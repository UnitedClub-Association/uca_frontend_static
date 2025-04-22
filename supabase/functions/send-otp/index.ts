import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts' // Ensure this file exists and is correct

// --- FIX: Access the secret using its name ---
// Make sure you set the secret in Supabase using:
// supabase secrets set RESEND_API_KEY your_actual_resend_api_key
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
// --- END FIX ---

const RESEND_API_URL = 'https://api.resend.com/emails'

console.log('send-otp function booting up...')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Received request:', req.method);
    const { email, otp } = await req.json()
    console.log(`Parsed request: email=${email}, otp=${otp}`);

    if (!email || !otp) {
      throw new Error('Missing email or otp in request body')
    }
    // --- FIX: Check if the key was actually retrieved ---
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY secret is not set or accessible!');
      throw new Error('Server configuration error: Missing email API key.')
    }
    // --- END FIX ---

    // Prepare email data
    const emailData = {
      // IMPORTANT: Resend might require a verified domain you own.
      // Sending from @gmail.com might fail or go to spam.
      // Check your Resend account settings.
      from: 'UCA Verification <onboarding@resend.dev>', // Default Resend address, CHANGE if you have a verified domain
      to: [email],
      subject: 'Your UCA Verification Code',
      html: `
        <h1>Your Verification Code</h1>
        <p>Thank you for registering/logging in to the United Club Association.</p>
        <p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p>
        <p>This code is valid for a short time. If you did not request this, please ignore this email.</p>
      `,
    };
    console.log('Prepared email data for Resend');

    // Send the email using Resend API
    console.log('Sending email via Resend...');
    const resendResponse = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        // It's often good practice to include CORS headers on the actual response too,
        // but they are primarily for the browser's preflight check.
        // Let's keep the shared corsHeaders for the response below.
      },
      body: JSON.stringify(emailData),
    })

    const resendResult = await resendResponse.json()

    if (!resendResponse.ok) {
      console.error('Resend API Error Response:', resendResult);
      const errorMessage = resendResult?.message || resendResult?.error?.message || 'Unknown Resend API error';
      throw new Error(`Failed to send email via Resend: ${errorMessage} (Status: ${resendResponse.status})`)
    }

    console.log(`Email sent successfully to ${email} via Resend. ID: ${resendResult.id}`);

    // Return success response
    return new Response(JSON.stringify({ success: true, message: 'OTP email sent successfully.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error processing request in send-otp function:', error);
    // Return error response
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: error.message.includes('Server configuration error') ? 500 : (error.message.includes('Missing email or otp') ? 400 : 500), // Adjust status based on error
    })
  }
})

console.log('send-otp function listener started.');
