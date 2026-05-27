"use client"

import { useState, useEffect, useCallback } from "react"
import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    HStack,
    IconButton,
    Input,
    Stack,
    Text,
    Badge,
    Spinner,
    VStack,
    Grid,
    GridItem
} from "@chakra-ui/react"
import { toaster } from "@/components/ui/toaster"
import { LuCheck, LuArrowLeft } from "react-icons/lu"
import NextLink from "next/link"
import UserCard from "@/components/admin/UserCard"
import UsersSummary from "@/components/admin/UsersSummary"

interface User {
    id: string;
    name: string;
    surname: string;
    email: string;
    rol: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const [isAdding, setIsAdding] = useState(false)
    const [newForm, setNewForm] = useState({ name: "", surname: "", email: "", password: "", rol: "comprador" })

    const fetchUsers = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true)
        try {
            const res = await fetch("/api/admin/users")
            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error("No tienes permisos para ver esta página.")
                }
                throw new Error("Error al obtener usuarios")
            }
            const data = await res.json()
            if (data.success) {
                setUsers(data.users)
            } else {
                throw new Error(data.error || "Error desconocido")
            }
        } catch (error: any) {
            console.error("Error fetching users:", error)
            toaster.create({
                title: error.message || "Error al cargar usuarios",
                type: "error",
                duration: 5000,
            })
        } finally {
            if (!silent) setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleCreateUser = async () => {
        if (!newForm.name || !newForm.email || !newForm.password) {
            toaster.create({ title: "Nombre, email y contraseña son obligatorios", type: "warning", duration: 3000 })
            return;
        }

        try {
            const res = await fetch(`/api/admin/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newForm)
            })
            const data = await res.json()
            if (res.ok && data.success) {
                toaster.create({ title: "Usuario creado", type: "success", duration: 3000 })
                setIsAdding(false)
                setNewForm({ name: "", surname: "", email: "", password: "", rol: "comprador" })
                fetchUsers(true)
            } else {
                throw new Error(data.error || "Error al crear")
            }
        } catch (error: any) {
            toaster.create({ title: error.message || "Error al crear usuario", type: "error", duration: 3000 })
        }
    }

    return (
        <Box bg="brand.beige" minH="100vh" py={{ base: 8, md: 12 }}>
            <Container maxW="7xl" px={{ base: 4, md: 6 }}>
                {/* Header */}
                <Flex align="baseline" gap={3} mb={4}>
                    <Stack gap="3">
                        <Heading
                            fontSize={{ base: "4xl", md: "5xl" }}
                            color="brand.forest"
                            fontWeight="800"
                        >
                            Panel de Administración
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
                                Gestión de usuarios
                            </Text>
                        </Flex>
                    </Stack>
                </Flex>

                <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={8}>
                    {/* Lista de Usuarios */}
                    <GridItem>

                        <Heading
                            fontFamily="heading"
                            fontSize="2xl"
                            color="brand.forest"
                            mb={6}
                            fontWeight="normal"
                            h="32px"
                            display="flex"
                            alignItems="center"
                        >
                            Usuarios Registrados ({users.length})
                        </Heading>

                        {isLoading ? (
                            <Flex justify="center" py={12}>
                                <Spinner color="brand.sage" size="xl" />
                            </Flex>
                        ) : users.length === 0 ? (
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
                                <Text color="brand.sage" fontSize="lg" fontWeight="semibold">No hay usuarios registrados</Text>
                            </Flex>
                        ) : (
                            <VStack gap={4} align="stretch">
                                {isAdding && (
                                    <Box
                                        bg="white"
                                        border="1px solid"
                                        borderColor="brand.sage"
                                        borderRadius="brand"
                                        p={6}
                                        position="relative"
                                        boxShadow="sm"
                                    >
                                        <VStack gap={4} align="stretch">
                                            <Text fontFamily="heading" color="brand.forest" fontWeight="bold">Nuevo Usuario</Text>

                                            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                                                <Box>
                                                    <Text fontSize="sm" color="gray.600" mb={1} fontWeight="medium">Nombre</Text>
                                                    <Input color="brand.forest" size="md" placeholder="Nombre" value={newForm.name} onChange={(e) => setNewForm({ ...newForm, name: e.target.value })} borderRadius="brand" />
                                                </Box>
                                                <Box>
                                                    <Text fontSize="sm" color="gray.600" mb={1} fontWeight="medium">Apellido</Text>
                                                    <Input color="brand.forest" size="md" placeholder="Apellido" value={newForm.surname} onChange={(e) => setNewForm({ ...newForm, surname: e.target.value })} borderRadius="brand" />
                                                </Box>
                                            </Grid>

                                            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                                                <Box>
                                                    <Text fontSize="sm" color="gray.600" mb={1} fontWeight="medium">Email</Text>
                                                    <Input color="brand.forest" size="md" placeholder="Email" value={newForm.email} onChange={(e) => setNewForm({ ...newForm, email: e.target.value })} borderRadius="brand" />
                                                </Box>
                                                <Box>
                                                    <Text fontSize="sm" color="gray.600" mb={1} fontWeight="medium">Contraseña</Text>
                                                    <Input color="brand.forest" size="md" type="password" placeholder="Contraseña" value={newForm.password} onChange={(e) => setNewForm({ ...newForm, password: e.target.value })} borderRadius="brand" />
                                                </Box>
                                            </Grid>

                                            <Box>
                                                <Text fontSize="sm" color="gray.600" mb={1} fontWeight="medium">Rol</Text>
                                                <Box position="relative">
                                                    <select
                                                        value={newForm.rol}
                                                        onChange={(e) => setNewForm({ ...newForm, rol: e.target.value })}
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

                                            <Box borderBottom="1px solid" borderColor="brand.sand" my={2} />

                                            <HStack justify="flex-end" mt={2}>
                                                <Button variant="ghost" color="gray.500" onClick={() => setIsAdding(false)}>
                                                    Cancelar
                                                </Button>
                                                <Button bg="brand.sage" color="white" _hover={{ bg: "brand.forest" }} onClick={handleCreateUser} gap={2}>
                                                    <LuCheck /> Crear Usuario
                                                </Button>
                                            </HStack>
                                        </VStack>
                                    </Box>
                                )}
                                {users.map((user) => (
                                    <UserCard key={user.id} user={user} onRefresh={() => fetchUsers(true)} />
                                ))}
                            </VStack>
                        )}

                        {/* Botón Volver a la Tienda */}
                        <NextLink href="/" passHref>
                            <Button
                                variant="ghost"
                                color="brand.forest"
                                _hover={{ bg: "brand.sand" }}
                                fontWeight="semibold"
                                display="inline-flex"
                                alignItems="center"
                                gap={2}
                                mt={6}
                            >
                                <LuArrowLeft /> Volver a la tienda
                            </Button>
                        </NextLink>
                    </GridItem>

                    {/* Resumen */}
                    <GridItem>
                        <UsersSummary
                            totalUsers={users.length}
                            adminCount={users.filter(u => u.rol === 'admin').length}
                            buyerCount={users.filter(u => u.rol === 'comprador').length}
                            isAdding={isAdding}
                            onAddClick={() => setIsAdding(true)}
                        />
                    </GridItem>
                </Grid>
            </Container>
        </Box>
    )
}
