// src/components/RegisterForm.jsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/auth";
import { Link } from "react-router-dom";

/**
 * Formulario controlado para registrar un nuevo usuario.
 * Gestiona el estado local, ejecuta la mutacion de registro y muestra feedback.
 * @returns {JSX.Element} Layout centrado con inputs, boton y comentarios de estado.
 */
export default function RegisterForm() {
  // Estado controlado de los campos del formulario.
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Mutacion que llama al endpoint de registro.
  const mutation = useMutation({
    mutationFn: registerUser,
  });

  // Previene el submit por defecto y dispara la mutacion con los valores actuales.
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="auth-form-card">
      <form onSubmit={handleSubmit}>
        <h3>Registro en Atlantar</h3>

        {/* Campo para el nombre de usuario */}
        <input
          type="text"
          placeholder="Usuario"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        {/* Campo para el correo electronico */}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        {/* Campo para la contrasena */}
        <input
          type="password"
          placeholder="Contrasena"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        {/* Boton principal deshabilitado mientras la mutacion esta en curso */}
        <button type="submit" disabled={mutation.isPending}>
          Unirme a Atlantar
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
