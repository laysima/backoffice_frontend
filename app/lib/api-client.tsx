import axios from "axios";
import { EditType, LoginType, ProductType } from "@/Schemas";
import { getCookie } from "cookies-next";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

const session = getCookie("session");
  const nSession = session && JSON.parse(session);

export const CreateProduct = async ({category, name, weight, dosage, expirationDate, description, price,image}: ProductType) => {
  const URL = "/v1/product/create";
  try {
    const response = await client.post(URL, { category, name, weight, dosage, expirationDate, description, price,image}, {
      headers: {
        Authorization: nSession.token
      }
    });
    const { data } = response.data;
    return data;
  } catch (e: any) {
    throw new Error(e.response.data.error.message);
  }
};

export const EditProduct = async ({newCategory, newName,oldName, oldCategory, weight, dosage, expirationDate, description, price,image}: EditType) => {
  const URL = "/v1/product/edit";
  try {
    const response = await client.post(URL, {newCategory, newName,oldName, oldCategory, weight, dosage, expirationDate, description, price,image}, {
      headers: {
        Authorization: nSession.token
      }
    });
    const { data } = response.data;
    return data;
  } catch (e: any) {
    throw new Error(e.response.data.error.message);
  }
};

export const LoginUser = async ({ email, password }:LoginType) => {
  const URL = '/v1/user/login';
  try {
      const response = await client.post(URL, { email, password}) 
      const  { data } = response.data;
      return data
  } catch (e:any) {
      throw new Error(e.response.data.error.message)
  }

}

export const GetProducts = async () => {
  const URL = "/v1/products";
  try {
    const response = await client.get(URL);
    const { data } = response.data;
    return data;
  } catch (e: any) {
    throw new Error(e.response.data.error.message);
  }
};

export const DeleteProduct = async ({
  category,
  name,
}: Partial<ProductType>) => {
  const URL = "/v1/product/delete";
  try {
    const response = await client.delete(URL, {
      data: { category, name,},
    });
    const { data } = response.data;
    return data;
  } catch (e: any) {
    throw new Error(e.response.data.error.message);
  }
};

export const GetAllOrders = async () => {
  const URL = `/v1/orders`;

  try {
      const response = await client.get(URL);
      const { data } = response.data;

      console.log(data)
      
      return data
  } catch (e: any) {
      throw new Error(e.response.data.error.message)
  }
}

// const { data: orders, isPending, isRefetching } = useQuery({
//   queryKey: ['getOrderHistory'], 
//   queryFn: () => GetAllOrders()
// })