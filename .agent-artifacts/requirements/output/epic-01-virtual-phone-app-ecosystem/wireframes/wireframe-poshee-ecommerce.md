---
type: ASCII Wireframe
epic: "Epic 01: Virtual Phone Shell & MVP Parody App Suite (Release 1)"
status: draft
description: "Khung màn hình Shopoo cho US-005, chờ duyệt trước khi tạo HTML."
tags: [requirement, wireframe, poshee, ecommerce]
timestamp: "2026-10-15T21:43:45+07:00"
---

# Shopoo - Đặc tả khung màn hình

## 1. Người dùng, mục tiêu và nền tảng

- **Người dùng:** Người chơi trong vai người vợ điều tra.
- **Mục tiêu:** Đối chiếu đơn mua, người nhận, địa chỉ, kích cỡ, lịch sử tìm kiếm, trò chuyện và thông báo giao hàng.
- **Bối cảnh:** Kiểm tra dữ liệu câu chuyện đã có; không mua hàng hoặc sửa hồ sơ.
- **Nền tảng:** Điện thoại ảo trên web, màn hình dọc; máy tính hiển thị trong khung điện thoại dùng chung.
- **Trạng thái:** Bản nháp, chưa được duyệt. Chưa tạo HTML.
- **Yêu cầu:** [US-005](../us-005-poshee-e-commerce-app-module.md).

## 2. Danh sách màn hình và luồng

| Mã | Màn hình | Điểm vào | Điểm ra |
|---|---|---|---|
| P01 | Trang chủ | Biểu tượng Shopoo; thẻ Trang chủ | Tìm kiếm, trò chuyện, Thông báo, Tôi |
| P02 | Tôi | Thẻ Tôi | Lịch sử mua hàng; trò chuyện; thẻ chính |
| P03 | Lịch sử mua hàng | Xem lịch sử mua hàng | Chi tiết đơn; quay lại Tôi |
| P04 | Chi tiết đơn mua | Chạm đơn; thông báo có liên kết hợp lệ | Đóng về danh sách ban đầu |
| P05 | Lịch sử tìm kiếm | Chạm thanh tìm kiếm | Quay lại màn hình gọi |
| P06 | Hộp thư người bán | Biểu tượng trò chuyện | Hội thoại; quay lại màn hình gọi |
| P07 | Hội thoại người bán | Chạm cuộc trò chuyện | Quay lại hộp thư |
| P08 | Thông báo | Thẻ Thông báo | Lọc; xem đơn có liên kết; thẻ chính |

Thanh trạng thái, Dynamic Island, vùng an toàn, AssistiveTouch và thanh về màn hình chính do vỏ điện thoại cung cấp một lần. Các khung dưới đây chỉ thể hiện vùng ứng dụng, không tạo thêm vỏ máy. Nội dung trong ngoặc vuông là nhãn ngữ nghĩa hoặc dữ liệu do màn chơi cung cấp. Các giá trị cụ thể là ví dụ từ tài liệu nguồn, không phải dữ liệu dự phòng.

## 3. Bố cục từng màn hình

### P01 - Trang chủ

```text
+--------------------------------------------------+
| [Tìm kiếm sản phẩm] [Máy ảnh] [Giỏ] [Trò chuyện]   |
+--------------------------------------------------+
| [Quét mã] | ShopooPay | Điểm danh | Voucher        |
| [Thông tin dịch vụ theo dữ liệu được cung cấp]    |
+--------------------------------------------------+
| Thời trang | Mỹ phẩm | Công nghệ                  |
| Gia dụng   | Siêu Rẻ | Kho Mã                     |
+--------------------------------------------------+
| GIỜ VÀNG       | QUÀ BÍ MẬT     | ĐỒNG GIÁ        |
| [Mua ngay]     | [Xem ngay]     | [Mua ngay]      |
+-------------------------+------------------------+
| [Ảnh chiến dịch]        | [Ảnh sản phẩm]         |
| [Nội dung quảng bá]     | [Tên sản phẩm]         |
|                         | [Giá] [Ưu đãi]         |
|                         | [Đánh giá] [Đã bán]    |
+-------------------------+------------------------+
| Trang chủ          Thông báo            Tôi      |
+--------------------------------------------------+
```

