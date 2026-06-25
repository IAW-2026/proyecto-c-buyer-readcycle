// components/BooksTabs.tsx

"use client";

import { Tabs, Container } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { mockCategories } from "@/lib/mockCategories";
import { Product } from "@/lib/mockProducts";

const categories = [
  "Todos los libros",
  ...mockCategories.map((c) => c.name),
];

interface BooksTabsProps {
  selectedCategory: string;
  products: Product[];
}

export default function BooksTabs({ selectedCategory, products = [] }: BooksTabsProps) {
  const router = useRouter();

  const handleCategoryChange = (value: string) => {
    if (value === "Todos los libros") {
      router.push("/");
    } else {
      router.push(`/?category=${encodeURIComponent(value)}`);
    }
  };

  const getCountForCategory = (categoryName: string) => {
    if (categoryName === "Todos los libros") {
      return products.length;
    }
    return products.filter(
      (p) => p.category?.name?.toLowerCase() === categoryName.toLowerCase()
    ).length;
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
        flexWrap={{ base: "wrap", md: "nowrap" }}
        justifyContent={{ base: "center", md: "flex-start" }}
        gap={{ base: 2, md: 3 }}
        py={2}
        bg="transparent"
        border="none"
      >
        {categories.map((category) => (
          <Tabs.Trigger
            key={category}
            value={category}
            flexShrink={0}
            px={{ base: 3, md: 5 }}
            py={{ base: 1.5, md: 2.5 }}
            borderRadius="full"
            border="1px solid"
            borderColor="black"
            bg="transparent"
            color="brand.forest"
            fontFamily="body"
            fontWeight="500"
            fontSize={{ base: "xs", md: "sm" }}
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
            {category} ({getCountForCategory(category)})
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
    </Container>
  );
}