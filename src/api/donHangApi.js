import axios from "axios";
import { URL } from "../service/functions";

export const donHangApi = {
    //phần đăng nhập
    apiChiTietDonHangByShop: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/don-hang/chi-tiet-don-hang-by-shop`,
            headers
        })
    },

    apiInDonHangByShop: (headers, oId) => {
        return axios({
            method: 'get',
            url: `${URL}/don-hang/in-don-hang-by-shop/${oId}`,
            headers
        })
    },
    apiHuyDonHangByShop: (headers, oId) => {
        return axios({
            method: 'delete',
            url: `${URL}/don-hang/huy-don-hang/${oId}`,
            headers
        })
    },
    apiCapNhatNguoiGiao: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/don-hang/cap-nhat-nguoi-giao`,
            headers,
            data
        })
    },
    apiCapNhatThanhToan: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/don-hang/cap-nhat-thanh-toan`,
            headers,
            data
        })
    },
    apiSortDonHang: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/don-hang/sort-don-hang`,
            headers,
            data
        })
    },
    apiSortNguoiGiao: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/don-hang/sort-nguoi-giao`,
            headers,
            data
        })
    },
    apiGetListTrangThai: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/don-hang/get-list-trang-thai/`,
            headers
        })
    },











}