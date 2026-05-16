"use client"

import { useState, useEffect, useCallback } from "react"
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
    Spinner
} from "@chakra-ui/react"

import { toaster } from "@/components/ui/toaster"

interface Address {
    id: string;
    calle: string;
    altura: string;
    ciudad: string;
    cp: string;
    esPrincipal: boolean;
}
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

export default function ProfilePage() {
    const [addresses, setAddresses] = useState<Address[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState({ calle: "", altura: "", ciudad: "", cp: "" })
    const [isAdding, setIsAdding] = useState(false)
    const [newAddressForm, setNewAddressForm] = useState({ calle: "", altura: "", ciudad: "", cp: "" })
    const [isCreating, setIsCreating] = useState(false)

    const fetchAddresses = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true)
        try {
            const res = await fetch("/api/buyer/address")
            if (!res.ok) throw new Error("Error al obtener direcciones")
            const data = await res.json()
            if (data.success) {
                setAddresses(data.direcciones)
            } else {
                throw new Error(data.error || "Error desconocido")
            }
        } catch (error) {
            console.error("Error fetching addresses:", error)
            toaster.create({
                title: "Error al cargar direcciones",
                type: "error",
                duration: 3000,
            })
        } finally {
            if (!silent) setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAddresses()
    }, [fetchAddresses])

    const handleCreateAddress = async () => {
        if (!newAddressForm.calle || !newAddressForm.altura || !newAddressForm.ciudad || !newAddressForm.cp) {
            toaster.create({
                title: "Por favor completa todos los campos",
                type: "warning",
                duration: 3000,
            })
            return;
        }

        setIsCreating(true)
        try {
            const res = await fetch("/api/buyer/address", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAddressForm),
            })
            const data = await res.json()
            if (res.ok && data.success) {
                fetchAddresses(true)
                setIsAdding(false)
                setNewAddressForm({ calle: "", altura: "", ciudad: "", cp: "" })
                toaster.create({
                    title: "Dirección agregada con éxito",
                    type: "success",
                    duration: 3000,
                })
            } else {
                throw new Error(data.error || "Error desconocido")
            }
        } catch (error) {
            toaster.create({
                title: "Error al crear la dirección",
                type: "error",
                duration: 3000,
            })
        } finally {
            setIsCreating(false)
        }
    }

    // Handler to delete an address
    const handleDeleteAddress = async (id: string) => {
        try {
            const res = await fetch(`/api/buyer/address?id=${id}`, { method: "DELETE" })
            const data = await res.json()
            if (res.ok && data.success) {
                toaster.create({ title: "Dirección eliminada", type: "success", duration: 3000 })
                fetchAddresses(true)
            } else {
                throw new Error(data.error || "Error al eliminar")
            }
        } catch (error) {
            toaster.create({ title: "Error al eliminar la dirección", type: "error", duration: 3000 })
        }
    }

    // Handler to mark address as main
    const handleSetMainAddress = async (id: string) => {
        try {
            const addr = addresses.find(a => a.id === id);
            if (!addr) return;
            const res = await fetch("/api/buyer/address", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...addr, esPrincipal: true })
            })
            const data = await res.json()
            if (res.ok && data.success) {
                toaster.create({ title: "Dirección principal actualizada", type: "success", duration: 3000 })
                fetchAddresses(true)
            } else {
                throw new Error(data.error || "Error al actualizar")
            }
        } catch (error) {
            toaster.create({ title: "Error al establecer principal", type: "error", duration: 3000 })
        }
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

    const saveEditing = async (id: string) => {
        if (!editForm.calle || !editForm.altura || !editForm.ciudad || !editForm.cp) {
            toaster.create({ title: "Por favor completa todos los campos", type: "warning", duration: 3000 })
            return;
        }

        try {
            const addr = addresses.find(a => a.id === id);
            const res = await fetch("/api/buyer/address", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, ...editForm, esPrincipal: addr?.esPrincipal })
            })
            const data = await res.json()
            if (res.ok && data.success) {
                toaster.create({ title: "Dirección actualizada", type: "success", duration: 3000 })
                setEditingId(null)
                fetchAddresses(true)
            } else {
                throw new Error(data.error || "Error al actualizar")
            }
        } catch (error) {
            toaster.create({ title: "Error al guardar cambios", type: "error", duration: 3000 })
        }
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
                            {isLoading ? (
                                <Flex justify="center" py={8}>
                                    <Spinner color="brand.sage" size="xl" />
                                </Flex>
                            ) : addresses.length === 0 ? (
                                <Text color="gray.500" textAlign="center" py={4}>
                                    No tienes direcciones guardadas aún.
                                </Text>
                            ) : (
                                addresses.map((addr) => (
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
                                                <Input color="brand.forest" size="sm" placeholder="Calle" value={editForm.calle} onChange={(e) => setEditForm({ ...editForm, calle: e.target.value })} />
                                                <Input color="brand.forest" size="sm" placeholder="Altura" value={editForm.altura} onChange={(e) => setEditForm({ ...editForm, altura: e.target.value })} />
                                                <Input color="brand.forest" size="sm" placeholder="Ciudad" value={editForm.ciudad} onChange={(e) => setEditForm({ ...editForm, ciudad: e.target.value })} />
                                                <Input color="brand.forest" size="sm" placeholder="Código Postal" value={editForm.cp} onChange={(e) => setEditForm({ ...editForm, cp: e.target.value })} />

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
                                                        <Button bg="brand.sand" variant="solid" size="md" color="brand.forest" _hover={{ bg: "brand.clay" }} onClick={() => handleSetMainAddress(addr.id)}>
                                                            <LuStar size={16} />
                                                            Definir como principal
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
                                ))
                            )}

                            {isAdding ? (
                                <Box bg="white" border="1px solid" borderColor="brand.sage" borderRadius="brand" p={6} boxShadow="sm">
                                    <VStack gap={3} align="stretch">
                                        <Text fontFamily="heading" color="brand.forest" fontWeight="bold">Nueva Dirección</Text>
                                        <Input color="brand.forest" size="sm" placeholder="Calle" value={newAddressForm.calle} onChange={(e) => setNewAddressForm({ ...newAddressForm, calle: e.target.value })} />
                                        <Input color="brand.forest" size="sm" placeholder="Altura" value={newAddressForm.altura} onChange={(e) => setNewAddressForm({ ...newAddressForm, altura: e.target.value })} />
                                        <Input color="brand.forest" size="sm" placeholder="Ciudad" value={newAddressForm.ciudad} onChange={(e) => setNewAddressForm({ ...newAddressForm, ciudad: e.target.value })} />
                                        <Input color="brand.forest" size="sm" placeholder="Código Postal" value={newAddressForm.cp} onChange={(e) => setNewAddressForm({ ...newAddressForm, cp: e.target.value })} />

                                        <HStack justify="flex-end" mt={2}>
                                            <Button variant="ghost" size="sm" color="gray.500" onClick={() => setIsAdding(false)} disabled={isCreating}>
                                                Cancelar
                                            </Button>
                                            <Button bg="brand.sage" color="white" _hover={{ bg: "brand.forest" }} size="sm" onClick={handleCreateAddress} disabled={isCreating}>
                                                {isCreating ? <Spinner size="sm" /> : "Guardar"}
                                            </Button>
                                        </HStack>
                                    </VStack>
                                </Box>
                            ) : (
                                <Button
                                    w="full"
                                    variant="outline"
                                    borderStyle="dashed"
                                    borderColor="brand.sage"
                                    color="brand.forest"
                                    h="14"
                                    borderRadius="brand"
                                    _hover={{ bg: "brand.sand" }}
                                    onClick={() => setIsAdding(true)}
                                >
                                    + Agregar nueva dirección
                                </Button>
                            )}
                        </VStack>
                    </GridItem>
                </Grid>
            </Container>
        </Box>
    )
}
