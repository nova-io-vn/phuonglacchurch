# Hiệu chỉnh cầu thang, tỷ lệ, đài và không gian — 15/11/2026

Tác giả hiển thị: **Dinh Quoc Bao**.

## Thay đổi so với bản trước

- Bỏ WalkMode, PointerLock, WASD, cần di chuyển và hướng dẫn game. Thay bằng Không gian nhà thờ: sáu điểm camera nội thất, kéo để nhìn quanh, cuộn/chụm để đổi FOV. Camera chuyển qua lộ trình trong cùng scene.
- Kéo dài thân từ 42 lên 54 m bằng thêm hai nhịp 6 m; không kéo giãn các tháp, người hay cửa sổ. Hai cánh và cung thánh dời về phía sau 12 m. Bốn dãy ghế nay mỗi dãy 16 băng.
- Nền cao từ 0,60 lên 1,35 m. Chín cụm cầu thang, mỗi cụm tám bậc, có tay vịn, đá mũi bậc và đèn viền; các cửa bên và phía sau có lỗ mở thực và cánh cửa.
- Bổ sung đài Đức Mẹ phía cuối tại vị trí thiết kế (0,-53), hai bệ tượng trong sân và tượng ở mặt tiền. Tượng là bản quét lịch sử SMK KAS225, không phải mẫu tượng thực địa của giáo xứ.
- Ba nhân vật tỷ lệ từ mesh người Quaternius CC0, có mặt/mắt/tay/chân và skeleton; hiệu chỉnh tư thế và vật liệu, đo chiều cao hình học 1,70 m. Đây không phải capsule hay icon người.
- Bổ sung sông/kênh có bờ cong, mặt nước động và cầu; giữ các ao, điều chỉnh thửa ruộng để không đè lên mặt nước. Vị trí tuyến nước và shrine là ước định theo chỉ dẫn, không phải bản đồ thủy văn/địa chính.
- Sàn đá bóng và khảm, viền vàng ở cột, hoa thị, hậu tòa Gothic nhiều lớp, đèn chùm pha lê và chi tiết phù điêu ngoài nhà.
- Buổi tối tăng đèn hắt, đèn viền khung cửa/mũi bậc/phào và bloom để có không khí rực sáng như ảnh đêm; không đổi vòm thành tháp nhọn.

## Kiểm tra

`npm run build`, Playwright desktop/tablet/portrait, các góc cầu thang/đài/sông, sáu không gian và mười điểm tour. Kết quả hiện hành ở verification.json, ảnh chụp ở screenshots/. Mô hình và giấy phép trong public/models/; runtime không cần dịch vụ mô hình bên ngoài.

Phát hiện qua review ảnh đã sửa: khe hở tam giác mái thấp ở mặt sau; bờ ruộng đè lên ao sau; nhân vật Cesium dạng đồ bảo hộ không phù hợp không gian nên đã thay bằng mesh người thường.

## Giới hạn dữ liệu

54 m và 1,35 m là tỷ lệ thiết kế hiệu chỉnh theo ảnh, chưa là số đo công trình thực. Chưa có tọa độ khảo sát đài Đức Mẹ/tuyến sông hay mẫu tượng tại chỗ. Ảnh Google Maps rộng dùng để quan sát được lưu tại screenshots/maps-wide-context.png; ảnh nguồn không được nhúng vào scene làm bối cảnh giả.
