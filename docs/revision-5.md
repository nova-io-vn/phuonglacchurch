# Hiệu chỉnh 5 — giao diện gọn và sân trước

## Yêu cầu được áp dụng

- Bỏ phần giới thiệu lớn, dòng “ĐỨC TIN & DI SẢN”, mô tả quảng bá và nút nội thất trùng. Ẩn bảng tỷ lệ, vị trí và la bàn trên màn hình chính. Tên giáo xứ và tác giả vẫn có mặt.
- Thanh chế độ nhỏ phía dưới; sáu góc nhìn cùng chụp ảnh, bản đồ, toàn màn hình, reset và hướng dẫn nằm trong bảng **Khác**, chỉ mở khi cần. Điện thoại dùng danh sách chọn không gian/điểm chi tiết thay cho bảng nút lớn. Mục tour cũng rút gọn trên điện thoại.
- Nhạc cục bộ `/nhac.mp3`, lặp, âm lượng 32%, nút bật/tắt. Thử tự phát có tiếng lúc khởi tạo; nếu chính sách trình duyệt chặn thì thử lại trong lần chạm/phím đầu tiên. Tôn trọng thao tác tắt của người dùng. Không giả vờ bảo đảm autoplay có tiếng trên iOS/Android khi trình duyệt cấm.
- Di chuyển toàn bộ cụm đài ba cột và hai tượng bên tới sân trước phía phải, tâm thiết kế (18,47), đúng khu vực hồ cũ trong ảnh 2. Đài đứng trên nền đá khô; bỏ hồ trước và hồ lớn/lan can/đường cầu quanh vị trí đài cũ phía sau.
- Thêm hai trụ tượng cao hai bên sân, tại (-18,30) và (18,30). Các trụ có chân đế, rãnh dọc, vòng kim loại, đầu cột và tượng scan. Tổng cộng bảy tượng (bao gồm hai tượng mặt tiền).
- Bỏ ao cạnh cổng phía sau để mở đường; khu phía sau giữa cầu thang và nhà phụ trở lại sân lát đá liên tục. Dời đèn sân khỏi nền đài mới. Giữ sông và hai ao ngoài khuôn viên cùng hồ nhỏ cạnh bia tên.
- Orbit cho phép pan theo mặt màn hình, zoom về con trỏ, khoảng zoom 0,8–650 m và vùng mục tiêu rộng. Điện thoại: một ngón xoay, hai ngón đồng thời kéo/zoom. Bỏ lệch tâm camera phục vụ bố cục chữ cũ; không ép mục tiêu về tâm nhà thờ.

## Kiểm tra

`tests/compact.mjs` kiểm tra giao diện điện thoại, vị trí đài, hai trụ bổ sung, các vùng hồ đã bỏ, MP3 và tắt/bật nhạc dưới chính sách autoplay bắt buộc tương tác, thao tác pan bằng hai ngón qua CDP, bộ chọn nội thất/chi tiết và lỗi tài nguyên. Báo cáo: `compact-verification.json`. Ảnh mới 36–43 trong `screenshots/`.

Các kiểm tra cũ được cập nhật để mở công cụ từ bảng Khác và kiểm tra bảy tượng. Mô hình dùng cùng một scene 3D như trước. Các mô tả “đài trên đảo trong hồ phía sau” ở tài liệu revision 4 là lịch sử, đã được thay bằng yêu cầu mới.

Vị trí được suy luận từ ảnh chụp ứng dụng và chỉ dẫn, không phải số đo hiện trường. Các tượng vẫn dùng mẫu SMK CC0 có công bố nguồn.
