import React, { useEffect, useState } from 'react'
import { Select, message } from 'antd';
import { useDispatch, useSelector } from "react-redux";

import './formtaodvt.scss'
import { URL, capitalizeFirstLetter } from '../../../service/functions';
import { callApi } from '../../../api/callApi';
import { updateSanPhamByShop } from '../../../redux/sanPhamSlice';
const { Option } = Select;


const FormTaoDvt = () => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token
    }

    // const [sanPhamByShop, setSanPhamByShop] = useState([])
    const dispath = useDispatch()
    useEffect(() => {
        callApi.apiGetSanPhamByShop(headers).then((res) => {
            if (res.data.content.length > 0) {
                dispath(updateSanPhamByShop(res.data.content))
            }
        })
    }, [])




    const { sanPhamByShop } = useSelector((state) => state.sanPham)
    console.log(sanPhamByShop)

    const [selectedFile, setSelectedFile] = useState(null);

    // console.log(selectedFile)

    const [preview, setPreview] = useState(null);

    const handleDelete = () => {
        // Xóa tệp đã chọn bằng cách đặt selectedFile thành null
        setSelectedFile(null);
        // Đặt xem trước thành null để ẩn nó
        setPreview(null);
    };

    const [donViTinh, setDonViTinh] = useState({
        pId: '',
        dvt: '',
        quyDoi: '',
        giaNhap: '',
        giaBan: '',
        giaGiam: '',
    })

    const [alert, setAlert] = useState({
        pId: '',
        dvt: '',
        quyDoi: '',
        giaNhap: '',
        giaBan: '',
        giaGiam: '',
        hinhAnh: ''

    })

    const handleChangeInput = (event) => {
        const { id, value } = event.target

        if (id === 'quyDoi' || id === 'giaNhap' || id === 'giaBan' || id === 'giaGiam') {
            setDonViTinh((prevState) => ({
                ...prevState,
                [id]: +value.replace(/[^0-9]/g, ""),
            }))
        } else {

            setDonViTinh((prevState) => ({
                ...prevState,
                [id]: value
            }))
        }

        if (value === '') {
            setAlert((prevState) => ({
                ...prevState,
                [id]: 'Vui lòng nhập dữ liệu'
            }))

        } else {
            setAlert((prevState) => ({
                ...prevState,
                [id]: ''
            }))

        }
    }

    const handleChangeHinh = (event) => {
        console.log("first")
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
                hinhAnh: ''
            }))
        } else {
            setAlert((prevState) => ({
                ...prevState,
                hinhAnh: 'Vui lòng chọn hình thương hiệu'
            }))
        }
    }


    //tìm đơn vị tính đã tạo
    const [selectedProduct, setSelectedProduct] = useState([])

    // console.log(selectedProduct)


    const handleChange = (value) => {
        setDonViTinh((prevState) => ({
            ...prevState,
            pId: value
        }))
        if (value === '') {
            setAlert((prevState) => ({
                ...prevState,
                pId: 'Vui lòng chọn sản phẩm'
            }))
        } else {
            setAlert((prevState) => ({
                ...prevState,
                pId: ''
            }))
        }
        callApi.apiPackagesByProduct(headers, value).then((res) => {
            setSelectedProduct(res.data.content)
        })



    };

    let valid = true
    const handleTaoDvt = () => {
        if (selectedFile === null) {
            setAlert((prevState) => ({
                ...prevState,
                hinhAnh: 'Vui lòng chọn hình đóng gói'
            }))
            valid = false
            // message.warning('Vui lòng chọn hình danh mục')
        }

        for (let key in donViTinh) {

            if (key === 'giaGiam' || key === 'quyDoi') {
                setAlert((prevState) => ({
                    ...prevState,
                    [key]: ''
                }))
            } else if (donViTinh[key] === '') {
                setAlert((prevState) => ({
                    ...prevState,
                    [key]: 'Vui lòng nhập dữ liệu'
                }))
                valid = false
            }
        }


        if (valid === false) {
            message.error('Tạo đơn vi tính thất bại', 2)
            return
        }

        const { pId, dvt, quyDoi, giaNhap, giaBan, giaGiam } = donViTinh
        const data = {
            pId: +pId,
            dvt,
            quyDoi,
            giaNhap,
            giaBan,
            giaGiam,
        }

        // console.log(data)
        //gọi api đẩy data đi
        callApi.apiTaoDonViTinh(headers, data).then((res) => {
            const { statusCode, content } = res.data;

            if (statusCode === 200) {
                //up hình đvt
                const { pkId } = content
                const formData = new FormData()
                formData.append('pkId', pkId)
                formData.append('hinhAnh', selectedFile)
                callApi.apiUpHinhDvt(headers, formData).then((res) => {
                    const { statusCode, content } = res.data
                    if (statusCode === 200) {
                        callApi.apiGetSanPhamByShop(headers).then((res) => {
                            if (res.data.content.length > 0) {
                                dispath(updateSanPhamByShop(res.data.content))
                            }
                        })
                        message.success('Tạo đơn vị tính thành công', 2)
                        setDonViTinh((prevState) => ({
                            ...prevState,
                            // pId: '',
                            dvt: '',
                            quyDoi: '',
                            giaNhap: '',
                            giaBan: '',
                            giaGiam: '',
                        }))
                        setSelectedFile(null)
                        setPreview(null)

                        callApi.apiPackagesByProduct(headers, +pId).then((res) => {
                            setSelectedProduct(res.data.content)
                        })
                    } else {
                        message.warning('Up hình đơn vị tính lỗi', 2)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            } else if (statusCode === 209) {
                message.warning('Đơn vị tính đã tồn tại', 2)
            } else {
                message.error('Tạo đơn vi tính thất bại', 2)
            }
        }).catch((err) => {
            console.log(err)
        })

    };





    return (
        <form action="">
            <div className="inputItem" id='antSelect'>
                <i className="fa-solid fa-kitchen-set" style={{ color: alert.pId !== '' ? 'red' : '' }}></i>

                <Select
                    showSearch
                    allowClear
                    placeholder="Tên sản phẩm"
                    style={{ width: '100%' }}
                    onChange={handleChange}
                    optionLabelProp="label"
                    bordered={false}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {
                        sanPhamByShop?.map((item) => (
                            <Select.Option key={item.sanPham.pId} value={item.sanPham.pId} label={capitalizeFirstLetter(item.sanPham.tenSp)}>
                                {capitalizeFirstLetter(item.sanPham.tenSp)}
                            </Select.Option>
                        ))
                    }
                </Select>
            </div>
            <div className='groupItem'>
                <div className="inputItem">
                    <i className="fa-solid fa-box" style={{ color: alert.dvt !== '' ? 'red' : '' }} ></i>

                    <input type="text" id="dvt" placeholder='Đơn vị tính'
                        value={donViTinh.dvt}
                        onChange={handleChangeInput} />
                </div>
                <div className="inputItem">
                    <i className="fa-solid fa-list-ol" style={{ color: alert.quyDoi !== '' ? 'red' : '' }} ></i>

                    <input type="text" id="quyDoi" placeholder='Đóng gói'
                        value={
                            donViTinh.quyDoi === 0 ? '' :
                                donViTinh.quyDoi.toLocaleString()
                        }
                        onChange={handleChangeInput} />

                </div>
            </div>
            <div className='groupItem'>
                <div className="inputItem">
                    <i className="fa-solid fa-file-invoice-dollar" style={{ color: alert.giaNhap !== '' ? 'red' : '' }} ></i>

                    <input type="text" id="giaNhap" placeholder='Giá nhập'
                        value={
                            donViTinh.giaNhap === 0 ? '' :
                                donViTinh.giaNhap.toLocaleString()}
                        onChange={handleChangeInput} />
                </div>
                <div className="inputItem">
                    <i className="fa-solid fa-file-invoice-dollar" style={{ color: alert.giaBan !== '' ? 'red' : '' }} ></i>

                    <input type="text" id="giaBan" placeholder='Giá bán'
                        value={
                            donViTinh.giaBan === 0 ? '' :
                                donViTinh.giaBan.toLocaleString()}
                        onChange={handleChangeInput} />
                </div>
                <div className="inputItem">
                    <i className="fa-solid fa-file-invoice-dollar" style={{ color: alert.giaGiam !== '' ? 'red' : '' }} ></i>

                    <input type="text" id="giaGiam" placeholder='Giá giảm'
                        value={
                            donViTinh.giaGiam === 0 ? '' :
                                donViTinh.giaGiam.toLocaleString()}
                        onChange={handleChangeInput} />
                </div>
            </div>
            <div id="upload">
                <label className="custom-file-upload">
                    <i className="fa-regular fa-image" style={{ color: alert.hinhAnh !== '' ? 'red' : '' }} ></i>

                    <input
                        type="file"
                        accept="image/jpeg, image/png, image/gif"
                        onChange={handleChangeHinh}
                    />

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
            <button type='button' onClick={handleTaoDvt}>Tạo đơn vị tính</button>


            {
                selectedProduct.length > 0 ? (<p className="danhMucDaTao">Đơn vị tính đã tạo</p>) : null
            }


            <div id="listDanhMuc">
                {selectedProduct.length > 0 ? (

                    selectedProduct.map((item, index) => {
                        return (
                            <div key={index}>
                                <img src={`${URL}/${item.hinhAnh}`} alt="" />

                                <p>{item.dvt.toUpperCase()}</p>
                            </div>
                        )


                    })
                ) : null
                }

            </div>



        </form>


    )
}

export default FormTaoDvt