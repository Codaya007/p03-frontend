"use client";
import { FORMAT_ESTADO_DOCUMENT } from "@/constants";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteDocument, getAllDocuments } from "@/services/document.service";
import { useAuth } from "@/context/AuthContext";
import { getAllPurchasesBySeller } from "@/services/purchase.service";

export function CardDocument({
  document, totalCount, totalAmountSold }) {
  const { title, author, price, ISBN, images = [], audio: audioURL, type, id: external, totalQyt, qytSelled } = document;
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteDocument(external, token);

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
        {audioURL && <audio src={audioURL}>
          Su navegador no soporta el audio
        </audio>}
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
            <p>Unidades vendidas en total: {qytSelled}</p>
          </div>
          <div>
            <p>Unidades vendidas últimos 15 días: {totalCount}</p>
          </div>
          <div>
            <p>Monto facturado últimos 15 días: ${totalAmountSold}</p>
          </div>
          <div>
            <p>Precio unitario: ${price}</p>
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
  const [amountSold, setAmountSold] = useState(0);
  const [documents, setDocuments] = useState(null);
  const { user, token } = useAuth();

  const fetchDocuments = async () => {
    try {
      const { totalCount = 0, data, totalValueSold } = await getAllPurchasesBySeller(token, user?.id);

      setAmountSold(totalValueSold)
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
      <h1>Documentos vendidos los últimos 15 días</h1>
      <div>
        <p><strong>Monto facturado: </strong>${amountSold}</p>
      </div>
      <p>{count} {count > 1 ? "resultados" : "resultado"}</p>
      {!user &&
        <div>
          <Link href={"/login"}>INICIE SESIÓN</Link> PARA PODER CARGAR LOS DOCUMENTOS
        </div>
      }
      {documents ?
        <div className="items-container">
          {
            documents?.map((doc, i) => <CardDocument {...doc} key={i} />)
          }
        </div>
        : <div>No ha vendido nada :(</div>
      }
    </div>
  );
}