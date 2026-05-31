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
    mainAddress: any;
    shippingMethod: "domicilio" | "sucursal";
    onShippingMethodChange: (method: "domicilio" | "sucursal") => void;
}

export default function CartSummary({
    subtotal,
    shipping,
    total,
    onCheckout,
    isCheckoutDisabled,
    isCheckingOut,
    mainAddress,
    shippingMethod,
    onShippingMethodChange,
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
                mb={6}
                fontWeight="bold"
            >
                Resumen del pedido
            </Heading>

            {/* Componente Envío a: */}
            <Box mb={6} p={4} border="1px solid" borderColor="brand.sand" borderRadius="brand" bg="white">
                <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={1} textTransform="uppercase">
                    Envío a:
                </Text>
                {mainAddress ? (
                    <Text fontSize="sm" fontWeight="semibold" color="brand.forest" mb={4}>
                        {mainAddress.calle} {mainAddress.altura}, {mainAddress.ciudad} (CP {mainAddress.cp})
                    </Text>
                ) : (
                    <Text fontSize="sm" color="gray.500" fontStyle="italic" mb={4}>
                        No tienes direcciones guardadas.
                    </Text>
                )}

                <VStack align="stretch" gap={3}>
                    <Flex
                        align="center"
                        p={3}
                        border="1px solid"
                        borderColor={shippingMethod === "domicilio" ? "brand.forest" : "brand.sand"}
                        borderRadius="brand"
                        cursor="pointer"
                        bg={shippingMethod === "domicilio" ? "rgba(107, 142, 35, 0.05)" : "transparent"}
                        onClick={() => onShippingMethodChange("domicilio")}
                        transition="all 0.2s"
                        _hover={{ borderColor: "brand.forest" }}
                    >
                        <Box
                            w="4"
                            h="4"
                            borderRadius="full"
                            border="2px solid"
                            borderColor={shippingMethod === "domicilio" ? "brand.forest" : "gray.400"}
                            mr={3}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            {shippingMethod === "domicilio" && (
                                <Box w="2" h="2" borderRadius="full" bg="brand.forest" />
                            )}
                        </Box>
                        <Box flex="1">
                            <Text fontSize="sm" fontWeight="bold" color="brand.forest">
                                Envío a domicilio
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                                Directo a tu puerta
                            </Text>
                        </Box>
                        <Text fontSize="sm" fontWeight="bold" color="brand.forest">
                            {subtotal >= 50000 ? "Gratis" : "$15.000"}
                        </Text>
                    </Flex>

                    <Flex
                        align="center"
                        p={3}
                        border="1px solid"
                        borderColor={shippingMethod === "sucursal" ? "brand.forest" : "brand.sand"}
                        borderRadius="brand"
                        cursor="pointer"
                        bg={shippingMethod === "sucursal" ? "rgba(107, 142, 35, 0.05)" : "transparent"}
                        onClick={() => onShippingMethodChange("sucursal")}
                        transition="all 0.2s"
                        _hover={{ borderColor: "brand.forest" }}
                    >
                        <Box
                            w="4"
                            h="4"
                            borderRadius="full"
                            border="2px solid"
                            borderColor={shippingMethod === "sucursal" ? "brand.forest" : "gray.400"}
                            mr={3}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            {shippingMethod === "sucursal" && (
                                <Box w="2" h="2" borderRadius="full" bg="brand.forest" />
                            )}
                        </Box>
                        <Box flex="1">
                            <Text fontSize="sm" fontWeight="bold" color="brand.forest">
                                Envío a sucursal
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                                Retiro en correo
                            </Text>
                        </Box>
                        <Text fontSize="sm" fontWeight="bold" color="brand.forest">
                            {subtotal >= 50000 ? "Gratis" : "$10.000"}
                        </Text>
                    </Flex>
                </VStack>
            </Box>

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
