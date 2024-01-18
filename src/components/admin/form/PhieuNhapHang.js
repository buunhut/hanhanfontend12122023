import React, { useEffect, useRef, useState } from 'react'
import './phieubanhang.scss'
import { Popconfirm, Select, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { doiTacApi } from '../../../api/doiTacApi'
import { updateListKh, updateListNpp } from '../../../redux/doiTacSlice'
import { phieuApi } from '../../../api/phieuApi'
import { updateSanPhamByShop } from '../../../redux/sanPhamSlice'
import { updateListPhieuNhapMoiTao, updateListPhieuXuatMoiTao, updatePhieuNhapActi, updatePhieuXuatActi } from '../../../redux/nhapHangSlice'
import moment from 'moment'
import { chiTietApi } from '../../../api/chiTietApi'
import { URL } from '../../../service/functions'
import InPhieuXuat from './InPhieuXuat'
const PhieuNhapHang = ({ item }) => {

    // console.log(item)

    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };
    // let { phieuXuatActi } = useSelector((state) => state.nhapHang)

    let { bangChiTiet, doiTac } = item
    let tongTien = bangChiTiet.reduce((total, item) => total + item.thanhTien, 0)
    const tongSoLuong = bangChiTiet.reduce((total, item) => total + item.soLuong, 0)
    const [thanhToan, setThanhToan] = useState(tongTien)
    let sortBangChiTiet = [...bangChiTiet].sort((a, b) => b.dId - a.dId)


    const dispath = useDispatch();
    const recallListPhieuNhapMoiTao = () => {
        phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
            dispath(updateListPhieuNhapMoiTao(res.data.content))
            // if (res.data.content.length > 0) {
            //     dispath(updatePhieuNhapActi(res.data.content[0].pId))
            // }
        })
    }

    useEffect(() => {
        doiTacApi.apiGetNpp(headers)
            .then((res) => {
                dispath(updateListNpp(res.data.content));
            })
            .catch((err) => {
                console.log(err);
            });
        // phieuApi.apiGetSanPham(headers).then((res) => {
        //     if (res.data.content.length > 0) {
        //         dispath(updateSanPhamByShop(res.data.content))
        //     }
        // });
        // phieuApi.apiGetPhieuXuatMoiTao(headers).then((res) => {
        //     dispath(updateListPhieuXuatMoiTao(res.data.content));
        //     dispath(updatePhieuXuatActi(res.data.content[0]?.pId))
        // });
        if (doiTac) {
            setNpp({
                maDoiTac: doiTac.maDoiTac,
                tenDoiTac: doiTac.tenDoiTac,
                diaChi: doiTac.diaChi,
                mst: doiTac.mst,
                soDt: doiTac.soDt,
                nguoiLienHe: doiTac.nguoiLienHe
            })
        }
    }, []);

    useEffect(() => {
        tongTien = bangChiTiet.reduce((total, item) => total + item.thanhTien, 0);
        setThanhToan(tongTien)

    }, [bangChiTiet])
    // useEffect(() => {
    //     recallListPhieuXuatMoiTao()
    // }, [phieuXuatActi])



    let { sanPhamByShop } = useSelector((state) => state.sanPham)
    const sortSp = [...sanPhamByShop].sort((a, b) => b.spId - a.spId)



    const { listNpp } = useSelector((state) => state.doiTac);
    const sortedListNpp = [...listNpp].sort((a, b) => {
        const maDoiTacA = a.maDoiTac.toUpperCase();
        const maDoiTacB = b.maDoiTac.toUpperCase();
        if (maDoiTacA < maDoiTacB) {
            return -1;
        }
        if (maDoiTacA > maDoiTacB) {
            return 1;
        }
        return 0;
    });

    const [npp, setNpp] = useState({
        // maDoiTac: doiTac.maDoiTac,
        // tenDoiTac: doiTac.tenDoiTac,
        // diaChi: doiTac.diaChi,
        // mst: doiTac.mst,
        // soDt: doiTac.soDt,
        // nguoiLienHe: doiTac.nguoiLienHe
    })

    const [ghiChu, setGhiChu] = useState(item.ghiChu)
    const handleChangeGhiChu = (event) => {
        const { value } = event.target
        setGhiChu(value)
        // const data = {
        //     ngay: item.ngay,
        //     pId: item.pId,
        //     dtId: item.dtId,
        //     ghiChu: value
        // }
    }






    const [dtId, setDtId] = useState("");
    //cập nhật khách hàng
    const handleChangeNpp = (value) => {
        if (value) {
            const findNpp = listNpp.find((item) => item.dtId === value)
            setNpp({
                ...findNpp
            })
            const data = {
                pId: item.pId,
                dtId: + value,
                // ngay: item.ngay,
                // ghiChu,
            }
            // console.log(data)

            phieuApi.apiSuaDoiTac(headers, data).then((res) => {
                if (res.data.statusCode === 200) {
                    recallListPhieuNhapMoiTao()
                    message.success('Đã cập nhật nhà phân phối', 2)
                    setDropdownVisible(false)

                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    //xoá dòng
    const handleXoaChiTietNhap = (item) => {
        const { dId } = item
        chiTietApi.apiXoaChiTiet(headers, dId).then((res) => {
            const { statusCode } = res.data;
            console.log(statusCode)
            if (statusCode === 200) {
                // phieuApi.apiGetPhieuXuatMoiTao(headers).then((res) => {
                //     if (res.data.content.length > 0) {
                //         dispath(updateListPhieuXuatMoiTao(res.data.content))
                //     }
                // })
                recallListPhieuNhapMoiTao()
                message.success('Đã xoá sản phẩm', 2)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    //sửa số lượng
    const [editSoLuong, setEditSoLuong] = useState({})
    const handleChangeSoLuong = (event, item) => {
        const { value } = event.target
        const { dId, donGia, quyDoi, soLuong, tonKho, dvt } = item
        let data = {}
        if (+value * quyDoi > tonKho) {
            setEditSoLuong({
                [dId]: +tonKho
            })
            data = {
                dId,
                donGia,
                soLuong: +tonKho
            }
            message.warning('Kho không đủ hàng, chỉ còn ' + tonKho + ' ' + dvt, 3)
        } else {
            setEditSoLuong({
                [dId]: +value.replace(/[^0-9]/g, "")
            })
            data = {
                dId,
                donGia,
                soLuong: +value.replace(/[^0-9]/g, "")
            }
        }
        phieuApi.apiSuaChiTiet(headers, data).then((res) => {
            const { statusCode } = res.data
            if (statusCode === 200) {
                phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
                    if (res.data.content.length > 0) {
                        dispath(updateListPhieuNhapMoiTao(res.data.content))
                    }
                })
                // recallListPhieuNhapMoiTao()
            }
        }).catch((err) => {
            console.log(err)
        })

    }

    const handleGiamSoLuong = (event, item) => {
        const { value } = event.target
        const { dId, donGia, soLuong, quyDoi, tonKho } = item
        if (soLuong === 1) {
            message.warning('Giảm chi nữa ku? Không giảm được nhé :(', 2)
            return
        }
        setEditSoLuong({
            [dId]: item.soLuong - 1
        })
        const data = {
            dId,
            donGia,
            soLuong: item.soLuong - 1
        }
        phieuApi.apiSuaChiTiet(headers, data).then((res) => {
            const { statusCode } = res.data
            if (statusCode === 200) {
                phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
                    if (res.data.content.length > 0) {
                        dispath(updateListPhieuNhapMoiTao(res.data.content))
                    }
                })
                // recallListPhieuNhapMoiTao()
                setThanhToan('')

            }
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleTangSoLuong = (event, item) => {
        const { dId, donGia, quyDoi, soLuong, tonKho, dvt } = item

        setEditSoLuong({
            [dId]: item.soLuong + 1
        })
        const data = {
            dId,
            donGia,
            soLuong: item.soLuong + 1
        }
        phieuApi.apiSuaChiTiet(headers, data).then((res) => {
            const { statusCode } = res.data
            if (statusCode === 200) {
                phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
                    if (res.data.content.length > 0) {
                        dispath(updateListPhieuNhapMoiTao(res.data.content))
                    }
                })
                // recallListPhieuNhapMoiTao()
                setThanhToan('')


            }
        }).catch((err) => {
            console.log(err)
        })
    }
    //sửa đơn giá
    const [editDonGia, setEditDonGia] = useState({})
    const handleChangeDonGia = (event, item) => {
        const { value } = event.target
        const { dId, soLuong, } = item
        setEditDonGia({
            [dId]: +value.replace(/[^0-9]/g, "")
        })
        const data = {
            dId,
            donGia: +value.replace(/[^0-9]/g, ""),
            soLuong,
        }
        // console.log(data)
        phieuApi.apiSuaChiTiet(headers, data).then((res) => {
            const { statusCode } = res.data
            if (statusCode === 200) {
                phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
                    if (res.data.content.length > 0) {
                        dispath(updateListPhieuNhapMoiTao(res.data.content))
                    }
                })
                // recallListPhieuNhapMoiTao()

            }
        }).catch((err) => {
            console.log(err)
        })

    }

    const handleBlurInput = () => {
        setEditDonGia({})
        setEditSoLuong({})
    }

    //thanh toán
    const handleChangeThanhToan = (event) => {
        const { value } = event.target
        if (value) {
            setThanhToan(+value.replace(/[^0-9]/g, ""))
        } else {
            setThanhToan('')
        }
    }

    //in phieu
    const handleInPhieu = (pId) => {
        // window.open(`/in-phieu-xuat/${pId}`, '_blank');
        window.open(`/in-phieu-xuat/${pId}`);
        // window.print()
    }

    //lưu phiếu
    const handleLuuPhieuNhap = (pId) => {
        // handleInPhieu(pId)
        // console.log(item)
        // return

        if (bangChiTiet.length === 0) {
            message.warning('Chưa có sảm phẩm, lưu gì ku? :(')
        } else {
            let data = {
                pId,
                soTien: +tongTien,
                thanhToan,
                ghiChu
            }
            if (thanhToan > tongTien) {
                data = {
                    ...data,
                    thanhToan: tongTien
                }

            }
            // console.log(data)
            phieuApi.apiLuuPhieuMoiTao(headers, data).then((res) => {
                const { statusCode } = res.data;
                if (statusCode === 200) {
                    phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
                        dispath(updateListPhieuNhapMoiTao(res.data.content))
                        dispath(updatePhieuNhapActi(res.data.content[0]?.pId))
                    })
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }


    // console.log(item)

    // gợi ý thanh toánh
    const menhGiaTien = [500000, 200000, 100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 200];
    const goiYThanhToan = (tongTien, menhGiaTien) => {
        let result = []
        for (let i = 0; i < menhGiaTien.length; i++) {
            if (tongTien < menhGiaTien[i]) {
                result.push(menhGiaTien[i])
            } else {
                if (((Math.floor(tongTien / menhGiaTien[i]) + 1) * menhGiaTien[i]) - tongTien < menhGiaTien[i]) {
                    result.push(((Math.floor(tongTien / menhGiaTien[i]) + 1) * menhGiaTien[i]))
                }
            }
        }
        if (tongTien > 200 && tongTien < 400) {
            result.push(400)
        } else {
            if (tongTien > 200) {
                result.push(tongTien)
                if (tongTien % 1000 === 600) {
                    result.push((tongTien - 600) + 700)
                } else if (tongTien % 10000 === 6000) {
                    result.push((tongTien - 6000) + 7000)
                } else if (tongTien % 100000 === 60000) {
                    result.push((tongTien - 60000) + 70000)
                } else if (tongTien % 1000000 === 600000) {
                    result.push((tongTien - 600000) + 700000)
                }
                if (tongTien % 1000 === 800) {
                    result.push((tongTien - 800) + 900)
                } else if (tongTien % 10000 === 8000) {
                    result.push((tongTien - 8000) + 9000)
                } else if (tongTien % 100000 === 80000) {
                    result.push((tongTien - 80000) + 90000)
                } else if (tongTien % 1000000 === 800000) {
                    result.push((tongTien - 800000) + 900000)
                }
            }
        }
        const loaiBoGiaTriTrung = [...new Set(result)];
        return loaiBoGiaTriTrung.sort((a, b) => a - b)
    }
    const suggest = goiYThanhToan(tongTien, menhGiaTien)


    const [firstF4Press, setFirstF4Press] = useState(true);

    // console.log(search)

    //F4
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const inputRef = useRef(null);
    const handleF4KeyPress = (event) => {
        if (event.key === 'F4') {
            // Toggle the value of firstF4Press
            setFirstF4Press((prevValue) => !prevValue);
            setDropdownVisible((prevValue) => !prevValue);
            inputRef.current.focus()
        }
    };
    useEffect(() => {
        // Bắt sự kiện keydown trên cả trang
        document.addEventListener('keydown', handleF4KeyPress);

        // Cleanup effect để tránh memory leaks
        return () => {
            document.removeEventListener('keydown', handleF4KeyPress);
        };


    }, [firstF4Press])




    return (
        <div id='phieuBanHang'>
            <div className='main'>
                <div className="content">
                    {
                        sortBangChiTiet?.map((item, index) => {
                            return (
                                <div className="detail" key={index}>
                                    <div className='no'>
                                        {sortBangChiTiet.length - index}
                                    </div>
                                    <div className='del'>
                                        <Popconfirm
                                            title="Xoá chi tiết nhập"
                                            description="Bạn có muốn xoá dòng này?"
                                            onConfirm={() => handleXoaChiTietNhap(item)}
                                            // onCancel={cancel}
                                            placement="right"
                                            okText="Có"
                                            cancelText="Không"
                                        >
                                            <i className="fa-solid fa-trash-can"></i>

                                        </Popconfirm>
                                    </div>
                                    <div className='pic'>
                                        <img src={`${URL}/${item.hinhAnh}`} alt="" />
                                    </div>
                                    {/* <div className='code'>
                                    MTD0000001FBHD
                                </div> */}
                                    <div className='name'>
                                        {item.tenSp}
                                    </div>
                                    <div className='unit'>
                                        {item.dvt}
                                    </div>
                                    <div className='qty'>
                                        <i className="fa-solid fa-minus minus"
                                            onClick={(event) => handleGiamSoLuong(event, item)}

                                        ></i>
                                        <input type="text" value={
                                            editSoLuong[item.dId] !== undefined ?
                                                editSoLuong[item.dId] === 0 ? '' :
                                                    editSoLuong[item.dId].toLocaleString()
                                                : item.soLuong.toLocaleString()
                                        }
                                            onChange={(event) => handleChangeSoLuong(event, item)}
                                            onBlur={handleBlurInput}

                                            style={{ borderBottom: item.soLuong * item.quyDoi > item.tonKho ? '2px solid red' : '' }}

                                        />
                                        <i className="fa-solid fa-plus add"
                                            onClick={(event) => handleTangSoLuong(event, item)}
                                        ></i>

                                    </div>
                                    <div className='price'>
                                        <input type="text" value={
                                            editDonGia[item.dId] !== undefined ?
                                                editDonGia[item.dId] === 0 ? '' :
                                                    editDonGia[item.dId].toLocaleString()
                                                : item.donGia.toLocaleString()
                                        }

                                            onChange={(event) => handleChangeDonGia(event, item)}
                                            onBlur={handleBlurInput}
                                        />
                                    </div>
                                    <div className='money'>
                                        <p>{item.thanhTien.toLocaleString()}</p>
                                    </div>
                                </div>

                            )
                        })
                    }


                </div>
            </div>
            <div className="info">
                <div className='flex'>
                    <p>
                        #SP: {item.soPhieu.toUpperCase()}
                    </p>
                    <p>
                        {moment(item.ngay).format("DD/MM/YYYY")}
                    </p>
                </div>

                {/* <div className="inputItem">
                    <i className="fa-solid fa-user"></i>
                    <input type="text" placeholder='Khách hàng' />
                </div> */}
                <div className="inputItem">
                    <i className="fa-solid fa-users"></i>
                    <Select
                        bordered={false}
                        showSearch
                        style={{
                            width: '100%',
                        }}
                        placeholder="F4, Chọn nhà phân phối."
                        onChange={handleChangeNpp}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        value={npp.maDoiTac}
                        open={dropdownVisible}
                        ref={inputRef}
                        onBlur={() => setDropdownVisible(false)}
                        onClick={() => setDropdownVisible(true)}

                    >
                        {
                            sortedListNpp?.map((item) => (
                                <Select.Option key={item.dtId} value={item.dtId} label={item.maDoiTac}>
                                    {item.maDoiTac}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </div>


                <div className="ghiChu">
                    <div className="inputItem">
                        <i className="fa-solid fa-pen"></i>
                        <input type="text" placeholder='Ghi chú đơn hàng'
                            onChange={handleChangeGhiChu}
                        />
                    </div>
                </div>


                <div className='flex'>
                    <h4>Tổng tiền hàng</h4>
                    <h4 className='right'>{tongTien.toLocaleString()}</h4>
                </div>
                {/* <div className='flex'>
                    <h4>Khách cần trả</h4>
                    <h4 className='right'>{tongTien.toLocaleString()}</h4>
                </div> */}

                <div className='flex'>
                    <h4>Trả NPP</h4>
                    <input type="text"
                        value={thanhToan?.toLocaleString() || ''}
                        placeholder=''
                        onChange={handleChangeThanhToan}
                        style={{ fontWeight: 'bold' }}
                    />

                </div>
                <div className='flex'>
                    <h4>Còn nợ</h4>
                    <p>{
                        thanhToan > tongTien ? 0 : (tongTien - thanhToan).toLocaleString()
                    }
                    </p>
                </div>
                {/* <div className='flex' style={{ display: thanhToan > 0 ? 'flex' : 'none' }} >
                    <h4>Tiền thói</h4>
                    <p>{(thanhToan - tongTien).toLocaleString()} </p>
                </div> */}
                {/* <div className='flexStart' style={{ display: tongTien > 0 ? 'flex' : 'none' }}>
                    {
                        suggest.map((item, index) => {
                            return (
                                <span key={index} onClick={() => setThanhToan(item)}>
                                    {item.toLocaleString()}
                                </span>
                            )
                        })
                    }
                </div> */}


                {/* <div>
                    <button onClick={() => handleInPhieu(item.pId)}>In</button>
                </div> */}
                <div>
                    <button onClick={() => handleLuuPhieuNhap(item.pId)}>Lưu Phiếu</button>
                </div>

            </div>
        </div>
    )
}

export default PhieuNhapHang