import axios from "axios";
import { URL } from "../service/functions";

export const usersApi = {
    //phần  user
    apiGetTatCaSanPham: () => {
        return axios({
            method: 'get',
            url: `${URL}/users/get-tat-ca-san-pham`,
        })
    },
    apiTimKiemSanPham: (keyword) => {
        return axios({
            method: 'get',
            url: `${URL}/users/tim-kiem-san-pham/${keyword}`,
        })
    },
    apiGetSanPhamByDanhMuc: () => {
        return axios({
            method: 'get',
            url: `${URL}/users/get-tat-ca-san-pham-by-danh-muc`,
        })
    },

    apiGetSanPhamByThuongHieu: () => {
        return axios({
            method: 'get',
            url: `${URL}/users/get-tat-ca-san-pham-by-thuong-hieu`,
        })
    },
    apiDangKy: (data) => {
        return axios({
            method: 'post',
            url: `${URL}/users/dang-ky`,
            data
        })
    },

    apiCheckSoDt: (data) => {
        return axios({
            method: 'post',
            url: `${URL}/users/check-sodt`,
            data
        })
    },
    apiDangNhap: (data) => {
        return axios({
            method: 'post',
            url: `${URL}/users/dang-nhap`,
            data
        })
    },
    //don-hang thì có bắt headers token
    apiXacNhanDonHang: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/don-hang/xac-nhan-don-hang`,
            headers,
            data
        })
    },

    apiChiTietDonHangByUser: (headers, uId) => {
        return axios({
            method: 'get',
            url: `${URL}/don-hang/chi-tiet-don-hang-by-user/${uId}`,
            headers,
        })
    },
    apiHuyDonHang: (headers, oId) => {
        return axios({
            method: 'delete',
            url: `${URL}/don-hang/huy-don-hang/${oId}`,
            headers,
        })
    },

    apiGetVi: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/don-hang/get-vi`,
            headers,
        })
    }










}