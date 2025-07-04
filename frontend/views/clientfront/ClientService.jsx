const API_URL = "http://localhost:5000/api/clientes";

/* * 
 * Este archivo contiene las funciones para interactuar con la API de clientes.
 * Permite obtener, crear, actualizar y eliminar clientes.
 */

export const fetchClients = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener clientes");
  return response.json();
};

export const createClient = async (clientData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(clientData),
  });
  if (!response.ok) throw new Error("Error al crear cliente");
  return response.json();
};

export const updateClient = async (id, clientData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(clientData),
  });
  if (!response.ok) throw new Error("Error al actualizar cliente");
  return response.json();
};

export const deleteClient = async (id) => {
  const response = await fetch(`http://localhost:5000/api/clientes/${id}`, {
    method: "DELETE",
  });

  const data = await response.json(); 

  if (!response.ok) {
    throw new Error(data.error || "Error al eliminar cliente");
  }

  return data;
};
  
