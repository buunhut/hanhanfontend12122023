import React from "react";

const DemoSanPham = ({ sanPham, thId }) => {
    // const listSanPham = [];

    // sanPham.forEach((sp) => {
    //     const existingKId = listSanPham.findIndex((item) => item.kId === sp.kId);

    //     if (existingKId !== -1) {
    //         listSanPham[existingKId].sanPhamCungKId.push({
    //             maSp: sp.maSp,
    //             tenSp: sp.tenSp,
    //             giaNhap: sp.giaNhap,
    //             giaBan: sp.giaBan,
    //             giaGiam: sp.giaGiam,
    //             phiVc: sp.phiVc,
    //             maxOrder: sp.maxOrder,
    //             dvt: sp.dvt,
    //             quyDoi: sp.quyDoi,
    //             hinhAnh: sp.hinhAnh,
    //         });
    //     } else {
    //         listSanPham.push({
    //             kId: sp.kId,
    //             soLuong: sp.soLuong,
    //             sanPhamCungKId: [
    //                 {
    //                     maSp: sp.maSp,
    //                     tenSp: sp.tenSp,
    //                     giaNhap: sp.giaNhap,
    //                     giaBan: sp.giaBan,
    //                     giaGiam: sp.giaGiam,
    //                     phiVc: sp.phiVc,
    //                     maxOrder: sp.maxOrder,
    //                     dvt: sp.dvt,
    //                     quyDoi: sp.quyDoi,
    //                     hinhAnh: sp.hinhAnh,
    //                 },
    //             ],
    //         });
    //     }
    // });

    // // Duyệt mảng transformedSanPham và tính tonKho cho từng sản phẩm
    // listSanPham.forEach((item) => {
    //     const { kId, soLuong, sanPhamCungKId } = item;

    //     // Sắp xếp mảng sanPhamCungKId theo quyDoi giảm dần
    //     const sortedSanPham = sanPhamCungKId.sort((a, b) => b.quyDoi - a.quyDoi);

    //     // Tính tonKho cho từng sản phẩm trong sanPhamCungKId
    //     let remainingSoLuong = soLuong;

    //     sortedSanPham.forEach((sp) => {
    //         const { quyDoi } = sp;
    //         const tonKho = Math.floor(remainingSoLuong / quyDoi);

    //         sp.tonKho = tonKho;
    //         remainingSoLuong %= quyDoi;
    //     });
    // });

    // const finalSanPham = [];

    // // Duyệt mảng transformedSanPham
    // listSanPham.forEach((item) => {
    //     const { kId, soLuong, sanPhamCungKId } = item;

    //     // Duyệt mảng sanPhamCungKId
    //     sanPhamCungKId.forEach((sp) => {
    //         const { maSp, tenSp, giaNhap, giaBan, giaGiam, phiVc, maxOrder, dvt, quyDoi, hinhAnh, tonKho } = sp;

    //         // Tạo đối tượng sản phẩm mới
    //         const newSanPham = {
    //             kId,
    //             soLuong,
    //             maSp,
    //             tenSp,
    //             giaNhap,
    //             giaBan,
    //             giaGiam,
    //             phiVc,
    //             maxOrder,
    //             dvt,
    //             quyDoi,
    //             hinhAnh,
    //             tonKho,
    //         };

    //         // Thêm sản phẩm mới vào mảng finalSanPham
    //         finalSanPham.push(newSanPham);
    //     });
    // });

    // console.log(finalSanPham);

    const listSanPham = sanPham
        .reduce((acc, sp) => {
            const existingItem = acc.find((item) => item.kId === sp.kId);

            if (existingItem) {
                existingItem.sanPhamCungKId.push({ ...sp });
            } else {
                acc.push({
                    kId: sp.kId,
                    soLuong: sp.soLuong,
                    sanPhamCungKId: [{ ...sp }],
                });
            }
            return acc;
        }, [])
        .map((item) => {
            const { kId, soLuong, sanPhamCungKId } = item;
            const sortedSanPham = sanPhamCungKId.sort((a, b) => b.quyDoi - a.quyDoi);

            let remainingSoLuong = soLuong;

            const updatedSanPhamCungKId = sortedSanPham.map((sp) => {
                const { quyDoi } = sp;
                const tonKho = Math.floor(remainingSoLuong / quyDoi);
                remainingSoLuong %= quyDoi;
                return { ...sp, tonKho };
            });
            return updatedSanPhamCungKId;
        })
        .flat();


    const taoSanPhamMoi = (thId) => {
        console.log('tạo sản phẩm mới trong thId', thId)
    }

    return (
        <>
            {/* <button style={{ width: '30px' }}><i className="fa-solid fa-plus"></i></button> */}

            <div>
                <button style={{ width: '200px' }}
                    type="button"
                    onClick={() => taoSanPhamMoi(thId)}
                >Tạo sản phẩm mới</button>

                <table style={{ borderCollapse: "collapse", width: "100%", border: '1px solid silver' }}>
                    <thead
                        style={{
                            backgroundColor: "royalblue",
                            color: "white",
                            height: "30px",
                        }}
                    >
                        <tr>
                            <td style={{ padding: "5px 10px", textAlign: 'center' }}></td>
                            <td style={{ padding: "5px 10px", textAlign: 'center' }}>Hình</td>
                            <td style={{ padding: "5px 10px", textAlign: 'left' }}>Tên SP</td>
                            <td style={{ padding: "5px 10px", textAlign: 'center' }}>ĐVT</td>
                            {/* <td>Quy Đổi</td> */}
                            <td style={{ padding: "5px 10px", textAlign: 'right' }}>Giá Nhập</td>
                            <td style={{ padding: "5px 10px", textAlign: 'right' }}>Giá Bán</td>
                            <td style={{ padding: "5px 10px", textAlign: 'right' }}>Giá Giảm</td>
                            <td style={{ padding: "5px 10px", textAlign: 'right' }}>Phí VC</td>
                            <td style={{ padding: "5px 10px", textAlign: 'right' }}>Max Order</td>
                            <td style={{ padding: "5px 10px", textAlign: 'right' }}>Tồn kho</td>
                            <td style={{ padding: "5px 10px", textAlign: 'center' }}>
                                <i className="fa-regular fa-eye"></i>
                            </td>
                            <td style={{ padding: "5px 10px", textAlign: 'center' }}>
                                <i className="fa-regular fa-trash-can"></i>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {listSanPham
                            ?.sort((a, b) => {
                                // Sắp xếp theo kId
                                if (b.kId !== a.kId) {
                                    return a.kId - b.kId;
                                }
                                // Nếu cùng kId, sắp xếp theo quyDoi giảm dần
                                return a.quyDoi - b.quyDoi;
                            })
                            .map((sp, index, array) => {
                                let {
                                    kId,
                                    maSp,
                                    tenSp,
                                    dvt,
                                    soLuong,
                                    quyDoi,
                                    giaNhap,
                                    giaBan,
                                    giaGiam,
                                    phiVc,
                                    maxOrder,
                                    tonKho,
                                    sho,
                                } = sp;


                                // Kiểm tra nếu là phần tử đầu tiên của array hoặc kId khác với phần tử trước đó
                                const isFirstOrDifferentKId = index === 0 || kId !== array[index - 1].kId;


                                return (
                                    // <p key={index}>{item.tenSp}</p>
                                    <tr key={index}>
                                        {isFirstOrDifferentKId && (
                                            <td rowSpan={array.filter((item) => item.kId === kId).length} style={{ border: '1px solid silver', textAlign: 'center' }}>
                                                <i className="fa-solid fa-plus"></i>
                                            </td>
                                        )}

                                        <td style={{ padding: "10px 0", border: '1px solid silver', textAlign: 'center' }}>
                                            <img src="" alt="" />
                                        </td>
                                        <td style={{ padding: "10px 5px", border: '1px solid silver', textAlign: 'left' }}>
                                            <p style={{ textTransform: "capitalize" }}>{tenSp}</p>
                                            <p>{maSp}</p>
                                        </td>
                                        <td style={{ padding: "10px 0", border: '1px solid silver', textAlign: 'center' }}>
                                            <p style={{ textTransform: 'capitalize' }}>{dvt}</p>
                                            <p>{quyDoi}</p>
                                        </td>
                                        <td style={{ padding: "10px", border: '1px solid silver', textAlign: 'right' }}>{giaNhap?.toLocaleString()}</td>
                                        <td style={{ padding: "10px", border: '1px solid silver', textAlign: 'right' }}>{giaBan?.toLocaleString()}</td>
                                        <td style={{ padding: "10px", border: '1px solid silver', textAlign: 'right' }}>{giaGiam?.toLocaleString()}</td>
                                        <td style={{ padding: "10px", border: '1px solid silver', textAlign: 'right' }}>{phiVc?.toLocaleString()}</td>
                                        <td style={{ padding: "10px", border: '1px solid silver', textAlign: 'right' }}>{maxOrder?.toLocaleString()}</td>
                                        <td style={{ padding: "10px", border: '1px solid silver', textAlign: 'right' }}>
                                            <p>{tonKho?.toLocaleString()}</p>
                                        </td>
                                        <td style={{ padding: "10px", border: '1px solid silver', textAlign: 'center' }}>
                                            {
                                                sho ? <i className="fa-regular fa-eye"></i> : <i className="fa-regular fa-eye-slash"></i>
                                            }

                                        </td>
                                        <td style={{ padding: "10px", border: '1px solid silver', textAlign: 'center' }}>
                                            <i className="fa-regular fa-trash-can"></i>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default DemoSanPham;
