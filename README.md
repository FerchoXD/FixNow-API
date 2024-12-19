# FixNow

FixNow es una aplicación innovadora diseñada para facilitar el mantenimiento y reparación de dispositivos. Permite a los usuarios solicitar servicios de reparación de manera eficiente y a los proveedores ofrecer sus servicios de forma organizada.

## Características

- **Solicitud de Servicios**: Los usuarios pueden solicitar reparaciones para diversos dispositivos.
- **Gestión de Proveedores**: Los proveedores pueden gestionar sus ofertas de servicios y responder a las solicitudes de los usuarios.
- **Notificaciones en Tiempo Real**: Ambas partes reciben notificaciones sobre el estado de las solicitudes y ofertas.

## Capturas de Pantalla

A continuación, se presentan algunas capturas de pantalla de la aplicación:

<div style="text-align: left;">
  <img src="https://i.pinimg.com/736x/a9/dc/c6/a9dcc65c025644d0776a1e313ffcb1ff.jpg" alt="Pantalla de Inicio" width="250"/>
  
  **Pantalla de inicio de FixNow.**
</div>

<div style="text-align: left;">
  <img src="https://i.pinimg.com/736x/85/c0/eb/85c0eb8a0f65833a0064c5f259503609.jpg" alt="Solicitud de Servicio" width="250"/>
  
  **Interfaz para solicitar un servicio de reparación.**
</div>

<div style="text-align: left;">
  <img src="https://i.pinimg.com/736x/32/22/c9/3222c99729f090eec3b8923b10f916b2.jpg" alt="Perfil de Proveedores" width="250"/>
  
  **Panel de gestión para proveedores.**
</div>


## API de FixNow

La aplicación cuenta con una API RESTful que permite la interacción entre el frontend y el backend.


## Uso de Postman para Probar la API

Para interactuar con la API de FixNow, puedes utilizar Postman siguiendo estos pasos:
[Descargar Colección de Postman](https://documenter.getpostman.com/view/23353289/2sAYJ3DM3N)

1. **Importar la Colección de la API**: Descarga e importa la colección de la API de FixNow en Postman.

2. **Realizar Solicitudes**: Utiliza los endpoints proporcionados en la colección para realizar solicitudes GET, POST, PUT, etc., según lo requieras.

3. **Verificar Respuestas**: Observa las respuestas del servidor para asegurarte de que las operaciones se realizan correctamente.

## Instalación y Configuración

Para ejecutar este proyecto localmente, sigue estos pasos:

1. **Clonar el Repositorio**:
   ```bash
   git clone https://github.com/tu_usuario/FixNow.git
2. **Instalar Dependencias**:
    ```bash
    npm install
    
3. **Iniciar microservicios**:
    * para ello tendras que hacer cd a cada microservicio en particular e iniciar el servidor

    ```bash
    npm run dev
