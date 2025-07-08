class Client {
  constructor(nombre, cedula, telefono, direccion, correo) {
    this.nombre = nombre;
    this.cedula = cedula;
    this.telefono = telefono;
    this.direccion = direccion;
    this.correo = correo;
  }
}

export default Client;



/* Flujo general y uso del archivo:
----------------------------------------------------------
Este archivo define la clase Client, que modela la estructura de los datos de un cliente en el sistema de ventas.
- Se utiliza para crear objetos cliente con sus propiedades principales.
- Es consumido principalmente por el controlador clientController.js, que se encarga de la lógica de negocio y la gestión de clientes.
- Se utiliza en operaciones como crear, leer, actualizar o eliminar clientes en la base de datos.
- Este archivo se comunica indirectamente con el resto del sistema a través de los controladores y servicios que gestionan la entidad Cliente.
*/