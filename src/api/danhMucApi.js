import axios from "axios";
import { URL } from "../service/functions";

export const danhMucApi = {
    //phần danh mục
    apiGetDanhMuc: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/danh-muc/get-danh-muc`,
            headers
        })
    },
    apiTaoDanhMuc: (headers) => {
        return axios({
            method: 'post',
            url: `${URL}/danh-muc/tao-danh-muc`,
            headers
        })
    },
    apiUpdateDanhMuc: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/danh-muc/cap-nhat-danh-muc`,
            headers,
            data
        })
    },
    apiDeleteDanhMuc: (headers, dmId) => {
        return axios({
            method: 'delete',
            url: `${URL}/danh-muc/xoa-danh-muc/${dmId}`,
            headers
        })
    },

    apiTimDanhMuc: (headers, keyword) => {
        return axios({
            method: 'get',
            url: `${URL}/danh-muc/tim-danh-muc/${keyword}`,
            headers
        })
    }








}