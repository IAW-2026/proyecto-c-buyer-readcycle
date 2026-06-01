"use client"

import { useState, useEffect } from "react"
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
import { MOCK_ORDER_DETAILS } from "@/lib/mockOrders"

// Mock Data generados dinámicamente para coincidir exactamente con sus detalles
const MOCK_ORDERS = Object.values(MOCK_ORDER_DETAILS).map(order => ({
    id: order.id,
    date: order.date,
    status: order.status,
    total: order.total,
    items: order.items.reduce((acc, item) => acc + item.quantity, 0)
}));


export default function ProfilePage() {
    const [orders, setOrders] = useState<any[]>(MOCK_ORDERS);

    useEffect(() => {
        const storedOrders = localStorage.getItem('readcycle_orders');
        if (storedOrders) {
            try {
                const parsed = JSON.parse(storedOrders);
                setOrders([...parsed, ...MOCK_ORDERS]);
            } catch (e) {
                console.error("Error al cargar pedidos guardados:", e);
            }
        }
    }, []);

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
                            {orders.map((order) => (
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
