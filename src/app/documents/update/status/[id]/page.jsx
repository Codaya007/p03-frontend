"use client";
import Link from "next/link";
import { FORMAT_ESTADO_DOCUMENT } from "@/constants";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDocumentById, updateStatusDocumentById } from "@/services/document.service";
import { useAuth } from "@/context/AuthContext";

export default function DocumentForm({ initialValues }) {
  const router = useRouter();
  const { id: external } = useParams();
  const [document, setDocument] = useState(null);
  const [status, setStatus] = useState(false);
  const { token } = useAuth();

  const handleChangeStatus = async (e) => {
    e.preventDefault();

    try {
      await updateStatusDocumentById(external, status, token);

      router.push("/documents");
    } catch (error) {
      alert(error.message)
    }
  };

  useEffect(() => {
    const getDocument = async () => {
      try {
        const document = await getDocumentById(external, token);

        setDocument({ ...document, materia: null })
        setStatus(document.estado);
      } catch (error) {
        alert(`Ha ocurrido un error: ${error.message || "Error desconocido"}`)
      }
    }

    if (token)
      getDocument();
  }, [token]);

  const onChange = e => {
    setStatus(e.target.value);
  }

  return (
    <div className="normal-form document-form-container">
      <h1 className="title-form">Actualizar estado documento</h1>
      <form onSubmit={handleChangeStatus}>
        <h2>{document?.titulo}</h2>
        <p>Estado actual: {FORMAT_ESTADO_DOCUMENT[document?.estado] || "-"}</p>
        <div className="form-item">
          <label>Estado</label>
          <select value={status} onChange={onChange}>
            <option value="1" key="1">Activo</option>
            <option value="0" key="0">Inactivo</option>
          </select>
        </div>

        <input className="button-primary" type="submit" value={"Guardar estado"} />
        <div>
          <Link className="link-primary" href={"/"}>Volver al inicio</Link>
        </div>
      </form>
    </div>
  );
}