- **Chính:** Thanh tìm kiếm mở P05; trò chuyện mở P06.
- **Phụ:** Dịch vụ nhanh, danh mục, quảng bá và lưới khám phá hai cột theo thiết kế gốc.
- **Thao tác:** Điều hướng điều tra hoạt động; giỏ hàng, máy ảnh, quét mã, voucher và nút mua chỉ hiển thị ở trạng thái vô hiệu hóa.
- **Dữ liệu:** Không tự điền số giỏ hàng, giá hoặc sản phẩm khi màn chơi không cung cấp.

### P02 - Tôi

```text
+--------------------------------------------------+
| [Ảnh đại diện] [Tên tài khoản]  [Cài đặt] [Giỏ]   |
| [Hạng thành viên]                  [Trò chuyện]  |
| [Đang theo dõi] [Người theo dõi]                  |
| ShopooVIP: [Thông tin tiết kiệm được cung cấp]    |
+--------------------------------------------------+
| Đơn mua                  Xem lịch sử mua hàng >   |
| Chờ xác nhận | Chờ lấy | Chờ giao | Đánh giá       |
| Đơn Nạp điện thoại & Thẻ cào | Đơn Giao Hỏa Tốc   |
+--------------------------------------------------+
| Trang Chính Sale | ShopooVIP | Mã Hoàn Xu          |
| Kho Voucher                                      |
+--------------------------------------------------+
| Tiện ích của tôi                                 |
| Ví ShopooPay [Số dư] | Shopoo Xu | Kho Voucher    |
| Tiện ích khác                                    |
| Shop của tôi | Khách hàng thân thiết              |
+--------------------------------------------------+
| Trang chủ          Thông báo            Tôi      |
+--------------------------------------------------+
```

- **Chính:** Xem lịch sử mua hàng mở P03.
- **Phụ:** Thông tin tài khoản và tiện ích chỉ đọc; không có mục cho vay.
- **Thao tác:** Trò chuyện mở P06. Cài đặt, tiện ích thương mại và bốn trạng thái quy trình là phần hiển thị vô hiệu hóa trong phạm vi này; không tạo đơn có trạng thái chưa được cấp dữ liệu.

### P03 - Lịch sử mua hàng

```text
+--------------------------------------------------+
| [Quay lại]               Lịch sử mua hàng        |
| [Tất cả]           [Đang giao]       [Đã giao]    |
+--------------------------------------------------+
| [Mã đơn] [Ngày đặt] [Trạng thái]                  |
| [Ảnh] [Tên sản phẩm]                             |
|       Phân loại hàng: [Kích cỡ / Màu]             |
|       [Số lượng nếu có] [Giá]                    |
| Giao đến: [Địa chỉ được cung cấp]                 |
| Thành tiền: [Tổng tiền]                          |
+--------------------------------------------------+
| [Các đơn khác theo dữ liệu màn chơi]             |
+--------------------------------------------------+
```

- **Chính:** Chạm đơn mở P04, kể cả đơn bình thường hoặc quà cho người thân.
- **Lọc:** Tất cả gồm cả đơn đã hủy; Đang giao = `in_transit`; Đã giao = `completed`; `cancelled` hiển thị “Đã hủy”.
- **Điều hướng:** Quay lại P02; đóng chi tiết khôi phục bộ lọc và vị trí cuộn.

### P04 - Ngăn chi tiết đơn mua

```text
+--------------------------------------------------+
| [Tay nắm ngăn]                    [Đóng]         |
| Chi tiết đơn mua                                 |
| [Trạng thái] [Mã đơn] [Ngày đặt]                  |
+--------------------------------------------------+
| Thông tin vận chuyển                             |
| [Đơn vị vận chuyển] [Mã vận đơn]                  |
| Người nhận: [Tên theo hồ sơ màn chơi]             |
| Điện thoại: [Số đã che]                           |
| Địa chỉ: [Địa chỉ đầy đủ, xuống dòng]             |
+--------------------------------------------------+
| [Ảnh] [Tên sản phẩm]                             |
| Phân loại hàng: [Size S / Màu Đỏ Rượu]            |
| [Số lượng nếu có] [Giá từng mặt hàng]             |
| [Các mặt hàng khác nếu có]                       |
+--------------------------------------------------+
| Thành tiền: [Tổng tiền]                          |
| Thanh toán: [Phương thức được cung cấp]           |
+--------------------------------------------------+
```

