import { Product, mockProducts } from "./mockProducts";

export async function getProducts(): Promise<Product[]> {
  try {
    const baseUrl = process.env.SELLER_API_URL || "https://proyecto-c-seller-readcycle.vercel.app";
    const cleanedUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const url = `${cleanedUrl}/api/public/products`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (process.env.SELLER_API_KEY) {
      headers["X-API-Key"] = process.env.SELLER_API_KEY;
    }

    const response = await fetch(url, {
      headers,
      cache: "no-store", // Get fresh data each time to keep stock values updated
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as Product[];
    
    // Validate we got an array
    if (Array.isArray(data)) {
      // Fetch seller info for each unique sellerId in parallel
      const uniqueSellerIds = Array.from(
        new Set(data.map((p) => p.sellerId).filter(Boolean))
      );

      const sellerDetailsPromises = uniqueSellerIds.map(async (sellerId) => {
        try {
          const sellerUrl = `${cleanedUrl}/api/public/buyer/sellers/${sellerId}`;
          const sellerResponse = await fetch(sellerUrl, {
            headers,
            cache: "no-store",
          });
          if (!sellerResponse.ok) {
            throw new Error(`Failed to fetch seller ${sellerId}: ${sellerResponse.status}`);
          }
          return (await sellerResponse.json()) as {
            id: string;
            name: string;
            surname: string;
            email: string;
          };
        } catch (err) {
          console.error(`Error fetching details for seller ${sellerId}:`, err);
          return null;
        }
      });

      const sellersList = await Promise.all(sellerDetailsPromises);
      const sellersMap = new Map(
        sellersList.filter((s): s is NonNullable<typeof s> => s !== null).map((s) => [s.id, s])
      );

      // Populate seller details on the products list
      const populatedProducts = data.map((product) => {
        const sellerInfo = sellersMap.get(product.sellerId);
        return {
          ...product,
          seller: {
            id: product.sellerId,
            name: sellerInfo?.name || product.seller?.name,
            surname: sellerInfo?.surname || product.seller?.surname,
            email: sellerInfo?.email || product.seller?.email,
          },
        };
      });

      return populatedProducts;
    }
    
    throw new Error("API did not return an array of products");
  } catch (error) {
    console.error("Error fetching products from API, falling back to mock products:", error);
    return mockProducts;
  }
}
