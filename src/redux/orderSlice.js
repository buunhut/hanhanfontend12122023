import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listOrderByUser: [],
    listOrderByShop: [],
    listTrangThai: [],
    listCauHinh: {
        mienPhiVc: 0,
        phiVc: 0,
        hoanTien: 0,
        mucHoan: 0,
    },
    tongDiemTichLuy: 0,
    soLuongDonHang: 0,
};

export const orderSlice = createSlice({
    name: "order",

    //giá trị khởi tạo ban đầu
    initialState,

    //đường dispath về
    reducers: {
        updateListOrderByUser: (state, action) => {
            return {
                ...state,
                listOrderByUser: action.payload,
            };
        },
        updateListOrderByShop: (state, action) => {
            return {
                ...state,
                listOrderByShop: action.payload,
            };
        },
        updateListTrangThai: (state, action) => {
            return {
                ...state,
                listTrangThai: action.payload,
            };
        },
        updateListCauHinhByShop: (state, action) => {
            return {
                ...state,
                listCauHinh: action.payload,
            };
        },

        updateListCauHinhByShop: (state, action) => {
            return {
                ...state,
                listCauHinh: action.payload,
            };
        },
        updateDiemTichLuy: (state, action) => {
            return {
                ...state,
                tongDiemTichLuy: action.payload,
            };
        },
        updateSoLuongDonHang: (state, action) => {
            return {
                ...state,
                soLuongDonHang: action.payload,
            };
        },
    },
});
export const {
    updateListOrderByUser,
    updateListOrderByShop,
    updateListCauHinhByShop,
    updateListTrangThai,
    updateDiemTichLuy,
    updateSoLuongDonHang
} = orderSlice.actions;
export default orderSlice.reducer;
