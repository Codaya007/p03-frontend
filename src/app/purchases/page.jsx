"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAllPurchases } from "@/services/purchase.service";
import { roundPrice } from "@/utils";

export function CardPurchase({
  id: external, clientFullName, clientDni, clientAddress, clientPhone, subtotal, IVA, totalAmount, paymentType, products = [] }) {
  const router = useRouter();

  return <article className="document-card" >
    <div className="document-card-body">
      <section className="details-document">
        <h2 className="document-title">Orden N° {external}</h2>
        <div className="card-body">
          <div>
            <p>Cliente: {clientFullName}</p>
          </div>
          <div>
            <p>Cedula: {clientDni}</p>
          </div>
          <div>
            <p>Dirección: {clientAddress}</p>
          </div>
          <div>
            <p>Teléfono: {clientPhone}</p>
          </div>
          <div>
            <p>Tipo de pago: {paymentType}</p>
          </div>
          <h3>Productos</h3>
          <table>
            <thead>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio unitario</th>
              <th>Precio total</th>
            </thead>
            <tbody>
              {products.map(product => {
                return <tr>
                  <td style={{ textAlign: 'center' }}>{product.name}</td>
                  <td style={{ textAlign: 'center' }}>{product.qyt}</td>
                  <td style={{ textAlign: 'center' }}>${product.unitPrice}</td>
                  <td style={{ textAlign: 'center' }}>${product.totalPrice}</td>
                </tr>
              })}
            </tbody>
          </table>
          <div>
            <p>
              <strong>Subtotal</strong> ${roundPrice(subtotal)}
            </p>
            <p>
              <strong>IVA</strong> ${roundPrice(IVA)}
            </p>
            <p>
              <strong>Total</strong> ${roundPrice(totalAmount)}
            </p>
          </div>
        </div>
      </section>
    </div>
    <div className="buttons-card">
      <button onClick={() => router.push(`/purchases/update/${external}`)} className="button-primary">Editar</button>
    </div>
  </article>
}

export default function Purchases() {
  const [count, setCount] = useState(0);
  const [purchases, setPurchases] = useState(null);
  const { user, token } = useAuth();

  const fetchPurchases = async () => {
    try {
      const { totalCount = 0, data } = await getAllPurchases(token, user?.id);

      setPurchases(data);
      setCount(totalCount)
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    if (user) {
      fetchPurchases();
    } else {
      setPurchases(null)
      setCount(0)
    }
  }, [user]);

  return (
    <div className="main-container">
      <h1>Mis ventas</h1>
      <p>{count} {count > 1 ? "resultados" : "resultado"}</p>
      <div className="buttons">
        <Link href={"/purchases/create"} className="button-primary"> + Registrar venta</Link>
      </div>
      {!user && <div><Link href={"/login"}>INICIE SESIÓN</Link> PARA PODER CARGAR LAS VENTAS</div>}
      {purchases ?
        <div className="items-container">
          {
            purchases?.map((doc, i) => <CardPurchase {...doc} token={token} fetchPurchases={fetchPurchases} key={i} />)
          }
        </div>
        : <div>No hay ventas</div>
      }
    </div>
  );
}