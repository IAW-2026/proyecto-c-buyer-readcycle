import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return Response.json({ role: "BUYER" });
        }

        const user = await prisma.comprador.findUnique({
            where: { id: userId },
            select: { rol: true }
        });

        return Response.json({ role: user?.rol || "BUYER" });
    } catch (error) {
        console.error("Error fetching user role:", error);
        return Response.json({ role: "BUYER" });
    }
}
