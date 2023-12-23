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


    return (
        <div id="thuongHieuSanPham">
            <div className='container'>
                <Tabs
                    tabPosition='top'
                    items={
                        listSanPhamByThuongHieu?.map((item, index) => {
                            const { hinhAnh, sanPham } = item
                            return {
                                label: (
                                    <div className='tabLabel'>
                                        <img
                                            src={`${URL}/${hinhAnh}`}
                                            alt=""
                                            // style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                        />
                                    </div>
                                ),
                                key: index,
                                children: <SanPhamByThuongHieu listSanPham={sanPham} />
                            };
                        })
                    }
                />
            </div>
        </div>
    );

}

export default ThuongHieu