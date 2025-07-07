const API_URL = "http://localhost:5000/api/ventas";

export const fetchSales = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener las ventas");
  return response.json();
};

export const createSale = async (saleData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(saleData),
  });
  if (!response.ok) throw new Error("Error al crear venta");
  return response.json();
};

export const updateSale = async (id, saleData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(saleData),
  });
  if (!response.ok) throw new Error("Error al actualizar venta");
  return response.json();
};

export const deleteSale = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error al eliminar venta");
  return data;
};
