"use client"

import {
    Box,
    Button,
    Container,
    Flex,
    Grid,
    GridItem,
    Heading,
    Stack,
    Text,
    VStack
} from "@chakra-ui/react"
import { LuArrowLeft } from "react-icons/lu"
import NextLink from "next/link"

import OrderCard from "@/components/profile/OrderCard"
import AddressSection from "@/components/profile/AddressSection"

// Mock Data
const MOCK_ORDERS = [
    { id: "ORD-10023", date: "10 de Mayo, 2026", status: "Entregado", total: 40.50, items: 2 },
    { id: "ORD-10024", date: "12 de Mayo, 2026", status: "En camino", total: 22.00, items: 1 },
    { id: "ORD-10025", date: "13 de Mayo, 2026", status: "Pendiente", total: 63.50, items: 3 },
]

export default function ProfilePage() {



    return (
        <Box bg="brand.beige" minH="100vh" py={{ base: 8, md: 12 }}>
            <Container maxW="7xl" px={{ base: 4, md: 6 }}>

                {/* Header (Mismo estilo que el carrito) */}
                <Flex align="baseline" gap={3} mb={4}>
                    <Stack gap="3">
                        <Heading
                            fontSize="5xl"
                            color="brand.forest"
                            fontWeight="800"
                        >
                            Mi Perfil
                        </Heading>
                        <Flex align="center" gap="4">
                            <Box
                                w="50px"
                                h="3px"
                                bg="brand.clay"
                                borderRadius="full"
                            />
                            <Text
                                color="gray.600"
                                fontSize="lg"
                            >
                                Gestiona tus direcciones e historial de compras.
                            </Text>
                        </Flex>
                    </Stack>
                </Flex>

                <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>

                    {/* Panel Central: Historial de Órdenes */}
                    <GridItem>
                        <Heading
                            fontFamily="heading"
                            fontSize="2xl"
                            color="brand.forest"
                            mb={6}
                            fontWeight="normal"
                        >
                            Historial de Compras
                        </Heading>

                        <VStack gap={4} align="stretch" mb={6}>
                            {MOCK_ORDERS.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))}
                        </VStack>

                        {/* Botón Volver a la Tienda */}
                        <NextLink href="/" passHref>
                            <Button
                                variant="ghost"
                                color="brand.forest"
                                _hover={{ bg: "brand.sand" }}
                                fontWeight="semibold"
                                display="inline-flex"
                                alignItems="center"
                                gap={2}
                            >
                                <LuArrowLeft /> Volver a la tienda
                            </Button>
                        </NextLink>
                    </GridItem>

                    {/* Panel Lateral: Gestión de Direcciones */}
                    <GridItem>
                        <Heading
                            fontFamily="heading"
                            fontSize="2xl"
                            color="brand.forest"
                            mb={6}
                            fontWeight="normal"
                        >
                            Mis Direcciones
                        </Heading>

                        <AddressSection />
                    </GridItem>
                </Grid>
            </Container>
        </Box>
    )
}
