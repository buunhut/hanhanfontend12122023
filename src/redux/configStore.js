import { configureStore } from "@reduxjs/toolkit";
import sanPhamSlice from "./sanPhamSlice";
import dangNhapSlice from "./dangNhapSlice";
import gioHangSlice from "./gioHangSlice";
import danhMucSlice from "./danhMucSlice";
import doiTacSlice from "./doiTacSlice";
import nhapHangSlice from "./nhapHangSlice";
import chiTietNhapSlice from "./chiTietNhapSlice";
import orderSlice from "./orderSlice";
import nhanVienSlice from "./nhanVienSlice";


export const store = configureStore({
    reducer: {
        dangNhap: dangNhapSlice,
        sanPham: sanPhamSlice,
        gioHang: gioHangSlice,
        danhMuc: danhMucSlice,
        doiTac: doiTacSlice,
        nhapHang: nhapHangSlice,
        chiTietNhap: chiTietNhapSlice,
        order: orderSlice,
        nhanVien: nhanVienSlice,

    },
});
