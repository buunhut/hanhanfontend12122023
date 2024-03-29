import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userLogout } from '../../redux/dangNhapSlice'
import { Popconfirm, Tooltip, message } from 'antd'
import './homepage.scss'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { capitalizeFirstLetter } from '../../service/functions'
import { donHangApi } from '../../api/donHangApi'
import { updateListOrderByShop, updateSoLuongDonHang } from '../../redux/orderSlice'

const HomePage = () => {
    // const { isLogin, user } = useSelector((state) => state.dangNhap)
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };

    const dispath = useDispatch()
    const navigate = useNavigate()
    const handleDangXuat = () => {
        dispath(userLogout())
        message.success('Đăng xuất thành công', 2)
        navigate('/quan-ly')

    }
    const [smallSizeMenu, setSmallSizeMenu] = useState(true)

    // const [soLuongDonHang, setSoLuongDonHang] = useState(0)

    const callSoLuongDonHang = () => {
        donHangApi.apiGetDonHangChoXuLy(headers)
            .then((res) => {
                dispath(updateSoLuongDonHang(res.data.content));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        // Gọi callSoLuongDonHang ngay khi component được render
        callSoLuongDonHang();

        // Sử dụng setInterval để gọi callSoLuongDonHang mỗi 60 giây
        const intervalId = setInterval(() => {
            callSoLuongDonHang();
        }, 60000);

        // Đảm bảo clearInterval khi component unmount để tránh memory leak
        return () => clearInterval(intervalId);
    }, []);

    //lấy dữ liệu đơn hàng
    let { soLuongDonHang } = useSelector((state) => state.order)
    // console.log(soLuongDonHang)

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
                <div className="effect">
                    <p>Xin chào: {user.tenShop}</p>
                    <div className="logOut">
                        <Popconfirm
                            placement="left"
                            title={'Đăng xuất'}
                            description={'Bạn có chắc muốn đăng xuất?'}
                            okText="Có"
                            cancelText="Không"
                            onConfirm={handleDangXuat}
                        >
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>

                        </Popconfirm>
                    </div>
                </div>
            </div>
            <div id='quanLy'>
                <div className={smallSizeMenu ? 'menu small' : 'menu'}>
                    <NavLink to={'xu-ly-don-hang'} activeclassname="active">
                        {
                            smallSizeMenu ? (
                                <Tooltip placement="right" title={'Đơn hàng'}
                                color={'red'}
                                >
                                    <i className="fa-regular fa-file-lines"></i>
                                </Tooltip>

                            ) : (
                                <>
                                    <i className="fa-regular fa-file-lines"></i>
                                    <span>Đơn hàng
                                        {soLuongDonHang ? (` (${soLuongDonHang.toLocaleString()})`) : null}
                                    </span>
                                </>
                            )
                        }
                    </NavLink>
                    <NavLink to={'san-pham'} activeclassname="active">
                        {
                            smallSizeMenu ? (
                                <Tooltip placement="right" title={'Sản phẩm'}
                                color={'red'}
                                >
                                    <i className="fa-solid fa-kitchen-set"></i>
                                </Tooltip>

                            ) : (
                                <>
                                    <i className="fa-solid fa-kitchen-set"></i>
                                    <span>Sản phẩm</span>
                                </>
                            )
                        }
                    </NavLink>
                    <NavLink to={'nhap-hang'} activeclassname="active">
                        {
                            smallSizeMenu ? (
                                <Tooltip placement="right" title={'Nhập hàng'}
                                color={'red'}
                                >
                                    <i className="fa-solid fa-truck"></i>
                                </Tooltip>

                            ) : (
                                <>
                                    <i className="fa-solid fa-truck"></i><span>Nhập hàng</span>
                                </>
                            )
                        }
                    </NavLink>
                    <NavLink to={'phieu-nhap'} activeclassname="active">
                        {
                            smallSizeMenu ? (
                                <Tooltip placement="right" title={'Phiếu nhập'}
                                color={'red'}
                                >
                                    <i className="fa-solid fa-file-circle-plus"></i>
                                </Tooltip>

                            ) : (
                                <>
                                    <i className="fa-solid fa-file-circle-plus"></i><span>Phiếu nhập</span>
                                </>
                            )
                        }
                    </NavLink>
                    <NavLink to={'chi-tiet-nhap'} activeclassname="active">
                        {
                            smallSizeMenu ? (
                                <Tooltip placement="right" title={'Chi tiết nhập'}
                                color={'red'}
                                >
                                    <i className="fa-regular fa-file-lines"></i>
                                </Tooltip>

                            ) : (
                                <>
                                    <i className="fa-regular fa-file-lines"></i><span>Chi tiết nhập</span>
                                </>
                            )
                        }
                    </NavLink>
                    <NavLink to={'xuat-hang'} activeclassname="active">
                        {
                            smallSizeMenu ? (
                                <Tooltip placement="right" title={'Xuất hàng'}
                                color={'red'}
                                >
                                    <i className="fa-solid fa-hand-holding-dollar"></i>
                                </Tooltip>

                            ) : (
                                <>
                                    <i className="fa-solid fa-hand-holding-dollar"></i><span>Xuất hàng</span>
                                </>
                            )
                        }
                    </NavLink>
                    <NavLink to={'phieu-xuat-no'} activeclassname="active">
                        {
                            smallSizeMenu ? (
                                <Tooltip placement="right" title={'Phiếu xuất'}
                                color={'red'}
                                >
                                    <i className="fa-solid fa-file-circle-minus"></i>
                                </Tooltip>

                            ) : (
                                <>
                                    <i className="fa-solid fa-file-circle-minus"></i><span>Phiếu xuất</span>
                                </>
                            )
                        }
                    </NavLink>
                    <NavLink to={'chi-tiet-xuat'} activeclassname="active">
                        {
                            smallSizeMenu ? (
                                <Tooltip placement="right" title={'Chi tiết xuất'}
                                color={'red'}
                                >
                                    <i className="fa-regular fa-file-lines"></i>
                                </Tooltip>

                            ) : (
                                <>
                                    <i className="fa-regular fa-file-lines"></i><span>Chi tiết xuất</span>
                                </>
                            )
                        }
                    </NavLink>
                    <NavLink to={'kiem-kho'} activeclassname="active">
                        {
                            smallSizeMenu ? (
                                <Tooltip placement="right" title={'Kiểm kho'}
                                color={'red'}
                                >
                                    <i className="fa-solid fa-list-check"></i>
                                </Tooltip>

                            ) : (
                                <>
                                    <i className="fa-solid fa-list-check"></i><span>Kiểm kho</span>
                                </>
                            )
                        }

                    </NavLink>
                    <NavLink to={'doi-tac'} activeclassname="active">
                        {
                            smallSizeMenu ? (
                                <Tooltip placement="right" title={'Đối tác'}
                                color={'red'}
                                >
                                    <i className="fa-solid fa-users"></i>
                                </Tooltip>

                            ) : (
                                <>
                                    <i className="fa-solid fa-users"></i><span>Đối tác</span>
                                </>
                            )
                        }


                    </NavLink>
                    <NavLink to={'nhan-vien'} activeclassname="active">
                        {
                            smallSizeMenu ? (
                                <Tooltip placement="right" title={'Nhân viên'}
                                    color={'red'}

                                >
                                    <i className="fa-solid fa-user-group"></i>
                                </Tooltip>

                            ) : (
                                <>
                                    <i className="fa-solid fa-user-group"></i><span>Nhân viên</span>
                                </>
                            )
                        }

                    </NavLink>
                    <NavLink to={'cau-hinh'} activeclassname="active">
                        {
                            smallSizeMenu ? (
                                <Tooltip placement="right" title={'Cấu hình'}
                                    color={'red'}

                                >
                                    <i className="fa-solid fa-gear"></i>
                                </Tooltip>

                            ) : (
                                <>
                                    <i className="fa-solid fa-gear"></i><span>Cấu hình</span>
                                </>
                            )
                        }

                    </NavLink>
                </div>
                <div className='body'>
                    <Outlet>

                    </Outlet>
                    <div className="bottomTitle">
                        <span>{user.tenShop} - 2023</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage