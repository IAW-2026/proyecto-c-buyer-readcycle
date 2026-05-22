export async function GET() {
  return Response.json({
    success: true,
    message: "API funcionando correctamente",
    timestamp: new Date().toISOString()
  })
}