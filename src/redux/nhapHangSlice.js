import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listPhieuNhapMoiTao: [],
    listPhieuNhapDaLuu: [],
    phieuNhapActi: 0
}


export const nhapHangSlice = createSlice({
    name: 'nhaphang',

    //giá trị khởi tạo ban đầu
    initialState,

    //đường dispath về
    reducers: {
        updateListPhieuNhapMoiTao: (state, action) => {
            return {
                ...state,
                listPhieuNhapMoiTao: action.payload
            }
        },
        updateListPhieuNhapDaLuu: (state, action) => {
            return {
                ...state,
                listPhieuNhapDaLuu: action.payload
            }
        },
        updatePhieuNhapActi: (state, action) => {
            return {
                ...state,
                phieuNhapActi: action.payload
            }
        }
    }
})
export const { updateListPhieuNhapMoiTao, updateListPhieuNhapDaLuu, updatePhieuNhapActi } = nhapHangSlice.actions;
export default nhapHangSlice.reducer