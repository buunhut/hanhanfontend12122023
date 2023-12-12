import React, { useState } from 'react';
import { TreeSelect } from 'antd';
import './treeselectant.scss'
const treeData = [
    {
        value: '1',
        title: 'đồ ăn',
        disabled: true,
        children: [
            {
                value: '1-1',
                title: 'acecook',
            },
            {
                value: '1-2',
                title: 'vedan',
            },
        ],
    },
    {
        value: '2',
        title: 'đò uống',
        disabled: true,
        children: [
            {
                value: '2-1',
                title: 'pepsi',
            },
            {
                value: '2-2',
                title: 'cocacola',
            },
        ],
    },
];
const TreeSelectAnt = () => {
    const [value, setValue] = useState('');
    console.log(value)
    const onChange = (newValue) => {
        setValue(newValue);
    };

    const filterTreeNode = (input, node) => {
        // Lọc các nút dựa trên giá trị tìm kiếm (searchValue)
        const title = node.title;  //đã fixed
        return title.toLowerCase().includes(input.toLowerCase());
    };



    return (
        <TreeSelect
            treeData={treeData}
            placeholder="Chọn danh mục"
            treeDefaultExpandAll
            showSearch
            allowClear
            onChange={onChange}
            filterTreeNode={filterTreeNode}
            bordered={false}
            style={{
                width: '100%',
            }}
        />
    );
};
export default TreeSelectAnt;