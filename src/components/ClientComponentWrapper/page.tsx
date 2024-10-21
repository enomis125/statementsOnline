// src/components/ClientComponentWrapper/page.tsx
"use client";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar, { SidebarItem, SubMenuItem } from "@/components/Sidebar/Layout/Sidebar";
import { IoIosStats } from "react-icons/io";
import { useState } from "react";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const showSidebar = !pathname.includes("/homepages/jsonView");
  const [expanded, setExpanded] = useState(true);
  
  // Estado de filtro centralizado aqui
  const [filter, setFilter] = useState("pendentes");

  // UseEffect para redirecionar ao alterar o filtro
  useEffect(() => {
    // Verifica se a URL atual não é uma página de login
    if (!pathname.includes("/login") && !pathname.includes("/homepages/jsonView")) { 
      // Redireciona para a página inicial com o filtro adequado
      router.push(`/?filter=${filter}`); // Redireciona com o filtro como parâmetro na URL
    }
  }, [filter, pathname, router]);

  return (
    <div className="min-h-screen flex">
      {showSidebar && (
        <Sidebar setExpanded={setExpanded}>
          <SidebarItem text="Statements" icon={<IoIosStats size={20} />} active>
            <SubMenuItem text="Pendentes" filter="pendentes" setFilter={setFilter} />
            <SubMenuItem text="Vistos" filter="vistos" setFilter={setFilter} />
          </SidebarItem>
          <SidebarItem text="View" icon={<IoIosStats size={20} />} />
        </Sidebar>
      )}

      {/* Passamos o filtro como prop para a página principal */}
      <main
        className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300`}
        style={{
          marginLeft: showSidebar ? (expanded ? "16rem" : "4rem") : "0",
          padding: "0",
        }}
      >
        {React.cloneElement(children as React.ReactElement, { filter })}
      </main>
    </div>
  );
}
