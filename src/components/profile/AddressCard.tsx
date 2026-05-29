"use client";

import { Badge, Box, Button, Flex, HStack, IconButton, Text } from "@chakra-ui/react";
import { LuMapPin, LuPencil, LuStar, LuTrash2 } from "react-icons/lu";
import AddressForm from "./AddressForm";

export interface Address {
    id: string;
    calle: string;
    altura: string;
    ciudad: string;
    cp: string;
    esPrincipal: boolean;
}

interface AddressCardProps {
    address: Address;
    isEditing: boolean;
    editForm: { calle: string; altura: string; ciudad: string; cp: string; };
    onEditFormChange: (data: { calle: string; altura: string; ciudad: string; cp: string; }) => void;
    onStartEdit: () => void;
    onCancelEdit: () => void;
    onSaveEdit: () => void;
    onDelete: () => void;
    onSetMain: () => void;
}

export default function AddressCard({
    address,
    isEditing,
    editForm,
    onEditFormChange,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
    onDelete,
    onSetMain,
}: AddressCardProps) {
    return (
        <Box
            bg="white"
            border="1px solid"
            borderColor={address.esPrincipal ? "brand.sage" : "brand.sand"}
            borderRadius="brand"
            p={6}
            position="relative"
            boxShadow={address.esPrincipal ? "sm" : "none"}
        >
            {address.esPrincipal && (
                <Badge
                    position="absolute"
                    top={-3}
                    right={4}
                    bg="brand.sage"
                    color="white"
                    borderRadius="full"
                    px={3}
                    py={1}
                    display="flex"
                    alignItems="center"
                    gap={1}
                >
                    <LuStar size={14} /> Principal
                </Badge>
            )}

            {isEditing ? (
                <AddressForm
                    formData={editForm}
                    onChange={onEditFormChange}
                    onSubmit={onSaveEdit}
                    onCancel={onCancelEdit}
                />
            ) : (
                <Box>
                    <Flex justify="space-between" align="start" mb={2}>
                        <HStack color="brand.forest" align="start" gap={2}>
                            <Box mt={1} color="brand.sage">
                                <LuMapPin size={20} />
                            </Box>
                            <Box>
                                <Text fontWeight="semibold" color="brand.forest" fontSize="md">
                                    {address.calle} {address.altura}
                                </Text>
                                <Text color="gray.600" fontSize="sm">
                                    {address.ciudad}, CP {address.cp}
                                </Text>
                            </Box>
                        </HStack>
                    </Flex>

                    <Box borderBottom="1px solid" borderColor="brand.sand" my={4} />

                    <Flex justify="space-between" align="center">
                        {!address.esPrincipal ? (
                            <Button
                                bg="brand.sand"
                                variant="solid"
                                size="md"
                                color="brand.forest"
                                _hover={{ bg: "brand.clay" }}
                                onClick={onSetMain}
                            >
                                <LuStar size={16} />
                                Definir como principal
                            </Button>
                        ) : <Box />}

                        <HStack gap={1}>
                            <IconButton
                                aria-label="Editar"
                                variant="ghost"
                                size="sm"
                                color="brand.forest"
                                _hover={{ bg: "brand.sand" }}
                                onClick={onStartEdit}
                            >
                                <LuPencil size={16} />
                            </IconButton>
                            <IconButton
                                aria-label="Borrar"
                                variant="ghost"
                                size="sm"
                                color="red.500"
                                _hover={{ bg: "red.50" }}
                                onClick={onDelete}
                            >
                                <LuTrash2 size={16} />
                            </IconButton>
                        </HStack>
                    </Flex>
                </Box>
            )}
        </Box>
    );
}
