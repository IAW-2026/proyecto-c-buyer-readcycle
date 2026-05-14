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
    HStack,
    IconButton,
    Input,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react"
import NextLink from "next/link"
import {
    LuArrowLeft,
    LuMinus,
    LuPlus,
    LuShieldCheck,
    LuTrash2,
    LuTruck,
} from "react-icons/lu"

const INITIAL_CART_ITEMS = [
    {
        id: 1,
        title: "El Aleph",
        author: "Jorge Luis Borges",
        condition: "Excelente estado",
        price: 18.50,
        quantity: 1,
    },
    {
        id: 2,
        title: "Rayuela",
        author: "Julio Cortázar",
        condition: "Primera Edición (Colección)",
        price: 45.00,
        quantity: 1,
    },
    {
        id: 3,
        title: "Ficciones",
        author: "Jorge Luis Borges",
        condition: "Buen estado",
        price: 22.00,
        quantity: 1,
    },
]

export default function CartPage() {
    const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS)

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await fetch('/api/cart');
                const data = await response.json();
                console.log("Carrito del usuario logueado:", data);
            } catch (error) {
                console.error("Error al obtener el carrito:", error);
            }
        };

        fetchCart();
    }, []);

    const handleUpdateQuantity = (id: number, delta: number) => {
        setCartItems((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQuantity = Math.max(1, item.quantity + delta)
                    return { ...item, quantity: newQuantity }
                }
                return item
            })
        )
    }

    const handleDelete = (id: number) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id))
    }

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    )
    const shipping = cartItems.length > 0 ? 5.00 : 0
    const total = subtotal + shipping

    return (
        <Box bg="brand.beige" minH="100vh" py={{ base: 8, md: 12 }}>
            <Container maxW="7xl" px={{ base: 4, md: 6 }}>
                {/* Header */}
                <Flex align="baseline" gap={3} mb={8}>
                    <Stack gap="3" mb="12">
                        <Heading
                            fontSize="5xl"
                            color="brand.forest"
                            fontWeight="800"
                        >
                            Tu Carrito
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
                                Tus {cartItems.length} {cartItems.length === 1 ? "libro está" : "libros están"} a un clic de distancia!
                            </Text>
                        </Flex>
                    </Stack>
                </Flex>

                <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
                    {/* Left Column: Cart Items */}
                    <GridItem>
                        <VStack gap={4} align="stretch" mb={8}>
                            {cartItems.map((item) => (
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
                                    {/* Book Image Placeholder */}
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
                                    >
                                        <Text color="brand.sage" fontSize="xs" fontWeight="bold" opacity={0.5}>
                                            IMAGEN
                                        </Text>
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
                                                <Box
                                                    display="inline-block"
                                                    bg="brand.sand"
                                                    px={2}
                                                    py={0.5}
                                                    borderRadius="full"
                                                >
                                                    <Text
                                                        fontSize="xs"
                                                        color="brand.sage"
                                                        fontWeight="medium"
                                                    >
                                                        {item.condition}
                                                    </Text>
                                                </Box>
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
                                                    onClick={() => handleUpdateQuantity(item.id, -1)}
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
                                                    onClick={() => handleUpdateQuantity(item.id, 1)}
                                                >
                                                    <LuPlus />
                                                </IconButton>
                                            </Flex>

                                            <Button
                                                variant="ghost"
                                                color="red.500"
                                                size="xs"
                                                _hover={{ bg: "red.50" }}
                                                onClick={() => handleDelete(item.id)}
                                                gap={1.5}
                                            >
                                                <LuTrash2 /> Eliminar
                                            </Button>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            ))}

                            {cartItems.length === 0 && (
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
                                    <Text color="brand.sage" fontSize="lg" fontWeight="semibold">Tu carrito está vacío</Text>
                                </Flex>
                            )}
                        </VStack>

                        <NextLink href="/" passHref>
                            <Button
                                variant="ghost"
                                color="brand.forest"
                                _hover={{ bg: "brand.sand" }}
                                fontWeight="semibold"
                                px={4}
                                gap={2}
                            >
                                <LuArrowLeft /> Seguir comprando
                            </Button>
                        </NextLink>
                    </GridItem>

                    {/* Right Column: Order Summary */}
                    <GridItem>
                        <Box
                            border="1px solid"
                            borderColor="brand.sand"
                            borderRadius="brand"
                            p={{ base: 6, md: 8 }}
                            bg="transparent"
                        >
                            <Heading
                                fontFamily="heading"
                                fontSize="2xl"
                                color="brand.forest"
                                mb={8}
                                fontWeight="normal"
                            >
                                Resumen del pedido
                            </Heading>

                            <VStack gap={4} align="stretch" mb={6}>
                                <Flex justify="space-between">
                                    <Text color="gray.600">Subtotal</Text>
                                    <Text color="brand.forest" fontWeight="semibold">
                                        ${subtotal.toFixed(2)}
                                    </Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text color="gray.600">Envío</Text>
                                    <Text color="brand.forest" fontWeight="semibold">
                                        ${shipping.toFixed(2)}
                                    </Text>
                                </Flex>
                            </VStack>

                            <Box borderBottom="1px solid" borderColor="brand.sand" mb={6} />

                            <Flex justify="space-between" align="center" mb={8}>
                                <Text fontSize="xl" color="brand.forest">
                                    Total
                                </Text>
                                <Text
                                    fontSize="4xl"
                                    fontFamily="heading"
                                    color="brand.forest"
                                    fontWeight="bold"
                                >
                                    ${total.toFixed(2)}
                                </Text>
                            </Flex>

                            <Button
                                w="full"
                                size="lg"
                                bg="brand.clay"
                                color="white"
                                borderRadius="brand"
                                fontFamily="heading"
                                fontSize="lg"
                                fontWeight="semibold"
                                _hover={{ bg: "#c66a4e" }}
                                mb={8}
                                h="14"
                            >
                                Finalizar compra
                            </Button>

                            <VStack align="start" gap={3}>
                                <Flex align="center" gap={3}>
                                    <Box color="brand.forest">
                                        <LuTruck size={20} />
                                    </Box>
                                    <Text fontSize="sm" color="gray.600">
                                        Envío gratis en compras mayores a $150
                                    </Text>
                                </Flex>
                                <Flex align="center" gap={3}>
                                    <Box color="brand.forest">
                                        <LuShieldCheck size={20} />
                                    </Box>
                                    <Text fontSize="sm" color="gray.600">
                                        Pago seguro y encriptado
                                    </Text>
                                </Flex>
                            </VStack>
                        </Box>
                    </GridItem>
                </Grid>
            </Container>
        </Box>
    )
}
