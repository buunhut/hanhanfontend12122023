import React, { useEffect, useState } from 'react'
import './phieunhapno.scss'
import { useDispatch, useSelector } from 'react-redux'
import { updateListChiTietNhap, updateListChiTietXuat } from '../../redux/chiTietNhapSlice';
import { chiTietApi } from '../../api/chiTietApi';
import moment from 'moment';
import { capitalizeFirstLetter } from '../../service/functions';
import { phieuApi } from '../../api/phieuApi';
import { Popconfirm, message } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import { updateListKh, updateListNpp } from '../../redux/doiTacSlice';
import { doiTacApi } from '../../api/doiTacApi';

const PhieuXuatNo = () => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };

    const [locNo, setLocNo] = useState(false)


    const dispath = useDispatch();

    const recallChiTietXuat = () => {
        chiTietApi.apiGetChiTietXuat(headers).then((res) => {
            const { statusCode } = res.data
            dispath(updateListChiTietXuat(res.data.content))
        }).catch((err) => {
            console.log(err)
        })
    }

    const timChiTietXuat = (keyword) => {
        chiTietApi.apiTimChiTietXuat(headers, keyword).then((res) => {
            const { statusCode } = res.data
            dispath(updateListChiTietXuat(res.data.content))
        }).catch((err) => {
            console.log(err)
        })
    }

    let { listChiTietXuat } = useSelector((state) => state.chiTietNhap);

    const phieuXuatNo = []
    // const listNpp = []
    listChiTietXuat?.forEach((item) => {
        const { pId, ngay, dtId, maDoiTac, soPhieu, soTien, thanhToan, conNo, ghiChu } = item
        if (locNo) {
            if (conNo > 0) {
                const phieuNo = {
                    pId,
                    ngay,
                    dtId,
                    maDoiTac,
                    soPhieu,
                    soTien,
                    thanhToan,
                    conNo,
                    ghiChu
                }
                phieuXuatNo.push(phieuNo)
            }

        } else {
            const phieuNo = {
                pId,
                ngay,
                dtId,
                maDoiTac,
                soPhieu,
                soTien,
                thanhToan,
                conNo,
                ghiChu
            }
            phieuXuatNo.push(phieuNo)

        }
        // listNpp.push({ dtId, maDoiTac })
    })


    const tongSoTien = phieuXuatNo.reduce((total, item) => total + item.soTien, 0)
    const tongThanhToan = phieuXuatNo.reduce((total, item) => total + item.thanhToan, 0)

    const [tra, setTra] = useState(0)
    // console.log(tra)
    const callKhachHang = () => {
        doiTacApi.apiGetKhachHang(headers)
            .then((res) => {
                dispath(updateListKh(res.data.content));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        recallChiTietXuat()
        callKhachHang()
    }, [])

    const { listKh } = useSelector((state) => state.doiTac);


    //tìm kiếm
    const handleLocNo = (event) => {
        const { value } = event.target
        if (value === 'conNo') {
            setLocNo(true)
        } else {
            setLocNo(false)
        }
    }
    const [keyword, setKeyword] = useState('')
    // console.log(keyword)
    const handleTimKiem = (event) => {
        const { value } = event.target
        if (value !== '') {
            setKeyword(value.trim().toLowerCase())
            timChiTietXuat(value.trim().toLowerCase())
        } else {
            recallChiTietXuat()

        }

    }

    //xử lý trả nợ
    const [thanhToan, setThanhToan] = useState({})
    const [conNo, setConNo] = useState({})
    const [valid, setValid] = useState(true)
    // console.log(conNo)
    const handleChangeThanhToan = (event, item) => {
        const { pId, soTien, thanhToan, conNo } = item
        const { value } = event.target
        setTra((+value.replace(/[^0-9]/g, "")))
        setThanhToan((prevState) => ({
            ...prevState,
            [pId]: +value.replace(/[^0-9]/g, ""),
        }))
        if (+value.replace(/[^0-9]/g, "") > conNo) {
            setValid(false)
            message.warning('Số tiền trả dư', 0)
            return
        } else {
            message.destroy()
        }
        setConNo((prevState) => ({
            ...prevState,
            [pId]: soTien - thanhToan - (+value.replace(/[^0-9]/g, ""))
        }))


        // const data = {
        //     pId,
        //     thanhToan: +value.replace(/[^0-9]/g, "")
        // }
        // // console.log(data)

    }

    const onBlurInput = (pId) => {
        if (!valid) {
            return
        }
        const data = {
            pId,
            thanhToan: thanhToan[pId]
        }
        phieuApi.apiTraNoMotPhieu(headers, data).then((res) => {
            if (keyword !== '') {
                timChiTietXuat(keyword)
            } else {
                recallChiTietXuat()
            }
        }).catch((err) => {
            console.log(err)
        })
        setThanhToan({})
        setTra(0)
    }


    const [sortPhieu, setSortPhieu] = useState({
        from: '',
        to: '',
        dtId: '',
        locNo: ''
    })

    const onChangeInput = (event) => {
        const { name, value } = event.target
        let data = {}
        if (name === 'dtId') {
            setSortPhieu((prevState) => ({
                ...prevState,
                [name]: Number(value)
            }))
            data = {
                ...sortPhieu,
                [name]: Number(value)
            }
            if (value === '') {
                setSortPhieu((prevState) => ({
                    ...prevState,
                    dtId: ''
                }))
            }
        } else {
            setSortPhieu((prevState) => ({
                ...prevState,
                [name]: value
            }))
            data = {
                ...sortPhieu,
                [name]: value
            }

        }
        phieuApi.apiSortPhieuXuat(headers, data).then((res) => {
            dispath(updateListChiTietXuat(res.data.content))
        }).catch((err) => {
            console.log(err)
        })
    }

    //in phieu
    const handleInPhieu = (pId) => {
        window.open(`/in-phieu-xuat/${pId}`, '_blank');
    }

    //sửa phiếu xuất
    const navigate = useNavigate()
    const handleSuaPhieuXuat = (pId) => {
        chiTietApi.apiSuaChiTietDaLuu(headers, +pId).then((res) => {
            // console.log(res.data)
            const { statusCode, content } = res.data
            if (statusCode === 200) {
                navigate('/quan-ly/xuat-hang');
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    //xoá phiếu xuất đã lưu
    const handleXoaPhieuXuat = (pId) => {
        chiTietApi.apiSuaChiTietDaLuu(headers, +pId).then((res) => {
            // console.log(res.data)
            const { statusCode, content } = res.data
            if (statusCode === 200) {
                phieuApi.apiXoaPhieuMoiTao(headers, pId).then((res) => {
                    // console.log(res.data)
                    if (res.data.statusCode === 200) {
                        // recallPhieuNhapMoiTao()
                        // setActive()
                        recallChiTietXuat()
                        message.success('Đã xóa phiếu xuất', 3);
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }





    return (
        <div id='phieuNhapNo'>
            <h2>Phiếu xuất</h2>
            <>
                <div className="groupItem">
                    <div className="inputItem"
                        onChange={onChangeInput}
                    >
                        <input type="date" name='from'
                        // onChange={handleTimKiem}
                        />
                    </div>
                    <div className="inputItem">
                        <input type="date" name='to'
                            onChange={onChangeInput}
                        />
                    </div>
                    <div className="inputItem">
                        <select name="dtId" id="dtId" value={sortPhieu.dtId} onChange={onChangeInput}>
                            <option value="">Tất cả</option>
                            {listKh?.map((item, index) => (
                                <option key={index} value={item.dtId}>
                                    {item.maDoiTac}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="inputItem">
                        <select name="locNo" id="locNo"
                            // onChange={handleLocNo}
                            onChange={onChangeInput}
                        >
                            <option value="">Tất cả</option>
                            <option value="conNo">Phiếu nợ</option>
                        </select>
                    </div>

                    {/* <div className="inputItem">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input type="text" placeholder='Tìm kiếm...'
                            onChange={handleTimKiem}
                        />
                    </div> */}
                </div>
                {
                    phieuXuatNo.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <td className='right'>STT</td>
                                    <td>Ngày</td>
                                    <td>Số phiếu</td>
                                    <td>Tên khách hàng</td>
                                    <td className='right'>Số tiền</td>
                                    <td className='right'>Thanh toán</td>
                                    <td className='right'>Còn nợ</td>
                                    <td>Ghi chú</td>
                                    <td>Thao tác</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    phieuXuatNo.map((item, index) => {
                                        const { pId, ngay, soPhieu, maDoiTac, soTien, ghiChu } = item
                                        return (
                                            <tr key={index}>
                                                <td className='stt right'>{index + 1}</td>
                                                <td>{moment(ngay).format('DD/MM/YYYY')}</td>
                                                <td>{soPhieu.toUpperCase()}</td>
                                                <td>{maDoiTac}</td>
                                                <td className='right'>{soTien.toLocaleString()}</td>
                                                <td className='right'>
                                                    <input type="text"
                                                        value={
                                                            thanhToan[pId] !== undefined ?
                                                                thanhToan[pId] === 0 ? ''
                                                                    : thanhToan[pId].toLocaleString()
                                                                : item.thanhToan?.toLocaleString()
                                                        }
                                                        onChange={(event) => handleChangeThanhToan(event, item)}
                                                        onBlur={() => onBlurInput(pId)}
                                                    />
                                                    {/* {thanhToan.toLocaleString()} */}
                                                </td>
                                                <td className='right'>{
                                                    conNo[pId] !== undefined ?
                                                        conNo[pId].toLocaleString()
                                                        : item.conNo.toLocaleString()
                                                }</td>
                                                <td>{ghiChu ? capitalizeFirstLetter(ghiChu) : ''}</td>
                                                <td className='action' >
                                                    <i className="fa-solid fa-print" onClick={() => handleInPhieu(pId)}></i>
                                                    <i className="fa-regular fa-pen-to-square" onClick={() => handleSuaPhieuXuat(pId)}></i>

                                                    <Popconfirm
                                                        title="Xoá phiếu Xuất"
                                                        description="Bạn có chắc muốn xoá phiếu này?"
                                                        onConfirm={() => handleXoaPhieuXuat(pId)}
                                                        // onCancel={cancel}
                                                        placement="right"
                                                        okText="Có"
                                                        cancelText="Không"
                                                    >
                                                        <i className="fa-solid fa-trash-can"></i>

                                                    </Popconfirm>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }

                            </tbody>
                            <thead>
                                <tr>
                                    <td colSpan={4}>Tổng</td>
                                    <td className='right'>{tongSoTien.toLocaleString()}</td>
                                    <td className='right'>{(tongThanhToan + tra).toLocaleString()}</td>
                                    <td className='right'>{(tongSoTien - tongThanhToan - tra).toLocaleString()}</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </thead>
                        </table>
                    ) : (
                        <h3>Không có phiếu nợ</h3>
                    )
                }
            </>

        </div >
    )
}

export default PhieuXuatNo