import { Popconfirm, message } from "antd";
import React, { useEffect, useState } from "react";
import './sanpham.scss'
import { URL } from "../../../service/functions";
import { sanPhamApi } from "../../../api/sanPhamApi";
import { useDispatch, useSelector } from "react-redux";
import { connectApi } from "../../../api/giaoTiepApi";
import { updateSanPhamByShop } from "../../../redux/sanPhamSlice";

const SanPham = ({ sanPham }) => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };
    const dispath = useDispatch();

    const [tatCaSanPham, setTatCaSanPham] = useState([]);




    const listSanPham = sanPham
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

    //chức năng

    //thêm đơn vị tính
    const handleThemDonViTinh = async (kId) => {
        const taoDonViTinh = await sanPhamApi.apiTaoDvt(headers, kId);
        const { statusCode } = taoDonViTinh.data;
        if (statusCode === 200) {
            message.success("Đã thêm sản phẩm", 2);
            callTatCaSanPham();
        }
    };

    const [timKiem, setTimKiem] = useState("");


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




    const handleXoaHinhSanPham = async (spId) => {
        const xoaHinhSanPham = await sanPhamApi.apiXoaHinhSanPham(headers, +spId);
        const { statusCode } = xoaHinhSanPham.data;
        if (statusCode === 200) {
            if (timKiem !== "") {
            } else {
                callTatCaSanPham();
            }
        }
    };

    const handleXoaSanPham = async (spId) => {
        const xoaSanPham = await sanPhamApi.apiDeleteSanPham(headers, +spId);
        const { statusCode } = xoaSanPham.data;
        if (statusCode === 200) {
            callTatCaSanPham();
        }
    };

    const handleOnOffSanPham = async (spId) => {
        // console.log(spId)
        const tatMoSanPham = await sanPhamApi.apiUpdateSho(headers, +spId);
        const { statusCode } = tatMoSanPham.data;
        // console.log(tatMoSanPham.data)
        if (statusCode === 200) {
            callTatCaSanPham();
        }
    };


    const timKiemSanPham = async (timKiem) => {
        // const result = await connectApi.apiTimKiemSanPham(headers, timKiem.toLowerCase())
        // setTatCaSanPham(result.data.content)
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


    const handleUpHinhSanPham = async (event, spId) => {
        const file = event.target.files[0]; // Lấy tệp đầu tiên từ danh sách đã chọn
        if (file) {
            const formData = new FormData();
            formData.append("spId", +spId);
            formData.append("hinhAnh", file);
            const upHinhSanPham = await sanPhamApi.apiUpHinhSanPham(
                headers,
                formData
            );
            const { statusCode } = upHinhSanPham.data;
            // console.log(statusCode);
            if (statusCode === 200) {
                if (timKiem !== "") {
                    callTatCaSanPham()
                } else {
                    callTatCaSanPham(timKiem);
                }
            }
        }
    };

    const handleChangeInput = async (event, spId) => {
        const { name, value } = event.target
        if (name === 'maSp') {
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

    const handleBlurInput = () => {
        // setGiaBan({})
        // setGiaNhap({})
        // setGiaGiam({})
        // setPhiVc({})
        // callTatCaSanPham()
    }

    //in mã vạch
    const handleInMaVach = (spId, maSp, tenSp) => {
        window.open(`/in-ma-vach/${spId}/${maSp}/${tenSp}`, "_blank");
    };






    return (
        <div>
            {
                listSanPham.length === 0 ? <h4>Không có sản phẩm</h4>
                    : (

                        <table>
                            <thead>
                                <tr>
                                    <td></td>
                                    <td className="hinhAnh">Hình</td>
                                    <td className="maSp">Mã SP</td>
                                    <td>Tên SP</td>
                                    <td className="dvt">ĐVT</td>
                                    <td className="quyDoi">Q.Đổi</td>
                                    <td className="giaTien">Giá Nhập</td>
                                    <td className="giaTien">Giá Bán</td>
                                    <td className="giaTien">Giá Giảm</td>
                                    <td className="giaTien">Phí VC</td>
                                    <td className="order">Order</td>
                                    <td className="tonKho"><b>Tồn</b></td>
                                    <td className="center"><i className="fa-regular fa-eye"></i></td>
                                    <td className="center"><i className="fa-regular fa-trash-can"></i></td>
                                </tr>
                            </thead>
                            <tbody>
                                {listSanPham
                                    ?.sort((a, b) => {
                                        // Sắp xếp theo kId
                                        if (b.kId !== a.kId) {
                                            return a.kId - b.kId;
                                        } else if (b.quyDoi === a.quyDoi) {
                                            return b.spId - a.spId
                                        } else {
                                            // Nếu cùng kId, sắp xếp theo quyDoi giảm dần
                                            return a.quyDoi - b.quyDoi;
                                        }
                                    })
                                    .map((sp, index, array) => {
                                        let {
                                            kId,
                                            spId,
                                            tonKho,
                                            sho,
                                            hinhAnh
                                        } = sp;
                                        // Kiểm tra nếu là phần tử đầu tiên của array hoặc kId khác với phần tử trước đó
                                        const isFirstOrDifferentKId = index === 0 || kId !== array[index - 1].kId;
                                        return (
                                            // <p key={index}>{item.tenSp}</p>
                                            <tr key={index}>
                                                {isFirstOrDifferentKId && (
                                                    <td className="add" rowSpan={array.filter((item) => item.kId === kId).length}>
                                                        <i className="fa-solid fa-plus"
                                                            onClick={() => handleThemDonViTinh(kId)}
                                                        ></i>
                                                    </td>
                                                )}

                                                <td>
                                                    <div className="hinhAnh">
                                                        {hinhAnh === null ? (
                                                            <div id="upload">
                                                                <label className="custom-file-upload">
                                                                    <input
                                                                        type="file"
                                                                        accept="image/jpeg, image/png, image/gif"
                                                                        onChange={(event) =>
                                                                            handleUpHinhSanPham(event, spId)
                                                                        }
                                                                    />
                                                                    <i className="fa-regular fa-image"></i>
                                                                </label>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <img src={`${URL}/${hinhAnh}`} alt="" />
                                                                <Popconfirm
                                                                    title="Sửa hình sản phẩm"
                                                                    description="Bạn có muốn sửa hình sản phẩm không?"
                                                                    onConfirm={() => handleXoaHinhSanPham(spId)}
                                                                    // onCancel={cancel}
                                                                    placement="right"
                                                                    okText="Có"
                                                                    cancelText="Không"
                                                                >
                                                                    <i className="fa-regular fa-pen-to-square delete"></i>
                                                                </Popconfirm>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>


                                                <td className="maSp">
                                                    <div className="inputItem">
                                                        <i className="fa-solid fa-barcode"
                                                            onClick={() => handleInMaVach(spId, sp.maSp, sp.tenSp)}
                                                        ></i>
                                                        <input type="text"
                                                            name="maSp"
                                                            value={maSp[spId] !== undefined ? maSp[spId] : sp.maSp}
                                                            onChange={(event) => handleChangeInput(event, spId)}
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="inputItem">
                                                        <input type="text"
                                                            name="tenSp"
                                                            value={tenSp[spId] !== undefined ? tenSp[spId] : sp.tenSp === null ? '' : sp.tenSp}
                                                            onChange={(event) => handleChangeInput(event, spId)}
                                                            style={{ textAlign: 'left', textTransform: 'capitalize' }}
                                                            placeholder="Tên sản phẩm"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="dvt">
                                                    <div className="inputItem">
                                                        <input type="text"
                                                            name="dvt"
                                                            value={dvt[spId] !== undefined ? dvt[spId] : sp.dvt === null ? '' : sp.dvt}
                                                            onChange={(event) => handleChangeInput(event, spId)}
                                                            style={{ textAlign: 'left', textTransform: 'capitalize' }}
                                                            placeholder="Đvt"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="quyDoi">
                                                    <div className="inputItem">
                                                        <input type="text"
                                                            name="quyDoi"
                                                            value={quyDoi[spId] !== undefined ? quyDoi[spId] === 0 ? 0
                                                                : quyDoi[spId].toLocaleString()
                                                                : sp.quyDoi.toLocaleString()}
                                                            onChange={(event) => handleChangeInput(event, spId)}
                                                            style={{ textAlign: 'right' }} />
                                                    </div>
                                                </td>
                                                <td className="giaTien">
                                                    <div className="inputItem">
                                                        <input type="text"
                                                            name="giaNhap"
                                                            value={giaNhap[spId] !== undefined ? giaNhap[spId] === 0 ? 0
                                                                : giaNhap[spId].toLocaleString()
                                                                : sp.giaNhap?.toLocaleString()}
                                                            onChange={(event) => handleChangeInput(event, spId)}
                                                            onBlur={handleBlurInput}
                                                            style={{ textAlign: 'right' }} />
                                                    </div>
                                                </td>
                                                <td className="giaTien">
                                                    <div className="inputItem">
                                                        <input type="text"
                                                            name="giaBan"
                                                            value={giaBan[spId] !== undefined ? giaBan[spId] === 0 ? 0
                                                                : giaBan[spId].toLocaleString()
                                                                : sp.giaBan?.toLocaleString()}
                                                            onChange={(event) => handleChangeInput(event, spId)}
                                                            onBlur={handleBlurInput}

                                                            style={{ textAlign: 'right' }} />
                                                    </div>
                                                </td>
                                                <td className="giaTien">
                                                    <div className="inputItem">
                                                        <input type="text"
                                                            name="giaGiam"
                                                            value={giaGiam[spId] !== undefined ? giaGiam[spId] === 0 ? 0
                                                                : giaGiam[spId].toLocaleString()
                                                                : sp.giaGiam?.toLocaleString()}
                                                            onChange={(event) => handleChangeInput(event, spId)}
                                                            onBlur={handleBlurInput}

                                                            style={{ textAlign: 'right' }} />
                                                    </div>
                                                </td>
                                                <td className="giaTien">
                                                    <div className="inputItem">
                                                        <input type="text"
                                                            name="phiVc"
                                                            value={phiVc[spId] !== undefined ? phiVc[spId] === 0 ? 0
                                                                : phiVc[spId].toLocaleString()
                                                                : sp.phiVc?.toLocaleString()}
                                                            onChange={(event) => handleChangeInput(event, spId)}
                                                            onBlur={handleBlurInput}

                                                            style={{ textAlign: 'right' }} />
                                                    </div>
                                                </td>
                                                <td className="order">
                                                    <div className="inputItem">
                                                        <input type="text"
                                                            name="maxOrder"
                                                            onChange={(event) => handleChangeInput(event, spId)}
                                                            value={maxOrder[spId] !== undefined ? maxOrder[spId] === 0 ? 0
                                                                : maxOrder[spId].toLocaleString()
                                                                : sp.maxOrder?.toLocaleString()} style={{ textAlign: 'right' }} />
                                                    </div>
                                                </td>
                                                <td className="tonKho">
                                                    <b>{tonKho?.toLocaleString()}</b>
                                                </td>
                                                <td className="center">
                                                    {
                                                        sho ? <i className="fa-regular fa-eye" onClick={() => handleOnOffSanPham(spId)} style={{ color: 'royalblue' }}></i>
                                                            : <i className="fa-regular fa-eye-slash" onClick={() => handleOnOffSanPham(spId)} style={{ color: 'red' }}></i>
                                                    }

                                                </td>
                                                <td className="center">
                                                    <Popconfirm
                                                        title="Xoá sản phẩm"
                                                        description="Bạn có muốn xoá sản phẩm không?"
                                                        onConfirm={() => handleXoaSanPham(spId)}
                                                        // onCancel={cancel}
                                                        placement="left"
                                                        okText="Có"
                                                        cancelText="Không"
                                                    >
                                                        <i className="fa-regular fa-trash-can" style={{ color: 'silver' }}></i>
                                                    </Popconfirm>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    )
            }

        </div>
    );
};

export default SanPham;
