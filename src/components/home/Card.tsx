// components/BookCard.tsx

"use client";

import {
  Badge,
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

interface BookCardProps {
  image: string;
  title: string;
  author: string;
  price: string;
  status: "EXCELENTE" | "BUEN ESTADO";
  stock?: number;
}

export default function BookCard({
  image,
  title,
  author,
  price,
  status,
  stock = 1,
}: BookCardProps) {
  const isExcellent = status === "EXCELENTE";
  const { userId } = useAuth();
  const clerk = useClerk();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      setIsModalOpen(true);
      return;
    }
    // Lógica para agregar al carrito cuando el usuario sí está logueado
    console.log("Agregado al carrito:", title);
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
            <Badge
              alignSelf="flex-start"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="10px"
              fontWeight="700"
              letterSpacing="0.08em"
              textTransform="uppercase"
              bg={isExcellent ? "brand.sage" : "brand.clay"}
              color="brand.beige"
            >
              {status}
            </Badge>

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
                disabled={stock === 0}
                opacity={stock === 0 ? 0.5 : 1}
                cursor={stock === 0 ? "not-allowed" : "pointer"}
                onClick={
                  stock === 0
                    ? (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    : handleAddToCart
                }
              >
                <LuPlus />
              </IconButton>
            </HStack>
          </VStack>
        </Box>
      </Link>
    </>
  );
}