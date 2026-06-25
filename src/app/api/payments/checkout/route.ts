import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // El api key de pagos y la URL del microservicio están en las variables de entorno
    const paymentsApiUrl = process.env.PAYMENTS_API_URL;
    const paymentsApiKey = process.env.PAYMENTS_API_KEY;

    if (!paymentsApiUrl || !paymentsApiKey) {
      return NextResponse.json(
        { error: "La configuración del servicio de pagos no está disponible en las variables de entorno." },
        { status: 500 }
      );
    }

    // Asegurar que successUrl y failureUrl usen https (requerido por Mercado Pago)
    let successUrl = body.successUrl || "";
    let failureUrl = body.failureUrl || "";

    if (successUrl.startsWith("http://")) {
      successUrl = successUrl.replace("http://", "https://");
    }
    if (failureUrl.startsWith("http://")) {
      failureUrl = failureUrl.replace("http://", "https://");
    }

    const payload = {
      ...body,
      successUrl,
      failureUrl,
    };

    // Hacer la petición al microservicio de pagos externo
    const res = await fetch(`${paymentsApiUrl.replace(/\/$/, '')}/api/payments/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': `${paymentsApiKey}`,
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: errorData.error || 'Error al crear la preferencia en el servicio de pagos',
          details: errorData.details || null
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error en local payments proxy route:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar el checkout." },
      { status: 500 }
    );
  }
}
