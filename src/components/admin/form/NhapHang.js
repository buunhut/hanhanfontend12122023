import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, Popconfirm, Tabs, message, notification } from 'antd';
import './banhang.scss'
import PhieuNhapHang from './PhieuNhapHang';
import { useDispatch, useSelector } from 'react-redux';
import { phieuApi } from '../../../api/phieuApi';
import { updateListPhieuNhapMoiTao, updateListPhieuXuatMoiTao, updatePhieuNhapActi, updatePhieuXuatActi } from '../../../redux/nhapHangSlice';
import { updateSanPhamByShop } from '../../../redux/sanPhamSlice';
import { chiTietApi } from '../../../api/chiTietApi';
import moment from 'moment';
import confirm from 'antd/es/modal/confirm';
import { URL } from '../../../service/functions';
// const initialItems = [
//     {
//         label: 'Phiếu bán hàng',
//         children: <PhieuNhapHang soPhieu={1} />,
//         key: 1,
//         closable: false,
//     },
//     {
//         label: 'Phiếu bán hàng',
//         children: <PhieuNhapHang soPhieu={2} />,
//         key: 2,
//         closable: false,
//     },
//     {
//         label: 'Phiếu bán hàng',
//         children: <PhieuNhapHang soPhieu={3} />,
//         key: 3,
//         closable: false,
//     },

// ];

