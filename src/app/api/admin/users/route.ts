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

        const client = await clerkClient();

        // 1. Obtener datos actuales del usuario en Clerk
        const clerkUser = await client.users.getUser(id);

        // 2. Actualizar nombre y apellido en Clerk si cambiaron
        const clerkUpdateParams: { firstName?: string; lastName?: string } = {};
        if (name) clerkUpdateParams.firstName = name;
        if (surname !== undefined) clerkUpdateParams.lastName = surname;

        if (Object.keys(clerkUpdateParams).length > 0) {
            await client.users.updateUser(id, clerkUpdateParams);
        }

        // 3. Actualizar email en Clerk si cambió
        if (email) {
            const primaryEmailObj = clerkUser.emailAddresses.find(
                (addr) => addr.id === clerkUser.primaryEmailAddressId
            );
            const currentEmail = primaryEmailObj?.emailAddress;

            if (currentEmail && email !== currentEmail) {
                // Crear el nuevo email en Clerk, marcarlo verificado y primario
                const newEmailObj = await client.emailAddresses.createEmailAddress({
                    userId: id,
                    emailAddress: email,
                    verified: true,
                    primary: true,
                });

                // Eliminar los emails antiguos
                for (const oldEmail of clerkUser.emailAddresses) {
                    if (oldEmail.id !== newEmailObj.id) {
                        try {
                            await client.emailAddresses.deleteEmailAddress(oldEmail.id);
                        } catch (delError) {
                            console.error(`Error deleting old email address ${oldEmail.id}:`, delError);
                        }
                    }
                }
            }
        }

        // 4. Actualizar base de datos
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
    } catch (error: any) {
        console.error("Error updating user:", error);
        return Response.json({ error: error.message || "Error al actualizar usuario" }, { status: 500 });
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

        const client = await clerkClient();

        // 1. Eliminar de Clerk
        try {
            await client.users.deleteUser(id);
        } catch (clerkError: any) {
            console.error("Error al eliminar usuario de Clerk:", clerkError);
            // Si el usuario no existe en Clerk (404 / resource_not_found), permitimos que continúe
            // para que se pueda limpiar la base de datos local y evitar bloquear al administrador.
            const isNotFoundError = clerkError.status === 404 || 
                                   (clerkError.errors && clerkError.errors.some((e: any) => e.code === 'resource_not_found'));
            if (!isNotFoundError) {
                throw clerkError;
            }
        }

        // 2. Eliminar de la base de datos
        await prisma.comprador.delete({
            where: { id }
        });
        return Response.json({ success: true });
    } catch (error: any) {
        console.error("Error deleting user:", error);
        return Response.json({ error: error.message || "Error al eliminar usuario" }, { status: 500 });
    }
}
