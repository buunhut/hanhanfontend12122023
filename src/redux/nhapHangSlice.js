import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listPhieuNhapMoiTao: [],
    listPhieuXuatMoiTao: [],
    listPhieuNhapDaLuu: [],
    phieuNhapActi: 0,
    phieuXuatActi: 0,
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
        updateListPhieuXuatMoiTao: (state, action) => {
            return {
                ...state,
                listPhieuXuatMoiTao: action.payload
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
        },
        updatePhieuXuatActi: (state, action) => {
            return {
                ...state,
                phieuXuatActi: action.payload
            }
        }
    }
})
export const { updateListPhieuNhapMoiTao, updateListPhieuXuatMoiTao, updateListPhieuNhapDaLuu, updatePhieuNhapActi, updatePhieuXuatActi } = nhapHangSlice.actions;
export default nhapHangSlice.reducer