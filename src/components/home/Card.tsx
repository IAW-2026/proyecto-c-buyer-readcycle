// components/BookCard.tsx

"use client";

import {
  Box,
  Heading,
  IconButton,
  Image,
  Text,
  VStack,
  HStack,
  Button,
  Portal,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { useAuth, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { Product } from "@/lib/mockProducts";

interface BookCardProps {
  product: Product;
}

export default function BookCard({ product }: BookCardProps) {
  const { userId } = useAuth();
  const clerk = useClerk();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const author = `${product.seller.name} ${product.seller.surname}`;
  const price = `$${product.price.toLocaleString("es-AR")}`;
  const image = product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url || "/images/placeholder.jpg";
  const title = product.title;
  const stock = product.stock;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      setIsModalOpen(true);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, cantidad: 1 })
      });
      if (response.ok) {
        console.log("Agregado al carrito:", title);
      } else {
        console.error("Error al agregar al carrito");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isModalOpen && (
        <Portal>
          <Box
            position="fixed"
            inset="0"
            zIndex="1400"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              position="absolute"
              inset="0"
              bg="blackAlpha.600"
              backdropFilter="blur(3px)"
              onClick={() => setIsModalOpen(false)}
            />
            <VStack
              position="relative"
              bg="brand.beige"
              p={8}
              borderRadius="brand"
              boxShadow="2xl"
              maxW="sm"
              w="90%"
              gap={5}
              zIndex="1401"
              border="1px solid"
              borderColor="brand.sand"
            >
              <Heading size="md" color="brand.forest" textAlign="center" fontFamily="heading">
                ¿Ya tienes una cuenta?
              </Heading>
              <Text textAlign="center" color="brand.sage" fontSize="sm" fontFamily="body">
                Para agregar productos al carrito necesitas iniciar sesión o registrarte de forma gratuita.
              </Text>
              <HStack w="full" gap={3} mt={2}>
                <Button
                  flex="1"
                  variant="outline"
                  borderColor="brand.sage"
                  color="brand.forest"
                  borderRadius="brand"
                  fontFamily="heading"
                  fontWeight="600"
                  _hover={{ bg: "brand.sand" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(false);
                    clerk.openSignIn();
                  }}
                >
                  Ingresar
                </Button>
                <Button
                  flex="1"
                  bg="brand.sage"
                  color="white"
                  borderRadius="brand"
                  fontFamily="heading"
                  fontWeight="600"
                  _hover={{ bg: "brand.forest" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(false);
                    clerk.openSignUp();
                  }}
                >
                  Registrarse
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Portal>
      )}
      <Link href="/product/1" style={{ display: 'block', textDecoration: 'none' }}>
        <Box
          bg="white"
          borderRadius="brand"
          overflow="hidden"
          border="1px solid"
          borderColor="black"
          transition="all 0.2s ease"
          _hover={{
            transform: "translateY(-6px)",
            shadow: "md",
          }}
          _focus={{ outline: "none" }}
        >
          {/* Imagen */}
          <Box p={3}>
            <Image
              src={image}
              alt={title}
              w="100%"
              h="200px"
              objectFit="cover"
              borderRadius="brand"
            />
          </Box>

          {/* Contenido */}
          <VStack align="stretch" gap={4} px={5} pb={5}>
            <Box>
              <Heading
                size="md"
                color="brand.forest"
                fontFamily="heading"
                lineClamp={1}
              >
                {title}
              </Heading>

              <Text
                mt={1}
                color="brand.sage"
                fontSize="sm"
                fontFamily="body"
              >
                {author}
              </Text>

              {stock !== undefined && (
                <Text
                  mt={1}
                  color="gray.500"
                  fontSize="xs"
                  fontFamily="body"
                  fontWeight="medium"
                >
                  {stock === 0 ? "Sin stock" : `Stock: ${stock}`}
                </Text>
              )}
            </Box>

            <HStack justify="space-between" align="center">
              <Text
                fontSize="2xl"
                fontWeight="700"
                color="brand.forest"
                fontFamily="heading"
              >
                {price}
              </Text>

              <IconButton
                aria-label="Agregar libro"
                rounded="full"
                bg="brand.forest"
                color="brand.beige"
                size="md"
                transition="all 0.2s ease"
                _hover={{
                  bg: "brand.clay",
                }}
                disabled={stock === 0 || isLoading}
                opacity={stock === 0 || isLoading ? 0.5 : 1}
                cursor={stock === 0 ? "not-allowed" : isLoading ? "wait" : "pointer"}
                onClick={
                  stock === 0 || isLoading
                    ? (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    : handleAddToCart
                }
              >
                {isLoading ? <Text fontSize="xs" fontWeight="bold">...</Text> : <LuPlus />}
              </IconButton>
            </HStack>
          </VStack>
        </Box>
      </Link>
    </>
  );
}