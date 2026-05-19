import { auth, clerkClient } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

async function checkIsAdmin(userId: string | null) {
    if (!userId) return false;
    const user = await prisma.comprador.findUnique({
        where: { id: userId },
        select: { rol: true }
    });
    return user?.rol === 'admin';
}
export async function GET() {
    try {
        const { userId } = await auth();
        const isAdmin = await checkIsAdmin(userId);
        if (!isAdmin) {
            return Response.json({ error: "No autorizado" }, { status: 401 });
        }
        const users = await prisma.comprador.findMany({
            orderBy: { name: 'asc' }
        });
        return Response.json({ success: true, users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return Response.json({ error: "Error interno" }, { status: 500 });
    }
}
export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const isAdmin = await checkIsAdmin(userId);
        if (!isAdmin) {
            return Response.json({ error: "No autorizado" }, { status: 401 });
        }
        const body = await req.json();
        const { name, surname, email, password, rol } = body;

        if (!name || !email || !password) {
            return Response.json({ error: "Faltan datos requeridos" }, { status: 400 });
        }

        const client = await clerkClient();
        const newClerkUser = await client.users.createUser({
            firstName: name,
            lastName: surname || "",
            emailAddress: [email],
            password: password,
            skipPasswordRequirement: false
        });

        const id = newClerkUser.id;

        const newUser = await prisma.comprador.create({
            data: {
                id,
                name,
                surname: surname || "",
                email,
                rol: rol || "comprador"
            }
        });
        return Response.json({ success: true, user: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        return Response.json({ error: "Error al crear usuario" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { userId } = await auth();
        const isAdmin = await checkIsAdmin(userId);
        if (!isAdmin) {
            return Response.json({ error: "No autorizado" }, { status: 401 });
        }

        const body = await req.json();
        const { id, name, surname, email, rol } = body;

        if (!id) {
            return Response.json({ error: "ID de usuario es requerido" }, { status: 400 });
        }

        const updatedUser = await prisma.comprador.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(surname !== undefined && { surname }),
                ...(email && { email }),
                ...(rol && { rol })
            }
        });
        return Response.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        return Response.json({ error: "Error al actualizar usuario" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { userId } = await auth();
        const isAdmin = await checkIsAdmin(userId);
        if (!isAdmin) {
            return Response.json({ error: "No autorizado" }, { status: 401 });
        }

        const id = req.nextUrl.searchParams.get("id");
        if (!id) {
            return Response.json({ error: "ID de usuario es requerido" }, { status: 400 });
        }

        if (id === userId) {
            return Response.json({ error: "No puedes eliminarte a ti mismo" }, { status: 400 });
        }

        await prisma.comprador.delete({
            where: { id }
        });
        return Response.json({ success: true });
    } catch (error) {
        console.error("Error deleting user:", error);
        return Response.json({ error: "Error al eliminar usuario" }, { status: 500 });
    }
}
