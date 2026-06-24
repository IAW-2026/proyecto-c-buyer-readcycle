import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const orderIdParam = searchParams.get("id");

        const sellerApiUrl = process.env.SELLER_API_URL || "https://proyecto-c-seller-readcycle.vercel.app/";
        const apiKey = process.env.SELLER_API_KEY || "apitoken_readcycle_2026";
        const url = `${sellerApiUrl.replace(/\/$/, "")}/api/public/buyer/orders/${userId}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "X-API-Key": `${apiKey}`,
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Error calling seller orders API:", res.status, errorText);
            return NextResponse.json(
                { error: "Error al obtener las órdenes desde la Seller API", details: errorText },
                { status: res.status }
            );
        }

        const orders = await res.json();

        // Obtener la dirección principal del comprador para inyectarla como fallback
        const direccion = await prisma.direccion.findFirst({
            where: { compradorId: userId, esPrincipal: true }
        }) || await prisma.direccion.findFirst({
            where: { compradorId: userId }
        });

        const addressFallback = {
            calle: direccion?.calle || "Dirección no registrada",
            altura: direccion?.altura || "",
            ciudad: direccion?.ciudad || "",
            cp: direccion?.cp || ""
        };

        // Formatear y mapear órdenes
        const mappedOrders = orders.map((order: any) => {
            const mappedItems = (order.items || []).map((item: any) => {
                const product = item.product || {};
                const images = product.images || [];
                const primaryImage = images.find((img: any) => img.isPrimary)?.url || images[0]?.url || "/images/placeholder.jpg";
                
                return {
                    id: item.productId,
                    title: product.title || "Libro",
                    author: product.author || "Autor desconocido",
                    price: item.price,
                    image: primaryImage,
                    quantity: item.quantity
                };
            });

            const subtotal = mappedItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

            // Formatear fecha
            const dateObj = new Date(order.createdAt);
            const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            const formattedDate = `${dateObj.getDate()} de ${months[dateObj.getMonth()]}, ${dateObj.getFullYear()}`;

            // Mapear estados
            let status = "Pendiente";
            if (order.shippingStatus === "DELIVERED") {
                status = "Entregado";
            } else if (order.shippingStatus === "SHIPPED") {
                status = "En camino";
            }

            let paymentStatusLabel = "Pendiente";
            if (order.paymentStatus === "PAID") {
                paymentStatusLabel = "Pagado";
            } else if (order.paymentStatus === "REJECTED") {
                paymentStatusLabel = "Rechazado";
            }

            let shippingStatusLabel = "Pendiente";
            if (order.shippingStatus === "DELIVERED") {
                shippingStatusLabel = "Entregado";
            } else if (order.shippingStatus === "SHIPPED") {
                shippingStatusLabel = "Despachado";
            } else if (order.paymentStatus === "PAID") {
                shippingStatusLabel = "Preparando pedido";
            }

            return {
                id: order.id,
                date: formattedDate,
                status, // "Entregado" | "En camino" | "Pendiente"
                paymentStatus: paymentStatusLabel, // "Pagado" | "Pendiente" | "Rechazado"
                shippingStatus: shippingStatusLabel, // "Entregado" | "Despachado" | "Preparando pedido" | "Pendiente"
                total: order.total,
                shippingCost: order.shippingCost,
                subtotal: subtotal,
                shippingAddress: addressFallback,
                items: mappedItems
            };
        });

        // Si se solicita una orden específica por ID
        if (orderIdParam) {
            const specificOrder = mappedOrders.find((o: any) => o.id === orderIdParam);
            if (!specificOrder) {
                return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
            }
            return NextResponse.json(specificOrder);
        }

        // Ordenar órdenes por fecha de creación descendente (más nuevas primero)
        const sortedMappedOrders = [...mappedOrders].sort((a: any, b: any) => {
            const origA = orders.find((o: any) => o.id === a.id);
            const origB = orders.find((o: any) => o.id === b.id);
            return new Date(origB?.createdAt || 0).getTime() - new Date(origA?.createdAt || 0).getTime();
        });

        return NextResponse.json(sortedMappedOrders);

    } catch (error: any) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: "Error interno del servidor al obtener las órdenes." },
            { status: 500 }
        );
    }
}

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
