import axios from "axios";
import { URL } from "../service/functions";

export const doiTacApi = {
    //phần đối tác
    apiTaoDoiTac: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/doi-tac/tao-doi-tac`,
            headers,
            data
        })
    },
    apiGetNpp: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/doi-tac/get-npp`,
            headers,
        })
    },
    apiGetKhachHang: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/doi-tac/get-khach-hang`,
            headers,
        })
    },
    apiCapNhatNpp: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/doi-tac/cap-nhat-npp`,
            headers,
            data
        })
    },
    apiCapNhatKh: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/doi-tac/cap-nhat-khach-hang`,
            headers,
            data
        })
    },
    apiTimNpp: (headers, keyword) => {
        return axios({
            method: 'get',
            url: `${URL}/doi-tac/tim-npp/${keyword}`,
            headers,
        })
    },
    apiTimKh: (headers, keyword) => {
        return axios({
            method: 'get',
            url: `${URL}/doi-tac/tim-khach-hang/${keyword}`,
            headers,
        })
    },
    apiXoaDoiTac: (headers, dtId) => {
        return axios({
            method: 'delete',
            url: `${URL}/doi-tac/xoa-doi-tac/${dtId}`,
            headers,
        })
    },
}