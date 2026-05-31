"use client";

import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <HStack justify="center" gap={2} py={8} width="100%">
      {/* Botón Anterior */}
      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        borderColor="brand.forest"
        color="brand.forest"
        borderRadius="full"
        px={4}
        cursor={currentPage <= 1 ? "not-allowed" : "pointer"}
        _hover={{
          bg: currentPage <= 1 ? "transparent" : "brand.clay",
          color: currentPage <= 1 ? "brand.forest" : "brand.beige",
          borderColor: currentPage <= 1 ? "brand.forest" : "brand.clay",
        }}
        _disabled={{
          opacity: 0.4,
        }}
      >
        <LuChevronLeft style={{ marginRight: "4px" }} />
        Anterior
      </Button>

      {/* Números de Página */}
      <HStack gap={1} display={{ base: "none", sm: "flex" }}>
        {pageNumbers.map((page) => {
          const isActive = page === currentPage;
          return (
            <Button
              key={page}
              onClick={() => handlePageChange(page)}
              borderRadius="full"
              minW="40px"
              h="40px"
              variant={isActive ? "solid" : "ghost"}
              bg={isActive ? "brand.forest" : "transparent"}
              color={isActive ? "brand.beige" : "brand.forest"}
              borderColor={isActive ? "brand.forest" : "transparent"}
              _hover={{
                bg: isActive ? "brand.forest" : "brand.clay",
                color: "brand.beige",
              }}
              cursor="pointer"
            >
              {page}
            </Button>
          );
        })}
      </HStack>

      {/* Info de página para móvil */}
      <Text display={{ base: "block", sm: "none" }} fontSize="sm" color="brand.forest" fontWeight="medium" px={2}>
        {currentPage} de {totalPages}
      </Text>

      {/* Botón Siguiente */}
      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        borderColor="brand.forest"
        color="brand.forest"
        borderRadius="full"
        px={4}
        cursor={currentPage >= totalPages ? "not-allowed" : "pointer"}
        _hover={{
          bg: currentPage >= totalPages ? "transparent" : "brand.clay",
          color: currentPage >= totalPages ? "brand.forest" : "brand.beige",
          borderColor: currentPage >= totalPages ? "brand.forest" : "brand.clay",
        }}
        _disabled={{
          opacity: 0.4,
        }}
      >
        Siguiente
        <LuChevronRight style={{ marginLeft: "4px" }} />
      </Button>
    </HStack>
  );
}
