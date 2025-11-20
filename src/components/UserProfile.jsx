// src/components/UserProfile.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";

/**
 * Perfil publico de un usuario segun su nombre en la URL.
 * Realiza una peticion al endpoint /users/public/:name y muestra informacion basica.
 * @returns {JSX.Element} Tarjeta centrada con datos del perfil o mensajes de estado.
 */
export default function UserProfile() {
  // Nombre capturado desde la ruta /profile/:name.
  const { name } = useParams();
  // Estado local para los datos, estados de carga y posibles errores.
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carga el perfil cada vez que cambia el parametro de la URL.
  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await apiFetch(`/users/public/${name}`);
        setProfile(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [name]);

  // Estados de salida tempranos.
  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;
  if (!profile) return <p>No se encontro el perfil del usuario.</p>;

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      {/* Encabezado y datos basicos del usuario */}
      <h2 style={{ marginBottom: "20px" }}>{profile.username}</h2>
      <p>{profile.email}</p>
      <p>{profile.description || "Sin descripcion disponible"}</p>
    </div>
  );
}
