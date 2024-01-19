import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './sanpham.scss'
import SanPhamItemDoc from './SanPhamItemDoc'
import { callApi } from '../../api/callApi'
import { updateSanPham } from '../../redux/sanPhamSlice'
import { usersApi } from '../../api/usersApi'

const SanPham = () => {
    const dispatch = useDispatch()
    //chọn shop, trả về sản phẩm của shop đó, để viết triển sau
    const { sId } = useSelector((state) => state.sanPham)

    // const { isLogin, user } = useSelector((state) => state.dangNhap)
    // const { sanPham: listSanPham } = useSelector((state) => state.sanPham)
    let { gioHang } = useSelector((state) => state.gioHang);

    let { listSanPham } = useSelector((state) => state.sanPham)
    const [shuffledList, setShuffledList] = useState([]);

    useEffect(() => {
        const data = listSanPham.filter((item) => item.sId === sId)
        const shuffledArray = [...data].sort(() => Math.random() - 0.5);
        setShuffledList(shuffledArray);
    }, [sId])
    useEffect(() => {
        let data = listSanPham.filter((item) => item.sId === sId)
        // Thực hiện xáo trộn mảng khi component được render lần đầu tiên

        const shuffledArray = [...data].sort(() => Math.random() - 0.5);
        setShuffledList(shuffledArray);
    }, [listSanPham]); // Chỉ chạy khi listSanPham thay đổi

    useEffect(() => {
        usersApi.apiGetTatCaSanPham()
            .then((res) => {
                dispatch(updateSanPham(res.data.content));
            })
            .catch((err) => {
                console.log(err);
            });
    }, [dispatch]);


    return (
        <div className="container">
            <div className="content">
                {
                    shuffledList?.map((sanPhamItem, index) => {
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

                        return (

                            <SanPhamItemDoc sanPham={updatedSanPhamItem} key={index} />

                        );
                    })
                }
            </div>

        </div>
    )
}

export default SanPham