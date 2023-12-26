import axios from "axios";
import { URL } from "../service/functions";

export const shopsApi = {
    //phân đăng ký shop
    apiDangKyShop: (data) => {
        return axios({
            method: 'post',
            url: `${URL}/shops/dang-ky`,
            data
        })
    },
    //phần đăng nhập
    apiLogin: (data) => {
        return axios({
            method: 'post',
            url: `${URL}/shops/dang-nhap`,
            data
        })
    },
    apiTaoCauHinh: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/shops/tao-cau-hinh`,
            headers,
            data
        })
    },
    apiTatMoShop: (headers) => {
        return axios({
            method: 'post',
            url: `${URL}/shops/tat-mo-shop`,
            headers,
        })
    },
    apiGetCauHinh: (sId) => {
        return axios({
            method: 'get',
            url: `${URL}/shops/get-cau-hinh/${sId}`,
        })
    },










}