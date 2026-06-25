"use client"

import { useState, useEffect, useCallback } from "react"
import {
    Button,
    Text,
    VStack,
    Skeleton
} from "@chakra-ui/react"
import { toaster } from "@/components/ui/toaster"
import AddressCard, { Address } from "./AddressCard"
import AddressForm from "./AddressForm"

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
                <VStack gap={4} align="stretch">
                    <Skeleton h="120px" borderRadius="brand" />
                    <Skeleton h="120px" borderRadius="brand" />
                </VStack>
            ) : addresses.length === 0 ? (
                <Text color="gray.500" textAlign="center" py={4}>
                    No tienes direcciones guardadas aún.
                </Text>
            ) : (
                addresses.map((addr) => (
                    <AddressCard
                        key={addr.id}
                        address={addr}
                        isEditing={editingId === addr.id}
                        editForm={editForm}
                        onEditFormChange={setEditForm}
                        onStartEdit={() => startEditing(addr)}
                        onCancelEdit={cancelEditing}
                        onSaveEdit={() => saveEditing(addr.id)}
                        onDelete={() => handleDeleteAddress(addr.id)}
                        onSetMain={() => handleSetMainAddress(addr.id)}
                    />
                ))
            )}

            {isAdding ? (
                <VStack
                    bg="white"
                    border="1px solid"
                    borderColor="brand.sage"
                    borderRadius="brand"
                    p={6}
                    boxShadow="sm"
                    align="stretch"
                >
                    <AddressForm
                        title="Nueva Dirección"
                        formData={newAddressForm}
                        onChange={setNewAddressForm}
                        onSubmit={handleCreateAddress}
                        onCancel={() => setIsAdding(false)}
                        isLoading={isCreating}
                        submitLabel="Guardar"
                    />
                </VStack>
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

