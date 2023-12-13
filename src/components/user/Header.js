import React, { useEffect, useState } from "react";
import "./header.scss";
import { useDispatch, useSelector } from "react-redux";
import { Select, message } from 'antd';
import { NavLink, useNavigate } from "react-router-dom";
import { giamSoLuong, resetGioHang, tangSoLuong, xoaDatHang } from "../../redux/gioHangSlice";
import { URL, capitalizeFirstLetter } from "../../service/functions";
import { callApi } from "../../api/callApi";
import { updateSanPham } from "../../redux/sanPhamSlice";
import { usersApi } from "../../api/usersApi";
import * as moment from 'moment';
import { updateDiemTichLuy, updateListCauHinhByShop, updateListOrderByShop } from "../../redux/orderSlice";
import { shopsApi } from "../../api/shopsApi";





const Header = () => {
    const navigate = useNavigate()
    const handleClickTimKiem = () => {
        navigate('tim-kiem')
    };
    const { isLogin, user } = useSelector((state) => state.dangNhap)
    let uId = 0;
    let headers = {
        token: ''
    }
    if (user) {
        uId = user.uId
        headers = {
            token: user.token
        };
    }
    // console.log(user)

    const { gioHang } = useSelector((state) => state.gioHang);

    const { listSanPham } = useSelector((state) => state.sanPham);
    // console.log(listSanPham)

    const { sId } = useSelector((state) => state.sanPham)
    const { tongDiemTichLuy } = useSelector((state) => state.order)
    // console.log(tongDiemTichLuy)

    let listSanPhamCheckKho = []
    const [thongTinDatHang, setThongTinDatHang] = useState({
        uId: '',
        tenKhachHang: '',
        diaChi: '',
        soDt: '',
        trangThai: 'chờ xử lý',
        hinhThucTT: 'tiền mặt',
        ghiChu: '',
        sId,
        token: '',
    });

    const { listCauHinh } = useSelector((state) => state.order)
    // console.log(listCauHinh)


    const callCauHinh = () => {
        shopsApi.apiGetCauHinh(sId).then((res) => {
            dispath(updateListCauHinhByShop(res.data.content))
        })
    }
    useEffect(() => {
        callCauHinh()
        if (user) {
            usersApi.apiGetVi(headers).then((res) => {
                // setViCuaBan(res.data.content)
                dispath(updateDiemTichLuy(res.data.content))
            })
        }

    }, [])



    useEffect(() => {
        if (user) {
            setThongTinDatHang((prevState) => ({
                ...prevState,
                uId: user?.uId || '',
                tenKhachHang: user?.hoTen || '',
                diaChi: user?.diaChi || '',
                soDt: user?.soDt.replace('+84', 0) || '',
                token: user?.token || ''
            }));

            usersApi.apiGetVi(headers).then((res) => {
                // setViCuaBan(res.data.content)
                dispath(updateDiemTichLuy(res.data.content))
            })
        }
    }, [user]);



    listSanPham?.map((sanPhamItem, index) => {
        let { kId, spId, soLuong } = sanPhamItem;

        gioHang.forEach((gioHangItem) => {
            if (gioHangItem.kId === kId) {
                soLuong -= gioHangItem.soLuong * gioHangItem.quyDoi;
            }
        });

        let updatedSanPhamItem = {
            ...sanPhamItem,
            soLuong,
        };
        listSanPhamCheckKho.push(updatedSanPhamItem)
    })

    //biến phụ, lấy từ csdl về
    let tongDonMienPhiVc = listCauHinh?.mienPhiVc;
    let tongDonTichLuyDiem = listCauHinh?.hoanTien;
    let mucTichLuy = listCauHinh?.mucHoan / 100

    // if ()

    // console.log(tongDonMienPhiVc)

    const totalSoLuong = gioHang.reduce((total, item) => total + item.soLuong, 0);
    const totalTienHang = gioHang.reduce(
        (total, item) => total + item.soLuong * item.donGia,
        0
    );

    //điểm tích luỹ
    let diemTichLuy = 0
    if (totalTienHang > tongDonTichLuyDiem) {
        diemTichLuy = totalTienHang * mucTichLuy
    }

    const [isChecked, setIsChecked] = useState(false)
    //xử lý phí vận chuyển
    let phiVc = 0
    const listPhiVc = []
    let tongLoaiTru = 0
    gioHang?.map((item) => {
        if (item.phiVc > 0) {
            listPhiVc.push(item.phiVc)
        }
        if (item.phiVc > 0 && item.phiVc < listCauHinh?.phiVc) {
            tongLoaiTru += item.soLuong * item.donGia
        }
    })

    if (isChecked) {
        phiVc = 0
    } else {
        if (listPhiVc.length > 0) {
            let maxPhiVc = Math.max(...listPhiVc);
            if (maxPhiVc > listCauHinh?.phiVc) {
                phiVc = maxPhiVc
            } else {
                if (totalTienHang - tongLoaiTru > tongDonMienPhiVc) {
                    phiVc = 0
                } else {
                    phiVc = listCauHinh?.phiVc
                }
            }
        } else {
            if (totalTienHang - tongLoaiTru > tongDonMienPhiVc) {
                phiVc = 0
            } else {
                phiVc = listCauHinh?.phiVc
            }
        }
    }
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        if (user) {
            // console.log("first")
            usersApi.apiGetVi(headers).then((res) => {
                // setViCuaBan(res.data.content)
                dispath(updateDiemTichLuy(res.data.content))
            })
        }


        setOpen(true);

    };

    const onClose = () => {
        setOpen(false);
    };

    const dispath = useDispatch()
    const handleGiamSoLuong = (sanPham) => {
        dispath(giamSoLuong(sanPham))
        message.warning('Đã giảm số lượng', 1)
    }

    const handleTangSoLuong = (sanPham) => {
        console.log(sanPham)
        const { spId, maxOrder, dvt, tonKho } = sanPham

        if (maxOrder > 0) {
            //kiểm tra giới hạn tối đa
            const checkSp = gioHang.find(item => item.spId === spId)
            if (checkSp.soLuong === maxOrder) {
                message.warning(`Chỉ đặt tối đa ${maxOrder} ${dvt} `)
            } else {
                dispath(tangSoLuong(sanPham))
                message.success('Đã tăng số lượng', 1)
            }
        } else {
            if (sanPham.tonKho - sanPham.quyDoi < 0) {
                message.warning('Kho không đủ hàng')
            } else {
                dispath(tangSoLuong(sanPham))
                message.success('Đã tăng số lượng', 1)
            }
        }
    }

    const handleXoaDatHang = (spId) => {
        dispath(xoaDatHang(spId))
        message.warning('Đã xoá sản phẩm', 1)
    }


    const handleChangeInput = (event) => {
        const { id, value } = event.target
        if (id === 'ghiChu') {
            setThongTinDatHang((prevState) => ({
                ...prevState,
                [id]: capitalizeFirstLetter(value)
            }))
        } else {
            setThongTinDatHang((prevState) => ({
                ...prevState,
                [id]: value
            }))
        }
    }

    const handleKhachTuLay = (event) => {
        const checked = event.target.checked;
        setIsChecked(checked);
        if (checked) {
            setThongTinDatHang((prevState) => ({
                ...prevState,
                trangThai: 'chờ khách lấy'
            }))
        } else {
            setThongTinDatHang((prevState) => ({
                ...prevState,
                trangThai: 'chờ xử lý'
            }))
        }
    }
    // console.log(thongTinDatHang)


    const [sanPhamHetHang, setSanPhamHetHang] = useState([])

    const handleXacNhanDonHang = async (gioHang, thongTinDatHang) => {
        const chiTietDonHang = gioHang.map((item) => {
            const { spId, tenSp, dvt, soLuong, donGia, quyDoi, kId, sId } = item
            return {
                spId, tenSp, dvt, soLuong, donGia, quyDoi, kId, sId
            }
        })

        const data = {
            donHang: {
                uId: thongTinDatHang.uId,
                sId: thongTinDatHang.sId,
                phiVc,
                traVi: traBangVi,
                diemTichLuy,
                tienHang: totalTienHang,
                ghiChu: thongTinDatHang.ghiChu,
                trangThai: thongTinDatHang.trangThai,
                hinhThucTT: thongTinDatHang.hinhThucTT,
            },
            chiTietDonHang
        }
        const headers = {
            token: user.token
        }
        usersApi.apiXacNhanDonHang(headers, data).then((res) => {
            const { statusCode } = res.data
            if (statusCode === 200) {
                dispath(resetGioHang([]))
                setTimeout(() => {
                    usersApi.apiGetTatCaSanPham().then((res) => {
                        dispath(updateSanPham(res.data.content))
                    }).catch((err) => {
                        console.log(err)
                    })
                    // usersApi.apiChiTietDonHangByUser(headers, uId).then((res) => {
                    //     dispath(updateListOrderByShop(res.data.content))
                    // });
                }, 200)
                usersApi.apiChiTietDonHangByUser(headers, uId).then((res) => {
                    dispath(updateListOrderByShop(res.data.content))
                });
                usersApi.apiGetVi(headers).then((res) => {
                    // setViCuaBan(res.data.content)
                    dispath(updateDiemTichLuy(res.data.content))
                })
                setTraBangVi(0)
                message.success('Đặt hàng thành công', 3)
            }
            setThongTinDatHang((prevState) => ({
                ...prevState,
                trangThai: 'chờ xử lý',
                ghiChu: ''
            }))
            setIsChecked(false);
        }).catch((err) => {
            console.log(err)
        })
    }

    let pkIdHetHang = []

    const [traBangVi, setTraBangVi] = useState(0)

    const handleTraBangVi = (event) => {
        const checked = event.target.checked;

        if (checked) {
            if (tongDiemTichLuy > totalTienHang + phiVc) {
                setTraBangVi(totalTienHang + phiVc)
            } else {
                setTraBangVi(tongDiemTichLuy)
            }
        } else {
            setTraBangVi(0)
        }
    }


    return (
        <>
            <header>
                <div className="container">
                    <div className="contentMenu">
                        <div className="topItem">
                            <i className="fa-solid fa-location-dot"></i>
                            <p>Bách Hoá HÂN HÂN</p>
                            <i className="fa-solid fa-caret-down"></i>
                        </div>
                        <div className="topItem">
                            <div className="inputItem">
                                <input
                                    type="text"
                                    id="timKiem"
                                    placeholder="Bạn muốn tìm gì hôm nay"
                                    onClick={handleClickTimKiem}
                                />
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </div>

                            <div className="gioHang" onClick={showDrawer}>
                                <i className="fa-solid fa-cart-shopping"></i>
                                {totalSoLuong > 0 ? (
                                    <p className="totalSoLuong">
                                        {totalSoLuong.toLocaleString()}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div id="gioHang" >
                {
                    open ? (
                        <div className="overlay" onClick={onClose}></div>
                    )
                        : (null)
                }
                <div id="gioHangContent" className={open ? 'show' : ''}>
                    <div className="title">
                        <i className="fa-solid fa-xmark" onClick={onClose}></i>
                        <p>
                            Giỏ hàng của bạn({totalSoLuong.toLocaleString()})
                        </p>
                        <button type="button" onClick={onClose}>Đóng</button>
                    </div>

                    <div className="main">
                        <table>
                            <tbody>
                                {
                                    gioHang?.map((gioHang, index) => {
                                        let { kId, spId, tenSp, hinhAnh, soLuong, donGia, dvt, quyDoi } = gioHang
                                        let sanPhamIncart = listSanPhamCheckKho.find((item) => item.spId === spId)
                                        const tonKho = sanPhamIncart?.soLuong
                                        const sanPham = {
                                            ...gioHang,
                                            tonKho
                                        }
                                        return (
                                            <tr key={index}>
                                                <td className="hinhAnh">
                                                    <img src={`${URL}/${hinhAnh}`} alt="" />
                                                </td>
                                                <td className="tenSp">
                                                    <p className="ten">{tenSp}</p>
                                                    <div className="bottomMenu">
                                                        <p className="donGia">{donGia.toLocaleString()}đ</p>
                                                        <div className='tangGiamSoLuong'>
                                                            <i className="fa-solid fa-minus giam" onClick={() => handleGiamSoLuong(sanPham)}></i>
                                                            <p>{soLuong}</p>
                                                            <i className="fa-solid fa-plus tang" onClick={() => handleTangSoLuong(sanPham)}></i>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="thanhTien">
                                                    <p className="xoa" onClick={() => handleXoaDatHang(spId)}>
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </p>
                                                    <p className="thanhTien">
                                                        {(donGia * soLuong).toLocaleString()}
                                                    </p>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                {
                                    totalSoLuong > 0 ? (
                                        <>
                                            <tr className="phiVc" >
                                                <td colSpan={2} className="pvc">Phí vận chuyển
                                                    {
                                                        listPhiVc.length > 0 ? (
                                                            <>
                                                                <p className="center" style={{ display: phiVc <= 0 ? 'none' : 'block' }}>
                                                                    <i>(Đơn hàng có sản phẩm không áp dụng miễm phí vận chuyển)</i>
                                                                </p>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <p className="center" style={{ display: phiVc <= 0 ? 'none' : 'block' }}>
                                                                    <i
                                                                    >(Đặt thêm {(tongDonMienPhiVc - totalTienHang).toLocaleString()} để được miễn phí vận chuyển)</i>
                                                                </p>
                                                            </>
                                                        )
                                                    }
                                                </td>

                                                <td className="tien"
                                                    style={{ color: phiVc > 0 ? 'red' : 'royalblue' }}
                                                >{phiVc <= 0 ? 'Miễn phí' : phiVc.toLocaleString()}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2} className="note">
                                                    <p>Số tiền tích luỹ</p>
                                                </td>
                                                <td className="thanhTien note">
                                                    <p className="tichLuy">
                                                        {diemTichLuy.toLocaleString()}
                                                    </p>
                                                </td>
                                            </tr>

                                        </>
                                    ) : null

                                }

                            </tbody>
                        </table>
                        {
                            gioHang.length > 0 ? (
                                <>
                                    <div className="inputItem">
                                        <i className="fa-solid fa-pen"></i>

                                        <input type="text" id="ghiChu"
                                            placeholder="Ghi chú"
                                            value={thongTinDatHang?.ghiChu}
                                            onChange={handleChangeInput}
                                        />
                                    </div>
                                    <div className="khachTuLay">
                                        <input type="checkbox" onClick={(event) => handleKhachTuLay(event)} /> Tôi tự tới lấy
                                    </div>

                                </>
                            ) : null
                        }

                        <div className="hetHang" style={{ display: sanPhamHetHang.length > 0 ? 'block' : 'none' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <td>Sản phẩm không đủ hàng</td>
                                        <td>Đã đặt</td>
                                        <td>Kho còn</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        sanPhamHetHang.map((item, index) => {
                                            let soLuongHienTai = item.tonKho;

                                            let khachDat = 0
                                            let gioHangSort = [...gioHang]
                                            gioHangSort.sort((a, b) => b.quyDoi - a.quyDoi)
                                            gioHangSort.forEach((sanPham) => {
                                                if (sanPham.pId === item.pId) {
                                                    const soLuongQuyDoi = sanPham.soLuong * sanPham.quyDoi;
                                                    khachDat += soLuongQuyDoi;
                                                    soLuongHienTai -= soLuongQuyDoi;
                                                    if (soLuongHienTai < 0) {
                                                        let thongTinSanPhamHetHang = {
                                                            tenSp: item.tenSp,
                                                            dvt: sanPham.dvt,
                                                            tonKho: soLuongHienTai,
                                                            quyDoi: sanPham.quyDoi,
                                                            thieu: soLuongHienTai / sanPham.quyDoi
                                                        }
                                                        pkIdHetHang.push(thongTinSanPhamHetHang)
                                                        soLuongHienTai += soLuongQuyDoi
                                                    }
                                                }
                                            });

                                        })

                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {
                        tongDiemTichLuy > 0 ? (
                            <div className="viCuaBan" >
                                <p>
                                    Ví của bạn: {tongDiemTichLuy.toLocaleString()}đ
                                </p>
                                <input type="checkbox" name="traBangVi"

                                    onClick={(event) => handleTraBangVi(event)}
                                />
                                <span> Trừ ví</span>
                            </div>

                        ) : null
                    }


                    <div className="bottom">
                        {totalTienHang > 0 ? (
                            <>
                                <div className="thanhToan">
                                    <div className="inputItem">
                                        <p>Tổng:</p>
                                        <p>{(totalTienHang + phiVc).toLocaleString()}đ</p>
                                    </div>
                                    <div className="inputItem" style={{ display: traBangVi > 0 ? 'flex' : 'none' }}>
                                        <p>Trừ ví:</p>
                                        <p> -{traBangVi.toLocaleString()}đ</p>
                                    </div>
                                    <div className="inputItem" style={{ display: traBangVi > 0 ? 'flex' : 'none' }}>
                                        <p>Còn lại:</p>
                                        <p> {((totalTienHang + phiVc) - traBangVi).toLocaleString()}đ</p>
                                    </div>
                                </div>
                                {
                                    user ? (

                                        <button type="button"
                                            onClick={() => handleXacNhanDonHang(gioHang, thongTinDatHang)}>
                                            Xác nhận đơn hàng
                                        </button>
                                    ) : (
                                        <NavLink to={'/tai-khoan'}>
                                            <button type="button" onClick={onClose}>
                                                Đăng nhập ngay
                                            </button>
                                        </NavLink>
                                    )
                                }
                            </>
                        ) : (
                            <NavLink to={'/'} onClick={onClose}>
                                <button type="button">Tiếp tục mua sắm</button>
                            </NavLink>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
