import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './inphieunhap.scss'
import { useSelector } from 'react-redux';
import { phieuApi } from '../../../api/phieuApi';
import moment from 'moment';
import { capitalizeFirstLetter, numberToWords } from '../../../service/functions';
import { QRCode, Space } from 'antd';

const InPhieuXuat = () => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };
    const { pId } = useParams('pId')

    const [phieu, setPhieu] = useState(null)
    // console.log(phieu)
    let tongCong = 0
    let noCu = 0

    useEffect(() => {
        phieuApi.apiInPhieuNhap(headers, pId).then((res) => {
            setPhieu(res.data.content)
        }).catch((err) => {
            console.log(err)
        })


        const handleBeforePrint = () => {
            // console.log('Nút In đã được nhấn.');
        };

        const handleAfterPrint = () => {
            // console.log('Quá trình in đã hoàn thành hoặc đã hủy bỏ.');
            window.close()

        };

        // Đăng ký sự kiện khi component được mount
        window.addEventListener('beforeprint', handleBeforePrint);
        window.addEventListener('afterprint', handleAfterPrint);




    }, [])

    useEffect(() => {
        if (phieu !== null) {
            window.print()
        }
    }, [phieu])

    // console.log(phieu)



    const [sizeIn, setSizeIn] = useState('300px')
    return (
        <div id='inPhieuNhap' style={{ width: sizeIn }}>
            {/* <h3 className='no-print'>In Phiếu Nhập</h3> */}
            <div className='topContent' id={sizeIn === '300px' ? 'smallSize' : null}>
                <div className="formInBig">
                    <h2>{user.tenShop}</h2>
                    <p className='dienThoai'><i className="fa-solid fa-phone"></i> {user.soDt}</p>
                    <p className='diaChi'><i className="fa-solid fa-location-dot"></i> {user.diaChi}</p>
                </div>
                <div className='formIn'>
                    <h2>PHIẾU BÁN HÀNG</h2>
                    <p><span>{moment(phieu?.ngay).format('DD/MM/YYYY')}</span> <span>- {phieu?.soPhieu}</span></p>
                    {/* <p>Phiếu số: <span> {phieu?.soPhieu}</span></p> */}
                </div>
            </div>
            <div className="thongTin">
                <p>Khách hàng: <b>{phieu?.doiTac ? phieu?.doiTac.tenDoiTac : ''}</b></p>
                <p>SĐT: <b>{phieu?.doiTac ? phieu.doiTac.soDt : ''}</b> </p>

                <p>Địa chỉ: <b>{phieu?.doiTac ? phieu.doiTac.diaChi : ''}</b></p>
            </div>
            {
                sizeIn === '300px' ? (
                    <table id='inPhieu'>
                        <thead>
                            <tr>
                                <td className='tenHang'>
                                    Tên hàng
                                </td>
                                <td className='soLuong'>
                                    SL
                                </td>
                                <td className='thanhTien'>
                                    Thành tiền
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                phieu?.bangChiTiet.map((item, index) => {
                                    tongCong += (item.soLuong * item.donGia)
                                    return (
                                        <tr key={index}>
                                            <td colSpan={2}>
                                                <p>{item.tenSp}</p>
                                                <div>
                                                    <div className="inputItem">
                                                        <span>Giá: {item.donGia.toLocaleString()}</span>
                                                        <span>{item.soLuong.toLocaleString()} </span>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* <td className='dvt'>
                                                {item.dvt}
                                            </td>
                                            <td className='soLuong'>
                                                {item.soLuong.toLocaleString()}
                                            </td>
                                            <td className='donGia'>
                                                {item.donGia.toLocaleString()}
                                            </td> */}
                                            <td className='thanhTien'>
                                                {(item.donGia * item.soLuong).toLocaleString()}
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={2}>
                                    TỔNG CỘNG
                                </td>
                                <td>
                                    {tongCong.toLocaleString()}
                                </td>
                            </tr>
                            <tr style={{ display: noCu === 0 ? 'none' : 'block' }}>
                                <td colSpan={2}>

                                    NỢ CŨ
                                </td>
                                <td>
                                    {
                                        noCu.toLocaleString()
                                    }
                                </td>
                            </tr>
                            <tr style={{ display: noCu === 0 ? 'none' : 'block' }}>
                                <td colSpan={2}>

                                    TỔNG PHẢI THU
                                </td>
                                <td>
                                    {
                                        (tongCong + noCu).toLocaleString()
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3} className='vietBangChu'>
                                    {capitalizeFirstLetter(numberToWords(tongCong + noCu)) + ' đồng.'}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                ) : (
                    <table className='inPhieu'>
                        <thead>
                            <tr>
                                <td className='stt'>
                                    STT
                                </td>
                                <td className='tenHang'>
                                    Tên hàng
                                </td>
                                <td className='dvt'>
                                    ĐVT
                                </td>
                                <td className='soLuong'>
                                    SL
                                </td>
                                <td className='donGia'>
                                    Đơn giá
                                </td>
                                <td className='thanhTien'>
                                    Thành tiền
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                phieu?.bangChiTiet.map((item, index) => {
                                    tongCong += (item.soLuong * item.donGia)
                                    return (
                                        <tr key={index}>
                                            <td className='stt'>
                                                {index + 1}
                                            </td>
                                            <td className='tenHang'>
                                                {item.tenSp}
                                            </td>
                                            <td className='dvt'>
                                                {item.dvt}
                                            </td>
                                            <td className='soLuong'>
                                                {item.soLuong.toLocaleString()}
                                            </td>
                                            <td className='donGia'>
                                                {item.donGia.toLocaleString()}
                                            </td>
                                            <td className='thanhTien'>
                                                {(item.donGia * item.soLuong).toLocaleString()}
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={5}>
                                    TỔNG CỘNG
                                </td>
                                <td>
                                    {tongCong.toLocaleString()}
                                </td>
                            </tr>
                            <tr style={{ display: noCu === 0 ? 'none' : 'block' }}>
                                <td colSpan={5}>

                                    NỢ CŨ
                                </td>
                                <td>
                                    {
                                        noCu.toLocaleString()
                                    }
                                </td>
                            </tr>
                            <tr style={{ display: noCu === 0 ? 'none' : 'block' }}>
                                <td colSpan={5}>

                                    TỔNG PHẢI THU
                                </td>
                                <td>
                                    {
                                        (tongCong + noCu).toLocaleString()
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={6} className='vietBangChu'>
                                    {capitalizeFirstLetter(numberToWords(tongCong + noCu)) + ' đồng.'}
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                )
            }

            <div className='extra'>
                <Space direction="vertical" align="center">
                    <QRCode value={'http://bachhoahanhan.com'} />
                </Space>
                <p>Cảm ơn Quý Khách</p>
                <p>http://bachhoahanhan.com</p>

            </div>

            <div className="sizeArea no-print">
                <span onClick={() => setSizeIn('300px')} className={sizeIn === '300px' ? 'no-print active' : 'no-print'}>Khổ nhỏ</span>
                <span onClick={() => setSizeIn('530px')} className={sizeIn === '530px' ? 'no-print active' : 'no-print'}>Khổ A5</span>
            </div>


            <button className='no-print' onClick={() => window.print()}>In phiếu</button>
        </div>
    )
}

export default InPhieuXuat