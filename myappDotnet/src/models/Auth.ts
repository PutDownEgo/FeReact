import { access } from "fs";

export type Auth = {
    accessToken: String,
    refreshToken: String,
}