const NhapHang = () => {
    const dispath = useDispatch();
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };
    const { listPhieuNhapMoiTao } = useSelector((state) => state.nhapHang)

    let { phieuNhapActi } = useSelector((state) => state.nhapHang)
    // console.log(phieuXuatActi)
    // const [phieu, setPhieu] = useState(phieuXuatActi)

    const inputRef = useRef(null);

    const [search, setSearch] = useState(false)
    const [firstF3Press, setFirstF3Press] = useState(true);

    // console.log(search)

    //F3
    const handleF3KeyPress = (event) => {
        if (event.key === 'F3') {
            setKeyword('')
            recallSanPhamByShop()
            if (firstF3Press) {
                setSearch(!search);
                setFirstF3Press(!firstF3Press);
            } else {
                setSearch(!search);
                setFirstF3Press(!firstF3Press);
            }
            inputRef.current.focus();
        }
    };




    useEffect(() => {
        phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
            // console.log(res.data.content)
            dispath(updateListPhieuNhapMoiTao(res.data.content))
            if (res.data.content.length > 0) {
                dispath(updatePhieuNhapActi(res.data.content[0].pId))
            } else {
                add()
            }
        })
        phieuApi.apiGetSanPham(headers).then((res) => {
            if (res.data.content.length > 0) {
                dispath(updateSanPhamByShop(res.data.content))
            }
        });
        phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
            dispath(updateListPhieuNhapMoiTao(res.data.content))
            if (res.data.content.length > 0) {
                dispath(updatePhieuNhapActi(res.data.content[0].pId))
            } else {
                dispath(updatePhieuNhapActi(0))
            }
        }).catch((err) => {
            console.log(err)
        })
    }, [])


    useEffect(() => {
        // Bắt sự kiện keydown trên cả trang
        document.addEventListener('keydown', handleF3KeyPress);
        // Cleanup effect để tránh memory leaks
        return () => {
            document.removeEventListener('keydown', handleF3KeyPress);
        };
    }, [firstF3Press])

    useEffect(() => {
        recallPhieuNhapMoiTao()
        // console.log(phieuXuatActi)
    }, [phieuNhapActi])


    const recallPhieuNhapMoiTao = () => {
        phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
            dispath(updateListPhieuNhapMoiTao(res.data.content))
            // if (res.data.content.length > 0) {
            //     dispath(updatePhieuXuatActi(res.data.content[0].pId))
            // }
        }).catch((err) => {
            console.log(err)
        })
    }

    //set phiếu active khi tạo mới
    const setActive = () => {
        phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
            dispath(updateListPhieuNhapMoiTao(res.data.content))
            if (res.data.content.length > 0) {
                dispath(updatePhieuNhapActi(res.data.content[0].pId))
            } else {
                dispath(updatePhieuNhapActi(0))

            }
        }).catch((err) => {
            console.log(err)
        })
    }


    let { sanPhamByShop } = useSelector((state) => state.sanPham)
    const sortSp = [...sanPhamByShop].sort((a, b) => b.spId - a.spId)

    const recallListPhieuNhapMoiTao = () => {
        phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
            dispath(updateListPhieuNhapMoiTao(res.data.content));
            // dispath(updatePhieuNhapActi(res.data.content[0].pId))
        });
    };

    const [ngayThang, setNgayThang] = useState(moment().utc());
    const [giaBan, setGiaBan] = useState({});
    const [soLuong, setSoLuong] = useState({});

    const handleChangeGiaBan = (event, spId) => {
        const { value } = event.target;
        if (value) {
            setGiaBan((prevState) => ({
                ...prevState,
                [spId]: +value.replace(/[^0-9]/g, ""),
            }));
        } else {
            setGiaBan((prevState) => ({
                ...prevState,
                [spId]: "",
            }));
        }
    };

    const handleChangeSoLuong = (event, pId) => {
        const { value } = event.target;
        if (value) {
            setSoLuong((prevState) => ({
                ...prevState,
                [pId]: +value.replace(/[^0-9]/g, ""),
            }));
        } else {
            setSoLuong((prevState) => ({
                ...prevState,
                [pId]: 0,
            }));
        }
    };

    const handleNhapHang = (sanPham) => {
        console.log(sanPham)
        const { spId, kId, quyDoi, tenSp, dvt } = sanPham
        let price = 0;
        let qty = 0;
        // let exch = 0;
        if (soLuong[spId] !== undefined) {
            qty = soLuong[spId];
        } else {
            qty = 1;
        }

        if (giaBan[spId] !== undefined) {
            price = giaBan[spId];
        } else {
            price = sanPham.giaBan;
        }
        let data = {
            pId: +phieuNhapActi,
            spId,
            tenSp,
            dvt,
            kId,
            quyDoi,
            donGia: price,
            soLuong: qty,
        };

        // console.log(data)
        chiTietApi
            .apiThemChiTiet(headers, data)
            .then((res) => {
                const { statusCode } = res.data;
                if (statusCode === 200) {
                    recallListPhieuNhapMoiTao();
                    // setKeyword('')
                    setSearch(false)
                    message.success('Đã thêm sản phẩm', 2)
                    if (inputRef.current) {
                        inputRef.current.select();
                    }
                    setFirstF3Press(!firstF3Press)

                }
            })
            .catch((err) => {
                console.log(err);
            });

    };

    const recallSanPhamByShop = () => {
        phieuApi.apiGetSanPham(headers).then((res) => {
            dispath(updateSanPhamByShop(res.data.content));
        });
    };

    //tìm sản phẩm
    const [keyword, setKeyword] = useState('')
    const handleSearchSanPham = async (event) => {
        const { value } = event.target;
        setKeyword(value)
        if (value) {
            // console.log(value)
            setSearch(true)
            await phieuApi.apiTimSanPham(headers, value).then((res) => {
                if (res.data.content.length === 1 && phieuNhapActi) {
                    const sanPham = res.data.content[0]
                    handleNhapHang(sanPham)
                    // setSearch(false)
                    // setKeyword('')
                }
                dispath(updateSanPhamByShop(res.data.content));
                // setSanPhamByShop(res.data.content)
            })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            recallSanPhamByShop();
            setSearch(false)
        }
    };

    const handleClearSearch = () => {
        setSearch(false)
        setKeyword('')
    }

    // const handleClickSearchSanPham = () => {
    //     setSearch(!search)

    // }

    const [activeKey, setActiveKey] = useState(phieuNhapActi);
    const [items, setItems] = useState([]);
    // const newTabIndex = useRef(0);
    const onChange = (key) => {
        // setPhieu(key)
        dispath(updatePhieuNhapActi(key))

    };
    const add = () => {
        const data = {
            ngay: ngayThang,
            loaiPhieu: 'pn'
        }
        phieuApi.apiTaoPhieu(headers, data).then((res) => {
            if (res.data.statusCode === 200) {
                recallListPhieuNhapMoiTao()
                setActive()
            }
        }).catch((err) => {
            console.log(err)
        })
    };
    const { confirm } = Modal;
    const remove = (targetKey) => {
        const removedTab = listPhieuNhapMoiTao.find((item) => item.pId === targetKey);
        // console.log(removedTab.soPhieu)
        //cần chạy Popconfirm của ant tạo đây
        confirm({
            title: 'Xác nhận xóa phiếu?',
            content: 'Bạn có chắc muốn xoá phiếu ' + removedTab.soPhieu.toUpperCase() + '?',
            okText: 'Đồng ý',
            cancelText: 'Không',
            onOk() {
                // Đoạn mã xử lý khi người dùng xác nhận xóa
                // Ví dụ: dispatch action xóa dữ liệu từ store hoặc gọi API xóa từ server
                phieuApi.apiXoaPhieuMoiTao(headers, targetKey).then((res) => {
                    // console.log(res.data)
                    if (res.data.statusCode === 200) {
                        recallPhieuNhapMoiTao()
                        setActive()
                        message.success('Đã xóa', 2);
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            onCancel() {
                // Đoạn mã xử lý khi người dùng hủy xóa
                // message.info('Đã hủy', 1);
            },
        });
    };
    const onEdit = (targetKey, action) => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };




    return (
        <div id='banHang'>
            <div className='search'>
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                    type="text"
                    placeholder="F3, Tìm mã, tên sản phẩm."
                    value={keyword}
                    onChange={handleSearchSanPham}
                    // autoFocus
                    ref={inputRef}
                />
                <i className="fa-solid fa-xmark clear" style={{ display: keyword ? 'block' : 'none' }}
                    onClick={handleClearSearch}

                ></i>
            </div>
            <Tabs
                type="editable-card"
                onChange={onChange}
                onEdit={onEdit}
                defaultActiveKey={phieuNhapActi}
                activeKey={phieuNhapActi}
                items={listPhieuNhapMoiTao?.map((item, index) => {
                    const { pId, soPhieu } = item
                    return {
                        // label: `${soPhieu.toUpperCase()}`,
                        label: `Phiếu Nhập ${listPhieuNhapMoiTao.length - index}`,
                        key: pId,
                        // closable: false,
                        children: <PhieuNhapHang item={item} />,
                    };
                })}

            />
            <form action="" style={{ display: search ? 'block' : 'none' }}>
                {
                    sanPhamByShop.length > 0 ? (
                        <table id="formXuatHang">
                            <tbody>
                                {
                                    sanPhamByShop?.map((sanPham, index) => {
                                        let { maSp, tenSp, hinhAnh, dvt, spId } = sanPham;
                                        return (
                                            <tr key={index}>
                                                <td className='hinhAnh'>
                                                    <img src={`${URL}/${hinhAnh}`} alt="" />
                                                </td>
                                                <td className='tenSp'>
                                                    <p>{tenSp}</p>
                                                    <div className="flex">
                                                        <span>{maSp}</span>
                                                        {/* <span>{dvt}</span> */}
                                                    </div>

                                                </td>
                                                <td className="dvt">{dvt}</td>
                                                <td className="donGia">
                                                    <input
                                                        type="text"
                                                        name="giaNhap"
                                                        placeholder='Đơn giá'
                                                        value={
                                                            giaBan[spId] !== undefined
                                                                ? giaBan[spId].toLocaleString()
                                                                : sanPham.giaBan?.toLocaleString() || ''
                                                        }
                                                        onChange={(event) =>
                                                            handleChangeGiaBan(event, spId)
                                                        }

                                                    />
                                                </td>
                                                <td className="soLuong">
                                                    <input type="text" name='soLuong'
                                                        placeholder='SL'
                                                        value={
                                                            soLuong[spId] !== undefined
                                                                ? soLuong[spId] === 0 ? ''
                                                                    : soLuong[spId]?.toLocaleString()
                                                                : 1
                                                        }
                                                        onChange={(event) => handleChangeSoLuong(event, spId)}

                                                    />
                                                </td>
                                                <td className='center'>
                                                    {
                                                        phieuNhapActi !== 0 ? (
                                                            <button type='button' onClick={() => handleNhapHang(sanPham)}>
                                                                <i className="fa-solid fa-plus"></i>
                                                            </button>

                                                        ) : (
                                                            null
                                                        )
                                                    }

                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    ) : (<h4>Không có dữ liệu</h4>)
                }
            </form>
        </div>
    )
}

export default NhapHang