# Configurar MAILEY ADMIN con Supabase

El catálogo conserva sus 31 productos actuales en `assets/js/products.js` y sus fotografías originales en `assets/img/`. El panel requiere Supabase para sincronizar cambios entre dispositivos.

## Puesta en marcha

1. Crea un proyecto en https://supabase.com/.
2. En SQL Editor, ejecuta `database/schema.sql`.
3. En SQL Editor, ejecuta `database/seed-products.sql` una sola vez. Importa los 31 productos actuales, conserva sus códigos, nombres, categorías, precios y rutas de imagen. Los costos quedan vacíos y el inventario comienza en cero porque el catálogo anterior no tenía existencias verificadas.
4. En Authentication > Users, crea el usuario administrador con tu correo y una contraseña segura.
5. Copia el UUID del usuario y ejecuta en SQL Editor: `insert into public.admin_users(user_id) values ('UUID-DEL-USUARIO');`.
6. En Project Settings > API, copia Project URL y la clave publishable/anon. Nunca uses ni publiques la clave `service_role`.
7. Completa esos dos valores en `assets/js/supabase-config.js`.
8. En Authentication > URL Configuration, configura la URL pública de GitHub Pages como Site URL y agrega también la dirección `/admin/` a Redirect URLs.
9. Ejecuta `database/migrations/002_public_catalog_view.sql` en SQL Editor. Esta migración es obligatoria para que los visitantes solo puedan consultar datos de exhibición y no vean costos ni existencias internas.\n10. Publica la rama de producción en GitHub Pages cuando terminen las pruebas.

## Seguridad

- La ruta `/admin/` no se enlaza desde la tienda pública.
- La pantalla de administración exige inicio de sesión y comprueba el permiso mediante `is_mailey_admin()`.
- RLS permite lectura pública solo de productos activos y no eliminados.
- Solo usuarios registrados en `public.admin_users` pueden administrar productos, inventario y fotografías.
- La papelera usa borrado lógico (`deleted_at`); restaurar vuelve a activar el producto.
- No coloques la clave `service_role` en ningún archivo del repositorio.

## Operación inicial

Después de importar los productos, entra al administrador y registra las existencias reales y costos. No se asignaron cantidades ni costos estimados durante la migración.

## Protección de datos del catálogo público

La tienda consulta la vista `public.catalog_products`, que solo expone campos de exhibición. Los costos y las existencias permanecen en `public.products`, accesible desde el panel autenticado y autorizado. Si el esquema ya estaba instalado antes de esta mejora, ejecuta la migración `database/migrations/002_public_catalog_view.sql`.
