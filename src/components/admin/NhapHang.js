import React, { useEffect } from 'react'
import FormNhapHang from './form/FormNhapHang'
import ListPhieuNhapHang from './form/ListPhieuNhapHang'
import './nhaphang.scss'
import { callApi } from '../../api/callApi'
import { useDispatch, useSelector } from 'react-redux'
import { updateListPhieuNhapMoiTao, updatePhieuNhapActi } from '../../redux/nhapHangSlice'
import { useParams } from 'react-router-dom';
import { phieuApi } from '../../api/phieuApi'

const NhapHang = () => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };


    const dispath = useDispatch();


    useEffect(() => {
        return () => {
            phieuApi.apiGetPhieuNhapMoiTao(headers).then((res) => {
                dispath(updateListPhieuNhapMoiTao(res.data.content))
                if (res.data.content.length > 0) {
                    dispath(updatePhieuNhapActi(res.data.content[0].pId))
                }

            })
        }

    }, [])


    return (
        <div id='nhapHang'>
            <FormNhapHang />
            <ListPhieuNhapHang />
        </div>
    )
}

export default NhapHang