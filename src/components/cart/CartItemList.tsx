"use client";

import { Box, Button, Flex, IconButton, Image, Text, VStack } from "@chakra-ui/react";
import { LuMinus, LuPlus, LuTrash2 } from "react-icons/lu";

interface CartItemDisplay {
    id: string;
    productId: string;
    title: string;
    author: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartItemListProps {
    items: CartItemDisplay[];
    onUpdateQuantity: (productId: string, delta: number) => void;
    onDelete: (productId: string) => void;
}

export default function CartItemList({ items, onUpdateQuantity, onDelete }: CartItemListProps) {
    if (items.length === 0) {
        return (
            <Flex
                bg="white"
                border="1px solid"
                borderColor="brand.sand"
                borderRadius="brand"
                p={8}
                justify="center"
                align="center"
                direction="column"
                gap={4}
            >
                <Text color="brand.sage" fontSize="lg" fontWeight="semibold">
                    Tu carrito está vacío
                </Text>
            </Flex>
        );
    }

    return (
        <VStack gap={4} align="stretch" mb={4}>
            {items.map((item) => (
                <Flex
                    key={item.id}
                    bg="white"
                    border="1px solid"
                    borderColor="brand.sand"
                    borderRadius="brand"
                    p={3}
                    gap={4}
                    direction={{ base: "column", sm: "row" }}
                >
                    {/* Book Image */}
                    <Box
                        w={{ base: "full", sm: "80px" }}
                        h={{ base: "160px", sm: "112px" }}
                        bgGradient="to-br"
                        gradientFrom="brand.sand"
                        gradientTo="brand.beige"
                        borderRadius="md"
                        flexShrink={0}
                        border="1px solid"
                        borderColor="blackAlpha.100"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        overflow="hidden"
                    >
                        <Image src={item.image} w="full" h="full" objectFit="cover" alt={item.title} />
                    </Box>

                    {/* Book Details */}
                    <Flex direction="column" flex={1} justify="space-between">
                        <Flex justify="space-between" align="flex-start" gap={3}>
                            <Box>
                                <Text
                                    fontFamily="heading"
                                    fontSize="lg"
                                    color="brand.forest"
                                    mb={1}
                                >
                                    {item.title}
                                </Text>
                                <Text color="gray.600" fontSize="xs" mb={2}>
                                    {item.author}
                                </Text>
                            </Box>
                            <Text
                                fontFamily="heading"
                                fontSize="xl"
                                color="brand.forest"
                            >
                                ${item.price.toFixed(2)}
                            </Text>
                        </Flex>

                        {/* Actions: Quantity & Delete */}
                        <Flex
                            justify="space-between"
                            align="center"
                            mt={{ base: 3, sm: 0 }}
                        >
                            <Flex
                                align="center"
                                border="1px solid"
                                borderColor="brand.sand"
                                borderRadius="full"
                                p={0.5}
                            >
                                <IconButton
                                    aria-label="Disminuir cantidad"
                                    variant="ghost"
                                    size="xs"
                                    color="brand.forest"
                                    _hover={{ bg: "brand.sand" }}
                                    borderRadius="full"
                                    onClick={() => onUpdateQuantity(item.productId, -1)}
                                >
                                    <LuMinus />
                                </IconButton>
                                <Text px={3} fontSize="sm" color="brand.forest" fontWeight="medium">
                                    {item.quantity}
                                </Text>
                                <IconButton
                                    aria-label="Aumentar cantidad"
                                    variant="ghost"
                                    size="xs"
                                    color="brand.forest"
                                    _hover={{ bg: "brand.sand" }}
                                    borderRadius="full"
                                    onClick={() => onUpdateQuantity(item.productId, 1)}
                                >
                                    <LuPlus />
                                </IconButton>
                            </Flex>

                            <Button
                                variant="ghost"
                                color="red.500"
                                size="xs"
                                _hover={{ bg: "red.50" }}
                                onClick={() => onDelete(item.productId)}
                                gap={1.5}
                            >
                                <LuTrash2 /> Eliminar
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
            ))}
        </VStack>
    );
}
