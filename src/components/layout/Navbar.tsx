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
  Menu,
  Text,
} from "@chakra-ui/react"
import Image from "next/image"
import NextLink from "next/link"
import { LuSearch, LuShoppingCart, LuUser } from "react-icons/lu"

export function Navbar() {
  return (
    <Box
      as="header"
      bg="brand.beige"
      position="sticky"
      top="0"
      zIndex="sticky"
      boxShadow="md"
      transition="all 0.3s ease"
    >
      <Container maxW="7xl" px={{ base: "4", md: "6" }}>
        <Flex minH="16" align="center" gap="4">
          <Box flex="1" minW="0" py="2">
            <Link 
              asChild 
              textDecoration="none" 
              _hover={{ textDecoration: "none" }} 
              _focus={{ outline: "none" }}
              _focusVisible={{ outline: "none", boxShadow: "none" }}
              display="flex" 
              justifyContent="flex-start"
            >
              <NextLink href="/">
                <Image
                  src="/Logo.png"
                  alt="ReadCycle Logo"
                  width={200}
                  height={80}
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
              <Box position="relative">
                <Menu.Root positioning={{ placement: "bottom-start" }}>
                  <Menu.Trigger asChild>
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
                      Categorías
                    </Button>
                  </Menu.Trigger>
                  <Menu.Content position="absolute" top="100%" left="50%" transform="translateX(-50%)" mt="2" bg="white" borderColor="brand.sand" borderRadius="brand" boxShadow="md" py="2" zIndex="popover">
                    <Menu.Item value="ficcion" _hover={{ bg: "brand.sand" }} px="4" py="2" cursor="pointer" color="brand.forest">
                      Ficción
                    </Menu.Item>
                    <Menu.Item value="no-ficcion" _hover={{ bg: "brand.sand" }} px="4" py="2" cursor="pointer" color="brand.forest">
                      No Ficción
                    </Menu.Item>
                    <Menu.Item value="infantil" _hover={{ bg: "brand.sand" }} px="4" py="2" cursor="pointer" color="brand.forest">
                      Infantil
                    </Menu.Item>
                    <Menu.Item value="juvenil" _hover={{ bg: "brand.sand" }} px="4" py="2" cursor="pointer" color="brand.forest">
                      Juvenil
                    </Menu.Item>
                    <Menu.Item value="academico" _hover={{ bg: "brand.sand" }} px="4" py="2" cursor="pointer" color="brand.forest">
                      Académico
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Root>
              </Box>
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
              <NextLink href="/cart" passHref>
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
              </NextLink>
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