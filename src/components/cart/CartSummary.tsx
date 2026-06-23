"use client";

import { Box, Flex, Heading, Text, VStack, Skeleton, Button } from "@chakra-ui/react";
import { LuShieldCheck, LuTruck } from "react-icons/lu";
// 1. Importamos las herramientas de Mercado Pago
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

// 2. Inicializamos el SDK con tu clave pública (desde .env o fallback de prueba)
const mpPublicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || "TEST-db09695d-ffbb-46f4-8a4e-128a38b1f2e6";
initMercadoPago(mpPublicKey);


interface CartSummaryProps {
    subtotal: number;
    shipping: number;
    total: number;
    onCheckout: () => void;
    isCheckoutDisabled: boolean;
    isCheckingOut: boolean;
    mainAddress: any;
    shippingMethod: "domicilio" | "sucursal";
    onShippingMethodChange?: (method: "domicilio" | "sucursal") => void;
    onSubmitPayment?: () => Promise<any>;
    isCalculatingShipping?: boolean;
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
    onSubmitPayment,
    isCalculatingShipping = false,
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
                        borderColor="brand.forest"
                        borderRadius="brand"
                        bg="rgba(107, 142, 35, 0.05)"
                    >
                        <Box color="brand.forest" mr={3}>
                            <LuTruck size={20} />
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
                            {isCalculatingShipping ? (
                                "Calculando..."
                            ) : (
                                subtotal >= 50000 || shipping === 0 ? "Gratis" : `$${shipping.toLocaleString('es-AR')}`
                            )}
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

            {/* OPCIÓN B: Muestra Mercado Pago si está el ID, sino muestra la animación de carga */}
            <Box mb={8}>
                {!mainAddress ? (
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
                        h="14"
                        onClick={onCheckout}
                        disabled={isCheckingOut}
                    >
                        Registrar dirección de envío
                    </Button>
                ) : onSubmitPayment ? (
                    <Wallet onSubmit={onSubmitPayment} />
                ) : (
                    <Skeleton
                        h="14"
                        borderRadius="brand"
                        css={{
                            "--skeleton-start-color": "colors.brand.sand",
                            "--skeleton-end-color": "colors.gray.200",
                        }}
                    />
                )}
            </Box>

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