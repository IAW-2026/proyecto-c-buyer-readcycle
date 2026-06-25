// app/page.tsx

import { Box, Container, Grid } from "@chakra-ui/react";

import HeroBanner from "@/components/home/HeroBanner";
import BooksTabs from "@/components/home/Tabs";
import BookCard from "@/components/home/Card";
import Pagination from "@/components/home/Pagination";

import { getProducts } from "@/lib/products";

interface HomePageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

const normalizeText = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default async function HomePage({ searchParams }: HomePageProps) {
  const { category, search, page } = await searchParams;

  const selectedCategory = category || "Todos los libros";
  const currentPage = page ? parseInt(page, 10) : 1;
  const itemsPerPage = 8;

  const products = await getProducts();

  // 1. Filtrado inicial por categoría si no es "Todos los libros"
  let filteredProducts = selectedCategory !== "Todos los libros"
    ? products.filter(
      (product) =>
        product.category.name.toLowerCase() === selectedCategory.toLowerCase()
    )
    : products;

  // 2. Filtrado y ordenamiento con prioridades si hay búsqueda activa
  if (search && search.trim() !== "") {
    const query = normalizeText(search);

    const matched = filteredProducts
      .map((product) => {
        const titleMatch = normalizeText(product.title).includes(query);
        const authorMatch = normalizeText(product.author).includes(query);
        const categoryMatch = normalizeText(product.category.name).includes(query);

        let priority = 0;
        if (titleMatch) {
          priority = 1; // Prioridad 1: Título
        } else if (authorMatch) {
          priority = 2; // Prioridad 2: Autor
        } else if (categoryMatch) {
          priority = 3; // Prioridad 3: Categoría
        }

        return { product, priority };
      })
      .filter((item) => item.priority > 0); // Excluimos los que no coinciden

    // Ordenamos de menor a mayor prioridad (1, 2, 3)
    matched.sort((a, b) => a.priority - b.priority);

    filteredProducts = matched.map((item) => item.product);
  }

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  
  // Si la página solicitada está fuera de rango, podríamos ajustarla
  const activePage = Math.min(Math.max(1, currentPage), totalPages || 1);

  // Obtener los productos de la página actual
  const displayedProducts = filteredProducts.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  return (
    <Box bg="brand.beige" minH="100vh">
      <Container maxW="8xl">
        <HeroBanner />

        <BooksTabs selectedCategory={selectedCategory} products={products} />

        {/* Separador Estético */}
        <Box borderBottom="3px solid" borderColor="brand.sand" mb={4} />

        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2,1fr)",
            xl: "repeat(4,1fr)",
          }}
          gap={6}
          pt={4}
          pb={8}
        >
          {displayedProducts.map((product) => (
            <BookCard key={product.id} product={product} />
          ))}
        </Grid>

        <Pagination totalPages={totalPages} currentPage={activePage} />
      </Container>
    </Box>
  );
}