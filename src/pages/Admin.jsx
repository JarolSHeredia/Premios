import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

export default function Admin() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Al cargar, revisamos si ya hay una sesión de Supabase activa
  // (por si recargas la página no te vuelve a pedir login).
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (checkingSession) return <div className="page-center">Cargando...</div>;

  return session ? <Results /> : <Login />;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError("Correo o contraseña incorrectos.");
  }

  return (
    <div className="page-center">
      <form className="login-card" onSubmit={handleLogin}>
        <h1>Panel privado</h1>
        <p className="hero-sub">Solo tú deberías tener este correo y contraseña.</p>
        <input
          type="email"
          placeholder="Tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-banner">{error}</p>}
        <button className="submit-btn" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

function Results() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      // Gracias a la política de RLS en Supabase, esta consulta SOLO
      // devuelve datos si el usuario logueado es el admin autorizado.
      // Cualquier otra persona que intente esto obtiene una lista vacía.
      const { data } = await supabase
        .from("votes")
        .select("category_id, nominee_id, categories(name, is_main), nominees(name)");
      setRows(data || []);
      setLoading(false);
    }
    loadResults();
  }, []);

  if (loading) return <div className="page-center">Cargando resultados...</div>;

  // Agrupamos los votos por categoría y contamos cuántos tiene cada nominado.
  const grouped = {};
  for (const row of rows) {
    const catName = row.categories.name;
    if (!grouped[catName]) {
      grouped[catName] = { isMain: row.categories.is_main, counts: {} };
    }
    const nomName = row.nominees.name;
    grouped[catName].counts[nomName] = (grouped[catName].counts[nomName] || 0) + 1;
  }

  return (
    <div className="admin-page">
      <header className="hero">
        <span className="hero-eyebrow">Solo tú ves esto</span>
        <h1>Resultados</h1>
        <button className="signout-btn" onClick={() => supabase.auth.signOut()}>
          Cerrar sesión
        </button>
      </header>

      <div className="category-list">
        {Object.entries(grouped).map(([catName, { isMain, counts }]) => {
          const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
          const winner = sorted[0];
          return (
            <section
              key={catName}
              className={"category-block" + (isMain ? " main-category" : "")}
            >
              <h2>{catName}</h2>
              {winner && (
                <p className="winner-line">
                  Ganador: <strong>{winner[0]}</strong> ({winner[1]} votos)
                </p>
              )}
              <ul className="results-list">
                {sorted.map(([name, count]) => (
                  <li key={name}>
                    {name} — {count}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
