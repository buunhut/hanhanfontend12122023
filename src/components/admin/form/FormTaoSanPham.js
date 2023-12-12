import React, { useEffect, useState } from "react";
import "./formtaosanpham.scss";
import { useDispatch, useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../../service/functions";
import { TreeSelect, message } from "antd";
import { callApi } from '../../../api/callApi';
import TreeSelectAnt from "./TreeSelectAnt";
import { updateSanPhamByShop } from "../../../redux/sanPhamSlice";


const FormTaoSanPham = () => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };

    const { danhMuc } = useSelector((state) => state.danhMuc);
    // const [danhMuc, setDanhMuc] = useState([])

    // useEffect(() => {
    //     callApi.apiGetDanhMuc(headers).then((res) => {
    //         if (res.data.statusCode === 200) {
    //             setDanhMuc(res.data.content)
    //         }
    //     })
    // }, [])


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



    const [selectedFile, setSelectedFile] = useState(null);

    const [preview, setPreview] = useState(null);

    const handleDelete = () => {
        // Xóa tệp đã chọn bằng cách đặt selectedFile thành null
        setSelectedFile(null);
        // Đặt xem trước thành null để ẩn nó
        setPreview(null);
    };

    const [alert, setAlert] = useState({
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
        hinhAnh: "",
    });

    const handleChangeInput = (event) => {
        const { id, value } = event.target;
        if (id === "hinhAnh") {
            const file = event.target.files[0]; // Lấy tệp đầu tiên từ danh sách đã chọn
            if (file) {
                setSelectedFile(file);
                // Xem trước tệp ảnh (nếu có)
                if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        const preview = reader.result;

                        // Hiển thị xem trước tệp hình ảnh bằng một phần tử <img>
                        const previewElement = <img src={preview} alt="Xem trước" />;
                        // Lưu xem trước trong state hoặc sử dụng nó để cập nhật giao diện người dùng
                        // Ở đây, tôi sẽ lưu xem trước trong state
                        setPreview(previewElement);
                    };
                }
                setAlert((prevState) => ({
                    ...prevState,
                    hinhAnh: "",
                }));
            } else {
                setAlert((prevState) => ({
                    ...prevState,
                    hinhAnh: "Vui lòng chọn hình thương hiệu",
                }));
            }

        } else if (id === 'quyDoi' || id === 'giaNhap' || id === 'giaBan' || id === 'giaGiam') {
            if (value === '') {
                setAlert((prevState) => ({
                    ...prevState,
                    [id]: "Vui lòng nhập dữ liệu",
                }));
                setSanPham((prevState) => ({
                    ...prevState,
                    [id]: 0
                }))
            } else {
                setSanPham((prevState) => ({
                    ...prevState,
                    [id]: +value.replace(/[^0-9]/g, '')
                }))
            }
        } else {
            setSanPham((prevState) => ({
                ...prevState,
                [id]: value
            }))
        }
    };





    const generateTreeData = (danhMuc) => {
        return danhMuc.map((item) => ({
            value: item.cId,
            title: item.tenDanhMuc,
            disabled: true,
            children: item.brandNames.map((brandName) => (
                {
                    value: `${item.cId}-${brandName.bId}`,
                    title: brandName.tenThuongHieu,
                }
            )),
        }));
    };

    const dataDemo = generateTreeData(danhMuc);

    const onChangeThungHieu = (value) => {
        if (value !== undefined) {
            const [cId, bId] = value.split('-').map(Number);
            setSanPham((prevState) => ({
                ...prevState,
                cId, bId
            }))
            setAlert((prevState) => ({
                ...prevState,
                cId: '',
                bId: ''
            }))

            // console.log(cId, bId)
        } else {
            setAlert((prevState) => ({
                ...prevState,
                cId: 'Vui lòng chọn danh mục',
                bId: 'Vui lòng chọn thương hiệu',
            }))
        }

    };
    const filterTreeNode = (input, node) => {
        // Lọc các nút dựa trên giá trị tìm kiếm (searchValue)
        const title = node.title;  //đã fixed
        return title.toLowerCase().includes(input.toLowerCase());
    };
    
    const dispath = useDispatch()



    let valid = true;
    const handleTaoSanPham = () => {
        for (let key in sanPham) {
            if (key === 'maSp' || key === "giaGiam" || key === "chiTiet" || key === "quyDoi") {
                setAlert((prevState) => ({
                    ...prevState,
                    [key]: "",
                }));
                valid = true;
            } else if (sanPham[key] === "") {
                setAlert((prevState) => ({
                    ...prevState,
                    [key]: "Vui lòng nhập liệu",
                }));
                valid = false;
            }
        }
        if (selectedFile === null) {
            setAlert((prevState) => ({
                ...prevState,
                hinhAnh: "Vui lòng chọn hình",
            }));
            valid = false;
        }
        if (valid === false) {
            return;
        }
        //gọi axios tạo sản phẩm
        let {
            maSp,
            tenSp,
            giaNhap,
            giaBan,
            giaGiam,
            dvt,
            quyDoi,
            chiTiet,
            cId,
            bId,
        } = sanPham;
        if (quyDoi === '') {
            quyDoi = 1
        }
        if (giaGiam === '') {
            giaGiam = 0
        }


        const data = {
            maSp,
            tenSp,
            giaNhap,
            giaBan,
            giaGiam,
            dvt,
            quyDoi,
            chiTiet,
            cId,
            bId,
        };
        // console.log(data)
        callApi
            .apiTaoSanPham(headers, data)
            .then((res) => {
                const { statusCode, content } = res.data;
                if (statusCode === 200) {
                    const { pkId } = content
                    const formData = new FormData()
                    formData.append('pkId', pkId)
                    formData.append('hinhAnh', selectedFile)
                    callApi.apiUpHinhDvt(headers, formData).then((res) => {
                        const { statusCode, content } = res.data;
                        if (statusCode === 200) {
                            setSanPham((prevState) => ({
                                ...prevState,
                                maSp: "",
                                tenSp: "",
                                giaNhap: "",
                                giaBan: "",
                                giaGiam: "",
                                dvt: "",
                                quyDoi: "",
                                chiTiet: "",
                                // cId: "",
                                // bId: "",
                            }))
                            setSelectedFile(null)
                            setPreview(null)
                            message.success('Tạo sản phẩm thành công', 1)
                            callApi.apiGetSanPhamByShop(headers).then((res) => {
                                if (res.data.content.length > 0) {
                                    dispath(updateSanPhamByShop(res.data.content))
                                }
                            })
                        } else {
                            message.error('Up hình sản phẩm lỗi', 1)
                        }

                    }).catch((err) => {
                        console.log(err)
                    })
                } else if (statusCode === 209) {
                    message.warning('Mã sản phẩm đã tồn tại', 1)
                } else {
                    message.error('Tạo sản phẩm thất bại', 1)
                }
            })
            .catch((err) => {
                console.log(err);
            });

        //gọi axios up hình sản phẩm
    };

    return (
        <form action="">
            <div className="inputItem">
                <i
                    className="fa-solid fa-barcode"
                    style={{ color: alert.maSp !== "" ? "red" : "" }}
                ></i>
                <input
                    type="text"
                    id="maSp"
                    placeholder="Mã sản phẩm"
                    value={sanPham.maSp}
                    onChange={handleChangeInput}
                />

            </div>
            <div className="inputItem">
                <i
                    className="fa-solid fa-kitchen-set"
                    style={{ color: alert.tenSp !== "" ? "red" : "" }}
                ></i>
                <input
                    type="text"
                    id="tenSp"
                    placeholder="Tên sản phẩm"
                    value={sanPham.tenSp}
                    onChange={handleChangeInput}
                />

            </div>
            <div className="groupItem">
                <div className="inputItem">
                    <i
                        className="fa-solid fa-box"
                        style={{ color: alert.dvt !== "" ? "red" : "" }}
                    ></i>
                    <input
                        type="text"
                        id="dvt"
                        placeholder="Đơn vị tính"
                        value={sanPham.dvt}
                        onChange={handleChangeInput}
                    />

                </div>
                <div className="inputItem">
                    <i
                        className="fa-solid fa-list-ol"
                        style={{ color: alert.quyDoi !== "" ? "red" : "" }}
                    ></i>
                    <input
                        type="text"
                        id="quyDoi"
                        placeholder="Đóng gói"
                        value={
                            sanPham.quyDoi === 0 ? '' :
                                sanPham.quyDoi.toLocaleString()
                        }
                        onChange={handleChangeInput}
                    />

                </div>
            </div>
            <div className="groupItem">
                <div className="inputItem">
                    <i
                        className="fa-solid fa-file-invoice-dollar"
                        style={{ color: alert.giaNhap !== "" ? "red" : "" }}
                    ></i>
                    <input
                        type="text"
                        id="giaNhap"
                        placeholder="Giá nhập"
                        value={
                            sanPham.giaNhap === 0 ? '' :
                                sanPham.giaNhap.toLocaleString()
                        }
                        onChange={handleChangeInput}
                    />

                </div>
                <div className="inputItem">
                    <i
                        className="fa-solid fa-file-invoice-dollar"
                        style={{ color: alert.giaBan !== "" ? "red" : "" }}
                    ></i>
                    <input
                        type="text"
                        id="giaBan"
                        placeholder="Giá bán"
                        value={
                            sanPham.giaBan === 0 ? '' :
                                sanPham.giaBan.toLocaleString()
                        }
                        onChange={handleChangeInput}
                    />

                </div>
                <div className="inputItem">
                    <i className="fa-solid fa-file-invoice-dollar"></i>

                    <input
                        type="text"
                        id="giaGiam"
                        placeholder="Giá giảm"
                        value={
                            sanPham.giaGiam === 0 ? '' :
                                sanPham.giaGiam.toLocaleString()
                        }
                        onChange={handleChangeInput}
                    />
                </div>
            </div>
            <div className="inputItem">
                <i className="fa-solid fa-circle-info"></i>

                <input
                    type="text"
                    id="chiTiet"
                    placeholder="Chi tiêt"
                    value={sanPham.chiTiet}
                    onChange={handleChangeInput}
                />
            </div>
            <div className="inputItem">
                <i
                    className="fa-solid fa-layer-group"
                    style={{ color: alert.cId !== "" ? "red" : "" }}
                ></i>
                <TreeSelect
                    treeData={dataDemo}
                    placeholder="Chọn danh mục"
                    treeDefaultExpandAll
                    showSearch
                    allowClear
                    onChange={onChangeThungHieu}
                    filterTreeNode={filterTreeNode}
                    bordered={false}
                    style={{
                        width: '100%',
                    }}
                />


            </div>


            {/* <div className="inputItem">
                <select
                    name=""
                    id="cId"
                    className={sanPham.cId !== "" ? "black" : ""}
                    value={sanPham.cId}
                    onChange={handleChangeInput}
                >
                    <option value={""} disabled>
                        Danh mục
                    </option>
                    {danhMuc?.map((item, index) => {
                        return (
                            <option value={item.cId} key={index}>
                                {capitalizeFirstLetter(item.tenDanhMuc)}
                            </option>
                        );
                    })}
                </select>
                <i
                    className="fa-solid fa-layer-group"
                    style={{ color: alert.cId !== "" ? "red" : "" }}
                ></i>
            </div>

            <div className="inputItem">
                <select
                    name=""
                    id="bId"
                    className={sanPham.bId !== "" ? "black" : ""}
                    value={sanPham.bId}
                    onChange={handleChangeInput}
                >
                    <option value={""} disabled>
                        Thương hiệu
                    </option>
                    {thuongHieu?.map((item, index) => {
                        return (
                            <option value={item.bId} key={index}>
                                {capitalizeFirstLetter(item.tenThuongHieu)}
                            </option>
                        );
                    })}
                </select>
                <i
                    className="fa-solid fa-bag-shopping"
                    style={{ color: alert.bId !== "" ? "red" : "" }}
                ></i>
            </div>
 */}

            <div id="upload">
                <label className="custom-file-upload">
                    <input
                        id="hinhAnh"
                        type="file"
                        accept="image/jpeg, image/png, image/gif"
                        onChange={handleChangeInput}
                    />
                    <i
                        className="fa-regular fa-image"
                        style={{ color: alert.hinhAnh !== "" ? "red" : "" }}
                    ></i>
                </label>
                {preview && (
                    <div className="hinhAnh">
                        {preview}
                        <i
                            className="fa-regular fa-trash-can xoa"
                            onClick={handleDelete}
                        ></i>
                    </div>
                )}
            </div>

            <button type="button" onClick={handleTaoSanPham}>
                Tạo sản phẩm
            </button>
        </form>
    );
};

export default FormTaoSanPham;
