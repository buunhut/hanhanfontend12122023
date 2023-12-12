import React from 'react'
import './timkiem.scss'
import Footer from './Footer'
import { NavLink } from 'react-router-dom'

const TimKiem = () => {
    return (
        <div id='timKiem'>

            <header>
                <div className="container">
                    <div className="contentMenu">
                        <div className="topItem">
                            <i className="fa-solid fa-location-dot"></i>
                            <p>Bách Hoá HÂN HÂN</p>
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
                                // onClick={handleClickTimKiem}
                                />
                                <i className="fa-solid fa-magnifying-glass"></i>
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



            <div className="footer">
                <Footer />
            </div>
        </div>
    )
}

export default TimKiem