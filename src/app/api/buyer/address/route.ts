import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return Response.json({ error: "No autorizado" }, { status: 401 });
        }

        const direcciones = await prisma.direccion.findMany({
            where: { compradorId: userId },
            orderBy: {
                esPrincipal: 'desc'
            }
        });

        return Response.json({ success: true, direcciones });
    } catch (error) {
        console.error("Error al obtener las direcciones:", error);
        return Response.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return Response.json({ error: "No autorizado" }, { status: 401 });
        }

        const body = await request.json();
        const { calle, altura, ciudad, cp } = body;

        if (!calle || !altura || !ciudad || !cp) {
            return Response.json({ error: "Faltan datos obligatorios (calle, altura, ciudad, cp)" }, { status: 400 });
        }

        // Verificar si el usuario ya tiene direcciones guardadas
        const count = await prisma.direccion.count({
            where: { compradorId: userId }
        });

        // Si es la primera dirección (count === 0), la guardamos como principal por defecto
        const esPrincipal = count === 0;

        const nuevaDireccion = await prisma.direccion.create({
            data: {
                compradorId: userId,
                calle,
                altura,
                ciudad,
                cp,
                esPrincipal
            }
        });

        return Response.json({ success: true, direccion: nuevaDireccion }, { status: 201 });
    } catch (error) {
        console.error("Error al crear la dirección:", error);
        return Response.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return Response.json({ error: "No autorizado" }, { status: 401 });
        }

        const body = await request.json();
        const { id, calle, altura, ciudad, cp, esPrincipal } = body;

        if (!id) {
            return Response.json({ error: "Falta el ID de la dirección" }, { status: 400 });
        }

        const existing = await prisma.direccion.findUnique({
            where: { id }
        });

        if (!existing || existing.compradorId !== userId) {
            return Response.json({ error: "Dirección no encontrada o no autorizada" }, { status: 404 });
        }

        if (esPrincipal === true) {
            // Si se marca como principal, las demás del usuario deben dejar de serlo
            await prisma.$transaction([
                prisma.direccion.updateMany({
                    where: { compradorId: userId },
                    data: { esPrincipal: false }
                }),
                prisma.direccion.update({
                    where: { id },
                    data: { calle, altura, ciudad, cp, esPrincipal: true }
                })
            ]);
        } else {
            await prisma.direccion.update({
                where: { id },
                data: { calle, altura, ciudad, cp, esPrincipal }
            });
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error("Error al actualizar la dirección:", error);
        return Response.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return Response.json({ error: "No autorizado" }, { status: 401 });
        }

        const url = new URL(request.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return Response.json({ error: "Falta el ID de la dirección" }, { status: 400 });
        }

        const existing = await prisma.direccion.findUnique({
            where: { id }
        });

        if (!existing || existing.compradorId !== userId) {
            return Response.json({ error: "Dirección no encontrada o no autorizada" }, { status: 404 });
        }

        await prisma.direccion.delete({
            where: { id }
        });

        // Si se eliminó la dirección principal, asignar la siguiente como principal automáticamente (si existe alguna)
        if (existing.esPrincipal) {
            const firstRemaining = await prisma.direccion.findFirst({
                where: { compradorId: userId }
            });

            if (firstRemaining) {
                await prisma.direccion.update({
                    where: { id: firstRemaining.id },
                    data: { esPrincipal: true }
                });
            }
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error("Error al eliminar la dirección:", error);
        return Response.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

