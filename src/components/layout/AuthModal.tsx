"use client";

import {
  Box,
  Button,
  Heading,
  HStack,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useClerk } from "@clerk/nextjs";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const clerk = useClerk();

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
          maxW="sm"
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
            ¿Ya tienes una cuenta?
          </Heading>
          <Text
            textAlign="center"
            color="brand.sage"
            fontSize="sm"
            fontFamily="body"
          >
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
                onClose();
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
                onClose();
                clerk.openSignUp();
              }}
            >
              Registrarse
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Portal>
  );
}
