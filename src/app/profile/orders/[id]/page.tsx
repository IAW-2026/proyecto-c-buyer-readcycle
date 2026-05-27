import { Box, Button, Container, Heading, Flex, Text, Grid, GridItem, VStack, HStack, Badge, Image } from "@chakra-ui/react"
import { LuArrowLeft, LuPackage, LuCheck, LuClock, LuTruck, LuCreditCard, LuMapPin, LuDollarSign } from "react-icons/lu"
import NextLink from "next/link"
import { notFound } from "next/navigation"

interface OrderDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Mock Database of Order Details
const MOCK_ORDER_DETAILS: Record<string, {
    id: string;
    date: string;
    status: "Entregado" | "En camino" | "Pendiente";
    paymentStatus: "Pagado" | "Pendiente" | "Rechazado";
    shippingStatus: "Entregado" | "Despachado" | "Preparando pedido" | "Pendiente";
    total: number;
    shippingCost: number;
    subtotal: number;
    shippingAddress: {
        calle: string;
        altura: string;
        ciudad: string;
        cp: string;
    };
    items: Array<{
        id: string;
        title: string;
        author: string;
        price: number;
        image: string;
        quantity: number;
    }>;
}> = {
    "ORD-10023": {
        id: "ORD-10023",
        date: "10 de Mayo, 2026",
        status: "Entregado",
        paymentStatus: "Pagado",
        shippingStatus: "Entregado",
        subtotal: 35.50,
        shippingCost: 5.00,
        total: 40.50,
        shippingAddress: {
            calle: "Av. Cabildo",
            altura: "2450",
            ciudad: "CABA",
            cp: "1428"
        },
        items: [
            {
                id: "p1",
                title: "Ficciones",
                author: "Jorge Luis Borges",
                price: 18.00,
                image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
                quantity: 1
            },
            {
                id: "p2",
                title: "El Aleph",
                author: "Jorge Luis Borges",
                price: 17.50,
                image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
                quantity: 1
            }
        ]
    },
    "ORD-10024": {
        id: "ORD-10024",
        date: "12 de Mayo, 2026",
        status: "En camino",
        paymentStatus: "Pagado",
        shippingStatus: "Despachado",
        subtotal: 17.00,
        shippingCost: 5.00,
        total: 22.00,
        shippingAddress: {
            calle: "Av. Corrientes",
            altura: "1800",
            ciudad: "CABA",
            cp: "1042"
        },
        items: [
            {
                id: "p3",
                title: "Rayuela",
                author: "Julio Cortázar",
                price: 17.00,
                image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
                quantity: 1
            }
        ]
    },
    "ORD-10025": {
        id: "ORD-10025",
        date: "13 de Mayo, 2026",
        status: "Pendiente",
        paymentStatus: "Pendiente",
        shippingStatus: "Preparando pedido",
        subtotal: 58.50,
        shippingCost: 5.00,
        total: 63.50,
        shippingAddress: {
            calle: "Av. Santa Fe",
            altura: "3200",
            ciudad: "CABA",
            cp: "1425"
        },
        items: [
            {
                id: "p4",
                title: "Cien años de soledad",
                author: "Gabriel García Márquez",
                price: 22.00,
                image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400",
                quantity: 2
            },
            {
                id: "p5",
                title: "La metamorfosis",
                author: "Franz Kafka",
                price: 14.50,
                image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400",
                quantity: 1
            }
        ]
    }
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

    // Calculate current step index for the progress bar
    const getStepIndex = (currentStatus: string) => {
        if (currentStatus === "Entregado") return 3
        if (currentStatus === "En camino" || currentStatus === "Despachado") return 2
        if (currentStatus === "Preparando pedido") return 1
        return 0
    }
    const currentStepIndex = getStepIndex(order.shippingStatus)

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
                                <VStack gap={6} align="stretch">
                                    {order.items.map((item, index) => (
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
                                            {index < order.items.length - 1 && (
                                                <Box borderBottom="1px solid" borderColor="brand.sand" mt={6} />
                                            )}
                                        </Box>
                                    ))}
                                </VStack>
                            </Box>

                            {/* Shipping Timeline Section */}
                            <Box bg="white" border="1px solid" borderColor="brand.sand" borderRadius="brand" p={6}>
                                <Heading fontSize="xl" color="brand.forest" mb={6} fontWeight="semibold">
                                    Estado del envío
                                </Heading>

                                {/* Timeline layout */}
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
                                        const isCompleted = idx <= currentStepIndex
                                        const isCurrent = idx === currentStepIndex

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
                                        )
                                    })}
                                </VStack>
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
