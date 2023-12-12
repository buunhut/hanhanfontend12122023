import React from 'react'
import { useDrag } from 'react-dnd';

const ProductItem = ({ product: sanPham, index: innerIndex }) => {
    const [, drag] = useDrag({
        type: 'PRODUCT',
        item: { innerIndex },
    });
    return (
        <tr key={innerIndex} index={innerIndex} ref={drag}>
            <td>
                {sanPham.tenSp}
            </td>
        </tr>
    )
}

export default ProductItem