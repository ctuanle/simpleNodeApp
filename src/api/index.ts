import authApi from "./auth.api";
import productApi from "./product.api";
import userApi from "./user.api";
import roomApi from "./room.api";
import msgApi from "./message.api";

const api = {
    authApi: authApi,
    productApi: productApi,
    userApi: userApi,
    roomApi: roomApi,
    msgApi: msgApi,
};

export default api;
