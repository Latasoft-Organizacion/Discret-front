# Modelo de base de datos en español

Las tablas se nombran en español para mantener coherencia con el sistema. Los campos tecnicos `id`, `created_at`, `updated_at` se mantienen como convencion Laravel.

## usuarios_admin

Administradores que acceden al panel.

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| id | bigint | Identificador |
| nombre | varchar | Nombre del administrador |
| correo | varchar unique | Correo de acceso |
| password | varchar | Contrasena cifrada |
| rol | varchar | admin, soporte, recepcion |
| activo | boolean | Estado del usuario |
| ultimo_acceso_at | timestamp nullable | Ultimo acceso |

## clientes

Clientes registrados desde el landing o formulario.

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| id | bigint | Identificador |
| nombre | varchar | Nombre |
| apellido | varchar | Apellido |
| telefono | varchar | Telefono |
| correo | varchar unique | Correo |
| fecha_nacimiento | date | Fecha de nacimiento |
| password | varchar nullable | Contrasena cifrada |
| mayor_edad_confirmado | boolean | Confirmacion de mayoria de edad |
| activo | boolean | Estado |
| ultimo_acceso_at | timestamp nullable | Ultimo acceso |

## tipos_habitacion

Categorias usadas en reserva cliente.

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| id | bigint | Identificador |
| nombre | varchar | Suite estandar, premium, jacuzzi, tematica |
| descripcion | text nullable | Detalle |
| precio_base | integer | Precio de referencia |
| activo | boolean | Disponible para reservas |

## habitaciones

Habitaciones administrables desde el panel.

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| id | bigint | Identificador |
| tipo_habitacion_id | foreignId | Relacion con tipos_habitacion |
| numero | varchar | 101, 102, etc. |
| nombre | varchar | Nombre visible |
| descripcion | text nullable | Descripcion interna |
| precio | integer | Precio actual |
| estado | enum | disponible, ocupada, limpieza, bloqueada |
| activa | boolean | Si aparece en el sistema |

## reservas

Reservas creadas por cliente o por administrador.

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| id | bigint | Identificador |
| codigo_reserva | varchar unique | ID visible para cliente/porteria |
| cliente_id | foreignId nullable | Cliente registrado |
| habitacion_id | foreignId | Habitacion reservada |
| creada_por_admin_id | foreignId nullable | Admin que la creo manualmente |
| nombre_cliente | varchar nullable | Nombre si no existe cliente registrado |
| telefono_cliente | varchar nullable | Telefono |
| correo_cliente | varchar nullable | Correo |
| cantidad_personas | integer | Personas |
| fecha_entrada | datetime | Entrada |
| fecha_salida | datetime | Salida |
| estado | enum | pendiente, confirmada, ocupada, finalizada, cancelada |
| tipo_pago | enum nullable | efectivo, transferencia, tarjeta, online |
| comentario | text nullable | Comentario del cliente/admin |
| qr_token | varchar unique nullable | Token para QR |
| qr_enviado_at | timestamp nullable | Fecha de envio de QR |

## valoraciones

Opiniones enviadas despues de la salida.

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| id | bigint | Identificador |
| reserva_id | foreignId | Reserva valorada |
| cliente_id | foreignId nullable | Cliente |
| puntuacion | tinyInteger | 1 a 5 |
| etiquetas | json nullable | Etiquetas seleccionadas |
| comentario | text nullable | Comentario |
| token | varchar unique | Token publico del link |
| enviada_at | timestamp nullable | Cuando se envio el link |
| respondida_at | timestamp nullable | Cuando el cliente respondio |

## envios_programados

Permite programar correos/WhatsApp, incluida la valoracion 30 minutos despues.

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| id | bigint | Identificador |
| reserva_id | foreignId nullable | Reserva relacionada |
| cliente_id | foreignId nullable | Cliente relacionado |
| tipo | enum | confirmacion_reserva, qr_porteria, valoracion_post_salida |
| canal | enum | correo, whatsapp |
| destinatario | varchar | Correo o telefono |
| asunto | varchar nullable | Asunto correo |
| mensaje | text | Contenido |
| programado_para | datetime | Fecha/hora de envio |
| enviado_at | timestamp nullable | Fecha enviada |
| estado | enum | pendiente, enviado, fallido |
| error | text nullable | Error si falla |

## configuracion_sistema

Configuraciones generales editables desde el panel.

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| id | bigint | Identificador |
| clave | varchar unique | Nombre de configuracion |
| valor | json | Valor configurable |
| descripcion | varchar nullable | Descripcion visible |

Ejemplos de claves:

- `whatsapp`
- `politicas_reserva`
- `horarios_reserva`
- `valoraciones_post_salida`
- `preferencias_sistema`
- `datos_motel`

## reportes_generados

Registro de reportes creados desde el panel.

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| id | bigint | Identificador |
| usuario_admin_id | foreignId | Admin que genero el reporte |
| tipo | enum | diario, semanal, mensual |
| formato | enum | pdf, excel |
| fecha_inicio | date | Desde |
| fecha_fin | date | Hasta |
| archivo_path | varchar nullable | Ruta del archivo |
| estado | enum | pendiente, generado, fallido |

## relaciones principales

- Un cliente tiene muchas reservas.
- Una habitacion tiene muchas reservas.
- Una reserva puede tener una valoracion.
- Una reserva puede tener varios envios programados.
- Un admin puede crear reservas y reportes.
