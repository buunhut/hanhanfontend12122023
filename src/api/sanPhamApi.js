import axios from "axios";
import { URL } from "../service/functions";

export const sanPhamApi = {
    //phần sản phẩm
    apiGetSanPham: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/san-pham/get-san-pham`,
            headers
        })
    },
    apiUpdateDanhMuc: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/san-pham/cap-nhat-danh-muc`,
            headers,
            data
        })
    },
    apiUpdateThuongHieu: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/san-pham/cap-nhat-thuong-hieu`,
            headers,
            data
        })
    },
    apiTaoSanPham: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/san-pham/tao-san-pham`,
            headers,
            data
        })
    },
    apiTaoDvt: (headers, kId) => {
        return axios({
            method: 'get',
            url: `${URL}/san-pham/tao-don-vi-tinh/${kId}`,
            headers,
        })
    },
    apiUpdateMaSp: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/san-pham/cap-nhat-ma-san-pham`,
            headers,
            data
        })
    },

    apiUpdateTenSp: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/san-pham/cap-nhat-ten-san-pham`,
            headers,
            data
        })
    },
    apiUpdateDvt: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/san-pham/cap-nhat-dvt-san-pham`,
            headers,
            data
        })
    },
    apiUpdateGiaNhap: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/san-pham/cap-nhat-gia-nhap`,
            headers,
            data
        })
    },
    apiUpdateGiaBan: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/san-pham/cap-nhat-gia-ban`,
            headers,
            data
        })
    },
    apiUpdateGiaGiam: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/san-pham/cap-nhat-gia-giam`,
            headers,
            data
        })
    },
    apiUpdatePhiVc: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/san-pham/cap-nhat-phi-vc`,
            headers,
            data
        })
    },
    apiUpdateQuyDoi: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/san-pham/cap-nhat-quy-doi`,
            headers,
            data
        })
    },
    apiUpdateMaxOrder: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/san-pham/cap-nhat-maxorder`,
            headers,
            data
        })
    },
    apiUpdateSho: (headers, spId) => {
        return axios({
            method: 'put',
            url: `${URL}/san-pham/cap-nhat-sho/${spId}`,
            headers,
        })
    },
    apiDeleteSanPham: (headers, spId) => {
        return axios({
            method: 'delete',
            url: `${URL}/san-pham/xoa-san-pham/${spId}`,
            headers,
        })
    },

    apiUpHinhSanPham: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/upload/up-hinh-san-pham`,
            headers,
            data
        })
    },
    apiXoaHinhSanPham: (headers, spId) => {
        return axios({
            method: 'delete',
            url: `${URL}/upload/xoa-hinh-san-pham/${spId}`,
            headers,
        })
    },









}