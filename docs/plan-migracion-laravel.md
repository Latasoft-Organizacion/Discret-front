# Plan de migracion a Laravel

Este proyecto actualmente es un frontend React + Vite. La migracion recomendada es mantener el frontend como aplicacion React y crear un backend Laravel separado que entregue API REST, autenticacion, reservas, clientes, habitaciones, valoraciones y configuracion.

## Estructura recomendada

```text
Reserva Moteles/
  motel-reservas-front/      Frontend React actual
  motel-reservas-api/        Backend Laravel nuevo
```

Separar ambos proyectos ayuda a desplegar el frontend como sitio estatico y el backend como aplicacion Laravel con base de datos.

## Fases de migracion

1. Crear backend Laravel
   - Instalar Composer.
   - Crear proyecto Laravel en `motel-reservas-api`.
   - Configurar `.env` con MySQL.
   - Activar CORS para que React pueda consumir la API.

2. Crear base de datos
   - Crear las migraciones de las tablas indicadas en `modelo-base-datos.md`.
   - Crear seeders con datos iniciales: habitaciones 101-108, tipos de habitacion, estados y configuracion.

3. Autenticacion
   - Implementar login de administrador.
   - Implementar registro/login de cliente.
   - Usar Laravel Sanctum para tokens API.

4. Conectar frontend
   - Crear una capa `src/services/api.ts`.
   - Reemplazar datos simulados por llamadas HTTP.
   - Guardar token de sesion y proteger rutas admin.

5. Reservas
   - Cliente crea reserva.
   - Admin crea reserva manual.
   - Admin edita, confirma, cancela y ve detalle.
   - Generar ID de reserva.
   - Generar QR de reserva.

6. Valoraciones
   - Al finalizar una reserva, Laravel programa el envio del link de valoracion.
   - El envio debe ocurrir 30 minutos despues de la hora de salida.
   - Guardar puntuacion, etiquetas y comentario.

7. Notificaciones
   - Correo de confirmacion de reserva.
   - Correo de QR/ID para porteria.
   - Correo o WhatsApp con link de valoracion.

8. Despliegue
   - Frontend: `npm run build` y subir `dist`.
   - Backend Laravel: subir proyecto, configurar `public` como raiz, `.env`, base de datos y `php artisan migrate --seed`.

## Comandos cuando Composer este instalado

```bash
cd "C:\Users\mende\OneDrive\Desktop\Latasoft\Reserva Moteles"
composer create-project laravel/laravel motel-reservas-api
cd motel-reservas-api
composer require laravel/sanctum
php artisan sanctum:install
php artisan migrate
php artisan serve
```

## Variables `.env` principales

```env
APP_NAME=DISCRET
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=discret_reservas
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=discretchile@gmail.com
MAIL_FROM_NAME=DISCRET
```

## Prioridad tecnica

La primera integracion real debe ser:

1. `clientes`
2. `usuarios_admin`
3. `habitaciones`
4. `reservas`
5. `valoraciones`
6. `configuracion_sistema`

Con eso el sistema ya puede operar con datos reales.
