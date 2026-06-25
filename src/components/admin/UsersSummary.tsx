"use client"

import { Box, Button, Flex, Heading, VStack, Text, Badge } from "@chakra-ui/react"
import { LuUserCog } from "react-icons/lu"

interface UsersSummaryProps {
    totalUsers: number;
    adminCount: number;
    buyerCount: number;
    isAdding: boolean;
    onAddClick: () => void;
}

export default function UsersSummary({
    totalUsers,
    adminCount,
    buyerCount,
    isAdding,
    onAddClick
}: UsersSummaryProps) {
    return (
        <VStack gap={6} align="stretch">
            <Flex h="32px" align="center">
                <Button
                    w="full"
                    bg="brand.sage"
                    color="white"
                    size="sm"
                    fontFamily="heading"
                    fontWeight="600"
                    _hover={{ bg: "brand.forest" }}
                    onClick={onAddClick}
                    disabled={isAdding}
                >
                    + Añadir Usuario
                </Button>
            </Flex>

            <Box
                border="1px solid"
                borderColor="brand.sand"
                borderRadius="brand"
                p={{ base: 6, md: 8 }}
                bg="white"
                position="sticky"
                top="100px"
            >
                <Heading
                    fontFamily="heading"
                    fontSize="xl"
                    color="brand.forest"
                    mb={6}
                    fontWeight="bold"
                    display="flex"
                    alignItems="center"
                    gap={2}
                >
                    <LuUserCog />
                    Resumen
                </Heading>

                <VStack gap={4} align="stretch">
                    <Flex justify="space-between">
                        <Text color="gray.600">Total Usuarios</Text>
                        <Badge bg="brand.clay" color="white" borderRadius="full" px={2}>
                            {totalUsers}
                        </Badge>
                    </Flex>
                    <Flex justify="space-between">
                        <Text color="gray.600">Administradores</Text>
                        <Badge bg="brand.sage" color="white" borderRadius="full" px={2}>
                            {adminCount}
                        </Badge>
                    </Flex>
                    <Flex justify="space-between">
                        <Text color="gray.600">Compradores</Text>
                        <Badge bg="gray.100" color="gray.700" borderRadius="full" px={2}>
                            {buyerCount}
                        </Badge>
                    </Flex>
                </VStack>
            </Box>
        </VStack>
    )
}
