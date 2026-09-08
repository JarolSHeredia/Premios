import { createClient } from "@supabase/supabase-js";

// Estas dos variables las vas a sacar de TU proyecto de Supabase
// (panel de Supabase > Project Settings > API).
// Van en un archivo .env que tú creas localmente (mira .env.example).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Este "cliente" es el objeto que usamos en toda la app para hablar
// con la base de datos: leer categorías, insertar votos, hacer login, etc.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
