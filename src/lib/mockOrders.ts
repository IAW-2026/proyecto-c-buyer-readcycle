import { mockProducts } from "./mockProducts";

export type OrderDetail = {
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
};

// Obtener datos reales del mock de productos para evitar desincronización
const p15 = mockProducts.find((p) => p.id === "prod_15") || mockProducts[0];
const p1 = mockProducts.find((p) => p.id === "prod_1") || mockProducts[0];
const p3 = mockProducts.find((p) => p.id === "prod_3") || mockProducts[0];
const p2 = mockProducts.find((p) => p.id === "prod_2") || mockProducts[0];
const p12 = mockProducts.find((p) => p.id === "prod_12") || mockProducts[0];

const getPrimaryImage = (product: typeof mockProducts[0]) => {
    return product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url || "/images/placeholder.jpg";
};

const getSellerFullName = (product: typeof mockProducts[0]) => {
    return `${product.seller.name} ${product.seller.surname}`;
};

export const MOCK_ORDER_DETAILS: Record<string, OrderDetail> = {
    "ORD-10023": {
        id: "ORD-10023",
        date: "10 de Mayo, 2026",
        status: "Entregado",
        paymentStatus: "Pagado",
        shippingStatus: "Entregado",
        subtotal: p15.price * 1 + p1.price * 1,
        shippingCost: 500.00,
        total: p15.price * 1 + p1.price * 1 + 500.00,
        shippingAddress: {
            calle: "Av. Cabildo",
            altura: "2450",
            ciudad: "CABA",
            cp: "1428"
        },
        items: [
            {
                id: p15.id,
                title: p15.title,
                author: getSellerFullName(p15),
                price: p15.price,
                image: getPrimaryImage(p15),
                quantity: 1
            },
            {
                id: p1.id,
                title: p1.title,
                author: getSellerFullName(p1),
                price: p1.price,
                image: getPrimaryImage(p1),
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
        subtotal: p3.price * 1,
        shippingCost: 500.00,
        total: p3.price * 1 + 500.00,
        shippingAddress: {
            calle: "Av. Corrientes",
            altura: "1800",
            ciudad: "CABA",
            cp: "1042"
        },
        items: [
            {
                id: p3.id,
                title: p3.title,
                author: getSellerFullName(p3),
                price: p3.price,
                image: getPrimaryImage(p3),
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
        subtotal: p2.price * 2 + p12.price * 1,
        shippingCost: 500.00,
        total: (p2.price * 2) + p12.price * 1 + 500.00,
        shippingAddress: {
            calle: "Av. Santa Fe",
            altura: "3200",
            ciudad: "CABA",
            cp: "1425"
        },
        items: [
            {
                id: p2.id,
                title: p2.title,
                author: getSellerFullName(p2),
                price: p2.price,
                image: getPrimaryImage(p2),
                quantity: 2
            },
            {
                id: p12.id,
                title: p12.title,
                author: getSellerFullName(p12),
                price: p12.price,
                image: getPrimaryImage(p12),
                quantity: 1
            }
        ]
    }
};
