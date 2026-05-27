"use client"

import { useState, useEffect, useCallback } from "react"
import {
    Box,
    Button,
    Flex,
    HStack,
    IconButton,
    Input,
    Text,
    VStack,
    Badge,
    Spinner
} from "@chakra-ui/react"
import { toaster } from "@/components/ui/toaster"
import {
    LuMapPin,
    LuCheck,
    LuPencil,
    LuTrash2,
    LuStar,
    LuX
} from "react-icons/lu"

export interface Address {
    id: string;
    calle: string;
    altura: string;
    ciudad: string;
    cp: string;
    esPrincipal: boolean;
}

export default function AddressSection() {
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

    return (
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
    )
}
