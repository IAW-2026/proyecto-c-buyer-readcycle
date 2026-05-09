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
} from "@chakra-ui/react";

import { LuPlus } from "react-icons/lu";

interface BookCardProps {
  image: string;
  title: string;
  author: string;
  price: string;
  status: "EXCELENTE" | "BUEN ESTADO";
}

export default function BookCard({
  image,
  title,
  author,
  price,
  status,
}: BookCardProps) {
  const isExcellent = status === "EXCELENTE";

  return (
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
          >
            <LuPlus />
          </IconButton>
        </HStack>
      </VStack>
    </Box>
  );
}