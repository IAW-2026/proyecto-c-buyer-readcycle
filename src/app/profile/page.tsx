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
    VStack,
    Spinner
} from "@chakra-ui/react"
import { LuArrowLeft } from "react-icons/lu"
import NextLink from "next/link"

import OrderCard from "@/components/profile/OrderCard"
import AddressSection from "@/components/profile/AddressSection"


export default function ProfilePage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/orders");
                if (!res.ok) {
                    throw new Error("Error al obtener las órdenes");
                }
                const data = await res.json();
                
                // Mapear al formato que espera OrderCard
                const mappedOrders = data.map((o: any) => ({
                    id: o.id,
                    date: o.date,
                    status: o.status,
                    total: o.total,
                    items: o.items.reduce((acc: number, item: any) => acc + item.quantity, 0)
                }));
                
                setOrders(mappedOrders);
            } catch (error) {
                console.error("Error al obtener órdenes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <Box bg="brand.beige" minH="100vh" py={{ base: 8, md: 12 }}>
            <Container maxW="7xl" px={{ base: 4, md: 6 }}>

                {/* Header (Mismo estilo que el carrito) */}
                <Flex align="center" justify="space-between" wrap="wrap" gap={4} mb={6}>
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
                    <a
                        href="https://proyecto-c-payments-readcycle-nlqt.vercel.app/dashboard/disputes"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                    >
                        <Button
                            bg="brand.clay"
                            color="white"
                            _hover={{ bg: "brand.sage" }}
                            fontWeight="semibold"
                            borderRadius="brand"
                            size="md"
                        >
                            ¿Tuviste algún problema con un pago?
                        </Button>
                    </a>
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

                        {isLoading ? (
                            <Flex justify="center" align="center" py={12}>
                                <Spinner size="xl" color="brand.sage" />
                            </Flex>
                        ) : orders.length === 0 ? (
                            <Text color="gray.500" py={8} textAlign="center">
                                No has realizado ninguna compra todavía.
                            </Text>
                        ) : (
                            <VStack gap={4} align="stretch" mb={6}>
                                {orders.map((order) => (
                                    <OrderCard key={order.id} order={order} />
                                ))}
                            </VStack>
                        )}

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
