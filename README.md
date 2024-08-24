# Sistema de control de inventario

Este proyecto es un sistema de control de inventario diseñado específicamente para una tienda de confites. La aplicación está desarrollada con Node.js y se ejecutará como una aplicación web local. Su objetivo es facilitar la gestión de inventarios, permitiendo a los usuarios agregar, actualizar y eliminar productos, así como realizar un seguimiento del stock disponible.

## Contenido

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Uso](#uso)
- [Contribución](#contribución)
- [Licencia](#licencia)

## Características

- **Gestión de Productos**: Agregar, actualizar y eliminar productos del inventario.
- **Interfaz Amigable**: Interfaz web intuitiva y fácil de usar.
- **Crear vales de venta**: Simulador de ventas con detalles.

## Tecnologías Utilizadas

- **Node.js**: Plataforma de desarrollo del lado del servidor.
- **Express**: Framework para la creación de aplicaciones web con Node.js.
- **MySQL**: Base de datos para el almacenamiento de datos.
- **Sequelize**: ORM para la gestión de consultas a la base de datos.
- **HTML/CSS/JavaScript**: Tecnologías front-end para la interfaz de usuario.

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/Draekk/inventory-management-system/issues
```

2. Navega al directorio del proyecto:

```bash
cd /tu/ruta/del/repositorio/
```

3. Crea un archivo `.env` para almacenar las variables de ambiente:

```python
DB_NAME=tu_base_de_datos
DB_USER=tu_usuario
DB_PASS=tu_contraseña
DB_HOST=localhost
DB_DIALECT=mysql
PORT=3000
```

4. Instala las dependencias:

```bash
npm install
```

5. Inicia la aplicacion

```bash
npm start
```

## Uso

Accede a la aplicación desde tu navegador en `http://localhost:3000` y comienza a gestionar el inventario de tu tienda de confites.

## Contribución

Si deseas contribuir al proyecto, por favor realiza un fork del repositorio y crea una nueva rama para tus cambios. Luego, envía un pull request con una descripción detallada de tus modificaciones.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.
