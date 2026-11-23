-- MAILEY / Supabase
-- Ejecutar en Supabase SQL Editor. Este esquema mantiene el catálogo público
-- separado del panel privado y usa borrado lógico para permitir restauraciones.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_mailey_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_mailey_admin() from public;
grant execute on function public.is_mailey_admin() to authenticated;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  category text not null,
  name text not null,
  detail text default '',
  price numeric(12,2),
  cost numeric(12,2),
  stock integer not null default 0 check (stock >= 0),
  image_url text,
  gallery jsonb not null default '[]'::jsonb,
  description text default '',
  availability text not null default 'Disponible',
  is_active boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Public can view active MAILEY products" on public.products;
create policy "Public can view active MAILEY products" on public.products
for select to anon, authenticated
using (is_active = true and deleted_at is null);

drop policy if exists "Admins can view all MAILEY products" on public.products;
create policy "Admins can view all MAILEY products" on public.products
for select to authenticated using (public.is_mailey_admin());

drop policy if exists "Admins can insert MAILEY products" on public.products;
create policy "Admins can insert MAILEY products" on public.products
for insert to authenticated with check (public.is_mailey_admin());

drop policy if exists "Admins can update MAILEY products" on public.products;
create policy "Admins can update MAILEY products" on public.products
for update to authenticated using (public.is_mailey_admin()) with check (public.is_mailey_admin());

drop policy if exists "Admins can delete MAILEY products" on public.products;
create policy "Admins can delete MAILEY products" on public.products
for delete to authenticated using (public.is_mailey_admin());

drop policy if exists "Admins can read their own admin record" on public.admin_users;
create policy "Admins can read their own admin record" on public.admin_users
for select to authenticated using (user_id = auth.uid());

-- Bucket público para que las fotos se vean en la tienda.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view MAILEY product photos" on storage.objects;
create policy "Public can view MAILEY product photos" on storage.objects
for select to anon, authenticated using (bucket_id = 'product-images');

drop policy if exists "Admins can upload MAILEY product photos" on storage.objects;
create policy "Admins can upload MAILEY product photos" on storage.objects
for insert to authenticated with check (bucket_id = 'product-images' and public.is_mailey_admin());

drop policy if exists "Admins can update MAILEY product photos" on storage.objects;
create policy "Admins can update MAILEY product photos" on storage.objects
for update to authenticated using (bucket_id = 'product-images' and public.is_mailey_admin())
with check (bucket_id = 'product-images' and public.is_mailey_admin());

drop policy if exists "Admins can delete MAILEY product photos" on storage.objects;
create policy "Admins can delete MAILEY product photos" on storage.objects
for delete to authenticated using (bucket_id = 'product-images' and public.is_mailey_admin());

-- Después de crear tu usuario en Authentication > Users, agrega su UUID:
-- insert into public.admin_users(user_id) values ('PEGA-AQUI-EL-UUID-DEL-USUARIO');
