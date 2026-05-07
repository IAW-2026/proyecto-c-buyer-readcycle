"use client"

import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Input,
  Link,
  Text,
} from "@chakra-ui/react"
import Image from "next/image"
import NextLink from "next/link"
import { LuSearch, LuShoppingCart, LuUser } from "react-icons/lu"

export function Navbar() {
  return (
    <Box
      as="header"
      borderBottomWidth="1px"
      borderColor="brand.sand"
      bg="brand.beige"
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      <Container maxW="7xl" px={{ base: "4", md: "6" }}>
        <Flex minH="16" align="center" gap="4">
          <Box flex="1" minW="0">
            <Link asChild textDecoration="none" _hover={{ textDecoration: "none" }} display="flex" justifyContent="flex-start">
              <NextLink href="/">
                <Image
                  src="/LogoPng.png"
                  alt="ReadCycle Logo"
                  width={100}
                  height={50}
                  priority
                  style={{ objectFit: "contain" }}
                />
              </NextLink>
            </Link>
          </Box>

          <Box flex="2" maxW={{ base: "none", lg: "xl" }}>
            <Box position="relative">
              <Box
                color="brand.sage"
                left="3"
                position="absolute"
                top="50%"
                transform="translateY(-50%)"
                pointerEvents="none"
              >
                <LuSearch />
              </Box>
              <Input
                aria-label="Buscar productos"
                placeholder="Buscar libros, autores o categorias"
                ps="10"
                bg="white"
                borderColor="brand.sand"
                borderRadius="brand"
                color="brand.forest"
                fontFamily="body"
                fontWeight="500"
                _focusVisible={{
                  borderColor: "brand.sage",
                  boxShadow: "0 0 0 1px var(--chakra-colors-brand-sage)",
                }}
                _placeholder={{ color: "brand.sage" }}
                variant="outline"
              />
            </Box>
          </Box>

          <Flex flex="1" justify="flex-end" minW="0">
            <HStack gap="3">
              <Button
                color="brand.forest"
                size="sm"
                borderRadius="brand"
                variant="ghost"
                fontFamily="heading"
                fontWeight="600"
                _hover={{ bg: "brand.sand" }}
                display={{ base: "none", md: "flex" }}
              >
                Categorias
              </Button>
              <Button
                bg="brand.clay"
                borderRadius="brand"
                color="white"
                size="sm"
                fontFamily="heading"
                fontWeight="600"
                _hover={{ bg: "brand.sage" }}
                display={{ base: "none", md: "flex" }}
              >
                Ofertas
              </Button>
              <IconButton
                aria-label="Ver carrito"
                color="brand.forest"
                borderRadius="brand"
                size="sm"
                variant="ghost"
                _hover={{ bg: "brand.sand" }}
              >
                <LuShoppingCart />
              </IconButton>
              <IconButton
                aria-label="Ver perfil"
                bg="brand.sage"
                borderRadius="brand"
                color="white"
                size="sm"
                _hover={{ bg: "brand.forest" }}
              >
                <LuUser />
              </IconButton>
            </HStack>
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}
