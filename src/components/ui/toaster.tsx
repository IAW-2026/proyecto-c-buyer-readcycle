"use client"

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react"

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
})

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root
            width={{ md: "sm" }}
            bg="white"
            borderRadius="brand"
            border="1px solid"
            borderColor="brand.sand"
            borderLeft="6px solid"
            borderLeftColor="brand.clay"
            boxShadow="md"
            p={4}
            alignItems="center"
          >
            {toast.type === "loading" ? (
              <Spinner size="sm" color="brand.clay" />
            ) : (
              <Toast.Indicator color="brand.clay" />
            )}
            <Stack gap="0.5" flex="1" maxWidth="100%">
              {toast.title && (
                <Toast.Title fontFamily="heading" color="brand.forest" fontWeight="bold" fontSize="sm">
                  {toast.title}
                </Toast.Title>
              )}
              {toast.description && (
                <Toast.Description color="gray.600" fontSize="xs">
                  {toast.description}
                </Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
