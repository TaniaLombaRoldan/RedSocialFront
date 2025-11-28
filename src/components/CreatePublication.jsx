// src/components/CreatePublication.jsx
/**
 * Formulario controlado para crear publicaciones.
 * Comentado linea a linea en español sin modificar la logica.
 */
// useMemo para deshabilitar boton en base a estados.
import { useMemo } from "react";
// useForm para gestionar inputs y validacion.
import { useForm } from "react-hook-form";
// useMutation y useQueryClient para mutar y refrescar cache.
import { useMutation, useQueryClient } from "@tanstack/react-query";
// Hook de autenticacion para obtener el usuario actual.
import { useAuth } from "../hooks/useAuth";
// Cliente HTTP para comunicarse con la API.
import { apiFetch } from "../api/client";

/**
 * @typedef {Object} CreatePublicationProps
 * @property {(publication: Record<string, unknown>) => void} [onNewPublication]
 * Callback opcional para avisar al componente padre cuando se crea la publicacion.
 */

/**
 * Componente controlado que permite crear publicaciones para el usuario autenticado.
 * Valida el formulario, muestra errores y mantiene sincronizadas las listas relacionadas
 * forzando la invalidacion de queries en React Query.
 *
 * @param {CreatePublicationProps} props
 * @returns {JSX.Element}
 */
export default function CreatePublication({ onNewPublication }) {
  // Obtenemos los datos del usuario autenticado.
  const { user } = useAuth();
  // Cliente de React Query para invalidar queries tras mutar.
  const queryClient = useQueryClient();

  // Configuracion de react-hook-form.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    // Valor inicial del textarea.
    defaultValues: {
      text: "",
    },
    // Validamos al perder foco.
    mode: "onBlur",
  });

  // Mutacion para crear una publicacion nueva.
  const mutation = useMutation({
    // Llamada a la API con POST y el texto.
    mutationFn: async ({ text }) =>
      apiFetch("/publications/", {
        method: "POST",
        body: JSON.stringify({ text }),
      }),
    // Al completar con exito, reseteamos e invalidamos listas relacionadas.
    onSuccess: async (newPublication) => {
      // Limpiamos formulario.
      reset();
      // Avisamos al padre si se proveyo callback.
      if (onNewPublication) onNewPublication(newPublication);

      // Invalidamos las queries de publicaciones para refrescar datos.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/publications/"], exact: false }),
        queryClient.invalidateQueries({ queryKey: [`/publications/public/${user.username}`], exact: false }),
        queryClient.invalidateQueries({ queryKey: ["/publications/following"], exact: false }),
      ]);
    },
  });

  // Submit handler para crear la publicacion.
  const onSubmit = async (values) => {
    // Si no hay usuario, no permitimos enviar.
    if (!user) return;
    await mutation.mutateAsync(values);
  };

  // Determina si el boton debe estar deshabilitado.
  const isDisabled = useMemo(
    () => !user || isSubmitting || mutation.isPending,
    [user, isSubmitting, mutation.isPending]
  );

  // Render del formulario.
  return (
    <div
      style={{
        maxWidth: "640px",
        margin: "20px auto 30px",
        padding: "50px 70px 50px 40px",
        background: "linear-gradient(135deg, rgba(3,31,59,0.85), rgba(10,79,112,0.75))",
        borderRadius: "20px",
        boxShadow: "0 25px 45px rgba(3,31,59,0.55)",
        border: "1px solid rgba(244,251,255,0.08)",
        color: "var(--atlantar-light)",
      }}
    >
      {/* Titulo de la seccion. */}
      <h3 style={{ marginTop: 0, letterSpacing: "0.05em", color: "var(--atlantar-foam)" }}>
        Crea una nueva publicacion
      </h3>
      {/* Formulario principal. */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
        noValidate
      >
        {/* Campo de texto de la publicacion. */}
        <textarea
          placeholder={user ? "Que esta pasando?" : "Inicia sesion para publicar"}
          rows={4}
          {...register("text", {
            required: user ? "La publicacion no puede estar vacia." : false,
            minLength: {
              value: 3,
              message: "La publicacion debe tener al menos 3 caracteres.",
            },
            maxLength: {
              value: 280,
              message: "La publicacion no puede superar los 280 caracteres.",
            },
          })}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "16px",
            border: "1px solid rgba(244,251,255,0.2)",
            resize: "none",
            backgroundColor: "#ffffff",
            color: "#082032",
            boxShadow: "0 10px 25px rgba(3,31,59,0.25)",
          }}
          disabled={isDisabled}
        />
        {/* Mensaje de error para el texto si aplica. */}
        {errors.text && <p style={{ color: "red" }}>{errors.text.message}</p>}
        {/* Boton de envio alineado a la derecha. */}
        <button type="submit" disabled={isDisabled} style={{ alignSelf: "flex-end" }}>
          {mutation.isPending || isSubmitting ? "Publicando..." : "Publicar"}
        </button>
      </form>
      {/* Error general de la mutacion. */}
      {mutation.isError && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {mutation.error?.message || "Error al crear la publicacion."}
        </p>
      )}
    </div>
  );
}
