// components/BooksTabs.tsx

"use client";

import { Tabs, Container } from "@chakra-ui/react";

const categories = [
  "Todos los libros",
  "Novedades",
  "Ficción",
  "Clásicos",
  "Historia",
  "Ensayo",
  "Poesía",
];

export default function BooksTabs() {
  return (
    <Container maxW="container.lg" centerContent py={6}>
      <Tabs.Root
        defaultValue="Todos los libros"
        variant="plain"
        width="auto"
      >
      <Tabs.List
        display="flex"
        gap={3}
        overflowX="auto"
        py={2}
        bg="transparent"
        border="none"
      >
        {categories.map((category) => (
          <Tabs.Trigger
            key={category}
            value={category}
            flexShrink={0}
            px={5}
            py={2.5}
            borderRadius="full"
            border="1px solid"
            borderColor="black"
            bg="transparent"
            color="brand.forest"
            fontFamily="body"
            fontWeight="500"
            fontSize="sm"
            letterSpacing="0.01em"
            transition="all 0.2s ease"
            whiteSpace="nowrap"
            cursor="pointer"
            _hover={{
              bg: "brand.clay",
              color: "brand.beige",
              borderColor: "brand.clay",
            }}
            _selected={{
              bg: "brand.forest",
              color: "brand.beige",
              borderColor: "brand.forest",
            }}
          >
            {category}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
    </Container>
  );
}