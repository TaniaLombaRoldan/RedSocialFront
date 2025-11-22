// src/components/LoginForm.jsx
import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/useAuth";

/**
 * Formulario de autenticacion que permite a un usuario iniciar sesion.
 * Gestiona el estado local de los campos y despacha la mutacion de login.
 * @returns {JSX.Element} Formulario con inputs basicos y mensajes de error.
 */
export default function LoginForm() {
  // Obtenemos el manejador global para guardar token y datos de usuario.
  const { login } = useAuth();

  // Hook form para manejar validaciones y estado de inputs.
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onBlur",
  });

  // Mutacion encargada de invocar la API de login y manejar la respuesta.
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // La API deberia retornar { access_token, username }.
      login(data.access_token, { username: data.username });
    },
  });

  // Envia el formulario con los valores validados por react-hook-form.
  const onSubmit = async (values) => {
    await mutation.mutateAsync(values);
  };

  // Deshabilita el boton cuando esta enviando o la mutacion esta activa.
  const isDisabled = useMemo(
    () => isSubmitting || mutation.isPending,
    [isSubmitting, mutation.isPending]
  );

  return (
    <div className="auth-form-card">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <h3>Iniciar sesion en Atlantar</h3>

        {/* Campo controlado para capturar el username */}
        <label htmlFor="username">Nombre de usuario</label>
        <input
          id="username"
          type="text"
          placeholder="Tu nombre de usuario"
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

        {/* Campo controlado para la contrasena */}
        <label htmlFor="password">Contrasena</label>
        <input
          id="password"
          type="password"
          placeholder="********"
          autoComplete="current-password"
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

        {/* Deshabilitamos mientras la mutacion esta en curso */}
        <button type="submit" disabled={isDisabled}>
          {isDisabled ? "Entrando..." : "Entrar"}
        </button>

        {/* Feedback visual en caso de error al autenticar */}
        {mutation.isError && (
          <p style={{ color: "red" }}>
            {mutation.error?.message ?? "No se ha podido iniciar sesion."}
          </p>
        )}
      </form>

      {/* Enlace secundario hacia la pantalla de registro */}
      <p>
        No tienes cuenta? <Link to="/register"> Registrate en Atlantar </Link>
      </p>
    </div>
  );
}
