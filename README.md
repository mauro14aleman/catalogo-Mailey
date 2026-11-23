# MAILEY — Boutique y catálogo web

Catálogo público en español para joyería, moda, belleza y accesorios. La tienda no muestra enlaces de administración a los clientes.

## Tienda pública
- Diseño Premium Editorial: vino, champagne, crema y dorado.
- Catálogo con filtros, búsqueda y fichas de producto.
- Consultas directas a WhatsApp: +505 8665 4750.
- Enlace a Facebook: https://www.facebook.com/share/p/1A9o1wnssZ/
- Mantiene el catálogo local como respaldo si Supabase aún no está configurado.

## Administrador privado
- Ruta: `/admin/` (inicio de sesión requerido).
- Alta y edición de productos.
- Precio, costo, existencias y disponibilidad.
- Carga de fotografía desde teléfono o computadora.
- Papelera y restauración de productos.
- Requiere Supabase; seguir `database/SETUP.md`.

## Datos y respaldo
- Productos originales: `assets/js/products.js`.
- Fotografías originales: `assets/img/`.
- Importación a Supabase: `database/seed-products.sql`.
- Seguridad y permisos: `database/schema.sql`.
- Rama de respaldo: `backup/pre-redesign-2026-11-22`.

## Publicación
GitHub Pages debe configurarse en Settings → Pages → Deploy from a branch → `main` → `/(root)`.
La rama de rediseño aún debe configurarse con el logotipo nuevo, Supabase y pruebas antes de fusionarla a `main`.
