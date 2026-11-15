# Nhà thờ Giáo xứ Phương Lạc

**Tác giả: Đinh Quốc Bảo.** Trải nghiệm 3D bằng Vite, TypeScript và Three.js, không React/backend/API key. Bấm tên tác giả trong ứng dụng để gọi **0345 591 223** hoặc mở **qb.nova.io.vn**.

```sh
npm install
npm run dev
npm run build
npm run preview
```

Node 22.12+. Dev: http://localhost:5173. Production preview: http://localhost:4173. Thư mục `dist/` có thể đưa lên static hosting.

## Bản hiện tại

- Thân dài 54 m theo tỷ lệ mô phỏng, thêm nhịp kiến trúc thay vì kéo giãn hình học cửa/tháp.
- Bệ 1,35 m; chín cụm cầu thang tám bậc, tay vịn, đèn viền. Cửa bên và phía sau là lỗ mở thực với cánh cửa.
- Hai cổng lớn theo ảnh Street View, cánh đồng tương tác, cầu lan can đá, bia tên chữ nổi.
- Đài Đức Mẹ kiểu đình hai tầng mái ngói cong theo ảnh mới, giữa hồ trên trục cửa chính, ngoài sân trước; có đảo và cầu lan can đá. Giữ hai trụ tượng riêng hai bên sân.
- Hồ sân bên có đài **Thánh Vinh Sơn Phaolô** với linh mục và hai trẻ em. Tượng là phương án tái dựng từ cơ thể CC0 và hình học áo/nếp vải mới, không phải bản quét tượng tại giáo xứ.
- Tháp nhọn bổ sung trên khối giữa phía cuối theo vị trí được xác nhận; giữ ba mái vòm mặt tiền. Sân rộng và lối đi thông phía sau cụm nhà phụ mái đỏ.
- Ba nhân vật tham chiếu có mặt/mắt/tay/chân và skeleton, cao 1,70 m đo trên geometry.
- Sông/kênh, cầu, các ao và mặt nước động; các nhóm trường/nhà/ruộng tham khảo quan hệ trên Google Maps.
- Bốn dãy ghế dọc, mỗi dãy 16 băng; ca đoàn bên trái. Sàn đá khảm, viền vàng, hậu tòa và đèn chùm pha lê.
- Buổi sáng/buổi tối, tăng chiếu sáng kiến trúc ban đêm theo ảnh tham khảo.

## Điều khiển mới

Thanh dưới chỉ có **Toàn cảnh** và **Không gian nhà thờ**. Các nút Chi tiết, Tour và Khác đã bỏ theo yêu cầu mới.

**Toàn cảnh:** kéo xoay, cuộn zoom, chuột phải pan; double-click bề mặt để đổi tâm xoay êm. Điện thoại: một ngón xoay, hai ngón kéo/thu phóng. Zoom giữ tâm ổn định, không bật camera khi chạm công trình.

MP3 `/nhac.mp3` phát lặp: tự thử khi mở trang và bắt đầu sau lần chạm đầu tiên nếu trình duyệt chặn autoplay có tiếng. Có nút bật/tắt riêng. Sáng/Tối vẫn có ở góc trên.

**Không gian nhà thờ:** thay hoàn toàn chế độ Đi dạo. Sáu điểm xem: toàn gian, tầm mắt 1,70 m, cung thánh, ca đoàn, cánh cầu nguyện, vòm/đèn chùm. Kéo để nhìn quanh; cuộn hoặc chụm hai ngón để đổi góc nhìn. Không khóa chuột, không WASD. Camera vẫn di chuyển trong cùng scene.

Kéo nội thất theo kiểu nắm ảnh, có làm mượt; wheel/pinch zoom 24–88 độ. Kéo hoặc zoom trong lúc chuyển điểm sẽ ngắt chuyển động để người xem điều khiển ngay.

Nhấp cánh cửa/cổng để mở hoặc đóng. F toàn màn hình, ESC về toàn cảnh. Không có Walk/PointerLock hoặc chuyển sang một mô hình nội thất khác.

## Kiểm tra

Cần Chrome đã cài và dev server đang chạy:

```sh
npm test
# Preview đang chạy ở 4173:
$env:TEST_URL='http://localhost:4173'; npm test
```

Kết quả hiện hành: `docs/final-verification.json`, bộ kiểm tra `tests/final.mjs`. Screenshot mới 44–53 trong docs/screenshots/. Kiểm tra hai nút, vị trí hai hồ/đài, cầu thông từ sân, giữ kích thước sân, sáu điểm nội thất, người 1,70 m, chín cầu thang, nhạc, pan/zoom, điện thoại, Console và asset HTTP. Các bộ kiểm tra revision trước có nút đã bỏ chỉ còn là lịch sử.

Static geometry batch theo vật liệu, cây dùng InstancedMesh, tượng dùng LOD, shadow cache và giới hạn DPR/đèn. Mô hình chi tiết hơn làm draw calls cao hơn bản trước; kiểm tra hiện tại dưới budget 300 calls/frame được ghi, không cam kết FPS cho mọi GPU. Three.js chunk >500 KB không nén là cảnh báo build, không phải lỗi.

## Tài liệu và nguồn

[Hiệu chỉnh mới nhất](docs/revision-7.md) · [Phân tích ảnh](docs/reference-analysis.md) · [Giả định](docs/assumptions.md) · [Nguồn mô hình](public/models/CREDITS.md).

Kích thước, vị trí đài và đường sông/kênh vẫn là thiết kế ước định, chưa có bản vẽ khảo sát. Tượng dùng mẫu Đức Mẹ và Hài Nhi của SMK, không khẳng định là tượng tại Phương Lạc. Nhân vật Quaternius CC0 chỉ làm mốc tỷ lệ. Toàn bộ asset được lưu cục bộ, không gọi dịch vụ mô hình bên ngoài khi chạy.