- **Chính:** Đọc toàn bộ địa chỉ, người nhận, kích cỡ và nội dung hóa đơn; ngăn cuộn khi dài.
- **Bằng chứng:** Giữ 380 ms trên nội dung câu chuyện để mở lớp kiểm tra dùng chung. Không có nút thêm sổ tay trên hóa đơn.
- **Dữ liệu thiếu:** Dùng `—` cho chi tiết chưa được cung cấp; không mặc định số lượng bằng một hoặc suy ra đơn vị vận chuyển từ mã vận đơn.
- **Thoát:** Đóng, chạm nền ngoài hoặc kéo xuống theo hành vi ngăn dùng chung; cuộn nội dung không vô tình đóng ngăn.

### P05 - Lịch sử tìm kiếm

```text
+--------------------------------------------------+
| [Quay lại] [Tìm kiếm sản phẩm - chỉ đọc]          |
+--------------------------------------------------+
| Lịch sử tìm kiếm gần đây       [Xóa lịch sử]      |
| [nội y quyến rũ] [váy body tôn dáng]             |
| [quà sinh nhật bạn gái mới quen]                 |
| [Các từ khóa khác do màn chơi cung cấp]          |
+--------------------------------------------------+
| Tìm kiếm phổ biến                                |
| [Nội dung gợi ý nếu được cung cấp]               |
+--------------------------------------------------+
```

- **Chính:** Đọc từ khóa đã lưu; giữ từ khóa thuộc dữ liệu câu chuyện 380 ms để kiểm tra.
- **Phụ:** Gợi ý phổ biến được tách khỏi lịch sử của nhân vật; không suy diễn đó là hành vi mua hàng.
- **Thao tác:** Xóa lịch sử bị vô hiệu hóa; không nhập/tìm kiếm trực tuyến. Thanh tìm kiếm và nút quay lại không phải mục tiêu bằng chứng.

### P06 - Hộp thư người bán

```text
+--------------------------------------------------+
| [Quay lại]                   Trò chuyện          |
| [Tất cả]                    [Đang hoạt động]     |
+--------------------------------------------------+
| [Ảnh shop] [Tên shop]                  [Ngày]    |
|            [Nội dung xem trước]        [Chưa đọc]|
| [Ảnh shop] [Tên shop] [Yêu thích]       [Ngày]    |
|            [Nội dung xem trước]                  |
+--------------------------------------------------+
```

- **Chính:** Chạm bất kỳ hội thoại nào mở P07.
- **Lọc:** Tất cả hiển thị toàn bộ hội thoại. Đang hoạt động chỉ dùng được khi dữ liệu cung cấp trạng thái; nếu thiếu thì vô hiệu hóa.
- **Bằng chứng:** Nội dung xem trước thuộc câu chuyện có thể được kiểm tra; tên tiêu đề, bộ lọc và thao tác đầu trang không được bọc lớp bằng chứng.

### P07 - Hội thoại người bán

```text
+--------------------------------------------------+
| [Quay lại] [Ảnh shop] [Tên shop] [Cửa hàng] [Khác]|
| [Trạng thái hoạt động nếu được cung cấp]         |
+--------------------------------------------------+
| LƯU Ý: Chỉ mua bán trên Shopoo để bảo vệ quyền lợi|
+--------------------------------------------------+
| Bạn đang hỏi về quy cách sản phẩm                |
| [Ảnh] [Tên sản phẩm] [Phân loại được chọn]        |
| [Giá] [Giảm giá] [Đã bán]                        |
| [Giỏ]                         [Mua với voucher]  |
+--------------------------------------------------+
|                     [Ngày hội thoại]            |
| Shop: [Tin nhắn / Trả lời tự động nếu có]        |
|                  [Tin nhắn của khách] [Giờ]     |
|                  Tin nhắn chưa đọc              |
| Shop: [Phản hồi được cung cấp] [Giờ]             |
+--------------------------------------------------+
| [Hỏi tình trạng còn hàng] [Tư vấn chọn size]      |
| [Đính kèm] [Sản phẩm] [Soạn tin - chỉ đọc] [Mặt cười]|
+--------------------------------------------------+
```

