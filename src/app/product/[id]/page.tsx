import { Box, Button, Container } from "@chakra-ui/react";
import ProductDetails from "@/components/product/ProductDetails";
import SellerProducts from "@/components/product/SellerProducts";
import { LuArrowLeft } from "react-icons/lu";
import NextLink from "next/link";
import { getProducts } from "@/lib/products";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  
  const products = await getProducts();
  
  // Buscamos el producto en base al ID de la ruta
  const product = products.find((p) => p.id === id);
  
  if (!product) {
    notFound();
  }

  const sellerFullName = product.seller?.name 
    ? `${product.seller.name} ${product.seller.surname || ""}`.trim() 
    : `Vendedor #${product.seller?.id?.slice(-4) || "Desconocido"}`;

  // Mapeamos los datos del producto al formato del componente ProductDetails
  const image = product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url || "/images/placeholder.jpg";
  const title = product.title;
  const author = sellerFullName;
  const description = product.description;
  const price = `$${product.price.toLocaleString("es-AR")}`;
  const categoryName = product.category.name;
  const stock = product.stock;
  const sellerName = sellerFullName;

  // Obtenemos los demás productos del mismo vendedor (excluyendo el actual)
  const sellerBooks = products.filter((p) => p.seller?.id === product.seller?.id && p.id !== product.id);

  return (
    <Box bg="brand.beige" minH="100vh" pt={2} pb={8}>
      <Container maxW="8xl">
        <NextLink href="/" passHref>
          <Button
            variant="ghost"
            color="brand.forest"
            _hover={{ bg: "brand.sand" }}
            fontWeight="semibold"
            mb={2}
          >
            <LuArrowLeft /> Seguir comprando
          </Button>
        </NextLink>
        {/* Componente de Detalles del Producto */}
        <ProductDetails
          productId={product.id}
          image={image}
          title={title}
          author={author}
          description={description}
          price={price}
          categoryName={categoryName}
          stock={stock}
        />

        {/* Componente de Productos del Vendedor */}
        <SellerProducts books={sellerBooks} sellerName={sellerName} />
      </Container>
    </Box>
  );
}

