import { Tabs } from 'antd'
import React from 'react'
import NhaPhanPhoi from './NhaPhanPhoi'
import KhachHang from './KhachHang'

const DoiTac = () => {
    //phần tabs
    const items = [
        {
            key: "1",
            label: <b>Khách hàng</b>,
            children: <KhachHang />,
        },
        {
            key: "2",
            label: <b>Nhà phân phối</b>,
            children: <NhaPhanPhoi />,
        },
    ];
    const onChange = (key) => {};
    return (
        <div>
            <Tabs
                defaultActiveKey="1"
                items={items}
                type="card"
                onChange={onChange}
            />
        </div>
    )
}

export default DoiTac