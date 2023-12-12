import axios from "axios";
import { URL } from "../service/functions";

export const connectApi = {
    //phần danh mục
    apiTaoDanhMuc: (headers) => {
        return axios({
            method: 'post',
            url: `${URL}/api/sanpham/tao-danh-muc`,
            headers
        })
    },
    apiListDanhMuc: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/api/sanpham/list-danh-muc`,
            headers
        })
    },
    apiUpdateDanhMuc: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/api/sanpham/update-danh-muc`,
            headers,
            data
        })
    },
    apiUpHinhDanhMuc: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/sanpham/up-hinh-danh-muc`,
            headers,
            data
        })
    },
    apiXoaHinhDanhMuc: (headers, dmId) => {
        return axios({
            method: 'delete',
            url: `${URL}/api/sanpham/xoa-hinh-danh-muc/${dmId}`,
            headers,
        })
    },
    apiTimKiemDanhMuc: (headers, keyword) => {
        return axios({
            method: 'get',
            url: `${URL}/api/sanpham/tim-kiem-danh-muc/${keyword}`,
            headers,
        })
    },
    apiXoaDanhMuc: (headers, dmId) => {
        return axios({
            method: 'delete',
            url: `${URL}/api/sanpham/xoa-danh-muc/${dmId}`,
            headers,
        })
    },

    //phần thương hiệu
    apiTaoThuongHieu: (headers) => {
        return axios({
            method: 'post',
            url: `${URL}/api/sanpham/tao-thuong-hieu`,
            headers
        })
    },
    apiListThuongHieu: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/api/sanpham/list-thuong-hieu`,
            headers
        })
    },
    apiUpdateThuongHieu: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/api/sanpham/update-thuong-hieu`,
            headers,
            data
        })
    },
    apiUpHinhThuongHieu: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/sanpham/up-hinh-thuong-hieu`,
            headers,
            data
        })
    },
    apiXoaHinhThuongHieu: (headers, thId) => {
        return axios({
            method: 'delete',
            url: `${URL}/api/sanpham/xoa-hinh-thuong-hieu/${thId}`,
            headers,
        })
    },
    apiTimKiemThuongHieu: (headers, keyword) => {
        return axios({
            method: 'get',
            url: `${URL}/api/sanpham/tim-kiem-thuong-hieu/${keyword}`,
            headers,
        })
    },
    apiXoaThuongHieu: (headers, thId) => {
        return axios({
            method: 'delete',
            url: `${URL}/api/sanpham/xoa-thuong-hieu/${thId}`,
            headers,
        })
    },

    //phần sản phẩm
    apiGetSanPhamByShop: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/api/sanpham/tat-ca-san-pham-by-shop`,
            headers
        })
    },
    apiTaoDonViTinh: (headers, kId) => {
        return axios({
            method: 'get',
            url: `${URL}/api/sanpham/tao-don-vi-tinh/${kId}`,
            headers,
        })
    },
    apiTatMoSanPham: (headers, pId) => {
        return axios({
            method: 'get',
            url: `${URL}/api/sanpham/tat-mo-san-pham/${pId}`,
            headers,
        })
    },
    apiCapNhatSanPham: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/api/sanpham/cap-nhat-san-pham/`,
            headers,
            data
        })
    },
    apiUpHinhSanPham: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/sanpham/up-hinh-san-pham/`,
            headers,
            data
        })
    },
    apiXoaHinhSanPham: (headers, pId) => {
        return axios({
            method: 'delete',
            url: `${URL}/api/sanpham/xoa-hinh-san-pham/${pId}`,
            headers,
        })
    },
    apiXoaSanPham: (headers, pId) => {
        return axios({
            method: 'delete',
            url: `${URL}/api/sanpham/xoa-san-pham/${pId}`,
            headers,
        })
    },
    apiTimKiemSanPham: (headers, keyword) => {
        return axios({
            method: 'get',
            url: `${URL}/api/sanpham/tim-kiem-san-pham/${keyword}`,
            headers,
        })
    },




























}