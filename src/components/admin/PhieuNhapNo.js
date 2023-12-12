import React, { useEffect, useState } from 'react'
import './phieunhapno.scss'
import { useDispatch, useSelector } from 'react-redux'
import { updateListChiTietNhap } from '../../redux/chiTietNhapSlice';
import { chiTietApi } from '../../api/chiTietApi';
import moment from 'moment';
import { capitalizeFirstLetter } from '../../service/functions';
import { phieuApi } from '../../api/phieuApi';
import { message } from 'antd';
import { NavLink } from 'react-router-dom';

const PhieuNhapNo = () => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };

    const dispath = useDispatch();

    const recallChiTietNhap = () => {
        chiTietApi.apiGetChiTietNhap(headers).then((res) => {
            const { statusCode } = res.data
            dispath(updateListChiTietNhap(res.data.content))
        }).catch((err) => {
            console.log(err)
        })
    }

    const timChiTietNhap = (keyword) => {
        chiTietApi.apiTimChiTietNhap(headers, keyword).then((res) => {
            const { statusCode } = res.data
            dispath(updateListChiTietNhap(res.data.content))
        }).catch((err) => {
            console.log(err)
        })
    }

    let { listChiTietNhap } = useSelector((state) => state.chiTietNhap);

    const phieuNhapNo = []
    listChiTietNhap?.forEach((item) => {
        const { pId, ngay, dtId, maDoiTac, soPhieu, soTien, thanhToan, conNo, ghiChu } = item
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
            phieuNhapNo.push(phieuNo)
        }
    })
    // console.log(phieuNhapNo)
    const tongSoTien = phieuNhapNo.reduce((total, item) => total + item.soTien, 0)
    const tongThanhToan = phieuNhapNo.reduce((total, item) => total + item.thanhToan, 0)

    const [tra, setTra] = useState(0)
    // console.log(tra)

    useEffect(() => {
        recallChiTietNhap()
    }, [])

    //tìm kiếm
    const [keyword, setKeyword] = useState('')
    console.log(keyword)
    const handleTimKiem = (event) => {
        const { value } = event.target
        if (value !== '') {
            setKeyword(value.trim().toLowerCase())
            timChiTietNhap(value.trim().toLowerCase())
        } else {
            recallChiTietNhap()

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
                timChiTietNhap(keyword)
            } else {
                recallChiTietNhap()
            }
        }).catch((err) => {
            console.log(err)
        })
        setThanhToan({})
        setTra(0)
    }



    return (
        <div id='phieuNhapNo'>
            <h2>Phiếu nhập nợ</h2>

            <>
                <div className="inputItem">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder='Tìm kiếm...'
                        onChange={handleTimKiem}
                    />
                </div>
                {
                    phieuNhapNo.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <td className='right'>STT</td>
                                    <td>Ngày</td>
                                    <td>Số phiếu</td>
                                    <td>Tên nhà phân phối</td>
                                    <td className='right'>Số tiền</td>
                                    <td className='right'>Thanh toán</td>
                                    <td className='right'>Còn nợ</td>
                                    <td>Ghi chú</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    phieuNhapNo.map((item, index) => {
                                        const { pId, ngay, soPhieu, maDoiTac, soTien, ghiChu } = item
                                        return (
                                            <tr key={index}>
                                                <td className='stt right'>{index + 1}</td>
                                                <td>{moment(ngay).format('DD/MM/YYYY')}</td>
                                                <td>{soPhieu.toUpperCase()}</td>
                                                <td>{maDoiTac.toUpperCase()}</td>
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
                                                <td>{capitalizeFirstLetter(ghiChu)}</td>
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
                                </tr>
                            </thead>
                        </table>
                    ) : (
                        <h3>Không có phiếu nợ</h3>
                    )
                }
            </>

        </div>
    )
}

export default PhieuNhapNo