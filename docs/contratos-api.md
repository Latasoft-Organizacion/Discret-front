# Contratos API para Laravel

Base local recomendada:

```text
http://localhost:8000/api
```

En produccion:

```text
https://latasoft.cl/discret-api/api
```

## Autenticacion

### POST /auth/admin/login

Login del administrador.

```json
{
  "correo": "correo@ejemplo.com",
  "password": "********"
}
```

Respuesta:

```json
{
  "token": "sanctum-token",
  "usuario": {
    "id": 1,
    "nombre": "Administrador",
    "correo": "correo@ejemplo.com",
    "rol": "admin"
  }
}
```

### POST /clientes/registro

Registro de cliente.

```json
{
  "nombre": "Juan",
  "apellido": "Perez",
  "telefono": "+56 9 1234 5678",
  "correo": "correo@ejemplo.com",
  "fecha_nacimiento": "1995-05-15",
  "password": "********",
  "password_confirmation": "********",
  "mayor_edad_confirmado": true
}
```

## Habitaciones

### GET /habitaciones

Lista habitaciones para admin.

Filtros:

```text
?estado=disponible
?buscar=101
```

### POST /habitaciones

Crea habitacion.

```json
{
  "tipo_habitacion_id": 1,
  "numero": "101",
  "nombre": "Habitacion 101",
  "descripcion": "Suite estandar",
  "precio": 25000,
  "estado": "disponible"
}
```

### PUT /habitaciones/{id}

Edita habitacion.

### PATCH /habitaciones/{id}/estado

Cambia estado.

```json
{
  "estado": "bloqueada"
}
```

## Reservas

### GET /reservas

Listado admin con filtros.

```text
?estado=confirmada
?fecha=2026-05-27
?buscar=DIS-2026-0018
```

### POST /reservas

Crea reserva desde cliente o admin.

```json
{
  "cliente_id": 1,
  "habitacion_id": 4,
  "cantidad_personas": 2,
  "fecha_entrada": "2026-05-27 15:30:00",
  "fecha_salida": "2026-05-27 18:30:00",
  "comentario": "Sin comentarios"
}
```

Respuesta:

```json
{
  "id": 18,
  "codigo_reserva": "DIS-2026-0018",
  "qr_token": "public-token",
  "estado": "pendiente"
}
```

### GET /reservas/{codigo_reserva}

Detalle por ID visible.

### PUT /reservas/{id}

Editar reserva.

### PATCH /reservas/{id}/estado

Cambiar estado.

```json
{
  "estado": "finalizada"
}
```

Cuando una reserva pasa a `finalizada`, Laravel debe programar un envio de tipo `valoracion_post_salida` para 30 minutos despues de `fecha_salida`.

## Valoraciones

### GET /valoraciones/{token}

Obtiene datos publicos de la reserva para mostrar la valoracion.

Respuesta:

```json
{
  "reserva": {
    "codigo_reserva": "DIS-2026-0018",
    "habitacion": "Suite tematica",
    "fecha_salida": "2026-05-27 20:30:00"
  },
  "respondida": false
}
```

### POST /valoraciones/{token}

Guarda valoracion.

```json
{
  "puntuacion": 5,
  "etiquetas": [
    "Atencion discreta",
    "Habitacion limpia"
  ],
  "comentario": "Excelente experiencia."
}
```

## Configuracion

### GET /configuracion

Lista configuraciones.

### PUT /configuracion/{clave}

Actualiza configuracion.

Ejemplo para valoraciones:

```json
{
  "valor": {
    "activo": true,
    "enviar_despues_de_minutos": 30,
    "canal": "correo",
    "mensaje": "Gracias por visitarnos. Queremos conocer tu experiencia en DISCRET."
  }
}
```

## Reportes

### GET /reportes/resumen

Resumen general del dashboard/reportes.

### GET /reportes/valoraciones

Resumen de valoraciones.

Respuesta:

```json
{
  "promedio": 4.7,
  "total": 23,
  "recientes": [
    {
      "codigo_reserva": "DIS-2026-0018",
      "habitacion": "Suite tematica",
      "puntuacion": 5,
      "comentario": "Excelente privacidad.",
      "respondida_at": "2026-05-27 21:10:00"
    }
  ]
}
```

## Frontend: archivo recomendado

Crear en React:

```text
src/services/api.ts
```

Responsabilidad:

- Guardar `API_BASE_URL`.
- Adjuntar token Sanctum.
- Centralizar errores.
- Reemplazar datos simulados de paginas admin.
