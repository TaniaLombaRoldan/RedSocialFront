// src/App.jsx
// Configuramos la navegacion general de la app basandonos en el estado auth.

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
      <h2>Bienvenida a Atlantar</h2>
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
      <h2>Bienvenida a Atlantar</h2>
      <RegisterForm />
    </main>
  );
}
