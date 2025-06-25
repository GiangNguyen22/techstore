import { getProducts } from "../../api/products";

export const GetProductIdByName = async (name: string): Promise<number | undefined> => {
  const products = await getProducts(); // Kết quả là mảng sản phẩm
  const found = products.find(
    (p: any) => p.name?.trim().toLowerCase() === name.trim().toLowerCase()
  );
  return found ? found.id : undefined;
};