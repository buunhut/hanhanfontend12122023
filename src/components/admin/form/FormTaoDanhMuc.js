import React, { useState } from "react";
import "./formtaodanhmuc.scss";
import { useDispatch, useSelector } from "react-redux";
import { callApi } from "../../../api/callApi";
import { Popconfirm, message } from "antd";
import { updateDanhMuc } from "../../../redux/danhMucSlice";
import { URL, capitalizeFirstLetter } from "../../../service/functions";

const FormTaoDanhMuc = () => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };

    const dispath = useDispatch();

    const { danhMuc } = useSelector((state) => state.danhMuc);

    const [selectedFile, setSelectedFile] = useState(null);
    const [tenDanhMuc, setTenDanhmuc] = useState("");
    const [alert, setAlert] = useState({
        tenDanhMuc: "",
        hinhAnh: "",
    });

    const data = {
        tenDanhMuc,
    };

    const handleChangeInput = (event) => {
        const { id, value } = event.target;
        if (id === "tenDanhMuc") {
            setTenDanhmuc(capitalizeFirstLetter(value));
            if (value === "") {
                setAlert((prevState) => ({
                    ...prevState,
                    [id]: "Vui lòng nhập tên danh mục",
                }));
            } else {
                setAlert((prevState) => ({
                    ...prevState,
                    [id]: "",
                }));
            }
        } else {
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
                    hinhAnh: "Vui lòng chọn hình danh mục",
                }));
            }
        }
    };

    const [preview, setPreview] = useState(null);

    const handleDelete = () => {
        // Xóa tệp đã chọn bằng cách đặt selectedFile thành null
        setSelectedFile(null);
        // Đặt xem trước thành null để ẩn nó
        setPreview(null);
    };

    let valid = true;

    const handleTaoDanhMuc = () => {
        if (action === '') {
            if (tenDanhMuc === "") {
                setAlert((prevState) => ({
                    ...prevState,
                    tenDanhMuc: "Vui lòng nhập tên danh mục",
                }));
                valid = false;
                // message.warning('Vui lòng nhập tên danh mục', 3)
            }
            if (selectedFile === null) {
                setAlert((prevState) => ({
                    ...prevState,
                    hinhAnh: "Vui lòng chọn hình danh mục",
                }));
                valid = false;
                // message.warning('Vui lòng chọn hình danh mục')
            }

            if (valid === false) {
                // message.error('Nhập dữ liệu đầy đủ', 2)
                return;
            }
            //code tạo danh mục
            callApi
                .apiTaoDanhMuc(headers, data)
                .then((res) => {
                    const { statusCode, content } = res.data;
                    if (statusCode === 209) {
                        message.warning("Danh mục đã tồn tại", 2);
                    } else if (statusCode === 200) {
                        const { cId } = content;
                        // console.log(cId)

                        let formData = new FormData();
                        formData.append("cId", cId);
                        formData.append("hinhAnh", selectedFile);
                        callApi.apiUpHinhDanhMuc(headers, formData).then((res) => {
                            if (res.data.statusCode === 200) {
                                message.success("Tạo danh mục thành công", 2);
                                setSelectedFile(null);
                                setTenDanhmuc("");
                                setPreview(null);

                                //cập nhật danh mục mới tạo
                                callApi.apiGetDanhMuc(headers).then((res) => {
                                    if (res.data.content.length > 0) {
                                        dispath(updateDanhMuc(res.data.content));
                                    } else {
                                        dispath(updateDanhMuc([]));
                                    }
                                });
                            } else {
                                message.error("Tạo danh mục thất bại", 2);
                            }
                        });
                    }
                })
                .catch((err) => console.log(err));
        } else {
            //code cập nhật danh mục
            if (tenDanhMuc === '') {
                if (tenDanhMuc === "") {
                    setAlert((prevState) => ({
                        ...prevState,
                        tenDanhMuc: "Vui lòng nhập tên danh mục",
                    }));
                    valid = false;
                    // message.warning('Vui lòng nhập tên danh mục', 3)
                }
            }
            if (valid === false) {
                return
            }

            const data = {
                cId: +action,
                tenDanhMuc,
            }
            callApi.apiUpdateDanhMuc(headers, data).then((res) => {
                const { statusCode } = res.data;
                if (statusCode === 200) {
                    if (selectedFile !== null) {
                        let formData = new FormData();
                        formData.append("cId", +action);
                        formData.append("hinhAnh", selectedFile);
                        callApi.apiUpHinhDanhMuc(headers, formData).then((res) => {
                            if (res.data.statusCode === 200) {
                                // message.success("Cập nhật danh mục thành công", 3);
                                setSelectedFile(null);
                                setTenDanhmuc("");
                                setPreview(null);
                                //cập nhật danh mục mới tạo
                                callApi.apiGetDanhMuc(headers).then((res) => {
                                    if (res.data.content.length > 0) {
                                        dispath(updateDanhMuc(res.data.content));
                                    } else {
                                        dispath(updateDanhMuc([]));
                                    }
                                });
                            } else {
                                message.error("Cập nhật hình danh mục thất bại", 2);
                            }
                        });
                    }
                    //cập nhật danh mục mới tạo
                    callApi.apiGetDanhMuc(headers).then((res) => {
                        if (res.data.content.length > 0) {
                            dispath(updateDanhMuc(res.data.content));
                        } else {
                            dispath(updateDanhMuc([]));
                        }
                    });
                    setPreview(null)
                    setTenDanhmuc('')
                    setAction('')
                    message.success('Cập nhật danh mục thành công', 2)
                } else if (statusCode === 209) {
                    message.warning('Tên danh mục đã tồn tại', 2)

                } else {
                    message.error('Cập nhật danh mục thất bại', 2)
                }
            })

        }
    };

    const handleXoaDanhMuc = (item) => {
        const data = {
            cId: +item.cId
        }
        callApi.apiXoaDanhMuc(headers, data).then((res) => {
            const { statusCode } = res.data
            if (statusCode === 200) {
                message.success('Xoá danh mục thành công', 2)
                //gọi lại danh mục để cập nhật
                callApi.apiGetDanhMuc(headers).then((res) => {
                    if (res.data.content.length > 0) {
                        dispath(updateDanhMuc(res.data.content));
                    } else {
                        dispath(updateDanhMuc([]));
                    }
                });

            } else {
                message.error('Xoá danh mục thất bại', 2)
            }
        }).catch((err) => {
            console.log(err)
            message.error('Xoá danh mục thất bại', 2)

        })
    };
    const cancel = () => {
        message.warning('Không xoá danh mục', 1);
    };

    const [action, setAction] = useState('')

    const handleEditDanhMuc = (item) => {
        setTenDanhmuc(capitalizeFirstLetter(item.tenDanhMuc))
        setPreview(<img src={`${URL}/${item.hinhDanhMuc}`} alt="Xem trước" />)
        setAction(item.cId)
    }

    return (
        <div>
            <form action="">
                <div className="inputItem">
                    <i
                        className="fa-solid fa-layer-group"
                        style={{ color: alert.tenDanhMuc !== "" ? "red" : "" }}
                    ></i>
                    <input
                        type="text"
                        id="tenDanhMuc"
                        placeholder="Tên danh mục"
                        value={tenDanhMuc}
                        onChange={handleChangeInput}
                    />

                </div>

                <div id="upload">
                    <label className="custom-file-upload">
                        <input
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

                <button type="button" onClick={handleTaoDanhMuc}>
                    {action === '' ? 'Tạo danh mục' : 'Cập nhật'}
                </button>

                {danhMuc.length > 0 ? (
                    <p className="danhMucDaTao">Danh mục đã tạo</p>
                ) : null}

                <div id="listDanhMuc">
                    {danhMuc?.map((item, index) => {
                        return (
                            <div key={index}>
                                <img src={`${URL}/${item.hinhDanhMuc}`} alt="" />
                                <p>{item.tenDanhMuc.toUpperCase()}</p>
                                <Popconfirm
                                    title="Bạn có chắc muốn xoá danh mục?"
                                    onConfirm={() => handleXoaDanhMuc(item)}
                                    onCancel={cancel}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <i className="fa-regular fa-trash-can xoa" ></i>
                                </Popconfirm>
                                <i className="fa-regular fa-pen-to-square edit" onClick={() => handleEditDanhMuc(item)}></i>
                            </div>
                        );
                    })}
                </div>
            </form>
        </div>
    );
};

export default FormTaoDanhMuc;
