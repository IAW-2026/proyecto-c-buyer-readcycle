import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { getProducts } from '@/lib/products';

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const shippingMethod = body.shippingMethod || "domicilio";
        const { userId } = await auth();

        if (!userId) {
            return Response.json({ error: "No autorizado" }, { status: 401 });
        }

        // Obtener el carrito del comprador
        const carrito = await prisma.carrito.findFirst({
            where: { compradorId: userId },
            include: {
                items: true,
            }
        });

        if (!carrito || !carrito.items || carrito.items.length === 0) {
            return Response.json({ error: "El carrito está vacío" }, { status: 400 });
        }

        // Obtener la dirección principal del comprador
        const direccion = await prisma.direccion.findFirst({
            where: { compradorId: userId, esPrincipal: true }
        }) || await prisma.direccion.findFirst({
            where: { compradorId: userId }
        });

        if (!direccion) {
            return Response.json({ error: "Debes registrar una dirección en tu perfil antes de comprar" }, { status: 400 });
        }

        const shippingAddress = {
            calle: direccion.calle,
            altura: direccion.altura,
            ciudad: direccion.ciudad,
            cp: direccion.cp
        };

        // Mapear los items y calcular totales
        const products = await getProducts();
        const items = carrito.items.map((item) => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return null;

            const sellerName = product.seller?.name
                ? `${product.seller.name} ${product.seller.surname || ""}`.trim()
                : `Vendedor #${product.seller?.id?.slice(-4) || "Desconocido"}`;

            return {
                id: item.productId,
                title: product.title,
                author: sellerName,
                price: product.price,
                image: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || "/images/placeholder.jpg",
                quantity: item.cantidad,
                weight: product.weight || 0.4
            };
        }).filter(Boolean) as Array<{
            id: string;
            title: string;
            author: string;
            price: number;
            image: string;
            quantity: number;
            weight?: number;
        }>;

        if (items.length === 0) {
            return Response.json({ error: "Los productos en tu carrito no son válidos" }, { status: 400 });
        }

        const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        let shippingCost = 0;
        if (subtotal < 50000) {
            try {
                const totalWeight = items.reduce((acc, item) => acc + ((item.weight || 0.4) * item.quantity), 0);
                const sellerId = products.find(p => p.id === items[0].id)?.sellerId || "mock_seller_id";
                const destinationZipCode = direccion.cp.toString();

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
                        totalWeight: parseFloat(totalWeight.toFixed(2))
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    shippingCost = data.cost;
                } else {
                    console.error("Error response from shipping calculate API:", res.status);
                    shippingCost = 1500; // Fallback
                }
            } catch (error) {
                console.error("Error al calcular envio en checkout:", error);
                shippingCost = 1500; // Fallback
            }
        }
        const total = subtotal + shippingCost;

        // Borrar todos los items del carrito (vaciado del carrito)
        await prisma.itemCarrito.deleteMany({
            where: { carritoId: carrito.id }
        });

        // Generar un ID de orden aleatorio
        const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

        // Formatear fecha
        const now = new Date();
        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const formattedDate = `${now.getDate()} de ${months[now.getMonth()]}, ${now.getFullYear()}`;

        const simulatedOrder = {
            id: orderId,
            date: formattedDate,
            status: "Pendiente",
            paymentStatus: "Pagado",
            shippingStatus: "Preparando pedido",
            subtotal,
            shippingCost,
            total,
            shippingAddress,
            items
        };

        return Response.json({
            success: true,
            order: simulatedOrder
        });
    } catch (error) {
        console.error("Error al procesar el checkout:", error);
        return Response.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
