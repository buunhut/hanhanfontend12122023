import React, { useEffect, useState } from 'react'
import './danhmuc.scss'
import { useDispatch, useSelector } from 'react-redux';
import { usersApi } from '../../api/usersApi';
import { updateListSanPhamByDanhMuc } from '../../redux/danhMucSlice';
import { Radio, Tabs } from 'antd';
import { URL } from '../../service/functions';
import SanPhamByDanhMuc from './SanPhamByDanhMuc';

const DanhMuc = () => {

    const { listSanPhamByDanhMuc } = useSelector((state) => state.danhMuc)
    // console.log(listSanPhamByDanhMuc)
    const dispath = useDispatch()
    useEffect(() => {
        usersApi.apiGetSanPhamByDanhMuc().then((res) => {
            dispath(updateListSanPhamByDanhMuc(res.data.content))
        })
    }, [])



    return (
        <div id="danhMucSanPham">
            <div className='container'>
                {/* <h3>Danh mục</h3> */}
                <Tabs
                    tabPosition='top'
                    items={
                        listSanPhamByDanhMuc?.map((item, index) => {
                            const { tenDanhMuc, hinhAnh, sanPham } = item
                            return {
                                label: (
                                    <div className='tabLabel'>
                                        <img
                                            src={`${URL}/${hinhAnh}`}
                                            alt=""
                                            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                        />
                                        <p>
                                            {tenDanhMuc?.toUpperCase()}
                                        </p>
                                    </div>
                                ),
                                key: index,
                                children: <SanPhamByDanhMuc listSanPham={sanPham} />
                            };
                        })
                    }
                />
            </div>
        </div>
    )
}

export default DanhMuc