import React, { useEffect, useState } from 'react'
import './nhaphanphoi.scss'
import { useDispatch, useSelector } from 'react-redux'
import { callApi } from '../../api/callApi'
import { updateListNpp } from '../../redux/doiTacSlice'
import { Popconfirm, message } from 'antd'
import { doiTacApi } from '../../api/doiTacApi'

const NhaPhanPhoi = () => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };

    const dispath = useDispatch();

    useEffect(() => {
        doiTacApi.apiGetNpp(headers).then((res) => {
            dispath(updateListNpp(res.data.content))
        }).catch((err) => {
            console.log(err)
        })

    }, [])

    const { listNpp } = useSelector((state) => state.doiTac)
    console.log("npp ", listNpp)

    const [keyword, setKeyword] = useState('')
    const handleSearch = (event) => {
        const { value } = event.target
        setKeyword(value)
        if (value !== '') {
            doiTacApi.apiTimNpp(headers, value).then((res) => {
                dispath(updateListNpp(res.data.content))
            }).catch((err) => {
                console.log(err)
            })
        } else {
            doiTacApi.apiGetNpp(headers).then((res) => {
                dispath(updateListNpp(res.data.content))
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    const recallDoiTac = () => {
        if (keyword !== '') {
            doiTacApi.apiTimNpp(headers, keyword).then((res) => {
                dispath(updateListNpp(res.data.content))
            }).catch((err) => {
                console.log(err)
            })
        } else {
            doiTacApi.apiGetNpp(headers).then((res) => {
                dispath(updateListNpp(res.data.content))
            }).catch((err) => {
                console.log(err)
            })

        }
    }

    const [maDoiTac, setMaDoiTac] = useState({})
    const [tenDoiTac, setTenDoiTac] = useState({})
    const [diaChi, setDiaChi] = useState({})
    const [mst, setMst] = useState({})
    const [nguoiLienHe, setNguoiLienHe] = useState({})
    const [soDt, setSoDt] = useState({})
    const [doiTac, setDoiTac] = useState({
        maDoiTac: '',
        tenDoiTac: '',
        diaChi: '',
        mst: '',
        nguoiLienHe: '',
        soDt: '',
        loaiDoiTac: 'npp'
    })
    const [editDoiTac, setEditDoiTac] = useState({})


    const handleTaoDoiTac = () => {
        const data = {
            loaiDt: 'npp'
        }
        doiTacApi.apiTaoDoiTac(headers, data).then((res) => {
            const { statusCode } = res.data
            if (statusCode === 200) {
                recallDoiTac()
                message.success('Đã thêm nhà phân phối', 1)
            } else {
                message.warning('Lỗi thêm nhà phân phối', 1)

            }
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleChangeInput = (event, item) => {
        const { name, value } = event.target
        const { dtId } = item
        if (name === 'maDoiTac') {
            setMaDoiTac({
                [dtId]: value
            })
        } else if (name === 'tenDoiTac') {
            setTenDoiTac({
                [dtId]: value
            })
        } else if (name === 'diaChi') {
            setDiaChi({
                [dtId]: value
            })
        } else if (name === 'mst') {
            setMst({
                [dtId]: value.replace(/[^0-9]/g, "")
            })
        } else if (name === 'nguoiLienHe') {
            setNguoiLienHe({
                [dtId]: value
            })
        } else if (name === 'soDt') {
            setSoDt({
                [dtId]: value.replace(/[^0-9]/g, "")
            })
        }
        setEditDoiTac({
            ...item,
            // pnId: +pnId,
            [name]: value.trim()
        })
    }

    const handleBlurInput = (event) => {
        const { name, value } = event.target
        // console.log(editDoiTac)
        if (value !== '') {
            doiTacApi.apiCapNhatNpp(headers, editDoiTac).then((res) => {
                const { statusCode } = res.data
                if (statusCode === 209) {
                    if (name === 'maDoiTac') {
                        message.warning('Mã Npp đã tồn tại', 0)
                    } else if (name === 'tenDoiTac') {
                        message.warning('Tên Npp đã tồn tại', 0)
                    }
                } else if (statusCode === 200) {
                    //cập nhật lại dữ liệu
                    if (name === 'maDoiTac') {
                        message.success('Đã cập nhật mã Npp', 1)
                    } else if (name === 'tenDoiTac') {
                        message.success('Đã cập nhật tên Npp', 1)
                    } else if (name === 'diaChi') {
                        message.success('Đã cập nhật địa chỉ Npp', 1)
                    } else if (name === 'mst') {
                        message.success('Đã cập nhật mã số thuế Npp', 1)
                    } else if (name === 'nguoiLienHe') {
                        message.success('Đã cập nhật người liên hệ', 1)
                    } else if (name === 'soDt') {
                        message.success('Đã cập nhật số điện thoại', 1)
                    }
                    message.destroy()
                    recallDoiTac()
                    setEditDoiTac({})
                }

            }).catch((err) => {
                console.log(err)
            })
        } else {
            message.warning("Vui lòng nhập dữ liệu", 1)
        }

    }

    const handleXoaDoiTac = (dtId) => {
        doiTacApi.apiXoaDoiTac(headers, +dtId).then((res) => {
            const { statusCode } = res.data;
            if (statusCode === 200) {
                recallDoiTac()
                message.success('Đã xoá nhà phân phối', 1)
            } else {
                message.error('Lỗi xoá nhà phân phối', 1)
            }
        }).catch((err) => {
            console.log(err)
        })
    }


    return (
        <div className='partner'>
            {/* <h2>Danh sách nhà phân phối</h2> */}
            {/* <button type='button' onClick={handleTaoDoiTac}>
                <i className="fa-solid fa-plus"></i>
            </button> */}
            <div className="inputItem">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type="text" placeholder='Tìm kiếm nhà phân phối...'
                    name='search'
                    value={keyword}
                    onChange={handleSearch}
                />
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <td>
                                Mã Npp
                            </td>
                            <td>
                                Tên nhà phân phối
                            </td>
                            <td>
                                Địa chỉ
                            </td>
                            <td>
                                Mã số thuế
                            </td>
                            <td>
                                Người liên hệ
                            </td>
                            <td>
                                Số điện thoại
                            </td>
                            <td className='center'>
                                <i className="fa-solid fa-plus" onClick={handleTaoDoiTac}></i>
                            </td>
                        </tr>
                    </thead>
                    {listNpp.length > 0 ? (

                        <tbody>
                            {
                                listNpp?.map((item) => {
                                    const { dtId } = item
                                    return (
                                        <tr key={item.dtId}>
                                            <td className='maDoiTac'>
                                                <div className="inputItem">
                                                    <input type="text"
                                                        name='maDoiTac'
                                                        value={
                                                            maDoiTac[dtId] !== undefined ? maDoiTac[dtId]
                                                                : item.maDoiTac === null ? ''
                                                                    : item.maDoiTac
                                                        }
                                                        onChange={(event) => handleChangeInput(event, item)}
                                                        onBlur={handleBlurInput}
                                                    />
                                                </div>
                                            </td>
                                            <td className='tenDoiTac'>
                                                <div className="inputItem">
                                                    <input type="text"
                                                        name='tenDoiTac'
                                                        value={
                                                            tenDoiTac[dtId] !== undefined ? tenDoiTac[dtId]
                                                                : item.tenDoiTac === null ? ''
                                                                    : item.tenDoiTac
                                                        }
                                                        onChange={(event) => handleChangeInput(event, item)}
                                                        onBlur={handleBlurInput}

                                                    />
                                                </div>
                                            </td>
                                            <td className='diaChi'>
                                                <div className="inputItem">
                                                    <input type="text"
                                                        name='diaChi'
                                                        value={
                                                            diaChi[dtId] !== undefined ? diaChi[dtId]
                                                                : item.diaChi === null ? ''
                                                                    : item.diaChi
                                                        }
                                                        onChange={(event) => handleChangeInput(event, item)}
                                                        onBlur={handleBlurInput}

                                                    />
                                                </div>
                                            </td>
                                            <td className='mst'>
                                                <div className="inputItem">
                                                    <input type="text"
                                                        name='mst'
                                                        value={
                                                            mst[dtId] !== undefined ? mst[dtId]
                                                                : item.mst === null ? ''
                                                                    : item.mst
                                                        }
                                                        onChange={(event) => handleChangeInput(event, item)}
                                                        onBlur={handleBlurInput}

                                                    />
                                                </div>
                                            </td>
                                            <td className='nguoiLienHe'>
                                                <div className="inputItem">
                                                    <input type="text"
                                                        name='nguoiLienHe'
                                                        value={
                                                            nguoiLienHe[dtId] !== undefined ? nguoiLienHe[dtId]
                                                                : item.nguoiLienHe === null ? ''
                                                                    : item.nguoiLienHe
                                                        }
                                                        onChange={(event) => handleChangeInput(event, item)}
                                                        onBlur={handleBlurInput}

                                                    />
                                                </div>
                                            </td>
                                            <td className='soDt'>
                                                <div className="inputItem">
                                                    <input type="text"
                                                        name='soDt'
                                                        value={
                                                            soDt[dtId] !== undefined ? soDt[dtId]
                                                                : item.soDt === null ? ''
                                                                    : item.soDt
                                                        }
                                                        onChange={(event) => handleChangeInput(event, item)}
                                                        onBlur={handleBlurInput}

                                                    />
                                                </div>
                                            </td>
                                            <td className='thaoTac'>

                                                <Popconfirm
                                                    title="Xoá nhà phân phối"
                                                    description="Bạn có muốn xoá nhà phân phối?"
                                                    onConfirm={() => handleXoaDoiTac(dtId)}
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
        </div>
    )
}

export default NhaPhanPhoi