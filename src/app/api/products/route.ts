import { getProducts } from "@/lib/products";

export async function GET() {
  try {
    const products = await getProducts();
    return Response.json(products);
  } catch (error) {
    console.error("Error in local products API route:", error);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
