import React, { useEffect, useState } from 'react'
import './xulydonhang.scss'

import { useDispatch, useSelector } from 'react-redux'
import { callApi } from '../../api/callApi';
import { updateListOrderByShop, updateListTrangThai } from '../../redux/orderSlice';
import moment from 'moment';
import { capitalizeFirstLetter } from '../../service/functions';
import { Popconfirm, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { donHangApi } from '../../api/donHangApi';
import { updateListNhanVienByShop } from '../../redux/nhanVienSlice';
import { nhanVienApi } from '../../api/nhanVienApi';

const XuLyDonHang = () => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };

    const dispath = useDispatch()
    const callListOrderByShop = () => {
        // donHangApi.apiChiTietDonHangByShop(headers).then((res) => {
        //     dispath(updateListOrderByShop(res.data.content))
        // })

        let data = sortOrder
        donHangApi.apiSortDonHang(headers, data).then((res) => {
            dispath(updateListOrderByShop(res.data.content))
        }).catch((err) => {
            console.log(err)
        })


    }
    const callListNhanVien = () => {
        nhanVienApi.apiGetNhanVienByShop(headers).then((res) => {
            dispath(updateListNhanVienByShop(res.data.content))
        })
    }
    const callListTrangThai = () => {
        donHangApi.apiGetListTrangThai(headers).then((res) => {
            dispath(updateListTrangThai(res.data.content))
        })
    }


    useEffect(() => {
        callListOrderByShop()
        callListNhanVien()
        callListTrangThai()
    }, [])


    let { listOrderByShop } = useSelector((state) => state.order)
    let { listTrangThai } = useSelector((state) => state.order)
    let { listNhanVienByShop } = useSelector((state) => state.nhanVien)


    // console.log(listNhanVienByShop)
    // console.log(listOrderByShop)

    const [sortOrder, setSortOrder] = useState({
        trangThai: '',
        nguoiGiao: '',
        keyword: '',
        from: '',
        to: ''
    })


    const [thanhToan, setThanhToan] = useState({})
    // const [nguoiGiao, setNguoiGiao] = useState({})

    //cập nhật thanh toán
    const [duTien, setDuTien] = useState({})
    const handleChangeThanhToan = (event, item) => {
        const { id, value } = event.target;
        const { oId, tienHang, phiVc, traVi } = item
        const tongTien = tienHang + phiVc
        const thanhToan = +value.replace(/[^0-9]/g, '')
        // console.log(tongTien, thanhToan)
        let data = {}
        setThanhToan((prevState) => ({
            ...prevState,
            [oId]: +value.replace(/[^0-9]/g, '')
        }))
        data = {
            oId,
            [id]: +value.replace(/[^0-9]/g, ''),
        }
        if (thanhToan > tongTien - traVi) {
            setDuTien({ [oId]: 'Lỗi' })

            message.warning('Số tiền nhập dư', 0)

        } else {
            setDuTien({})

            message.destroy()
            donHangApi.apiCapNhatThanhToan(headers, data).then((res) => {
                const { statusCode } = res.data
                if (statusCode === 200) {
                    callListOrderByShop()
                    callListTrangThai()
                }
            }).catch((err) => {
                console.log(err)
            })
        }

    }

    //cập nhật người giao
    const handleChangeNguoiGiao = (event, item) => {
        console.log(event.target)
        const { value } = event.target
        const { oId } = item
        const data = {
            oId,
            nguoiGiao: value
        }
        // console.log(data)
        donHangApi.apiCapNhatNguoiGiao(headers, data).then((res) => {
            const { statusCode } = res.data
            if (statusCode === 200) {
                callListOrderByShop()
                callListTrangThai()
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    //huỷ đơn hàng, giao hàng không thành công
    const handleHuyDonHang = (item) => {
        const { oId } = item
        donHangApi.apiHuyDonHangByShop(headers, oId).then((res) => {
            const { statusCode } = res.data
            if (statusCode === 200) {
                // callListOrderByShop()
                callListTrangThai()
                callListOrderByShop()
                // let data = sortOrder
                // donHangApi.apiSortDonHang(headers, data).then((res) => {
                //     dispath(updateListOrderByShop(res.data.content))
                // }).catch((err) => {
                //     console.log(err)
                // })
                message.success('Đã huỷ đơn', 2)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    let tongTienHang = 0;
    let tongPhiVc = 0;
    let tongThanhToan = 0;
    let tongConNo = 0;
    let tongTraVi = 0;

    const [print, setPrint] = useState(false)
    const [orderDetails, setOrderDetails] = useState({})

    //xử lý in
    const navigate = useNavigate();

    const handlePrintOrder = (item) => {
        window.open(`/in-don-hang/${item.oId}`, '_blank');
    }
    //sort
    //sort dữ liệu
    const handleSortOrder = (event) => {
        let data = {
            nguoiGiao: '',
            keyword: '',
            from: '',
            to: ''
        }
        const { id, value } = event.target
        if (id === 'from' || id === 'to') {
            setSortOrder((prevState) => ({
                ...prevState,
                [id]: moment.utc(value, 'YYYY-MM-DD').toDate(),
            }))
            data = {
                ...sortOrder,
                [id]: moment.utc(value, 'YYYY-MM-DD').toDate(),

            }
        } else {
            setSortOrder((prevState) => ({
                ...prevState,
                [id]: value
            }))
            data = {
                ...sortOrder,
                [id]: value

            }
        }
        donHangApi.apiSortDonHang(headers, data).then((res) => {
            dispath(updateListOrderByShop(res.data.content))
        }).catch((err) => {
            console.log(err)
        })


        //gọi aip
        // callApi.apiSortOrder(headers, data).then((res) => {
        //     dispath(updateListOrder(res.data.content))
        // }).catch((err) => {
        //     console.log(err)
        // })
        // const { keyword, from, to } = data

    }

    return (
        <div id='xuLyDonHang'>
            <h2>Danh sách đơn hàng</h2>

            <div className="groupItem">
                <div className="inputItem">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder='Tìm đơn hàng, khách hàng,...'
                        // onChange={handleChangeTimKiem}
                        id='keyword'
                        onChange={handleSortOrder}
                    />
                </div>
                <div className="inputItem">
                    <input type="date" id='from' className='date'
                        onChange={handleSortOrder}
                    />
                </div>
                <div className="inputItem">
                    <input type="date" id='to' className='date'
                        onChange={handleSortOrder}
                    />
                </div>
                <div className='inputItem'>
                    <i className="fa-solid fa-circle-info"></i>
                    <select name="trangThai" id="trangThai"
                        // onChange={handleSortNguoiGiao}
                        onChange={handleSortOrder}

                    >
                        <option value="">Tất cả</option>
                        {/* <option value="chờ xử lý">Chờ xử lý</option>
                        <option value="đang giao">Đang giao</option>
                        <option value="đã giao">Đã giao</option>
                        <option value="">Đã huỷ</option> */}
                        {
                            listTrangThai?.map((item, index) => {
                                return (
                                    <option key={index} value={item} >{capitalizeFirstLetter(item)}</option>
                                )

                            })
                        }
                    </select>

                </div>
                <div className='inputItem'>
                    <i className="fa-solid fa-user-group"></i>
                    <select name="nguoiGiao" id="nguoiGiao"
                        // onChange={handleSortNguoiGiao}
                        onChange={handleSortOrder}

                    >
                        <option value="">Tất cả</option>
                        {
                            listNhanVienByShop?.map(item => {
                                const { nvId, tenNhanVien } = item
                                return (
                                    <option key={nvId} value={tenNhanVien} >{capitalizeFirstLetter(tenNhanVien)}</option>
                                )

                            })
                        }
                    </select>

                </div>
            </div>
            {
                listOrderByShop.length > 0 ? (
                    <table className='listOrder'>
                        <thead>
                            <tr>
                                {/* <td className='oId'>
                                oId
                            </td> */}
                                <td className='ngay'>
                                    Ngày
                                </td>
                                <td className='ten'>
                                    Khách khàng
                                </td>
                                {/* <td className='soDt'>
                                Điện thoại
                            </td>
                            <td className='diaChi'>
                                Địa chỉ
                            </td> */}
                                <td className='tien'>
                                    Tiền hàng
                                </td>
                                {/* <td className='tien'>
                                Phí Vc
                            </td> */}
                                <td className='tien'>
                                    Tổng tiền
                                </td>
                                <td className='tien'>
                                    Trả ví
                                </td>
                                <td className='tien'>
                                    Tiền mặt
                                </td>
                                <td className='tien'>
                                    Còn nợ
                                </td>
                                <td className='ghiChu'>
                                    Ghi chú
                                </td>
                                <td className='trangThai'>
                                    Trạng thái
                                </td>
                                <td className='ten'>
                                    Người giao
                                </td>
                                <td colSpan={2}>Thao tác</td>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                listOrderByShop?.map((item, index) => {
                                    const { oId, ngay, soDonHang, trangThai, nguoiGiao, tienHang, phiVc, ghiChu, users, traVi } = item
                                    const conNo = (tienHang + phiVc) - item.thanhToan - item.traVi
                                    // console.log(nguoiGiao)
                                    if (trangThai !== 'đã huỷ') {
                                        tongTienHang += tienHang;
                                        tongPhiVc += phiVc
                                        tongThanhToan += item.thanhToan;
                                        tongTraVi += item.traVi;
                                        tongConNo = (tongTienHang + tongPhiVc) - (tongThanhToan);
                                    }
                                    return (
                                        <tr key={index} className='item'>
                                            <td>
                                                <p>
                                                    {moment(ngay).format('hh:mm DD/MM/YYYY')}
                                                </p>
                                                <p style={{ color: 'silver' }}>{soDonHang}</p>
                                            </td>

                                            <td className='ten'>
                                                <p>
                                                    {users.hoTen} - {users.soDt.replace('+84', '0')}
                                                </p>
                                                <p style={{ color: 'silver' }}>
                                                    {users.diaChi}
                                                </p>
                                            </td>

                                            <td className='tien'>
                                                <p>
                                                    {tienHang.toLocaleString()}
                                                </p>
                                                <p style={{ color: 'silver' }}>
                                                    {phiVc.toLocaleString()}
                                                </p>
                                            </td>

                                            <td className='tien'>
                                                {(tienHang + phiVc).toLocaleString()}
                                            </td>
                                            <td className='tien'>
                                                {(traVi).toLocaleString()}
                                            </td>

                                            <td className='tien'>
                                                <input type="text"
                                                    id='thanhToan'
                                                    disabled={trangThai === 'chờ xử lý' || trangThai === 'đã huỷ' ? true : false}
                                                    value={
                                                        thanhToan[oId] !== undefined ?
                                                            thanhToan[oId] === 0 ? '' :
                                                                Number(thanhToan[oId]).toLocaleString()
                                                            : item.thanhToan === 0 ? '' : item.thanhToan.toLocaleString()
                                                    }
                                                    onChange={(event) => handleChangeThanhToan(event, item)}
                                                />
                                            </td>

                                            <td className='tien' style={{ color: conNo > 0 ? 'red' : '' }}>
                                                {
                                                    duTien[oId] ? 'Lỗi' :
                                                        (conNo).toLocaleString()
                                                }
                                            </td>

                                            <td>
                                                {capitalizeFirstLetter(ghiChu)}
                                            </td>

                                            <td>
                                                {capitalizeFirstLetter(trangThai)}
                                            </td>

                                            <td className='ten'>
                                                {
                                                    trangThai === 'chờ khách lấy' ? (
                                                        <select name="nguoiGiao" id="nguoiGiao"
                                                            onChange={(event) => handleChangeNguoiGiao(event, item)}
                                                            disabled={trangThai === 'đã giao' || trangThai === 'đã huỷ' ? true : false}
                                                        >
                                                            <option value={nguoiGiao} >{nguoiGiao}</option>
                                                            <option value={'Tự lấy'} >{'Tự lấy'}</option>
                                                        </select>

                                                    ) : nguoiGiao === 'Tự lấy' ? (
                                                        <select name="nguoiGiao" id="nguoiGiao"
                                                            onChange={(event) => handleChangeNguoiGiao(event, item)}
                                                            disabled={trangThai === 'đã giao' || trangThai === 'đã huỷ' ? true : false}
                                                        // value={nguoiGiao}
                                                        >

                                                            <option value={nguoiGiao} >{capitalizeFirstLetter(nguoiGiao)}</option>
                                                        </select>
                                                    ) :
                                                        (
                                                            <select name="nguoiGiao" id="nguoiGiao"
                                                                onChange={(event) => handleChangeNguoiGiao(event, item)}
                                                                disabled={trangThai === 'đã giao' || trangThai === 'đang giao' || trangThai === 'đã huỷ' ? true : false}
                                                            // value={nguoiGiao}
                                                            >

                                                                <option value={nguoiGiao} >{nguoiGiao}</option>
                                                                {
                                                                    listNhanVienByShop?.map(item => {
                                                                        const { nvId, tenNhanVien } = item
                                                                        return (
                                                                            <option key={nvId} value={tenNhanVien} >{capitalizeFirstLetter(tenNhanVien)}</option>
                                                                        )

                                                                    })
                                                                }

                                                            </select>
                                                        )
                                                }
                                            </td>

                                            <td>
                                                <i className="fa-solid fa-print"
                                                    onClick={() => handlePrintOrder(item)}
                                                ></i>
                                            </td>

                                            <td>
                                                {
                                                    trangThai === 'đã giao' || trangThai === 'đã huỷ' ? (<i className="fa-regular fa-trash-can" style={{ color: 'silver', cursor: 'not-allowed' }}></i>)
                                                        : (
                                                            <Popconfirm
                                                                title="Huỷ đơn hàng"
                                                                description={`Bạn có muốn huỷ đơn ${item.soDonHang} ?`}
                                                                onConfirm={() => handleHuyDonHang(item)}
                                                                // onCancel={cancel}
                                                                placement="left"
                                                                okText="Có"
                                                                cancelText="Không"
                                                            >
                                                                <i className="fa-regular fa-trash-can" style={{ color: 'red' }}></i>
                                                            </Popconfirm>
                                                        )
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            <tr className='total'>
                                <th colSpan={2}>Tổng tiền</th>
                                <th className='tien'>
                                    <p>
                                        {tongTienHang.toLocaleString()}
                                    </p>
                                    <p>
                                        {tongPhiVc.toLocaleString()}
                                    </p>
                                </th>
                                <th className='tien'>{(tongTienHang + tongPhiVc).toLocaleString()}</th>
                                <th className='tien'>{(tongTraVi).toLocaleString()}</th>
                                <th className='tien'>{tongThanhToan.toLocaleString()}</th>
                                <th className='tien'>{tongConNo.toLocaleString()}</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>

                        </tbody>

                    </table>

                ) : (<h3>Không có dữ liệu</h3>)
            }


            <div className='overlay'
                style={{ display: print ? 'block' : 'none' }}
                onClick={() => setPrint(false)}

            ></div>

        </div >
    )
}

export default XuLyDonHang