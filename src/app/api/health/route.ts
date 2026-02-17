// Health check endpoint - keep container warm
export async function GET() {
  return Response.json({ status: 'ok', timestamp: Date.now() });
}
