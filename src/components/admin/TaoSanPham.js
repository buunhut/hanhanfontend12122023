import React, { useEffect, useState } from "react";
import "./taosanpham.scss";

import { Popconfirm, Tabs, Upload, message } from "antd";
import FormTaoSanPham from "./form/FormTaoSanPham";
import FormTaoDanhMuc from "./form/FormTaoDanhMuc";
import FormTaoThuongHieu from "./form/FormTaoThuongHieu";
import FormTaoDvt from "./form/FormTaoDvt";
import { updateDanhMuc } from "../../redux/danhMucSlice";
import { callApi } from "../../api/callApi";
import { useDispatch, useSelector } from "react-redux";
import { updateSanPhamByShop } from "../../redux/sanPhamSlice";
import { URL, capitalizeFirstLetter } from "../../service/functions";
import ImgCrop from "antd-img-crop";

const TaoSanPham = () => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };

    const dispath = useDispatch();
    //chạy kiểu component didmount
    useEffect(() => {
        callApi
            .apiGetDanhMuc(headers)
            .then((res) => {
                dispath(updateDanhMuc(res.data.content));
            })
            .catch((err) => {
                console.log(err);
            });
        callApi.apiGetSanPhamByShop(headers).then((res) => {
            if (res.data.content.length > 0) {
                dispath(updateSanPhamByShop(res.data.content));
            }
        });
    }, []);

    let { sanPhamByShop } = useSelector((state) => state.sanPham);
    // console.log(sanPhamByShop)

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(!open);
    };
    const items = [
        {
            key: "1",
            label: "Danh mục",
            children: <FormTaoDanhMuc />,
        },
        {
            key: "2",
            label: "Thương hiệu",
            children: <FormTaoThuongHieu />,
        },
        {
            key: "3",
            label: "Sản phẩm",
            children: <FormTaoSanPham />,
        },
        {
            key: "4",
            label: "Đơn vị tính",
            children: <FormTaoDvt />,
        },
    ];
    const onChange = (key) => { };

    const [cId, setCId] = useState(null);
    const [bId, setBId] = useState(null);
    const [pId, setPId] = useState(null);
    const [tenSp, setTenSp] = useState({});
    const [maPk, setMaPk] = useState({});
    const [tenPk, setTenPk] = useState({});
    const [dvt, setDvt] = useState({});
    const [quyDoi, setQuyDoi] = useState({});
    const [giaNhap, setGiaNhap] = useState({});
    const [giaBan, setGiaBan] = useState({});
    const [giaGiam, setGiaGiam] = useState({});
    const [phiVc, setPhiVc] = useState({});

    //gọi lại sản phẩm dùng chung
    const recallProductsByShop = () => {
        //cập nhật sản phẩm
        if (keyword !== "") {
            callApi
                .apiSearchSanPhamByShop(headers, keyword)
                .then((res) => {
                    dispath(updateSanPhamByShop(res.data.content));
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            //mình cập nhật lại sản sanPhamByShop tại đây
            callApi.apiGetSanPhamByShop(headers).then((res) => {
                dispath(updateSanPhamByShop(res.data.content));
            });
        }
    };

    //change input tên sản phẩm
    const handleChangeInputTenSp = (event, item) => {
        let { name, value } = event.target;
        setCId(item.cId);
        setBId(item.bId);
        setPId(item.pId);
        if (name === 'tenSp') {
            setTenSp({
                [name]: value,
            });
        } else if (name === 'dvt') {
            setDvt({
                [name]: value,
            });
        }
    };

    //blur input tên sản phẩm
    const handleBlurInputTenSp = () => {
        if (pId > 0) {
            let tenSanPham = "";
            for (let key in tenSp) {
                tenSanPham = tenSp[key];
            }
            const editTenSp = {
                cId,
                bId,
                pId,
                tenSp: tenSanPham,
            };
            if (tenSanPham !== "") {
                callApi
                    .apiUpdateTenSanPham(headers, editTenSp)
                    .then((res) => {
                        const { statusCode } = res.data;
                        if (statusCode === 209) {
                            message.warning("Trùng tên sản phẩm", 1);
                        } else if (statusCode === 200) {
                            setTenSp({});

                            // callApi.apiGetSanPhamByShop(headers).then((res) => {
                            //     if (res.data.content.length > 0) {
                            //         dispath(updateSanPhamByShop(res.data.content));
                            //     }
                            // });
                            recallProductsByShop();
                            message.success("Đã cập nhật tên sản phẩm", 3);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                message.warning("Tên sản phẩm không được bỏ trống", 1);
            }
        }
    };

    //phần cập nhật packages
    const [editPackages, setEditPackages] = useState({});
    // console.log(editPackages)
    const handleChangeInputPackages = (event, pack) => {
        const { name, value } = event.target;
        const { pId, pkId } = pack;

        console.log(value)

        setEditPackages((prevState) => ({
            ...prevState,
            pId,
            pkId,
        }));
        if (name === "maPk") {
            setMaPk({ [pkId]: capitalizeFirstLetter(value) });
            setEditPackages((prevState) => ({
                ...prevState,
                maPk: value,
                tenPk: pack.tenPk,
                dvt: pack.dvt,
                quyDoi: pack.quyDoi,
                giaNhap: pack.giaNhap,
                giaBan: pack.giaBan,
                giaGiam: pack.giaGiam,
                phiVc: pack.phiVc,
            }));
        } else if (name === "tenPk") {
            setTenPk({ [pkId]: capitalizeFirstLetter(value) });
            setEditPackages((prevState) => ({
                ...prevState,
                maPk: pack.maPk,
                tenPk: value,
                dvt: pack.dvt,
                quyDoi: pack.quyDoi,
                giaNhap: pack.giaNhap,
                giaBan: pack.giaBan,
                giaGiam: pack.giaGiam,
                phiVc: pack.phiVc,
            }));
        } else if (name === "dvt") {
            setDvt({ [pkId]: capitalizeFirstLetter(value) });
            setEditPackages((prevState) => ({
                ...prevState,
                maPk: pack.maPk,
                tenPk: pack.tenPk,
                dvt: value,
                quyDoi: pack.quyDoi,
                giaNhap: pack.giaNhap,
                giaBan: pack.giaBan,
                giaGiam: pack.giaGiam,
                phiVc: pack.phiVc,
            }));
        } else if (name === "quyDoi") {
            setQuyDoi({ [pkId]: +value.replace(/[^0-9]/g, "").toLocaleString() });
            setEditPackages((prevState) => ({
                ...prevState,
                maPk: pack.maPk,
                tenPk: pack.tenPk,
                dvt: pack.dvt,
                quyDoi: +value.replace(/[^0-9]/g, ""),
                giaNhap: pack.giaNhap,
                giaBan: pack.giaBan,
                giaGiam: pack.giaGiam,
                phiVc: pack.phiVc,

            }));
        } else if (name === "giaNhap") {
            setGiaNhap({ [pkId]: +value.replace(/[^0-9]/g, "").toLocaleString() });
            setEditPackages((prevState) => ({
                ...prevState,
                maPk: pack.maPk,
                tenPk: pack.tenPk,
                dvt: pack.dvt,
                quyDoi: pack.quyDoi,
                giaNhap: +value.replace(/[^0-9]/g, ""),
                giaBan: pack.giaBan,
                giaGiam: pack.giaGiam,
                phiVc: pack.phiVc,

            }));
        } else if (name === "giaBan") {
            setGiaBan({ [pkId]: +value.replace(/[^0-9]/g, "").toLocaleString() });
            setEditPackages((prevState) => ({
                ...prevState,
                maPk: pack.maPk,
                tenPk: pack.tenPk,
                dvt: pack.dvt,
                quyDoi: pack.quyDoi,
                giaNhap: pack.giaNhap,
                giaBan: +value.replace(/[^0-9]/g, ""),
                giaGiam: pack.giaGiam,
                phiVc: pack.phiVc,

            }));
        } else if (name === "giaGiam") {
            setGiaGiam({ [pkId]: +value.replace(/[^0-9]/g, "").toLocaleString() });
            setEditPackages((prevState) => ({
                ...prevState,
                maPk: pack.maPk,
                tenPk: pack.tenPk,
                dvt: pack.dvt,
                quyDoi: pack.quyDoi,
                giaNhap: pack.giaNhap,
                giaBan: pack.giaBan,
                giaGiam: +value.replace(/[^0-9]/g, ""),
                phiVc: pack.phiVc,

            }));
        } else if (name === "phiVc") {
            setPhiVc({ [pkId]: +value.replace(/[^0-9]/g, "").toLocaleString() });
            setEditPackages((prevState) => ({
                ...prevState,
                maPk: pack.maPk,
                tenPk: pack.tenPk,
                dvt: pack.dvt,
                quyDoi: pack.quyDoi,
                giaNhap: pack.giaNhap,
                giaBan: pack.giaBan,
                giaGiam: pack.giaBan,
                phiVc: +value.replace(/[^0-9]/g, ""),

            }));
        }
    };

    const handleBlurInputPackages = (event) => {
        const { name } = event.target;
        if (editPackages.pkId !== undefined) {
            callApi
                .apiUpdatePackages(headers, editPackages)
                .then((res) => {
                    const { statusCode } = res.data;
                    if (statusCode == 209) {
                        message.warning("Trùng tên đơn vị tính", 1);
                    } else if (statusCode === 200) {
                        if (name === "dvt") {
                            message.success("Đã cập nhật đơn vị tính");
                        } else if (name === "quyDoi") {
                            message.success("Đã cập nhật đóng gói");
                        } else if (name === "giaNhap") {
                            message.success("Đã cập nhật giá nhập");
                        } else if (name === "giaBan") {
                            message.success("Đã cập nhật giá bán");
                        } else if (name === "giaGiam") {
                            message.success("Đã cập nhật giá giảm");
                        } else if (name === "phiVc") {
                            message.success("Đã cập nhật phí vận chuyển");
                        }
                        //cập nhật lại sản phẩm
                        recallProductsByShop();
                    } else {
                        message.error("lỗi cập nhật");
                    }
                    setMaPk({});
                    setTenPk({});
                    setDvt({});
                    setQuyDoi({});
                    setGiaNhap({});
                    setGiaBan({});
                    setGiaGiam({});
                    setPhiVc({});
                    setEditPackages({});
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };
    //phần xoá packages
    const handleXoaPackages = (item) => {
        const { pkId } = item;
        const data = {
            pkId: +pkId,
        };
        callApi.apiDeletePackages(headers, data).then((res) => {
            const { statusCode } = res.data;
            if (statusCode === 200) {
                message.success("Đã xoá đơn vị tính", 1);
                //cập nhật sản phẩm
                recallProductsByShop();
            } else {
                message.error("Xoá đơn vị tính thất bại");
            }
        });
    };

    //phần tạo packages
    const handleTaoPackages = (pId) => {
        const data = {
            pId,
            maPk: '',
            tenPk: '',
            dvt: "",
            quyDoi: 0,
            giaNhap: 0,
            giaBan: 0,
            giaGiam: 0,
        };
        console.log(data)
        callApi
            .apiTaoDonViTinh(headers, data)
            .then((res) => {
                const { statusCode } = res.data;
                if (statusCode === 200) {
                    //cập nhật sản phẩm
                    recallProductsByShop();
                    message.success("Đã tạo đơn vị tính mới", 1);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    //img
    const handleChangeInputImg = (event, pkId) => {
        const file = event.target.files[0]; // Lấy tệp đầu tiên từ danh sách đã chọn
        if (file) {
            const formData = new FormData();
            formData.append("pkId", +pkId);
            formData.append("hinhAnh", file);
            callApi
                .apiUpHinhDvt(headers, formData)
                .then((res) => {
                    const { statusCode } = res.data;
                    if (statusCode === 200) {
                        recallProductsByShop();
                        message.success("Đã up hình đơn vị tính", 1);
                    } else {
                        message.error("Đã up hình đơn vị tính", 1);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    //xoá hình đvt
    const handleXoaHinhDvt = (pkId) => {
        const data = {
            pkId,
        };
        callApi.apiDeletePhotoPacages(headers, data).then((res) => {
            const { statusCode } = res.data;
            if (statusCode === 200) {
                recallProductsByShop();
                message.success("Đã xoá hình đơn vị tính", 1);
            } else {
                message.error("Lỗi xoá hình đơn vị tính", 1);
            }
        });
    };

    //xoá sản phẩm
    const handleXoaSanPham = (pId) => {
        const data = { pId };
        callApi
            .apiDeleteProduct(headers, data)
            .then((res) => {
                const { statusCode } = res.data;
                if (statusCode === 200) {
                    recallProductsByShop();
                    message.success("Đã xoá sản phẩm");
                } else {
                    message.error("Lỗi xoá sản phẩm");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    //tìm kiếm sản phẩm
    const [keyword, setKeyword] = useState("");
    const searchSanPhamByShop = (event) => {
        setKeyword(event.target.value);
        recallProductsByShop();
    };

    const handleAnHienDvt = (pack) => {
        const { pkId, sho } = pack
        callApi.apiUpdateAnHienPackages(headers, pkId).then((res) => {
            const { statusCode } = res.data
            if (statusCode === 200) {
                recallProductsByShop()
                if (sho === true) {
                    message.warning('Đã ẩn đơn vị tính', 1)
                } else {
                    message.success('Đã hiện đơn vị tính', 1)
                }
            } else {
                message.error('Lỗi tắt đơn vị tính', 1)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <div>
            <div className="sanPhamTitle">
                <button type="button" onClick={handleOpen}>
                    <i className="fa-solid fa-plus"></i>
                </button>
                <h2>Danh sách sản phẩm</h2>
            </div>
            <div className="inputItem">
                <i className="fa-solid fa-magnifying-glass"></i>

                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm"
                    value={keyword}
                    onChange={searchSanPhamByShop}
                />
            </div>

            {sanPhamByShop.length > 0 ? (
                <>
                    <div id="tableSanPham">
                        <table>
                            <thead>
                                <tr>
                                    <th>Kho</th>
                                    <th className="maSp">Mã sản phẩm</th>
                                    <th className="tenSp">Tên sản phẩm</th>
                                    <th className="right dvt">Đơn vị tính</th>
                                    <th className="right dongGoi">Đóng gói</th>
                                    <th className="right">Giá nhập</th>
                                    <th className="right">Giá bán</th>
                                    <th className="right">Giá giảm</th>
                                    <th className="right">Phí VC</th>
                                    <th className="right">Tồn kho</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            {sanPhamByShop.map((item) => (
                                <tbody key={item.sanPham.pId}>
                                    <tr key={item.sanPham.pId}>
                                        <td colSpan={10}>
                                            <div className="inputItem" >
                                                <input
                                                    style={{ color: 'royalblue' }}
                                                    type="text"
                                                    name={item.sanPham.pId}
                                                    className="tenSp"
                                                    value={
                                                        tenSp[item.sanPham.pId] !== undefined
                                                            ? tenSp[item.sanPham.pId.toUpperCase()]
                                                            : item.sanPham.tenSp.toUpperCase()
                                                    }
                                                    onChange={(event) =>
                                                        handleChangeInputTenSp(event, item.sanPham)
                                                    }
                                                    onBlur={handleBlurInputTenSp}
                                                    readOnly
                                                />
                                            </div>
                                        </td>
                                        {/* <td lassName="right dvt">
                                            <div className="inputItem">
                                                <input
                                                    type="text"
                                                    name=""
                                                    className="dvt"
                                                    value={
                                                        dvt[item.sanPham.pId] !== undefined
                                                            ? dvt[item.sanPham.pId]
                                                            : capitalizeFirstLetter(item.sanPham.dvt)
                                                    }
                                                    onChange={(event) =>
                                                        handleChangeInputTenSp(event, item.sanPham)
                                                    }
                                                    onBlur={handleBlurInputTenSp}
                                                />
                                            </div>
                                        </td> */}


                                        {/* <td className="right tonKho">
                                            <div className="inputItem">
                                                <input
                                                    type="text"
                                                    name=""
                                                    className=""
                                                    value={item.sanPham.tonKho.toLocaleString()}
                                                    disabled
                                                />
                                            </div>
                                        </td> */}
                                        <td className="center">
                                            <Popconfirm
                                                title="Tạo đơn vị tính"
                                                description="Bạn có muốn tạo đơn vị tính?"
                                                onConfirm={() => handleTaoPackages(item.sanPham.pId)}
                                                // onCancel={cancel}
                                                placement="left"
                                                okText="Có"
                                                cancelText="Không"
                                            >
                                                <button type="button" className="add">
                                                    <i
                                                        className="fa-solid fa-plus"
                                                    // onClick={() => handleTaoPackages(item.sanPham.pId)}
                                                    ></i>
                                                </button>
                                            </Popconfirm>
                                            {item.packages.length === 0 ? (
                                                <Popconfirm
                                                    title="Xoá sản phẩm"
                                                    description="Bạn có muốn sản phẩm?"
                                                    onConfirm={() => handleXoaSanPham(item.sanPham.pId)}
                                                    // onCancel={cancel}
                                                    placement="left"
                                                    okText="Có"
                                                    cancelText="Không"
                                                >
                                                    <button type="button" className="delete">
                                                        <i className="fa-regular fa-trash-can"></i>
                                                    </button>
                                                </Popconfirm>
                                            ) : null}
                                        </td>
                                    </tr>
                                    {item.packages
                                        .map((pack, index) => (
                                            <tr key={index} className="packages">
                                                <td>
                                                    <div className="hinhAnh">
                                                        {pack.hinhAnh === "" ? (
                                                            <div id="upload">
                                                                <label className="custom-file-upload">
                                                                    <input
                                                                        type="file"
                                                                        accept="image/jpeg, image/png, image/gif"
                                                                        onChange={(event) =>
                                                                            handleChangeInputImg(event, pack.pkId)
                                                                        }
                                                                    />
                                                                    <i className="fa-regular fa-image"></i>
                                                                </label>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <img src={`${URL}/${pack.hinhAnh}`} alt="" />

                                                                <Popconfirm
                                                                    title="Đổi hình đơn vị tính"
                                                                    description="Bạn có muốn thay đổi hình đơn vị tính?"
                                                                    onConfirm={() => handleXoaHinhDvt(pack.pkId)}
                                                                    // onCancel={cancel}
                                                                    placement="right"
                                                                    okText="Có"
                                                                    cancelText="Không"
                                                                >
                                                                    <i className="fa-regular fa-trash-can delete"></i>
                                                                </Popconfirm>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="right">
                                                    <div className="inputItem">
                                                        <input
                                                            type="text"
                                                            name="maPk"
                                                            className="maPk"
                                                            // defaultValue={capitalizeFirstLetter(pack.dvt)}
                                                            value={
                                                                maPk[pack.pkId] !== undefined
                                                                    ? capitalizeFirstLetter(maPk[pack.pkId])
                                                                    : capitalizeFirstLetter(pack.maPk)
                                                            }
                                                            onChange={(event) =>
                                                                handleChangeInputPackages(event, pack)
                                                            }
                                                            onBlur={handleBlurInputPackages}
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="inputItem">
                                                        <input
                                                            type="text"
                                                            name="tenPk"
                                                            className="tenSp"
                                                            // defaultValue={capitalizeFirstLetter(pack.dvt)}
                                                            value={
                                                                tenPk[pack.pkId] !== undefined
                                                                    ? capitalizeFirstLetter(tenPk[pack.pkId])
                                                                    : capitalizeFirstLetter(pack.tenPk)
                                                            }
                                                            onChange={(event) =>
                                                                handleChangeInputPackages(event, pack)
                                                            }
                                                            onBlur={handleBlurInputPackages}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="right">
                                                    <div className="inputItem">
                                                        <input
                                                            type="text"
                                                            name="dvt"
                                                            className="dvt"
                                                            // defaultValue={capitalizeFirstLetter(pack.dvt)}
                                                            value={
                                                                dvt[pack.pkId] !== undefined
                                                                    ? capitalizeFirstLetter(dvt[pack.pkId])
                                                                    : capitalizeFirstLetter(pack.dvt)
                                                            }
                                                            onChange={(event) =>
                                                                handleChangeInputPackages(event, pack)
                                                            }
                                                            onBlur={handleBlurInputPackages}
                                                        />
                                                    </div>
                                                </td>



                                                <td className="right">
                                                    <div className="inputItem">
                                                        <input
                                                            type="text"
                                                            name="quyDoi"
                                                            className="quyDoi"
                                                            value={
                                                                quyDoi[pack.pkId] !== undefined
                                                                    ? quyDoi[pack.pkId] === 0
                                                                        ? ""
                                                                        : quyDoi[pack.pkId].toLocaleString()
                                                                    : pack.quyDoi.toLocaleString()
                                                            }
                                                            onChange={(event) =>
                                                                handleChangeInputPackages(event, pack)
                                                            }
                                                            onBlur={handleBlurInputPackages}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="right">
                                                    <div className="inputItem">
                                                        <input
                                                            type="text"
                                                            name="giaNhap"
                                                            className="giaNhap"
                                                            // defaultValue={pack.giaNhap.toLocaleString()}
                                                            value={
                                                                giaNhap[pack.pkId] !== undefined
                                                                    ? giaNhap[pack.pkId] === 0
                                                                        ? ""
                                                                        : giaNhap[pack.pkId].toLocaleString()
                                                                    : pack.giaNhap.toLocaleString()
                                                            }
                                                            onChange={(event) =>
                                                                handleChangeInputPackages(event, pack)
                                                            }
                                                            onBlur={handleBlurInputPackages}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="right">
                                                    <div className="inputItem">
                                                        <input
                                                            type="text"
                                                            name="giaBan"
                                                            className="giaBan"
                                                            // defaultValue={pack.giaBan.toLocaleString()}
                                                            style={
                                                                giaBan[pack.pkId] !== undefined ?
                                                                    giaBan[pack.pkId] < pack.giaNhap ? { color: 'red' } : {}
                                                                    : pack.giaBan < pack.giaNhap ? { color: 'red' } : {}}

                                                            value={
                                                                giaBan[pack.pkId] !== undefined
                                                                    ? giaBan[pack.pkId] === 0
                                                                        ? ""
                                                                        : giaBan[pack.pkId].toLocaleString()
                                                                    : pack.giaBan.toLocaleString()
                                                            }
                                                            onChange={(event) =>
                                                                handleChangeInputPackages(event, pack)
                                                            }
                                                            onBlur={handleBlurInputPackages}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="right">
                                                    <div className="inputItem">
                                                        <input
                                                            type="text"
                                                            name="giaGiam"
                                                            className="giaGiam"
                                                            // defaultValue={pack.giaGiam.toLocaleString()}
                                                            style={
                                                                giaGiam[pack.pkId] !== undefined ?
                                                                    giaGiam[pack.pkId] < pack.giaNhap ? { color: 'red' } : {}
                                                                    : pack.giaGiam < pack.giaNhap ? { color: 'red' } : {}}
                                                            value={
                                                                giaGiam[pack.pkId] !== undefined
                                                                    ? giaGiam[pack.pkId] === 0
                                                                        ? ""
                                                                        : giaGiam[pack.pkId].toLocaleString()
                                                                    : pack.giaGiam.toLocaleString()
                                                            }
                                                            onChange={(event) =>
                                                                handleChangeInputPackages(event, pack)
                                                            }
                                                            onBlur={handleBlurInputPackages}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="right">
                                                    <div className="inputItem">
                                                        <input
                                                            type="text"
                                                            name="phiVc"
                                                            className="giaGiam"
                                                            // defaultValue={pack.giaGiam.toLocaleString()}

                                                            value={
                                                                phiVc[pack.pkId] !== undefined
                                                                    ? phiVc[pack.pkId] === 0
                                                                        ? ""
                                                                        : phiVc[pack.pkId].toLocaleString()
                                                                    : pack.phiVc.toLocaleString()
                                                            }
                                                            onChange={(event) =>
                                                                handleChangeInputPackages(event, pack)
                                                            }
                                                            onBlur={handleBlurInputPackages}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="right">
                                                    <div className="inputItem">
                                                        <input
                                                            type="text"
                                                            className=""
                                                            //có sử dụng pack.soLuong tại đây
                                                            // defaultValue={pack.soLuong.toLocaleString()}
                                                            value={pack.soLuong.toLocaleString()}
                                                            disabled
                                                        />
                                                    </div>
                                                </td>
                                                <td className="center">
                                                    {
                                                        pack.sho ? <i className="fa-regular fa-eye-slash delete"
                                                            onClick={() => handleAnHienDvt(pack)}
                                                        ></i>
                                                            : <i className="fa-regular fa-eye delete"
                                                                onClick={() => handleAnHienDvt(pack)}
                                                            ></i>
                                                    }
                                                    <Popconfirm
                                                        title="Xoá đơn vị tính"
                                                        description="Bạn có muốn xoá đơn vị tính?"
                                                        onConfirm={() => handleXoaPackages(pack)}
                                                        // onCancel={cancel}
                                                        placement="left"
                                                        okText="Có"
                                                        cancelText="Không"
                                                    >
                                                        <i className="fa-regular fa-trash-can delete"></i>
                                                    </Popconfirm>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            ))}
                        </table>
                    </div>
                </>
            ) :
                <>

                </>
            }

            <div className={open ? "overlay" : ""}></div>
            <div id="taoSanPham" className={open ? "show" : ""}>
                <h3>Tạo mới</h3>
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                    type="card"
                    onChange={onChange}
                />
                <i className="fa-solid fa-xmark close" onClick={handleOpen}></i>
            </div>
        </div>
    );
};

export default TaoSanPham;
