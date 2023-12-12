import axios from "axios";
import { URL } from "../service/functions";

export const nhanVienApi = {
    //phần nhân viên
    apiTaoNhanVien: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/nhan-vien/tao-nhan-vien`,
            headers,
            data
        })
    },
    apiGetNhanVienByShop: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/nhan-vien/get-danh-sach-nhan-vien`,
            headers,
        })
    },
    apiCapNhatThongTinNhanVien: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/nhan-vien/cap-nhat-thong-tin-nhan-vien`,
            headers,
            data
        })
    },
    apiXoaNhanVien: (headers, nvId) => {
        return axios({
            method: 'delete',
            url: `${URL}/nhan-vien/xoa-nhan-vien/${nvId}`,
            headers,
        })
    },

}