-- MAILEY migration 002: safe public catalog projection
-- Run once in Supabase SQL Editor after database/schema.sql.
-- Public visitors can read only storefront fields, never internal cost or stock.

drop policy if exists "Public can view active MAILEY products" on public.products;
drop policy if exists "Admins can view all MAILEY products" on public.products;
create policy "Admins can view all MAILEY products" on public.products
for select to authenticated using (public.is_mailey_admin());

revoke all on public.products from anon;
grant select, insert, update, delete on public.products to authenticated;

create or replace view public.catalog_products
with (security_barrier = true)
as
select
  id, code, category, name, detail, price,
  image_url, gallery, description, availability,
  created_at, updated_at
from public.products
where is_active = true and deleted_at is null;

revoke all on public.catalog_products from public;
grant select on public.catalog_products to anon, authenticated;
