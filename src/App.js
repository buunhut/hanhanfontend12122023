import './App.scss';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TrangChu from './components/user/TrangChu';
import SanPham from './components/user/SanPham';
import DanhMuc from './components/user/DanhMuc';
import ThuongHieu from './components/user/ThuongHieu';
import ThongBao from './components/user/ThongBao';
import TaiKhoan from './components/user/TaiKhoan';
import TimKiem from './components/user/TimKiem';
import HomePage from './components/admin/HomePage';
import { useSelector } from 'react-redux';
import Login from './components/admin/Login';
import DangKyShop from './components/admin/DangKyShop';
import TaoSanPham from './components/admin/TaoSanPham';
import DangNhap from './components/user/DangNhap';
import XuatHang from './components/admin/XuatHang';
import KiemKho from './components/admin/KiemKho';
import XuLyDonHang from './components/admin/XuLyDonHang';
import NhapHang from './components/admin/NhapHang';
import DoiTac from './components/admin/DoiTac';
import NhanVien from './components/admin/NhanVien';
import ChiTietNhapHang from './components/admin/ChiTietNhapHang';
import PhieuNhapNo from './components/admin/PhieuNhapNo';
import ChiTietXuatHang from './components/admin/ChiTietXuatHang';
import PhieuXuatNo from './components/admin/PhieuXuatNo';
import InDonHang from './components/admin/InDonHang';
import CreateProducts from './components/admin/form/CreateProducts';
import InMaVach from './components/admin/form/InMaVach';
import Demo from './components/user/Demo';
import CauHinh from './components/admin/form/CauHinh';

function App() {
  const { isLogin, user } = useSelector((state) => state.dangNhap)

  if (isLogin === true && user.sId !== undefined) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/quan-ly" element={<HomePage />}>
            {/* <Route path='san-pham' element={<TaoSanPham />}></Route> */}
            <Route path='cau-hinh' element={<CauHinh />}></Route>
            <Route path='san-pham' element={<CreateProducts />}></Route>
            <Route path='nhap-hang' element={<NhapHang />}></Route>
            <Route path='chi-tiet-nhap' element={<ChiTietNhapHang />}></Route>
            <Route path='phieu-nhap' element={<PhieuNhapNo />}></Route>
            <Route path='xuat-hang' element={<XuatHang />}></Route>
            <Route path='chi-tiet-xuat' element={<ChiTietXuatHang />}></Route>
            <Route path='phieu-xuat-no' element={<PhieuXuatNo />}></Route>
            <Route path='kiem-kho' element={<KiemKho />}></Route>
            <Route path='xu-ly-don-hang' element={<XuLyDonHang />}></Route>
            <Route path='doi-tac' element={<DoiTac />}></Route>
            <Route path='nhan-vien' element={<NhanVien />}></Route>
          </Route>
          <Route path='in-don-hang/:oId' element={<InDonHang />}></Route>
          <Route path='in-ma-vach/:spId/:maSp/:tenSp' element={<InMaVach />}></Route>

        </Routes>
      </BrowserRouter>
    );
  } else {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TrangChu />}>
            <Route index element={<SanPham />} />
            <Route path='/danh-muc' element={<DanhMuc />} />
            <Route path='/thuong-hieu' element={<ThuongHieu />} />
            <Route path='/thong-bao' element={<ThongBao />} />
            <Route path='/tai-khoan' element={<TaiKhoan />} />
            {/* <Route path='/dang-nhap' element={<DangNhap />} /> */}

          </Route>
          <Route path='/tim-kiem' element={<TimKiem />} />
          {/* login của quản lý */}
          <Route path='/quan-ly' element={<Login />} />
          <Route path='/dang-ky-shop' element={<DangKyShop />} />
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App;
