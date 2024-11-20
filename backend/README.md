# API Backend para blog

## Indice

- [API Backend para blog](#api-backend-para-blog)
  - [Indice](#indice)
  - [Instalación](#instalación)
  - [Configuración del entorno de desarrollo](#configuración-del-entorno-de-desarrollo)
    - [Windows](#windows)
    - [Linux](#linux)
    - [Mac](#mac)
  - [creación de variables de entorno](#creación-de-variables-de-entorno)
  - [Ejecución de la aplicación](#ejecución-de-la-aplicación)
  - [Uso de la API con Postman](#uso-de-la-api-con-postman)
  - [Credenciales de administrador por defecto](#credenciales-de-administrador-por-defecto)
  - [Endpoints disponibles](#endpoints-disponibles)
  - [Ejemplos de uso](#ejemplos-de-uso)
  <!-- - [Pruebas](#pruebas) -->

## Instalación

Para instalar la API, sigue los siguientes pasos:

1. Clona el repositorio en tu máquina local utilizando el comando `git clone` o descarga el .zip.
2. Cambia al directorio del proyecto utilizando el comando `cd`.
3. Configura el entorno de desarrollo

## Configuración del entorno de desarrollo

#### Windows

1. Abre la terminal de Windows y ejecuta el comando `python -m venv venv` para crear un entorno virtual.
2. Activa el entorno virtual ejecutando el comando `venv\Scripts\activate`.
3. Instala los requerimientos ejecutando el comando `pip install -r requirements.txt`.

#### Linux

1. Abre la terminal de Linux y ejecuta el comando `python3 -m venv venv` para crear un entorno virtual.
2. Activa el entorno virtual ejecutando el comando `source venv/bin/activate`.
3. Instala los requerimientos ejecutando el comando `pip install -r requirements.txt`.

#### Mac

1. Abre la terminal de Mac y ejecuta el comando `python3 -m venv venv` para crear un entorno virtual.
2. Activa el entorno virtual ejecutando el comando `source venv/bin/activate`.
3. Instala los requerimientos ejecutando el comando `pip install -r requirements.txt`.

### creación de variables de entorno

1. Crea un archivo llamado `.env` en la raíz del proyecto.
2. Agrega las siguientes variables de entorno:

```
    APP_TITLE=API
    APP_DESCRIPTION=API
    APP_VERSION=1.0.0

    ALLOWED_HOSTS=localhost, 127.0.0.1
    ALLOWED_METHODS=GET,POST,PUT,DELETE
    ALLOWED_HEADERS=Content-Type,Authorization
    ALLOWED_EXPOSED_HEADERS=Content-Type,Authorization
    ALLOWED_CREDENTIALS=true

    SECRET_KEY=tu_secret_key
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_HOURS = 24
    TOKEN_URL=token

    DATABASE_NAME=blog.db
    DATABASE_URL=sqlite:///

    ADMIN_EMAIL=admin@example.com
    ADMIN_PASSWORD=securepassword
    ADMIN_NAME=Administrator
    ADMIN_ROLE=admin
```

## Ejecución de la aplicación

1. Verifica que `uvicorn`  este instalado con el comando `pip install uvicorn`
2. Entra a la carpeta src utilizando el comando `cd src`
3. Ejecuta el comando `uvicorn main:app --reload` para iniciar el servidor

## Uso de la API con Postman

Para utilizar la API con Postman, sigue los siguientes pasos:

1. Abre Postman y crea un nuevo entorno.
2. Agrega la URL de la API (`http://localhost:8000`) como la URL base del entorno.
3. Utilizando el tipo de body de: `x-www-form-urlencoded` ingresa las credenciales de administración por defecto [Credenciales de administrador por defecto](#credenciales-de-administrador-por-defecto) y copia el token que obtengas al iniciar sesión.
4. En la autentificación de postman:
   - cambia el tipo de autenticación a Bearer Token.
   - reemplaza `<token>` con el token de acceso obtenido al iniciar sesión.

## Credenciales de administrador por defecto

La API viene con un usuario administrador por defecto, que puede ser utilizado para acceder a la API y realizar acciones administrativas. Las credenciales de este usuario son:

- `username`: `admin@example.com`
- `password`: `securepassword`

Puedes utilizar estas credenciales para iniciar sesión y obtener un token de acceso.

## Endpoints disponibles

- **GET /users**: Obtiene una lista de usuarios.
- **GET /user/{user_id}**: Obtiene un usuario por ID.
- **PUT /user/{user_id}**: Actualiza un usuario.
- **DELETE /user/{user_id}**: Elimina un usuario.
- **POST /login**: Inicia sesión y obtiene un token de acceso.
- **POST /register**: Crea un nuevo usuario.

<!-- TODO: agregar los endpoints de los posts del blog -->

## Ejemplos de uso

- Obtener la lista de usuarios: `GET /`
- Crear un nuevo usuario: `POST /register` con el cuerpo `{ "name": "Juan", "email": "juan@example.com", "password": "password" }`
- Iniciar sesión: `POST /login` con el cuerpo `{ "username": "admin@example.com", "password": "securepassword" }`

## Pruebas

Para corroborar el funcionamiento del sistema, puedes usar los archivos de prueba ubicados en `./test/test_post.py`. Para ejecutar las pruebas, asegúrate de tener `pytest` instalado en tu entorno y luego ejecuta el siguiente comando:

```bash
  pytest -v
```
