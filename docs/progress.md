# Tiến độ hiệu chỉnh — 15/11/2026

## Bản hiện tại: Nhà thờ Giáo xứ Phương Lạc

Đã quan sát các phối cảnh mới người dùng gửi và mở đúng ghim Google Maps. Phiên bản trước chưa có ảnh; vòng này đã có ảnh trong hội thoại nên không còn hiển thị thông báo thiếu ảnh trong UI.

| Hạng mục | Thực hiện | Kiểm tra |
|---|---|---|
| Nguồn | Phân tích 3 phối cảnh vàng, 2 ảnh đêm; quan sát ảnh vệ tinh Maps | Lưu maps-context.png; ghi rõ phần suy luận |
| Kiến trúc | Mái basilica hai cao độ, cửa tầng trên, lan can/phào, tháp mái vòm và lam, hai cánh ngang | Review trước/hai bên/sau/trên cao |
| Mái | Geometry các patch mái cắt tại thung mái, kết nối cánh ngang, mái lối bên thấp | Đã sửa khoảng hở vai cánh ngang |
| Ghế | 4 dãy dọc × 10 băng | Đếm collider và thử 4 lối phụ |
| Ca đoàn | Cánh trái, sàn gỗ, 6 băng, organ/phím đàn, giá nhạc | Lối đi liên tục từ gian chính, cao độ 0.76 m |
| Cánh phải | Không gian cầu nguyện, ghế và bàn thờ nhỏ | Cùng mặt bằng, có collider |
| Cảnh quan | Đường phía bắc, trường qua đường, nhà/ao phía đông, ao trước, ruộng/nhà dân | Camera Khu vực; đối chiếu tương quan vệ tinh |
| Thời điểm | Buổi sáng 07:30 / Buổi tối 19:00; sky/mây, nắng, đèn và glow/bloom | Nút riêng, state ARIA và screenshot |
| Trải nghiệm | Giữ Orbit/Walk/touch/PNG; tour cập nhật ca đoàn và cảnh quan; bản đồ bốn dãy | Playwright và production preview |
| Tối ưu | Static batching, cây instanced, giới hạn đèn, shadow cache, DPR cap | Budget dưới 100 calls ở frame kiểm tra ban ngày; không cam kết FPS mọi thiết bị |

Tệp kết quả: verification.json và production-verification.json. Console/asset HTTP được kiểm tra cùng các luồng chức năng. Cảm ứng được giả lập trên Chrome, chưa kiểm tra tablet vật lý.

## Sửa lỗi phát hiện qua review

- Thân nhà cũ một mái lớn chưa khớp phối cảnh: thay bằng gian cao/hành lang thấp.
- Khối ngang trước đây chỉ là gable gắn ngoài: thay bằng phòng/cánh thực thông nội thất.
- Khoảng hở giữa mái thấp và cánh ngang: bổ sung tường vai phía trên, giữ lối đi dưới mở.
- Trần lối bên vượt mái thấp: hạ biên dạng và ngắt trần tại cánh ngang.
- Ca đoàn ở tiền sảnh không đúng yêu cầu: bỏ gác cũ, chuyển sang cánh trái.
- Ánh sáng đêm ban đầu quá gắt: giảm công suất đèn, environment ban đêm và mức bloom.

Hốc tượng chờ mô hình được cấp phép. Kích thước và trang trí chưa xác nhận bằng khảo sát. Không công bố độ giống 100% hoặc cảnh quan đúng từng nhà.