- **Chính:** Đọc nội dung hội thoại, yêu cầu đóng gói và thông tin sản phẩm nếu có.
- **Bằng chứng:** Giữ nội dung tin nhắn và thông tin sản phẩm thuộc câu chuyện 380 ms để kiểm tra; không áp dụng cho tiêu đề shop, cảnh báo an toàn hoặc thanh nhập.
- **Thao tác:** Mua, giỏ, cửa hàng, tùy chọn, gợi ý, đính kèm và soạn tin bị vô hiệu hóa; không mở thêm luồng thương mại.
- **Dữ liệu thiếu:** Không có thẻ sản phẩm thì bỏ thẻ; không tự tạo giá, sản phẩm, trạng thái trực tuyến hoặc tin trả lời.

### P08 - Thông báo

```text
+--------------------------------------------------+
| Thông báo                          [Giỏ] [Trò chuyện]|
+--------------------------------------------------+
| Cập nhật Người bán [Số được cung cấp] >           |
| Cập nhật đơn hàng [Số được cung cấp] >            |
+--------------------------------------------------+
| [Trạng thái vận chuyển] [Thời gian]               |
| [Mã đơn / mã vận đơn nếu có]                      |
| [Nội dung giao hàng đầy đủ]                       |
+--------------------------------------------------+
| Cập nhật mới nhất                 [Đọc tất cả]   |
| [Thông báo nổi bật] [Khuyến mãi]                  |
| [Đơn hàng] [Cập nhật Shopoo]                      |
| [Tiêu đề] [Thời gian]                            |
| [Nội dung thông báo được cung cấp]               |
+--------------------------------------------------+
| Trang chủ          Thông báo            Tôi      |
+--------------------------------------------------+
```

- **Chính:** Đọc cập nhật và lọc loại; giữ nội dung giao hàng thuộc câu chuyện 380 ms để kiểm tra.
- **Lọc:** Nổi bật = toàn bộ tập thông báo; Khuyến mãi = `promo`; Đơn hàng = `order`; Cập nhật Shopoo = `security`; hàng Cập nhật Người bán = `seller`.
- **Điều hướng:** Chỉ mở P04 khi bản ghi cung cấp liên kết đơn hợp lệ. Không có liên kết thì tiếp tục đọc tại đây; không tạo trang theo dõi giả.
- **Thao tác:** Đọc tất cả bị vô hiệu hóa; trò chuyện mở P06.

## 4. Thành phần và ràng buộc thiết kế

| Thành phần | Quy tắc |
|---|---|
| Vỏ điện thoại | Dùng chung thanh trạng thái, Dynamic Island, vùng an toàn, AssistiveTouch và thanh về trang chính |
| Nhãn hiệu | Giữ màu Shopoo: chính `#EE4D2D`; chuyển sắc `#FF5722` đến `#EE4D2D`; nền `#F5F5F5`; thẻ `#FFFFFF`; chữ chính `#212121` |
| Hội thoại | Bong bóng khách `#E0F7FA`; người bán `#FFFFFF`; cảnh báo `#FFF8E1`, viền `#FFE082` |
| Biểu tượng | Ionicons từ `react-icons/io5` hoặc SVG đáp ứng; không dùng emoji |
| Vùng chạm | Nút tối thiểu 44 × 44 px; thẻ điều hướng 48 × 44 px; thanh tìm kiếm có vùng chạm cao tối thiểu 48 px |
| Kiểu chữ | Tuân thủ cỡ chữ tối thiểu và phóng to theo chuẩn dùng chung; không sao chép nhãn quá nhỏ trong bản mẫu Shopoo |
| Dữ liệu dài | Địa chỉ, biến thể, tin nhắn và thông báo xuống dòng; nội dung bằng chứng đọc được đầy đủ |
| Kiểm tra bằng chứng | Tái sử dụng `StoryEvidenceTarget` và `UniversalEvidenceModal`; không tạo bản sao thành phần |

Các ràng buộc trên kế thừa thiết kế chuẩn; khung ký tự chỉ biểu diễn thứ tự và phân cấp nội dung.

## 5. Tương tác và trạng thái

