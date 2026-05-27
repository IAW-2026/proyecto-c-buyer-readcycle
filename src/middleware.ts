import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/', '/product(.*)', '/api/auth/role'])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
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