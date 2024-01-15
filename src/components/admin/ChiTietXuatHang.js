import React, { useEffect, useState } from 'react'
import './chitietnhaphang.scss'
import { useDispatch, useSelector } from 'react-redux';
import { callApi } from '../../api/callApi';
import { updateListChiTietXuat } from '../../redux/chiTietNhapSlice';
import moment from 'moment';
import { capitalizeFirstLetter } from '../../service/functions';
import { useNavigate } from 'react-router-dom';
import { updateListPhieuNhapMoiTao, updatePhieuNhapActi } from '../../redux/nhapHangSlice';
import { chiTietApi } from '../../api/chiTietApi';
import { phieuApi } from '../../api/phieuApi';
import { doiTacApi } from '../../api/doiTacApi';
import { updateListKh } from '../../redux/doiTacSlice';






const ChiTietXuatHang = () => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };
    const dispath = useDispatch();

    const recallChiTietXuat = () => {
        chiTietApi.apiGetChiTietXuat(headers).then((res) => {
            const { statusCode } = res.data
            dispath(updateListChiTietXuat(res.data.content))
        }).catch((err) => {
            console.log(err)
        })
    }

    let { listChiTietXuat } = useSelector((state) => state.chiTietNhap);
    // console.log(listChiTietXuat)
    const callKhachHang = () => {
        doiTacApi.apiGetKhachHang(headers)
            .then((res) => {
                dispath(updateListKh(res.data.content));
            })
            .catch((err) => {
                console.log(err);
            });
    }


    const { listKh } = useSelector((state) => state.doiTac);

    useEffect(() => {
        recallChiTietXuat()
        callKhachHang()

    }, [])

    const handleXoaChiTietNhap = (item) => {
        const { idId, imId, pId, quyDoi, soLuong, thanhTien } = item;
        const data = {
            idId, imId, pId, quyDoi, soLuong, thanhTien
        }
        callApi.apiXoaChiTietNhap(headers, data).then((res) => {
            const { statusCode } = res.data;
            if (statusCode === 200) {
                recallChiTietXuat()
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    const navigate = useNavigate()
    const handleSuaPhieuXuat = (pId) => {
        chiTietApi.apiSuaChiTietDaLuu(headers, +pId).then((res) => {
            // console.log(res.data)
            const { statusCode, content } = res.data
            if (statusCode === 200) {
                navigate('/quan-ly/xuat-hang');
            }
        }).catch((err) => {
            console.log(err)
        })
    }


    // const [sort, setSort] = useState({})

    // const handleChangeInput = async (event) => {
    //     let data = {}

    //     const { name, value } = event.target

    //     if (name === 'from' || name === 'to') {
    //         setSort((prevState) => ({
    //             ...prevState,
    //             [name]: moment.utc(value, 'YYYY-MM-DD').toDate(),
    //         }))
    //     } else {
    //         setSort((prevState) => ({
    //             ...prevState,
    //             [name]: value
    //         }))
    //     }
    //     if (name === 'from' || name === 'to') {

    //         data = {
    //             ...sort,
    //             [name]: moment.utc(value, 'YYYY-MM-DD').toDate(),
    //         }
    //     } else {
    //         data = {
    //             ...sort,
    //             [name]: value
    //         }
    //     }
    //     const api = await callApi.apiSortChiTietTheoNgay(headers, data)
    //     dispath(updateListChiTietXuat(api.data.content))
    // }

    let tongTien = 0;
    let tongSoLuong = 0;

    const [sortPhieu, setSortPhieu] = useState({
        from: '',
        to: '',
        dtId: '',
        locNo: ''
    })

    const handleChangeInput = (event) => {
        const { name, value } = event.target
        let data = {}
        if (name === 'dtId') {
            setSortPhieu((prevState) => ({
                ...prevState,
                [name]: Number(value)
            }))
            data = {
                ...sortPhieu,
                [name]: Number(value)
            }
            if (value === '') {
                setSortPhieu((prevState) => ({
                    ...prevState,
                    dtId: ''
                }))
            }
        } else {
            setSortPhieu((prevState) => ({
                ...prevState,
                [name]: value
            }))
            data = {
                ...sortPhieu,
                [name]: value
            }
        }
        phieuApi.apiSortPhieuXuat(headers, data).then((res) => {
            dispath(updateListChiTietXuat(res.data.content))
        }).catch((err) => {
            console.log(err)
        })
    }






    return (
        <div id='chiTietNhapHang'>
            <h2>
                Chi tiết xuất
            </h2>
            <div className='groupItem'>
                <div className="inputItem">
                    <input type="date" name='from' onChange={handleChangeInput} />
                </div>
                <div className="inputItem">
                    <input type="date" name='to' onChange={handleChangeInput} />
                </div>
                <div className="inputItem">
                    <select name="dtId" id="dtId" value={sortPhieu.dtId} onChange={handleChangeInput}>
                        <option value="">Tất cả</option>
                        {listKh?.map((item, index) => (
                            <option key={index} value={item.dtId}>
                                {item.maDoiTac}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="inputItem">
                    <input type="text" placeholder='Tên sản phẩm' name='tenSp' onChange={handleChangeInput} />
                </div>
            </div>
            {
                listChiTietXuat.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <td>Ngày</td>
                                <td>Phiếu số</td>
                                <td>Mã Khách hàng</td>
                                <td>
                                    Tên sản phẩm
                                </td>
                                <td>Đơn vị tính</td>
                                <td className='soLuong'>Số lượng</td>
                                <td className='donGia'>Đơn giá</td>
                                <td className='thanhTien'>Thành tiền</td>
                                {/* <td></td> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                listChiTietXuat?.map((item, index) => {
                                    const count = item.bangChiTiet?.length
                                    tongTien += item.bangChiTiet?.reduce((total, detail) => total + detail.thanhTien, 0);
                                    tongSoLuong += item.bangChiTiet?.reduce((total, detail) => total + detail.soLuong, 0);
                                    return item.bangChiTiet?.map((detail, detailIndex) => (
                                        <tr key={detailIndex}>
                                            {
                                                detailIndex === 0 && (
                                                    <>
                                                        <td rowSpan={count} className='ngayThang'>{moment(item.ngay).format("DD/MM/YYYY")}</td>
                                                        <td rowSpan={count} className='soPhieu'>{item.soPhieu.toUpperCase()}
                                                            <i className="fa-regular fa-pen-to-square"
                                                                onClick={() => handleSuaPhieuXuat(item.pId)}
                                                            ></i>

                                                        </td>
                                                        <td rowSpan={count} className='maNpp'>{item.doiTac ? item.doiTac.maDoiTac.toUpperCase() : ''}</td>
                                                    </>

                                                )
                                            }
                                            <td>{capitalizeFirstLetter(detail.tenSp)}</td>
                                            <td>{capitalizeFirstLetter(detail.dvt)}</td>
                                            <td className='soLuong'>{detail.soLuong?.toLocaleString()}</td>
                                            <td className='donGia'>{detail.donGia?.toLocaleString()}</td>
                                            <td className='thanhTien'>{detail.thanhTien?.toLocaleString()}</td>
                                            {/* <td className='xoa'><i className="fa-regular fa-trash-can"
                                                onClick={() => handleXoaChiTietNhap(detail)}
                                            ></i></td> */}

                                        </tr>
                                    ))
                                })
                            }
                            <tr>


                                <td colSpan={5}>Tổng</td>
                                <td className='soLuong'>{tongSoLuong?.toLocaleString()}</td>
                                <td></td>
                                <td className='thanhTien'>{tongTien?.toLocaleString()}</td>
                                {/* <td></td> */}
                            </tr>
                        </tbody>
                    </table>



                ) : (<h3>Không có dữ liệu</h3>)
            }


        </div>
    )
}

export default ChiTietXuatHang