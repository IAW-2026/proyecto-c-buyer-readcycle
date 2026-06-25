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

    const email = user.emailAddresses[0]?.emailAddress ?? "";

    if (!email) {
      return Response.json(
        { error: "El usuario no tiene una dirección de correo electrónico válida" },
        { status: 400 }
      );
    }

    // Verificar si ya existe por ID de Clerk
    const compradorExistentePorId =
      await prisma.comprador.findUnique({
        where: {
          id: userId
        }
      });

    // Si ya existe por ID, no hacer nada
    if (compradorExistentePorId) {
      return Response.json({
        success: true,
        comprador: compradorExistentePorId
      });
    }

    // Si no existe por ID, verificar si ya existe un registro con el mismo email (cambio de instancia de Clerk)
    const compradorExistentePorEmail = await prisma.comprador.findUnique({
      where: { email }
    });

    if (compradorExistentePorEmail) {
      // Actualizar el ID (Clerk ID) del comprador existente para conservar su historial de compras, carritos, etc.
      const compradorActualizado = await prisma.comprador.update({
        where: { email },
        data: {
          id: userId,
          name: user.firstName ?? compradorExistentePorEmail.name,
          surname: user.lastName ?? compradorExistentePorEmail.surname,
        }
      });

      return Response.json({
        success: true,
        comprador: compradorActualizado
      });
    }

    // Crear comprador si no existe por ID ni por email
    const comprador =
      await prisma.comprador.create({
        data: {
          id: userId,
          name: user.firstName ?? "",
          surname: user.lastName ?? "",
          email,
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