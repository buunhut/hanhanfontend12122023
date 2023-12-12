import React, { useState } from 'react';
import './formupload.scss'
const FormUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Lấy tệp đầu tiên từ danh sách đã chọn

        if (file) {
            setSelectedFile(file);

            // Xem trước tệp ảnh (nếu có)
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const preview = reader.result;

                    // Hiển thị xem trước tệp hình ảnh bằng một phần tử <img>
                    const previewElement = <img src={preview} alt="Xem trước" />;
                    // Lưu xem trước trong state hoặc sử dụng nó để cập nhật giao diện người dùng
                    // Ở đây, tôi sẽ lưu xem trước trong state
                    setPreview(previewElement);
                };
            }
        }
    };

    const [preview, setPreview] = useState(null);

    const handleDelete = () => {
        // Xóa tệp đã chọn bằng cách đặt selectedFile thành null
        setSelectedFile(null);
        // Đặt xem trước thành null để ẩn nó
        setPreview(null);
    };

    return (
        <div id='upload'>
            <label className="custom-file-upload">
                <input type="file" accept="image/jpeg, image/png, image/gif" onChange={handleFileChange} />
                + Hình
            </label>
            {preview && (
                <div className='hinhAnh'>
                    {preview}
                    <i className="fa-regular fa-trash-can" onClick={handleDelete}></i>
                </div>
            )}
        </div>
    );
};

export default FormUpload;
