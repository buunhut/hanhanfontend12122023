import React from 'react'
import Footer from './Footer'
import { NavLink } from 'react-router-dom'

const TimKiem = () => {
    return (
        <div>
            <header>
                <div className="container">
                    <div className="contentMenu">
                        <div className="topItem">
                            <i className="fa-solid fa-location-dot"></i>
                            <p>Bách Hoá HÂN HÂN</p>
                        </div>
                        <div className='topItem'>
                            <div className='back'>
                                <NavLink to={'/'}>
                                    <i className="fa-solid fa-angle-left"></i>
                                </NavLink>
                            </div>

                            <div className='inputItem'>
                                <input type="text" id="timKiem" autoFocus placeholder='Bạn muốn tìm gì hôm nay' />
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </div>

                            <div className='gioHang'>
                                <i className="fa-solid fa-cart-shopping"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div>
                <div className="container">
                    <div className="content">
                        tìm kiếm
                    </div>
                </div>
            </div>



            <Footer />
        </div>
    )
}

export default TimKiem