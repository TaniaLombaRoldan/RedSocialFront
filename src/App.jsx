// src/App.jsx
// Configuramos la navegacion general de la app basandonos en el estado auth.
/**
 * App principal: enruta entre pantallas segun autenticacion y muestra titulos animados.
 * Comentado linea a linea en español sin modificar la logica existente.
 */
// Importamos Router y helpers de react-router-dom.
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// Hooks de React para animaciones y refs.
import { useEffect, useRef } from "react";
// Libreria GSAP para animar el titulo de portada.
import { gsap } from "gsap";
// Hook de autenticacion para saber si hay sesion.
import { useAuth } from "./hooks/useAuth";
// Componentes de formularios de acceso y registro.
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
// Paginas principales de la app.
import HomePage from "./pages/HomePage";
import AllPublicationsPage from "./pages/AllPublicationsPage";
import MyProfilePage from "./pages/MyProfilePage";
import ProfilePage from "./pages/ProfilePage";

/**
 * Componente raiz que define las rutas segun el estado de autenticacion.
 * @returns {JSX.Element} Router con rutas publicas y privadas.
 */
export default function App() {
  // Extraemos el flag de autenticacion desde el contexto global.
  const { isAuthenticated } = useAuth();

  // Render de las rutas. Si no hay sesion, mostramos AuthPage y RegisterPage; si hay, las rutas privadas.
  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <>
            {/* Ruta raiz para login. */}
            <Route path="/" element={<AuthPage />} />
            {/* Ruta de registro. */}
            <Route path="/register" element={<RegisterPage />} />
            {/* Redirige cualquier ruta desconocida a la portada de login. */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            {/* Home con feed de seguidos. */}
            <Route path="/" element={<HomePage />} />
            {/* Feed global de publicaciones. */}
            <Route path="/all" element={<AllPublicationsPage />} />
            {/* Perfil del usuario autenticado. */}
            <Route path="/me" element={<MyProfilePage />} />
            {/* Perfil publico de otro usuario. */}
            <Route path="/profile/:name" element={<ProfilePage />} />
            {/* Resto de rutas desconocidas redirigen a home. */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

/**
 * Pantalla inicial cuando no hay sesion activa.
 * Renderiza el formulario de login con branding Atlantar.
 */
function AuthPage() {
  // Render de la portada de login.
  return (
    <main style={{ maxWidth: 500, margin: "40px auto" }}>
      {/* Titulo animado. */}
      <WaveTitle text="Bienvenido a Atlantar" />
      {/* Formulario de login. */}
      <LoginForm />
    </main>
  );
}

/**
 * Pantalla de registro con el mismo encabezado que login.
 */
function RegisterPage() {
  // Render de la portada de registro.
  return (
    <main style={{ maxWidth: 500, margin: "40px auto" }}>
      {/* Titulo animado. */}
      <WaveTitle text="Bienvenido a Atlantar" />
      {/* Formulario de registro. */}
      <RegisterForm />
    </main>
  );
}

/**
 * Titulo animado letra a letra con GSAP para la portada y registro.
 * @param {{ text: string }} props Texto a animar.
 * @returns {JSX.Element} Encabezado animado.
 */
function WaveTitle({ text }) {
  // Ref para acceder al elemento h2 y sus spans.
  const titleRef = useRef(null);

  // Configuramos animacion GSAP al montar.
  useEffect(() => {
    // Creamos un contexto GSAP ligado al nodo del titulo.
    const ctx = gsap.context(() => {
      // Selector helper de GSAP dentro del titulo.
      const q = gsap.utils.selector(titleRef);
      // Seleccionamos cada letra envuelta en <span>.
      const letters = q("span");

      // Estado inicial de las letras: ocultas y desplazadas.
      gsap.set(letters, {
        opacity: 0,
        y: 40,
        rotateX: -45,
        transformOrigin: "bottom center",
      });

      // Animacion hacia el estado visible con efecto de ola.
      gsap.to(letters, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1.2,
        ease: "back.out(2.4)",
        stagger: 0.06,
        force3D: true,
      });
    }, titleRef);

    // Limpieza del contexto al desmontar.
    return () => ctx.revert();
  }, []);

  // Render del titulo desglosando cada caracter en un span para animarlo.
  return (
    <h2
      ref={titleRef}
      aria-label={text}
      style={{
        display: "flex",
        gap: "2px",
        flexWrap: "wrap",
        letterSpacing: "0.05em",
        color: "var(--atlantar-foam)",
        textTransform: "uppercase",
        fontSize: "1.6rem",
        marginBottom: "16px",
      }}
    >
      {text.split("").map((char, idx) => (
        <span key={idx} style={{ display: "inline-block" }}>
          {/* Usamos nbsp para preservar espacios en la animacion. */}
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
    </h2>
  );
}
