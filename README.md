# Salon Belleza API

API REST para la gestion de un salon de belleza, desarrollada con Node.js, Express y SQL Server.

## Descripcion

Este backend implementa una arquitectura modular por dominio con capas de controller, service, repository y validacion.
Incluye autenticacion con JWT, control de permisos por recurso y manejo centralizado de errores.

## Tecnologias

- Node.js
- Express
- SQL Server (mssql)
- Zod
- JSON Web Token
- bcrypt
- dotenv
- nodemon

## Requisitos

- Node.js 18 o superior
- SQL Server disponible
- Base de datos configurada con el esquema del proyecto

## Instalacion

1. Clona el repositorio:

```bash
git clone https://github.com/FresiaP/salon-belleza-api.git
cd salon-belleza-api
```

2. Instala dependencias:

```bash
npm install
```

3. Crea un archivo .env en la raiz:

```env
PORT=4000
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_SERVER=localhost
DB_DATABASE=nombre_bd
DB_PORT=1433
JWT_SECRET=tu_secreto_super_seguro
```

## Scripts

- npm run dev: inicia el servidor con nodemon
- npm start: inicia el servidor en modo normal
- npm test: script placeholder (no hay pruebas configuradas actualmente)

## Ejecucion

Modo desarrollo:

```bash
npm run dev
```

Modo produccion/local:

```bash
npm start
```

Servidor por defecto:

- http://localhost:4000 (si defines PORT=4000)
- http://localhost:3000 (si PORT no esta definido)

## Autenticacion y permisos

- El login es publico en POST /api/usuarios/login
- El resto de endpoints usan JWT y, en la mayoria de casos, validan permisos especificos
- Envia el token en el header:

```http
Authorization: Bearer TU_TOKEN
```

## Prefijo de rutas

Todas las rutas del API usan el prefijo:

```text
/api
```

## Modulos principales

- /api/usuarios
- /api/empleados
- /api/clientes
- /api/roles (roles y roles-permisos)
- /api/permisos
- /api/lookups
- /api/marcas
- /api/modelos
- /api/tipos-activos
- /api/estados-activos
- /api/activos
- /api/equipos-salon
- /api/incidencias
- /api/protocolos-servicios
- /api/insumos-protocolos
- /api/productos-salon
- /api/ventas
- /api/detalles-venta
- /api/citas-servicios
- /api/especialidades
- /api/proveedores

## Estructura del proyecto

```text
src/
	app.js
	index.js
	config/
		db.js
	middleware/
		asyncHandler.js
		auth.js
		errorHandler.js
		responseHandler.js
		validate.js
	modules/
		<modulo>/
			*.controller.js
			*.service.js
			*.repository.js
			*.validation.js
			*.mapper.js
			*.routes.js
	utils/
		helpers.js
		logger.js
```

## Respuestas y errores

- Existe middleware para estandarizar respuestas en exito/error
- Las rutas no encontradas responden 404 con mensaje Ruta no encontrada
- Los errores no controlados pasan por el manejador global

## Estado

Proyecto en desarrollo activo.

## Autor

Desarrollado por Fresia Pichardo.
