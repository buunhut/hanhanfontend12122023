import { Tabs } from 'antd';
import React, { useState } from 'react'
import SanPham from './SanPham';
import { useDispatch, useSelector } from 'react-redux';
import { updateThId } from '../../../redux/sanPhamSlice';

const ThuongHieu = ({ thuongHieu }) => {
    const dispath = useDispatch()
    const { thId } = useSelector((state) => state.sanPham)

    const onChange = (key) => {
        dispath(updateThId(key))
    };

    const onTabClick = (key) => {
        if (key === thId) {
            dispath(updateThId(0))

        } else {
            dispath(updateThId(key))

        }
    }
    return (
        <Tabs
            tabPosition='left'
            onChange={onChange}
            onTabClick={onTabClick}
            activeKey={thId}
            items={thuongHieu?.map((item) => {
                return {
                    label: <div>
                        <p style={{ textTransform: 'uppercase' }}>{item.tenThuongHieu}</p>
                    </div>,
                    key: `${item.thId}`,
                    children: <SanPham sanPham={item.sanPham} thId={thId} />
                };
            })}
        />
    )
}

export default ThuongHieu