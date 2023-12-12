import { createSlice } from "@reduxjs/toolkit";



// Định nghĩa trạng thái ban đầu
let initialState = {
    isLogin: false,
    user: null,
};

// Lấy dữ liệu người dùng từ localStorage (nếu có)
const localUser = JSON.parse(localStorage.getItem("user"));
if (localUser) {
    initialState.isLogin = true;
    initialState.user = localUser;
}

// Tạo Redux slice
export const dangNhapSlice = createSlice({
    name: "dangnhap",
    initialState,
    reducers: {
        userLogin: (state, action) => {
            const content = action.payload;
            return {
                ...state,
                isLogin: true,
                user: content
            }
        },
        userLogout: (state) => {
            localStorage.removeItem("user");
            return { ...state, user: null, isLogin: false };
        },
    },
});

// Xuất các actions
export const { userLogin, userLogout } = dangNhapSlice.actions;

// Xuất reducer
export default dangNhapSlice.reducer;


