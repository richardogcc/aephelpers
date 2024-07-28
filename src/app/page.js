'use client'
import { useInitialConfigContext } from "@/context/InitialConfigContext";
import Modal from "@/components/Modal";
import Profile from "@/components/Profile";
import Config from "@/components/Config";
import { useEffect } from "react";

export default function Home() {
  const { showModal, checkLocalStorageConfig } = useInitialConfigContext();

  useEffect(() => {
    checkLocalStorageConfig();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center h-auto justify-center bg-slate-100">
      <Config />
      {showModal ? <Modal /> : <Profile />}
    </main>
  );
}
