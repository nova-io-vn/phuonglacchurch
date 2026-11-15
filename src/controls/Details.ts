import {Vector3} from 'three';
const v=(x:number,y:number,z:number)=>new Vector3(x,y,z);
/** Close views use the same continuous scene, with individual photographic framing. */
export const DETAILS=[
 {title:'Cổng trụ & cầu đá',note:'Hai cánh đồng chạm cuốn lá, huy hiệu IHS và tia mặt trời. Cầu có lan can đá đục lỗ. Bấm nút bên dưới để mở hoặc đóng cổng.',p:v(-53,5.2,39),t:v(-34,3,38),fov:48,gate:0},
 {title:'Cổng vòm thứ hai',note:'Cổng đá có trán mái nhiều lớp, thánh giá, bảng tên và hai cánh đồng. Hình thức dựng theo ảnh Street View bạn cung cấp.',p:v(-53,5.4,-44),t:v(-34,4,-43),fov:48,gate:1},
 {title:'Bia tên giáo xứ',note:'Bia đá hình tự nhiên và chữ nổi “GIÁO XỨ PHƯƠNG LẠC”. Bia đặt bên lối vào, cạnh mặt nước và lan can đá.',p:v(-39,3.6,27),t:v(-28,1.6,29),fov:43,gate:-1},
 {title:'Đài Đức Mẹ · sân trước',note:'Đài đặt trên sân lát đá tại vị trí hồ cũ phía trước. Ba cột chính và hai tượng bên được giữ nguyên; hai trụ tượng cao bổ sung đứng hai bên sân.',p:v(18,9,71),t:v(18,5.4,47),fov:54,gate:-1},
 {title:'Tháp nhọn phía cuối',note:'Tháp nhọn đặt trên đỉnh khối giữa phía cuối như vị trí bạn xác nhận. Có tầng chuông rỗng, gờ đứng, chóp tám cạnh, chi tiết trang trí và thánh giá.',p:v(22,31,-63),t:v(0,28,-35.15),fov:47,gate:-1},
 {title:'Cửa & bậc đá',note:'Đại bậc tám cấp nối sân với nền nhà cao 1,35 m. Cửa vòm có nhiều lớp khung nổi, cánh gỗ và phụ kiện kim loại. Nhấp cánh cửa để tương tác.',p:v(9,5,34),t:v(0,5,19),fov:53,gate:-1},
 {title:'Kính màu & hệ cột',note:'Kính màu có thanh chia hình học và lớp khung sâu. Các nhịp cột, cửa sổ và gân vòm cùng một hệ trục. Nội thất là thiết kế tái dựng giả định.',p:v(3.4,4.3,-7),t:v(10.5,7,-8),fov:55,gate:-1},
 {title:'Cung thánh & hậu tòa',note:'Đá sáng, hoa văn sàn, gờ mạ vàng và hậu tòa Gothic. Bốn dãy ghế hướng về bàn thờ; ca đoàn nằm ở cánh trái.',p:v(0,3.65,-26),t:v(0,6,-35),fov:50,gate:-1},
];
