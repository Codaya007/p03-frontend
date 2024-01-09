"use client";
import { array, object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAllDocuments } from "@/services/document.service";
import { createPurchase } from "@/services/purchase.service";
const PAYMENT_TYPES = ["Efectivo", "Tarjeta"];
const PAGE_REGEX = /^\d{1,}$/;


const validationSchema = object().shape({
  clientFullName: string().required("El nombre del cliente es requerido"),
  clientDni: string().required("El DNI del cliente es requerido"),
  clientAddress: string().required("La dirección del cliente es requerida"),
  clientPhone: string().required("El teléfono del cliente es requerido"),
  paymentType: string().oneOf(PAYMENT_TYPES, "Tipo de pago no válido").required("El tipo de pago es requerido"),
  // products: array().of(object().shape({
  //   document: string().required("El documento es requerido"),
  //   qyt: string().matches(PAGE_REGEX, "Ingrese una cantidad válida").required("La cantidad es requerida"),
  // })).required("Debe seleccionar al menos un producto"),
});

export default function PurchaseForm({ initialValues }) {
  // const router = useRouter();
  const formOptions = {
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: initialValues || { price: "0.00", products: [] },
  };
  const { register, handleSubmit, formState, watch, reset } = useForm(formOptions);
  const { errors } = formState;
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { user, token } = useAuth();

  const onSubmit = async (data) => {
    try {
      const response = await createPurchase(data, token);

      // Manejar la respuesta según sea necesario
      console.log({ response });
      reset()
      alert("Venta registrada exitosamente")
    } catch (error) {
      console.log({ error });

      alert(error.response?.data?.msg || error.message || "Algo salió mal");
    }
  };

  const fetchProducts = async () => {
    try {
      // Hacer la petición para obtener los productos
      // Si es vendedor, solo puede vender sus productos

      const productsResponse =
        await getAllDocuments(token, user.role.name === "Vendedor" ? user.id : undefined)

      setProducts(productsResponse.data);
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    if (user) {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [user]);

  const handleAddProduct = () => {
    const product = products.find(product => product.id === watch("products[0].document"));
    const qyt = parseInt(watch("products[0].qyt"));

    // console.log({ product });

    if (qyt > product.qyt) {
      return alert(`El producto '${product.title}' solo tienen en inventario ${product.qyt} unidades`);
    }

    const selectedProduct = {
      title: watch("products[0].document") && product.title,
      qyt,
    };

    // Asegúrate de que se haya seleccionado un producto y la cantidad sea mayor que 0
    if (selectedProduct.title && selectedProduct.qyt > 0) {
      setSelectedProducts([...selectedProducts, selectedProduct]);
    }

    const updatedProduct = products.map(prod => {
      if (prod.id === product.id) {
        prod.qyt = product.qyt - qyt;
      }

      return prod
    })

    console.log({ updatedProduct });

    setProducts(updatedProduct);
  }

  return (
    <div className="normal-form purchase-form-container">
      <h1 className="title-form">Registrar venta</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-body">
          <section>
            <div className="form-item">
              <label>Nombre del Cliente</label>
              <input {...register("clientFullName")} type="text" />
              {errors.clientFullName && <span className="validation-error">{errors.clientFullName.message}</span>}
            </div>
            <div className="form-item">
              <label>DNI del Cliente</label>
              <input {...register("clientDni")} type="text" />
              {errors.clientDni && <span className="validation-error">{errors.clientDni.message}</span>}
            </div>
            <div className="form-item">
              <label>Dirección del Cliente</label>
              <input {...register("clientAddress")} type="text" />
              {errors.clientAddress && <span className="validation-error">{errors.clientAddress.message}</span>}
            </div>
            <div className="form-item">
              <label>Teléfono del Cliente</label>
              <input {...register("clientPhone")} type="text" />
              {errors.clientPhone && <span className="validation-error">{errors.clientPhone.message}</span>}
            </div>
            <div className="form-item">
              <label>Tipo de pago</label>
              <select {...register("paymentType")} >
                {PAYMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.paymentType && <span className="validation-error">{errors.paymentType.message}</span>}
            </div>
          </section>
          <section>
            <div className="form-item">
              <label>Productos</label>
              {products.length > 0 && (
                <div>
                  <select {...register("products[0].document")} >
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.title} - {product.author}
                      </option>
                    ))}
                  </select>
                  <input {...register("products[0].qyt")} type="number" />
                  {errors.products && errors.products[0] && (
                    <span className="validation-error">{errors.products[0].document?.message}</span>
                  )}
                  {errors.products && errors.products[0] && (
                    <span className="validation-error">{errors.products[0].qyt?.message}</span>
                  )}
                </div>
              )}
              <button className="button-primary" style={{ padding: 3, margin: 2 }} type="button" onClick={handleAddProduct}>
                Añadir Producto
              </button>
            </div>
            <div>
              <h3>Productos seleccionados</h3>
              {selectedProducts.map((prod, index) => (
                <p key={index}>{prod.title} (x{prod.qyt})</p>
              ))}
            </div>
          </section>
        </div>

        <input className="button-primary" type="submit" value="Guardar" />
        <div>
          <Link className="link-primary" href={"/"}>Volver al inicio</Link>
        </div>
      </form>
    </div>
  );
}