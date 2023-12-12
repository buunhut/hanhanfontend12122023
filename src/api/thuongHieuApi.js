import axios from "axios";
import { URL } from "../service/functions";

export const thuongHieuApi = {
    //phần sản phẩm
    apiGetThuongHieu: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/thuong-hieu/get-thuong-hieu`,
            headers
        })
    },

    apiTaoThuongHieu: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/thuong-hieu/tao-thuong-hieu`,
            headers,
            data
        })
    },
    apiUpdateThuongHieu: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/thuong-hieu/cap-nhat-thuong-hieu`,
            headers,
            data
        })
    },
    apiDeleteThuongHieu: (headers, thId) => {
        return axios({
            method: 'delete',
            url: `${URL}/thuong-hieu/xoa-thuong-hieu/${thId}`,
            headers
        })
    },

    apiTimThuongHieu: (headers, keyword) => {
        return axios({
            method: 'get',
            url: `${URL}/thuong-hieu/tim-thuong-hieu/${keyword}`,
            headers
        })
    }








}