# Premios del Pana 🏆

Papeleta de votación anónima con resultados privados.

## Weekend 1 — dejarlo corriendo en tu compu

1. **Instala Node.js** (si no lo tienes): https://nodejs.org (versión LTS).
2. **Crea un proyecto en Supabase** (gratis): https://supabase.com → New project.
3. En tu proyecto de Supabase, ve a **SQL Editor** y pega el contenido de `supabase.sql`
   (antes de correrlo, cambia `TU_CORREO_AQUI@ejemplo.com` por el correo que vas a usar tú).
4. Ve a **Authentication > Users** en Supabase y crea un usuario manualmente con ese
   mismo correo y una contraseña — ese va a ser TU login para `/admin`.
5. Ve a **Project Settings > API** y copia:
   - Project URL
   - anon public key
6. En la carpeta del proyecto, copia `.env.example` a un archivo nuevo llamado `.env`
   y pega ahí esos dos valores.
7. Instala dependencias y corre el proyecto:
   ```
   npm install
   npm run dev
   ```
8. Abre `http://localhost:5173` — ahí está la papeleta. Abre
   `http://localhost:5173/admin` y logueate con el usuario que creaste — ahí están
   los resultados.

## Weekend 2 — categorías reales + publicarlo

1. Edita las categorías y nominados directamente en Supabase (Table Editor > categories / nominees),
   o te ayudo a hacerte un formulario para eso.
2. Cuando esté listo, lo subimos a **Vercel** (gratis) para que quede en un link real
   que le mandas a tus panas.

## Estructura del proyecto

- `src/pages/Vote.jsx` — la papeleta pública.
- `src/pages/Admin.jsx` — login + resultados privados.
- `src/supabaseClient.js` — la conexión con la base de datos.
- `supabase.sql` — las tablas y las reglas de seguridad.
