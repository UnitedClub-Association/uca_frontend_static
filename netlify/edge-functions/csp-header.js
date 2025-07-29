export default async (request, context) => {
  // Get the response from the server
  const response = await context.next();

  // The correct Content Security Policy
  const csp = "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://cdnjs.cloudflare.com https://unpkg.com; connect-src 'self' https://www.google-analytics.com https://uzgxluiqyovpkyjpqles.supabase.co; object-src 'none';";

  // Set the CSP header on the response
  response.headers.set("Content-Security-Policy", csp);

  return response;
};