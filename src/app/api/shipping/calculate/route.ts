import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { sellerId, destinationZipCode, totalWeight } = body;

        const sellerApiUrl = process.env.SELLER_API_URL || "https://proyecto-c-seller-readcycle.vercel.app/";
        const apiKey = process.env.SELLER_API_KEY || "apitoken_readcycle_2026";
        const url = `${sellerApiUrl.replace(/\/$/, "")}/api/public/shipping/calculate`;

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                sellerId,
                destinationZipCode,
                totalWeight,
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Error calling seller shipping calculate:", res.status, errorText);
            return NextResponse.json({ error: "Error al calcular el envío en el vendedor" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Error proxying shipping calculation:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
