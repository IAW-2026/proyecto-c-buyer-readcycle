"use client";

import { Box, Flex, HStack, Image, Text, VStack } from "@chakra-ui/react";

interface OrderItem {
    id: string;
    title: string;
    author: string;
    price: number;
    image: string;
    quantity: number;
}

interface OrderItemsListProps {
    items: OrderItem[];
}

export default function OrderItemsList({ items }: OrderItemsListProps) {
    return (
        <VStack gap={6} align="stretch">
            {items.map((item, index) => (
                <Box key={item.id}>
                    <Flex justify="space-between" align="center" direction={{ base: "column", sm: "row" }} gap={4}>
                        <HStack gap={4} flex="1">
                            <Box w="60px" h="80px" borderRadius="sm" overflow="hidden" flexShrink={0} border="1px solid" borderColor="brand.sand">
                                <Image src={item.image} alt={item.title} w="100%" h="100%" objectFit="cover" />
                            </Box>
                            <VStack align="start" gap={0.5}>
                                <Text fontWeight="semibold" color="brand.forest" fontSize="md">
                                    {item.title}
                                </Text>
                                <Text color="brand.sage" fontSize="sm">
                                    {item.author}
                                </Text>
                                <Text color="gray.500" fontSize="xs">
                                    Cantidad: {item.quantity}
                                </Text>
                            </VStack>
                        </HStack>
                        <Text fontWeight="bold" color="brand.forest" fontSize="lg">
                            ${(item.price * item.quantity).toFixed(2)}
                        </Text>
                    </Flex>
                    {index < items.length - 1 && (
                        <Box borderBottom="1px solid" borderColor="brand.sand" mt={6} />
                    )}
                </Box>
            ))}
        </VStack>
    );
}
