const API_URL = "http://localhost:5000/api/proveedores";

export const fetchProviders = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener proveedores");
  return response.json();
};

export const createProvider = async (providerData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(providerData),
  });
  if (!response.ok) throw new Error("Error al crear proveedor");
  return response.json();
};

export const updateProvider = async (id, providerData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(providerData),
  });
  if (!response.ok) throw new Error("Error al actualizar proveedor");
  return response.json();
};

export const deleteProvider = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error || "Error al eliminar proveedor");
  return data;
};
