import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    danhMuc: [],
    listDanhMuc: [],
    listThuongHieu: [],
    listSanPhamByDanhMuc: [],
    listSanPhamByThuongHieu: [],
};

export const danhMucSlice = createSlice({
    name: "danhMuc",

    //giá trị khởi tạo ban đầu
    initialState,

    //đường dispath về
    reducers: {
        updateDanhMuc: (state, action) => {
            return {
                ...state,
                danhMuc: action.payload,
            };
        },
        updateListDanhMuc: (state, action) => {
            return {
                ...state,
                listDanhMuc: action.payload,
            };
        },
        updateListThuongHieu: (state, action) => {
            return {
                ...state,
                listThuongHieu: action.payload,
            };
        },
        updateListSanPhamByDanhMuc: (state, action) => {
            return {
                ...state,
                listSanPhamByDanhMuc: action.payload,
            };
        },
        updateListSanPhamByThuongHieu: (state, action) => {
            return {
                ...state,
                listSanPhamByThuongHieu: action.payload,
            };
        },
    },
});
export const {
    updateDanhMuc,
    updateListDanhMuc,
    updateListThuongHieu,
    updateListSanPhamByDanhMuc,
    updateListSanPhamByThuongHieu
} = danhMucSlice.actions;
export default danhMucSlice.reducer;
