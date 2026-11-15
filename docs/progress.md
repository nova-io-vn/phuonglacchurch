# Tiến độ hiện hành

Bản hiệu chỉnh 5: **Dinh Quoc Bao**, Nhà thờ Giáo xứ Phương Lạc.

Hiện hành: giao diện gọn cho điện thoại; bỏ giới thiệu lớn và các lớp chữ che công trình, công cụ phụ trong bảng Khác. Nhạc `/nhac.mp3` phát lặp, thử autoplay và khởi phát sau lần chạm đầu tiên nếu trình duyệt yêu cầu; có bật/tắt. Đài chuyển ra nền đá khô ở hồ cũ sân trước, thêm hai trụ tượng hai bên sân; bỏ hồ lớn và lan can phía sau cùng ao cản lối cổng sau. Orbit hỗ trợ pan hai ngón, zoom gần và di chuyển mục tiêu toàn khu vực. Xem [revision-5.md](revision-5.md).

Build production thành công. Bộ kiểm tra giao diện/nhạc/cảnh quan mới: 17 đạt; chi tiết: 11 đạt; smoke production: 10 đạt; hồi quy chức năng cũ: 35 đạt. Tổng 73 kiểm tra đạt, không có lỗi runtime hoặc tài nguyên thiếu. Đo tổng quan: 241 draw calls, khoảng 1,82 triệu tam giác kể cả bóng. Ảnh mới 36–43 trong screenshots/. Các báo cáo: compact-verification.json, details-verification.json, production-verification.json và verification.json.

Các đoạn sau ghi lịch sử bản 4 và bản 3; vị trí đài trên đảo phía sau không còn áp dụng.

Hiện hành: hai cổng lớn khác kiểu, bia tên chữ nổi, cầu/lan can đá, hồ dài phía phải với đảo đài ba cột và hai tượng hai bên; tháp nhọn trên khối giữa phía cuối theo xác nhận của người dùng. Mở rộng khuôn viên, bố trí lại nhà mái đỏ, lá cây instanced và lá nổi trên ao. Thêm mục Chi tiết gồm tám điểm xem và điều khiển mở cổng. Giữ ba mái vòm mặt tiền, bốn dãy ghế, ca đoàn trái và Không gian nhà thờ.

Build production thành công. Bộ kiểm tra chung: 35 đạt; bộ chi tiết: 11 đạt; production: 10 đạt. Không phát hiện lỗi runtime hoặc asset thiếu. Ảnh kiểm tra mới: 24–35 trong screenshots/. Tổng quan render: 242 draw calls, khoảng 1,91 triệu tam giác ở góc đo kiểm (bao gồm bóng). Có cảnh báo chunk Three.js trên 500 kB; không chặn build. Chi tiết nguồn và phần chưa xác minh ở [revision-4.md](revision-4.md).

Các đoạn bên dưới ghi lịch sử bản 3; vị trí đài trên sân khô đã được thay bằng đảo trong hồ.

Chi tiết thay đổi, nguồn asset và giới hạn ở revision-3.md. Phiên bản này đã thay Walk bằng ChurchSpace; các mô tả WASD/PointerLock trong lịch sử bản dựng trước không còn áp dụng.

Đã thực hiện: thân 54 m với nhịp bổ sung; nền/bậc cao; cửa bên/sau và chín cầu thang; tượng scan và đài cuối nhà thờ; người 1,70 m; sông/ao/cầu; sàn khảm, viền vàng, hậu tòa, đèn chùm; ánh sáng đêm rực; tên tác giả trong UI/ảnh xuất.

Kiểm tra chức năng hiện hành ghi tại verification.json; production tại production-verification.json. Đã xem screenshot mặt tiền, mặt bên đêm, nội thất, ca đoàn, đài Đức Mẹ, sông/ao và portrait. Sửa các khe hở mái thấp phía sau, ruộng đè lên ao, nhân vật đồ bảo hộ không phù hợp bằng nhân vật người thường CC0.

Không công bố mô hình là bản đo đạc chính xác. Cần tọa độ đài, tuyến sông và bản vẽ kích thước để tiếp tục hiệu chỉnh hiện trạng.
