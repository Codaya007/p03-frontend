"use client";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createDocument, getDocumentById } from "@/services/document.service";
import { useAuth } from "@/context/AuthContext";
import { formatearNumero } from "@/utils";
import { getAllUsers } from "@/services/user.service";
import { uploadFile } from "@/services/media.service";

const PRICE_REGEX = /^\d{1,}[.,]\d{1,2}$/;
const PAGE_REGEX = /^\d{1,}$/;

const validationSchema = object().shape({
  owner: string().required("El vendedor es requerido"),
  title: string().required("El título es requerido"),
  type: string().required("El tipo es requerido"),
  author: string().required("El autor es requerido"),
  price: string().matches(PRICE_REGEX, "Ingrese un precio válido como 10.00").required("El subtotal es requerido").default("0.00"),
  ISBN: string().required("El ISBN es requerido"),
  totalQyt: string().matches(PAGE_REGEX, "Ingrese una cantidad válida").required("El número de páginas es requerido"),
});

export default function DocumentForm({ initialValues }) {
  const router = useRouter();
  const { id: external } = useParams();
  const formOptions = {
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: initialValues || { price: "0.00" },
  };
  const { register, handleSubmit, formState, setValue, reset } = useForm(formOptions);
  const { errors } = formState;
  const [sellers, setSellers] = useState(null);
  const [images, setImages] = useState([]);
  const { user, token } = useAuth();

  const onSubmit = async (data) => {
    try {
      data.images = images;
      data.totalQyt = parseInt(data.totalQyt)
      data.price = parseFloat(data.price)
      await createDocument(data, token, user?.external);

      router.push("/documents");
    } catch (error) {
      console.log({ error });

      alert(error.response?.data?.msg || error.message || "Algo salió mal");
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await getAllUsers(token);

      setSellers(data);
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    if (user) {
      fetchUsers();
    } else {
      setSellers(null)
    }
  }, [user]);

  useEffect(() => {
    if (sellers && user && user?.role?.name === "Vendedor") {
      setValue("owner", user?.id)
    }
  }, [sellers]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const MAX_IMG_SIZE_MB = 2;
    const maxSizeInBytes = MAX_IMG_SIZE_MB * 1024 * 1024;

    if (file && file.size > maxSizeInBytes) {
      toast.error(
        `El archivo es demasiado grande. El tamaño máximo permitido es de ${MAX_IMG_SIZE_MB} MB.`
      );

      e.target.value = null; // Limpia el campo de selección de archivo
      return null;
    }

    // Procesa el archivo si está dentro del límite permitido
    // (puedes implementar el envío al servidor aquí)
    const imageData = await uploadFile(file, token);

    console.log({ imageData });

    return imageData.completeURL;
  };

  useEffect(() => {
    const fetchDocument = async () => {
      const document = await getDocumentById(external, token);

      console.log(document.data);

      reset(document.data)
      setImages(document.data.images)
    }
    if (token) {
      fetchDocument();
    }
  }, [token]);

  return (
    <div className="normal-form document-form-container">
      <h1 className="title-form">Editar Documento</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-body">
          <section>
            <div className="form-item">
              <label>Título</label>
              <input {...register("title")} type="text" readOnly={true} />
              {errors.title && <span className="validation-error">{errors.title.message}</span>}
            </div>
            <div className="form-item">
              <label>Tipo</label>
              <select {...register("type")} readOnly={true}>
                <option value="Libro fisico" key="Libro fisico">Libro fisico</option>
                <option value="Audiolibro" key="Audiolibro">Audiolibro</option>
              </select>
              {errors.type && <span className="validation-error">{errors.type.message}</span>}
            </div>
            <div className="form-item">
              <label>Vendedor</label>
              <select disabled={user?.role?.name === "Vendedor"} {...register("owner")} readOnly={true}>
                {sellers && sellers.map(seller => <option value={seller.id} key={seller.id}>{seller.name} {seller.lastname}</option>)}
              </select>
              {errors.owner && <span className="validation-error">{errors.owner.message}</span>}
            </div>
            <div className="form-item">
              <label>Author</label>
              <input {...register("author")} type="text" readOnly={true} />
              {errors.author && <span className="validation-error">{errors.author.message}</span>}
            </div>
            <div className="form-item">
              <label>Precio</label>
              <input {...register("price")} type="number" step="0.01" readOnly={true} />
              {errors.price && <span className="validation-error">{errors.price.message}</span>}
            </div>
          </section>
          <section>
            <div className="form-item">
              <label>ISBN</label>
              <input {...register("ISBN")} type="text" readOnly={true} />
              {errors.ISBN && <span className="validation-error">{errors.ISBN.message}</span>}
            </div>
            <div className="form-item">
              <label>Cantidad</label>
              <input {...register("totalQyt")} type="number" readOnly={true} />
              {errors.totalQyt && <span className="validation-error">{errors.totalQyt.message}</span>}
            </div>

            <div className="form-item">
              <label>Imagenes</label>
              {
                images.map((img, i) =>
                  <img key={i} height={150} src={img} alt="Opcional" />
                )
              }
              <input
                {...register("foto")}
                type="file"
                accept={[".png", ".jpeg", ".svg", ".jpg"]}
                onChange={async (e) => {
                  const img = await handleFileChange(e);

                  setImages([...images, img]);
                }}
                readOnly={true}
              />
              {errors.foto && <span className="validation-error">{errors.foto.message}</span>}
            </div>
          </section>
        </div>

        <input className="button-primary" type="submit" value="Guardar" readOnly={true} />
        <div>
          <Link className="link-primary" href={"/"}>Volver al inicio</Link>
        </div>
      </form>
    </div>
  );
}