| Tình huống | Kết quả |
|---|---|
| Không có dữ liệu Shopoo | “Chưa có dữ liệu Shopoo cho màn này.”; vẫn dùng được điều hướng vỏ máy |
| Không có đơn | “Chưa có đơn mua.” |
| Bộ lọc đơn rỗng | “Không có đơn phù hợp.” |
| Không có từ khóa | “Chưa có lịch sử tìm kiếm.” |
| Không có hội thoại / tin nhắn | “Chưa có cuộc trò chuyện.” / “Chưa có tin nhắn.” |
| Không có thông báo / kết quả lọc | “Chưa có thông báo.” / “Không có thông báo phù hợp.” |
| Thiếu ảnh | Khung ảnh trung tính; giữ phần chữ, không tải ảnh ngoài |
| Thiếu trường tùy chọn | `—` hoặc bỏ phần tùy chọn; không suy ra dữ liệu câu chuyện |
| Chạm ngắn | Mở màn hình đã mô tả; không tự thu thập bằng chứng |
| Giữ 380 ms trên dữ liệu câu chuyện | Mở ảnh chụp làm mờ trong lớp kiểm tra dùng chung; thu thập qua luồng sổ tay dùng chung |
| Cuộn / hủy giữ | Không thu thập; giữ thành công không đồng thời kích hoạt chạm ngắn |
| Giữ tiêu đề, tab, tìm kiếm, bộ lọc, cài đặt | Không mở lớp bằng chứng |
| Điều khiển thương mại vô hiệu hóa | Có trạng thái vô hiệu hóa cho trợ năng; không tạo dữ liệu, gọi mạng hoặc xin quyền thiết bị |

Đơn bình thường, quà cho người thân và nội dung đáng ngờ dùng cùng thao tác kiểm tra. Không có dấu báo manh mối, mã manh mối hoặc kết luận đúng/sai trên giao diện mặc định. Chỉ hiển thị nội dung của màn chơi hiện tại.

## 6. Phạm vi manh mối và điểm kiểm tra

| Mã tham chiếu | Dữ liệu cần đọc | Vị trí |
|---|---|---|
| `CLUE-POSH-01` | Địa chỉ giao khác thường và người nhận | P04 |
| `CLUE-POSH-02` | Kích cỡ sản phẩm để đối chiếu hồ sơ người vợ | P04 |
| `CLUE-POSH-03` | Quà cho chị ruột; giữ ngữ cảnh người nhận | P04 |
| `CLUE-POSH-04` | Từ khóa tìm kiếm đã lưu | P05 |
| `CLUE-POSH-05` | Yêu cầu đóng gói kín hoặc tư vấn kích cỡ | P07 |
| `CLUE-POSH-06` | Thời điểm giao và nơi nhận khác thường | P08 |

Đây là bảng truy vết tài liệu, không phải nhãn hiển thị cho người chơi. Không bắt buộc mọi màn chơi có đủ sáu loại. Không suy đoán liên kết bằng chứng khi dữ liệu chưa cung cấp định danh.

## 7. Giới hạn và duyệt

- Không có mua hàng, gửi tin nhắn, xóa lịch sử, sửa hồ sơ, cho vay hoặc theo dõi vận chuyển trực tiếp.
- Không bổ sung câu chuyện, dữ liệu dự phòng hay ước lượng thời gian triển khai.
- Lược đồ nguồn chưa có đủ trường cho mọi chi tiết minh họa; chỉ hiển thị giá trị được cung cấp và vô hiệu hóa thao tác thiếu dữ liệu.
- Quy tắc 380 ms, không có nút thu thập thường trực và không có emoji thay thế ví dụ cũ trong thiết kế nguồn.
- Chờ người dùng duyệt bản ASCII này trước khi tạo HTML.

## 8. Nguồn tham chiếu

- [Thiết kế Shopoo](../../../../project-knowledge-base/solution-context/apps/ecommerce/app-design.md)
- [Tính năng Shopoo](../../../../project-knowledge-base/solution-context/apps/ecommerce/features.md)
- [Khung màn hình nguồn](../../../../project-knowledge-base/solution-context/apps/ecommerce/wireframe.md)
- [Thiết kế dùng chung](../../../../project-knowledge-base/solution-context/design-system/design.md)
- [Phiên làm rõ đã xác nhận](../../elicitation/2026-10-15-us-005-poshee.md)
