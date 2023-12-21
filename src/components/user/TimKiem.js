import React, { useEffect, useState } from 'react'
import './timkiem.scss'
import Footer from './Footer'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { usersApi } from '../../api/usersApi'
import SanPhamItemNgang from './SanPhamItemNgang'
import { updateSanPham, updateSanPhamTimKiem } from '../../redux/sanPhamSlice'
import SanPhamItemDoc from './SanPhamItemDoc'

const TimKiem = () => {
    const dispath = useDispatch()
    //chọn shop, trả về sản phẩm của shop đó, để viết triển sau
    const { sId } = useSelector((state) => state.sanPham)

    // const { isLogin, user } = useSelector((state) => state.dangNhap)
    // const { sanPham: listSanPham } = useSelector((state) => state.sanPham)
    let { gioHang } = useSelector((state) => state.gioHang);

    let { listSanPhamTimKiem } = useSelector((state) => state.sanPham)
    // console.log(listSanPhamTimKiem)

    // const [listSanPham, setListSanPham] = useState([])
    useEffect(() => {
        usersApi.apiTimKiemSanPham().then((res) => {
            // setListSanPham(res.data.content)
            dispath(updateSanPhamTimKiem(res.data.content))

        }).catch((err) => {
            console.log(err)
        })
    }, [])

    const [keyword, setKeyword] = useState('')
    const handleTimKiem = (event) => {
        const { value } = event.target;
        setKeyword(value)
        if (value !== '') {
            usersApi.apiTimKiemSanPham(value).then((res) => {
                // console.log(res.data.content)
                dispath(updateSanPhamTimKiem(res.data.content))
            }).catch((err) => {
                console.log(err)
            })
        } else {
            dispath(updateSanPhamTimKiem([]))
        }

    }


    return (
        <div id='timKiem'>
            <header>
                <div className="container">
                    <div className="contentMenu">
                        <div className="topItem">
                            <i className="fa-solid fa-location-dot"></i>
                            <p>Bách hoá HÂN HÂN</p>
                            <i className="fa-solid fa-caret-down"></i>
                        </div>
                        <div className="topItem">
                            <div className='back'>
                                <NavLink to={'/'}>
                                    <i className="fa-solid fa-angle-left"></i>
                                </NavLink>
                            </div>
                            <div className="inputItem">
                                <input
                                    type="text"
                                    id="timKiem"
                                    placeholder="Bạn muốn tìm gì hôm nay"
                                    autoFocus
                                    value={keyword}
                                    onChange={handleTimKiem}
                                // onClick={handleClickTimKiem}
                                />
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </div>


                        </div>
                    </div>
                </div>
            </header>

            <div className="container">
                <div className="content">
                    {
                        listSanPhamTimKiem?.map((sanPhamItem, index) => {
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



            <div className="footer">
                <Footer />
            </div>
        </div>
    )
}

export default TimKiem