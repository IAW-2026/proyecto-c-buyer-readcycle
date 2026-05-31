// components/BooksTabs.tsx

"use client";

import { Tabs, Container } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { mockCategories } from "@/lib/mockCategories";

const categories = [
  "Todos los libros",
  ...mockCategories.map((c) => c.name),
];

interface BooksTabsProps {
  selectedCategory: string;
}

export default function BooksTabs({ selectedCategory }: BooksTabsProps) {
  const router = useRouter();

  const handleCategoryChange = (value: string) => {
    if (value === "Todos los libros") {
      router.push("/");
    } else {
      router.push(`/?category=${encodeURIComponent(value)}`);
    }
  };

  return (
    <Container maxW="container.lg" centerContent pt={2} pb={4}>
      <Tabs.Root
        value={selectedCategory}
        onValueChange={(details) => handleCategoryChange(details.value)}
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