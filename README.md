# Atlantar - Red Social Oceanica - DAW - Alumno: Tania Lomba Roldan

- [Introduccion](#introduccion)
- [Funcionalidades-y-tecnologias](#funcionalidades-y-tecnologias)
- [Guia-de-instalacion](#guia-de-instalacion)
- [Guia-de-uso](#guia-de-uso)
- [Conclusion](#conclusion)
- [Contribuciones-y-referencias](#contribuciones-y-referencias)
- [Licencia](#licencia)
- [Contacto](#contacto)

## Introduccion
Atlantar es una SPA (Single Page Application) construida con React y Vite que simula una red social centrada en publicaciones cortas. Permite a los usuarios autenticarse, seguir perfiles, crear publicaciones y explorar feeds personalizados o globales.

- **Justificacion:** Proyecto de ciclo DAW orientado a practicar Frontend moderno (React, hooks, React Query) y consumo de APIs REST.
- **Objetivos:** Implementar una interfaz fluida, paginada y con animaciones suaves; asegurar estados consistentes mediante invalidacion de cache; ofrecer formularios accesibles con validacion.
- **Motivacion:** Reforzar patrones de arquitectura en React, integracion con APIs y diseno UI coherente con un tema visual (Atlantar).

## Funcionalidades y tecnologias
- **Autenticacion:** Login/registro y gestion de sesion con contexto (`AuthContext` + hook `useAuth`).
- **Feed:** Listado global de publicaciones y feed de seguidos con paginacion/infinite scroll (`useInfinitePublications`, `PublicationFollowing`, `PublicationList`).
- **Perfil:** Vista del propio perfil y de perfiles publicos, con acciones de seguir/dejar de seguir y refresco de datos (`ProfilePage`, `MyProfilePage`, `UserProfile`).
- **Creacion de publicaciones:** Formulario controlado con validacion (`CreatePublication`) y actualizacion reactiva de listas via React Query.
- **UI/UX:** Animaciones GSAP (titulos y hero), layout responsive y tematizado con estilos en `src/styles/atlantar.css`.

**Stack principal:** React 18, Vite, React Router, React Query, React Hook Form, GSAP. Estilos en CSS modularizado por fichero tematico.

## Guia de instalacion
1) Clonar el repositorio.  
2) Instalar dependencias:
   ```bash
   npm install
   ```
3) Configurar variables de entorno (si aplica) en un `.env` siguiendo las necesidades de la API (por ejemplo `VITE_API_URL`).  
4) Arrancar en desarrollo:
   ```bash
   npm run dev
   ```
5) Abrir el puerto indicado por Vite (por defecto `http://localhost:5173`).

## Guia de uso
- **Acceso:** Abre la app y autenticarse (login o registro).  
- **Navegacion:** Usa la cabecera para ir a Inicio (seguidos), Todas (feed global) o Mi perfil.  
- **Publicar:** Desde "Todas" o Inicio, escribe en el formulario y pulsa "Publicar". Las listas se refrescan automaticamente.  
- **Seguir/Dejar de seguir:** En la vista de perfil publico (`/profile/:name`) usa el boton CTA; el contador de perfil se actualiza en caliente.  
- **Perfil propio:** En "Mi perfil" revisa tus datos y publicaciones propias.  
- **Explorar:** El feed global muestra todas las publicaciones, el de Inicio solo las de seguidos.

## Conclusion
Este proyecto me ha servido para practicar lo aprendido en el ciclo: montar una app web completa, cuidar el diseno y entender mejor como se conectan las distintas piezas de React con una API. Ha sido un ejercicio util para ganar soltura y me deja ideas claras de que mejorar (anadir comentarios/likes, subir imagenes y pulir la accesibilidad).

## Contribuciones y referencias
- Contribuciones: abrir issues o pull requests siguiendo buenas practicas de commits y linting.
- Agradecimientos: comunidad React y autores de las librerias usadas.
- Referencias: documentacion oficial de React, Vite, React Query, React Hook Form y GSAP.

## Licencia
Proyecto bajo licencia MIT (ver `LICENSE`).

## Contacto
- Alumno: Tania Lomba Roldan (DAW)  
- Email: tu-email@example.com  
- Repositorio: https://github.com/TaniaLombaRoldan/RedSocialFront.git
