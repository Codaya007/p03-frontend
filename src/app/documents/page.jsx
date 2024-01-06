"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteDocument, getAllDocuments } from "@/services/document.service";
import { useAuth } from "@/context/AuthContext";

export function CardDocument({
  title, author, price, ISBN, images, audio, type, id: external, totalQyt, qytSelled, token, fetchDocuments }) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteDocument(external, token);
      fetchDocuments()

      alert("Documento eliminado exitosamente")
    } catch (error) {
      console.log({ error });

      alert(error.response?.data?.msg || error.message || "Algo salió mal");
    }
  }

  return <article className="document-card" >
    <div className="document-card-body">
      <section>
        {images.map(foto => <img src={foto} alt={title} />)}
      </section>
      <section className="details-document">
        <h2 className="document-title">{title || "Sin nombre"}</h2>
        <h3 className="document-author">{author || "Author desconocido"}</h3>
        <div className="card-body">
          <div>
            <p>ISBN: {ISBN}</p>
          </div>
          <div>
            <p>Tipo: {type}</p>
          </div>
          <div>
            <p>Cantidad: {totalQyt}</p>
          </div>
          <div>
            <p>Unidades vendidas: {qytSelled}</p>
          </div>
          <div>
            <h3>Precio</h3>
            <p>${price}</p>
          </div>
        </div>
      </section>
    </div>
    <div className="buttons-card">
      <button onClick={handleDelete} className="button-primary">Eliminar</button>
      <button onClick={() => router.push(`/documents/update/${external}`)} className="button-primary">Editar</button>
    </div>
  </article>
}

export default function Documents() {
  const [count, setCount] = useState(0);
  const [documents, setDocuments] = useState(null);
  const { user, token } = useAuth();

  const fetchDocuments = async () => {
    try {
      const { totalCount = 0, data } = await getAllDocuments(token, user?.id);

      setDocuments(data);
      setCount(totalCount)
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    if (user) {
      fetchDocuments();
    } else {
      setDocuments(null)
      setCount(0)
    }
  }, [user]);

  return (
    <div className="main-container">
      <h1>Documentos</h1>
      <p>{count} {count > 1 ? "resultados" : "resultado"}</p>
      <div className="buttons">
        <Link href={"/documents/create"} className="button-primary"> + Crear nuevo</Link>
      </div>
      {!user && <div><Link href={"/login"}>INICIE SESIÓN</Link> PARA PODER CARGAR LOS DOCUMENTOS</div>}
      {documents ?
        <div className="items-container">
          {
            documents?.map((doc, i) => <CardDocument {...doc} token={token} fetchDocuments={fetchDocuments} key={i} />)
          }
        </div>
        : <div>No hay documentos</div>
      }
    </div>
  );
}