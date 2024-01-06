"use client"
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

const validationSchema = object().shape({
  email: string().required("Ingrese un email"),
  password: string()
    .required("Contraseña requerida"),
});

export default function Login() {
  const { loginUser } = useAuth();

  const router = useRouter();
  const formOptions = {
    resolver: yupResolver(validationSchema),
    // mode: "onBlur",
    mode: "onChange",
  };
  const { register, handleSubmit, formState } = useForm(formOptions)
  const { errors } = formState;

  const handleLogin = async (data) => {
    try {
      const loginResponse = await login(data);

      // Si tuve una respuesta exitosa, almaceno la info obtenida
      localStorage.setItem("token", loginResponse.token);
      localStorage.setItem("user", JSON.stringify(loginResponse.user));
      loginUser(loginResponse.user, loginResponse.token);

      router.push("/documents");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="normal-form">
      <form onSubmit={handleSubmit(handleLogin)}>
        <h1 className="title-form">Iniciar sesión</h1>
        <div className="form-item">
          <label>Email</label>
          <input {...register("email")} type="text" key={"email"} />
          {errors.email && <span className="validation-error">{errors.email.message}</span>}
        </div>
        <div className="form-item">
          <label>Password</label>
          <input {...register("password")} type="password" key={"password"} />
          {errors.password && <span className="validation-error">{errors.password.message}</span>}
        </div>
        <input className="button-primary" type="submit" value="Iniciar sesión" />
        <div><Link className="link-primary" href={"forgot-password"}>¿Has olvidado tu contraseña?</Link></div>
      </form>
    </div>
  );
} 