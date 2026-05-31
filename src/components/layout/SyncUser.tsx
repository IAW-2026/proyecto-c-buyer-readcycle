"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";

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