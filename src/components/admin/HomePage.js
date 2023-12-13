import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userLogout } from '../../redux/dangNhapSlice'
import { message } from 'antd'
import './homepage.scss'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { capitalizeFirstLetter } from '../../service/functions'

const HomePage = () => {
    const { isLogin, user } = useSelector((state) => state.dangNhap)
    const dispath = useDispatch()
    const navigate = useNavigate()
    const handleDangXuat = () => {
        dispath(userLogout())
        message.success('Đăng xuất thành công', 2)
        navigate('/quan-ly')

    }
    const [smallSizeMenu, setSmallSizeMenu] = useState(false)

    return (
        <>
            <div className='title'>
                {
                    smallSizeMenu ? (<i className="fa-solid fa-angles-right menuSize"
                        onClick={() => setSmallSizeMenu(!smallSizeMenu)}
                    ></i>) : (<i className="fa-solid fa-angles-left menuSize"
                        onClick={() => setSmallSizeMenu(!smallSizeMenu)}
                    ></i>)
                }

                <p >Xin chào: {user.tenShop.toUpperCase()} <i className="fa-solid fa-arrow-right-from-bracket" onClick={handleDangXuat}></i> </p>
            </div>
            <div id='quanLy'>
                <div className={smallSizeMenu ? 'menu small' : 'menu'}>
                    <NavLink to={'xu-ly-don-hang'} activeclassname="active"><i className="fa-regular fa-file-lines"></i><span>Đơn hàng</span></NavLink>
                    <NavLink to={'san-pham'} activeclassname="active"><i className="fa-solid fa-kitchen-set"></i><span>Sản phẩm</span></NavLink>
                    <NavLink to={'nhap-hang'} activeclassname="active"><i className="fa-solid fa-truck"></i><span>Nhập hàng</span></NavLink>
                    <NavLink to={'chi-tiet-nhap'} activeclassname="active"><i className="fa-solid fa-truck"></i><span>Chi tiết nhập</span></NavLink>
                    <NavLink to={'phieu-nhap'} activeclassname="active"><i className="fa-solid fa-truck"></i><span>Phiếu nhập</span></NavLink>
                    <NavLink to={'xuat-hang'} activeclassname="active"><i className="fa-solid fa-hand-holding-dollar"></i><span>Xuất hàng</span></NavLink>
                    <NavLink to={'chi-tiet-xuat'} activeclassname="active"><i className="fa-solid fa-hand-holding-dollar"></i><span>Chi tiết xuất</span></NavLink>
                    <NavLink to={'phieu-xuat-no'} activeclassname="active"><i className="fa-solid fa-hand-holding-dollar"></i><span>Phiếu xuất nợ</span></NavLink>
                    <NavLink to={'kiem-kho'} activeclassname="active"><i className="fa-solid fa-list-check"></i><span>Kiểm kho</span></NavLink>
                    <NavLink to={'doi-tac'} activeclassname="active"><i className="fa-solid fa-users"></i><span>Đối tác</span></NavLink>
                    <NavLink to={'nhan-vien'} activeclassname="active"><i className="fa-solid fa-user-group"></i><span>Nhân viên</span></NavLink>
                    <NavLink to={'cau-hinh'} activeclassname="active"><i className="fa-solid fa-gear"></i><span>Cấu hình</span></NavLink>
                </div>
                <div className='body'>
                    <Outlet>

                    </Outlet>
                    <div className="bottomTitle">
                        <span>{user.tenShop.toUpperCase()} - 2023</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage