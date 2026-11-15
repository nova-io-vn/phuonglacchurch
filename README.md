# Nhà thờ Giáo xứ Phương Lạc — Tham quan 3D

Vite + TypeScript + Three.js, vanilla HTML/CSS, không React, backend, API key hoặc model trả phí. Toàn bộ kiến trúc, vật liệu và cảnh quan sinh tại máy. Cảnh vẫn chạy khi không có mạng sau khi tải ứng dụng.

## Chạy dự án

Node.js 22.12+.

```sh
npm install
npm run dev
npm run build
npm run preview
```

Dev mặc định http://localhost:5173; preview mặc định http://localhost:4173. `dist/` dùng trên static hosting. Bundle Three.js có cảnh báo >500 KB trước gzip; build vẫn thành công.

## Bản hiệu chỉnh Phương Lạc

- Đúng tên Nhà thờ Giáo xứ Phương Lạc trong tiêu đề, thương hiệu và ảnh xuất.
- Kiến trúc theo các phối cảnh vàng trong hội thoại: ba tháp mái vòm, thân basilica cao/thấp, cửa tầng trên, phào/lan can và hai cánh ngang thông với gian chính. Ảnh đêm tháp nhọn chỉ tham khảo ánh sáng.
- Bốn dãy ghế dọc × 10 băng. Ca đoàn ở cánh trái (-X khi nhìn từ cửa về cung thánh), có ghế, organ và giá nhạc; cánh phải là không gian cầu nguyện.
- Nút Buổi sáng / Buổi tối; nắng ấm, bóng đổ, bầu trời/mây chuyển động, đèn kiến trúc, glow và bloom nhẹ buổi tối.
- Bối cảnh theo ghim Maps: đường Phương Lạc, trường đối diện, nhà phụ/nhà dân, ao nước và ruộng. Không nhúng ảnh vệ tinh trong 3D, không gọi Maps API khi chạy.
- Đi bộ, va chạm, cửa tương tác, bản đồ bốn dãy ghế và hai cánh, tour 10 điểm có ca đoàn, chụp PNG, hỗ trợ cảm ứng.

## Điều khiển

Toàn cảnh: kéo xoay, cuộn zoom, chuột phải pan; chọn Mặt tiền / Mặt trái / Mặt phải / Trên cao / Khu vực. Nút Ca đoàn dẫn camera theo lộ trình tour vào cánh trái.

Đi dạo: nhấp vào không gian để khóa chuột; WASD/phím mũi tên, Shift đi nhanh, E mở cửa gần, ESC thả chuột, M bản đồ, F toàn màn hình. Cửa chính dẫn thật vào cùng scene, không chuyển cảnh giả. Trên tablet: cần trái di chuyển, kéo viewer nhìn quanh, nút Mở cửa tương tác.

## Module chính

- `architecture/BasilicaExterior.ts`, `TranseptBuilder.ts`, `RoofBuilder.ts`: tường có lỗ thật, hai cánh và mái giao nhau có đường thung.
- `architecture/MainTower.ts`: tầng tháp, hốc/lam gió, vòm Lathe, gân, thánh giá.
- `architecture/PewBuilder.ts`, `ChoirBuilder.ts`, `InteriorBuilder.ts`: bốn dãy ghế, ca đoàn và cung thánh.
- `environment/ParishSite.ts`: tọa độ nguồn Maps, đường, trường, nhà dân, ao, ruộng; `Life.ts`: mặt nước/chim động.
- `environment/Lighting.ts`, `Sky.ts`: hai thời điểm, ánh sáng, mây/trăng/sao; `materials/palette.ts`: base color/normal/AO procedural.
- `controls/`: Orbit, PointerLock/touch, collision capsule XZ + cao độ, GuidedTour.
- Geometry tĩnh batch theo vật liệu; cây dùng InstancedMesh, bóng tĩnh được cache; Bloom chạy khi buổi tối. Camera và collider có tính tới cánh ngang.

## Kiểm tra

Cần Chrome và dev server đang chạy:

```sh
npm test
```

Kết quả trong `docs/verification.json`, ảnh trong `docs/screenshots/`. Kiểm tra gồm: đúng tên/toạ độ ghim, 40 băng trong bốn dãy, hai nút thời điểm, WASD/khóa chuột/E, lối đi/collision, lối vào ca đoàn và cao độ sàn, 10 điểm tour, PNG, tablet/portrait, Console và HTTP. `node tests/production.mjs` kiểm tra bản preview ở cổng 4173.

## Nguồn và độ chính xác

[Phân tích phối cảnh](docs/reference-analysis.md) · [Bối cảnh Maps](docs/site-context.md) · [Giả định](docs/assumptions.md) · [Tiến độ](docs/progress.md).

Đã có ảnh trong hội thoại; tệp ảnh gốc chưa nằm trên đĩa. Kích thước là ước lượng. Hình học nhà thờ bám các phối cảnh vàng, không phải mô hình khảo sát. Nội thất theo chỉ dẫn, chi tiết nhà lân cận/cảnh quan là tái dựng từ quan hệ vị trí trên vệ tinh. Hốc tượng chưa có asset hợp pháp nên để trống. Không có GI bake, ray tracing hay khúc xạ kính thực; dùng ánh sáng cục bộ, environment và emissive.
