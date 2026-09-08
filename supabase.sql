-- ==========================================================
-- Corre esto en Supabase > SQL Editor > New query > Run
-- ==========================================================

-- Tabla de categorías. is_main marca la categoría estelar.
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_main boolean default false,
  sort_order int default 0
);

-- Nominados dentro de cada categoría.
create table nominees (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  name text not null
);

-- Los votos. voter_id es el código random del navegador de cada persona.
create table votes (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  nominee_id uuid references nominees(id) on delete cascade,
  voter_id uuid not null,
  created_at timestamptz default now(),
  unique (category_id, voter_id) -- esto es lo que impide el doble voto
);

-- Activamos Row Level Security: por defecto esto BLOQUEA todo acceso
-- hasta que agreguemos políticas explícitas abajo.
alter table categories enable row level security;
alter table nominees enable row level security;
alter table votes enable row level security;

-- Cualquiera puede LEER categorías y nominados (para poder votar).
create policy "cualquiera puede leer categorias"
  on categories for select using (true);

create policy "cualquiera puede leer nominados"
  on nominees for select using (true);

-- Cualquiera puede INSERTAR un voto (votar), pero no leerlos.
create policy "cualquiera puede votar"
  on votes for insert with check (true);

-- SOLO tú (tu correo de admin) puedes LEER los votos.
-- Cambia el correo de abajo por el que vas a usar para loguearte.
create policy "solo el admin puede leer los votos"
  on votes for select using (auth.jwt() ->> 'email' = 'TU_CORREO_AQUI@ejemplo.com');

-- ==========================================================
-- Ejemplo de datos de prueba (bórralos y pon los tuyos después)
-- ==========================================================
insert into categories (name, is_main, sort_order) values
  ('Mejor vestido/a de la parranda', false, 1),
  ('El más chismoso del grupo', false, 2),
  ('Rey/Reina del año', true, 3);
