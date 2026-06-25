import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { getProducts } from '@/lib/products';
import { mockProducts } from '@/lib/mockProducts';

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

        const products = await getProducts();
        const newProduct = products.find(p => p.id === productId);
        if (!newProduct) {
            return Response.json({ error: "Producto no encontrado" }, { status: 404 });
        }

        let carrito = await prisma.carrito.findFirst({
            where: { compradorId: userId },
            include: { items: true }
        });

        if (carrito && carrito.items.length > 0) {
            console.log(`[Cart POST] Checking seller mismatch. Cart has ${carrito.items.length} items. Adding productId: ${productId} (sellerId: ${newProduct.sellerId})`);
            for (const item of carrito.items) {
                const existingProduct = products.find(p => p.id === item.productId) || mockProducts.find(p => p.id === item.productId);
                if (existingProduct) {
                    console.log(`[Cart POST] Comparing with existing item ${item.productId} (sellerId: ${existingProduct.sellerId})`);
                    if (existingProduct.sellerId !== newProduct.sellerId) {
                        console.log(`[Cart POST] Mismatch found! Rejecting request.`);
                        return Response.json({
                            error: "seller_mismatch",
                            message: "No puedes agregar productos de diferentes vendedores al carrito."
                        }, { status: 400 });
                    }
                } else {
                    console.log(`[Cart POST] Warning: Existing cart item ${item.productId} not found in products list or mockProducts.`);
                }
            }
        }

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
