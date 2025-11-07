import { API_URL, apiClient } from "@/core/api/apiClient";
import { Gender, Product } from "../interface/product.interface";


const emptyProduct:Product = {
    id:'',
    title:'Nuevo producto',
    description:'',
    price:0,
    images:[],
    slug:'',
    gender:Gender.Men,
    sizes:[],
    stock:0,
    tags:[]
}
export const getProductById = async (id:string):Promise<Product> => {


    if(id === "new") return emptyProduct; 


    try {

        const { data } = await apiClient.get<Product>(`/products/${ id }`);
      
        return {
            ...data,
            images:data.images.map((image) => `${API_URL}/files/product/${image}`)
        };

        


    } catch (error) {

        throw new Error('Unable to load product');


    }


}