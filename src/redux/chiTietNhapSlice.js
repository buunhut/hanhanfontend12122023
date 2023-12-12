import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listChiTietNhap: [],

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
    }
})
export const { updateListChiTietNhap } = chiTietNhapSlice.actions;
export default chiTietNhapSlice.reducer