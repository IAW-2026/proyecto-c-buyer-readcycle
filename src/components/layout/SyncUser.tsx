"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";

export default function SyncUser() {

  const {
    isLoaded,
    isSignedIn
  } = useUser();

  const alreadySynced = useRef(false);

  useEffect(() => {

    // Clerk todavía cargando
    if (!isLoaded) return;

    // Usuario no autenticado
    if (!isSignedIn) {
      alreadySynced.current = false;
      return;
    }

    // Evita múltiples requests
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

        if (!response.ok) {
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

  }, [isLoaded, isSignedIn]);

  return null;
}