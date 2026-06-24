"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import NextLink from "next/link"
import { toaster } from "@/components/ui/toaster"
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
    LuX,
} from "react-icons/lu"

interface OrderDetail {
    id: string;
    date: string;
    status: string;
    paymentStatus: string;
    shippingStatus: string;
    shippingMethod?: "domicilio" | "sucursal";
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
    const router = useRouter()
    const orderId = searchParams.get("orderId")
    const [order, setOrder] = useState<OrderDetail | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isPaymentFailed, setIsPaymentFailed] = useState(false)
    const confirmed = useRef(false)

    useEffect(() => {
        const paymentStatus = searchParams.get("status")
        const preferenceId = searchParams.get("preference_id")
        const shippingMethod = (searchParams.get("shippingMethod") as "domicilio" | "sucursal") || "domicilio"
        const sellerOrderId = searchParams.get("sellerOrderId")

        if (paymentStatus === "rejected" || paymentStatus === "failure" || paymentStatus === "cancelled") {
            setIsPaymentFailed(true);
            setIsLoading(false);
            return;
        }

        if (orderId) {
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
            return
        }

        // Si no hay orderId pero viene de Mercado Pago (status approved/pending/in_process)
        if ((paymentStatus === "approved" || paymentStatus === "pending" || paymentStatus === "in_process") && preferenceId) {
            if (confirmed.current) return
            confirmed.current = true

            const confirmCheckout = async () => {
                try {
                    const response = await fetch('/api/checkout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ shippingMethod, orderId: sellerOrderId }),
                    });

                    if (!response.ok) {
                        const err = await response.json().catch(() => ({}));
                        throw new Error(err.error || 'Error al procesar la compra');
                    }

                    const data = await response.json();
                    if (data.success && data.order) {
                        // Guardar orden resumida en localStorage para listarla en el Perfil
                        const currentOrders = JSON.parse(localStorage.getItem('readcycle_orders') || '[]');
                        const newOrderListItem = {
                            id: data.order.id,
                            date: data.order.date,
                            status: data.order.status,
                            total: data.order.total,
                            items: data.order.items.reduce((acc: number, item: any) => acc + item.quantity, 0),
                        };
                        localStorage.setItem('readcycle_orders', JSON.stringify([newOrderListItem, ...currentOrders]));

                        // Guardar detalle completo de la orden en localStorage
                        const currentOrderDetails = JSON.parse(localStorage.getItem('readcycle_order_details') || '{}');
                        
                        // Parsear y normalizar el estado del pago real desde Mercado Pago
                        let finalPaymentStatus = "Pagado";
                        if (paymentStatus === "pending" || paymentStatus === "in_process") {
                            finalPaymentStatus = "Pendiente";
                        } else if (paymentStatus && paymentStatus !== "approved") {
                            finalPaymentStatus = "Rechazado";
                        }

                        const finalOrder = {
                            ...data.order,
                            paymentStatus: finalPaymentStatus
                        };
                        currentOrderDetails[data.order.id] = finalOrder;
                        localStorage.setItem('readcycle_order_details', JSON.stringify(currentOrderDetails));

                        setOrder(finalOrder);

                        // Notificar al Navbar para actualizar contador a 0
                        window.dispatchEvent(new Event('cart-updated'));

                        // Limpiar la URL y agregar el orderId generado
                        router.replace(`/checkout/success?orderId=${data.order.id}`);
                    }
                } catch (error) {
                    console.error("Error al confirmar la compra con Mercado Pago:", error);
                    toaster.create({
                        title: "Error al confirmar la compra",
                        description: "Ocurrió un error al procesar tu compra. Por favor, ponte en contacto con soporte.",
                        type: "error",
                        duration: 6000,
                    });
                } finally {
                    setIsLoading(false)
                }
            };

            confirmCheckout()
        } else {
            setIsLoading(false)
        }
    }, [searchParams, router])

    if (isLoading) {
        return (
            <Flex justify="center" align="center" minH="70vh" direction="column" gap={4}>
                <Spinner size="xl" color="brand.sage" />
                <Text color="brand.forest" fontWeight="medium">Cargando detalles de tu compra...</Text>
            </Flex>
        )
    }

    if (isPaymentFailed) {
        return (
            <Container maxW="3xl" py={{ base: 10, md: 16 }} px={{ base: 4, md: 6 }}>
                <VStack gap={8} align="stretch">
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
                            bg="red.50"
                            color="red.600"
                            borderRadius="full"
                            align="center"
                            justify="center"
                            mx="auto"
                            mb={6}
                        >
                            <LuX size={36} />
                        </Flex>

                        <Heading
                            fontSize={{ base: "3xl", md: "4xl" }}
                            color="brand.clay"
                            fontWeight="800"
                            mb={2}
                        >
                            Pago Rechazado
                        </Heading>
                        <Text color="gray.600" fontSize="lg" maxW="lg" mx="auto" mb={6}>
                            El pago a través de Mercado Pago no pudo ser procesado. No se ha realizado ningún cargo en tu cuenta.
                        </Text>
                        <Text color="gray.500" fontSize="md" maxW="md" mx="auto">
                            Tus libros siguen guardados en el carrito para que puedas intentar nuevamente utilizando otro medio de pago.
                        </Text>
                    </Box>

                    {/* Botones de Acción */}
                    <Flex
                        direction={{ base: "column", sm: "row" }}
                        gap={4}
                        justify="center"
                        align="stretch"
                    >
                        <NextLink href="/cart" passHref style={{ flex: 1 }}>
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
                                Volver al carrito <LuArrowRight size={18} />
                            </Button>
                        </NextLink>

                        <NextLink href="/" passHref style={{ flex: 1 }}>
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
                            >
                                Volver a la tienda
                            </Button>
                        </NextLink>
                    </Flex>
                </VStack>
            </Container>
        )
    }

    // Fallback en caso de que no encontremos los detalles en localStorage (por ejemplo, si abrieron la URL directamente)
    const displayOrderId = orderId || "ORD-MOCK"
    const displayTotal = order ? order.total : 0
    const displayItems = order ? order.items : []
    const displayAddress = order ? order.shippingAddress : { calle: "Dirección guardada", altura: "", ciudad: "", cp: "" }
    const displayPaymentStatus = order ? order.paymentStatus : "Pagado"

    const badgeProps = (() => {
        const status = displayPaymentStatus.toLowerCase();
        if (status === "approved" || status === "aprobado" || status === "pagado") {
            return { bg: "green.50", color: "green.600", text: "Aprobado" };
        }
        if (status === "pending" || status === "pendiente" || status === "in_process" || status === "en proceso") {
            return { bg: "yellow.50", color: "yellow.700", text: "Pendiente" };
        }
        if (status === "rejected" || status === "rechazado" || status === "failure") {
            return { bg: "red.50", color: "red.600", text: "Rechazado" };
        }
        return { bg: "gray.50", color: "gray.600", text: displayPaymentStatus };
    })();

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
                                bg={badgeProps.bg}
                                color={badgeProps.color}
                                px={3}
                                py={1}
                                borderRadius="full"
                                display="flex"
                                alignItems="center"
                                gap={1}
                            >
                                <LuDollarSign size={12} />
                                <Text fontSize="xs" fontWeight="bold">{badgeProps.text}</Text>
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
                                        <Text fontSize="xs" color="gray.500" fontWeight="bold">
                                            {order?.shippingMethod === "sucursal" ? "Punto de Retiro" : "Dirección de Entrega"}
                                        </Text>
                                        <Text fontWeight="semibold" color="brand.forest" fontSize="sm">
                                            {order?.shippingMethod === "sucursal"
                                                ? `Sucursal de ${order.items[0]?.author || "Vendedor"}`
                                                : `${displayAddress.calle} ${displayAddress.altura}`
                                            }
                                        </Text>
                                        <Text color="gray.600" fontSize="xs">
                                            {order?.shippingMethod === "sucursal"
                                                ? "Coordinar retiro con el vendedor"
                                                : `${displayAddress.ciudad}, CP ${displayAddress.cp}`
                                            }
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
                                            {order?.shippingMethod === "sucursal" ? "Retiro en sucursal" : "Envío estándar a domicilio"}
                                        </Text>
                                        <Text color="gray.600" fontSize="xs">
                                            {order?.shippingMethod === "sucursal" ? "Listo para retirar en 1 a 2 días hábiles" : "Llega en 3 a 5 días hábiles"}
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
