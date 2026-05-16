"use client"

import { useState } from "react"
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
    Badge,
} from "@chakra-ui/react"
import {
    LuMapPin,
    LuPackage,
    LuCheck,
    LuClock,
    LuTruck,
    LuPencil,
    LuTrash2,
    LuStar,
    LuX
} from "react-icons/lu"

// Mock Data
const MOCK_ORDERS = [
    { id: "ORD-10023", date: "10 de Mayo, 2026", status: "Entregado", total: 40.50, items: 2 },
    { id: "ORD-10024", date: "12 de Mayo, 2026", status: "En camino", total: 22.00, items: 1 },
    { id: "ORD-10025", date: "13 de Mayo, 2026", status: "Pendiente", total: 63.50, items: 3 },
]

const INITIAL_ADDRESSES = [
    { id: "1", calle: "Av. Corrientes", altura: "1234", ciudad: "Buenos Aires", cp: "C1043", esPrincipal: true },
    { id: "2", calle: "San Martín", altura: "450", ciudad: "Córdoba", cp: "X5000", esPrincipal: false },
]

export default function ProfilePage() {
    const [addresses, setAddresses] = useState(INITIAL_ADDRESSES)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState({ calle: "", altura: "", ciudad: "", cp: "" })

    // Handler to delete an address
    const handleDeleteAddress = (id: string) => {
        setAddresses((prev) => prev.filter(addr => addr.id !== id))
    }

    // Handler to mark address as main
    const handleSetMainAddress = (id: string) => {
        setAddresses((prev) => prev.map(addr => ({
            ...addr,
            esPrincipal: addr.id === id
        })))
    }

    // Handlers for edit mode
    const startEditing = (addr: any) => {
        setEditingId(addr.id)
        setEditForm({ calle: addr.calle, altura: addr.altura, ciudad: addr.ciudad, cp: addr.cp })
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditForm({ calle: "", altura: "", ciudad: "", cp: "" })
    }

    const saveEditing = (id: string) => {
        setAddresses((prev) => prev.map(addr => {
            if (addr.id === id) {
                return { ...addr, ...editForm }
            }
            return addr
        }))
        setEditingId(null)
    }

    // Helper to get status icon and color
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "Entregado": return { icon: LuCheck, color: "green.600", bg: "green.50" }
            case "En camino": return { icon: LuTruck, color: "blue.600", bg: "blue.50" }
            case "Pendiente": return { icon: LuClock, color: "orange.600", bg: "orange.50" }
            default: return { icon: LuPackage, color: "gray.600", bg: "gray.50" }
        }
    }

    return (
        <Box bg="brand.beige" minH="100vh" py={{ base: 8, md: 12 }}>
            <Container maxW="7xl" px={{ base: 4, md: 6 }}>
                {/* Header (Mismo estilo que el carrito) */}
                <Flex align="baseline" gap={3} mb={8}>
                    <Stack gap="3" mb="12">
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

                        <VStack gap={4} align="stretch" mb={8}>
                            {MOCK_ORDERS.map((order) => {
                                const StatusIcon = getStatusConfig(order.status).icon;
                                const statusColor = getStatusConfig(order.status).color;
                                const statusBg = getStatusConfig(order.status).bg;

                                return (
                                    <Flex
                                        key={order.id}
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
                                            <Button variant="ghost" size="sm" color="brand.sage" _hover={{ bg: "brand.sand" }}>
                                                Ver detalle
                                            </Button>
                                        </Flex>
                                    </Flex>
                                )
                            })}
                        </VStack>
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

                        <VStack gap={4} align="stretch">
                            {addresses.map((addr) => (
                                <Box
                                    key={addr.id}
                                    bg="white"
                                    border="1px solid"
                                    borderColor={addr.esPrincipal ? "brand.sage" : "brand.sand"}
                                    borderRadius="brand"
                                    p={6}
                                    position="relative"
                                    boxShadow={addr.esPrincipal ? "sm" : "none"}
                                >
                                    {addr.esPrincipal && (
                                        <Badge position="absolute" top={-3} right={4} bg="brand.sage" color="white" borderRadius="full" px={3} py={1} display="flex" alignItems="center" gap={1}>
                                            <LuStar size={14} /> Principal
                                        </Badge>
                                    )}

                                    {editingId === addr.id ? (
                                        <VStack gap={3} align="stretch" mt={2}>
                                            <Input size="sm" placeholder="Calle" value={editForm.calle} onChange={(e) => setEditForm({ ...editForm, calle: e.target.value })} />
                                            <Input size="sm" placeholder="Altura" value={editForm.altura} onChange={(e) => setEditForm({ ...editForm, altura: e.target.value })} />
                                            <Input size="sm" placeholder="Ciudad" value={editForm.ciudad} onChange={(e) => setEditForm({ ...editForm, ciudad: e.target.value })} />
                                            <Input size="sm" placeholder="Código Postal" value={editForm.cp} onChange={(e) => setEditForm({ ...editForm, cp: e.target.value })} />

                                            <HStack justify="flex-end" mt={2}>
                                                <IconButton aria-label="Cancelar" size="sm" variant="ghost" color="red.500" onClick={cancelEditing}>
                                                    <LuX />
                                                </IconButton>
                                                <IconButton aria-label="Guardar" size="sm" bg="brand.sage" color="white" _hover={{ bg: "brand.forest" }} onClick={() => saveEditing(addr.id)}>
                                                    <LuCheck />
                                                </IconButton>
                                            </HStack>
                                        </VStack>
                                    ) : (
                                        <Box>
                                            <Flex justify="space-between" align="start" mb={2}>
                                                <HStack color="brand.forest" align="start" gap={2}>
                                                    <Box mt={1} color="brand.sage">
                                                        <LuMapPin size={20} />
                                                    </Box>
                                                    <Box>
                                                        <Text fontWeight="semibold" color="brand.forest" fontSize="md">
                                                            {addr.calle} {addr.altura}
                                                        </Text>
                                                        <Text color="gray.600" fontSize="sm">
                                                            {addr.ciudad}, CP {addr.cp}
                                                        </Text>
                                                    </Box>
                                                </HStack>
                                            </Flex>

                                            <Box borderBottom="1px solid" borderColor="brand.sand" my={4} />

                                            <Flex justify="space-between" align="center">
                                                {!addr.esPrincipal ? (
                                                    <Button variant="ghost" size="xs" color="brand.forest" onClick={() => handleSetMainAddress(addr.id)}>
                                                        Definir principal
                                                    </Button>
                                                ) : <Box />}

                                                <HStack gap={1}>
                                                    <IconButton aria-label="Editar" variant="ghost" size="sm" color="brand.forest" _hover={{ bg: "brand.sand" }} onClick={() => startEditing(addr)}>
                                                        <LuPencil size={16} />
                                                    </IconButton>
                                                    <IconButton aria-label="Borrar" variant="ghost" size="sm" color="red.500" _hover={{ bg: "red.50" }} onClick={() => handleDeleteAddress(addr.id)}>
                                                        <LuTrash2 size={16} />
                                                    </IconButton>
                                                </HStack>
                                            </Flex>
                                        </Box>
                                    )}
                                </Box>
                            ))}

                            <Button
                                w="full"
                                variant="outline"
                                borderStyle="dashed"
                                borderColor="brand.sage"
                                color="brand.forest"
                                h="14"
                                borderRadius="brand"
                                _hover={{ bg: "brand.sand" }}
                            >
                                + Agregar nueva dirección
                            </Button>
                        </VStack>
                    </GridItem>
                </Grid>
            </Container>
        </Box>
    )
}
