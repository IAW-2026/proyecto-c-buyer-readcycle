"use client"

import { useState, useEffect } from "react"

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
import { Show, SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { mockCategories } from "@/lib/mockCategories"
import { toaster } from "@/components/ui/toaster"

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [userRole, setUserRole] = useState("BUYER");

  const { userId, getToken } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCartClick = (e: React.MouseEvent) => {
    if (cartCount === 0) {
      e.preventDefault();
      toaster.create({
        title: "El carrito está vacío",
        description: "Agrega libros para poder ver tu carrito.",
        type: "warning",
        duration: 3500,
      });
    }
  };

  const fetchCartCount = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.carrito) {
          const totalItems = data.carrito.items.reduce((acc: number, item: any) => acc + item.cantidad, 0);
          setCartCount(totalItems);
        } else {
          setCartCount(0);
        }
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }
  }, [userId]);

  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartCount();
      setIsAnimating(true);
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, [userId]);

  useEffect(() => {
    if (isAnimating) {
      const t = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(t);
    }
  }, [isAnimating]);

  // Sincronizar el input si cambia la query de búsqueda en la URL
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // Actualizar la URL a medida que el usuario escribe (Debounce de 200ms)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const urlSearch = searchParams.get("search") || "";
      const trimmedQuery = searchQuery.trim();

      if (trimmedQuery !== urlSearch.trim()) {
        const isHome = pathname === "/";
        if (isHome) {
          const params = new URLSearchParams(window.location.search);
          if (trimmedQuery) {
            params.set("search", trimmedQuery);
          } else {
            params.delete("search");
          }
          router.replace(`/?${params.toString()}`, { scroll: false });
        } else if (trimmedQuery) {
          // Si estamos en otra página, redirigimos al home con la búsqueda
          router.push(`/?search=${encodeURIComponent(trimmedQuery)}`);
        }
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, pathname, router, searchParams]);

  useEffect(() => {
    if (!userId) {
      setUserRole("BUYER");
      return;
    }

    const fetchRole = async () => {
      try {
        const token = await getToken();
        const headers: Record<string, string> = {
          'cache-control': 'no-cache',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch(`/api/auth/role?t=${Date.now()}`, {
          cache: 'no-store',
          headers,
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.role) setUserRole(data.role);
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
      }
    };

    fetchRole();

    window.addEventListener('user-synced', fetchRole);
    return () => {
      window.removeEventListener('user-synced', fetchRole);
    };
  }, [userId]);

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

          <Box flex="1" maxW={{ base: "none", md: "md", lg: "lg" }} mx="auto" display="flex" alignItems="center" gap={4}>
            <Show when="signed-in">
              {userRole === "ADMIN" && (
                <NextLink href="/admin/users" passHref>
                  <Button
                    variant="solid"
                    bg="brand.sage"
                    color="white"
                    size="sm"
                    borderRadius="brand"
                    fontFamily="heading"
                    fontWeight="600"
                    _hover={{ bg: "brand.forest" }}
                    flexShrink={0}
                  >
                    Panel Admin
                  </Button>
                </NextLink>
              )}
            </Show>
            <Box position="relative" flex="1">
              <Box
                color="brand.sage"
                left="3"
                position="absolute"
                top="50%"
                transform="translateY(-50%)"
                pointerEvents="none"
                zIndex="2"
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = searchQuery.trim();
                    if (value) {
                      router.push(`/?search=${encodeURIComponent(value)}`);
                    } else {
                      router.push("/");
                    }
                  }
                }}
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
                    {mockCategories.map((category) => (
                      <Menu.Item
                        key={category.id}
                        value={category.id}
                        asChild
                        _hover={{ bg: "brand.sand" }}
                        px="4"
                        py="2"
                        cursor="pointer"
                        color="brand.forest"
                      >
                        <NextLink
                          href={`/?category=${encodeURIComponent(category.name)}`}
                          style={{ textDecoration: 'none', display: 'block', width: '100%' }}
                        >
                          {category.name}
                        </NextLink>
                      </Menu.Item>
                    ))}
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
                <NextLink href="/cart" passHref style={{ textDecoration: 'none' }} onClick={handleCartClick}>
                  <Box position="relative" display="inline-block">
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
                    {cartCount > 0 && (
                      <Box
                        position="absolute"
                        bottom="-6px"
                        right="-6px"
                        bg="brand.clay"
                        color="white"
                        borderRadius="full"
                        minW="18px"
                        h="18px"
                        px="4px"
                        fontSize="10px"
                        fontWeight="bold"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        boxShadow="sm"
                        zIndex="1"
                        pointerEvents="none"
                        className={isAnimating ? "cart-bounce-animation" : ""}
                      >
                        {cartCount}
                      </Box>
                    )}
                  </Box>
                </NextLink>
                <Box>
                  <UserButton>
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label="Mi Perfil"
                        href="/profile"
                        labelIcon={<LuUser />}
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                </Box>
              </Show>
            </HStack>
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}