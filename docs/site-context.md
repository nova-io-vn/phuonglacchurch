# Bối cảnh địa lý — Giáo xứ Phương Lạc

## Nguồn đã mở và quan sát

Người dùng cung cấp https://maps.app.goo.gl/w534umHBSEyiYDQz5 . Redirect Google Maps xác định ghim “Giáo xứ Phương Lạc” tại **20.0533125, 106.1911875**. Đã mở lớp ảnh vệ tinh trong Chrome và lưu ảnh quan sát `screenshots/maps-context.png`. Giao diện Maps hiển thị ảnh Airbus/CNES/Maxar, bản quyền theo thông tin trên ảnh. Chỉ dùng screenshot làm tài liệu phân tích; không nhúng ảnh vệ tinh thành nền hay texture trong ứng dụng.

URL quan sát: https://www.google.com/maps/@20.0535772,106.1909127,221m/data=!3m1!1e3

## Quan sát được trên ảnh

- Đường có nhãn Phương Lạc chạy dọc ranh phía bắc khu đất.
- Phía đối diện có cụm trường học, sân và các dãy nhà dài mái đỏ, nhãn Trường tiểu học Nghĩa Bình.
- Khu đất có nền/công trình đang thi công ở giữa, các khối mái đỏ ở phía đông và một khối nhỏ phía nam.
- Có ao phía tây với một kết cấu bê tông nổi; các ao khác phía đông, một dải nước ở phần đông nam.
- Có đường nhỏ ở mép phía đông, nhà dân mái đỏ dọc đường và các thửa ruộng ở phía nam/tây.

Ảnh vệ tinh có thể khác hiện trạng ngày nay, đặc biệt công trình ở giữa đang thể hiện giai đoạn xây dựng. Kiến trúc mới lấy theo phối cảnh vàng người dùng gửi, không sao chép nền móng trong ảnh vệ tinh làm nhà thờ hiện tại.

## Chuyển sang không gian 3D

Quy ước mô phỏng mặt tiền hướng tây, +Z hướng tây; -Z hướng đông; -X là bắc, +X là nam. Hướng trục dài đông-tây được suy luận từ nền công trình trong ảnh, **chưa có khảo sát phương vị**. La bàn và bản đồ nhỏ dùng cùng quy ước này.

Bố trí các nhóm công trình theo quan hệ vị trí quan sát: đường phía -X; trường qua đường; nhà xứ/hội trường về -Z; ao trước lệch +X và ao sau; ruộng và nhà dân bên ngoài. Chi tiết mái/cửa của nhà dân, hàng rào, cây, cây trồng, cột đèn và bề mặt đường là thiết kế bổ sung, không phải mô hình quét hiện trạng.

Khuôn viên giả định khoảng 61 × 103 m. Khoảng cách được ước lượng từ thước tỷ lệ hiển thị 20 m, chưa georeference từng góc đất; không dùng làm hồ sơ địa chính. Không xác định công năng chính xác từng nhà phụ từ ảnh mái; trường học chỉ được mô phỏng khối/tương quan vị trí. Bệ có thánh giá bên ao là bổ sung thiết kế, không khẳng định ảnh vệ tinh thể hiện thánh giá ở vị trí đó.

Không cần Google Maps API, tài khoản, key hoặc mạng để chạy cảnh 3D. `src/environment/ParishSite.ts` giữ tọa độ nguồn và mọi geometry cảnh quan để hiệu chỉnh tiếp.
