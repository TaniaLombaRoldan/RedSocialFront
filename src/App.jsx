// src/App.jsx
// Configuramos la navegacion general de la app basandonos en el estado auth.

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useAuth } from "./context/useAuth";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import HomePage from "./pages/HomePage";
import AllPublicationsPage from "./pages/AllPublicationsPage";
import MyProfilePage from "./pages/MyProfilePage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<AuthPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/all" element={<AllPublicationsPage />} />
            <Route path="/me" element={<MyProfilePage />} />
            <Route path="/profile/:name" element={<ProfilePage />} />
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
  return (
    <main style={{ maxWidth: 500, margin: "40px auto" }}>
      <WaveTitle text="Bienvenido a Atlantar" />
      <LoginForm />
    </main>
  );
}

/**
 * Pantalla de registro con el mismo encabezado que login.
 */
function RegisterPage() {
  return (
    <main style={{ maxWidth: 500, margin: "40px auto" }}>
      <WaveTitle text="Bienvenido a Atlantar" />
      <RegisterForm />
    </main>
  );
}

/**
 * Titulo animado letra a letra con GSAP para la portada y registro.
 */
function WaveTitle({ text }) {
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(titleRef);
      const letters = q("span");

      gsap.set(letters, {
        opacity: 0,
        y: 40,
        rotateX: -45,
        transformOrigin: "bottom center",
      });

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

    return () => ctx.revert();
  }, []);

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
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
    </h2>
  );
}
