"use client";

import { Box, Grid, Heading } from "@chakra-ui/react";
import BookCard from "@/components/home/Card";

interface Book {
  title: string;
  author: string;
  price: string;
  status: "EXCELENTE" | "BUEN ESTADO";
  image: string;
  stock?: number;
}

interface SellerProductsProps {
  books: Book[];
  sellerName?: string;
}

export default function SellerProducts({ books, sellerName = "este vendedor" }: SellerProductsProps) {
  if (!books || books.length === 0) return null;

  return (
    <Box mt={16}>
      <Heading size="lg" color="brand.forest" fontFamily="heading" mb={8}>
        Más productos de {sellerName}
      </Heading>
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2,1fr)",
          xl: "repeat(4,1fr)",
        }}
        gap={6}
      >
        {books.map((book) => (
          <BookCard key={book.title} {...book} />
        ))}
      </Grid>
    </Box>
  );
}
