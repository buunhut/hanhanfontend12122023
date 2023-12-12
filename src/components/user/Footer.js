import React from 'react'
import { NavLink } from 'react-router-dom'
import './footer.scss'

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="contentMenu">
                    <NavLink to='/'>
                        <i className="fa-solid fa-house"></i>
                        <p>
                            Trang chủ
                        </p>
                    </NavLink>
                    <NavLink to='/danh-muc'>
                        <i className="fa-solid fa-layer-group"></i>
                        <p>
                            Danh mục
                        </p>
                    </NavLink>
                    <NavLink to='/thuong-hieu'>
                        <i className="fa-solid fa-bag-shopping"></i>
                        <p>
                            Thương hiệu
                        </p>
                    </NavLink>
                    <NavLink to='/thong-bao'>
                        <i className="fa-solid fa-bell"></i>
                        <p>
                            Thông báo
                        </p>
                    </NavLink>
                    <NavLink to='/tai-khoan'>
                        <i className="fa-solid fa-user"></i>
                        <p>
                            Tài khoản
                        </p>
                    </NavLink>

                </div>
            </div>
        </footer>
    )
}

export default Footer