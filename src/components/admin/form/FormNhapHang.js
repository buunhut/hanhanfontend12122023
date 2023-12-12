import React, { useEffect, useState } from "react";
import "./formnhaphang.scss";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { callApi } from "../../../api/callApi";
import { updateListNpp } from "../../../redux/doiTacSlice";
import { Select, message } from "antd";
import { updateSanPhamByShop } from "../../../redux/sanPhamSlice";
import { URL, capitalizeFirstLetter } from "../../../service/functions";
import {
    updateListPhieuNhapMoiTao,
    updatePhieuNhapActi,
} from "../../../redux/nhapHangSlice";
import { doiTacApi } from "../../../api/doiTacApi";
import { phieuApi } from "../../../api/phieuApi";
import { chiTietApi } from "../../../api/chiTietApi";

const FormNhapHang = () => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };
    useEffect(() => {
        doiTacApi.apiGetNpp(headers)
            .then((res) => {
                dispath(updateListNpp(res.data.content));
            })
            .catch((err) => {
                console.log(err);
            });
        phieuApi.apiGetSanPham(headers).then((res) => {
            if (res.data.content.length > 0) {
                dispath(updateSanPhamByShop(res.data.content))
            }
        });
        phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
            dispath(updateListPhieuNhapMoiTao(res.data.content));
            dispath(updatePhieuNhapActi(res.data.content[0]?.pId))
        });
    }, []);

    const { listNpp } = useSelector((state) => state.doiTac);
    // console.log(listNpp)
    const sortedListNpp = [...listNpp].sort((a, b) => {
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

    // console.log(sanPhamByShop)

    const dispath = useDispatch();
    const recallSanPhamByShop = () => {
        phieuApi.apiGetSanPham(headers).then((res) => {
            dispath(updateSanPhamByShop(res.data.content));
        });
    };

    const recallListPhieuNhapMoiTao = () => {
        phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
            dispath(updateListPhieuNhapMoiTao(res.data.content));
            // dispath(updatePhieuNhapActi(res.data.content[0].pId))
        });
    };




    // let { sanPhamByShop } = useSelector((state) => state.sanPham);
    let { phieuNhapActi } = useSelector((state) => state.nhapHang);
    // console.log("form nhập hàng: ", phieuNhapActi)

    const [ngayThang, setNgayThang] = useState(moment().format("YYYY-MM-DD"));
    // console.log(ngayThang)
    const handleChangeNgayThang = (event) => {
        // Update the state with the selected date
        setNgayThang(event.target.value);
    };
    const [dtId, setDtId] = useState("");
    const handleChangeNpp = (value) => {
        setDtId(+value);
    };
    const [ghiChu, setGhiChu] = useState("");
    const handleChangeGhiChu = (event) => {
        setGhiChu(event.target.value);
    };

    const handleTaoPhieuNhap = () => {
        const data = {
            ngay: moment.utc(ngayThang, "YYYY-MM-DD").toDate(),
            dtId,
            ghiChu,
            loaiPhieu: 'pn'
        };
        if (data.dtId !== "") {
            // console.log(data)
            //gọi axios
            phieuApi
                .apiTaoPhieu(headers, data)
                .then((res) => {
                    const { statusCode, content } = res.data;
                    // console.log(content)
                    if (statusCode === 200) {
                        dispath(updatePhieuNhapActi(content));
                        // phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
                        //     if (res.data.content.length > 0) {
                        //         dispath(updateListPhieuNhapMoiTao(res.data.content));
                        //     }
                        // });
                        recallListPhieuNhapMoiTao()
                        message.success("Đã tạo phiếu nhập", 1);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            message.warning("Chọn nhà phân phối", 2);
        }
    };

    const [giaNhap, setGiaNhap] = useState({});
    const [soLuong, setSoLuong] = useState({});

    const handleChangeGiaNhap = (event, spId) => {
        const { value } = event.target;
        if (value) {
            setGiaNhap((prevState) => ({
                ...prevState,
                [spId]: +value.replace(/[^0-9]/g, ""),
            }));
        } else {
            setGiaNhap((prevState) => ({
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

    const handleNhapHang = (sanPham) => {

        const { spId, kId, quyDoi, tenSp, dvt } = sanPham

        let price = 0;
        let qty = 0;
        // let exch = 0;

        if (soLuong[spId] !== undefined) {
            qty = soLuong[spId];
        } else {
            qty = 1;
        }

        if (giaNhap[spId] !== undefined) {
            price = giaNhap[spId];
        } else {
            price = sanPham.giaNhap;
        }
        let data = {
            pId: +phieuNhapActi,
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
                    recallListPhieuNhapMoiTao();
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
        <div>
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
                            placeholder="Chọn nhà phân phối"
                            onChange={handleChangeNpp}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {sortedListNpp?.map((item) => (
                                <Select.Option
                                    key={item.dtId}
                                    value={item.dtId}
                                    label={item.maDoiTac.toUpperCase()}
                                >
                                    {item.maDoiTac.toUpperCase()}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>

                    <button className="taoPhieuNhap" type="button" onClick={handleTaoPhieuNhap}>
                        Tạo phiếu nhập
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
                                                            giaNhap[spId] !== undefined
                                                                ? giaNhap[spId].toLocaleString()
                                                                : sanPham.giaNhap?.toLocaleString() || ''
                                                        }
                                                        onChange={(event) =>
                                                            handleChangeGiaNhap(event, spId)
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
                                                    <button type='button' onClick={() => handleNhapHang(sanPham)}>
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

export default FormNhapHang;
