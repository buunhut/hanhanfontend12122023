import React, { useState } from 'react'
import './sanphamdoc.scss'
import { useDispatch, useSelector } from 'react-redux'
import { giamSoLuong, tangSoLuong, themGioHang } from '../../redux/gioHangSlice'
import { message } from "antd";
import { URL } from '../../service/functions';


const SanPhamItemDoc = ({ sanPham }) => {

    const { gioHang } = useSelector((state) => state.gioHang);

    let { spId, kId, tenSp, giaBan, giaGiam, quyDoi, tonQuyDoi, hinhAnh, maxOrder } = sanPham
    let gifs = false
    let phanTram = Number(100 - (giaGiam / giaBan) * 100).toFixed(2)

    const inCart = gioHang.find((gioHangItem) => gioHangItem.spId === spId)
    const dispath = useDispatch()
    const handleThemVaoGio = (sanPham) => {
        let { kId, spId, tenSp, dvt, giaBan, giaGiam, phiVc, quyDoi, hinhAnh, sId, maxOrder } = sanPham
        let donGia = 0;
        if (giaGiam !== 0) {
            donGia = giaGiam
        } else {
            donGia = giaBan
        }
        let soLuong = 1;
        const data = {
            kId,
            spId,
            tenSp,
            dvt,
            soLuong,
            donGia,
            quyDoi,
            phiVc,
            hinhAnh,
            sId,
            maxOrder
        }
        dispath(themGioHang(data))
        message.success('Đã thêm vào giỏ', 1)
    }

    const handleGiamSoLuong = (sanPham) => {
        dispath(giamSoLuong(sanPham))
        message.warning('Đã giảm số lượng', 1)
    }

    const handleTangSoLuong = (sanPham) => {
        const { spId, maxOrder, dvt } = sanPham

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
            if (sanPham.soLuong / sanPham.quyDoi < 1) {
                message.warning('Kho không đủ hàng')
            } else {
                dispath(tangSoLuong(sanPham))
                message.success('Đã tăng số lượng', 1)
            }
        }
    }

    return (
        <div key={0} className='sanPhamDoc' >
            <div className="hinhAnh">
                <img src={`${URL}/${hinhAnh}`} alt="" />
            </div>
            <div className='small'>
                <div className='tenSp'>
                    <p>{tenSp}</p>
                </div>
                <div className='giaSp'>
                    {
                        giaGiam > 0 ? (
                            <p className='giaGiam'>{giaGiam.toLocaleString()}đ</p>

                        ) : (
                            <p className='giaGiam'>{giaBan.toLocaleString()}đ</p>
                        )
                    }
                    {
                        giaGiam > 0 ? (
                            <p className='giaBan'>{giaBan.toLocaleString()}đ</p>
                        ) : null
                    }
                </div>

                {
                    inCart ? (
                        <>
                            <div className='tangGiamSoLuong'>
                                <i className="fa-solid fa-minus giam" onClick={() => handleGiamSoLuong(sanPham)}></i>
                                <p>{inCart.soLuong}</p>
                                <i className="fa-solid fa-plus tang" onClick={() => handleTangSoLuong(sanPham)}></i>
                            </div>
                        </>
                    ) : (
                        <div className='themVaoGio'>
                            {
                                sanPham.soLuong / sanPham.quyDoi >= 1 ? (
                                    <button className='coHang' type='button' onClick={() => handleThemVaoGio(sanPham)}>Thêm vào giỏ</button>
                                ) : (
                                    <button type='button' className='tamHet'>Tạm hết hàng</button>
                                )
                            }
                        </div>

                    )
                }
            </div>

            <div className="phanTram" style={{ display: phanTram == 100 ? 'none' : 'block' }}>
                {
                    phanTram !== 'NaN' ? (<p>{-phanTram}%</p>) : null
                }
            </div>
            
            <div className="gifs">
                {
                    gifs?.length > 0 ? (<p>
                        <i className="fa-solid fa-gift"></i>
                    </p>) : null
                }
            </div>


        </div >
    )
}

export default SanPhamItemDoc