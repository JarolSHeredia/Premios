import { Routes, Route } from "react-router-dom";
import Vote from "./pages/Vote.jsx";
import Admin from "./pages/Admin.jsx";

// Aquí defines qué componente se muestra según la URL.
// Tus panas entran a tudominio.com/  -> ven Vote (la papeleta)
// Tú entras a tudominio.com/admin    -> ves Admin (login + resultados)
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Vote />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
