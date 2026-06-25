"use client";

import { Box, Flex, Text, VStack } from "@chakra-ui/react";

interface ShippingTimelineProps {
    shippingStatus: string;
}

const SHIPPING_STEPS = [
    { key: "Pendiente", label: "Confirmado", desc: "Tu pedido ha sido recibido" },
    { key: "Preparando pedido", label: "Preparando", desc: "El vendedor está empaquetando tus libros" },
    { key: "Despachado", label: "Despachado", desc: "El paquete ya fue entregado al correo" },
    { key: "Entregado", label: "Entregado", desc: "El paquete ha sido entregado en tu domicilio" }
];

const getStepIndex = (currentStatus: string) => {
    if (currentStatus === "Entregado") return 3;
    if (currentStatus === "En camino" || currentStatus === "Despachado") return 2;
    if (currentStatus === "Preparando pedido") return 1;
    return 0;
};

export default function ShippingTimeline({ shippingStatus }: ShippingTimelineProps) {
    const currentStepIndex = getStepIndex(shippingStatus);

    return (
        <VStack align="stretch" gap={6} position="relative" pl={6}>
            {/* Line connecting the steps */}
            <Box
                position="absolute"
                left="7px"
                top="10px"
                bottom="10px"
                w="2px"
                bg="brand.sand"
                zIndex={0}
            />

            {SHIPPING_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                    <Flex key={step.key} align="start" gap={4} zIndex={1} position="relative">
                        {/* Bullet */}
                        <Box
                            w="16px"
                            h="16px"
                            borderRadius="full"
                            bg={isCompleted ? "brand.sage" : "brand.sand"}
                            border="4px solid"
                            borderColor={isCurrent ? "brand.forest" : isCompleted ? "brand.sand" : "white"}
                            mt="4px"
                            ml="-24px"
                            transition="all 0.3s ease"
                        />

                        <VStack align="start" gap={0.5}>
                            <Text
                                fontWeight="semibold"
                                color={isCompleted ? "brand.forest" : "gray.400"}
                                fontSize="md"
                            >
                                {step.label}
                            </Text>
                            <Text color="gray.500" fontSize="sm">
                                {step.desc}
                            </Text>
                        </VStack>
                    </Flex>
                );
            })}
        </VStack>
    );
}
