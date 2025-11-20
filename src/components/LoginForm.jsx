// src/components/LoginForm.jsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";

/**
 * Formulario de autenticacion que permite a un usuario iniciar sesion.
 * Gestiona el estado local de los campos y despacha la mutacion de login.
 * @returns {JSX.Element} Formulario con inputs basicos y mensajes de error.
 */
export default function LoginForm() {
  // Obtenemos el manejador global para guardar token y datos de usuario.
  const { login } = useAuth();
  // Estado controlado para inputs de nombre de usuario y contrasena.
  const [form, setForm] = useState({ username: "", password: "" });

  // Mutacion encargada de invocar la API de login y manejar la respuesta.
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // La API deberia retornar { access_token, username }.
      login(data.access_token, { username: data.username });
    },
  });

  // Previene el submit por defecto y dispara la mutacion con los datos actuales.
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="auth-form-card">
      <form onSubmit={handleSubmit}>
        <h3>Iniciar sesion en Atlantar</h3>

        {/* Campo controlado para capturar el username */}
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        {/* Campo controlado para la contrasena */}
        <input
          type="password"
          placeholder="Contrasena"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        {/* Deshabilitamos mientras la mutacion esta en curso */}
        <button type="submit" disabled={mutation.isPending}>
          Entrar
        </button>

        {/* Feedback visual en caso de error al autenticar */}
        {mutation.isError && (
          <p style={{ color: "red" }}>{mutation.error.message}</p>
        )}
      </form>

      {/* Enlace secundario hacia la pantalla de registro */}
      <p>
        No tienes cuenta? <Link to="/register"> Registrate en Atlantar </Link>
      </p>
    </div>
  );
}
