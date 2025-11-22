// src/components/RegisterForm.jsx
import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { registerUser } from "../api/auth";
import { Link } from "react-router-dom";

/**
 * Formulario controlado para registrar un nuevo usuario.
 * Gestiona el estado local, ejecuta la mutacion de registro y muestra feedback.
 * @returns {JSX.Element} Layout centrado con inputs, boton y comentarios de estado.
 */
export default function RegisterForm() {
  // Hook form para manejar estado y validaciones de los campos.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  // Mutacion que llama al endpoint de registro.
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => reset(),
  });

  // Previene el submit por defecto y dispara la mutacion con los valores actuales.
  const onSubmit = async (values) => {
    await mutation.mutateAsync(values);
  };

  // Deshabilita inputs mientras se envia o la mutacion esta activa.
  const isDisabled = useMemo(
    () => isSubmitting || mutation.isPending,
    [isSubmitting, mutation.isPending]
  );

  return (
    <div className="auth-form-card">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <h3>Registro en Atlantar</h3>

        {/* Campo para el nombre de usuario */}
        <input
          type="text"
          placeholder="Usuario"
          autoComplete="username"
          {...register("username", {
            required: "El nombre de usuario es obligatorio.",
            minLength: {
              value: 3,
              message: "El nombre de usuario debe tener al menos 3 caracteres.",
            },
            maxLength: {
              value: 30,
              message: "El nombre de usuario no puede superar los 30 caracteres.",
            },
          })}
          disabled={isDisabled}
        />
        {errors.username && (
          <p style={{ color: "red" }}>{errors.username.message}</p>
        )}

        {/* Campo para el correo electronico */}
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          {...register("email", {
            required: "El correo electronico es obligatorio.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/u,
              message: "Introduce un correo electronico valido.",
            },
          })}
          disabled={isDisabled}
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

        {/* Campo para la contrasena */}
        <input
          type="password"
          placeholder="Contrasena"
          autoComplete="new-password"
          {...register("password", {
            required: "La contrasena es obligatoria.",
            minLength: {
              value: 6,
              message: "La contrasena debe tener al menos 6 caracteres.",
            },
          })}
          disabled={isDisabled}
        />
        {errors.password && (
          <p style={{ color: "red" }}>{errors.password.message}</p>
        )}

        {/* Boton principal deshabilitado mientras la mutacion esta en curso */}
        <button type="submit" disabled={isDisabled}>
          {isDisabled ? "Registrando..." : "Unirme a Atlantar"}
        </button>

        {/* Mensajes de error/exito segun el estado de la mutacion */}
        {mutation.isError && (
          <p style={{ color: "red" }}>{mutation.error.message}</p>
        )}
        {mutation.isSuccess && (
          <p style={{ color: "green" }}>Registro completado en Atlantar</p>
        )}
      </form>

      {/* Enlace de navegacion para usuarios ya registrados */}
      <p>
        Ya tienes cuenta? <Link to="/"> Inicia sesion en Atlantar</Link>
      </p>
    </div>
  );
}
