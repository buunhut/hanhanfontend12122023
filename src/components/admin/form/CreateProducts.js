import React, { useEffect, useState } from "react";
import "./createproducts.scss";
import { callApi } from "../../../api/callApi";
import { useDispatch, useSelector } from "react-redux";
import { connectApi } from "../../../api/giaoTiepApi";
import {
    updateListDanhMuc,
    updateListThuongHieu,
} from "../../../redux/danhMucSlice";
import { Collapse, Popconfirm, message } from "antd";
import { URL, boDauTiengViet, capitalizeFirstLetter } from "../../../service/functions";
import JsBarcode from "jsbarcode";
import { useNavigate } from "react-router-dom";
import { useDrag, useDrop } from "react-dnd";
import ProductsList from "../ProductsList";
import { updateDmId, updateSanPhamByShop, updateThId } from "../../../redux/sanPhamSlice";
import { sanPhamApi } from "../../../api/sanPhamApi";
import { danhMucApi } from "../../../api/danhMucApi";
import { thuongHieuApi } from "../../../api/thuongHieuApi";
import { uploadApi } from "../../../api/uploadApi";
import ThuongHieu from "./ThuongHieu";

const CreateProducts = () => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };
    const dispath = useDispatch();
    const navigate = useNavigate();

    //tạo sản phẩm
    const [sanPham, setSanPham] = useState({
        maSp: "",
        tenSp: "",
        giaNhap: "",
        giaBan: "",
        giaGiam: "",
        dvt: "",
        quyDoi: "",
        chiTiet: "",
        cId: "",
        bId: "",
    });


    //tạo sản phẩm
    const handleTaoSanPham = async () => {
        // console.log("tạo sản phẩm")
        const data = {
            thId: +thId
        }
        console.log(data)
        //gọi api tạo sản phẩm
        const taoSanPham = await sanPhamApi.apiTaoSanPham(headers, data);
        // const { statusCode, content: kId } = taoMaKho.data;
        callTatCaSanPham()
    };

    // const [tatCaSanPham, setTatCaSanPham] = useState([]);
    const tatCaSanPham = useSelector((state) => state.sanPham.sanPhamByShop)

    // console.log(tatCaSanPham)

    //gọi danh sách sản phẩm
    const callTatCaSanPham = () => {
        if (timKiem !== '') {
            timKiemSanPham(timKiem)
        } else {
            sanPhamApi
                .apiGetSanPham(headers)
                .then((res) => {
                    // setTatCaSanPham(res.data.content);
                    dispath(updateSanPhamByShop(res.data.content))
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    useEffect(() => {
        callTatCaSanPham();
        callListDanhMuc();
        callListThuongHieu();
    }, []);

    //phần danh mục
    const { listDanhMuc } = useSelector((state) => state.danhMuc);
    // console.log(listDanhMuc)
    const [timKiem, setTimKiem] = useState("");
    //gọi danh sách danh mục
    const callListDanhMuc = async () => {
        const listDanhMuc = await danhMucApi.apiGetDanhMuc(headers);
        const { content } = listDanhMuc.data;
        //cập nhật lại danh mục
        // setListDanhMuc(listDanhMuc.data.content)
        dispath(updateListDanhMuc(content));
    };
    const [formDanhMuc, setFormDanhMuc] = useState(false);
    const handleFormDanhMuc = () => {
        setFormDanhMuc(true);
        document.getElementById("danhMuc").classList.remove("show");
    };
    const handleTaoDanhMuc = async () => {
        const taoDanhMuc = await danhMucApi.apiTaoDanhMuc(headers);
        const { statusCode } = taoDanhMuc.data;
        if (statusCode === 200) {
            //cập nhật lại danh mục
            callListDanhMuc();
        }
    };
    const [danhMuc, setDanhMuc] = useState({});
    const handleChangeDanhMucInput = async (event, danhMuc) => {
        const { value } = event.target;
        const { dmId } = danhMuc;
        setDanhMuc((prevState) => ({
            ...prevState,
            [dmId]: value,
        }));
        const data = {
            dmId,
            tenDanhMuc: value.trim(),
        };
        const updateDanhMuc = await danhMucApi.apiUpdateDanhMuc(headers, data);
        const { statusCode } = updateDanhMuc.data;
        setStatusCode(statusCode)

    };
    const handleChangeHinhDanhMuc = async (event, dmId) => {
        const file = event.target.files[0]; // Lấy tệp đầu tiên từ danh sách đã chọn
        if (file) {
            const formData = new FormData();
            formData.append("dmId", +dmId);
            formData.append("hinhAnh", file);
            const upHinhDanhMuc = await uploadApi.apiUpHinhDanhMuc(
                headers,
                formData
            );
            const { statusCode } = upHinhDanhMuc.data;
            if (statusCode === 200) {
                if (timKiem === "") {
                    callListDanhMuc();
                } else {
                    callTimKiemDanMuc(timKiem);
                }
            }
        }
    };
    const handleXoaHinhDanhMuc = async (dmId) => {
        const xoaHinhDanhMuc = await uploadApi.apiXoaHinhDanhMuc(headers, +dmId);
        const { statusCode } = xoaHinhDanhMuc.data;
        if (statusCode === 200) {
            if (timKiem === "") {
                callListDanhMuc();
            } else {
                callTimKiemDanMuc(timKiem);
            }
        }
    };
    const callTimKiemDanMuc = async (value) => {
        const timKiemDanhMuc = await danhMucApi.apiTimDanhMuc(headers, value);
        const { statusCode, content } = timKiemDanhMuc.data;
        dispath(updateListDanhMuc(content));
    };
    const handleTimKiemDanhMuc = async (event) => {
        const { value } = event.target;
        setTimKiem(value);
        if (value !== "") {
            callTimKiemDanMuc(value);
        } else {
            callListDanhMuc();
        }
    };
    const handleXoaDanhMuc = async (dmId) => {
        const xoaDanhMuc = await danhMucApi.apiDeleteDanhMuc(headers, +dmId);
        const { statusCode } = xoaDanhMuc.data;
        if (statusCode === 200) {
            if (timKiem === "") {
                callListDanhMuc();
            } else {
                callTimKiemDanMuc(timKiem);
            }
        }
    };
    //in mã vạch
    const handleInMaVach = (spId, maSp, tenSp) => {
        window.open(`/in-ma-vach/${spId}/${maSp}/${tenSp}`, "_blank");
    };

    //phần thương hiệu
    const { listThuongHieu } = useSelector((state) => state.danhMuc);
    // console.log(listThuongHieu)
    const callListThuongHieu = async () => {
        const listThuongHieu = await thuongHieuApi.apiGetThuongHieu(headers);
        const { content } = listThuongHieu.data;
        //cập nhật lại danh mục
        // setListDanhMuc(listDanhMuc.data.content)
        dispath(updateListThuongHieu(content));
    };
    const [formThuongHieu, setFormThuongHieu] = useState(false);
    const handleFormThuongHieu = () => {
        setFormThuongHieu(!formThuongHieu);
        document.getElementById("thuongHieu").classList.remove("show");
    };
    const handleTaoThuongHieu = async () => {
        const data = {
            dmId: +dmId[0],
            tenThuongHieu: ''
        }
        console.log(data)
        const taoThuongHieu = await thuongHieuApi.apiTaoThuongHieu(headers, data);
        const { statusCode } = taoThuongHieu.data;
        if (statusCode === 200) {
            //cập nhật lại thuong hiêu
            if (timKiem === "") {
                callListThuongHieu();
            } else {
                callTimKiemThuongHieu(timKiem);
            }
        }
    };
    const [thuongHieu, setThuongHieu] = useState({});
    const handleChangeThuongHieuInput = async (event, thuongHieu) => {
        const { value } = event.target;
        const { thId } = thuongHieu;
        setThuongHieu((prevState) => ({
            ...prevState,
            [thId]: value,
        }));
        const data = {
            thId,
            tenThuongHieu: value.trim(),
        };
        const updateThuongHieu = await thuongHieuApi.apiUpdateThuongHieu(
            headers,
            data
        );
        const { statusCode } = updateThuongHieu.data;
        setStatusCode(statusCode)
    };
    const handleChangeHinhThuongHieu = async (event, thId) => {
        const file = event.target.files[0]; // Lấy tệp đầu tiên từ danh sách đã chọn
        if (file) {
            const formData = new FormData();
            formData.append("thId", +thId);
            formData.append("hinhAnh", file);
            const upHinhThuongHieu = await uploadApi.apiUpHinhThuongHieu(
                headers,
                formData
            );
            const { statusCode } = upHinhThuongHieu.data;
            if (statusCode === 200) {
                if (timKiem === "") {
                    callListThuongHieu();
                } else {
                    callTimKiemThuongHieu(timKiem);
                }
            }
        }
    };
    const handleXoaHinhThuongHieu = async (thId) => {
        // console.log(thId);

        const xoaHinhThuongHieu = await uploadApi.apiXoaHinhThuongHieu(
            headers,
            +thId
        );
        const { statusCode } = xoaHinhThuongHieu.data;
        if (statusCode === 200) {
            if (timKiem === "") {
                callListThuongHieu();
            } else {
                callTimKiemThuongHieu(timKiem);
            }
        }
    };
    const callTimKiemThuongHieu = async (value) => {
        const timKiemThuongHieu = await thuongHieuApi.apiTimThuongHieu(
            headers,
            value
        );
        const { statusCode, content } = timKiemThuongHieu.data;
        dispath(updateListThuongHieu(content));
    };
    const handleTimKiemThuongHieu = async (event) => {
        const { value } = event.target;
        setTimKiem(value);
        if (value !== "") {
            callTimKiemThuongHieu(value);
        } else {
            callListThuongHieu();
        }
    };
    const handleXoaThuongHieu = async (thId) => {
        const xoaThuongHieu = await thuongHieuApi.apiDeleteThuongHieu(headers, +thId);
        const { statusCode } = xoaThuongHieu.data;
        if (statusCode === 200) {
            if (timKiem === "") {
                callListThuongHieu();
            } else {
                callTimKiemThuongHieu(timKiem);
            }
        }
    };
    const handleOverlay = () => {
        setFormDanhMuc(false);
        setFormThuongHieu(false);
        document.getElementById("danhMuc").classList.add("show");
        document.getElementById("thuongHieu").classList.add("show");
        callTatCaSanPham()
    };

    //thêm đơn vị tính
    const handleThemDonViTinh = async (kId) => {
        const taoDonViTinh = await sanPhamApi.apiTaoDvt(headers, kId);
        const { statusCode } = taoDonViTinh.data;
        if (statusCode === 200) {
            message.success("Đã thêm sản phẩm", 2);
            callTatCaSanPham();
        }
    };

    // const [dmId, setDmId] = useState({})
    const [maSp, setMaSp] = useState({});
    const [tenSp, setTenSp] = useState({});
    const [dvt, setDvt] = useState({});
    const [giaNhap, setGiaNhap] = useState({});
    const [giaBan, setGiaBan] = useState({});
    const [giaGiam, setGiaGiam] = useState({});
    const [quyDoi, setQuyDoi] = useState({});
    const [tonKho, setTonKho] = useState({});
    const [maxOrder, setMaxOrder] = useState({});
    const [phiVc, setPhiVc] = useState({});

    const [statusCode, setStatusCode] = useState(0);

    // console.log(statusCode)

    useEffect(() => {
        if (statusCode === 209) {
            message.warning("Lỗi trùng tên sản phẩm", 0); // Show warning without auto closing
        } else if (statusCode === 208) {
            message.warning("Lỗi trùng mã sản phẩm", 0); // Show warning without auto closing
        } else if (statusCode === 207) {
            message.warning("Lỗi trùng tên thương hiệu", 0); // Show warning without auto closing
        } else if (statusCode === 206) {
            message.warning("Lỗi trùng tên danh mục", 0); // Show warning without auto closing
        } else if (statusCode === 200) {
            message.destroy();
            callTatCaSanPham();
        }
    }, [statusCode]);



    // const handleUpHinhSanPham = async (event, sanPham) => {
    //     const { spId } = sanPham
    //     const file = event.target.files[0]; // Lấy tệp đầu tiên từ danh sách đã chọn
    //     if (file) {
    //         const formData = new FormData();
    //         formData.append("spId", +spId);
    //         formData.append("hinhAnh", file);
    //         const upHinhSanPham = await sanPhamApi.apiUpHinhSanPham(
    //             headers,
    //             formData
    //         );
    //         const { statusCode } = upHinhSanPham.data;
    //         // console.log(statusCode);
    //         if (statusCode === 200) {
    //             if (timKiem !== "") {
    //             } else {
    //                 callTatCaSanPham(timKiem);
    //             }
    //         }
    //     }
    // };

    // const handleXoaHinhSanPham = async (sanPham) => {
    //     const { spId } = sanPham
    //     const xoaHinhSanPham = await sanPhamApi.apiXoaHinhSanPham(headers, +spId);
    //     const { statusCode } = xoaHinhSanPham.data;
    //     if (statusCode === 200) {
    //         if (timKiem !== "") {
    //         } else {
    //             callTatCaSanPham();
    //         }
    //     }
    // };

    // const handleXoaSanPham = async (spId) => {
    //     const xoaSanPham = await sanPhamApi.apiDeleteSanPham(headers, +spId);
    //     const { statusCode } = xoaSanPham.data;
    //     if (statusCode === 200) {
    //         callTatCaSanPham();
    //     }
    // };

    // const handleOnOffSanPham = async (spId) => {
    //     console.log(spId)
    //     const tatMoSanPham = await sanPhamApi.apiUpdateSho(headers, +spId);
    //     const { statusCode } = tatMoSanPham.data;
    //     console.log(tatMoSanPham.data)
    //     if (statusCode === 200) {
    //         callTatCaSanPham();
    //     }
    // };


    const timKiemSanPham = async (timKiem) => {
        // const result = await connectApi.apiTimKiemSanPham(headers, timKiem.toLowerCase())
        // // setTatCaSanPham(result.data.content)
        // dispath(updateSanPhamByShop(res.data.content))

    }
    const handleTimKiemSanPham = async (event) => {
        let { value } = event.target;
        setTimKiem(value.toLowerCase())
        if (value !== '') {
            timKiemSanPham(value.toLowerCase())
        } else {
            callTatCaSanPham()
        }
    };

    //code sửa
    //cập nhật danh mục
    const handleChangeInput = async (event, sanPham) => {
        const { spId } = sanPham
        const { name, value } = event.target
        if (name === 'dmId') {
            const data = {
                spId,
                [name]: +value
            }
            const capNhat = await sanPhamApi.apiUpdateDanhMuc(headers, data);
            message.success('Đã cập nhật danh mục', 1)
        } else if (name === 'thId') {
            const data = {
                spId,
                [name]: +value
            }
            const capNhat = await sanPhamApi.apiUpdateThuongHieu(headers, data);
            message.success('Đã cập nhật thương hiệu', 1)

        } else if (name === 'maSp') {
            setMaSp((prevState) => ({
                ...prevState,
                [spId]: value
            }))
            const data = {
                spId,
                [name]: value.trim().toLocaleString()
            }
            const capNhat = await sanPhamApi.apiUpdateMaSp(headers, data);
            setStatusCode(capNhat.data.statusCode)

        } else if (name === 'tenSp') {
            setTenSp((prevState) => ({
                ...prevState,
                [spId]: value
            }))
            const data = {
                spId,
                [name]: value.trim().toLocaleString()
            }
            const capNhat = await sanPhamApi.apiUpdateTenSp(headers, data);
            setStatusCode(capNhat.data.statusCode)
        } else if (name === 'dvt') {
            setDvt((prevState) => ({
                ...prevState,
                [spId]: value
            }))
            const data = {
                spId,
                [name]: value.trim().toLocaleString()
            }
            const capNhat = await sanPhamApi.apiUpdateDvt(headers, data);
            setStatusCode(capNhat.data.statusCode)
        } else if (name === 'giaNhap') {
            setGiaNhap((prevState) => ({
                ...prevState,
                [spId]: +value.replace(/[^0-9]/g, ""),
            }))
            const data = {
                spId,
                [name]: +value.replace(/[^0-9]/g, ""),
            }
            const capNhat = await sanPhamApi.apiUpdateGiaNhap(headers, data);
            // setStatusCode(capNhat.data.statusCode)
        } else if (name === 'giaBan') {
            setGiaBan((prevState) => ({
                ...prevState,
                [spId]: +value.replace(/[^0-9]/g, ""),
            }))
            const data = {
                spId,
                [name]: +value.replace(/[^0-9]/g, ""),
            }
            const capNhat = await sanPhamApi.apiUpdateGiaBan(headers, data);
            // setStatusCode(capNhat.data.statusCode)
        } else if (name === 'giaGiam') {
            setGiaGiam((prevState) => ({
                ...prevState,
                [spId]: +value.replace(/[^0-9]/g, ""),
            }))
            const data = {
                spId,
                [name]: +value.replace(/[^0-9]/g, ""),
            }
            const capNhat = await sanPhamApi.apiUpdateGiaGiam(headers, data);
            // setStatusCode(capNhat.data.statusCode)
        } else if (name === 'phiVc') {
            setPhiVc((prevState) => ({
                ...prevState,
                [spId]: +value.replace(/[^0-9]/g, ""),
            }))
            const data = {
                spId,
                [name]: +value.replace(/[^0-9]/g, ""),
            }
            const capNhat = await sanPhamApi.apiUpdatePhiVc(headers, data);
        } else if (name === 'maxOrder') {
            setMaxOrder((prevState) => ({
                ...prevState,
                [spId]: +value.replace(/[^0-9]/g, ""),
            }))
            const data = {
                spId,
                [name]: +value.replace(/[^0-9]/g, ""),
            }
            const capNhat = await sanPhamApi.apiUpdateMaxOrder(headers, data);
        } else if (name === 'quyDoi') {
            setQuyDoi((prevState) => ({
                ...prevState,
                [spId]: +value.replace(/[^0-9]/g, ""),
            }))
            const data = {
                spId,
                [name]: +value.replace(/[^0-9]/g, ""),
            }
            const capNhat = await sanPhamApi.apiUpdateQuyDoi(headers, data);
        }
    };



    const listSanPham = tatCaSanPham
        .reduce((acc, sp) => {
            const existingItem = acc.find((item) => item.kId === sp.kId);

            if (existingItem) {
                existingItem.sanPhamCungKId.push({ ...sp });
            } else {
                acc.push({
                    kId: sp.kId,
                    soLuong: sp.soLuong,
                    sanPhamCungKId: [{ ...sp }],
                });
            }
            return acc;
        }, [])
        .map((item) => {
            const { kId, soLuong, sanPhamCungKId } = item;
            const sortedSanPham = sanPhamCungKId.sort((a, b) => b.quyDoi - a.quyDoi);

            let remainingSoLuong = soLuong;

            const updatedSanPhamCungKId = sortedSanPham.map((sp) => {
                const { quyDoi } = sp;
                const tonKho = Math.floor(remainingSoLuong / quyDoi);
                remainingSoLuong %= quyDoi;
                return { ...sp, tonKho };
            });
            return updatedSanPhamCungKId;
        })
        .flat();


    const items = listSanPham?.map((item) => {
        // console.log(item)
        return {
            key: item.dmId,
            label: (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <div>
                        <b>{item.tenDanhMuc}</b>
                    </div>
                </div>
            ),
            children: <ThuongHieu thuongHieu={item.thuongHieu} />,
        };
    });

    // const [dmId, setDmId] = useState(0);
    const { dmId } = useSelector((state) => state.sanPham)
    const { thId } = useSelector((state) => state.sanPham)

    const onChange = (key) => {
        // console.log(key)
        if (key.length > 0) {
            dispath(updateDmId(key))

        } else {
            dispath(updateDmId(0))
            dispath(updateThId(0))

        }
    };

    const taoSanPhamMoi = () => {
        if (dmId === 0) {
            //code tạo  mới danh mục
            console.log('tạo mới danh mục')
        } else {
            //code tạo mới thương hiệu
            console.log('tạo mới thương hiệu trong dmId', dmId)
        }
    }
    return (
        <div>

            {
                dmId !== 0 && thId !== 0 ? (
                    <button style={{ width: "160px" }} onClick={() => handleTaoSanPham()}>
                        Tạo sản phẩm
                    </button>
                ) : dmId !== 0 && thId === 0 ? (
                    <button style={{ width: "160px" }} onClick={() => handleFormThuongHieu()}>
                        Thương hiệu
                    </button>
                ) : (
                    <button style={{ width: "160px" }} onClick={() => handleFormDanhMuc()}>
                        Danh mục
                    </button>
                )
            }
            <Collapse items={items} onChange={onChange} accordion />
            <div
                className="overlay"
                style={{ display: formDanhMuc || formThuongHieu ? "block" : "none" }}
                onClick={handleOverlay}
            ></div>

            <div id="danhMuc" className="show">
                <div className="groupFlex">
                    <h3>Tất cả danh mục</h3>
                    <button type="button" onClick={handleTaoDanhMuc}>
                        <i className="fa-solid fa-plus"></i>
                    </button>
                </div>

                <div className="inputItem">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        placeholder="Tìm kiếm danh mục"
                        value={timKiem}
                        onChange={handleTimKiemDanhMuc}
                    />
                </div>

                {listDanhMuc.length > 0 ? (
                    <table className="danhMuc">
                        <thead>
                            <tr>
                                <td className="stt">STT</td>
                                <td className="hinhAnh">HÌNH</td>
                                <td>TÊN DANH MỤC</td>
                                <td className="thaoTac">XOÁ</td>
                            </tr>
                        </thead>
                        <tbody>
                            {listDanhMuc.map((item, index) => {
                                const { dmId, tenDanhMuc, hinhAnh } = item;
                                // console.log(hinhAnh)
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="hinhAnh">
                                                {hinhAnh === null ? (
                                                    <div id="upload">
                                                        <label className="custom-file-upload">
                                                            <input
                                                                type="file"
                                                                accept="image/jpeg, image/png, image/gif"
                                                                onChange={(event) =>
                                                                    handleChangeHinhDanhMuc(event, dmId)
                                                                }
                                                            />
                                                            <i className="fa-regular fa-image"></i>
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <img src={`${URL}/${hinhAnh}`} alt="" />
                                                        <Popconfirm
                                                            title="Sửa hình danh mục"
                                                            description="Bạn có muốn sửa hình danh mục không?"
                                                            onConfirm={() => handleXoaHinhDanhMuc(dmId)}
                                                            // onCancel={cancel}
                                                            placement="right"
                                                            okText="Có"
                                                            cancelText="Không"
                                                        >
                                                            {/* <i className="fa-regular fa-trash-can delete"></i> */}
                                                            <i className="fa-regular fa-pen-to-square delete"></i>
                                                        </Popconfirm>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="inputItem">
                                                <input
                                                    type="text"
                                                    value={
                                                        danhMuc[dmId] !== undefined
                                                            ? danhMuc[dmId].toUpperCase()
                                                            : tenDanhMuc === null
                                                                ? ""
                                                                : tenDanhMuc.toUpperCase()
                                                    }
                                                    onChange={(event) =>
                                                        handleChangeDanhMucInput(event, item)
                                                    }
                                                />
                                            </div>
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <Popconfirm
                                                title="Xoá danh mục"
                                                description="Bạn có muốn xoá danh mục không?"
                                                onConfirm={() => handleXoaDanhMuc(dmId)}
                                                // onCancel={cancel}
                                                placement="left"
                                                okText="Có"
                                                cancelText="Không"
                                            >
                                                <i className="fa-regular fa-trash-can"></i>
                                            </Popconfirm>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <h4>Không có dữ liệu</h4>
                )}
            </div>

            <div id="thuongHieu" className="show">
                <div className="groupFlex">
                    <h3>Tất cả thương hiệu</h3>
                    <button type="button" onClick={handleTaoThuongHieu}>
                        <i className="fa-solid fa-plus"></i>
                    </button>
                </div>

                <div className="inputItem">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        placeholder="Tìm kiếm thương hiệu"
                        value={timKiem}
                        onChange={handleTimKiemThuongHieu}
                    />
                </div>

                {listThuongHieu.length > 0 ? (
                    <table className="danhMuc">
                        <thead>
                            <tr>
                                <td className="stt">STT</td>
                                <td className="hinhAnh">HÌNH</td>
                                <td>TÊN THƯƠNG HIỆU</td>
                                <td className="thaoTac">XOÁ</td>
                            </tr>
                        </thead>
                        <tbody>
                            {listThuongHieu.map((item, index) => {
                                const { thId, tenThuongHieu, hinhAnh } = item;
                                // console.log(hinhAnh)
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="hinhAnh">
                                                {hinhAnh === null ? (
                                                    <div id="upload">
                                                        <label className="custom-file-upload">
                                                            <input
                                                                type="file"
                                                                accept="image/jpeg, image/png, image/gif"
                                                                onChange={(event) =>
                                                                    handleChangeHinhThuongHieu(event, thId)
                                                                }
                                                            />
                                                            <i className="fa-regular fa-image"></i>
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <img src={`${URL}/${hinhAnh}`} alt="" />
                                                        <Popconfirm
                                                            title="Sửa hình thương hiệu"
                                                            description="Bạn có muốn sửa hình thương hiệu không?"
                                                            onConfirm={() => handleXoaHinhThuongHieu(thId)}
                                                            // onCancel={cancel}
                                                            placement="right"
                                                            okText="Có"
                                                            cancelText="Không"
                                                        >
                                                            {/* <i className="fa-regular fa-trash-can delete"></i> */}
                                                            <i className="fa-regular fa-pen-to-square delete"></i>
                                                        </Popconfirm>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="inputItem">
                                                <input
                                                    type="text"
                                                    value={
                                                        thuongHieu[thId] !== undefined
                                                            ? thuongHieu[thId].toUpperCase()
                                                            : tenThuongHieu === null
                                                                ? ""
                                                                : tenThuongHieu.toUpperCase()
                                                    }
                                                    onChange={(event) =>
                                                        handleChangeThuongHieuInput(event, item)
                                                    }
                                                />
                                            </div>

                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <Popconfirm
                                                title="Xoá thương hiệu"
                                                description="Bạn có muốn xoá thương hiệu không?"
                                                onConfirm={() => handleXoaThuongHieu(thId)}
                                                // onCancel={cancel}
                                                placement="left"
                                                okText="Có"
                                                cancelText="Không"
                                            >
                                                <i className="fa-regular fa-trash-can"></i>
                                            </Popconfirm>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <h4>Không có dữ liệu</h4>
                )}
            </div>
        </div >
    );
};

export default CreateProducts;
