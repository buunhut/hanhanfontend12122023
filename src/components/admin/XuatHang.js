import React, { useEffect } from 'react'
import FormNhapHang from './form/FormNhapHang'
import ListXuatNhapHang from './form/ListPhieuXuatHang'
import './nhaphang.scss'
import { callApi } from '../../api/callApi'
import { useDispatch, useSelector } from 'react-redux'
import { updateListPhieuXuatMoiTao, updatePhieuXuatActi } from '../../redux/nhapHangSlice'
import { useParams } from 'react-router-dom';
import { phieuApi } from '../../api/phieuApi'
import FormXuatHang from './form/FormXuatHang'
import ListPhieuXuatHang from './form/ListPhieuXuatHang'

const XuatHang = () => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };

    const dispath = useDispatch();

    useEffect(() => {
        phieuApi.apiGetPhieuXuatMoiTao(headers).then((res) => {
            // console.log(res.data.content)
            dispath(updateListPhieuXuatMoiTao(res.data.content))
            if (res.data.content.length > 0) {
                dispath(updatePhieuXuatActi(res.data.content[0].pId))
            }

        })

    }, [])


    return (
        <div id='nhapHang'>
            <FormXuatHang />
            <ListPhieuXuatHang />
        </div>
    )
}

export default XuatHang