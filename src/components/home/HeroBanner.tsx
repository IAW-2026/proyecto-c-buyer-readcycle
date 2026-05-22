// components/HeroBanner.tsx

"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";

export default function HeroBanner() {
  return (
    <Container maxW="8xl" py={6}>
      <Box
        position="relative"
        overflow="hidden"
        borderRadius="brand"
        height="25vh"
        bg="brand.forest"
      >
        {/* Background Image */}
        <Image
          src="/banner-books.jpg"
          alt="Libros"
          position="absolute"
          inset={0}
          w="100%"
          h="100%"
          objectFit="cover"
          objectPosition="right center"
          opacity={0.55}
        />

        {/* Overlay */}
        <Box
          position="absolute"
          inset={0}
          bg="rgba(44,58,39,0.75)"
        />

        {/* Content */}
        <Flex
          position="relative"
          zIndex={2}
          align="center"
          justify="space-between"
          h="100%"
          px={{ base: 8, md: 16 }}
          py={4}
        >
          <Stack gap={2}>
            <Heading
              color="brand.beige"
              fontWeight="400"
              lineHeight="1.1"
              fontSize={{ base: "2xl", md: "4xl" }}
            >
              Dale una segunda vida a cada historia.
            </Heading>

            <Flex gap={4} wrap="wrap" py={6}>
              <Button
                size="lg"
                bg="brand.beige"
                color="brand.forest"
                borderRadius="full"
                px={8}
                fontWeight="600"
                _hover={{
                  bg: "brand.sand",
                }}
              >
                Ver catálogo completo
              </Button>

              <Button
                size="lg"
                variant="outline"
                color="brand.beige"
                borderColor="rgba(249,247,242,0.35)"
                borderRadius="full"
                px={8}
                _hover={{
                  bg: "rgba(249,247,242,0.08)",
                }}
              >
                Vender
              </Button>
            </Flex>
          </Stack>
        </Flex>
      </Box>
    </Container>
  );
}