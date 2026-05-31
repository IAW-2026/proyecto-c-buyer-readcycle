"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
} from "@chakra-ui/react"
import NextLink from "next/link"
import { LuArrowLeft } from "react-icons/lu"

import { mockProducts } from "@/lib/mockProducts"
import CartItemList from "@/components/cart/CartItemList"
import CartSummary from "@/components/cart/CartSummary"

type CartItemDisplay = {
    id: string;
    productId: string;
    title: string;
    author: string;
    price: number;
    quantity: number;
    image: string;
};

export default function CartPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItemDisplay[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        setIsCheckingOut(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al procesar la compra');
            }

            const data = await response.json();
            if (data.success && data.order) {
                // Notificar al Navbar para actualizar contador a 0
                window.dispatchEvent(new Event('cart-updated'));

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
                currentOrderDetails[data.order.id] = data.order;
                localStorage.setItem('readcycle_order_details', JSON.stringify(currentOrderDetails));

                // Redirigir a la pantalla de éxito
                router.push(`/checkout/success?orderId=${data.order.id}`);
            }
        } catch (error: any) {
            console.error("Error al procesar el checkout:", error);
            alert(error.message || "Hubo un problema al procesar tu compra. Por favor, intenta de nuevo.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await fetch('/api/cart');
                const data = await response.json();

                if (data.success && data.carrito) {
                    const mappedItems = data.carrito.items.map((item: any) => {
                        const product = mockProducts.find(p => p.id === item.productId);
                        if (!product) return null;

                        return {
                            id: item.id,
                            productId: item.productId,
                            title: product.title,
                            author: `${product.seller.name} ${product.seller.surname}`,
                            price: product.price,
                            quantity: item.cantidad,
                            image: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || "/images/placeholder.jpg",
                        };
                    }).filter(Boolean) as CartItemDisplay[];

                    setCartItems(mappedItems);
                }
            } catch (error) {
                console.error("Error al obtener el carrito:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCart();
    }, []);

    const handleUpdateQuantity = async (productId: string, delta: number) => {
        const itemIndex = cartItems.findIndex(i => i.productId === productId);
        if (itemIndex === -1) return;

        const currentItem = cartItems[itemIndex];
        const newQuantity = Math.max(1, currentItem.quantity + delta);

        // Optimistic update
        setCartItems(prev => prev.map(item =>
            item.productId === productId ? { ...item, quantity: newQuantity } : item
        ));

        try {
            const response = await fetch('/api/cart', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, cantidad: newQuantity })
            });
            if (response.ok) {
                window.dispatchEvent(new Event('cart-updated'));
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    }

    const handleDelete = async (productId: string) => {
        // Optimistic update
        setCartItems(prev => prev.filter(item => item.productId !== productId));

        try {
            const response = await fetch('/api/cart', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId })
            });
            if (response.ok) {
                window.dispatchEvent(new Event('cart-updated'));
            }
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    }

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    )
    const shipping = cartItems.length > 0 && subtotal < 50000 ? 15000 : 0
    const total = subtotal + shipping

    return (
        <Box bg="brand.beige" minH="100vh" pt={{ base: 8 }}>
            <Container maxW="7xl" px={{ base: 4, md: 6 }}>
                {/* Header */}
                <Flex align="baseline" gap={3} mb={2}>
                    <Stack gap="3" mb="6">
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
                                {cartItems.length === 1 ? "Tu libro" : "Tus " + cartItems.length + " libros"} {cartItems.length === 1 ? "está" : "están"} a un clic de distancia!
                            </Text>
                        </Flex>
                    </Stack>
                </Flex>

                <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
                    {/* Left Column: Cart Items */}
                    <GridItem>
                        <CartItemList
                            items={cartItems}
                            onUpdateQuantity={handleUpdateQuantity}
                            onDelete={handleDelete}
                        />

                        <NextLink href="/" passHref>
                            <Button
                                variant="ghost"
                                color="brand.forest"
                                _hover={{ bg: "brand.sand" }}
                                fontWeight="semibold"
                                px={4}
                                py={2}
                                gap={2}
                            >
                                <LuArrowLeft /> Seguir comprando
                            </Button>
                        </NextLink>
                    </GridItem>

                    {/* Right Column: Order Summary */}
                    <GridItem>
                        <CartSummary
                            subtotal={subtotal}
                            shipping={shipping}
                            total={total}
                            onCheckout={handleCheckout}
                            isCheckoutDisabled={cartItems.length === 0 || isLoading || isCheckingOut}
                            isCheckingOut={isCheckingOut}
                        />
                    </GridItem>
                </Grid>
            </Container>
        </Box>
    )
}

