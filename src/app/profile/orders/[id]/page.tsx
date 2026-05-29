"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Box, Button, Container, Heading, Flex, Text, Grid, GridItem, VStack, HStack, Badge, Skeleton } from "@chakra-ui/react"
import { LuArrowLeft, LuPackage, LuCheck, LuClock, LuTruck, LuMapPin, LuDollarSign } from "react-icons/lu"
import NextLink from "next/link"
import { notFound } from "next/navigation"

import { MOCK_ORDER_DETAILS } from "@/lib/mockOrders"
import ShippingTimeline from "@/components/profile/ShippingTimeline"
import OrderItemsList from "@/components/profile/OrderItemsList"

interface OrderDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Helpers for Status Colors and Icons
const getStatusBadgeConfig = (status: string) => {
    switch (status) {
        case "Entregado": return { icon: LuCheck, color: "green.600", bg: "green.50", label: "Entregado" }
        case "En camino": return { icon: LuTruck, color: "blue.600", bg: "blue.50", label: "En camino" }
        case "Pendiente": return { icon: LuClock, color: "orange.600", bg: "orange.50", label: "Pendiente" }
        default: return { icon: LuPackage, color: "gray.600", bg: "gray.50", label: "Procesando" }
    }
}

const getPaymentBadgeConfig = (status: string) => {
    switch (status) {
        case "Pagado": return { color: "green.600", bg: "green.50", label: "Pagado" }
        case "Pendiente": return { color: "orange.600", bg: "orange.50", label: "Pendiente de pago" }
        case "Rechazado": return { color: "red.600", bg: "red.50", label: "Rechazado" }
        default: return { color: "gray.600", bg: "gray.50", label: "Desconocido" }
    }
}

