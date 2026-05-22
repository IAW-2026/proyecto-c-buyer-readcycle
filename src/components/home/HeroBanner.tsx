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
import { useState } from "react";

export default function HeroBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

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
              Dale una segunda vida a las historias.
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
                onClick={() => setIsVisible(false)}
              >
                Ver catálogo completo
              </Button>
            </Flex>
          </Stack>
        </Flex>
      </Box>
    </Container>
  );
}