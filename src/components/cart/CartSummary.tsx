"use client";

import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { LuShieldCheck, LuTruck } from "react-icons/lu";

interface CartSummaryProps {
    subtotal: number;
    shipping: number;
    total: number;
    onCheckout: () => void;
    isCheckoutDisabled: boolean;
    isCheckingOut: boolean;
}

export default function CartSummary({
    subtotal,
    shipping,
    total,
    onCheckout,
    isCheckoutDisabled,
    isCheckingOut,
}: CartSummaryProps) {
    return (
        <Box
            border="1px solid"
            borderColor="brand.sand"
            borderRadius="brand"
            p={{ base: 6, md: 8 }}
            bg="transparent"
        >
            <Heading
                fontFamily="heading"
                fontSize="2xl"
                color="brand.forest"
                mb={8}
                fontWeight="bold"
            >
                Resumen del pedido
            </Heading>

            <VStack gap={4} align="stretch" mb={6}>
                <Flex justify="space-between">
                    <Text color="gray.600">Subtotal</Text>
                    <Text color="brand.forest" fontWeight="bold">
                        ${subtotal.toFixed(2)}
                    </Text>
                </Flex>
                <Flex justify="space-between">
                    <Text color="gray.600">Envío</Text>
                    <Text color="brand.forest" fontWeight="bold">
                        ${shipping.toFixed(2)}
                    </Text>
                </Flex>
            </VStack>

            <Box borderBottom="1px solid" borderColor="brand.sand" mb={6} />

            <Flex justify="space-between" align="center" mb={8}>
                <Text fontSize="xl" color="brand.forest">
                    Total
                </Text>
                <Text
                    fontSize="4xl"
                    fontFamily="heading"
                    color="brand.forest"
                    fontWeight="bold"
                >
                    ${total.toFixed(2)}
                </Text>
            </Flex>

            <Button
                w="full"
                size="lg"
                bg="brand.clay"
                color="white"
                borderRadius="brand"
                fontFamily="heading"
                fontSize="lg"
                fontWeight="semibold"
                _hover={{ bg: "#c66a4e" }}
                mb={8}
                h="14"
                onClick={onCheckout}
                disabled={isCheckoutDisabled}
            >
                {isCheckingOut ? "Procesando..." : "Finalizar compra"}
            </Button>

            <VStack align="start" gap={3}>
                <Flex align="center" gap={3}>
                    <Box color="brand.forest">
                        <LuTruck size={20} />
                    </Box>
                    <Text fontSize="sm" color="gray.600">
                        Envío gratis en compras mayores a $50.000
                    </Text>
                </Flex>
                <Flex align="center" gap={3}>
                    <Box color="brand.forest">
                        <LuShieldCheck size={20} />
                    </Box>
                    <Text fontSize="sm" color="gray.600">
                        Pago seguro y encriptado
                    </Text>
                </Flex>
            </VStack>
        </Box>
    );
}
