import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // 1. Atrapa todas las rutas de la app, excepto archivos estáticos
    '/((?!_next|[^?]*\\.[0-9a-z]+$).*)',
    // 2. Fuerza a que siempre se ejecute para las APIs internas
    '/(api|trpc)(.*)',
  ],
};