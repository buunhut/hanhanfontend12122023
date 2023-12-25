import React, { useEffect, useState } from 'react'
import './cauhinh.scss'
import { shopsApi } from '../../../api/shopsApi';
import { useDispatch, useSelector } from 'react-redux';
import { updateListCauHinhByShop } from '../../../redux/orderSlice';
import { Switch } from 'antd';

const CauHinh = () => {
    const { user } = useSelector((state) => state.dangNhap);
    const { token } = user;
    const headers = {
        token,
    };

    const { listCauHinh } = useSelector((state) => state.order)

    const dispath = useDispatch()

    const callCauHinh = () => {
        shopsApi.apiGetCauHinh(user.sId).then((res) => {
            // console.log(res.data.content)
            const { mienPhiVc, phiVc, hoanTien, mucHoan, tatShop } = res.data.content
            dispath(updateListCauHinhByShop(res.data.content))
            setData({
                mienPhiVc,
                phiVc,
                hoanTien,
                mucHoan,
                tatShop
            }
            )
        })
    }
    useEffect(() => {
        callCauHinh()
    }, [])


    const [data, setData] = useState({
        mienPhiVc: 0,
        phiVc: 0,
        hoanTien: 0,
        mucHoan: 0,
        tatShop: false
    })

    const handleChangeInput = (event) => {
        const { name, value } = event.target;

        setData((prevState) => ({
            ...prevState,
            [name]: name === 'mucHoan' ? value : +value.replace(/[^0-9.]/g, ''),
        }));
    }
    const luuCauHinh = () => {
        shopsApi.apiTaoCauHinh(headers, data).then((res) => {
            callCauHinh()
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleTatShop = () => {
        shopsApi.apiTatMoShop(headers).then((res) => {
            callCauHinh()
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <div id='cauHinh'>
            <h3>Cấu hình đang lưu</h3>

            <div className='form'>
                <div className="inputItem">
                    <p>
                        1. Miễn phí vận chuyển đơn từ
                    </p>
                    <input type="text" placeholder='Miễn phí vận chuyển'
                        name='mienPhiVc'
                        value={
                            data.mienPhiVc === 0 ? '' :
                                data.mienPhiVc.toLocaleString()
                        }
                        onChange={handleChangeInput}
                        onBlur={luuCauHinh}
                    />
                </div>
                <div className="inputItem">
                    <p>
                        2. Thu phí vận chuyển
                    </p>
                    <input type="text" placeholder='Phí vận chuyển'
                        name='phiVc'
                        value={
                            data.phiVc === 0 ? '' :
                                data.phiVc.toLocaleString()
                        }
                        onBlur={luuCauHinh}
                        onChange={handleChangeInput}
                    />
                </div>
                <div className="inputItem">
                    <p>
                        3. Hoàn tiền cho đơn từ
                    </p>
                    <input type="text" placeholder='Giá trị'
                        name='hoanTien'
                        value={
                            data.hoanTien === 0 ? '' :
                                data.hoanTien.toLocaleString()
                        }
                        onBlur={luuCauHinh}
                        onChange={handleChangeInput}
                    />
                </div>
                <div className="inputItem">
                    <p>
                        4. Mức hoàn %
                    </p>
                    <input type="text" placeholder='Mức % hoàn tiền'
                        name='mucHoan'
                        value={data.mucHoan}
                        onBlur={luuCauHinh}
                        onChange={handleChangeInput}
                    />
                </div>
                <div className="inputItem">
                    <p>
                        5. Tạm tắt shop
                    </p>
                    <Switch checked={data.tatShop} onChange={handleTatShop} style={{ width: '10px', marginTop: '5px' }} />

                </div>
            </div>
        </div>
    )
}

export default CauHinh