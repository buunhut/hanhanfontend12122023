import axios from "axios";
import { URL } from "../service/functions";

export const phieuApi = {
    //phần phiếu
    apiGetSanPham: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/phieu/get-san-pham`,
            headers
        })
    },
    apiTimSanPham: (headers, keyword) => {
        return axios({
            method: 'get',
            url: `${URL}/phieu/tim-san-pham/${keyword}`,
            headers
        })
    },
    apiTaoPhieu: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/phieu/tao-phieu/`,
            headers,
            data
        })
    },
    apiGetPhieuNhapMoiTao: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/phieu/get-phieu-nhap-moi-tao`,
            headers
        })
    },
    apiGetPhieuXuatMoiTao: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/phieu/get-phieu-nhap-moi-tao`,
            headers
        })
    },
    apiSuaChiTiet: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/phieu/sua-chi-tiet`,
            headers,
            data
        })
    },
    apiXoaPhieuMoiTao: (headers, pId) => {
        return axios({
            method: 'delete',
            url: `${URL}/phieu/xoa-phieu-moi-tao/${pId}`,
            headers,
        })
    },
    apiLuuPhieuMoiTao: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/phieu/luu-phieu-moi-tao/`,
            headers,
            data
        })
    },
    apiTraNoMotPhieu: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/phieu/tra-no-mot-phieu/`,
            headers,
            data
        })
    },
    apiSortPhieu: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/phieu/sort-phieu/`,
            headers,
            data
        })
    },
    apiSortPhieuXuat: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/phieu/sort-phieu-xuat/`,
            headers,
            data
        })
    },
    apiInPhieuNhap: (headers, pId) => {
        return axios({
            method: 'get',
            url: `${URL}/phieu/get-phieu-nhap/${pId}`,
            headers,
        })
    }















}