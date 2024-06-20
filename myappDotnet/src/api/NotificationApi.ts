import {Notification} from "../models/Notification";
import {ResponseData, ResponseData1} from "../models/Product";
import privateApi from "./privateApi";


export const getAllNotificationByUser = async (): Promise<ResponseData<Notification>> => {
    try {
        const response = await privateApi.get<ResponseData<Notification>>('/api/v1/notifications');
        if (response.data.code !== 1000) throw new Error("Error");
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }

}

export const markAsSeenNotification = async (notificationId: number): Promise<ResponseData1<Notification>> => {
    try {
        const response = await privateApi.put<ResponseData1<Notification>>('/api/v1/notifications/' + notificationId);
        if (response.data.code !== 1000) throw new Error("Error");

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


