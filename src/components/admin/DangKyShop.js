import React, { useState } from 'react'
import './dangkyshop.scss'
import { shopsApi } from '../../api/shopsApi'
import { message } from 'antd'
import { NavLink, useNavigate } from 'react-router-dom'

const DangKyShop = () => {
    const [alert, setAlert] = useState({
        taiKhoan: '',
        matKhau: '',
        tenShop: '',
        diaChi: '',
        soDt: '',
        nguoiLienHe: ''
    })
    const [thongTinShop, setThongTinShop] = useState({
        taiKhoan: '',
        matKhau: '',
        tenShop: '',
        diaChi: '',
        soDt: '',
        nguoiLienHe: ''


    })
    const [showPass, setShowPass] = useState(false)
    const handleChangeInput = (event) => {
        const { id, value } = event.target;
        setThongTinShop((prevState) => ({
            ...prevState,
            [id]: value

        }))
        if (value !== '') {
            setAlert((prevState) => ({
                ...prevState,
                [id]: ''
            }))
        } else {
            setAlert((prevState) => ({
                ...prevState,
                [id]: 'Vui lòng nhập dữ liệu'
            }))
        }
    }
    const navigate = useNavigate()

    const handleDangKyShop = () => {
        let valid = true;

        // Kiểm tra điều kiện và cập nhật thông báo cho mỗi trường
        if (thongTinShop.taiKhoan === '') {
            setAlert((prevState) => ({
                ...prevState,
                taiKhoan: 'Vui lòng nhập tài khoản'
            }));
            valid = false;
        } else {
            setAlert((prevState) => ({
                ...prevState,
                taiKhoan: ''
            }));
        }

        if (thongTinShop.matKhau === '') {
            setAlert((prevState) => ({
                ...prevState,
                matKhau: 'Vui lòng nhập mật khẩu'
            }));
            valid = false;
        } else {
            setAlert((prevState) => ({
                ...prevState,
                matKhau: ''
            }));
        }

        if (thongTinShop.tenShop === '') {
            setAlert((prevState) => ({
                ...prevState,
                tenShop: 'Vui lòng nhập tên shop'
            }));
            valid = false;
        } else {
            setAlert((prevState) => ({
                ...prevState,
                tenShop: ''
            }));
        }

        if (thongTinShop.diaChi === '') {
            setAlert((prevState) => ({
                ...prevState,
                diaChi: 'Vui lòng nhập địa chỉ'
            }));
            valid = false;
        } else {
            setAlert((prevState) => ({
                ...prevState,
                diaChi: ''
            }));
        }

        if (thongTinShop.soDt === '') {
            setAlert((prevState) => ({
                ...prevState,
                soDt: 'Vui lòng nhập số điện thoại'
            }));
            valid = false;
        } else {
            setAlert((prevState) => ({
                ...prevState,
                soDt: ''
            }));
        }

        if (thongTinShop.nguoiLienHe === '') {
            setAlert((prevState) => ({
                ...prevState,
                nguoiLienHe: 'Vui lòng nhập tên người liên hệ'
            }));
            valid = false;
        } else {
            setAlert((prevState) => ({
                ...prevState,
                nguoiLienHe: ''
            }));
        }

        // Nếu tất cả điều kiện đều hợp lệ, thực hiện các hành động khác ở đây
        if (valid) {
            // Việc đăng ký shop thành công, bạn có thể thực hiện các hành động khác ở đây
            shopsApi.apiDangKyShop(thongTinShop).then((res) => {
                const { statusCode } = res.data;
                // console.log(res.data)
                if (statusCode === 200) {
                    message.success('Đăng ký shop thành công', 3)
                    setThongTinShop({
                        taiKhoan: '',
                        matKhau: '',
                        tenShop: '',
                        diaChi: '',
                        soDt: '',
                        nguoiLienHe: ''
                    })
                    setAlert({
                        taiKhoan: '',
                        matKhau: '',
                        tenShop: '',
                        diaChi: '',
                        soDt: '',
                        nguoiLienHe: ''
                    })
                    // Chuyển trang sau 3 giây
                    setTimeout(() => {
                        navigate('/quan-ly');
                    }, 2000);
                } if (statusCode === 209) {
                    message.warning('Tên tài khoản đã tồn tại')
                    setAlert((prevState) => ({
                        ...prevState,
                        taiKhoan: 'Tên tài khoản đã tồn tại'
                    }))
                }


            }).catch((err) => {
                console.log(err)
            })
        }
    }
    return (
        <div id='dangKyShop'>
            <h3>Liên hệ 0909240886</h3>
            <form action="">
                <div className="inputItem">
                    <i className="fa-solid fa-user"></i>
                    <input type="text" id='taiKhoan' placeholder='Tài khoản'
                        onChange={handleChangeInput}
                    />
                </div>
                <p>{alert.taiKhoan}</p>

                <div className="inputItem">
                    <i className="fa-solid fa-key"></i>
                    <input type={showPass ? 'text' : 'password'} id='matKhau' placeholder='Mật khẩu'
                        onChange={handleChangeInput}
                    />
                    <i id='showPass' className={showPass ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'} onClick={() => setShowPass(!showPass)}></i>
                </div>
                <p>{alert.matKhau}</p>

                <div className="inputItem">
                    <i className="fa-solid fa-shop"></i>
                    <input type="text" id='tenShop' placeholder='Tên shop'
                        onChange={handleChangeInput}
                    />
                </div>
                <p>{alert.tenShop}</p>

                <div className="inputItem">
                    <i className="fa-solid fa-location-dot"></i>
                    <input type="text" id='diaChi' placeholder='Địa chỉ'
                        onChange={handleChangeInput}
                    />
                </div>
                <p>{alert.diaChi}</p>

                <div className="inputItem">
                    <i className="fa-solid fa-phone"></i>
                    <input type="text" id='soDt' placeholder='Số điện thoại'
                        onChange={handleChangeInput}
                    />
                </div>
                <p>{alert.soDt}</p>

                <div className="inputItem">
                    <i className="fa-regular fa-id-card"></i>
                    <input type="text" id='nguoiLienHe' placeholder='Người liên hệ'
                        onChange={handleChangeInput}
                    />
                </div>
                <p>{alert.nguoiLienHe}</p>

                <button type='button' onClick={handleDangKyShop}>
                    Đăng ký shop
                </button>
                <NavLink to={'/quan-ly'}>Quay về đăng nhập</NavLink>
            </form>
        </div>
    )
}

export default DangKyShop