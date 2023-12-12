import React, { useEffect, useRef, useState } from "react";
import './dangnhap.scss'
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigation } from "react-router-dom";
import PhoneInput from 'react-phone-number-input';
import { callApi } from "../../api/callApi";
import { message } from "antd";
import { userLogin } from "../../redux/dangNhapSlice";
import { usersApi } from "../../api/usersApi";


const DangNhap = () => {

    const { isLogin, user } = useSelector((state) => state.dangNhap)



    const [userDangKy, setUserDangKy] = useState({
        soDt: '',
        hoTen: '',
        diaChi: '',
        matKhau: '123456'

    })



    const dispath = useDispatch()

    const [alert, setAlert] = useState({
        soDt: '',
        hoTen: '',
        diaChi: ''
    })


    const handleDangKy = () => {
        let valid = true
        for (let key in userDangKy) {
            if (userDangKy[key] === '') {
                if (key === 'soDt') {
                    setAlert((prevState) => ({
                        ...prevState,
                        [key]: 'Vui lòng nhập số điện thoại'
                    }))
                    valid = false
                } else if (key === 'hoTen') {
                    setAlert((prevState) => ({
                        ...prevState,
                        [key]: 'Vui lòng nhập họ tên'
                    }))
                    valid = false
                } else if (key === 'diaChi') {
                    setAlert((prevState) => ({
                        ...prevState,
                        [key]: 'Vui lòng nhập địa chỉ'
                    }))
                    valid = false
                }
            }
        }
        if (valid === false) {
            message.warning("Vui lòng nhập đầy đủ thông tin", 3)
            return
        }
        usersApi.apiDangKy(userDangKy)
            .then((res) => {
                const { statusCode, content } = res.data;
                if (statusCode === 200) {
                    message.success('Đăng ký thành công', 3)
                    setFormDangNhap(true)

                } else {
                    message.error('Đăng ký không thành công', 3)
                }
            })
            .catch((err) => {
                console.error(err);
                // Xử lý lỗi ở đây nếu cần
            });
    }

    const handleDangNhap = () => {
        let valid = true
        const data = {
            soDt: userDangKy.soDt
        }
        if (data.soDt === '') {
            setAlert((prevState) => ({
                ...prevState,
                soDt: 'Vui lòng nhập số điện thoại'
            }))
            valid = false
        } else {
            setAlert((prevState) => ({
                ...prevState,
                soDt: ''
            }))
            valid = true
        }
        if (valid === false) {
            message.warning('Vui lòng nhập thông tin đăng nhập', 3)
            return
        }

        usersApi.apiDangNhap(data).then((res) => {
            const { statusCode, content } = res.data
            if (statusCode === 200) {
                localStorage.setItem('user', JSON.stringify(content))
                message.success('Đăng nhập thành công', 3)
                dispath(userLogin(content))
            } else {
                message.error('Số tài khoản chưa đăng ký', 3)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    const changeInput = (event) => {
        const { id, value } = event.target
        setUserDangKy((prevState) => ({
            ...prevState,
            [id]: value
        }))
        setAlert((prevState) => ({
            ...prevState,
            [id]: ''
        }))

        if (value === '') {
            if (id === 'hoTen') {
                setAlert((prevState) => ({
                    ...prevState,
                    [id]: 'Vui lòng nhập họ tên'
                }))
            }
            if (id === 'diaChi') {
                setAlert((prevState) => ({
                    ...prevState,
                    [id]: 'Vui lòng nhập địa chỉ'
                }))
            }
        }
    }

    const handleChangeInputSoDt = (value) => {
        setUserDangKy((prevState) => ({
            ...prevState,
            soDt: value
        }))
        if (value === undefined) {
            setAlert((prevState) => ({
                ...prevState,
                soDt: 'Vui lòng nhập số điện thoại'
            }))
        } else {
            setAlert((prevState) => ({
                ...prevState,
                soDt: ''
            }))
            const data = {
                soDt: value
            }
            usersApi.apiCheckSoDt(data).then((res) => {
                if (res.data.statusCode === 209) {
                    setAlert((prevState) => ({
                        ...prevState,
                        soDt: 'Số điện thoại đã đăng ký'
                    }))
                } else {
                    setAlert((prevState) => ({
                        ...prevState,
                        soDt: ''
                    }))
                }
            }).catch((err) => {
                throw err
            })

        }

    }

    const handleChangeInputSoDtDangNhap = (value) => {
        setUserDangKy((prevState) => ({
            ...prevState,
            soDt: value
        }))
        if (value === undefined) {
            setAlert((prevState) => ({
                ...prevState,
                soDt: 'Vui lòng nhập số điện thoại'
            }))
        } else {
            setAlert((prevState) => ({
                ...prevState,
                soDt: ''
            }))
            const data = {
                soDt: value
            }
        }

    }

    const [formDangNhap, setFormDangNhap] = useState(true);

    const phoneInputRef = useRef();

    useEffect(() => {
        phoneInputRef.current.focus();
    }, []);

    return formDangNhap ? (
        <div id="dangNhap">
            <div className="container">
                <div className="content">
                    <div className="myForm">
                        <div className="inputItem">
                            {/* <input type="text" placeholder="Số điện thoại" /> */}
                            <i className="fa-solid fa-phone"></i>

                            <PhoneInput
                                ref={phoneInputRef}
                                defaultCountry="VN"
                                placeholder="Số điện thoại"
                                value={userDangKy?.soDt}
                                onChange={(value) => handleChangeInputSoDtDangNhap(value)}
                                countries={["VN"]}
                                international={false}
                            />
                        </div>
                        {
                            <p className="alert">{alert.soDt}</p>
                        }
                        <div className="buttonItem">
                            <button className="myBtn" type="button" onClick={handleDangNhap}>Đăng nhập</button>
                        </div>
                        <div>
                            <NavLink onClick={() => setFormDangNhap(false)}>Chưa có tài khoản, đăng ký ngay</NavLink>
                        </div>
                        <div>
                            <NavLink to={'/'}>Quay về trang chủ</NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div id="dangKy">
            <div className="container">
                <div className="content">
                    <div className="myForm">
                        <div className="inputItem">
                            {/* <input type="text" placeholder="Số điện thoại" /> */}
                            <PhoneInput
                                defaultCountry="VN"
                                placeholder="Số điện thoại"
                                value={userDangKy.soDt}
                                onChange={(value) => handleChangeInputSoDt(value)}
                                countries={["VN"]}
                                international={false}
                                autoFocus

                            />
                            <i className="fa-solid fa-phone"></i>
                        </div>
                        {
                            <p className="alert">{alert.soDt}</p>
                        }
                        <div className="inputItem">
                            <input type="text" placeholder="Họ tên"
                                id="hoTen"
                                value={userDangKy.hoTen}
                                onChange={changeInput}

                            />
                            <i className="fa-solid fa-user"></i>
                        </div>
                        {
                            <p className="alert">{alert.hoTen}</p>
                        }
                        <div className="inputItem">
                            <input type="text" placeholder="Địa chỉ"
                                id="diaChi"
                                value={userDangKy.diaChi}
                                onChange={changeInput}
                            />
                            <i className="fa-solid fa-location-dot"></i>
                        </div>
                        {
                            <p className="alert">{alert.diaChi}</p>
                        }
                        <div className="buttonItem">
                            <button className="myBtn" type="button" onClick={handleDangKy}>Đăng ký</button>
                        </div>
                        <div>
                            <NavLink onClick={() => setFormDangNhap(true)}>Quay về trang đăng nhập</NavLink>
                        </div>
                        <div>
                            <NavLink to={'/'}>Quay về trang chủ</NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DangNhap;
