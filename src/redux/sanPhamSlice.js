import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sId: 1,
    listSanPham: [],
    listSanPhamTimKiem: [],
    sanPhamByShop: [],
    dmId: 0,
    thId: 0,
    keyword: '',
}

export const sanPhamSlice = createSlice({
    name: 'sanPham',

    //giá trị khởi tạo ban đầu
    initialState,

    //đường dispath về
    reducers: {
        timKiem: (state) => {
            console.log("thêm giỏ hàng")
        },
        updateSId: (state, action) => {
            return {
                ...state,
                sId: action.payload
            }
        },
        updateSanPham: (state, action) => {
            return {
                ...state,
                listSanPham: action.payload
            }
        },
        updateSanPhamTimKiem: (state, action) => {
            return {
                ...state,
                listSanPhamTimKiem: action.payload
            }
        },
        updateSanPhamByShop: (state, action) => {
            return {
                ...state,
                sanPhamByShop: action.payload
            }
        },
        updateDmId: (state, action) => {
            return {
                ...state,
                dmId: action.payload
            }
        },
        updateThId: (state, action) => {
            return {
                ...state,
                thId: action.payload
            }
        },

        updateKeyword: (state, action) => {
            return {
                ...state,
                keyword: action.payload
            }
        }

    }
})
export const { timKiem, updateSanPham, updateSanPhamTimKiem, updateSanPhamByShop, updateDmId, updateThId, updateKeyword, updateSId } = sanPhamSlice.actions;
export default sanPhamSlice.reducer