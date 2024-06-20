import { CategoryRequest, UpdateCategoryRequest } from "../models/Category";
import { Category, ResponseData, ResponseData1 } from "../models/Product";
import privateApi from "./privateApi";
import qs from "qs";

export const createNewCategory = async (
  category: CategoryRequest
): Promise<ResponseData1<Category> | undefined> => {
  try {
    const response = await privateApi.post<ResponseData1<Category>>(
      "/api/v1/categories",
      category
    );
    return response.data;
  } catch (error) {
    console.error("error category", error);
    throw error;
  }
};

export const updateCategory = async (
  updateCategory: UpdateCategoryRequest
): Promise<ResponseData1<Category>> => {
  try {
    const response = await privateApi.put<ResponseData1<Category>>(
      `/api/v1/categories`,
      updateCategory
    );

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const getAllCategories = async (): Promise<ResponseData<Category>> => {
  try {
    const response = await privateApi.get<ResponseData<Category>>(
      "/api/v1/categories"
    );
    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const countProductsInCategory = async (
  categoryName: string
): Promise<ResponseData1<number>> => {
  try {
    const response = await privateApi.get<ResponseData1<number>>(
      `/api/v1/categories/${categoryName}/products/count`
    );

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const getCategoryByName = async (
  categoryName: string
): Promise<ResponseData1<Category>> => {
  try {
    const response = await privateApi.get<ResponseData1<Category>>(
      `/api/v1/categories/${categoryName}`
    );

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const getCategoryById = async (
  categoryId: number
): Promise<ResponseData1<Category>> => {
  try {
    const response = await privateApi.get<ResponseData1<Category>>(
      `/api/v1/categories/${categoryId}`
    );

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const deleteCategories = async (
  ids: number[]
): Promise<ResponseData1<String>> => {
  try {
    const response = await privateApi.delete<ResponseData1<String>>(
      `/api/v1/categories`,
      {
        params: { ids },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      }
    );
    if (response.data.code !== 1000)
      throw new Error("Error: " + response.data.message);

    return response.data.message
      ? response.data
      : { code: 1000, result: "Success" };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
