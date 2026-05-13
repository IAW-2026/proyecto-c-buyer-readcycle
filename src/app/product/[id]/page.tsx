import { Box, Button, Container } from "@chakra-ui/react";
import ProductDetails from "@/components/product/ProductDetails";
import SellerProducts from "@/components/product/SellerProducts";
import { LuArrowLeft } from "react-icons/lu";
import NextLink from "next/link"

const mockProduct = {
  id: "1",
  title: "El Aleph",
  author: "Jorge Luis Borges",
  description: "Una de las obras maestras de la literatura en español. Este libro reúne cuentos inmortales donde Borges explora laberintos, bibliotecas infinitas, espejos y la esencia misma del tiempo y el universo. Un ejemplar imprescindible para cualquier coleccionista o amante de la buena lectura. El estado de conservación es óptimo, con páginas limpias y encuadernación firme.",
  price: "$18.500",
  status: "EXCELENTE" as const,
  image: "/images/book-1.jpg",
  stock: 0,
  sellerName: "Librería Ateneo",
};

const sellerBooks = [
  {
    title: "Cien años de soledad",
    author: "Gabriel García Márquez",
    price: "$15.200",
    status: "BUEN ESTADO" as const,
    image: "/images/book-2.jpg",
    stock: 2,
  },
  {
    title: "Rayuela",
    author: "Julio Cortázar",
    price: "$21.000",
    status: "EXCELENTE" as const,
    image: "/images/book-3.jpg",
    stock: 0,
  },
  {
    title: "Ficciones",
    author: "Jorge Luis Borges",
    price: "$12.400",
    status: "BUEN ESTADO" as const,
    image: "/images/book-4.jpg",
    stock: 10,
  },
];

export default function ProductPage() {
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
          image={mockProduct.image}
          title={mockProduct.title}
          author={mockProduct.author}
          description={mockProduct.description}
          price={mockProduct.price}
          status={mockProduct.status}
          stock={mockProduct.stock}
        />

        {/* Componente de Productos del Vendedor */}
        <SellerProducts books={sellerBooks} sellerName={mockProduct.sellerName} />
      </Container>
    </Box>
  );
}
