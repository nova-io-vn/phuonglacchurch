> **Bản hiện hành:** xem [hiệu chỉnh 3](revision-3.md) và [giả định mới](assumptions.md). Các kích thước và cách điều khiển ở phần ghi chép lượt trước bên dưới là lịch sử, đã được thay trong bản 3.

﻿# Phân tích tham chiếu — Nhà thờ Giáo xứ Phương Lạc

Cập nhật ngày 15/11/2026 sau khi người dùng cung cấp hình ảnh trong hội thoại và ghim Google Maps. Tình trạng “chưa có ảnh” của phiên bản Aurelia ban đầu không còn đúng với vòng hiệu chỉnh này. Tệp ảnh gốc chưa được lưu thành file trong public/references/, nhưng hình ảnh đã được quan sát trực tiếp trong hội thoại.

## Nguồn và phân biệt vai trò

| Ảnh được gửi ở lượt hiệu chỉnh | Nội dung quan sát | Sử dụng |
|---|---|---|
| 1 | Mặt tiền đêm, ba tháp nhọn, đèn vàng viền cửa và tháp, có watermark Dola AI | Chỉ tham khảo ánh sáng, không dùng thay hình học phối cảnh vàng |
| 2 | Mặt bên đêm, thân dài, tầng cửa cao nhỏ lặp nhịp, mái hành lang thấp, đầu hồi lớn | Ánh sáng và nhịp điệu; chữ kích thước quá nhỏ/không rõ để làm số đo |
| 3 | Phối cảnh vàng từ phía cuối, thấy tháp ở xa bên trái, khối ngang nhô và các cửa tầng trên | Cấu trúc basilica, mái thấp/cao, khối ngang và bệ đá |
| 4 | Phối cảnh vàng trước 3/4, ba tháp mái vòm cong, ba cổng nhọn, hốc tượng, phào/lan can | Nguồn chính cho mặt tiền và dáng tháp |
| 5 | Phối cảnh vàng từ phía cuối đối diện, hai khối đầu hồi cao, mái đỏ nhiều cấp, hàng cửa thấp và bậc lên | Đối chiếu quan hệ giữa mặt bên, phần cuối và hai cánh |

Không thay vòm cong bằng tháp nhọn từ ảnh AI ban đêm. Không lấy các số mờ trong ảnh làm kích thước xây dựng.

## Phân tích hình học

Mặt tiền có trục đối xứng dọc giữa cổng chính và tháp giữa. Hai tháp phụ nhỏ hơn nằm hai bên. Thân là dạng basilica: gian giữa cao, hai lối bên thấp, mái đỏ ở hai cao độ và dải cửa sổ tầng trên. Các khối đầu hồi nhô ở nửa sau công trình tạo hai cánh ngang. Bệ đá xám và các bậc bao các lối vào. Tường vàng đất, khung cửa và gờ trắng ngà; các vòm có viền nhiều lớp, trụ nổi và các chóp trang trí lặp lại.

Tỷ lệ đọc tương đối: tháp giữa cao nổi bật hơn khoảng một nửa chiều cao khối mái gian giữa; tháp phụ thấp hơn rõ rệt. Chiều dài thân lớn hơn bề rộng mặt tiền. Đây là quan sát tỷ lệ trên ảnh phối cảnh, không phải đo đạc trực giao.

Mô hình đã sửa: mái đơn lớn thành mái giữa + hai mái hành lang; thêm cửa tầng trên, lan can/phào; hai cánh ngang thực sự thông trong nhà; mái giao cắt bằng geometry có đường thung mái, không chồng hai mặt mái kín xuyên nhau. Cửa tháp chuyển sang hốc và lam thông gió; vòm tháp màu vàng nhạt, giữ gân cong.

## Trục và bố trí nội thất theo yêu cầu

Y lên, X ngang, +Z về sân trước. Cửa chính z=18; cung thánh phía -Z. Cánh trái khi đứng ở cửa nhìn lên bàn thờ là -X, dành cho ca đoàn. Cánh +X là khu cầu nguyện. Bốn dãy ghế dọc tâm x=-8, -3.15, 3.15, 8; mỗi dãy 10 băng, có lối giữa và lối phụ. Nội thất không có ảnh nguồn, nên là thiết kế mô phỏng theo chỉ dẫn mới.

## Đối chiếu và giới hạn

Đã chụp các camera chính diện, hai bên, phía sau và 3/4 để xem hình khối, mái, nhịp cửa, các cánh ngang. Ảnh ở docs/screenshots/. Các ảnh chụp tham chiếu bị phối cảnh và chụp lại từ bản in, nên chưa thể khớp camera hoặc tỷ lệ bằng phép đo chuẩn. Không công bố giống 100%; số cửa, bề dày và trang trí còn cần bản vẽ có kích thước để kiểm chứng. Hốc tượng vẫn để trống vì chưa có asset phù hợp được cấp phép.

Bối cảnh riêng được phân tích tại [site-context.md](site-context.md).

## Hiệu chỉnh theo ảnh Street View và xác nhận mới

Xem [revision-4.md](revision-4.md). Hai cổng khác loại và bia xám chữ vàng được dựng theo ảnh người dùng đính kèm. Hồ dài, cụm nhà đỏ và đài trên đảo đặt về phải cuối công trình theo ảnh vệ tinh và chỉ dẫn; ba cột chính, hai tượng hai bên. Tháp nhọn bổ sung **trên khối giữa phía cuối trong ảnh web**, đúng vị trí người dùng xác nhận, giữ mái vòm phía trước. Tượng scan CC0 đã được đưa vào hốc mặt tiền và khu đài; ghi chú hốc còn trống ở phần lịch sử phía trên không còn áp dụng. Ghế hiện tại là 4 dãy × 16 băng. Kích thước và khoảng cách cổng/hồ là giả định thiết kế, không phải đo đạc hiện trạng.
