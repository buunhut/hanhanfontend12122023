import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { callApi } from '../../../api/callApi';
import { updateListPhieuNhapMoiTao, updatePhieuNhapActi } from '../../../redux/nhapHangSlice';
import { Tabs } from 'antd';
import ChiTietPhieuNhap from './ChiTietPhieuNhap';
import { phieuApi } from '../../../api/phieuApi';

const ListPhieuNhapHang = () => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };

    const dispath = useDispatch();

    const recallPhieuNhapMoiTao = () => {
        phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
            dispath(updateListPhieuNhapMoiTao(res.data.content))
            // if (res.data.content.length > 0) {
            //     dispath(updatePhieuNhapActi(res.data.content[0].pId))
            // }
        }).catch((err) => {
            console.log(err)
        })
    }

    const { listPhieuNhapMoiTao } = useSelector((state) => state.nhapHang)
    const [phieu, setPhieu] = useState(0)

    let { phieuNhapActi } = useSelector((state) => state.nhapHang)
    // console.log("actikey ", phieuNhapActi)




    useEffect(() => {
        recallPhieuNhapMoiTao();
    }, [phieu, phieuNhapActi])


    const onChange = (key) => {
        // dispath(updatePhieuNhapActi(key))
        setPhieu(key)
        dispath(updatePhieuNhapActi(key))

    };

    return (
        <div className='listPhieu' style={{display: listPhieuNhapMoiTao.length > 0 ? 'block' : 'none'}}>
            
            <Tabs
                onChange={onChange}
                defaultActiveKey={phieuNhapActi}
                activeKey={phieuNhapActi}
                type="card"
                items={listPhieuNhapMoiTao.map((item) => {
                    const { pId, soPhieu } = item
                    return {
                        label: `${soPhieu.toUpperCase()}`,
                        key: pId,
                        children: <ChiTietPhieuNhap item={item} />,
                    };
                })}
            />
        </div>
    )
}

export default ListPhieuNhapHang