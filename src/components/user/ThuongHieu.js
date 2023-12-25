import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usersApi } from '../../api/usersApi'
import { updateListSanPhamByThuongHieu } from '../../redux/danhMucSlice'
import SanPhamByThuongHieu from './SanPhamByThuongHieu'
import { Carousel, Col, Row, Tabs } from 'antd'
import { URL } from '../../service/functions'
import './thuonghieu.scss'

const ThuongHieu = () => {
    const { listSanPhamByThuongHieu } = useSelector((state) => state.danhMuc)
    // console.log(listSanPhamByThuongHieu)
    const dispath = useDispatch()
    useEffect(() => {
        usersApi.apiGetSanPhamByThuongHieu().then((res) => {
            dispath(updateListSanPhamByThuongHieu(res.data.content))
        })
    }, [])

    // console.log(listSanPhamByThuongHieu)
    // Tạo một đối tượng để lưu trữ thông tin theo tên thương hiệu
    const groupedData = {};

    // Duyệt qua mảng và gộp thông tin theo tên thương hiệu
    listSanPhamByThuongHieu.forEach(item => {
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