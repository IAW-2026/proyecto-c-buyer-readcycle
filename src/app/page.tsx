// app/page.tsx

import { Box, Container, Grid } from "@chakra-ui/react";

import HeroBanner from "@/components/home/HeroBanner";
import BooksTabs from "@/components/home/Tabs";
import BookCard from "@/components/home/Card";

import { mockProducts } from "@/lib/mockProducts";

interface HomePageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

const normalizeText = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default async function HomePage({ searchParams }: HomePageProps) {
  const { category, search } = await searchParams;

  const selectedCategory = category || "Todos los libros";

  // 1. Filtrado inicial por categoría si no es "Todos los libros"
  let filteredProducts = selectedCategory !== "Todos los libros"
    ? mockProducts.filter(
        (product) =>
          product.category.name.toLowerCase() === selectedCategory.toLowerCase()
      )
    : mockProducts;

  // 2. Filtrado y ordenamiento con prioridades si hay búsqueda activa
  if (search && search.trim() !== "") {
    const query = normalizeText(search);

    const matched = filteredProducts
      .map((product) => {
        const titleMatch = normalizeText(product.title).includes(query);
        const authorName = `${product.seller.name} ${product.seller.surname}`;
        const authorMatch = normalizeText(authorName).includes(query);
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

  return (
    <Box bg="brand.beige" minH="100vh">
      <Container maxW="8xl">
        <HeroBanner />

        <BooksTabs selectedCategory={selectedCategory} />

        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2,1fr)",
            xl: "repeat(4,1fr)",
          }}
          gap={6}
          py={8}
        >
          {filteredProducts.map((product) => (
            <BookCard key={product.id} product={product} />
          ))}
        </Grid>
      </Container>
    </Box>
  );
}