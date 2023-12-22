import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import moment from 'moment';
import { capitalizeFirstLetter } from '../../service/functions';
import './indonhang.scss'
import { callApi } from '../../api/callApi';
import { donHangApi } from '../../api/donHangApi';
import JsBarcode from 'jsbarcode';




const InDonHang = () => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };
    let tongThu = 0;
    const { oId } = useParams('oId')
    const [orderDetails, setOrderDetails] = useState(null)
    const [autoPrint, setAutoPrint] = useState(false)


    let soDonHang = orderDetails?.soDonHang
    const generateBarcode = () => {
        const barcodeElement = document.getElementById('maDonHang');
        // Generate the barcode for the string "hd00001"
        JsBarcode(barcodeElement, soDonHang, {
            format: 'CODE128',
            displayValue: false,
        });
    };

    //gọi dữ liệu về
    useEffect(() => {
        const getData = async () => {
            // await callApi.apiOneOrder(headers, +oId).then((res) => {
            //     setOrderDetails(res.data.content)
            // })
            await donHangApi.apiInDonHangByShop(headers, oId).then((res) => {
                setOrderDetails(res.data.content)
            })
        }
        getData()
        // setTimeout(() => {
        //     window.print()
        // }, 100)
    }, [oId])

    useEffect(() => {
        if (orderDetails) {
            generateBarcode();
        }
    }, [orderDetails]);


    return (

        <div style={{ display: orderDetails === null ? 'none' : 'block' }}>

            <div className="printArea">
                <h2>{user.tenShop}</h2>
                <p className='dienThoai'><i className="fa-solid fa-phone"></i> {user.soDt}</p>

                <div className="inputItem spaceAround">
                    <p className='diaChi'><i className="fa-solid fa-location-dot"></i> {user.diaChi}</p>

                </div>
                <div>
                    <h3>PHIẾU BÁN HÀNG</h3>
                    <p className='center'>
                        Số ĐH: {orderDetails?.soDonHang}
                    </p>
                    <p className='center'>
                        {moment(orderDetails?.ngay).format('DD/MM/YYYY hh:mm')}
                    </p>
                </div>
                <div className='thongTinKhachHang'>
                    <p>
                        Khách hàng: <b> {orderDetails?.users.hoTen}</b>
                    </p>

                    <p>
                        SĐT: <b>{orderDetails?.users.soDt.replace('+84', '0')}</b>
                    </p>
                    <p>
                        Địa chỉ: {orderDetails?.users.diaChi}
                    </p>
                </div>
                <div className='thongTinDonHang'>
                    <table className='orderDetails'>
                        <thead>
                            <tr>
                                <td>
                                    Tên sản phẩm
                                </td>
                                <td className='tien'>
                                    Tiền
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orderDetails?.chiTietDonHang.map((order, index) => {
                                    const { tenSp, dvt, soLuong, donGia } = order
                                    const thanhTien = soLuong * donGia
                                    tongThu += thanhTien
                                    return (
                                        <tr key={index}>
                                            <td className='tenHang'>
                                                <p>{capitalizeFirstLetter(tenSp)}</p>
                                                <div className="inputItem">
                                                    <span>Đơn giá: {donGia.toLocaleString()}</span>
                                                    <span>Số lượng: {soLuong.toLocaleString()}</span>
                                                </div>
                                            </td>
                                            <td className='thanhTien'>
                                                {thanhTien.toLocaleString()}
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            <tr style={{ background: 'white' }}>
                                <td style={{ textAlign: 'right' }}>
                                    <b>Tiền hàng:</b>
                                </td>
                                <td className='tien'>
                                    <b>{tongThu.toLocaleString()}</b>
                                </td>
                            </tr>
                            <tr style={{ background: 'white', display: orderDetails?.phiVc <= 0 ? 'none' : '' }}>
                                <td style={{ textAlign: 'right' }}>
                                    <b>Phí vận chuyển:</b>
                                </td>
                                <td className='tien'>
                                    <b>{orderDetails?.phiVc?.toLocaleString()}</b>
                                </td>
                            </tr>
                            <tr style={{ background: 'white', display: orderDetails?.traVi <= 0 ? 'none' : '' }}>
                                <td style={{ textAlign: 'right' }}>
                                    <b>Trả ví:</b>
                                </td>
                                <td className='tien'>
                                    <b>{orderDetails?.traVi?.toLocaleString()}</b>
                                </td>
                            </tr>
                            <tr style={{ background: 'white' }}>
                                <td style={{ textAlign: 'right' }}>
                                    <b>Tổng tiền thanh toán:</b>
                                </td>
                                <td className='tien'>
                                    <b>{(tongThu + orderDetails?.phiVc - orderDetails?.traVi).toLocaleString()}</b>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='bottom'>
                        <p>Cảm ơn Quý Khách</p>
                        <p>http://www.bachhoahanhan.com</p>
                    </div>
                    <svg id='maDonHang'></svg>
                    <button className='no-print' onClick={() => window.print()}>In phiếu</button>
                </div>
            </div>
        </div>
    )
}

export default InDonHang