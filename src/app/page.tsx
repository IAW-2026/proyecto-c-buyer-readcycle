// app/page.tsx

import { Box, Container, Grid } from "@chakra-ui/react";

import HeroBanner from "@/components/home/HeroBanner";
import BooksTabs from "@/components/home/Tabs";
import BookCard from "@/components/home/Card";

import { mockProducts } from "@/lib/mockProducts";

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
          {mockProducts.map((product) => (
            <BookCard key={product.id} product={product} />
          ))}
        </Grid>
      </Container>
    </Box>
  );
}