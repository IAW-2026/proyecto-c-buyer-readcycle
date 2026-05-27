"use client";

import { Box, Grid, Heading, Text } from "@chakra-ui/react";
import BookCard from "@/components/home/Card";
import { Product } from "@/lib/mockProducts";

interface SellerProductsProps {
  books: Product[];
  sellerName?: string;
}

export default function SellerProducts({ books, sellerName = "este vendedor" }: SellerProductsProps) {
  const hasBooks = books && books.length > 0;

  return (
    <Box mt={16}>
      <Heading size="lg" color="brand.forest" fontFamily="heading" mb={8}>
        {hasBooks ? `Más productos de ${sellerName}` : `Productos de ${sellerName}`}
      </Heading>
      {hasBooks ? (
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2,1fr)",
            xl: "repeat(4,1fr)",
          }}
          gap={6}
        >
          {books.map((book) => (
            <BookCard key={book.id} product={book} />
          ))}
        </Grid>
      ) : (
        <Box
          bg="white"
          p={{ base: 8, md: 10 }}
          borderRadius="brand"
          border="1px solid"
          borderColor="black"
          boxShadow="md"
          textAlign="center"
        >
          <Text color="brand.forest" fontSize="lg" fontWeight="semibold" fontFamily="body">
            Este es el único producto publicado por {sellerName}.
          </Text>
        </Box>
      )}
    </Box>
  );
}

