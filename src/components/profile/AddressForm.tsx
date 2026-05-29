"use client";

import { Box, Button, HStack, Input, Text, VStack } from "@chakra-ui/react";

interface AddressFormData {
    calle: string;
    altura: string;
    ciudad: string;
    cp: string;
}

interface AddressFormProps {
    title?: string;
    formData: AddressFormData;
    onChange: (data: AddressFormData) => void;
    onSubmit: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    submitLabel?: string;
}

export default function AddressForm({
    title,
    formData,
    onChange,
    onSubmit,
    onCancel,
    isLoading = false,
    submitLabel = "Guardar"
}: AddressFormProps) {
    const handleChange = (key: keyof AddressFormData, value: string) => {
        onChange({ ...formData, [key]: value });
    };

    return (
        <VStack gap={3} align="stretch" mt={2}>
            {title && <Text fontFamily="heading" color="brand.forest" fontWeight="bold">{title}</Text>}
            <Input
                color="brand.forest"
                size="sm"
                placeholder="Calle"
                value={formData.calle}
                onChange={(e) => handleChange("calle", e.target.value)}
            />
            <Input
                color="brand.forest"
                size="sm"
                placeholder="Altura"
                value={formData.altura}
                onChange={(e) => handleChange("altura", e.target.value)}
            />
            <Input
                color="brand.forest"
                size="sm"
                placeholder="Ciudad"
                value={formData.ciudad}
                onChange={(e) => handleChange("ciudad", e.target.value)}
            />
            <Input
                color="brand.forest"
                size="sm"
                placeholder="Código Postal"
                value={formData.cp}
                onChange={(e) => handleChange("cp", e.target.value)}
            />

            <HStack justify="flex-end" mt={2}>
                <Button
                    variant="ghost"
                    size="sm"
                    color="gray.500"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
                <Button
                    bg="brand.sage"
                    color="white"
                    _hover={{ bg: "brand.forest" }}
                    size="sm"
                    onClick={onSubmit}
                    loading={isLoading}
                >
                    {submitLabel}
                </Button>
            </HStack>
        </VStack>
    );
}
