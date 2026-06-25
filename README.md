# ReadCycle - Ecommerce de Libros Usados

Aplicación **Buyer** del [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) — comisión ReadCycle.

- La aplicación está disponible en: [Vercel](https://buyer-readcycle.vercel.app)

- Esta app corresponde al módulo de compradores del proyecto tipo C (Marketplace).

## Usuario comprador

- Email: buyer+clerk_test@iaw.com
- Contraseña: iawuser#

## Administrador

- Email: admin+clerk_test@iaw.com
- Contraseña: iawuser#

## Aclaraciones

- En esta etapa se mockean todos los datos que vienen de otras apps. 
- Como los vendedores estan mockeados, no se desarrollo la gestion de carritos separados por vendedor.
- Al realizar una compra, el sistema siempre asume y devuelve un pedido correcto.
- Las órdenes creadas se guardan (únicamente durante esta etapa de desarrollo) en el `localStorage` del navegador para que luego se puedan visualizar en el historial del usuario.


## Guía de Evaluación y Pruebas

1. **Inicio de Sesión**:
   * Utiliza las credenciales de **Usuario comprador** para ingresar al catálogo, agregar libros al carrito, gestionar tus direcciones y simular una experiencia de compra convencional. Vale la pena destacar que el catalogo y los productos pueden ser recorridos sin estar logueado, hasta que se intente agregar algo al carrito.
   * Utiliza las credenciales de **Administrador** para acceder a las opciones de administración especializadas (un boton en la NavBar que permite abrir el panel de admin para editar, crear o eliminar usuarios).

2. **Flujo de Navegación del Catálogo**:
   * Explora los libros por categorías.
   * Utiliza la barra de búsqueda para filtrar títulos y autores.

3. **Gestión de Carrito**:
   * Agrega, modifica la cantidad y elimina libros dentro del carrito. Las operaciones se guardan persistentemente vinculadas a la base de datos del usuario autenticado.

4. **Gestión de Direcciones**:
   * En tu perfil de usuario, agrega y edita direcciones de envío, seleccionando cuál de ellas será la predeterminada.

5. **Gestión de Usuarios (Admin)**:
   * Accede al panel de administración desde la barra de navegación.
   * Visualiza todos los usuarios registrados y sus roles.
   * Crea nuevos usuarios con diferentes roles (comprador o administrador).

6. **Historial de Órdenes**:
   * Accede al historial de órdenes desde tu perfil de usuario.
   * Visualiza todas las órdenes que hayas realizado.
   * Puedes ver el detalle de cada orden.
   
**ReadCycle** es una plataforma web para la compra y venta de libros de segunda mano. Permite a los usuarios explorar catálogos por categoría, buscar libros por autor o título, gestionar un carrito de compras y realizar transacciones de forma sencilla. Además, cuenta con un panel de administración para la gestión de usuarios. 
