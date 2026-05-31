import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { mockProducts } from '@/lib/mockProducts';

export async function POST() {
    try {
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

        const shippingAddress = direccion ? {
            calle: direccion.calle,
            altura: direccion.altura,
            ciudad: direccion.ciudad,
            cp: direccion.cp
        } : {
            calle: "Av. Rivadavia",
            altura: "4500",
            ciudad: "CABA",
            cp: "1408"
        };

        // Mapear los items y calcular totales
        const items = carrito.items.map((item) => {
            const product = mockProducts.find(p => p.id === item.productId);
            if (!product) return null;

            return {
                id: item.productId,
                title: product.title,
                author: `${product.seller.name} ${product.seller.surname}`,
                price: product.price,
                image: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || "/images/placeholder.jpg",
                quantity: item.cantidad
            };
        }).filter(Boolean) as Array<{
            id: string;
            title: string;
            author: string;
            price: number;
            image: string;
            quantity: number;
        }>;

        if (items.length === 0) {
            return Response.json({ error: "Los productos en tu carrito no son válidos" }, { status: 400 });
        }

        const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const shippingCost = subtotal < 50000 ? 15000 : 0; // Costo de envío base
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
