import { apiClient } from "@/core/api/apiClient";
import { Product } from "../interface/product.interface";


export const getProducts = async (limit = 20, offset = 0) => {


    try {

        const { data } = await apiClient.get<Product[]>('/products', {
            params: {
                limit,
                offset
            }
        });

      


        return data.map(product => ({
            ...product,
            
        }));

    } catch (error) {

        throw new Error('Unable to load products');


    }


}