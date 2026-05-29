"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import NextLink from "next/link"
import {
    Box,
    Button,
    Container,
    Heading,
    Flex,
    Text,
    VStack,
    HStack,
    Badge,
    Image,
    Grid,
    GridItem,
    Spinner,
} from "@chakra-ui/react"
import {
    LuCheck,
    LuShoppingBag,
    LuMapPin,
    LuDollarSign,
    LuArrowRight,
    LuPackage,
} from "react-icons/lu"

interface OrderDetail {
    id: string;
    date: string;
    status: string;
    paymentStatus: string;
    shippingStatus: string;
    subtotal: number;
    shippingCost: number;
    total: number;
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
}

function SuccessContent() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("orderId")
    const [order, setOrder] = useState<OrderDetail | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!orderId) {
            setIsLoading(false)
            return
        }

        // Buscar los detalles de la orden en localStorage
        const storedDetails = localStorage.getItem('readcycle_order_details')
        if (storedDetails) {
            try {
                const parsed = JSON.parse(storedDetails)
                if (parsed[orderId]) {
                    setOrder(parsed[orderId])
                }
            } catch (e) {
                console.error("Error al leer detalles del pedido:", e)
            }
        }
        setIsLoading(false)
    }, [orderId])

    if (isLoading) {
        return (
            <Flex justify="center" align="center" minH="70vh" direction="column" gap={4}>
                <Spinner size="xl" color="brand.sage" />
                <Text color="brand.forest" fontWeight="medium">Cargando detalles de tu compra...</Text>
            </Flex>
        )
    }

    // Fallback en caso de que no encontremos los detalles en localStorage (por ejemplo, si abrieron la URL directamente)
    const displayOrderId = orderId || "ORD-MOCK"
    const displayTotal = order ? order.total : 0
    const displayItems = order ? order.items : []
    const displayAddress = order ? order.shippingAddress : { calle: "Dirección guardada", altura: "", ciudad: "", cp: "" }
    const displayPaymentStatus = order ? order.paymentStatus : "Pagado"

    return (
        <Container maxW="3xl" py={{ base: 10, md: 16 }} px={{ base: 4, md: 6 }}>
            <VStack gap={8} align="stretch">
                {/* Header Card con Icono de Éxito */}
                <Box
                    bg="white"
                    border="1px solid"
                    borderColor="brand.sand"
                    borderRadius="brand"
                    p={{ base: 8, md: 10 }}
                    textAlign="center"
                    boxShadow="sm"
                >
                    <Flex
                        w="16"
                        h="16"
                        bg="green.50"
                        color="green.600"
                        borderRadius="full"
                        align="center"
                        justify="center"
                        mx="auto"
                        mb={6}
                    >
                        <LuCheck size={36} />
                    </Flex>

                    <Heading
                        fontSize={{ base: "3xl", md: "4xl" }}
                        color="brand.forest"
                        fontWeight="800"
                        mb={2}
                    >
                        ¡Compra realizada con éxito!
                    </Heading>
                    <Text color="gray.600" fontSize="lg" maxW="lg" mx="auto" mb={6}>
                        Muchas gracias por tu compra en ReadCycle. Hemos recibido tu pedido y el vendedor ya fue notificado.
                    </Text>

                    <Flex
                        direction={{ base: "column", sm: "row" }}
                        gap={4}
                        justify="center"
                        align="center"
                        bg="brand.beige"
                        p={4}
                        borderRadius="md"
                        border="1px solid"
                        borderColor="brand.sand"
                    >
                        <VStack gap={1} align={{ base: "center", sm: "start" }}>
                            <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">
                                Número de Orden
                            </Text>
                            <Text fontSize="lg" color="brand.forest" fontWeight="bold" fontFamily="mono">
                                {displayOrderId}
                            </Text>
                        </VStack>

                        <Box w={{ base: "full", sm: "1px" }} h={{ base: "1px", sm: "40px" }} bg="brand.sand" />

                        <VStack gap={1} align={{ base: "center", sm: "start" }}>
                            <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">
                                Estado del Pago
                            </Text>
                            <Badge
                                bg="green.50"
                                color="green.600"
                                px={3}
                                py={1}
                                borderRadius="full"
                                display="flex"
                                alignItems="center"
                                gap={1}
                            >
                                <LuDollarSign size={12} />
                                <Text fontSize="xs" fontWeight="bold">{displayPaymentStatus}</Text>
                            </Badge>
                        </VStack>

                        {displayTotal > 0 && (
                            <>
                                <Box w={{ base: "full", sm: "1px" }} h={{ base: "1px", sm: "40px" }} bg="brand.sand" />
                                <VStack gap={1} align={{ base: "center", sm: "start" }}>
                                    <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">
                                        Total Pagado
                                    </Text>
                                    <Text fontSize="lg" color="brand.forest" fontWeight="bold">
                                        ${displayTotal.toFixed(2)}
                                    </Text>
                                </VStack>
                            </>
                        )}
                    </Flex>
                </Box>

                {/* Detalles de la orden si están disponibles */}
                {order && (
                    <Box
                        bg="white"
                        border="1px solid"
                        borderColor="brand.sand"
                        borderRadius="brand"
                        p={6}
                        boxShadow="sm"
                    >
                        <Heading fontSize="xl" color="brand.forest" mb={6} fontWeight="bold">
                            Resumen de productos
                        </Heading>
                        <VStack gap={4} align="stretch" mb={6}>
                            {displayItems.map((item) => (
                                <Flex key={item.id} justify="space-between" align="center" gap={4}>
                                    <HStack gap={4}>
                                        <Box
                                            w="50px"
                                            h="70px"
                                            borderRadius="sm"
                                            overflow="hidden"
                                            flexShrink={0}
                                            border="1px solid"
                                            borderColor="brand.sand"
                                        >
                                            <Image src={item.image} alt={item.title} w="100%" h="100%" objectFit="cover" />
                                        </Box>
                                        <VStack align="start" gap={0.5}>
                                            <Text fontWeight="semibold" color="brand.forest" fontSize="sm" lineBreak="anywhere" lineClamp={1}>
                                                {item.title}
                                            </Text>
                                            <Text color="brand.sage" fontSize="xs">
                                                {item.author}
                                            </Text>
                                            <Text color="gray.500" fontSize="xs">
                                                Cantidad: {item.quantity}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                    <Text fontWeight="bold" color="brand.forest" fontSize="md">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </Text>
                                </Flex>
                            ))}
                        </VStack>

                        <Box borderBottom="1px solid" borderColor="brand.sand" my={4} />

                        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} pt={2}>
                            <GridItem>
                                <HStack align="start" gap={3}>
                                    <Box mt={0.5} color="brand.sage">
                                        <LuMapPin size={18} />
                                    </Box>
                                    <VStack align="start" gap={0.5}>
                                        <Text fontSize="xs" color="gray.500" fontWeight="bold">Dirección de Entrega</Text>
                                        <Text fontWeight="semibold" color="brand.forest" fontSize="sm">
                                            {displayAddress.calle} {displayAddress.altura}
                                        </Text>
                                        <Text color="gray.600" fontSize="xs">
                                            {displayAddress.ciudad}, CP {displayAddress.cp}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </GridItem>
                            <GridItem>
                                <HStack align="start" gap={3}>
                                    <Box mt={0.5} color="brand.sage">
                                        <LuPackage size={18} />
                                    </Box>
                                    <VStack align="start" gap={0.5}>
                                        <Text fontSize="xs" color="gray.500" fontWeight="bold">Método de Envío</Text>
                                        <Text fontWeight="semibold" color="brand.forest" fontSize="sm">
                                            Envío estándar a domicilio
                                        </Text>
                                        <Text color="gray.600" fontSize="xs">
                                            Llega en 3 a 5 días hábiles
                                        </Text>
                                    </VStack>
                                </HStack>
                            </GridItem>
                        </Grid>
                    </Box>
                )}

                {/* Botones de Acción */}
                <Flex
                    direction={{ base: "column", sm: "row" }}
                    gap={4}
                    justify="center"
                    align="stretch"
                >
                    <NextLink href="/" passHref style={{ flex: 1 }}>
                        <Button
                            w="full"
                            size="lg"
                            bg="brand.clay"
                            color="white"
                            borderRadius="brand"
                            fontFamily="heading"
                            fontWeight="semibold"
                            _hover={{ bg: "#c66a4e" }}
                            h="14"
                            gap={2}
                        >
                            Volver a la tienda <LuArrowRight size={18} />
                        </Button>
                    </NextLink>

                    <NextLink href="/profile" passHref style={{ flex: 1 }}>
                        <Button
                            w="full"
                            size="lg"
                            variant="outline"
                            borderColor="brand.sage"
                            color="brand.forest"
                            borderRadius="brand"
                            fontFamily="heading"
                            fontWeight="semibold"
                            _hover={{ bg: "brand.sand" }}
                            h="14"
                            gap={2}
                        >
                            <LuShoppingBag size={18} /> Ver mis pedidos
                        </Button>
                    </NextLink>
                </Flex>
            </VStack>
        </Container>
    )
}

export default function CheckoutSuccessPage() {
    return (
        <Box bg="brand.beige" minH="100vh" py={{ base: 4, md: 8 }}>
            <Suspense fallback={
                <Flex justify="center" align="center" minH="70vh">
                    <Spinner size="xl" color="brand.sage" />
                </Flex>
            }>
                <SuccessContent />
            </Suspense>
        </Box>
    )
}
