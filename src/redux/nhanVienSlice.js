import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    listNhanVienByShop: [],
}


export const nhanVienSlice = createSlice({
    name: 'nhanVien',

    //giá trị khởi tạo ban đầu
    initialState,

    //đường dispath về
    reducers: {
        updateListNhanVienByShop: (state, action) => {
            return {
                ...state,
                listNhanVienByShop: action.payload
            }
        },
    }
})
export const { updateListNhanVienByShop } = nhanVienSlice.actions;
export default nhanVienSlice.reducer