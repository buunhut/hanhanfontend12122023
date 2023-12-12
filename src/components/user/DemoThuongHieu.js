import { Tabs } from 'antd';
import React, { useState } from 'react'
import DemoSanPham from './DemoSanPham';
import { capitalizeFirstLetter } from '../../service/functions';

const DemoThuongHieu = ({ thuongHieu }) => {
    const [thId, setThId] = useState(thuongHieu[0].thId)

    const onChange = (key) => {
        setThId(+key)
    };

    return (
        <>


            <Tabs
                tabPosition='left'
                onChange={onChange}
                // defaultActiveKey={thuongHieu[0].thId}
                items={thuongHieu.map((item) => {
                    return {
                        label: <div>
                            <p>{capitalizeFirstLetter(item.tenThuongHieu)}</p>
                        </div>,
                        key: `${item.thId}`,
                        children: <DemoSanPham sanPham={item.sanPham} thId={thId} />
                    };
                })}
            />
        </>
    )
}

export default DemoThuongHieu