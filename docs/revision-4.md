# Hiệu chỉnh 4 — cổng, hồ và tháp phía cuối

Tác giả trải nghiệm: **Dinh Quoc Bao**. Công trình: **Nhà thờ Giáo xứ Phương Lạc**.

## Cơ sở đối chiếu

Ưu tiên hai ảnh Street View và ảnh vệ tinh người dùng đính kèm trong lượt hiệu chỉnh này cho cổng và cảnh quan. Liên kết Maps rút gọn không mở được bằng công cụ duyệt web trong lượt này; không coi đó là dữ liệu khảo sát mới. Giữ kiến trúc ba mái vòm phía trước theo phối cảnh vàng. Người dùng xác nhận tháp nhọn đặt ở **khối giữa phía cuối trong ảnh web**.

Quan sát được: hai loại cổng khác nhau; cổng trụ mở có cánh kim loại; cổng vòm đá có thánh giá; cầu và lan can đá đục lỗ; bia xám chữ vàng; mặt nước, cây xanh và các nhà phụ mái đỏ. Theo chỉ dẫn người dùng, đài ở trong hồ phía phải, gồm ba cột chính và hai tượng bên. Ảnh không cung cấp số đo, vị trí GPS từng cấu kiện hay ảnh cận tượng hiện trạng.

## Thay đổi

- Hai cổng riêng tại ranh đường: cổng trụ và cổng vòm đá. Mỗi cổng có hai lá mở/đóng, huy hiệu IHS, tia mặt trời, thanh đứng, cuốn lá, trán cổng và cầu lan can. Các phần động được gộp geometry theo vật liệu trong hệ tọa độ bản lề.
- Bia chữ nổi bằng TextGeometry, dùng Noto Serif có giấy phép OFL, không dùng ảnh phẳng thay cho chữ/kiến trúc.
- Di chuyển đài vào đảo giữa hồ dài ở phía phải cuối nhà thờ; ba cột có rãnh, đầu cột, vòng kim loại; tượng giữa cao và hai tượng hai bên. Bỏ mái che cũ trên sân khô. Cầu thực nối sân với đảo, lan can quanh bờ.
- Bố trí lại cụm nhà phụ mái đỏ về một phía hồ. Mở rộng sân và ranh khuôn viên. Ruộng không đè lên khu sân mới. Thêm lá nổi trên ao và tán cây bằng lá geometry instanced, tránh tán cầu đặc khi xem gần.
- Tháp nhọn nhiều tầng tại đầu hồi giữa phía sau, có tầng chuông/cửa vòm, chóp tám cạnh, gờ đứng, crockets, trụ góc và thánh giá. Ba mái vòm mặt tiền được giữ nguyên.
- Mục **Chi tiết** với tám điểm: hai cổng, bia tên, đài trong hồ, tháp phía cuối, cửa/bậc, kính màu/cột và cung thánh. Có trước/sau, kéo nhìn, cuộn zoom, mở/đóng cổng và thoát. Vẫn có Không gian nhà thờ và tour tự động.
- Camera ngoại cảnh đi qua cao độ an toàn trước khi hạ xuống điểm chi tiết; vào nội thất qua cửa trước trong cùng scene. Điều chỉnh đèn khu đài để giảm cháy sáng tượng.

## Kiểm tra và giới hạn

Ảnh đánh giá mới nằm trong `docs/screenshots/24-...35-...`; ảnh toàn cảnh và nội thất được cập nhật bởi bộ kiểm tra chung. Hai bộ kiểm tra chức năng có báo cáo `verification.json` và `details-verification.json`; bản production có `production-verification.json`.

Đây vẫn là mô hình mô phỏng, chưa phải bản sao hiện trạng theo đo đạc. Tượng là bản quét SMK KAS225 CC0 thay thế có công bố nguồn; ba tượng ở hồ dùng cùng một mẫu, chưa tái hiện nhận dạng chính xác từng tượng thực địa. Kiểu đài, kích thước hồ, khoảng cách hai cổng và hình nhà phụ cần khảo sát bổ sung. Tháp nhọn phía sau là bổ sung theo vị trí được người dùng xác nhận, không được suy diễn là cấu kiện đã xác minh từ vệ tinh.
