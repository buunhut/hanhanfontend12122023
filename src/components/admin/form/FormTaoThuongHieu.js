import { Popconfirm, Select, message } from 'antd';
import useToken from 'antd/es/theme/useToken';
import React, { useEffect, useState } from 'react'
import { callApi } from '../../../api/callApi';
import { useDispatch, useSelector } from 'react-redux';
import { URL, capitalizeFirstLetter } from '../../../service/functions';
import { updateDanhMuc } from '../../../redux/danhMucSlice';

const FormTaoThuongHieu = () => {

    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token
    }

    const { danhMuc } = useSelector((state) => state.danhMuc)

    // const thuongHieu = danhMuc?.map((item) => {
    //     return item.brandNames.map(brandName => ({
    //         tenThuongHieu: brandName.tenThuongHieu,
    //         hinhThuongHieu: brandName.hinhThuongHieu,
    //         bId: brandName.bId,
    //         cId: item.cId,
    //         tenDanhMuc: item.tenDanhMuc
    //     }));
    // }).reduce((acc, current) => [...acc, ...current], []);

    const thuongHieu = danhMuc?.map((item) => ({
        tenDanhMuc: item.tenDanhMuc,
        brandNames: item.brandNames.map((brandName) => ({
            tenThuongHieu: brandName.tenThuongHieu,
            hinhThuongHieu: brandName.hinhThuongHieu,
            bId: brandName.bId,
            cId: item.cId
        })),
        cId: item.cId, // Lấy cId của danh mục nếu cần
    }));

    const dispath = useDispatch()


    const [selectedFile, setSelectedFile] = useState(null);

    const [preview, setPreview] = useState(null);

    const handleDelete = () => {
        // Xóa tệp đã chọn bằng cách đặt selectedFile thành null
        setSelectedFile(null);
        // Đặt xem trước thành null để ẩn nó
        setPreview(null);
    };

    const [alert, setAlert] = useState({
        tenDanhMuc: '',
        tenThuongHieu: '',
        hinhAnh: '',
    })

    const [tenDanhMuc, setTenDanhMuc] = useState(null);
    const [tenThuongHieu, setTenThuongHieu] = useState("");

    const data = {
        cId: Number(tenDanhMuc),
        tenThuongHieu,
    }
    // console.log(data)
    const handleChangeInput = (event) => {
        const { id, value } = event.target
        // if (id === 'tenDanhMuc') {
        //     setTenDanhMuc(value)
        //     if (value === '') {
        //         setAlert((prevState) => ({
        //             ...prevState,
        //             [id]: 'Vui lòng chọn tên danh mục'
        //         }))
        //     }
        //     else {
        //         setAlert((prevState) => ({
        //             ...prevState,
        //             [id]: ''
        //         }))
        //     }

        // } else 
        if (id === 'tenThuongHieu') {
            setTenThuongHieu(value)
            if (value === '') {
                setAlert((prevState) => ({
                    ...prevState,
                    [id]: 'Vui lòng nhập tên thương hiệu'
                }))
            }
            else {
                setAlert((prevState) => ({
                    ...prevState,
                    [id]: ''
                }))
            }

        }
        else {
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

    }

    const handleChange = (value) => {
        setTenDanhMuc(value)
        if (value === undefined) {
            setAlert((prevState) => ({
                ...prevState,
                tenDanhMuc: 'Vui lòng chọn danh mục'
            }))
        } else {
            setAlert((prevState) => ({
                ...prevState,
                tenDanhMuc: ''
            }))
        }
    };




    let valid = true
    const handleTaoThuongHieu = () => {

        if (action === '') {

            if (tenDanhMuc === null) {
                setAlert((prevState) => ({
                    ...prevState,
                    tenDanhMuc: 'Vui lòng chọn tên danh mục'
                }))
                valid = false
                // message.warning('Vui lòng nhập tên danh mục', 3)
            }
            if (tenThuongHieu === '') {
                setAlert((prevState) => ({
                    ...prevState,
                    tenThuongHieu: 'Vui lòng nhập tên thương hiệu'
                }))
                valid = false
                // message.warning('Vui lòng nhập tên danh mục', 3)
            }
            if (selectedFile === null) {
                setAlert((prevState) => ({
                    ...prevState,
                    hinhAnh: 'Vui lòng chọn hình thương hiệu'
                }))
                valid = false
                // message.warning('Vui lòng chọn hình danh mục')
            }

            if (valid === false) {
                // message.error('Tạo danh mục thất bại', 3)
                return
            }

            callApi.apiTaoThuongHieu(headers, data).then((res) => {
                const { statusCode, content } = res.data
                if (statusCode === 200) {
                    const { bId } = content
                    //up hình thường hiệu
                    let formData = new FormData()
                    formData.append('bId', bId)
                    formData.append('hinhAnh', selectedFile)
                    callApi.apiUpHinhThuongHieu(headers, formData).then((res) => {
                        if (res.data.statusCode === 200) {
                            message.success('Tạo thương hiệu thành công', 2)
                            setSelectedFile(null)
                            // setTenDanhMuc('')
                            setTenThuongHieu('')
                            setPreview(null)
                            //cập nhật thương hiệu mới mới tạo
                            callApi.apiGetDanhMuc(headers).then((res) => {
                                if (res.data.content.length > 0) {
                                    dispath(updateDanhMuc(res.data.content))

                                } else {
                                    dispath(updateDanhMuc([]))
                                }
                            })
                        } else {
                            message.error('Tạo thương hiệu thất bại', 2)
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                } else if (statusCode === 209) {
                    message.warning('Thương hiệu đã tồn tại', 2)


                }
            }).catch((err) => {
                console.log(err)
            })

        } else {

            if (tenDanhMuc === null) {
                setAlert((prevState) => ({
                    ...prevState,
                    tenDanhMuc: 'Vui lòng chọn tên danh mục'
                }))
                valid = false
                // message.warning('Vui lòng nhập tên danh mục', 3)
            }
            if (tenThuongHieu === '') {
                setAlert((prevState) => ({
                    ...prevState,
                    tenThuongHieu: 'Vui lòng nhập tên thương hiệu'
                }))
                valid = false
                // message.warning('Vui lòng nhập tên danh mục', 3)
            }

            if (valid === false) {
                // message.error('Tạo danh mục thất bại', 3)
                return
            }


            const data = {
                bId: +action,
                cId: +tenDanhMuc,
                tenThuongHieu,

            }




            callApi.apiUpdateThuongHieu(headers, data).then((res) => {
                const { statusCode, content } = res.data;
                const { bId } = content
                if (statusCode === 200) {
                    //đã cập nhật thành công, xủ lý đến hình
                    if (selectedFile === null) {
                        message.success('Cập nhật thương hiệu thành công', 2)
                        setSelectedFile(null)
                        setTenDanhMuc(null)
                        setTenThuongHieu('')
                        setPreview(null)
                        setAction('')
                        //cập nhật thương hiệu mới mới tạo
                        callApi.apiGetDanhMuc(headers).then((res) => {
                            if (res.data.content.length > 0) {
                                dispath(updateDanhMuc(res.data.content))

                            } else {
                                dispath(updateDanhMuc([]))
                            }
                        })

                    } else {

                        let formData = new FormData()
                        formData.append('bId', bId)
                        formData.append('hinhAnh', selectedFile)

                        callApi.apiUpHinhThuongHieu(headers, formData).then((res) => {
                            const { statusCode } = res.data;
                            if (statusCode === 200) {
                                message.success('Cập nhật thương hiệu thành công', 2)
                                setSelectedFile(null)
                                setTenDanhMuc(null)
                                setTenThuongHieu('')
                                setPreview(null)
                                setAction('')
                                //cập nhật thương hiệu mới mới tạo
                                callApi.apiGetDanhMuc(headers).then((res) => {
                                    if (res.data.content.length > 0) {
                                        dispath(updateDanhMuc(res.data.content))

                                    } else {
                                        dispath(updateDanhMuc([]))
                                    }
                                })


                            } else {
                                message.error('Cập nhật thương hiệu thất bại', 2)
                            }
                        })
                    }
                } else if (statusCode === 209) {
                    message.warning('Tên thương hiệu đã tồn tại', 2)

                } else {
                    message.error('Cập nhật thương hiệu thất bại', 2)
                }

            }).catch((err) => {
                console.log(err)
            })


        }





    };

    const handleXoaThuongHieu = (item) => {
        const data = {
            bId: +item.bId
        }
        callApi.apiXoaThuongHieu(headers, data).then((res) => {
            const { statusCode } = res.data;
            if (statusCode === 200) {
                //cập nhật danh mục mới tạo
                callApi.apiGetDanhMuc(headers).then((res) => {
                    if (res.data.content.length > 0) {
                        dispath(updateDanhMuc(res.data.content));
                    } else {
                        dispath(updateDanhMuc([]));
                    }
                });
                message.success('Xoá thương hiệu thành công', 2)
            } else {
                message.error('Xoá thương hiệu thất bại', 2)
            }
        }).catch((err) => {
            console.log(err)
            message.error('Xoá thương hiệu thất bại', 2)
        })



    }

    const [action, setAction] = useState('')
    const handleEditThuongHieu = (item) => {
        setAlert({
            tenDanhMuc: '',
            tenThuongHieu: '',
            hinhAnh: '',
        })
        setAction(item.bId)
        setTenDanhMuc(item.cId)
        setTenThuongHieu(item.tenThuongHieu)
        setPreview(<img src={`${URL}/${item.hinhThuongHieu}`} alt="Xem trước" />)

    }

    const cancel = () => {

    }


    return (
        <form action="">
            <div className="groupItem">

                <div className="inputItem">
                    <i className="fa-solid fa-bag-shopping" style={{ color: alert.tenThuongHieu !== '' ? 'red' : '' }} ></i>

                    <input type="text" id="tenThuongHieu" placeholder='Tên thương hiệu'
                        value={tenThuongHieu}
                        onChange={handleChangeInput}
                    />
                </div>
                <div className="inputItem">
                    {/* <select name="" id="tenDanhMuc" className={tenDanhMuc !== '' ? 'black' : ''}
                        value={tenDanhMuc}
                        onChange={handleChangeInput}>
                        <option value={''} disabled>Danh mục</option>
                        {
                            danhMuc?.map((item, index) => {
                                return (
                                    <option value={item.cId} key={index}>{capitalizeFirstLetter(item.tenDanhMuc)}</option>
                                )
                            })
                        }
                    </select> */}
                    <i className="fa-solid fa-layer-group" style={{ color: alert.tenDanhMuc !== '' ? 'red' : '' }} ></i>


                    <Select
                        // mode="multiple"
                        showSearch
                        allowClear
                        placeholder="Tên danh mục"
                        style={{ width: '100%' }}
                        value={tenDanhMuc}
                        onChange={handleChange}
                        bordered={false}
                        optionLabelProp="label"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {danhMuc?.map((item) => (
                            <Select.Option key={item.cId} value={item.cId} label={capitalizeFirstLetter(item.tenDanhMuc)}>
                                {capitalizeFirstLetter(item.tenDanhMuc)}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </div>


            <div id="upload">
                <label className="custom-file-upload">
                    <input
                        type="file"
                        accept="image/jpeg, image/png, image/gif"
                        onChange={handleChangeInput}
                    />
                    <i className="fa-regular fa-image" style={{ color: alert.hinhAnh !== '' ? 'red' : '' }} ></i>

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
            <button type='button' onClick={handleTaoThuongHieu}>
                {
                    action !== '' ? ('Cập nhật') : ('Tạo thương hiệu')
                }
            </button>

            {
                // thuongHieu.length > 0 ? (<p className="danhMucDaTao">Danh mục và thương hiệu đã tạo</p>) : null
            }
            <div id="listThuongHieu">
                {thuongHieu.map((itemDanhMuc, index) => (
                    <div key={itemDanhMuc.cId}>
                        <p className='danhMuc'><i className="fa-solid fa-layer-group" ></i>{itemDanhMuc.tenDanhMuc}</p>
                        <div className='thuongHieuContent'>
                            {itemDanhMuc.brandNames.map((itemThuongHieu, index) => (
                                <div key={index}>
                                    <img src={`${URL}/${itemThuongHieu.hinhThuongHieu}`} alt="" />
                                    <p>{itemThuongHieu.tenThuongHieu}</p>
                                    <Popconfirm
                                        title="Bạn có chắc muốn xoá thương hiệu?"
                                        onConfirm={() => handleXoaThuongHieu(itemThuongHieu)}
                                        onCancel={cancel}
                                        okText="Có"
                                        cancelText="Không"
                                    >
                                        <i className="fa-regular fa-trash-can xoa" ></i>
                                    </Popconfirm>
                                    <i className="fa-regular fa-pen-to-square edit" onClick={() => handleEditThuongHieu(itemThuongHieu)}></i>
                                </div>
                            ))}
                        </div>

                    </div>
                ))}
            </div>
        </form>
    )
}

export default FormTaoThuongHieu