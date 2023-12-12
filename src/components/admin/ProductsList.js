import React, { useState } from 'react'
import { useDrop } from 'react-dnd';
import ProductItem from './ProductItem';

const ProductsList = ({ products }) => {
    const [productList, setProductList] = useState(products);

    const moveProduct = (fromIndex, toIndex) => {
        const updatedList = [...productList];
        const [movedProduct] = updatedList.splice(fromIndex, 1);
        updatedList.splice(toIndex, 0, movedProduct);
        setProductList(updatedList);
    };

    const [, drop] = useDrop({
        accept: 'PRODUCT',
        drop: (item, monitor) => {
            const dragIndex = item.index;
            const hoverIndex = productList.length; // Drop to the end of the list
            if (dragIndex === hoverIndex) {
                return;
            }
            moveProduct(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });
    return (
        <React.Fragment ref={drop}>
            {
                productList.map((product, index) => (
                    <ProductItem key={index} product={product} index={index} />
                ))
            }
        </React.Fragment>
    )
}

export default ProductsList