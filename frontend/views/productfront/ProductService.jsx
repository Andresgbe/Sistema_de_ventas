const API_URL = "http://localhost:5000/api/productos";

/*
 * Este archivo contiene las funciones para interactuar con la API de productos.
 * Permite obtener, crear, actualizar y eliminar productos.
 */

export const fetchProducts = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener productos");
  return response.json();
};

export const createProduct = async (productData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error("Error al crear producto");
  return response.json();
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error("Error al actualizar producto");
  return response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al eliminar producto");
  }

  return data;
};


export const fetchProductByCode = async (codigo) => {
  const response = await fetch(`${API_URL}/${codigo}`);
  if (!response.ok) {
    throw new Error("Error al obtener el producto");
  }
  return response.json();
};