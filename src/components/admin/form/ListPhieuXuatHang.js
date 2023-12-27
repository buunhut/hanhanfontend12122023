import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { callApi } from '../../../api/callApi';
import { updateListPhieuNhapMoiTao, updateListPhieuXuatMoiTao, updatePhieuNhapActi, updatePhieuXuatActi } from '../../../redux/nhapHangSlice';
import { Tabs } from 'antd';
import ChiTietPhieuNhap from './ChiTietPhieuNhap';
import { phieuApi } from '../../../api/phieuApi';
import ChiTietPhieuXuat from './ChiTietPhieuXuat';

const ListPhieuXuatHang = () => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };

    const dispath = useDispatch();

    const recallPhieuXuatMoiTao = () => {
        phieuApi.apiGetPhieuXuatMoiTao(headers).then((res) => {
            dispath(updateListPhieuXuatMoiTao(res.data.content))
            // if (res.data.content.length > 0) {
            //     dispath(updatePhieuNhapActi(res.data.content[0].pId))
            // }
        }).catch((err) => {
            console.log(err)
        })
    }

    const { listPhieuXuatMoiTao } = useSelector((state) => state.nhapHang)
    const [phieu, setPhieu] = useState(0)

    let { phieuXuatActi } = useSelector((state) => state.nhapHang)
    // console.log("actikey ", phieuNhapActi)




    useEffect(() => {
        recallPhieuXuatMoiTao();
    }, [phieu, phieuXuatActi])


    const onChange = (key) => {
        // dispath(updatePhieuNhapActi(key))
        setPhieu(key)
        dispath(updatePhieuXuatActi(key))

    };

    return (
        <div className='listPhieu' style={{ display: listPhieuXuatMoiTao.length > 0 ? 'block' : 'none' }}>

            <Tabs
                onChange={onChange}
                defaultActiveKey={phieuXuatActi}
                activeKey={phieuXuatActi}
                type="card"
                items={listPhieuXuatMoiTao.map((item) => {
                    const { pId, soPhieu } = item
                    return {
                        label: `${soPhieu.toUpperCase()}`,
                        key: pId,
                        children: <ChiTietPhieuXuat item={item} />,
                    };
                })}
            />
        </div>
    )
}

export default ListPhieuXuatHang