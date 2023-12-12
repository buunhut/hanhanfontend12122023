import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // sanPham: res.content,
    listNpp: [],
    listKh: []
}

export const doiTacSlice = createSlice({
    name: 'doitac',

    //giá trị khởi tạo ban đầu
    initialState,

    //đường dispath về
    reducers: {
        updateListNpp: (state, action) => {
            return {
                ...state,
                listNpp: action.payload
            }
        },
        updateListKh: (state, action) => {
            return {
                ...state,
                listKh: action.payload
            }
        }
    }
})
export const { updateListNpp, updateListKh } = doiTacSlice.actions;
export default doiTacSlice.reducer