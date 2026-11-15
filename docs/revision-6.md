# Hiệu chỉnh 6 — hai khu đài và giao diện cuối

Tác giả trải nghiệm: **Dinh Quoc Bao**. Công trình: **Nhà thờ Giáo xứ Phương Lạc**.

## Đối chiếu nguồn

Đã mở lại liên kết Google Maps người dùng cung cấp bằng Chrome, xem ảnh vệ tinh và lưu ảnh quan sát tại `screenshots/maps-revision-6.png`. URL quan sát: https://www.google.com/maps/@20.0535772,106.1909127,221m/data=!3m1!1e3 . Ảnh hiển thị nguồn Airbus/CNES/Maxar và thước tỷ lệ 20 m. Screenshot chỉ phục vụ phân tích, không được nhúng làm texture/nền thay mô hình 3D.

Quan sát được: đường Phương Lạc chạy ngang ranh phía bắc; trường tiểu học ở phía đối diện; nhà mái đỏ và đường nhỏ phía đông; hai ao ngoài đường phía đông; một ao có kết cấu nổi phía trước/tây và một dải ao ở cạnh nam khu nhà phụ. Khu trung tâm còn thể hiện giai đoạn thi công. Vị trí tường/cây/công năng từng nhà vẫn chưa đủ dữ liệu để dựng như hồ sơ đo đạc.

Quy ước ứng dụng tiếp tục giữ +Z về sân trước/tây, -X về phía bắc. **Độ rộng sân hiện tại giữ nguyên 82 m; chiều dài khu sân 141 m.** Hình dáng nhà thờ mới vẫn theo phối cảnh vàng, không dùng nền thi công vệ tinh làm mô hình nhà thờ.

## Đài Đức Mẹ theo ảnh 1 mới

- Bỏ cụm ba trụ cao và hai tượng bên trên sân phía trước của revision 5.
- Dựng đình mở bốn cột màu san hô, hai tầng mái ngói đỏ cong, góc mái vểnh, gờ mái, đầu đao, tầng cổ mái có kết cấu liên tục, phào/trang trí và thánh giá.
- Đặt ở **trục x=0** thẳng cửa chính, tâm thiết kế z=96, trên phần ruộng ngoài ranh sân z=67. Hồ thiết kế 38 × 48 m bao quanh đảo 15 × 13 m. Không kéo rộng/co hẹp sân đã được người dùng duyệt.
- Cầu rộng 3,8 m, dài 25 m nối sân qua khoảng mở hàng rào đến đảo; có lan can thật và các bậc nối. Trục đi từ bậc nhà thờ ra hồ được giữ thông. Các ô va chạm nước loại trừ cầu và đảo.
- Giữ hai trụ tượng riêng hai bên sân theo yêu cầu trước; không nhầm hai trụ này với cụm ba cột của đài cũ.

## Hồ và đài Thánh Vinh Sơn

Người dùng xác nhận **Thánh Vinh Sơn Phaolô**, không phải Thánh Vinh Sơn Phê-rê.

Hồ nằm ở vùng sân bên trong ảnh 3: tâm thiết kế (35,-40), rộng 16 m và dài 36 m. Mép phía công trình x=27, chừa khoảng cách với chân cầu thang cánh ngang và lối sau. Đảo 9 × 12 m, có cầu ngang từ sân và bệ tên chữ nổi.

Tượng là một **phương án mô phỏng điêu khắc**: hình linh mục lớn tuổi, áo chùng có nếp gấp/cổ/nút, bồng trẻ nhỏ và một em bé đứng bên. Dùng hình học cơ thể/khuôn mặt/bàn tay từ Quaternius CC0, tạo hình áo và bố cục mới bằng procedural geometry; không đổi tượng Đức Mẹ rồi ghi tên Thánh Vinh Sơn. Tượng này không phải bản quét hoặc bản sao có kiểm chứng của tượng tại giáo xứ. Tượng Đức Mẹ vẫn dùng scan SMK CC0 có ghi nguồn.

## Cảnh quan và giao diện

- Điều chỉnh quan hệ đường bắc, mương và cầu hai cổng; cụm nhà mái đỏ phía sau thành bố cục nối tiếp, giữ các ao ngoài đường và ruộng xung quanh.
- Thu hẹp tuyến nước phía đông từ hình thức sông rộng cũ thành kênh/mương; chia thửa ruộng để không xuyên lên mặt hồ mới.
- Bề rộng lối đi quanh nhà thờ và sân trước được giữ. Không đặt hồ lên bậc vào nhà hoặc che cửa.
- Thanh dưới **chỉ còn “Toàn cảnh” và “Không gian nhà thờ”**. Loại bỏ các nút, menu, panel, mã điều phối và import đang hoạt động của Chi tiết/Tour/Khác; không chỉ ẩn bằng CSS. Giao diện dùng stylesheet tối giản riêng.
- Vẫn giữ Sáng/Tối, nhạc `/nhac.mp3`, tác giả, sáu điểm xem nội thất và điều khiển xoay/pan/zoom. Double-click bề mặt để đổi tâm xoay; một ngón xoay, hai ngón kéo/zoom trên điện thoại.

## Kiểm tra

`npm test` nay chạy `tests/final.mjs`, phù hợp với giao diện hai nút mới. Các bộ kiểm tra revision trước có yêu cầu nút đã bỏ chỉ còn là lịch sử. Báo cáo hiện hành: `final-verification.json`. Ảnh 44–53 đối chiếu toàn cảnh, trục cầu, hai tầng mái, tượng Vinh Sơn, ban đêm, nội thất và điện thoại.

Đây là bản tái dựng có thể hiệu chỉnh; mọi kích thước khu đài/hồ đều là giả định thiết kế theo ảnh và vị trí chỉ dẫn, không phải kích thước xây dựng thực tế. Không công bố độ giống 100% với Google Maps hoặc tượng ngoài thực địa.
