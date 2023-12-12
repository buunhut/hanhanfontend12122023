import React, { useEffect } from 'react';
import './inmavach.scss'
import JsBarcode from 'jsbarcode';
import { useParams } from 'react-router-dom';
import { capitalizeFirstLetter } from '../../../service/functions';


const InMaVach = () => {
    const { maSp, tenSp } = useParams()

    useEffect(() => {
        generateBarcode(maSp);
    }, [maSp]);

    const generateBarcode = (maSp) => {
        // // Get the HTML element where you want to display the barcode
        // const barcodeElement = document.querySelector('.barcode'); //className ko gọi được

        // console.log(" test ", barcodeElement)

        // // Generate the barcode
        // JsBarcode(barcodeElement, maSp, {
        //     format: 'CODE128', // You can choose the barcode format you want
        //     displayValue: true, // Whether to display the text under the barcode
        // });

        for (let i = 1; i <= 20; i++) {
            const barcodeElement = document.getElementById(`barcode-${i}`);

            // Generate the barcode
            JsBarcode(barcodeElement, maSp, {
                format: 'CODE128',
                displayValue: true,
            });
        }
    }


    return (
        <div id="inMaVach">
            <p>Sản phẩm: {
                tenSp === 'null' ? 'SẢN PHẨM CHƯA ĐẶT TÊN' :
                    capitalizeFirstLetter(tenSp)
            }</p>


            {/* 
            DÙNG className
            CHẠY RA 30 MÃ */}


            {/* Generate 30 barcodes */}
            <div className="barcode-container">
                {[...Array(20)].map((_, index) => (
                    <svg key={index} id={`barcode-${index + 1}`} className="barcode"></svg>
                ))}
            </div>
        </div>
    );
};

export default InMaVach;
