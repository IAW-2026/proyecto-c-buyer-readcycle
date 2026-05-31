import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
  '/product(.*)',
  '/api/auth/role'
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      await auth.protect();
      return;
    }

    try {
      // Obtener el rol del usuario desde el endpoint de autenticación interno
      const roleResponse = await fetch(new URL("/api/auth/role", req.url), {
        headers: {
          cookie: req.headers.get("cookie") || ""
        }
      });
      const data = await roleResponse.json();

      if (data.role !== "admin") {
        // Redirigir al home si no es administrador
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (error) {
      console.error("Error verificando rol en middleware:", error);
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // 1. Atrapa todas las rutas de la app, excepto archivos estáticos
    '/((?!_next|[^?]*\\.[0-9a-z]+$).*)',
    // 2. Fuerza a que siempre se ejecute para las APIs internas
    '/(api|trpc)(.*)',
  ],
};