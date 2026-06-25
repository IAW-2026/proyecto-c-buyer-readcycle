"use client"

import { Flex, HStack, Text, Badge, Button } from "@chakra-ui/react"
import NextLink from "next/link"
import {
    LuCheck,
    LuClock,
    LuTruck,
    LuPackage,
    LuX,
    LuRotateCcw
} from "react-icons/lu"

export interface Order {
    id: string;
    date: string;
    status: string;
    total: number;
    items: number;
}

interface OrderCardProps {
    order: Order;
}

// Helper to get status icon and color
const getStatusConfig = (status: string) => {
    switch (status) {
        case "Entregado": return { icon: LuCheck, color: "green.600", bg: "green.50" }
        case "En camino": return { icon: LuTruck, color: "blue.600", bg: "blue.50" }
        case "Pendiente": return { icon: LuClock, color: "orange.600", bg: "orange.50" }
        case "Cancelado": return { icon: LuX, color: "gray.600", bg: "gray.50" }
        case "Rechazado": return { icon: LuX, color: "red.600", bg: "red.50" }
        case "Reembolsado": return { icon: LuRotateCcw, color: "purple.600", bg: "purple.50" }
        case "Fallido": return { icon: LuX, color: "red.600", bg: "red.50" }
        default: return { icon: LuPackage, color: "gray.600", bg: "gray.50" }
    }
}

export default function OrderCard({ order }: OrderCardProps) {
    const statusConfig = getStatusConfig(order.status)
    const StatusIcon = statusConfig.icon
    const statusColor = statusConfig.color
    const statusBg = statusConfig.bg

    return (
        <Flex
            bg="white"
            border="1px solid"
            borderColor="brand.sand"
            borderRadius="brand"
            p={6}
            gap={4}
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            align={{ base: "start", sm: "center" }}
        >
            <Flex direction="column" gap={2}>
                <HStack gap={3}>
                    <Text fontFamily="heading" fontSize="lg" color="brand.forest" fontWeight="bold">
                        {order.id}
                    </Text>
                    <Badge bg={statusBg} color={statusColor} display="flex" alignItems="center" gap={1} px={2} py={1} borderRadius="full">
                        <StatusIcon size={14} />
                        <Text fontSize="xs" fontWeight="semibold">{order.status}</Text>
                    </Badge>
                </HStack>
                <Text color="gray.600" fontSize="sm">
                    {order.date} • {order.items} {order.items === 1 ? "libro" : "libros"}
                </Text>
            </Flex>

            <Flex direction="column" align={{ base: "start", sm: "end" }} gap={2}>
                <Text fontFamily="heading" fontSize="xl" color="brand.forest">
                    ${order.total.toFixed(2)}
                </Text>
                <NextLink href={`/profile/orders/${order.id}`} passHref>
                    <Button variant="ghost" size="sm" color="brand.sage" _hover={{ bg: "brand.sand" }}>
                        Ver detalle
                    </Button>
                </NextLink>
            </Flex>
        </Flex>
    )
}
