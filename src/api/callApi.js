import axios from "axios";
import { URL } from "../service/functions";

// const URL = 'http://localhost:8080'



export const callApi = {
    //phần của user
    apiUserDangKy: (data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/users/dang-ky`,
            data
        })
    },
    apiCheckSoDt: (data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/users/kiem-tra-so-dien-thoai`,
            data
        })
    },
    apiUserDangNhap: (data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/users/dang-nhap`,
            data
        })
    },
    // http://localhost:8080/api/san-pham-theo-danh-muc
    apiUserGetAllProducts: (sId) => {
        return axios({
            method: 'get',
            url: `${URL}/api/users/tat-ca-san-pham/${sId}`,
        })
    },

    //phần của shop
    apiShopDangKy: (data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/shops/dang-ky`,
            data
        })
    },

    apiShopDangNhap: (data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/shops/dang-nhap`,
            data
        })
    },

    //tạo danh mục
    apiTaoDanhMuc: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/danhmuc/tao-danh-muc`,
            data,
            headers
        })
    },

    //up hình danh mục
    apiUpHinhDanhMuc: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/danhmuc/up-hinh-danh-muc`,
            data,
            headers

        })
    },

    //update danh mục
    apiUpdateDanhMuc: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/api/danhmuc/sua-danh-muc`,
            data,
            headers
        })

    },

    //xoá danh mục
    apiXoaDanhMuc: (headers, data) => {
        return axios({
            method: 'delete',
            url: `${URL}/api/danhmuc/xoa-danh-muc`,
            data,
            headers
        })
    },

    //get danh mục
    apiGetDanhMuc: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/api/danhmuc/danh-muc`,
            headers
        })
    },

    //tạo thương hiệu
    apiTaoThuongHieu: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/thuonghieu/tao-thuong-hieu`,
            data,
            headers
        })
    },

    //up hình thương hiệu
    apiUpHinhThuongHieu: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/thuonghieu/up-hinh-thuong-hieu`,
            data,
            headers
        })
    },

    //cập nhật thương hiệu
    apiUpdateThuongHieu: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/api/thuonghieu/sua-thuong-hieu`,
            data,
            headers
        })
    },

    //xoá thương hiệu
    apiXoaThuongHieu: (headers, data) => {
        return axios({
            method: 'delete',
            url: `${URL}/api/thuonghieu/xoa-thuong-hieu`,
            data,
            headers
        })
    },

    //tạo sản phẩm
    apiTaoSanPham: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/sanpham/tao-san-pham`,
            data,
            headers
        })
    },

    //get sản phẩm theo shop
    apiGetSanPhamByShop: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/api/sanpham/san-pham-theo-shop`,
            headers
        })
    },

    //tạo đơn vị tính
    apiTaoDonViTinh: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/sanpham/tao-dvt`,
            data,
            headers
        })
    },

    //api up hình đvt
    apiUpHinhDvt: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/sanpham/up-hinh-dvt`,
            data,
            headers
        })

    },

    apiPackagesByProduct: (headers, pId) => {
        return axios({
            method: 'get',
            url: `${URL}/api/sanpham/packages-by-product/${pId}`,
            headers
        })
    },

    //sửa tên sản phẩm
    apiUpdateTenSanPham: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/api/sanpham/sua-ten-san-pham`,
            data,
            headers
        })
    },

    //sửa đvt
    apiUpdatePackages: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/api/sanpham/sua-dvt`,
            data,
            headers
        })
    },

    //ẩn hiện đvt
    apiUpdateAnHienPackages: (headers, pkId) => {
        return axios({
            method: 'put',
            url: `${URL}/api/sanpham/an-hien-dvt/${pkId}`,
            headers
        })
    },

    //xoá đvt
    apiDeletePackages: (headers, data) => {
        return axios({
            method: 'delete',
            url: `${URL}/api/sanpham/xoa-dvt`,
            data,
            headers
        })
    },

    //xoá sản phẩm
    apiDeleteProduct: (headers, data) => {
        return axios({
            method: 'delete',
            url: `${URL}/api/sanpham/xoa-san-pham`,
            data,
            headers
        })
    },

    //xoá hình đvt
    apiDeletePhotoPacages: (headers, data) => {
        return axios({
            method: 'delete',
            url: `${URL}/api/sanpham/xoa-hinh-dvt`,
            data,
            headers
        })
    },

    //tìm kiếm sản phẩm
    apiSearchSanPhamByShop: (headers, keyword) => {
        return axios({
            method: 'get',
            url: `${URL}/api/sanpham/tim-kiem-san-pham/${keyword}`,
            headers
        })
    },

    //phần của đối tác
    //danh sách npp
    apiGetNppByShop: (headers, data) => {
        return axios({
            method: 'get',
            url: `${URL}/api/doitac/danh-sach-npp/`,
            data,
            headers
        })
    },

    //danh sách kh
    apiGetKhByShop: (headers, data) => {
        return axios({
            method: 'get',
            url: `${URL}/api/doitac/danh-sach-khach-hang`,
            data,
            headers
        })
    },

    //tạo đối tác
    apiTaoDoiTac: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/doitac/tao-doi-tac`,
            data,
            headers
        })
    },

    //cập nhật đối tác
    apiCapNhatDoiTac: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/api/doitac/sua-doi-tac`,
            data,
            headers
        })
    },

    //tìm kiếm npp
    apiTimKiemNpp: (headers, keyword) => {
        return axios({
            method: 'get',
            url: `${URL}/api/doitac/tim-kiem-npp/${keyword}`,
            headers
        })
    },

    //tìm kiếm kh
    apiTimKiemKh: (headers, keyword) => {
        return axios({
            method: 'get',
            url: `${URL}/api/doitac/tim-kiem-khach-hang/${keyword}`,
            headers
        })
    },

    //xoá đối tác
    apiXoaDoiTac: (headers, data) => {
        return axios({
            method: 'delete',
            url: `${URL}/api/doitac/xoa-doi-tac`,
            data,
            headers
        })
    },

    //phần nhập hàng
    //tạo phiếu nhập
    apiTaoPhieuNhap: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/nhaphang/tao-phieu-nhap`,
            data,
            headers
        })
    },

    //phiếu nhập mới tạo
    apiPhieuNhapMoiTao: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/api/nhaphang/phieu-nhap-moi-tao`,
            headers
        })
    },

    //add sản phẩm vào phiếu nhập
    apiThemSanPhamVaoPhieuNhap: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/nhaphang/them-san-pham-vao-phieu-nhap`,
            data,
            headers
        })
    },

    //xoá sản phẩm khỏi phiếu nhập
    apiXoaSanPhamkhoiPhieuNhap: (headers, data) => {
        return axios({
            method: 'delete',
            url: `${URL}/api/nhaphang/xoa-san-pham-nhap`,
            data,
            headers
        })
    },

    //xoá phiếu nhập
    apiXoaPhieuNhap: (headers, data) => {
        return axios({
            method: 'delete',
            url: `${URL}/api/nhaphang/xoa-phieu-nhap`,
            data,
            headers
        })
    },

    //lưu phiếu nhập
    apiLuuPhieuNhap: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/nhaphang/luu-phieu-nhap`,
            data,
            headers
        })
    },

    //cập nhật chi tiết nhập
    apiCapNhatChiTiet: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/api/nhaphang/cap-nhat-chi-tiet`,
            data,
            headers
        })
    },
    //cập nhật chi tiết nhập
    apiCapNhatThongTin: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/api/nhaphang/cap-nhat-thong-tin`,
            data,
            headers
        })
    },

    //chi tiết nhập
    apiChiTietNhap: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/api/nhaphang/chi-tiet-nhap`,
            headers
        })
    },

    //xoá chi tiết nhập
    apiXoaChiTietNhap: (headers, data) => {
        return axios({
            method: 'delete',
            url: `${URL}/api/nhaphang/xoa-chi-tiet-nhap`,
            data,
            headers
        })
    },

    //sửa phiếu nhập
    apiSuaPhieuNhap: (headers, imId) => {
        return axios({
            method: 'get',
            url: `${URL}/api/nhaphang/sua-phieu-nhap/${imId}`,
            headers
        })

    },

    //sort chi tiết theo ngày
    apiSortChiTietTheoNgay: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/nhaphang/sort-chi-tiet-theo-ngay`,
            data,
            headers
        })
    },

    //phần đặt hàng
    //check số lượng
    apiCheckSoLuong: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/orders/check-so-luong`,
            data,
            headers
        })

    },
    //lưu đơn hàng
    apiLuuDonHang: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/orders/luu-don-hang`,
            data,
            headers
        })

    },

    //danh sách order
    apiDanhSachOrder: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/api/orders/danh-sach-don-hang`,
            headers
        })
    },

    //cập nhật thanh toán order
    apiCapNhatThanhToanOrder: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/api/orders/cap-nhat-thanh-toan-order`,
            data,
            headers
        })

    },
    //cập nhật người giao order
    apiCapNhatNguoiGiaoOrder: (headers, data) => {
        return axios({
            method: 'put',
            url: `${URL}/api/orders/cap-nhat-nguoi-giao-order`,
            data,
            headers
        })
    },

    // //danh sách order
    // apiTimKiemOrder: (headers, keyword) => {
    //     return axios({
    //         method: 'get',
    //         url: `${URL}/api/orders/tim-kiem-order/${keyword}`,
    //         headers
    //     })
    // },

    //sort đơn hàng
    apiSortOrder: (headers, data) => {
        return axios({
            method: 'post',
            url: `${URL}/api/orders/sort-order`,
            data,
            headers
        })

    },

    //huỷ đơn hàng
    apiHuyOrder: (headers, data) => {
        return axios({
            method: 'delete',
            url: `${URL}/api/orders/huy-order`,
            data,
            headers
        })
    },

    //chi tiết order
    apiOneOrder: (headers, oId) => {
        return axios({
            method: 'get',
            url: `${URL}/api/orders/chi-tiet-order/${oId}`,
            headers
        })
    },

    //tạo sản phẩm mới bangKho + bangSanPham
    //api tạo mã kho
    apiTaoMaKho: (headers) => {
        return axios({
            method: 'post',
            url: `${URL}/api/sanpham/tao-ma-kho`,
            headers
        })
    },
    //api tạo sản phẩm
    apiTaoSanPham: (headers, kId) => {
        return axios({
            method: 'get',
            url: `${URL}/api/sanpham/tao-san-pham/${kId}`,
            headers
        })
    },
    //api get sản phẩm
    apiGetSanPhamByShop: (headers) => {
        return axios({
            method: 'get',
            url: `${URL}/api/sanpham/tat-ca-san-pham-by-shop`,
            headers
        })
    }





















}