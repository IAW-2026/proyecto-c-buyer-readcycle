"use client";

import {
  Badge,
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import AuthModal from "@/components/layout/AuthModal";
import SellerMismatchModal from "@/components/layout/SellerMismatchModal";

interface ProductDetailsProps {
  productId: string;
  image: string;
  title: string;
  author: string;
  description: string;
  price: string;
  categoryName: string;
  stock?: number;
}

export default function ProductDetails({
  productId,
  image,
  title,
  author,
  description,
  price,
  categoryName,
  stock = 1,
}: ProductDetailsProps) {
  const { userId } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMismatchOpen, setIsMismatchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!userId) {
      localStorage.setItem(
        "pending_cart_item",
        JSON.stringify({ productId, cantidad: 1, title })
      );
      setIsModalOpen(true);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, cantidad: 1 })
      });
      if (response.ok) {
        console.log("Agregado al carrito:", title);
        window.dispatchEvent(new Event('cart-updated'));
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error === "seller_mismatch") {
          setIsMismatchOpen(true);
        } else {
          console.error("Error al agregar al carrito");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <SellerMismatchModal isOpen={isMismatchOpen} onClose={() => setIsMismatchOpen(false)} />

      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
        gap={12}
        bg="white"
        p={{ base: 6, md: 10 }}
        borderRadius="brand"
        border="1px solid"
        borderColor="black"
        boxShadow="md"
      >
        <Box>
          <Image
            src={image}
            alt={title}
            w="100%"
            h={{ base: "300px", md: "500px" }}
            objectFit="cover"
            borderRadius="brand"
          />
        </Box>

        <VStack align="flex-start" justify="center" gap={6}>
          <VStack align="flex-start" gap={2}>
            <Badge
              px={3}
              py={1}
              borderRadius="full"
              fontSize="12px"
              fontWeight="700"
              letterSpacing="0.08em"
              textTransform="uppercase"
              bg="brand.forest"
              color="brand.beige"
            >
              {categoryName}
            </Badge>
            <Heading as="h1" size="2xl" color="brand.forest" fontFamily="heading">
              {title}
            </Heading>
            <Text fontSize="lg" color="brand.sage" fontFamily="body" fontWeight="500">
              {author}
            </Text>
            {stock !== undefined && (
              <Text color="gray.500" fontSize="sm" fontFamily="body" fontWeight="medium">
                {stock === 0 ? "Sin stock" : `Stock disponible: ${stock}`}
              </Text>
            )}
          </VStack>

          <Text fontSize="md" color="gray.600" fontFamily="body" lineHeight="tall">
            {description}
          </Text>

          <Box w="full" pt={4} borderTop="1px solid" borderColor="brand.sand">
            <Text fontSize="3xl" fontWeight="700" color="brand.forest" fontFamily="heading" mb={4}>
              {price}
            </Text>

            <Button
              w="full"
              size="lg"
              bg="brand.forest"
              color="brand.beige"
              fontFamily="heading"
              borderRadius="brand"
              _hover={{ bg: "brand.clay" }}
              disabled={stock === 0 || isLoading}
              opacity={stock === 0 || isLoading ? 0.5 : 1}
              cursor={stock === 0 ? "not-allowed" : isLoading ? "wait" : "pointer"}
              onClick={stock === 0 || isLoading ? undefined : handleAddToCart}
            >
              {isLoading ? "Cargando..." : stock === 0 ? "Sin stock" : "Agregar al Carrito"}
            </Button>
          </Box>
        </VStack>
      </Grid>
    </>
  );
}
