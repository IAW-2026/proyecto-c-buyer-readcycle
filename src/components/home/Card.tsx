
"use client";

import {
  Box,
  Heading,
  IconButton,
  Image,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { useAuth } from "@clerk/nextjs";
import AuthModal from "@/components/layout/AuthModal";
import SellerMismatchModal from "@/components/layout/SellerMismatchModal";
import Link from "next/link";
import { Product } from "@/lib/mockProducts";
import { toaster } from "@/components/ui/toaster";

interface BookCardProps {
  product: Product;
}

export default function BookCard({ product }: BookCardProps) {
  const { userId } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMismatchOpen, setIsMismatchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const seller = product.seller?.name 
    ? `${product.seller.name} ${product.seller.surname || ""}`.trim() 
    : `Vendedor #${product.seller?.id?.slice(-4) || "Desconocido"}`;
  const price = `$${product.price.toLocaleString("es-AR")}`;
  const image = product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url || "/images/placeholder.jpg";
  const title = product.title;
  const stock = product.stock;
  const author = product.author;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      localStorage.setItem(
        "pending_cart_item",
        JSON.stringify({ productId: product.id, cantidad: 1, title: title })
      );
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
        window.dispatchEvent(new Event('cart-updated'));
        toaster.create({
          title: "Producto agregado al carrito",
          description: `"${title || "El libro"}" se agregó a tu carrito de compras.`,
          type: "success",
          duration: 4000,
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error === "seller_mismatch") {
          setIsMismatchOpen(true);
        } else {
          console.error("Error al agregar al carrito");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <SellerMismatchModal isOpen={isMismatchOpen} onClose={() => setIsMismatchOpen(false)} />
      <Link href={`/product/${product.id}`} style={{ display: 'block', textDecoration: 'none' }}>
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
          <Box p={3}>
            <Image
              src={image}
              alt={title}
              w="100%"
              h="300px"
              objectFit="contain"
              borderRadius="brand"
            />
          </Box>

          <VStack align="stretch" gap={4} px={5} pb={5}>
            <Box>
              <Heading
                size="md"
                color="brand.forest"
                fontFamily="heading"
                lineClamp={1}
              >
                {title} - {author}
              </Heading>

              <Text
                mt={1}
                color="brand.sage"
                fontSize="sm"
                fontFamily="body"
              >
                Vendedor: {seller}
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