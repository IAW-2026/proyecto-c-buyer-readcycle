// app/page.tsx

import { Box, Container, Grid } from "@chakra-ui/react";

import HeroBanner from "@/components/home/HeroBanner";
import BooksTabs from "@/components/home/Tabs";
import BookCard from "@/components/home/Card";

const books = [
  {
    title: "El Aleph",
    author: "Jorge Luis Borges",
    price: "$18.500",
    status: "EXCELENTE" as const,
    image: "/images/book-1.jpg",
    stock: 5,
  },
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

export default function HomePage() {
  return (
    <Box bg="brand.beige" minH="100vh">
      <Container maxW="8xl">
        <HeroBanner />

        <BooksTabs />

        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2,1fr)",
            xl: "repeat(4,1fr)",
          }}
          gap={6}
          py={8}
        >
          {books.map((book) => (
            <BookCard key={book.title} {...book} />
          ))}
        </Grid>
      </Container>
    </Box>
  );
}