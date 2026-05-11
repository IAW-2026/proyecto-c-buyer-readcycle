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
import { LuSearch, LuShoppingCart } from "react-icons/lu"
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"

export function Navbar() {
  return (
    <Box
      as="header"
      bg="brand.beige"
      position="sticky"
      top="0"
      zIndex="sticky"
      boxShadow="sm"
      transition="all 0.3s ease"
    >
      <Container maxW="8xl" px={{ base: "4", md: "8" }}>
        <Flex minH="16" align="center" justify="space-between" gap={{ base: "4", lg: "10" }}>
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

          <Box flex="1" maxW={{ base: "none", md: "md", lg: "lg" }} mx="auto">
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
                borderRadius="brand"
                color="brand.forest"
                fontFamily="body"
                fontWeight="500"
                borderColor="brand.sage"
                boxShadow="0 0 0 0.5px var(--chakra-colors-brand-sage), var(--chakra-shadows-sm)"
                transition="transform 0.2s ease, box-shadow 0.2s ease"
                _focusVisible={{
                  transform: "scale(1.02)",
                  boxShadow: "0 0 0 1px var(--chakra-colors-brand-sage), var(--chakra-shadows-md)",
                  borderColor: "brand.sage"
                }}
                _placeholder={{ color: "brand.sage" }}
                variant="outline"
              />
            </Box>
          </Box>

          <Flex flex="1" justify="flex-end" minW="0">
            <HStack gap={{ base: "3", md: "6" }}>
              <Box position="relative">
                <Menu.Root positioning={{ placement: "bottom-start" }}>
                  <Menu.Trigger asChild>
                    <Button
                      bg="rgba(0, 0, 0, 0.06)"
                      color="brand.forest"
                      size="sm"
                      borderRadius="brand"
                      fontFamily="heading"
                      fontWeight="600"
                      _hover={{ bg: "rgba(0, 0, 0, 0.12)" }}
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
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    borderColor="brand.sage"
                    color="brand.forest"
                    size="sm"
                    borderRadius="brand"
                    fontFamily="heading"
                    fontWeight="600"
                    _hover={{ bg: "brand.sand" }}
                    display={{ base: "none", md: "flex" }}
                  >
                    Ingresar
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    bg="brand.sage"
                    borderRadius="brand"
                    color="white"
                    size="sm"
                    fontFamily="heading"
                    fontWeight="600"
                    _hover={{ bg: "brand.forest" }}
                  >
                    Registrarse
                  </Button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <NextLink href="/cart" passHref>
                  <IconButton
                    aria-label="Ver carrito"
                    bg="rgba(0, 0, 0, 0.06)"
                    color="brand.forest"
                    borderRadius="brand"
                    size="sm"
                    _hover={{ bg: "rgba(0, 0, 0, 0.12)" }}
                  >
                    <LuShoppingCart />
                  </IconButton>
                </NextLink>
                <Box>
                  <UserButton />
                </Box>
              </Show>
            </HStack>
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}