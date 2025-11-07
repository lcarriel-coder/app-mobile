import { apiClient } from "@/core/api/apiClient";
import { Product } from "../interface/product.interface";

export const updateCreateProduct = (product: Partial<Product>) => {
  
  product.stock = isNaN(Number(product.stock)) ? 0 : Number(product.stock);
  product.price = isNaN(Number(product.price)) ? 0 : Number(product.price);

  if (product.id && product.id !== "new") {
    return updateProduct(product);
  }

  return createProduct(product);
};

const updateProduct = async (product: Partial<Product>) => {
  const { id, images = [], user, ...rest } = product;

  try {
    const { data } = await apiClient.patch<Product>(`/products/${id}`, {
      ...rest,
    });

    return data;
  } catch (error) {
        console.log(error);
    throw new Error("Error al actualizar el producto");
  }
};


const createProduct = async (product: Partial<Product>) => {
  const { id, images = [], user, ...rest } = product;

  try {
    const { data } = await apiClient.post<Product>(`/products`, {
      ...rest,
    });

    return data;
  } catch (error) {
    throw new Error("Error al actualizar el producto");
  }
};
