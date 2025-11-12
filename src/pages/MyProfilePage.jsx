// src/pages/MyProfilePage.jsx

import Header from "../components/Header";
import MyPublication from "../components/MyPublication";
import MyUserProfile from "../components/MyUserProfile";


export default function MyProfilePage() {
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <h3>Mi perfil</h3>
        <MyUserProfile/>
        <p>Aquí verás tus publicaciones y podrás editar tu nombre.</p>
      </main>
      <MyPublication/>
      
    </>
  );
}



