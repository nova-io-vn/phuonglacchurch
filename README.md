# Nhà thờ Giáo xứ Phương Lạc

**Tác giả: Dinh Quoc Bao.** Trải nghiệm 3D bằng Vite, TypeScript và Three.js, không React/backend/API key.

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
- Đài Đức Mẹ phía cuối, hai bệ tượng ở sân, tượng ở mặt tiền. Dùng GLB từ bản quét SMK có giấy phép, không phải người hình học thô.
- Nhân vật có mặt/mắt/tay/chân và skeleton, cao 1,70 m đo trên geometry. Có nút ẩn/hiện.
- Sông/kênh, cầu, các ao và mặt nước động; các nhóm trường/nhà/ruộng tham khảo quan hệ trên Google Maps.
- Bốn dãy ghế dọc, mỗi dãy 16 băng; ca đoàn bên trái. Sàn đá khảm, viền vàng, hậu tòa và đèn chùm pha lê.
- Buổi sáng/buổi tối, tăng chiếu sáng kiến trúc ban đêm theo ảnh tham khảo.

## Điều khiển mới

**Toàn cảnh:** kéo xoay, cuộn zoom, chuột phải pan. Các nút mặt tiền, mặt bên, trên cao, đài Đức Mẹ, sông/ao và khu vực.

**Không gian nhà thờ:** thay hoàn toàn chế độ Đi dạo. Sáu điểm xem: toàn gian, tầm mắt 1,70 m, cung thánh, ca đoàn, cánh cầu nguyện, vòm/đèn chùm. Kéo để nhìn quanh; cuộn hoặc chụm hai ngón để đổi góc nhìn. Không khóa chuột, không WASD. Camera vẫn di chuyển trong cùng scene.

**Tour:** 10 điểm, trước/sau, tạm dừng/tiếp tục, thoát. F toàn màn hình, M mặt bằng, ESC về toàn cảnh. Nhấp cánh cửa để tương tác khi xem tự do. Máy ảnh xuất PNG có tên tác giả trong filename.

## Kiểm tra

Cần Chrome đã cài và dev server đang chạy:

```sh
npm test
# Preview đang chạy ở 4173:
node tests/production.mjs
```

Kết quả: docs/verification.json và docs/production-verification.json. Screenshot trong docs/screenshots/. Các kiểm tra mới xác nhận Walk đã bỏ, Space hoạt động bằng kéo nhìn, sáu điểm nội thất, 10 điểm tour, geometry người 1,70 m, chín cầu thang, mô hình tượng, ghi tác giả, tablet/portrait, PNG, Console và asset HTTP.

Static geometry batch theo vật liệu, cây dùng InstancedMesh, tượng dùng LOD, shadow cache và giới hạn DPR/đèn. Mô hình chi tiết hơn làm draw calls cao hơn bản trước; kiểm tra hiện tại dưới budget 300 calls/frame được ghi, không cam kết FPS cho mọi GPU. Three.js chunk >500 KB không nén là cảnh báo build, không phải lỗi.

## Tài liệu và nguồn

[Hiệu chỉnh mới nhất](docs/revision-3.md) · [Phân tích ảnh](docs/reference-analysis.md) · [Giả định](docs/assumptions.md) · [Nguồn mô hình](public/models/CREDITS.md).

Kích thước, vị trí đài và đường sông/kênh vẫn là thiết kế ước định, chưa có bản vẽ khảo sát. Tượng dùng mẫu Đức Mẹ và Hài Nhi của SMK, không khẳng định là tượng tại Phương Lạc. Nhân vật Quaternius CC0 chỉ làm mốc tỷ lệ. Toàn bộ asset được lưu cục bộ, không gọi dịch vụ mô hình bên ngoài khi chạy.
