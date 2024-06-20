import axios from "axios";
import { ResponseData1 } from "../models/Product";
import { RatingCreation } from "../models/Rating";


import privateApi from "./privateApi";
import publicApi from "./publicApi";


export const getRatingbyProductId = async (productId: number): Promise<ResponseData1<number>> => {
    try {
        const response = await publicApi.get<ResponseData1<number>>(`/api/v1/ratings/average/${productId}`);
        if (response.data.code !== 1000) throw new Error("Error");

        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}


export const createRating = async (rating: RatingCreation): Promise<ResponseData1<RatingCreation>> => {
    try {
        const response = await privateApi.post<ResponseData1<RatingCreation>>('/api/v1/ratings', rating);
        if (response.data.code !== 1000) throw new Error("Error");

        return response.data;
    } catch (error) {
        console.error(error);

        throw error;
    }
}