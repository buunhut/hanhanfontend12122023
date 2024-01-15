import React, { useEffect, useState } from "react";
import "./formnhaphang.scss";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { callApi } from "../../../api/callApi";
import { updateListKh } from "../../../redux/doiTacSlice";
import { Select, message } from "antd";
import { updateSanPhamByShop } from "../../../redux/sanPhamSlice";
import { URL, capitalizeFirstLetter } from "../../../service/functions";
import {
    updateListPhieuNhapMoiTao,
    updateListPhieuXuatMoiTao,
    updatePhieuNhapActi,
    updatePhieuXuatActi,
} from "../../../redux/nhapHangSlice";
import { doiTacApi } from "../../../api/doiTacApi";
import { phieuApi } from "../../../api/phieuApi";
import { chiTietApi } from "../../../api/chiTietApi";

const FormXuatHang = () => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };
    useEffect(() => {
        doiTacApi.apiGetKhachHang(headers)
            .then((res) => {
                dispath(updateListKh(res.data.content));
            })
            .catch((err) => {
                console.log(err);
            });
        phieuApi.apiGetSanPham(headers).then((res) => {
            if (res.data.content.length > 0) {
                dispath(updateSanPhamByShop(res.data.content))
            }
        });
        phieuApi.apiGetPhieuXuatMoiTao(headers).then((res) => {
            dispath(updateListPhieuXuatMoiTao(res.data.content));
            dispath(updatePhieuXuatActi(res.data.content[0]?.pId))
        });
    }, []);

    const { listKh } = useSelector((state) => state.doiTac);
    const sortedListKh = [...listKh].sort((a, b) => {
        const maDoiTacA = a.maDoiTac.toUpperCase();
        const maDoiTacB = b.maDoiTac.toUpperCase();
        if (maDoiTacA < maDoiTacB) {
            return -1;
        }
        if (maDoiTacA > maDoiTacB) {
            return 1;
        }
        return 0;
    });




    // const [sanPhamByShop, setSanPhamByShop] = useState([]);
    let { sanPhamByShop } = useSelector((state) => state.sanPham)
    const sortSp = [...sanPhamByShop].sort((a, b) => b.spId - a.spId)
    // console.log(sortSp)

    const dispath = useDispatch();
    const recallSanPhamByShop = () => {
        phieuApi.apiGetSanPham(headers).then((res) => {
            dispath(updateSanPhamByShop(res.data.content));
        });
    };

    const recallListPhieuXuatMoiTao = () => {
        phieuApi.apiGetPhieuXuatMoiTao(headers).then((res) => {
            dispath(updateListPhieuXuatMoiTao(res.data.content));
            // dispath(updatePhieuNhapActi(res.data.content[0].pId))
        });
    };




    // let { sanPhamByShop } = useSelector((state) => state.sanPham);
    let { phieuXuatActi } = useSelector((state) => state.nhapHang);
    // console.log("form nhập hàng: ", phieuXuatActi)

    const [ngayThang, setNgayThang] = useState(moment().format("YYYY-MM-DD"));
    // console.log(ngayThang)
    const handleChangeNgayThang = (event) => {
        // Update the state with the selected date
        setNgayThang(event.target.value);
    };
    const [dtId, setDtId] = useState("");
    const handleChangeKh = (value) => {
        setDtId(+value);
    };
    const [ghiChu, setGhiChu] = useState("");
    const handleChangeGhiChu = (event) => {
        setGhiChu(event.target.value);
    };

    const handleTaoPhieuXuat = () => {
        const data = {
            ngay: moment.utc(ngayThang, "YYYY-MM-DD").toDate(),
            dtId,
            ghiChu,
            loaiPhieu: 'px'
        };
        if (data.dtId !== "") {
            // console.log(data)
            //gọi axios
            phieuApi
                .apiTaoPhieu(headers, data)
                .then((res) => {
                    const { statusCode, content } = res.data;
                    // console.log(statusCode)
                    if (statusCode === 200) {
                        dispath(updatePhieuXuatActi(content));
                        // phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
                        //     if (res.data.content.length > 0) {
                        //         dispath(updateListPhieuNhapMoiTao(res.data.content));
                        //     }
                        // });
                        recallListPhieuXuatMoiTao()
                        message.success("Đã tạo phiếu bán hàng", 1);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            message.warning("Chọn khách hàng", 2);
        }
    };

    const [giaBan, setGiaBan] = useState({});
    const [soLuong, setSoLuong] = useState({});

    const handleChangeGiaBan = (event, spId) => {
        const { value } = event.target;
        if (value) {
            setGiaBan((prevState) => ({
                ...prevState,
                [spId]: +value.replace(/[^0-9]/g, ""),
            }));
        } else {
            setGiaBan((prevState) => ({
                ...prevState,
                [spId]: "",
            }));
        }
    };

    const handleChangeSoLuong = (event, pId) => {
        const { value } = event.target;
        if (value) {
            setSoLuong((prevState) => ({
                ...prevState,
                [pId]: +value.replace(/[^0-9]/g, ""),
            }));
        } else {
            setSoLuong((prevState) => ({
                ...prevState,
                [pId]: 0,
            }));
        }
    };

    const handleXuatHang = (sanPham) => {

        const { spId, kId, quyDoi, tenSp, dvt } = sanPham

        let price = 0;
        let qty = 0;
        // let exch = 0;

        if (soLuong[spId] !== undefined) {
            qty = soLuong[spId];
        } else {
            qty = 1;
        }

        if (giaBan[spId] !== undefined) {
            price = giaBan[spId];
        } else {
            price = sanPham.giaBan;
        }
        let data = {
            pId: +phieuXuatActi,
            spId,
            tenSp,
            dvt,
            kId,
            quyDoi,
            donGia: price,
            soLuong: qty,
        };

        // console.log(data)

        chiTietApi
            .apiThemChiTiet(headers, data)
            .then((res) => {
                const { statusCode } = res.data;
                if (statusCode === 200) {
                    recallListPhieuXuatMoiTao();
                }
            })
            .catch((err) => {
                console.log(err);
            });

    };


    const handleSearchSanPham = (event) => {
        const { value } = event.target;
        if (value) {
            phieuApi.apiTimSanPham(headers, value).then((res) => {
                if (res.data.content.length === 1 && phieuXuatActi) {
                    const sanPham = res.data.content[0]
                    handleXuatHang(sanPham)
                }
                dispath(updateSanPhamByShop(res.data.content));
                // setSanPhamByShop(res.data.content)
            })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            recallSanPhamByShop();
        }
    };




    return (
        <div className="leftContent">
            <div className="topForm">
                <div className="groupItem">
                    <div className="inputItem">
                        <i className="fa-solid fa-users"></i>
                        <Select
                            bordered={false}
                            allowClear
                            showSearch
                            style={{
                                width: "100%",
                            }}
                            placeholder="Chọn khách hàng"
                            onChange={handleChangeKh}
                            filterOption={(input, option) =>
                                option.children.indexOf(input) >= 0
                            }
                        >
                            {sortedListKh?.map((item) => (
                                <Select.Option
                                    key={item.dtId}
                                    value={item.dtId}
                                    label={item.maDoiTac}
                                >
                                    {item.maDoiTac}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>

                    <button className="taoPhieuNhap" type="button" onClick={handleTaoPhieuXuat}>
                        Tạo phiếu xuất
                    </button>
                </div>
                <div className="search">
                    <div className="inputItem">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            placeholder="Tìm kiếm mã, tên sản phẩm"
                            onChange={handleSearchSanPham}
                        />
                    </div>
                </div>

            </div>
            {/* sửa chữa */}
            <form action="">
                {
                    sanPhamByShop.length > 0 ? (
                        <table id="formNhapHang">
                            <thead>
                                <tr>
                                    <td className="hinhAnh">Hình</td>
                                    <td>Tên sản phẩm</td>
                                    {/* <td className="dvt">ĐVT</td> */}
                                    <td className="donGia">Đơn giá</td>
                                    <td className="soLuong">SL</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    sanPhamByShop?.map((sanPham, index) => {
                                        let { maSp, tenSp, hinhAnh, dvt, spId } = sanPham;
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <img src={`${URL}/${hinhAnh}`} alt="" />
                                                </td>
                                                <td>
                                                    <p>{tenSp}</p>
                                                    <div className="flex">
                                                        <span>{maSp}</span>
                                                        <span>{dvt}</span>
                                                    </div>

                                                </td>
                                                {/* <td className="dvt">{dvt}</td> */}
                                                <td className="donGia">
                                                    <input
                                                        type="text"
                                                        name="giaNhap"
                                                        placeholder='Đơn giá'
                                                        value={
                                                            giaBan[spId] !== undefined
                                                                ? giaBan[spId].toLocaleString()
                                                                : sanPham.giaBan?.toLocaleString() || ''
                                                        }
                                                        onChange={(event) =>
                                                            handleChangeGiaBan(event, spId)
                                                        }

                                                    />
                                                </td>
                                                <td className="soLuong">
                                                    <input type="text" name='soLuong'
                                                        placeholder='SL'
                                                        value={
                                                            soLuong[spId] !== undefined
                                                                ? soLuong[spId] === 0 ? ''
                                                                    : soLuong[spId]?.toLocaleString()
                                                                : 1
                                                        }
                                                        onChange={(event) => handleChangeSoLuong(event, spId)}

                                                    />
                                                </td>
                                                <td className='center'>
                                                    <button type='button' onClick={() => handleXuatHang(sanPham)}>
                                                        <i className="fa-solid fa-plus"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    ) : (<h4>Không có dữ liệu</h4>)
                }
            </form>
        </div>
    );
};

export default FormXuatHang;
