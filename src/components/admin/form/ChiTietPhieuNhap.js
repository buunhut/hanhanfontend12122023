import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { capitalizeFirstLetter } from '../../../service/functions'
import { callApi } from '../../../api/callApi'
import { Popconfirm, Select, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { updateListPhieuNhapMoiTao, updatePhieuNhapActi } from '../../../redux/nhapHangSlice'
import { phieuApi } from '../../../api/phieuApi'
import { chiTietApi } from '../../../api/chiTietApi'

const ChiTietPhieuNhap = ({ item }) => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };

    const dispath = useDispatch();
    const recallListPhieuNhapMoiTao = () => {
        phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
            dispath(updateListPhieuNhapMoiTao(res.data.content))
            // if (res.data.content.length > 0) {
            //     dispath(updatePhieuNhapActi(res.data.content[0].pId))
            // }
        })
    }
    // console.log(item)

    const { bangChiTiet, doiTac } = item
    const tongTien = bangChiTiet.reduce((total, item) => total + item.thanhTien, 0)
    const tongSoLuong = bangChiTiet.reduce((total, item) => total + item.soLuong, 0)
    const [thanhToan, setThanhToan] = useState(tongTien)
    let sortBangChiTiet = [...bangChiTiet].sort((a, b) => b.dId - a.dId)


    useEffect(() => {
        setThanhToan(tongTien)
    }, [tongTien])

    useEffect(() => {
        recallListPhieuNhapMoiTao()
    }, [])

    const { listNpp } = useSelector((state) => state.doiTac)

    const [npp, setNpp] = useState({
        maDoiTac: doiTac.maDoiTac,
        tenDoiTac: doiTac.tenDoiTac,
        diaChi: doiTac.diaChi,
        mst: doiTac.mst,
        soDt: doiTac.soDt,
        nguoiLienHe: doiTac.nguoiLienHe
    })
    // console.log(npp)

    const handleChangeNpp = (value) => {
        if (value) {
            const findNpp = listNpp.find((item) => item.dtId === value)
            setNpp({
                ...findNpp
            })
            const data = {
                ngay: item.ngay,
                pId: item.pId,
                dtId: + value,
                ghiChu,
            }
            // phieuApi.apiCapNhatThongTin(headers, data).then((res) => {
            //     const { statusCode } = res.data;
            //     if (statusCode === 200) {
            //         callApi.apiPhieuNhapMoiTao(headers).then((res) => {
            //             dispath(updateListPhieuNhapMoiTao(res.data.content))
            //         })
            //     }
            // }).catch((err) => {
            //     console.log((err))
            // })
        }
    }

    const [ghiChu, setGhiChu] = useState(item.ghiChu)
    const handleChangeGhiChu = (event) => {
        const { value } = event.target
        setGhiChu(value)
        const data = {
            ngay: item.ngay,
            pId: item.pId,
            dtId: item.dtId,
            ghiChu: value
        }
        // callApi.apiCapNhatThongTin(headers, data).then((res) => {
        //     const { statusCode } = res.data;
        //     if (statusCode === 200) {
        //         callApi.apiPhieuNhapMoiTao(headers).then((res) => {
        //             dispath(updateListPhieuNhapMoiTao(res.data.content))
        //         })
        //     }
        // }).catch((err) => {
        //     console.log((err))
        // })
    }

    const [editSoLuong, setEditSoLuong] = useState({})
    const handleChangeSoLuong = (event, item) => {
        const { value } = event.target
        const { dId, donGia } = item
        setEditSoLuong({
            [dId]: +value.replace(/[^0-9]/g, "")
        })
        const data = {
            dId,
            donGia,
            soLuong: +value.replace(/[^0-9]/g, "")
        }
        phieuApi.apiSuaChiTiet(headers, data).then((res) => {
            const { statusCode } = res.data
            if (statusCode === 200) {
                phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
                    if (res.data.content.length > 0) {
                        dispath(updateListPhieuNhapMoiTao(res.data.content))
                    }
                })
                // recallListPhieuNhapMoiTao()
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    const [editDonGia, setEditDonGia] = useState({})
    const handleChangeDonGia = (event, item) => {
        const { value } = event.target
        const { dId, soLuong, } = item
        setEditDonGia({
            [dId]: +value.replace(/[^0-9]/g, "")
        })
        const data = {
            dId,
            donGia: +value.replace(/[^0-9]/g, ""),
            soLuong,
        }
        // console.log(data)
        phieuApi.apiSuaChiTiet(headers, data).then((res) => {
            const { statusCode } = res.data
            if (statusCode === 200) {
                phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
                    if (res.data.content.length > 0) {
                        dispath(updateListPhieuNhapMoiTao(res.data.content))
                    }
                })
                // recallListPhieuNhapMoiTao()
            }
        }).catch((err) => {
            console.log(err)
        })

    }
    const handleBlurInput = () => {
        setEditDonGia({})
        setEditSoLuong({})
    }

    const handleChangeThanhToan = (event) => {
        const { value } = event.target
        if (value) {
            setThanhToan(+value.replace(/[^0-9]/g, ""))
        } else {
            setThanhToan('')
        }
    }

    const handleXoaChiTietNhap = (item) => {
        const { dId } = item
        chiTietApi.apiXoaChiTiet(headers, dId).then((res) => {
            const { statusCode } = res.data;
            console.log(statusCode)
            if (statusCode === 200) {
                phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
                    if (res.data.content.length > 0) {
                        dispath(updateListPhieuNhapMoiTao(res.data.content))
                    }
                })
                message.success('Đã xoá sản phẩm', 2)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleXoaPhieuNhap = (item) => {
        const { pId } = item;
        phieuApi.apiXoaPhieuMoiTao(headers, pId).then((res) => {
            const { statusCode } = res.data
            if (statusCode === 200) {
                // message.success('Đã xoá phiếu', 2)
                phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
                    dispath(updateListPhieuNhapMoiTao(res.data.content))
                    dispath(updatePhieuNhapActi(res.data.content[0]?.pId))
                })

            }
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleLuuPhieuNhap = (item) => {
        const { pId } = item
        const data = {
            pId,
            soTien: +tongTien,
            thanhToan,
            ghiChu
        }
        // console.log(data)
        phieuApi.apiLuuPhieuMoiTao(headers, data).then((res) => {
            const { statusCode } = res.data;
            if (statusCode === 200) {
                phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
                    dispath(updateListPhieuNhapMoiTao(res.data.content))
                    dispath(updatePhieuNhapActi(res.data.content[0]?.pId))
                })

            }
        }).catch((err) => {
            console.log(err)
        })
    }



    return (
        <div className='phieuNhap'>
            <h3>PHIẾU: {item.soPhieu?.toUpperCase()}</h3>
            <div className='thongTin'>
                <div className="groupItem">
                    <div className="inputItem">
                        <i className="fa-solid fa-calendar-days"></i>
                        <p>{moment(item.ngay).format("DD/MM/YYYY")}</p>
                    </div>
                    <div className="inputItem">
                        <i className="fa-solid fa-users"></i>
                        {/* <input defaultValue={partners.tenDoiTac.toUpperCase()} disabled /> */}
                        <Select
                            bordered={false}
                            showSearch
                            style={{
                                width: '100%',
                            }}
                            placeholder="Chọn nhà phân phối"
                            onChange={handleChangeNpp}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            value={npp.maDoiTac.toUpperCase()}
                        >
                            {
                                listNpp?.map((item) => (
                                    <Select.Option key={item.dtId} value={item.dtId} label={item.maDoiTac.toUpperCase()}>
                                        {item.maDoiTac.toUpperCase()}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </div>


                    <div className="inputItem">
                        <i className="fa-solid fa-pen"></i>
                        <input type="text" value={capitalizeFirstLetter(ghiChu)}
                            placeholder='Ghi chú'
                            onChange={handleChangeGhiChu}
                        />
                    </div>
                </div>
            </div>
            <div>
                {
                    sortBangChiTiet.length > 0 ?
                        (
                            <div className="thongTin">
                                <table>
                                    <thead>
                                        <tr>
                                            <td className='right stt'>STT</td>
                                            <td>Tên sản phẩm</td>
                                            <td className='dvt'>ĐVT</td>
                                            <td className='right soLuong'>Số lượng</td>
                                            <td className='right donGia'>Đơn giá</td>
                                            <td className='right thanhTien'>Thành tiền</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortBangChiTiet?.map((item, index) => {
                                            // console.log(item)

                                            return (
                                                <tr key={index}>
                                                    <td className='right xoa'>
                                                        <Popconfirm
                                                            title="Xoá chi tiết nhập"
                                                            description="Bạn có muốn xoá dòng này?"
                                                            onConfirm={() => handleXoaChiTietNhap(item)}
                                                            // onCancel={cancel}
                                                            placement="right"
                                                            okText="Có"
                                                            cancelText="Không"
                                                        >
                                                            <span>{index + 1}</span>
                                                        </Popconfirm>
                                                    </td>
                                                    <td className='ten'>
                                                        {item.tenSp}
                                                    </td>
                                                    <td className='ten'>
                                                        {item.dvt}
                                                    </td>
                                                    <td>
                                                        <div className=" right">
                                                            <input type="text" value={
                                                                editSoLuong[item.dId] !== undefined ?
                                                                    editSoLuong[item.dId] === 0 ? '' :
                                                                        editSoLuong[item.dId].toLocaleString()
                                                                    : item.soLuong.toLocaleString()
                                                            }
                                                                onChange={(event) => handleChangeSoLuong(event, item)}
                                                                onBlur={handleBlurInput}

                                                            />

                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className=" right">
                                                            <input type="text" value={
                                                                editDonGia[item.dId] !== undefined ?
                                                                    editDonGia[item.dId] === 0 ? '' :
                                                                        editDonGia[item.dId].toLocaleString()
                                                                    : item.donGia.toLocaleString()
                                                            }

                                                                onChange={(event) => handleChangeDonGia(event, item)}
                                                                onBlur={handleBlurInput}
                                                            />

                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className=" right">
                                                            <input type="text"
                                                                value={item.thanhTien.toLocaleString()}
                                                                disabled style={{ color: 'black' }}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        )
                                        }
                                    </tbody>
                                    <thead className='bottom'>
                                        <tr>
                                            <td colSpan={3} className='right'>
                                                <b>Tổng cộng : </b>
                                            </td>
                                            <td className=" right">
                                                <b>{tongSoLuong?.toLocaleString()}</b>
                                            </td>
                                            <td></td>
                                            <td>
                                                <div className=" right">
                                                    <input type="text"
                                                        value={tongTien?.toLocaleString()}
                                                        disabled style={{ color: 'black', fontWeight: 'bold' }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} className='right'>
                                                <b>Thanh toán : </b >
                                            </td>
                                            <td colSpan={3}>
                                                <div className="right">
                                                    <input type="text"
                                                        value={thanhToan?.toLocaleString() || ''}
                                                        placeholder=''
                                                        onChange={handleChangeThanhToan}
                                                        style={{ fontWeight: 'bold' }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} className='right'>
                                                <b>Còn nợ : </b>
                                            </td>
                                            <td colSpan={3}>
                                                <div className=" right">
                                                    <input type="text"
                                                        value={(tongTien - thanhToan).toLocaleString()}
                                                        disabled style={{ color: 'black', fontWeight: 'bold' }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    </thead>
                                </table>
                            </div>



                        )
                        : null
                }


            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                <button type='button' onClick={() => handleLuuPhieuNhap(item)}>
                    <i className="fa-regular fa-floppy-disk"></i>
                </button>
                <button type='button'><i className="fa-solid fa-print"></i></button>

                <Popconfirm
                    title="Xoá phiếu nhập"
                    description="Bạn có muốn xoá phiếu nhập này?"
                    onConfirm={() => handleXoaPhieuNhap(item)}
                    // onCancel={cancel}
                    placement="left"
                    okText="Có"
                    cancelText="Không"
                >
                    <button type='button'>
                        <i className="fa-regular fa-trash-can"></i>
                    </button>
                </Popconfirm>


            </div>

        </div >
    )
}

export default ChiTietPhieuNhap