// Define the steps for shipping tracking
const SHIPPING_STEPS = [
    { key: "Pendiente", label: "Confirmado", desc: "Tu pedido ha sido recibido" },
    { key: "Preparando pedido", label: "Preparando", desc: "El vendedor está empaquetando tus libros" },
    { key: "Despachado", label: "Despachado", desc: "El paquete ya fue entregado al correo" },
    { key: "Entregado", label: "Entregado", desc: "El paquete ha sido entregado en tu domicilio" }
]

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { id } = await params
    const order = MOCK_ORDER_DETAILS[id]

    if (!order) {
        notFound()
    }

    const statusBadge = getStatusBadgeConfig(order.status)
    const StatusIcon = statusBadge.icon
    const paymentBadge = getPaymentBadgeConfig(order.paymentStatus)

    return (
        <Box bg="brand.beige" minH="100vh" py={{ base: 8, md: 12 }}>
            <Container maxW="7xl" px={{ base: 4, md: 6 }}>
                {/* Back button */}
                <NextLink href="/profile" passHref>
                    <Button
                        variant="ghost"
                        color="brand.forest"
                        _hover={{ bg: "brand.sand" }}
                        fontWeight="semibold"
                        mb={6}
                        display="flex"
                        alignItems="center"
                        gap={2}
                    >
                        <LuArrowLeft /> Volver a mi perfil
                    </Button>
                </NextLink>

                {/* Header Section */}
                <Box bg="white" border="1px solid" borderColor="brand.sand" borderRadius="brand" p={6} mb={8}>
                    <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "start", md: "center" }} gap={4}>
                        <VStack align="start" gap={1}>
                            <HStack gap={3}>
                                <Heading fontSize="3xl" color="brand.forest" fontWeight="800">
                                    Orden #{order.id}
                                </Heading>
                                <Badge bg={statusBadge.bg} color={statusBadge.color} display="flex" alignItems="center" gap={1} px={3} py={1} borderRadius="full">
                                    <StatusIcon size={14} />
                                    <Text fontSize="xs" fontWeight="bold">{statusBadge.label}</Text>
                                </Badge>
                            </HStack>
                            <Text color="gray.500" fontSize="sm">
                                Realizada el {order.date}
                            </Text>
                        </VStack>
                        <VStack align={{ base: "start", md: "end" }} gap={1}>
                            <Text fontSize="sm" color="gray.500">Monto total</Text>
                            <Text fontSize="3xl" fontWeight="bold" color="brand.forest">
                                ${order.total.toFixed(2)}
                            </Text>
                        </VStack>
                    </Flex>
                </Box>

                {/* Main Content Layout */}
                <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>

                    {/* Left Column: Products & Shipping Timeline */}
                    <GridItem>
                        <VStack gap={8} align="stretch">
                            {/* Products Section */}
                            <Box bg="white" border="1px solid" borderColor="brand.sand" borderRadius="brand" p={6}>
                                <Heading fontSize="xl" color="brand.forest" mb={6} fontWeight="semibold">
                                    Productos en esta orden
                                </Heading>
                                <OrderItemsList items={order.items} />
                            </Box>

                            {/* Shipping Timeline Section */}
                            <Box bg="white" border="1px solid" borderColor="brand.sand" borderRadius="brand" p={6}>
                                <Heading fontSize="xl" color="brand.forest" mb={6} fontWeight="semibold">
                                    Estado del envío
                                </Heading>
                                <ShippingTimeline shippingStatus={order.shippingStatus} />
                            </Box>
                        </VStack>
                    </GridItem>

                    {/* Right Column: Address and Payment Info */}
                    <GridItem>
                        <VStack gap={8} align="stretch">
                            {/* Cost Summary Card */}
                            <Box bg="white" border="1px solid" borderColor="brand.sand" borderRadius="brand" p={6}>
                                <Heading fontSize="xl" color="brand.forest" mb={6} fontWeight="semibold">
                                    Resumen del pago
                                </Heading>
                                <VStack gap={4} align="stretch">
                                    <Flex justify="space-between" fontSize="sm">
                                        <Text color="gray.500">Subtotal</Text>
                                        <Text fontWeight="medium" color="brand.forest">${order.subtotal.toFixed(2)}</Text>
                                    </Flex>
                                    <Flex justify="space-between" fontSize="sm">
                                        <Text color="gray.500">Envío</Text>
                                        <Text fontWeight="medium" color="brand.forest">${order.shippingCost.toFixed(2)}</Text>
                                    </Flex>
                                    <Box borderBottom="1px solid" borderColor="brand.sand" my={1} />
                                    <Flex justify="space-between" fontSize="lg" fontWeight="bold">
                                        <Text color="brand.forest">Total</Text>
                                        <Text color="brand.forest">${order.total.toFixed(2)}</Text>
                                    </Flex>
                                    <Box borderBottom="1px solid" borderColor="brand.sand" my={1} />

                                    <VStack align="stretch" gap={2}>
                                        <Text fontSize="xs" color="gray.500" fontWeight="bold">Estado del pago</Text>
                                        <Badge
                                            alignSelf="flex-start"
                                            bg={paymentBadge.bg}
                                            color={paymentBadge.color}
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                            display="flex"
                                            alignItems="center"
                                            gap={1.5}
                                        >
                                            <LuDollarSign size={12} />
                                            <Text fontSize="xs" fontWeight="bold">{paymentBadge.label}</Text>
                                        </Badge>
                                    </VStack>
                                </VStack>
                            </Box>

                            {/* Shipping Details Card */}
                            <Box bg="white" border="1px solid" borderColor="brand.sand" borderRadius="brand" p={6}>
                                <Heading fontSize="xl" color="brand.forest" mb={6} fontWeight="semibold">
                                    Detalles de entrega
                                </Heading>
                                <VStack align="stretch" gap={4}>
                                    <HStack align="start" gap={3}>
                                        <Box mt={1} color="brand.sage">
                                            <LuMapPin size={20} />
                                        </Box>
                                        <VStack align="start" gap={0.5}>
                                            <Text fontSize="xs" color="gray.500" fontWeight="bold">Dirección de envío</Text>
                                            <Text fontWeight="semibold" color="brand.forest" fontSize="md">
                                                {order.shippingAddress.calle} {order.shippingAddress.altura}
                                            </Text>
                                            <Text color="gray.600" fontSize="sm">
                                                {order.shippingAddress.ciudad}, CP {order.shippingAddress.cp}
                                            </Text>
                                        </VStack>
                                    </HStack>

                                    <HStack align="start" gap={3}>
                                        <Box mt={1} color="brand.sage">
                                            <LuPackage size={20} />
                                        </Box>
                                        <VStack align="start" gap={0.5}>
                                            <Text fontSize="xs" color="gray.500" fontWeight="bold">Método de entrega</Text>
                                            <Text fontWeight="semibold" color="brand.forest" fontSize="sm">
                                                Envío estándar a domicilio
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </VStack>
                            </Box>
                        </VStack>
                    </GridItem>
                </Grid>
            </Container>
        </Box>
    )
}

