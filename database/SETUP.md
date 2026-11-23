# Configuración de MAILEY ADMIN con Supabase

La tienda conserva los 31 productos originales en `assets/js/products.js` y las fotografías originales en `assets/img/`. El panel privado usa Supabase para sincronizar cambios entre dispositivos.

## Estado de configuración de este proyecto

El proyecto Supabase MAILEY-CATALOG ya fue creado. También se ejecutaron `database/schema.sql`, `database/seed-products.sql` y `database/migrations/002_public_catalog_view.sql`; el usuario administrador fue agregado a `public.admin_users`. La URL del proyecto y la clave publishable están configuradas en `assets/js/supabase-config.js`.

## Acceso

- Tienda pública: raíz del sitio.
- Panel privado: `/admin/`.
- Inicia sesión con el correo y contraseña creados en Supabase Authentication.
- El panel comprueba el permiso mediante `public.is_mailey_admin()`. Crear un usuario en Authentication no basta: su UUID debe estar registrado en `public.admin_users`.

## Seguridad y datos

- La tienda consulta únicamente `public.catalog_products`, una vista que expone campos de exhibición.
- Costos y existencias se guardan en `public.products` y requieren sesión autorizada.
- Solo los usuarios registrados en `public.admin_users` pueden administrar productos y subir fotografías.
- La papelera usa borrado lógico (`deleted_at`); restaurar vuelve a activar el producto.
- El bucket `product-images` es público para que las fotografías de producto se vean en la tienda; las operaciones de carga, modificación y borrado están restringidas a administradores.
- La clave publishable puede estar en el frontend. Nunca coloques una clave `service_role` o secret en el repositorio.

## Importación inicial

`database/seed-products.sql` se ejecuta una sola vez después de `database/schema.sql`. Importa los 31 productos actuales, conserva sus códigos, nombres, categorías, precios y rutas de imagen. Los costos quedan vacíos y el inventario comienza en cero porque el catálogo anterior no tenía existencias verificadas.

No vuelvas a ejecutar el script de importación para registrar nuevos productos. Los productos nuevos se crean desde MAILEY ADMIN.

## Operación diaria

1. Abre `/admin/`.
2. Inicia sesión con tu cuenta autorizada.
3. Pulsa **Nuevo producto** para registrar nombre, código, categoría, precio, costo, existencias, descripción y fotografía.
4. Usa **Editar** para actualizar la ficha.
5. Usa **Papelera** para retirar un producto temporalmente y **Restaurar** para recuperarlo.

Después de importar el catálogo inicial, registra los costos y existencias reales. No se asignaron cantidades ni costos estimados durante la migración.
