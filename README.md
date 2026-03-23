# Salon Belleza API 💇‍♀️💅

API RESTful para la gestión de un salón de belleza. Permite administrar empleados, usuarios, marcas, especialidades y más, con autenticación basada en JWT.

---

## 🚀 Tecnologías utilizadas
- Node.js + Express (Backend)
- SQL Server / MSSQL (Base de datos)
- JWT (Autenticación segura)
- bcrypt (Hash de contraseñas)
- CORS (Seguridad de peticiones)
---

## 📦 Instalación

1. Clona el repositorio:  

```bash
   git clone https://github.com/<tu-usuario>/salon-belleza-api.git
   cd salon-belleza-api 
``` 
2. Instala las dependencias:

```bash
   npm install
```

3. Crea un archivo .env en la raíz del proyecto con las siguientes variables:

```env
PORT=4000
DB_USER=sa
DB_PASSWORD=tu_password
DB_SERVER=localhost
DB_DATABASE=salon_belleza_db
DB_PORT=1433

JWT_SECRET=ContraseñaSeguraSecretaDificilDeAdivinar
```

## ▶️ Ejecución

Inicia el servidor en modo desarrollo:

```bash
npm run dev
```

El servidor estará disponible en:

http://localhost:4000

---

## 🗂️ Arquitectura de la API

```text
[ Cliente / Usuario ]
        |
        v
 [ Login / Autenticación ]
        |
   (JWT Token emitido)
        |
        v
 [ API REST (Express) ]
        |
        v
 [ SQL Server / Base de datos ]

```
---

### 📌 Explicación rápida
- El **cliente/usuario** hace login.  
- El servidor genera un **JWT Token**.  
- Con ese token, el cliente accede a las **rutas protegidas de la API**.  
- La API se comunica con la **base de datos SQL Server** para devolver la información solicitada.  

---

## 📌 Endpoints principales

- POST /api/v1/empleados → Crear empleado

- POST /api/v1/usuarios → Crear usuario

- POST /api/v1/usuarios/login → Login y obtención de token

- GET /api/v1/marcas → Listar marcas (requiere token)

## 🔑 Autenticación

Para acceder a rutas protegidas, primero haz login y obtén un token JWT.
En Postman o cualquier cliente HTTP, agrega el header:

Authorization: Bearer <JWT_TOKEN>

## 🛠️ Scripts útiles:

- npm run dev → Ejecuta con nodemon

- npm start → Ejecuta en modo producción

## 📖 Notas

- La base de datos SQL Server se ejecuta en un contenedor Docker para facilitar la configuración.
- La carpeta node_modules/ y el archivo .env están en .gitignore para proteger credenciales y evitar subir dependencias innecesarias.

## 👤 Autor

Proyecto desarrollado por Fresia Pichardo como parte de la práctica de APIs con Node.js  y SQL Server.

## 📜 Historial de cambios destacado
- feat: servidor Express conectado exitosamente a SQL Server
- feat: endpoint especialidades retornando datos de SQL Server
- feat: implementación de PATCH para actualización de estado de marcas
- chore: agrega README inicial con documentación del proyecto



