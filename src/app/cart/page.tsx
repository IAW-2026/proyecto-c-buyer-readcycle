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
import { useUser } from "@clerk/nextjs"

import CartItemList from "@/components/cart/CartItemList"
import CartSummary from "@/components/cart/CartSummary"
import { toaster } from "@/components/ui/toaster"

type CartItemDisplay = {
    id: string;
    productId: string;
    title: string;
    author: string;
    price: number;
    quantity: number;
    image: string;
    sellerId: string;
    weight?: number; // Opcional, por si lo agregas al mock más adelante
};

export default function CartPage() {
    const router = useRouter();
    const { isLoaded, isSignedIn, user } = useUser();
    const [cartItems, setCartItems] = useState<CartItemDisplay[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [shippingMethod, setShippingMethod] = useState<"domicilio" | "sucursal">("domicilio");
    const [mainAddress, setMainAddress] = useState<any>(null);

    // --- NUEVO ESTADO PARA EL ENVÍO ---
    const [shippingCost, setShippingCost] = useState<number>(0);
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    // --- REEMPLAZO DEL VALOR MOCKEADO POR EL DINÁMICO ---
    // Si quieres mantener el beneficio de envío gratis arriba de $50000 conservas la condición.
    const shipping = cartItems.length > 0
        ? (subtotal >= 50000 ? 0 : shippingCost)
        : 0;

    const total = subtotal + shipping;

    // --- NUEVA FUNCIÓN PARA LLAMAR AL ENDPOINT DE ENVÍO ---
    const fetchShippingCost = async (items: CartItemDisplay[], address: any) => {
        if (items.length === 0 || !address?.cp) {
            setShippingCost(0);
            return;
        }

        setIsCalculatingShipping(true);
        try {
            // Asumiendo un peso promedio de 0.4kg por libro si no viene especificado en el producto
            const totalWeight = items.reduce((acc, item) => acc + ((item.weight || 0.4) * item.quantity), 0);
            const sellerId = items[0]?.sellerId || "mock_seller_id";
            const destinationZipCode = address.cp.toString();

            const res = await fetch("/api/shipping/calculate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sellerId,
                    destinationZipCode,
                    totalWeight: parseFloat(totalWeight.toFixed(2))
                }),
            });

            if (!res.ok) throw new Error("Error al calcular el envío");

            const data = await res.json();
            console.log('data shipping', data);
            setShippingCost(data.cost !== undefined ? data.cost : (data.total !== undefined ? data.total : 0));
        } catch (error) {
            console.error("Error obteniendo costo de envío:", error);
            // Fallback por si el endpoint falla (puedes dejarlo en 0 o un hardcode preventivo)
            setShippingCost(1500);
        } finally {
            setIsCalculatingShipping(false);
        }
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        if (!mainAddress) {
            toaster.create({
                title: "Dirección requerida",
                description: "Por favor, registra una dirección de envío en tu perfil para finalizar la compra.",
                type: "warning",
                duration: 5000,
            });
            router.push("/profile");
            return;
        }

        setIsCheckingOut(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ shippingMethod }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al procesar la compra');
            }

            const data = await response.json();
            if (data.success && data.order) {
                window.dispatchEvent(new Event('cart-updated'));

                const currentOrders = JSON.parse(localStorage.getItem('readcycle_orders') || '[]');
                const newOrderListItem = {
                    id: data.order.id,
                    date: data.order.date,
                    status: data.order.status,
                    total: data.order.total,
                    items: data.order.items.reduce((acc: number, item: any) => acc + item.quantity, 0),
                };
                localStorage.setItem('readcycle_orders', JSON.stringify([newOrderListItem, ...currentOrders]));

                const currentOrderDetails = JSON.parse(localStorage.getItem('readcycle_order_details') || '{}');
                currentOrderDetails[data.order.id] = data.order;
                localStorage.setItem('readcycle_order_details', JSON.stringify(currentOrderDetails));

                router.push(`/checkout/success?orderId=${data.order.id}`);
            }
        } catch (error: any) {
            console.error("Error al procesar el checkout:", error);
            alert(error.message || "Hubo un problema al procesar tu compra. Por favor, intenta de nuevo.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    const handleWalletSubmit = async () => {
        if (cartItems.length === 0 || !mainAddress || !user) {
            throw new Error("No se puede iniciar el pago.");
        }

        try {
            // 1. Crear la orden en el microservicio del vendedor (a través del proxy)
            const orderRes = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    buyerId: user.id,
                    shippingCost: shipping,
                    items: cartItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                }),
            });

            if (!orderRes.ok) {
                const errData = await orderRes.json().catch(() => ({}));
                throw new Error(errData.error || "Error al crear la orden en el vendedor");
            }

            const orderData = await orderRes.json();

            // 2. Generar el checkout de Mercado Pago con la información de la orden
            const currentOrigin = window.location.origin;
            const secureOrigin = currentOrigin.replace("http://", "https://");
            const dynamicReturnUrl = `${secureOrigin}/checkout/success?shippingMethod=${shippingMethod}&sellerOrderId=${orderData.id}`;

            const checkoutRes = await fetch("/api/payments/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    buyerId: user.id,
                    sellerId: orderData.sellerId,
                    orderId: orderData.id,
                    returnUrl: dynamicReturnUrl,
                    baseUrl: secureOrigin,
                    items: [
                        ...orderData.items.map((item: any) => ({
                            id: item.productId,
                            title: item.product?.title || "Libro",
                            quantity: item.quantity,
                            unit_price: item.price,
                        })),
                        ...(orderData.shippingCost > 0 ? [{
                            id: "shipping",
                            title: "Costo de envío (Domicilio)",
                            quantity: 1,
                            unit_price: orderData.shippingCost,
                        }] : []),
                    ],
                }),
            });

            if (!checkoutRes.ok) {
                const errData = await checkoutRes.json().catch(() => ({}));
                throw new Error(errData.error || "Error al generar la preferencia de Mercado Pago");
            }

            const checkoutData = await checkoutRes.json();
            return checkoutData.id; // Retorna el preferenceId a Mercado Pago
        } catch (error: any) {
            console.error("Error en handleWalletSubmit:", error);
            toaster.create({
                title: "Error al iniciar el pago",
                description: error.message || "Hubo un problema al procesar tu compra. Por favor, intenta de nuevo.",
                type: "error",
                duration: 5000,
            });
            throw error;
        }
    };

    // --- EFECTO NUEVO: CALCULA EL ENVÍO ANTES DE GENERAR LA PREFERENCIA ---
    useEffect(() => {
        if (cartItems.length > 0 && mainAddress) {
            fetchShippingCost(cartItems, mainAddress);
        }
    }, [cartItems, mainAddress]);



    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;

        const fetchCart = async () => {
            try {
                const [cartRes, productsRes] = await Promise.all([
                    fetch('/api/cart'),
                    fetch('/api/products')
                ]);
                const data = await cartRes.json();
                const products = await productsRes.json();

                if (data.success && data.carrito && Array.isArray(products)) {
                    const mappedItems = data.carrito.items.map((item: any) => {
                        const product = products.find((p: any) => p.id === item.productId);
                        if (!product) return null;

                        const sellerName = product.seller?.name
                            ? `${product.seller.name} ${product.seller.surname || ""}`.trim()
                            : `Vendedor #${product.seller?.id?.slice(-4) || "Desconocido"}`;

                        return {
                            id: item.id,
                            productId: item.productId,
                            title: product.title,
                            author: sellerName,
                            price: product.price,
                            quantity: item.cantidad,
                            image: product.images.find((img: any) => img.isPrimary)?.url || product.images[0]?.url || "/images/placeholder.jpg",
                            sellerId: product.sellerId,
                            weight: product.weight || 0.4
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

        const fetchAddress = async () => {
            try {
                const res = await fetch("/api/buyer/address");
                const data = await res.json();
                if (data.success && data.direcciones) {
                    const main = data.direcciones.find((addr: any) => addr.esPrincipal) || data.direcciones[0];
                    setMainAddress(main || null);
                }
            } catch (error) {
                console.error("Error al obtener direcciones:", error);
            }
        };

        fetchCart();
        fetchAddress();
    }, [isLoaded, isSignedIn]);

    const handleUpdateQuantity = async (productId: string, delta: number) => {
        const itemIndex = cartItems.findIndex(i => i.productId === productId);
        if (itemIndex === -1) return;

        const currentItem = cartItems[itemIndex];
        const newQuantity = Math.max(1, currentItem.quantity + delta);
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


    return (
        <Box bg="brand.beige" minH="100vh" pt={{ base: 8 }}>
            <Container maxW="7xl" px={{ base: 4, md: 6 }}>
                <Flex align="baseline" gap={3} mb={2}>
                    <Stack gap="3" mb="6">
                        <Heading fontSize="5xl" color="brand.forest" fontWeight="800">
                            Tu Carrito
                        </Heading>
                        <Flex align="center" gap="4">
                            <Box w="50px" h="3px" bg="brand.clay" borderRadius="full" />
                            <Text color="gray.600" fontSize="lg">
                                {cartItems.length === 1 ? "Tu libro" : "Tus " + cartItems.length + " libros"} {cartItems.length === 1 ? "está" : "están"} a un clic de distancia!
                            </Text>
                        </Flex>
                    </Stack>
                </Flex>

                <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
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

                    <GridItem>
                        <CartSummary
                            subtotal={subtotal}
                            shipping={shipping}
                            total={total}
                            onCheckout={handleCheckout}
                            // Se añade 'isCalculatingShipping' para deshabilitar el botón si está cargando el costo
                            isCheckoutDisabled={cartItems.length === 0 || isLoading || isCheckingOut || isCalculatingShipping}
                            isCheckingOut={isCheckingOut || isCalculatingShipping}
                            mainAddress={mainAddress}
                            shippingMethod={shippingMethod}
                            onShippingMethodChange={setShippingMethod}
                            onSubmitPayment={handleWalletSubmit}
                            isCalculatingShipping={isCalculatingShipping}
                        />
                    </GridItem>
                </Grid>
            </Container>
        </Box>
    )
}