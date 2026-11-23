# Configurar MAILEY ADMIN con Supabase

El catálogo público puede seguir usando los 31 productos estáticos mientras se configura Supabase. El panel requiere un proyecto Supabase para autenticar al propietario y guardar cambios desde cualquier dispositivo.

1. Crea un proyecto en https://supabase.com/.
2. En SQL Editor, ejecuta todo el archivo `schema.sql`.
3. En Authentication > Users, crea el usuario administrador con tu correo y una contraseña segura.
4. Copia el UUID de ese usuario y ejecuta la sentencia INSERT comentada al final de `schema.sql`, reemplazando el texto de ejemplo.
5. En Project Settings > API, copia Project URL y la clave publishable/anon (nunca la service_role).
6. Pega esos dos valores en `assets/js/supabase-config.js`.
7. En Authentication > URL Configuration, agrega la URL del catálogo y la URL `/admin/` a Site URL / Redirect URLs según corresponda.

## Seguridad
- No publiques la clave `service_role`.
- El usuario administrador debe existir en `public.admin_users`.
- Las políticas RLS impiden que visitantes anónimos editen productos o inventario.
- El borrado del panel es lógico: mueve el producto a papelera; restaurarlo elimina `deleted_at`.

## Migración inicial de productos
El catálogo conserva su archivo local `assets/js/products.js`. Una vez conectado el proyecto, los productos deben importarse a la tabla `products` para que la administración dinámica los controle. No se hace una importación automática para evitar duplicar o alterar registros sin revisar la correspondencia de fotografías.
