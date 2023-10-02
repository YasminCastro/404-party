"use client";

import AddressMap from "@/components/AddressMap/Index";
import projectConfig from "@/config/project";
import { useUser } from "@/providers/User";
import { setCookie } from "cookies-next";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAdmin } = useUser();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-home bg-cover">
      <div>
        {isAdmin && (
          <Button
            onClick={() => {
              router.push("/admin");
            }}
            className="absolute right-24 top-6 z-50"
            color="dark"
          >
            Admin
          </Button>
        )}

        <Button
          onClick={() => {
            setCookie("token", null);
            router.push("/login");
          }}
          className="absolute right-6 top-6 z-50"
          color="dark"
        >
          Sair
        </Button>
      </div>

      <div className="absolute top-1/3 w-full">
        <div className="flex justify-evenly">
          <h1 className="font-title text-6xl text-login-title">
            {projectConfig.partyName}
          </h1>

          <div className="flex w-1/3 flex-col items-center gap-2">
            <h3 className="font-title text-3xl text-login-title">
              {projectConfig.data}
            </h3>
            <Button
              className="w-full"
              onClick={() => router.push("/confirm")}
              color="dark"
            >
              Confirmar presença
            </Button>
            <AddressMap />
          </div>
        </div>
      </div>
    </div>
  );
}
