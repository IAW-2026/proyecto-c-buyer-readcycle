"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { toaster } from "@/components/ui/toaster";

export default function SyncUser() {

  const {
    isLoaded,
    isSignedIn,
    user
  } = useUser();

  const alreadySynced = useRef(false);
  const lastUserId = useRef<string | null>(null);

  useEffect(() => {

    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      alreadySynced.current = false;
      lastUserId.current = null;
      return;
    }

    if (lastUserId.current !== user.id) {
      alreadySynced.current = false;
      lastUserId.current = user.id;
    }

    if (alreadySynced.current) return;

    alreadySynced.current = true;

    const syncUser = async () => {

      try {

        const response = await fetch(
          "/api/buyer/sync",
          {
            method: "POST",
          }
        );

        if (response.ok) {
          window.dispatchEvent(new CustomEvent('user-synced'));

          // Procesar artículo pendiente en el carrito
          const pendingItemStr = localStorage.getItem("pending_cart_item");
          if (pendingItemStr) {
            try {
              const pendingItem = JSON.parse(pendingItemStr);
              if (pendingItem && pendingItem.productId) {
                const cartResponse = await fetch('/api/cart', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    productId: pendingItem.productId,
                    cantidad: pendingItem.cantidad || 1
                  })
                });

                if (cartResponse.ok) {
                  window.dispatchEvent(new Event('cart-updated'));
                  toaster.create({
                    title: "Producto agregado al carrito",
                    description: `"${pendingItem.title || "El libro"}" se agregó a tu carrito de compras.`,
                    type: "success",
                    duration: 4000,
                  });
                } else {
                  const status = cartResponse.status;
                  const responseText = await cartResponse.text().catch(() => "");
                  console.error(`[SyncUser] Error adding pending item. Status: ${status}, Body:`, responseText);
                  
                  let errorData: any = {};
                  try {
                    errorData = JSON.parse(responseText);
                  } catch (e) {}

                  if (errorData.error === "seller_mismatch") {
                    toaster.create({
                      title: "Error al agregar al carrito",
                      description: "No puedes agregar productos de diferentes vendedores al carrito.",
                      type: "error",
                      duration: 5000,
                    });
                  } else {
                    toaster.create({
                      title: "Error al agregar al carrito",
                      description: errorData.error || "Ocurrió un error inesperado al cargar tu producto pendiente.",
                      type: "error",
                      duration: 5000,
                    });
                  }
                }
              }
            } catch (err) {
              console.error("Error al procesar el ítem de carrito pendiente:", err);
            } finally {
              localStorage.removeItem("pending_cart_item");
            }
          }
        } else {
          console.error(
            "Error sincronizando usuario"
          );
        }

      } catch (error) {

        console.error(
          "Error en SyncUser:",
          error
        );

      }
    };

    syncUser();

  }, [isLoaded, isSignedIn, user?.id]);

  return null;
}