"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getAllUsers } from "@/services/user.service";

export function CardDocument({
  name, lastname, email, dni, address, phone }) {

  return <article className="document-card" >
    <div className="document-card-body">
      <section className="details-document">
        <h2 className="document-title">{name} {lastname}</h2>
        {/* <h3 className="document-author">{email}</h3> */}
        <div className="card-body">
          <div>
            <p>email: {email}</p>
          </div>
          <div>
            <p>Cedula: {dni}</p>
          </div>
          <div>
            <p>Dirección: {address}</p>
          </div>
          <div>
            <p>Teléfono: {phone}</p>
          </div>
        </div>
      </section>
    </div>
  </article>
}

export default function Users() {
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState(null);
  const { user, token } = useAuth();

  const fetchUsers = async () => {
    try {
      const { totalCount = 0, data } = await getAllUsers(token);

      setUsers(data);
      setCount(totalCount)
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    if (user) {
      fetchUsers();
    } else {
      setUsers(null)
      setCount(0)
    }
  }, [user]);

  return (
    <div className="main-container">
      <h1>Usuarios</h1>
      <p>{count} {count > 1 ? "resultados" : "resultado"}</p>
      {/* <div className="buttons">
        <Link href={"/users/create"} className="button-primary"> + Crear nuevo</Link>
      </div> */}
      {!user && <div><Link href={"/login"}>INICIE SESIÓN</Link> PARA PODER CARGAR LOS DOCUMENTOS</div>}
      {users ?
        <div className="items-container">
          {
            users?.map((doc, i) => <CardDocument {...doc} key={i} />)
          }
        </div>
        : <div>No hay documentos</div>
      }
    </div>
  );
}