// Punto de entrada de la aplicacion React.
// Comentado linea a linea en español sin modificar la logica.
// Importamos React para JSX.
import React from "react";
// ReactDOM para renderizar en el DOM real.
import ReactDOM from "react-dom/client";
// Cliente y proveedor de React Query para cache y datos remotos.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// GSAP base para animaciones.
import { gsap } from "gsap";
// Plugin de GSAP para animaciones basadas en scroll.
import { ScrollTrigger } from "gsap/ScrollTrigger";
// Proveedor de autenticacion que envuelve la app.
import { AuthProvider } from "./context/AuthContext";
// Componente raiz de la aplicacion.
import App from "./App";
// Estilos globales de la app.
import "./styles/atlantar.css";

// Registramos ScrollTrigger una sola vez para todas las animaciones de scroll.
gsap.registerPlugin(ScrollTrigger);

// Instanciamos el cliente de React Query para gestionar cache y peticiones.
const queryClient = new QueryClient();

// Montamos la aplicacion en el elemento root del HTML.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Proveedor de React Query para que todos los componentes usen el mismo cliente. */}
    <QueryClientProvider client={queryClient}>
      {/* Proveedor de autenticacion que expone token y usuario al arbol. */}
      <AuthProvider>
        {/* Componente principal con rutas. */}
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
