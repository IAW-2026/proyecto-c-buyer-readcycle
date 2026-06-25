"use client";

import {
  Box,
  Button,
  Heading,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";

interface SellerMismatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SellerMismatchModal({ isOpen, onClose }: SellerMismatchModalProps) {
  if (!isOpen) return null;

  return (
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
          onClick={onClose}
        />
        <VStack
          position="relative"
          bg="brand.beige"
          p={8}
          borderRadius="brand"
          boxShadow="2xl"
          maxW="md"
          w="90%"
          gap={5}
          zIndex="1401"
          border="1px solid"
          borderColor="brand.sand"
        >
          <Heading
            size="md"
            color="brand.forest"
            textAlign="center"
            fontFamily="heading"
          >
            Vendedor Diferente
          </Heading>
          <Text
            textAlign="center"
            color="brand.sage"
            fontSize="sm"
            fontFamily="body"
          >
            No puedes agregar productos de diferentes vendedores al mismo carrito. Por favor, finaliza tu compra actual o vacía tu carrito antes de agregar libros de otro vendedor.
          </Text>
          <Button
            w="full"
            bg="brand.forest"
            color="brand.beige"
            borderRadius="brand"
            fontFamily="heading"
            fontWeight="600"
            _hover={{ bg: "brand.clay" }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            Entendido
          </Button>
        </VStack>
      </Box>
    </Portal>
  );
}
