# Tiến độ hiện hành

Bản hiệu chỉnh 7: **Đinh Quốc Bảo**, Nhà thờ Giáo xứ Phương Lạc.

Hiện hành: tên tác giả nổi bật, bấm mở số 0345 591 223 và qb.nova.io.vn. Hồ sân bên lùi sát ranh hơn, có lan can quanh bờ và chừa khoảng mở tại cầu. Cầu hai cổng dừng sau mương, trước lòng đường. Tháp sau thấp/gọn và màu đồng vàng hài hòa hơn. Orbit giữ tâm zoom, giảm độ nhạy, không đẩy camera xa khi chạm nhà; input nội thất có làm mượt, pinch/wheel zoom rộng hơn và có thể ngắt chuyển điểm.

Build production thành công. Kiểm tra trên preview 4173: **29 kiểm tra chung + 17 kiểm tra hiệu chỉnh = 46 đạt**; không có lỗi runtime/Console/tài nguyên thiếu. Ảnh 54–59 đã được xem. Góc đo chung 254 draw calls, khoảng 2,21 triệu tam giác gồm bóng. Báo cáo final-verification.json và revision-7-verification.json. Xem [revision-7.md](revision-7.md). Người dùng yêu cầu commit/push sau kiểm tra.

Các đoạn dưới là lịch sử revision 6 trở về trước; vị trí hồ và độ cao tháp cũ đã được thay bằng cấu hình revision 7.

Đã hoàn thiện theo yêu cầu mới: đình Đức Mẹ hai tầng mái cong trên đảo giữa hồ, thẳng trục mặt tiền trên phần ruộng ngoài sân; cầu nối qua hàng rào có khoảng mở. Hồ và đài Thánh Vinh Sơn Phaolô ở sân bên, tượng linh mục với hai trẻ em. Giữ sân 82 × 141 m và hai trụ tượng riêng hai bên. Đã xem lại ảnh vệ tinh Maps, điều chỉnh đường/mương, ruộng và nhóm nhà phụ. Thanh dưới chỉ có Toàn cảnh và Không gian nhà thờ; các nút/panel Chi tiết, Tour, Khác đã bỏ khỏi giao diện và mã điều phối đang chạy. Nhạc, ngày/đêm, pan/zoom và nội thất vẫn hoạt động.

Build production thành công. Bộ kiểm tra hiện hành `npm test` / tests/final.mjs: **29 kiểm tra đạt trên production preview 4173**, không có lỗi runtime, Console hoặc tài nguyên thiếu. Góc mở đầu điện thoại đã kiểm tra thấy cả đình Đức Mẹ và nhà thờ. Ảnh 44–53 và maps-revision-6.png đã được xem để kiểm tra; báo cáo final-verification.json. Góc kiểm tra: 254 draw calls, khoảng 2,16 triệu tam giác kể cả bóng. Xem [revision-6.md](revision-6.md) về phần quan sát được và giới hạn tượng tái dựng.

Các đoạn sau là lịch sử revision 5 trở về trước, không phải mặt bằng/giao diện hiện hành.

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
