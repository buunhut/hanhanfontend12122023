import axios from "axios";
import { URL } from "../service/functions";

export const shopsApi = {
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
    apiGetCauHinh: (sId) => {
        return axios({
            method: 'get',
            url: `${URL}/shops/get-cau-hinh/${sId}`,
        })
    },










}