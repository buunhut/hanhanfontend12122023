import axios from "axios";
import { URL } from "../service/functions";

export const chiTietApi = {
    //phần chi tiết
    apiThemChiTiet: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/chi-tiet/them-chi-tiet`,
            headers,
            data
        })
    },
    apiGetChiTietNhap: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/chi-tiet/get-chi-tiet-nhap`,
            headers,
        })
    },
    apiGetChiTietXuat: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/chi-tiet/get-chi-tiet-xuat`,
            headers,
        })
    },
    apiTimChiTietNhap: (headers, keyword) => {
        return axios({
            method: 'get',
            url: `${URL}/chi-tiet/tim-chi-tiet-nhap/${keyword}`,
            headers,
        })
    },
    apiTimChiTietXuat: (headers, keyword) => {
        return axios({
            method: 'get',
            url: `${URL}/chi-tiet/tim-chi-tiet-Xuat/${keyword}`,
            headers,
        })
    },
    apiXoaChiTiet: (headers, dId) => {
        return axios({
            method: 'delete',
            url: `${URL}/chi-tiet/xoa-chi-tiet/${dId}`,
            headers,
        })
    },
    apiSuaChiTietDaLuu: (headers, pId) => {
        return axios({
            method: 'put',
            url: `${URL}/chi-tiet/sua-chi-tiet-da-luu/${pId}`,
            headers,
        })
    },












}