import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {

    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Obtener usuario de Clerk
    const user = await currentUser();

    if (!user) {
      return Response.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Verificar si ya existe
    const compradorExistente =
      await prisma.comprador.findUnique({
        where: {
          id: userId
        }
      });

    // Si ya existe no hacer nada
    if (compradorExistente) {
      return Response.json({
        success: true,
        comprador: compradorExistente
      });
    }

    // Crear comprador
    const comprador =
      await prisma.comprador.create({
        data: {
          id: userId,
          name: user.firstName ?? "",
          surname: user.lastName ?? "",
          email:
            user.emailAddresses[0]
              ?.emailAddress ?? "",
        }
      });

    return Response.json({
      success: true,
      comprador
    });

  } catch (error) {

    console.error(
      "Error al sincronizar comprador:",
      error
    );

    return Response.json(
      {
        error: "Error interno del servidor"
      },
      {
        status: 500
      }
    );
  }
}