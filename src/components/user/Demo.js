import { Collapse } from "antd";
import React, { useState } from "react";
import DemoThuongHieu from "./DemoThuongHieu";
import DemoUpload from "./DemoUpload";

const Demo = () => {
    const listSanPham = [
        {
            dmId: 1,
            tenDandMuc: "đồ uống",
            hinhAnh: "",
            thuongHieu: [
                {
                    thId: 1,
                    tenThuongHieu: "pepsi",
                    hinhAnh: "",
                    sanPham: [
                        {
                            kId: 1,
                            soLuong: 100,
                            spId: 1,
                            maSp: "MTD0000001",
                            tenSp: "nước giải khát pepsi thùng 24 lon",
                            giaNhap: 5000,
                            giaBan: 8000,
                            giaGiam: 6000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "thùng",
                            quyDoi: 24,
                            hinhAnh: "",
                            sho: true,
                        },
                        {
                            kId: 1,
                            soLuong: 100,
                            spId: 2,
                            maSp: "MTD0000002",
                            tenSp: "nước giải khát pepsi lốc 6 lon",
                            giaNhap: 30000,
                            giaBan: 48000,
                            giaGiam: 36000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "lốc",
                            quyDoi: 6,
                            hinhAnh: "",
                            sho: true,
                        },
                        {
                            kId: 1,
                            soLuong: 100,
                            spId: 3,
                            maSp: "MTD0000003",
                            tenSp: "nước giải khát pepsi",
                            giaNhap: 5000,
                            giaBan: 8000,
                            giaGiam: 6000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "lon",
                            quyDoi: 1,
                            hinhAnh: "",
                            sho: true,
                        },
                        {
                            kId: 4,
                            soLuong: 200,
                            spId: 4,
                            maSp: "MTD0000003",
                            tenSp: "nước giải khát pepsi chai",
                            giaNhap: 5000,
                            giaBan: 8000,
                            giaGiam: 6000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "chai",
                            quyDoi: 1,
                            hinhAnh: "",
                            sho: false,
                        },
                        {
                            kId: 4,
                            soLuong: 200,
                            spId: 5,
                            maSp: "MTD0000003",
                            tenSp: "nước giải khát pepsi chai",
                            giaNhap: 5000,
                            giaBan: 8000,
                            giaGiam: 6000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "thùng",
                            quyDoi: 18,
                            hinhAnh: "",
                            sho: false,

                        },
                    ],
                },
                {
                    thId: 2,
                    tenThuongHieu: "cococola",
                    hinhAnh: "",
                    sanPham: [
                        {
                            kId: 2,
                            soLuong: 0,
                            spId: 6,
                            maSp: "MTD0000004",
                            tenSp: "nước giải khát cococola thùng 24 lon",
                            giaNhap: 5000,
                            giaBan: 8000,
                            giaGiam: 6000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "thùng",
                            quyDoi: 24,
                            hinhAnh: "",
                            sho: false,

                        },
                        {
                            kId: 2,
                            soLuong: 0,
                            spId: 7,
                            maSp: "MTD0000005",
                            tenSp: "nước giải khát cococola lốc 6 lon",
                            giaNhap: 5000,
                            giaBan: 8000,
                            giaGiam: 6000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "lốc",
                            quyDoi: 6,
                            hinhAnh: "",
                            sho: false,

                        },
                        {
                            kId: 2,
                            soLuong: 0,
                            spId: 8,
                            maSp: "MTD0000006",
                            tenSp: "nước giải khát cococola",
                            giaNhap: 5000,
                            giaBan: 8000,
                            giaGiam: 6000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "lon",
                            quyDoi: 1,
                            hinhAnh: "",
                            sho: false,

                        },
                    ],
                },
                {
                    thId: 3,
                    tenThuongHieu: "vinamilk",
                    hinhAnh: "",
                    sanPham: [
                        {
                            kId: 3,
                            soLuong: 0,
                            spId: 9,
                            maSp: "MTD0000007",
                            tenSp: "sữa tươi vinamilk 220ml thùng 48 hộp",
                            giaNhap: 5000,
                            giaBan: 8000,
                            giaGiam: 6000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "thùng",
                            quyDoi: 24,
                            hinhAnh: "",
                            sho: false,

                        },
                        {
                            kId: 3,
                            soLuong: 0,
                            spId: 10,
                            maSp: "MTD0000008",
                            tenSp: "sữa tươi vinamilk 220ml lốc 4 hộp",
                            giaNhap: 5000,
                            giaBan: 8000,
                            giaGiam: 6000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "lốc",
                            quyDoi: 4,
                            hinhAnh: "",
                            sho: false,

                        },
                        {
                            kId: 3,
                            soLuong: 0,
                            spId: 11,
                            maSp: "MTD0000009",
                            tenSp: "sữa tươi vinamilk 220ml",
                            giaNhap: 5000,
                            giaBan: 8000,
                            giaGiam: 6000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "hộp",
                            quyDoi: 1,
                            hinhAnh: "",
                            sho: false,

                        },
                    ],
                },
                {
                    thId: 7,
                    tenThuongHieu: "tiger",
                    hinhAnh: "",
                    sanPham: [
                        {
                            kId: 3,
                            soLuong: 0,
                            spId: 9,
                            maSp: "MTD0000007",
                            tenSp: "sữa tươi vinamilk 220ml thùng 48 hộp",
                            giaNhap: 5000,
                            giaBan: 8000,
                            giaGiam: 6000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "thùng",
                            quyDoi: 24,
                            hinhAnh: "",
                            sho: false,

                        },
                        {
                            kId: 3,
                            soLuong: 0,
                            spId: 10,
                            maSp: "MTD0000008",
                            tenSp: "sữa tươi vinamilk 220ml lốc 4 hộp",
                            giaNhap: 5000,
                            giaBan: 8000,
                            giaGiam: 6000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "lốc",
                            quyDoi: 4,
                            hinhAnh: "",
                            sho: false,

                        },
                        {
                            kId: 3,
                            soLuong: 0,
                            spId: 11,
                            maSp: "MTD0000009",
                            tenSp: "sữa tươi vinamilk 220ml",
                            giaNhap: 5000,
                            giaBan: 8000,
                            giaGiam: 6000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "hộp",
                            quyDoi: 1,
                            hinhAnh: "",
                            sho: false,

                        },
                    ],
                },
                {
                    thId: 8,
                    tenThuongHieu: "heineken",
                    hinhAnh: "",
                    sanPham: [
                        {
                            kId: 3,
                            soLuong: 0,
                            spId: 9,
                            maSp: "MTD0000007",
                            tenSp: "sữa tươi vinamilk 220ml thùng 48 hộp",
                            giaNhap: 5000,
                            giaBan: 8000,
                            giaGiam: 6000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "thùng",
                            quyDoi: 24,
                            hinhAnh: "",
                            sho: false,

                        },
                        {
                            kId: 3,
                            soLuong: 0,
                            spId: 10,
                            maSp: "MTD0000008",
                            tenSp: "sữa tươi vinamilk 220ml lốc 4 hộp",
                            giaNhap: 5000,
                            giaBan: 8000,
                            giaGiam: 6000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "lốc",
                            quyDoi: 4,
                            hinhAnh: "",
                            sho: false,

                        },
                        {
                            kId: 3,
                            soLuong: 0,
                            spId: 11,
                            maSp: "MTD0000009",
                            tenSp: "sữa tươi vinamilk 220ml",
                            giaNhap: 5000,
                            giaBan: 8000,
                            giaGiam: 6000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "hộp",
                            quyDoi: 1,
                            hinhAnh: "",
                            sho: false,

                        },
                    ],
                },
            ],
        },
        {
            dmId: 2,
            tenDandMuc: "đồ ăn",
            thuongHieu: [
                {
                    thId: 4,
                    tenThuongHieu: "acecook",
                    hinhAnh: "",
                    sanPham: [
                        {
                            kId: 10,
                            soLuong: 0,
                            maSp: "MTD0000010",
                            tenSp: "mì hảo hảo tôm chua cay thùng 30 gói",
                            giaBan: 110000,
                            giaGiam: 100000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "thùng",
                            quyDoi: 30,
                            hinhAnh: "",
                        },
                        {
                            kId: 10,
                            soLuong: 0,
                            maSp: "MTD0000011",
                            tenSp: "mì hảo hảo tôm chua cay",
                            giaBan: 5000,
                            giaGiam: 4000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "gói",
                            quyDoi: 1,
                            hinhAnh: "",
                        },
                        {
                            kId: 11,
                            soLuong: 0,
                            maSp: "MTD0000013",
                            tenSp: "mì hảo hảo sa tế hành thùng 30 gói",
                            giaBan: 110000,
                            giaGiam: 100000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "thùng",
                            quyDoi: 30,
                            hinhAnh: "",
                        },
                        {
                            kId: 11,
                            soLuong: 0,
                            maSp: "MTD0000014",
                            tenSp: "mì hảo hảo sa tế hành",
                            giaBan: 110000,
                            giaGiam: 100000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "gói",
                            quyDoi: 1,
                            hinhAnh: "",
                        },
                    ],
                },
            ],
        },
        {
            dmId: 3,
            tenDandMuc: "đồ tạp hoá",
            thuongHieu: [
                {
                    thId: 6,
                    tenThuongHieu: "acecook",
                    hinhAnh: "",
                    sanPham: [
                        {
                            kId: 10,
                            soLuong: 0,
                            maSp: "MTD0000010",
                            tenSp: "mì hảo hảo tôm chua cay thùng 30 gói",
                            giaBan: 110000,
                            giaGiam: 100000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "thùng",
                            quyDoi: 30,
                            hinhAnh: "",
                        },
                        {
                            kId: 10,
                            soLuong: 0,
                            maSp: "MTD0000011",
                            tenSp: "mì hảo hảo tôm chua cay",
                            giaBan: 5000,
                            giaGiam: 4000,
                            phiVc: 0,
                            maxOrder: 0,
                            dvt: "gói",
                            quyDoi: 1,
                            hinhAnh: "",
                        },
                    ],
                },
            ],
        },
    ];

    const item = listSanPham?.map((item) => {
        return {
            key: item.dmId,
            label: (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <div>
                        <p>{item.tenDandMuc.toUpperCase()}</p>
                    </div>
                </div>
            ),
            children: <DemoThuongHieu thuongHieu={item.thuongHieu} />,
        };
    });

    const [dmId, setDmId] = useState(0);

    const onChange = (key) => {
        setDmId(+key);
    };

    const taoSanPhamMoi = () => {
        if (dmId === 0) {
            //code tạo  mới danh mục
            console.log('tạo mới danh mục')
        } else {
            //code tạo mới thương hiệu
            console.log('tạo mới thương hiệu trong dmId', dmId)
        }
    }
    return (
        <>
            <button style={{ width: "200px" }} onClick={() => taoSanPhamMoi()}>

                {dmId !== 0 ? 'Tạo thương hiệu mới' : 'Tạo danh mục mới'}
            </button>
            <Collapse items={item} onChange={onChange} accordion />
        </>
    );
};

export default Demo;
