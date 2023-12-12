import React from 'react'
import SanPhamItemDoc from './SanPhamItemDoc';
import { useSelector } from 'react-redux';

const SanPhamByThuongHieu = ({ listSanPham }) => {
    // console.log(listSanPham)
    let { gioHang } = useSelector((state) => state.gioHang);

    return (
        <div>
            <div className="listSanPham">

                {
                    listSanPham?.map((sanPhamItem, index) => {
                        let { kId, soLuong } = sanPhamItem;

                        gioHang.forEach((gioHangItem) => {
                            if (gioHangItem.kId === kId) {
                                soLuong -= gioHangItem.soLuong * gioHangItem.quyDoi;
                            }
                        });

                        let updatedSanPhamItem = {
                            ...sanPhamItem,
                            soLuong,
                        };

                        // const sortedSanPham = [...sanPham].sort((a, b) => a.quyDoi - b.quyDoi);
                        return (
                            <SanPhamItemDoc sanPham={updatedSanPhamItem} key={index} />

                        );
                    })
                }
            </div>

        </div>

    )
}

export default SanPhamByThuongHieu