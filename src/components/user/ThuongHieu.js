import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usersApi } from '../../api/usersApi'
import { updateListSanPhamByThuongHieu } from '../../redux/danhMucSlice'
import SanPhamByThuongHieu from './SanPhamByThuongHieu'
import { Tabs } from 'antd'
import { URL } from '../../service/functions'

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
        <div id="danhMucSanPham">
            <div className='container'>
                {/* <h3>Thương hiệu</h3> */}
                <Tabs
                    tabPosition='top'
                    items={
                        listSanPhamByThuongHieu?.map((item, index) => {
                            const { tenThuongHieu, hinhAnh, sanPham } = item
                            return {
                                label: (
                                    <div className='tabLabel'>
                                        <img
                                            src={`${URL}/${hinhAnh}`}
                                            alt=""
                                            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                        />
                                        <p>
                                            {tenThuongHieu?.toUpperCase()}
                                        </p>
                                    </div>
                                ),
                                key: index,
                                children: <SanPhamByThuongHieu listSanPham={sanPham} />
                            };
                        })
                    }
                />
            </div>
        </div>)
}

export default ThuongHieu