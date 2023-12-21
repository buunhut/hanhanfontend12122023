import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import moment from 'moment';
import { capitalizeFirstLetter } from '../../service/functions';
import './indonhang.scss'
import { callApi } from '../../api/callApi';
import { donHangApi } from '../../api/donHangApi';



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







    return (
        <div style={{ display: orderDetails === null ? 'none' : 'block' }}>
            <div className="printArea">
                <h3>{user.tenShop.toUpperCase()}</h3>
                <p className='diaChi'><i className="fa-solid fa-location-dot"></i> {user.diaChi}</p>
                <div className="inputItem spaceAround">
                    <p><i className="fa-solid fa-phone"></i> {user.soDt}</p>
                    <p className='nguoiLienHe'><i className="fa-solid fa-user"></i> {user.nguoiLienHe}</p>
                </div>
                <div className='thongTinKhachHang'>
                    <div className="groupItem">
                        <div className="inputItem">
                            <p>
                                <i className="fa-solid fa-calendar-days"></i> {moment(orderDetails?.ngay).format('hh:mm DD/MM/YYYY')}
                            </p>
                        </div>
                        <div className="inputItem">
                            <p className='soPhieu'>
                                <i className="fa-solid fa-file-invoice"></i> {orderDetails?.soDonHang}
                            </p>
                        </div>
                    </div>
                    <div className="groupItem">

                        <div className="inputItem">
                            <p>
                                <i className="fa-solid fa-user"></i> {orderDetails?.users.hoTen}
                            </p>
                        </div>
                        <div className="inputItem">
                            <p>
                                <i className="fa-solid fa-phone"></i> {orderDetails?.users.soDt.replace('+84', '0')}
                            </p>
                        </div>
                    </div>
                    <div className="inputItem">
                        <p>
                            <i className="fa-solid fa-location-dot"></i> {orderDetails?.users.diaChi}
                        </p>
                    </div>
                    <div className="inputItem">
                        <p className='ghiChu'>
                            <i className="fa-solid fa-pen"></i> {orderDetails?.ghiChu}
                        </p>
                    </div>
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
                    <button className='no-print' onClick={() => window.print()}>In phiếu</button>
                </div>
            </div>
        </div>
    )
}

export default InDonHang