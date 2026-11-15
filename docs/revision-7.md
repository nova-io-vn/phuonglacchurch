# Hiệu chỉnh 7 — liên hệ tác giả, lối vào và camera

Tác giả hiển thị: **Đinh Quốc Bảo**. Người dùng cung cấp số **0345591223** và website **https://qb.nova.io.vn**, đồng thời yêu cầu commit/push dự án sau khi kiểm tra.

- Tên tác giả thành nút nổi bật, bấm mở dialog thông tin. Có liên kết gọi điện `tel:0345591223`, website mở tab mới và đóng bằng nút/ESC/chạm ngoài. Không thêm nút vào thanh chế độ; thanh dưới vẫn chỉ có Toàn cảnh và Không gian nhà thờ.
- Hồ Thánh Vinh Sơn chuyển gần ranh sân hơn: tâm từ x=35 sang x=38; bán rộng 7,5 m. Bờ ngoài tới x=45,5, có lan can bao quanh và lối ngoài rộng hơn 2 m trước hàng rào x=48. Khoảng mở tại cầu được giữ; cầu và tượng cùng chuyển theo cấu hình chung.
- Cầu cổng rút từ 13 m xuống 5,6 m. Đầu cầu/lan can kết thúc khoảng x=-39,4, qua mương nhưng trước mép đường x=-40; lòng đường lớn không còn bị lan can cầu chắn ngang.
- Tháp nhọn sau thu gọn chiều ngang, giảm đỉnh từ khoảng 35,5 m xuống khoảng 32 m kể cả nâng bệ. Màu mái đổi từ đen sang đồng patina vàng dịu, giữ chóp nhọn/thánh giá và gờ Gothic.
- Orbit giảm tốc xoay/zoom, giữ tâm zoom ổn định thay vì kéo tâm theo con trỏ. Chặn camera sát công trình bằng giữ vị trí hợp lệ trước, bỏ vòng lặp đẩy camera tới 90 m. Double-click đổi tâm bằng chuyển động êm, có thể ngắt bằng thao tác mới.
- Nội thất dùng input panorama riêng: kéo theo kiểu nắm ảnh, độ nhạy theo kích thước màn hình/FOV, làm mượt theo thời gian, pinch và wheel zoom trong khoảng 24–88 độ. Có thể kéo/zoom để dừng chuyến chuyển điểm, không phải chờ khóa điều khiển. Giải phóng pointer khi hủy capture/mất focus; ESC về Toàn cảnh.

Kiểm tra chuyên biệt: `tests/revision-seven.mjs`, báo cáo `revision-7-verification.json`, ảnh 54–59. Kiểm tra chung vẫn là `npm test`, báo cáo `final-verification.json`. Có kiểm tra CDP hai ngón trên màn hình điện thoại, kéo/zoom thực qua Playwright, ổn định tâm zoom và không bật camera khi chạm vùng nhà.

Các kích thước cảnh quan tiếp tục là giả định tái dựng, không phải bản vẽ khảo sát. Nội dung liên hệ được hiển thị theo thông tin người dùng cung cấp; không gửi biểu mẫu hay dữ liệu liên hệ tới dịch vụ ngoài.
