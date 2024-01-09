"use client";
import React from "react";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  // const [user, setUser] = useState(null);
  const { user, loginUser, logoutUser } = useAuth();

  useEffect(() => {
    // Verifica si hay algo en el localStorage al cargar el componente
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser) {
      const jsonUser = JSON.parse(storedUser);

      loginUser(jsonUser, storedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    logoutUser();
  }

  return (
    <header className="app-header">
      <Link href={"/"} className="logo">
        <Image
          src="/Next.svg"
          width={130}
          height={70}
          alt="Logo"
        />
      </Link>
      {user ?
        <>
          <ul className="list-routes">
            <li>
              <Link href={"/documents"}>CRUD Documentos</Link>
            </li>
            {user.role?.name === "Gerente" &&
              <>
                <li>
                  <Link href={"/users"}>Usuarios</Link>
                </li>
                <li>
                  <Link href={"/purchases"}>Ventas</Link>
                </li>
              </>
            }
            {/* SOLO LOS VENDEDORES PUEDEN VER SUS LIBROS VENDIDOS */}
            {user.role?.name === "Vendedor" &&
              <>
                <li>
                  <Link href={"/documents/selled"}>Documentos vendidos</Link>
                </li>
                <li>
                  <Link href={"/purchases"}>Mis ventas</Link>
                </li>
              </>
            }
          </ul>
          <div className="user-header">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h2 className="header-username">{user.role.name}</h2>
              <p>{user.name} {user.lastname}</p>
            </div>
            <button onClick={handleLogout} className="button-primary logout-button">Salir</button>
          </div>
        </>
        :
        <div className="user-header">
          <Link className="button-primary" href={"/login"}>Acceder</Link>
        </div>
      }
    </header>
  );
}