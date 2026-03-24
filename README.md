# 💇‍♀️ Salon Belleza API

# 💇‍♀️ Salon Belleza API

API RESTful para la gestión de un salón de belleza, desarrollada con Node.js, Express y SQL Server.
Este proyecto implementa una arquitectura modular siguiendo buenas prácticas para aplicaciones backend escalables.

---

## 🚀 Características

- Autenticación con JWT
- Gestión de usuarios
- Gestión de empleados
- Manejo de roles
- Validación de datos con Zod
- Manejo centralizado de errores
- Arquitectura modular (controller, service, repository)
- Conexión a SQL Server
- Logging estructurado

---

## 🧱 Tecnologías utilizadas

- Node.js
- Express.js
- SQL Server
- Zod (validaciones)
- JWT (autenticación)
- Bcrypt (hash de contraseñas)
- Dotenv (variables de entorno)
- Nodemon (entorno de desarrollo)

---

## 📁 Estructura del proyecto

```
src/
│
├── modules/
│   ├── usuario/
│   ├── empleado/
│   ├── ...
│
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   ├── validate.js
│   ├── asyncHandler.js
│   ├── responseHandler.js
│
├── utils/
│   ├── logger.js
│
├── config/
│
├── app.js
├── index.js
```

---

## ⚙️ Instalación y uso

### 1. Clonar el repositorio

```
git clone https://github.com/FresiaP/salon-belleza-api.git
cd salon-belleza-api
```

---

### 2. Instalar dependencias

```
git clone https://github.com/FresiaP/salon-belleza-api.git
cd salon-belleza-api
```

---

### 2. Instalar dependencias

```
npm install
```

npm install

```

---

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:
---

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```

```
PORT=4000
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_SERVER=localhost
DB_DATABASE=nombre_bd
JWT_SECRET=tu_secreto
```

---

### 4. Ejecutar el proyecto

```

npm run dev

```

Servidor disponible en:

```

```

http://localhost:4000

```

```

---

## 🔐 Autenticación

El sistema utiliza JWT para proteger rutas.
Debes iniciar sesión para obtener un token y usarlo en las peticiones:

```

Authorization: Bearer TOKEN

---

## 📌 Endpoints principales

### Usuarios

- GET /usuarios
- GET /usuarios/:id
- POST /usuarios
- PUT /usuarios/:id
- DELETE /usuarios/:id

---

### Empleados

- GET /empleados
- POST /empleados
- ...

---

_(Completar según avances del proyecto)_

---

## 🧠 Arquitectura

El proyecto sigue una arquitectura por capas:

- Controller → Maneja la solicitud HTTP
- Service → Lógica de negocio
- Repository → Acceso a datos
- Middleware → Validaciones, auth, errores

Esto permite mantener el código organizado, escalable y fácil de mantener.

---

## 📊 Estado del proyecto

🚧 En desarrollo
Este proyecto está en constante mejora como parte de un proceso de aprendizaje enfocado en desarrollo backend profesional.

---

## 👩‍💻 Autor

Desarrollado por Fresia Pichardo
Backend Developer en formación

---

## 📌 Notas

Este proyecto forma parte de mi portafolio profesional y refleja mis conocimientos en desarrollo backend con JavaScript y Node.js.
```
