import React, { useEffect, useState } from 'react'
import './nhanvien.scss'
import { useDispatch, useSelector } from 'react-redux';
import { nhanVienApi } from '../../api/nhanVienApi';
import { updateListNhanVienByShop } from '../../redux/nhanVienSlice';
import { Popconfirm } from 'antd';

const NhanVien = () => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };
    const dispath = useDispatch();
    const { listNhanVienByShop } = useSelector((state) => state.nhanVien)
    // console.log(listNhanVienByShop)

    const callListNhanVien = () => {
        nhanVienApi.apiGetNhanVienByShop(headers).then((res) => {
            dispath(updateListNhanVienByShop(res.data.content))
        })
    }

    useEffect(() => {
        callListNhanVien()
    }, [])


    const [tenNhanVien, setTenNhanVien] = useState({})
    const [soDt, setSoDt] = useState({})
    const [diaChi, setDiaChi] = useState({})
    const [chucVu, setChucVu] = useState({})
    const [mucLuong, setMucLuong] = useState({})

    const handleTaoNhanVien = () => {
        nhanVienApi.apiTaoNhanVien(headers).then((res) => {
            const { statusCode } = res.data;
            if (statusCode === 200) {
                callListNhanVien()
            }
        })

    }
    const handleChangeInput = (event, item) => {
        const { name, value } = event.target;
        const { nvId } = item
        if (name === 'tenNhanVien') {
            setTenNhanVien((prevState) => ({
                ...prevState,
                [nvId]: value.toLowerCase()
            }))
        } else if (name === 'soDt') {
            setSoDt((prevState) => ({
                ...prevState,
                [nvId]: value.toLowerCase()
            }))
        } else if (name === 'diaChi') {
            setDiaChi((prevState) => ({
                ...prevState,
                [nvId]: value.toLowerCase()
            }))
        } else if (name === 'chucVu') {
            setChucVu((prevState) => ({
                ...prevState,
                [nvId]: value.toLowerCase()
            }))
        } else if (name === 'mucLuong') {
            setMucLuong((prevState) => ({
                ...prevState,
                [nvId]: +value.replace(/[^0-9]/g, ""),
            }))
        }
    }

    const handleBlurInput = (event, item) => {
        console.log(event.target)
        let data = {}
        const { nvId } = item
        const { name, value } = event.target
        // console.log(value)
        if (name === 'tenNhanVien') {
            data = {
                ...item,
                [name]: value

            }
        } else if (name === 'soDt') {
            data = {
                ...item,
                [name]: value

            }
        } else if (name === 'diaChi') {
            data = {
                ...item,
                [name]: value

            }
        } else if (name === 'chucVu') {
            data = {
                ...item,
                [name]: value
            }
        } else if (name === 'mucLuong') {
            data = {
                ...item,
                [name]: +value.replace(/[^0-9]/g, ""),
            }
        }
        // console.log(data)

        nhanVienApi.apiCapNhatThongTinNhanVien(headers, data).then((res) => {
            // console.log(res.data)
            const { statusCode } = res.data
            if (statusCode === 200) {
                callListNhanVien()
            }
        }).catch((err) => {
            console.log(err)
        })




    }

    const handleXoaNhanVien = (nvId) => {
        nhanVienApi.apiXoaNhanVien(headers, nvId).then((res) => {
            const { statusCode } = res.data
            console.log(statusCode)
            if (statusCode === 200) {
                callListNhanVien()
            }
        }).catch((err) => {
            console.log(err)
        })
    }


    return (
        <div id='nhanVien'>
            <div className="inputItem">
                <i className="fa-solid fa-magnifying-glass"></i>

                <input type="text" placeholder='Tìm kiếm nhân viên...'
                    name='search'
                // value={keyword}
                // onChange={handleSearch}
                />
            </div>

            <table>
                <thead>
                    <tr>

                        <td className='tenNhanVien'>
                            Tên nhân viên
                        </td>
                        <td className='soDt'>
                            Số điện thoại
                        </td>

                        <td>
                            Địa chỉ
                        </td>
                        {/* <td className='mucLuong'>
                            Mức lương
                        </td>
                        <td className='chucVu'>
                            Chức vụ
                        </td> */}

                        <td className='center'>
                            <i className="fa-solid fa-plus" onClick={handleTaoNhanVien}></i>
                        </td>
                    </tr>
                </thead>
                {listNhanVienByShop.length > 0 ? (

                    <tbody>
                        {
                            listNhanVienByShop?.map((item) => {
                                const { nvId } = item
                                return (
                                    <tr key={nvId}>
                                        <td className='tenDoiTac'>
                                            <div className="inputItem">
                                                <input type="text"
                                                    name='tenNhanVien'
                                                    style={{ textTransform: 'capitalize' }}
                                                    value={
                                                        tenNhanVien[nvId] !== undefined ? tenNhanVien[nvId]
                                                            : item.tenNhanVien === null ? ''
                                                                : item.tenNhanVien
                                                    }
                                                    onChange={(event) => handleChangeInput(event, item)}
                                                    onBlur={(event) => handleBlurInput(event, item)}
                                                />
                                            </div>
                                        </td>
                                        <td className='soDt'>
                                            <div className="inputItem">
                                                <input type="text"
                                                    name='soDt'
                                                    value={
                                                        soDt[nvId] !== undefined ? soDt[nvId]
                                                            : item.soDt === null ? ''
                                                                : item.soDt
                                                    }
                                                    onChange={(event) => handleChangeInput(event, item)}
                                                    onBlur={(event) => handleBlurInput(event, item)}

                                                />
                                            </div>
                                        </td>

                                        <td className='diaChi'>
                                            <div className="inputItem">
                                                <input type="text"
                                                    name='diaChi'
                                                    style={{ textTransform: 'capitalize' }}
                                                    value={
                                                        diaChi[nvId] !== undefined ? diaChi[nvId]
                                                            : item.diaChi === null ? ''
                                                                : item.diaChi
                                                    }
                                                    onChange={(event) => handleChangeInput(event, item)}
                                                    onBlur={(event) => handleBlurInput(event, item)}

                                                />
                                            </div>
                                        </td>
                                        {/* <td className='mucLuong'>
                                            <div className="inputItem">
                                                <input type="text"
                                                    name='mucLuong'
                                                    style={{ textAlign: 'right' }}
                                                    value={
                                                        mucLuong[nvId] !== undefined ? mucLuong[nvId].toLocaleString()
                                                            : item.mucLuong === null ? ''
                                                                : item.mucLuong.toLocaleString()
                                                    }
                                                    onChange={(event) => handleChangeInput(event, item)}
                                                    onBlur={(event) => handleBlurInput(event, item)}

                                                />
                                            </div>
                                        </td> */}
                                        {/* <td className='nguoiLienHe'>
                                            <div className="inputItem">
                                                <input type="text"
                                                    name='chucVu'
                                                    style={{ textTransform: 'capitalize' }}
                                                    value={
                                                        chucVu[nvId] !== undefined ? chucVu[nvId]
                                                            : item.chucVu === null ? ''
                                                                : item.chucVu
                                                    }
                                                    onChange={(event) => handleChangeInput(event, item)}
                                                    onBlur={(event) => handleBlurInput(event, item)}

                                                />
                                            </div>
                                        </td> */}

                                        <td className='center'>
                                            <Popconfirm
                                                title="Xoá nhân viên"
                                                description="Bạn có muốn xoá nhân viên?"
                                                onConfirm={() => handleXoaNhanVien(nvId)}
                                                // onCancel={cancel}
                                                placement="left"
                                                okText="Có"
                                                cancelText="Không"
                                            >
                                                <i className="fa-regular fa-trash-can"></i>
                                            </Popconfirm>
                                        </td>
                                    </tr>
                                )

                            })
                        }

                    </tbody>
                ) : null}

            </table>

        </div>
    )
}

export default NhanVien