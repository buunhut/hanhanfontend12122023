import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usersApi } from '../../api/usersApi'
import { updateListSanPhamByThuongHieu } from '../../redux/danhMucSlice'
import SanPhamByThuongHieu from './SanPhamByThuongHieu'
import { Carousel, Col, Row, Tabs } from 'antd'
import { URL } from '../../service/functions'
import './thuonghieu.scss'
import { updateKeyword } from '../../redux/sanPhamSlice'

const ThuongHieu = () => {
    const { sId } = useSelector((state) => state.sanPham)

    let { listSanPhamByThuongHieu } = useSelector((state) => state.danhMuc)
    // console.log(listSanPhamByThuongHieu)
    const [thuongHieu, setThuongHieu] = useState([])

    // console.log(thuongHieu)

    const dispath = useDispatch()
    useEffect(() => {
        usersApi.apiGetSanPhamByThuongHieu().then((res) => {
            dispath(updateListSanPhamByThuongHieu(res.data.content))
        })
        dispath(updateKeyword(''))

    }, [])
    useEffect(() => {
        const data = listSanPhamByThuongHieu.filter(item => item.sId === sId)
        setThuongHieu(data)

    }, [sId, listSanPhamByThuongHieu])

    // console.log(listSanPhamByThuongHieu)
    // Tạo một đối tượng để lưu trữ thông tin theo tên thương hiệu
    const groupedData = {};

    // Duyệt qua mảng và gộp thông tin theo tên thương hiệu
    thuongHieu.forEach(item => {
        const { tenThuongHieu, hinhAnh, sanPham } = item;

        if (!groupedData[tenThuongHieu]) {
            // Nếu tên thương hiệu chưa tồn tại trong đối tượng groupedData, tạo một đối tượng mới
            groupedData[tenThuongHieu] = {
                tenThuongHieu,
                hinhAnh,
                sanPham: []
            };
        }

        // Thêm sản phẩm vào mảng của tên thương hiệu tương ứng
        groupedData[tenThuongHieu].sanPham = groupedData[tenThuongHieu].sanPham.concat(sanPham);
    });

    // Chuyển đối tượng thành mảng để có kết quả cuối cùng
    const finalResult = Object.values(groupedData);

    // Hiển thị kết quả
    // console.log(finalResult);


    return (
        <div id="thuongHieuSanPham">
            <div className='container'>
                <Tabs
                    tabPosition='top'
                    items={
                        finalResult?.map((item, index) => {
                            const { hinhAnh, sanPham } = item
                            if (hinhAnh) {
                                return {
                                    label: (
                                        <div className='tabLabel'>
                                            <img
                                                src={`${URL}/${hinhAnh}`}
                                                alt=""
                                            />
                                        </div>
                                    ),
                                    key: index,
                                    children: <SanPhamByThuongHieu listSanPham={sanPham} />
                                };
                            }
                        })
                    }
                />
            </div>
        </div>
    );

}

export default ThuongHieu