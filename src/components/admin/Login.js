import React, { useState } from "react";
import { callApi } from "../../api/callApi";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { userLogin } from "../../redux/dangNhapSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { shopsApi } from "../../api/shopsApi";

const Login = () => {
    const navigate = useNavigate()
    const [shop, setShop] = useState({
        taiKhoan: "",
        matKhau: "",
    });
    const [alert, setAlert] = useState({
        taiKhoan: "",
        matKhau: "",
    });
    const changeInput = (event) => {
        const { id, value } = event.target;
        setShop((prevState) => ({
            ...prevState,
            [id]: value,
        }));
        if (id === "taiKhoan") {
            if (value === "") {
                setAlert((prevState) => ({
                    ...prevState,
                    [id]: "Vui lòng nhập tài khoản",
                }));
            } else {
                setAlert((prevState) => ({
                    ...prevState,
                    [id]: "",
                }));
            }
        } else {
            if (value === "") {
                setAlert((prevState) => ({
                    ...prevState,
                    [id]: "Vui lòng nhập mật khẩu",
                }));
            } else {
                setAlert((prevState) => ({
                    ...prevState,
                    [id]: "",
                }));
            }
        }
    };
    const dispath = useDispatch();
    let valid = true;

    const handleDangNhap = () => {
        if (shop.taiKhoan === "") {
            setAlert((prevState) => ({
                ...prevState,
                taiKhoan: "Vui lòng nhập tài khoản",
            }));
            valid = false;
        } else {
            setAlert((prevState) => ({
                ...prevState,
                taiKhoan: "",
            }));
            valid = true;
        }
        if (shop.matKhau === "") {
            setAlert((prevState) => ({
                ...prevState,
                matKhau: "Vui lòng nhập mật khẩu",
            }));
            valid = false;
        } else {
            setAlert((prevState) => ({
                ...prevState,
                matKhau: "",
            }));
            valid = true;
        }
        if (valid === false) {
            return;
        }
        //gọi axios
        shopsApi
            .apiLogin(shop)
            .then((res) => {
                const { statusCode, content } = res.data;
                if (statusCode === 200) {
                    localStorage.setItem("user", JSON.stringify(content));
                    dispath(userLogin(content));
                    navigate('/quan-ly/xu-ly-don-hang')
                    message.success("Đăng nhập thành công", 2);
                } else {
                    message.error("Đăng nhập thất bại", 2);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <div className="container">
            <div className="content">
                <h1>Đăng Nhập Hệ Thống</h1>
                <div className="myForm">
                    <form action="">
                        <div className="inputItem">
                            <input
                                type="text"
                                id="taiKhoan"
                                placeholder="Username"
                                value={shop.taiKhoan}
                                onChange={changeInput}
                            />
                            <i className="fa-solid fa-user"></i>
                        </div>
                        <p className="alert">{alert.taiKhoan}</p>
                        <div className="inputItem">
                            <input
                                type="password"
                                id="matKhau"
                                placeholder="Password"
                                value={shop.matKhau}
                                onChange={changeInput}
                            />
                            <i className="fa-solid fa-key"></i>
                        </div>
                        <p className="alert">{alert.matKhau}</p>

                        <button type="button" onClick={handleDangNhap} style={{ width: '100%' }}>
                            Login
                        </button>
                    </form>
                    <NavLink to={"/dang-ky-shop"}>
                        Chưa có tài khoản, đăng ký ngay
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default Login;
