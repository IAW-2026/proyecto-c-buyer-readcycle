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
  Portal,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";

interface ProductDetailsProps {
  image: string;
  title: string;
  author: string;
  description: string;
  price: string;
  categoryName: string;
  stock?: number;
}

export default function ProductDetails({
  image,
  title,
  author,
  description,
  price,
  categoryName,
  stock = 1,
}: ProductDetailsProps) {
  const { userId } = useAuth();
  const clerk = useClerk();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = () => {
    if (!userId) {
      setIsModalOpen(true);
      return;
    }
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
              disabled={stock === 0}
              opacity={stock === 0 ? 0.5 : 1}
              cursor={stock === 0 ? "not-allowed" : "pointer"}
              onClick={stock === 0 ? undefined : handleAddToCart}
            >
              {stock === 0 ? "Sin stock" : "Agregar al Carrito"}
            </Button>
          </Box>
        </VStack>
      </Grid>
    </>
  );
}
