import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return Response.json({ error: "No autorizado" }, { status: 401 });
        }

        let carrito = await prisma.carrito.findFirst({
            where: { compradorId: userId },
            include: {
                items: true,
            }
        });

        if (!carrito) {
            // Verificar si el Comprador existe antes de intentar crearle un carrito
            const comprador = await prisma.comprador.findUnique({
                where: { id: userId }
            });

            if (comprador) {
                carrito = await prisma.carrito.create({
                    data: {
                        compradorId: userId,
                    },
                    include: {
                        items: true,
                    }
                });
            }
        }

        return Response.json({ success: true, carrito });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        return Response.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return Response.json({ error: "No autorizado" }, { status: 401 });

        const body = await req.json();
        const { productId, cantidad } = body;

        if (!productId || typeof cantidad !== 'number' || cantidad <= 0) {
            return Response.json({ error: "Datos inválidos" }, { status: 400 });
        }

        let carrito = await prisma.carrito.findFirst({
            where: { compradorId: userId },
            include: { items: true }
        });

        if (!carrito) {
            const comprador = await prisma.comprador.findUnique({ where: { id: userId } });
            if (!comprador) return Response.json({ error: "Comprador no encontrado" }, { status: 404 });
            
            carrito = await prisma.carrito.create({
                data: { compradorId: userId },
                include: { items: true }
            });
        }

        const existingItem = carrito.items.find(item => item.productId === productId);

        if (existingItem) {
            await prisma.itemCarrito.update({
                where: { id: existingItem.id },
                data: { cantidad: existingItem.cantidad + cantidad }
            });
        } else {
            await prisma.itemCarrito.create({
                data: {
                    carritoId: carrito.id,
                    productId,
                    cantidad
                }
            });
        }

        const updatedCart = await prisma.carrito.findFirst({
            where: { id: carrito.id },
            include: { items: true }
        });

        return Response.json({ success: true, carrito: updatedCart });
    } catch (error) {
        console.error("Error al agregar al carrito:", error);
        return Response.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return Response.json({ error: "No autorizado" }, { status: 401 });

        const body = await req.json();
        const { productId, cantidad } = body;

        if (!productId || typeof cantidad !== 'number' || cantidad < 0) {
            return Response.json({ error: "Datos inválidos" }, { status: 400 });
        }

        const carrito = await prisma.carrito.findFirst({
            where: { compradorId: userId },
            include: { items: true }
        });

        if (!carrito) return Response.json({ error: "Carrito no encontrado" }, { status: 404 });

        const existingItem = carrito.items.find(item => item.productId === productId);
        if (!existingItem) return Response.json({ error: "Ítem no encontrado en el carrito" }, { status: 404 });

        if (cantidad === 0) {
            await prisma.itemCarrito.delete({
                where: { id: existingItem.id }
            });
        } else {
            await prisma.itemCarrito.update({
                where: { id: existingItem.id },
                data: { cantidad }
            });
        }

        const updatedCart = await prisma.carrito.findFirst({
            where: { id: carrito.id },
            include: { items: true }
        });

        return Response.json({ success: true, carrito: updatedCart });
    } catch (error) {
        console.error("Error al actualizar el carrito:", error);
        return Response.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return Response.json({ error: "No autorizado" }, { status: 401 });

        let productId;
        try {
            const body = await req.json();
            productId = body.productId;
        } catch {
            const url = new URL(req.url);
            productId = url.searchParams.get("productId");
        }

        if (!productId) {
            return Response.json({ error: "Datos inválidos, se requiere productId" }, { status: 400 });
        }

        const carrito = await prisma.carrito.findFirst({
            where: { compradorId: userId },
            include: { items: true }
        });

        if (!carrito) return Response.json({ error: "Carrito no encontrado" }, { status: 404 });

        const existingItem = carrito.items.find(item => item.productId === productId);
        if (!existingItem) return Response.json({ error: "Ítem no encontrado en el carrito" }, { status: 404 });

        await prisma.itemCarrito.delete({
            where: { id: existingItem.id }
        });

        const updatedCart = await prisma.carrito.findFirst({
            where: { id: carrito.id },
            include: { items: true }
        });

        return Response.json({ success: true, carrito: updatedCart });
    } catch (error) {
        console.error("Error al eliminar del carrito:", error);
        return Response.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
