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
        // Thực hiện xáo trộn mảng khi component được render lần đầu tiên
        const shuffledArray = [...listSanPham].sort(() => Math.random() - 0.5);
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

    // // Hàm xáo trộn mảng ngẫu nhiên
    // const shuffleArray = (array) => {
    //     for (let i = array.length - 1; i > 0; i--) {
    //         const j = Math.floor(Math.random() * (i + 1));
    //         [array[i], array[j]] = [array[j], array[i]];
    //     }
    //     setShuffList(array)
    // }


    // // const [listSanPham, setListSanPham] = useState([])
    // useEffect(() => {
    //     usersApi.apiGetTatCaSanPham().then((res) => {
    //         // setListSanPham(res.data.content)
    //         dispath(updateSanPham(res.data.content))

    //     }).catch((err) => {
    //         console.log(err)
    //     })

    // }, [])

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

export default SanPham