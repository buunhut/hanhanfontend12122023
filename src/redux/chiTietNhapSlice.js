import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listChiTietNhap: [],
    listChiTietXuat: [],

}

export const chiTietNhapSlice = createSlice({
    name: 'chitietnhap',

    //giá trị khởi tạo ban đầu
    initialState,

    //đường dispath về
    reducers: {
        updateListChiTietNhap: (state, action) => {
            return {
                ...state,
                listChiTietNhap: action.payload
            }
        },
        updateListChiTietXuat: (state, action) => {
            return {
                ...state,
                listChiTietXuat: action.payload
            }
        },
    }
})
export const { updateListChiTietNhap, updateListChiTietXuat } = chiTietNhapSlice.actions;
export default chiTietNhapSlice.reducer