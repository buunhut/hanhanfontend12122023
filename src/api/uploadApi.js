import axios from "axios";
import { URL } from "../service/functions";

export const uploadApi = {
    //phần danh mục
    apiUpHinhDanhMuc: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/upload/up-hinh-danh-muc`,
            headers,
            data
        })
    },
    apiXoaHinhDanhMuc: (headers, dmId) => {
        return axios({
            method: 'delete',
            url: `${URL}/upload/xoa-hinh-danh-muc/${dmId}`,
            headers,
        })
    },
    //phần thương hiệu
    apiUpHinhThuongHieu: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/upload/up-hinh-thuong-hieu`,
            headers,
            data
        })
    },
    apiXoaHinhThuongHieu: (headers, thId) => {
        return axios({
            method: 'delete',
            url: `${URL}/upload/xoa-hinh-thuong-hieu/${thId}`,
            headers,
        })
    },
    //phần sản phẩm
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