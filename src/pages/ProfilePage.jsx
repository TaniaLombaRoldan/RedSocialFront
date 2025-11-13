// src/pages/ProfilePage.jsx
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import ProfilePublication from "../components/ProfilePublication";
import UserProfile from "../components/UserProfile";

const palette = ["#031f3b", "#0a4f70", "#1b7891", "#6bc1d5", "#f4fbff"];
const focusPoints = [
  "Combinar brillos celestes con sombras profundas.",
  "Usar fotos con bruma suave y reflejos de agua.",
  "Mantener tipografias limpias y espaciadas.",
];

/**
 * Pagina publica que muestra la informacion y publicaciones de un usuario especifico.
 * Usa el parametro :name de la URL para cargar datos y feed filtrado, aplicando la piel Atlantar.
 * @returns {JSX.Element} Cabecera, resumen del perfil y listado de publicaciones.
 */
export default function ProfilePage() {
  const { name } = useParams();

  return (
    <>
      <Header />
      <div className="atlantar-shell">
        <section className="atlantar-hero">
          <p className="atlantar-tagline">Timeline Atlantar</p>
          <h1>@{name}</h1>
          <p className="atlantar-description">
            Destellos marinos, cielos electricos y mensajes que mezclan calma y
            energia. Esta vista te ayuda a imaginar el branding de tu cuenta con
            pocos bloques y estilos basados en flex y grid.
          </p>
          <div className="atlantar-actions">
            <button type="button" className="primary">
              Seguir
            </button>
            <button type="button" className="secondary">
              Compartir vibra
            </button>
          </div>
        </section>

        <section className="atlantar-grid">
          <article className="atlantar-panel">
            <h3>Identidad</h3>
            <p>
              Atlantar mezcla mar y cielo: azul profundo, luces turquesas y
              texto claro. Usa bloques amplios y sombras largas para que cada
              post respire.
            </p>
          </article>

          <article className="atlantar-panel">
            <h3>Marea creativa</h3>
            <ul className="atlantar-list">
              {focusPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>

          <article className="atlantar-panel">
            <h3>Paleta base</h3>
            <div className="atlantar-palette">
              {palette.map((tone) => (
                <div
                  key={tone}
                  className="atlantar-swatch"
                  style={{ backgroundColor: tone }}
                >
                  {tone}
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="atlantar-shadow-card">
          <UserProfile />
        </section>

        <section className="atlantar-shadow-card">
          <ProfilePublication />
        </section>
      </div>
    </>
  );
}
