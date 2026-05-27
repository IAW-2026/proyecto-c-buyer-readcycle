"use client"

import { useState } from "react"
import {
    Box,
    Button,
    Flex,
    Grid,
    HStack,
    IconButton,
    Input,
    Text,
    VStack,
    Badge
} from "@chakra-ui/react"
import { toaster } from "@/components/ui/toaster"
import { LuCheck, LuPencil, LuTrash2, LuX, LuUser, LuShield, LuMail } from "react-icons/lu"

interface User {
    id: string;
    name: string;
    surname: string;
    email: string;
    rol: string;
}

interface UserCardProps {
    user: User;
    onRefresh: () => void;
}

export default function UserCard({ user, onRefresh }: UserCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({ name: user.name, surname: user.surname, email: user.email, rol: user.rol })

    const startEditing = () => {
        setIsEditing(true)
        setEditForm({ name: user.name, surname: user.surname, email: user.email, rol: user.rol })
    }

    const cancelEditing = () => {
        setIsEditing(false)
        setEditForm({ name: user.name, surname: user.surname, email: user.email, rol: user.rol })
    }

    const saveEditing = async () => {
        if (!editForm.name || !editForm.email) {
            toaster.create({ title: "Nombre y email son obligatorios", type: "warning", duration: 3000 })
            return;
        }

        try {
            const res = await fetch(`/api/admin/users`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: user.id, ...editForm })
            })
            const data = await res.json()
            if (res.ok && data.success) {
                toaster.create({ title: "Usuario actualizado", type: "success", duration: 3000 })
                setIsEditing(false)
                onRefresh()
            } else {
                throw new Error(data.error || "Error al actualizar")
            }
        } catch (error: any) {
            toaster.create({ title: error.message || "Error al guardar cambios", type: "error", duration: 3000 })
        }
    }

    const handleDeleteUser = async () => {
        if (!confirm("¿Estás seguro de que quieres eliminar a este usuario?")) return;

        try {
            const res = await fetch(`/api/admin/users?id=${user.id}`, { method: "DELETE" })
            const data = await res.json()
            if (res.ok && data.success) {
                toaster.create({ title: "Usuario eliminado", type: "success", duration: 3000 })
                onRefresh()
            } else {
                throw new Error(data.error || "Error al eliminar")
            }
        } catch (error: any) {
            toaster.create({ title: error.message || "Error al eliminar el usuario", type: "error", duration: 3000 })
        }
    }

    return (
        <Box
            bg="white"
            border="1px solid"
            borderColor={user.rol === "admin" ? "brand.sage" : "brand.sand"}
            borderRadius="brand"
            p={6}
            position="relative"
            transition="all 0.2s"
            _hover={{ boxShadow: "sm" }}
        >
            {isEditing ? (
                <VStack gap={4} align="stretch">
                    <Text fontFamily="heading" color="brand.forest" fontWeight="bold">Editar Usuario</Text>

                    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                        <Box>
                            <Text fontSize="sm" color="gray.600" mb={1} fontWeight="medium">Nombre</Text>
                            <Input color="brand.forest" size="md" placeholder="Nombre" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} borderRadius="brand" />
                        </Box>
                        <Box>
                            <Text fontSize="sm" color="gray.600" mb={1} fontWeight="medium">Apellido</Text>
                            <Input color="brand.forest" size="md" placeholder="Apellido" value={editForm.surname} onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })} borderRadius="brand" />
                        </Box>
                    </Grid>

                    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                        <Box>
                            <Text fontSize="sm" color="gray.600" mb={1} fontWeight="medium">Email</Text>
                            <Input color="brand.forest" size="md" placeholder="Email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} borderRadius="brand" />
                        </Box>
                        <Box>
                            <Text fontSize="sm" color="gray.600" mb={1} fontWeight="medium">Rol</Text>
                            <Box position="relative">
                                <select
                                    value={editForm.rol}
                                    onChange={(e) => setEditForm({ ...editForm, rol: e.target.value })}
                                    style={{
                                        border: "1px solid var(--chakra-colors-brand-sand)",
                                        borderRadius: "0.5rem",
                                        padding: "0.5rem 1rem",
                                        width: "100%",
                                        height: "40px",
                                        color: "var(--chakra-colors-brand-forest)",
                                        backgroundColor: "white",
                                        outline: "none"
                                    }}
                                >
                                    <option value="comprador">Comprador</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </Box>
                        </Box>
                    </Grid>

                    <Box borderBottom="1px solid" borderColor="brand.sand" my={2} />

                    <HStack justify="flex-end" mt={2}>
                        <Button variant="ghost" color="gray.500" onClick={cancelEditing}>
                            Cancelar
                        </Button>
                        <Button bg="brand.sage" color="white" _hover={{ bg: "brand.forest" }} onClick={saveEditing} gap={2}>
                            <LuCheck /> Guardar Cambios
                        </Button>
                    </HStack>
                </VStack>
            ) : (
                <Flex direction={{ base: "column", sm: "row" }} justify="space-between" align={{ base: "start", sm: "center" }} gap={4}>
                    <Flex direction="column" gap={2}>
                        <HStack gap={3}>
                            <Text fontFamily="heading" fontSize="xl" color="brand.forest" fontWeight="bold">
                                {user.name} {user.surname}
                            </Text>
                            <Badge
                                bg={user.rol === 'admin' ? 'brand.sage' : 'gray.100'}
                                color={user.rol === 'admin' ? 'white' : 'gray.700'}
                                px={3} py={1} borderRadius="full"
                                display="flex" alignItems="center" gap={1.5}
                            >
                                {user.rol === 'admin' ? <LuShield size={14} /> : <LuUser size={14} />}
                                <Text fontSize="xs" fontWeight="semibold">{user.rol === 'admin' ? 'Administrador' : 'Comprador'}</Text>
                            </Badge>
                        </HStack>

                        <HStack color="gray.600" fontSize="sm" mt={1}>
                            <LuMail size={16} />
                            <Text>{user.email}</Text>
                        </HStack>
                    </Flex>

                    <HStack gap={2} mt={{ base: 2, sm: 0 }}>
                        <Button
                            variant="ghost"
                            size="sm"
                            color="brand.forest"
                            _hover={{ bg: "brand.sand" }}
                            onClick={startEditing}
                            gap={2}
                        >
                            <LuPencil size={16} /> Editar
                        </Button>
                        <IconButton
                            aria-label="Borrar"
                            variant="ghost"
                            size="sm"
                            color="red.500"
                            _hover={{ bg: "red.50" }}
                            onClick={handleDeleteUser}
                        >
                            <LuTrash2 size={18} />
                        </IconButton>
                    </HStack>
                </Flex>
            )}
        </Box>
    )
}
