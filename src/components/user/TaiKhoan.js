import React, { useEffect, useState } from "react";
import "./taikhoan.scss";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../redux/dangNhapSlice";
import DangNhap from "./DangNhap";
import { usersApi } from "../../api/usersApi";
import * as moment from "moment";
import { capitalizeFirstLetter } from "../../service/functions";
import { Popconfirm, message } from "antd";
import { updateDiemTichLuy, updateListOrderByUser } from "../../redux/orderSlice";

const TaiKhoan = () => {
    // const [user, setUser] = useState(null)
    const dispath = useDispatch();

    const { isLogin, user } = useSelector((state) => state.dangNhap);
    let token = '';
    let uId = 0;
    if (user) {
        token = user.token;
        uId = user.uId;
    }
    const headers = { token };

    // const [chiTietDonHangByUser, setChiTietDonHangByUser] = useState([]);
    const chiTietDonHangByUser = useSelector((state) => state.order.listOrderByUser)
    // console.log(chiTietDonHangByUser)
    // console.log(chiTietDonHangByUser)
    const callChiTietDonHangByUser = () => {
        if (user) {
            usersApi.apiChiTietDonHangByUser(headers, uId).then((res) => {
                // setChiTietDonHangByUser(res.data.content);
                dispath(updateListOrderByUser(res.data.content))
            });
        }
    }

    let { gioHang } = useSelector((state) => state.gioHang);

    useEffect(() => {
        callChiTietDonHangByUser()
    }, [user, gioHang]);


    let tongDiemTichLuy = 0;
    let tongTruTichLuy = 0

    if (chiTietDonHangByUser.length > 0) {
        chiTietDonHangByUser?.map(item => {
            const { diemTichLuy } = item
            if (diemTichLuy.sta === true && diemTichLuy.diemTichLuy > 0) {
                tongDiemTichLuy += diemTichLuy.diemTichLuy
            }
            if (diemTichLuy.truTichLuy > 0) {
                tongTruTichLuy += diemTichLuy.truTichLuy
            }
        })
    }

    // console.log(tongDiemTichLuy)
    // console.log(tongTruTichLuy)

    const handleDangXuat = () => {
        dispath(userLogout());
        dispath(updateDiemTichLuy(0))
    };

    const handleHuyDonHang = (item) => {
        const { oId } = item;
        usersApi.apiHuyDonHang(headers, oId).then((res) => {
            const { statusCode } = res.data
            if (statusCode === 200) {
                callChiTietDonHangByUser()
                message.success('Huỷ đơn hàng thành công', 2)

            }
            console.log(res.data)
        }).catch((err) => {
            console.log(err)
        })
    };

    if (user) {
        return (
            <div>
                <div className="container">
                    <div className="content">
                        <div id="taiKhoan">
                            <div className="tittle">
                                <p><i className="fa-solid fa-user"></i> <b> {user.hoTen}</b></p>
                                <h3><i className="fa-solid fa-wallet"></i> {(tongDiemTichLuy - tongTruTichLuy).toLocaleString()}đ</h3>
                            </div>
                            {chiTietDonHangByUser.length > 0 ? (
                                <div>
                                    <span className="note">Số tiền tích luỹ sẽ được cộng vào ví khi đơn hàng được giao thành công. Tiền tích luỹ không có giá trị quy đổi thành tiền mặt.</span>
                                    <table>
                                        <thead>
                                            <tr>
                                                {/* <td className="stt">STT</td> */}
                                                <td className="ngay">Ngày</td>
                                                <td className="right">Trạng thái</td>
                                                <td className="right">Tổng tiền</td>
                                                <td className="right">Điềm</td>
                                                <td className="huy"></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {chiTietDonHangByUser?.map((item, index) => {
                                                const {
                                                    ngay,
                                                    soDonHang,
                                                    tienHang,
                                                    phiVc,
                                                    trangThai,
                                                    diemTichLuy,
                                                } = item;
                                                return (
                                                    <tr key={index}>
                                                        {/* <td className="stt">{index + 1}</td> */}
                                                        <td className="ngay">
                                                            {moment(ngay).format("hh:mm DD/MM/YYYY")}
                                                            <br />
                                                            <span>
                                                                {soDonHang}
                                                            </span>
                                                        </td>
                                                        <td className="right">
                                                            {trangThai === "chờ khách lấy"
                                                                ? "Tự đến lấy"
                                                                : capitalizeFirstLetter(trangThai)}
                                                        </td>

                                                        <td className="right">
                                                            {(tienHang + phiVc).toLocaleString()}
                                                        </td>
                                                        <td className="right">
                                                            <p className="congTichLuy">
                                                                {diemTichLuy.diemTichLuy === null
                                                                    ? 0
                                                                    : diemTichLuy.diemTichLuy?.toLocaleString()}
                                                            </p>
                                                            <p className="truTichLuy">
                                                                {diemTichLuy.truTichLuy === 0
                                                                    ? '0'
                                                                    : (-diemTichLuy.truTichLuy)?.toLocaleString()}
                                                            </p>
                                                        </td>
                                                        <td className="huy">
                                                            {trangThai === "chờ xử lý" ||
                                                                trangThai === "chờ khách lấy" ? (


                                                                <Popconfirm
                                                                    title="Huỷ đơn hàng"
                                                                    description={`Bạn có muốn huỷ đơn hàng ${item.soDonHang} không?`}
                                                                    onConfirm={() => handleHuyDonHang(item)}
                                                                    // onCancel={cancel}
                                                                    placement="left"
                                                                    okText="Có"
                                                                    cancelText="Không"
                                                                >
                                                                    <i className="fa-regular fa-trash-can"></i>

                                                                </Popconfirm>



                                                            ) : null}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <h4>Chưa có đơn hàng</h4>
                            )}
                            <button type="button" onClick={handleDangXuat}>
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <DangNhap />;
    }
};

export default TaiKhoan;
