// src/pages/AllPublicationsPage.jsx
import Header from "../components/Header";
import PublicationList from "../components/PublicationList";
import CreatePublication from "../components/CreatePublication";


export default function AllPublicationsPage() {
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <CreatePublication/>
        <h3>Todas las publicaciones</h3>
        <PublicationList/>
      </main>
    </>
  );
}



