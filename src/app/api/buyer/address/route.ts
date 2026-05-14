import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return Response.json({ error: "No autorizado" }, { status: 401 });
        }

        // Obtener todas las direcciones asociadas al comprador logueado
        const direcciones = await prisma.direccion.findMany({
            where: { compradorId: userId },
            orderBy: {
                esPrincipal: 'desc' // Primero la principal, si la hay
            }
        });

        return Response.json({ success: true, direcciones });
    } catch (error) {
        console.error("Error al obtener las direcciones:", error);
        return Response.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
