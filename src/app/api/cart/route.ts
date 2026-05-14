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
