import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

// --- Anti-doble-voto (igual que antes) ---
function getVoterId() {
  let id = localStorage.getItem("voter_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("voter_id", id);
  }
  return id;
}
function getVotedCategories() {
  return JSON.parse(localStorage.getItem("voted_categories") || "[]");
}
function markCategoryAsVoted(categoryId) {
  const voted = getVotedCategories();
  voted.push(categoryId);
  localStorage.setItem("voted_categories", JSON.stringify(voted));
}

export default function Vote() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0); // qué categoría se está mostrando ahora
  const [selected, setSelected] = useState(null); // nominado elegido en la categoría actual
  const [justVoted, setJustVoted] = useState(false); // controla la animación del check
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, sort_order, nominees(id, name)")
        .order("sort_order", { ascending: true });

      if (error) {
        setErrorMsg("No se pudieron cargar las categorías.");
      } else {
        setCategories(data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <div className="page-center">Cargando categorías...</div>;
  if (errorMsg) return <div className="page-center error-banner">{errorMsg}</div>;

  const votedCategories = getVotedCategories();
  const total = categories.length;
  const current = categories[index];

  // Ya se acabaron todas las categorías -> pantalla final
  if (index >= total) {
    return (
      <div className="end-screen">
        <Confetti />
        <h1>¡Listo!</h1>
        <p className="hero-sub">Votaste en las {total} categorías. Gracias por participar.</p>
        <p className="voted-note">Los resultados se revelan la noche del evento.</p>
      </div>
    );
  }

  const alreadyVoted = votedCategories.includes(current.id);

  async function handleConfirm() {
    if (!selected) return;
    const { error } = await supabase.from("votes").insert({
      category_id: current.id,
      nominee_id: selected,
      voter_id: getVoterId(),
    });

    if (error) {
      // ya había votado desde este dispositivo -> igual avanzamos
      markCategoryAsVoted(current.id);
    } else {
      markCategoryAsVoted(current.id);
    }

    setJustVoted(true);
    // Esperamos un momento para que se vea la animación del check,
    // y ahí sí pasamos a la siguiente categoría.
    setTimeout(() => {
      setJustVoted(false);
      setSelected(null);
      setIndex((i) => i + 1);
    }, 650);
  }

  function handleSkip() {
    setSelected(null);
    setIndex((i) => i + 1);
  }

  return (
    <div className="vote-page">
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${((index + (alreadyVoted ? 1 : 0)) / total) * 100}%` }}
        />
      </div>
      <p className="progress-label">
        Categoría {index + 1} de {total}
      </p>

      {/* La "key" hace que React vuelva a montar esta tarjeta cada vez que
          cambia de categoría, y eso dispara la animación de entrada en CSS. */}
      <div className="vote-card" key={current.id}>
        <h2>{current.name}</h2>

        {alreadyVoted ? (
          <>
            <p className="voted-note">Ya votaste aquí desde este dispositivo ✅</p>
            <button className="submit-btn" onClick={handleSkip}>
              Siguiente
            </button>
          </>
        ) : justVoted ? (
          <div className="check-animation">✓</div>
        ) : (
          <>
            <div className="nominee-grid">
              {current.nominees.map((nom) => (
                <button
                  key={nom.id}
                  className={"nominee-card" + (selected === nom.id ? " selected" : "")}
                  onClick={() => setSelected(nom.id)}
                >
                  {nom.name}
                </button>
              ))}
            </div>
            <button className="submit-btn" disabled={!selected} onClick={handleConfirm}>
              Confirmar voto
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Un puñado de emojis "cayendo" con CSS, sin necesidad de librerías extra.
function Confetti() {
  const pieces = Array.from({ length: 24 });
  return (
    <div className="confetti-container">
      {pieces.map((_, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1.2}s`,
            animationDuration: `${2 + Math.random() * 1.5}s`,
          }}
        >
          {["🏆", "🎉", "⭐"][i % 3]}
        </span>
      ))}
    </div>
  );
}