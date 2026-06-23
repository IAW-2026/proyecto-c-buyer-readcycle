import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const sellerApiUrl = process.env.SELLER_API_URL || "https://proyecto-c-seller-readcycle.vercel.app/";
        const apiKey = process.env.SELLER_API_KEY || "apitoken_readcycle_2026";
        const url = `${sellerApiUrl.replace(/\/$/, "")}/api/orders`;

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": `${apiKey}`,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Error calling seller orders API:", res.status, errorText);
            try {
                const errorJson = JSON.parse(errorText);
                return NextResponse.json(errorJson, { status: res.status });
            } catch {
                return NextResponse.json(
                    { error: "Error al crear la orden en el vendedor", details: errorText },
                    { status: res.status }
                );
            }
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Error proxying order creation:", error);
        return NextResponse.json(
            { error: "Error interno del servidor al crear la orden." },
            { status: 500 }
        );
    }
}
