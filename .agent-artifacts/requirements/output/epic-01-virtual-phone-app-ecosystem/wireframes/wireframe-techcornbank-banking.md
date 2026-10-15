---
type: ASCII Wireframe
status: draft
description: "Đặc tả màn hình techcornbank cho US-004, chờ duyệt trước khi tạo HTML."
tags: [requirement, wireframe, banking, techcornbank]
timestamp: "2026-10-15T21:20:19+07:00"
---

# techcornbank - Đặc tả khung màn hình

**Trạng thái:** Bản nháp, chưa được duyệt. Chỉ tạo HTML sau khi người dùng duyệt bản này.

## 1. Người dùng, mục tiêu và bối cảnh

- **Người dùng:** Người chơi đang kiểm tra điện thoại của chồng.
- **Mục tiêu:** Đọc lịch sử giao dịch, lời nhắn chuyển khoản và các hũ tiết kiệm; đối chiếu bằng chứng trong vụ việc.
- **Bối cảnh:** Ứng dụng ngân hàng giả lập trong màn chơi hiện tại; không phát sinh giao dịch thật.
- **Nền tảng:** Khung điện thoại web hiện có, ưu tiên màn hình dọc; hỗ trợ thao tác chuột trên máy tính.
- **Tên hiển thị:** `techcornbank`. Các tên techcornbank trong tài liệu nguồn chỉ là tên tham chiếu cũ.
- **Phạm vi:** Không có màn hình đổi hạng hội viên, hình nền, màu phong thủy hoặc cung hoàng đạo.

## 2. Danh sách màn hình

| Mã | Màn hình | Điểm vào | Điểm ra |
|---|---|---|---|
| S01 | Trang chủ | Biểu tượng ứng dụng; mở khóa thành công | Lịch sử; hũ quỹ; tôi; màn hình chính của điện thoại |
| S02 | Lịch sử giao dịch | Thẻ Lịch sử | Biên lai; các thẻ điều hướng |
| S03 | Ngăn biên lai | Chạm giao dịch từ S01 hoặc S02 | Đóng để trở lại đúng danh sách đã mở |
| S04 | Danh sách và chi tiết hũ quỹ | Thẻ Hũ quỹ; lối tắt Hũ quỹ đen | Chọn hũ; quay lại danh sách; các thẻ điều hướng |
| S05 | Tôi | Thẻ Tôi | Các thẻ điều hướng |
| S06 | Mã PIN dùng chung | Điểm truy cập bị khóa theo cấu hình màn chơi | Mở nội dung được bảo vệ; thoát về màn hình trước |

## 3. Khung dùng chung

Khung máy, vùng trạng thái, vùng khuyết và nút hỗ trợ nổi dùng lại thành phần hệ thống. Giá trị giờ và pin theo trạng thái điện thoại, không cố định theo dữ liệu ví dụ.

```text
+---------------------------------------------------------+
| [Giờ]           [Vùng khuyết]       [Sóng] [5G] [Pin]     |
+---------------------------------------------------------+
|                  Nội dung techcornbank                   |
|                                                         |
|                                           [Nút hỗ trợ]  |
+---------------------------------------------------------+
|                  [Thanh điều hướng máy]                  |
+---------------------------------------------------------+
```

## 4. Bố cục từng màn hình

### S01 - Trang chủ

```text
+---------------------------------------------------------+
| [Ảnh đại diện]       techcornbank        [Thông báo]      |
+---------------------------------------------------------+
| THẺ CHÍNH                         [Hạng theo vụ việc]    |
| Số dư khả dụng                                          |
| ******** đ                              [Hiện số dư]    |
| Số TK: 1903 8888 6688                        [Sao chép]  |
+---------------------------------------------------------+
| [Chuyển tiền] [Quét QR] [Hũ quỹ đen] [Hóa đơn]           |
+---------------------------------------------------------+
| BIẾN ĐỘNG GẦN ĐÂY                          [Bộ lọc]     |
| [Tất cả]         [Tiền vào (+)]         [Tiền ra (-)]    |
+---------------------------------------------------------+
| NGUYEN THI BE MEO               - 1.000 đ       23:46    |
| Em gian anh a sao khong nghe may                        |
+---------------------------------------------------------+
| NGUYEN THI BE MEO               - 1.000 đ       23:45    |
| Anh xin loi ma be tha loi anh di                        |
+---------------------------------------------------------+
| TRAN THI KIM CUONG             + 20.000.000 đ   10:15    |
| Thuong cho chuot con ngoan ngoan                        |
+---------------------------------------------------------+
| NHA HANG SEN TAY HO            - 1.500.000 đ   Hôm qua  |
| Thanh toan hoa don an toi VIP - Ban 04                  |
+---------------------------------------------------------+
| [Trang chủ]       [Lịch sử]       [Hũ quỹ]       [Tôi]   |
+---------------------------------------------------------+
```

- Số dư khởi đầu được che bằng chuỗi `maskedBalance`; dấu `*` trong sơ đồ chỉ biểu diễn vùng bị che. Nút Hiện số dư đổi thành Ẩn số dư sau khi mở.
- Bốn ô lối tắt lấy thứ tự từ cấu hình vụ việc. Sơ đồ dùng bốn mục không liên quan đến đổi giao diện; không có mục Tùy biến.
- Hũ quỹ đen mở S04. Chuyển tiền, Quét QR và Hóa đơn ở trạng thái không khả dụng trong phạm vi chỉ đọc này; không mở biểu mẫu thanh toán.
- Hạng hội viên và nền thẻ do vụ việc cung cấp, chỉ để xem. Không có thao tác sửa.
- Chạm một giao dịch mở S03. Không có nhãn bằng chứng, kết luận nghi phạm hoặc nút ghim trong danh sách.
- Thông báo không tạo số lượng hoặc nội dung khi vụ việc không cung cấp dữ liệu.

### S02 - Lịch sử giao dịch

```text
+---------------------------------------------------------+
| [Quay lại]          LỊCH SỬ GIAO DỊCH                   |
+---------------------------------------------------------+
| [Tất cả]         [Tiền vào (+)]         [Tiền ra (-)]    |
+---------------------------------------------------------+
| [Ngày giao dịch]                                        |
| [Tên đối tác]                       [Dấu và số tiền]    |
| [Giờ giao dịch]                                         |
| [Trích lời nhắn]                                        |
+---------------------------------------------------------+
| [Các giao dịch tiếp theo; cuộn trong danh sách]          |
+---------------------------------------------------------+
| [Trang chủ]       [Lịch sử]       [Hũ quỹ]       [Tôi]   |
+---------------------------------------------------------+
```

- Hiển thị toàn bộ giao dịch của vụ việc theo thời gian, mới nhất trước; giữ riêng từng giao dịch nhỏ liên tiếp.
- Tiền vào chỉ hiển thị `inflow`; Tiền ra chỉ hiển thị `outflow`; Tất cả bỏ điều kiện lọc.
- Không sửa lời nhắn, đổi tên đối tác hoặc gộp các giao dịch cùng số tiền.

### S03 - Ngăn biên lai

```text
+---------------------------------------------------------+
| [Tay nắm ngăn]                                  [Đóng] |
|                  BIÊN LAI GIAO DỊCH                     |
+---------------------------------------------------------+
|                         - 1.000 đ                       |
|                   GIAO DỊCH THÀNH CÔNG                  |
+---------------------------------------------------------+
| Ngân hàng đối tác:       DongViet Bank                  |
| Tên đối tác:             NGUYEN THI BE MEO              |
| Số tài khoản đối tác:    1029 **** 889                   |
| Thời gian:               13/10/2026 23:46:12             |
| Mã giao dịch:            FT262879912048                 |
| Loại giao dịch:          [Loại theo dữ liệu vụ việc]     |
+---------------------------------------------------------+
| Lời nhắn                                               |
| Em gian anh a sao khong nghe may goi mai khong duoc      |
+---------------------------------------------------------+
```

- Ngăn đọc cả giao dịch tiền vào và tiền ra; nhãn người gửi/người nhận theo chiều giao dịch. Sơ đồ minh họa tiền ra.
- Toàn bộ lời nhắn tự xuống dòng và cuộn được; không cắt nội dung ở biên lai.
- Chỉ hiển thị thông tin vụ việc thực sự cung cấp. Ô dữ liệu thiếu dùng dấu `—`; không tự tạo ngân hàng, tài khoản hoặc mã tham chiếu.
- Đóng, chạm nền phủ hoặc kéo ngăn xuống theo quy tắc dùng chung để quay lại đúng danh sách và bộ lọc trước đó.
- Không có nút Thêm vào Sổ Tay Bắt Ghen. Nhấn giữ nội dung biên lai hoặc lời nhắn đủ 380 ms để mở lớp xem bằng chứng dùng chung.

### S04 - Hũ quỹ và lịch sử nộp tiền

```text
+---------------------------------------------------------+
| [Quay lại]                  HŨ QUỸ                      |
+---------------------------------------------------------+
| Tiet Kiem Mua Nhan Kim Cuong Cho Vo                     |
| Đã tích lũy: [Số tiền hiện tại]                         |
| Mục tiêu:    [Số tiền mục tiêu]                         |
+---------------------------------------------------------+
| [Các hũ khác theo dữ liệu vụ việc]                      |
+---------------------------------------------------------+
| [Trang chủ]       [Lịch sử]       [Hũ quỹ]       [Tôi]   |
+---------------------------------------------------------+
```

Chạm hũ mở chi tiết trong cùng nhánh điều hướng:

```text
+---------------------------------------------------------+
| [Quay lại]              CHI TIẾT HŨ QUỸ                 |
+---------------------------------------------------------+
| [Tên hũ theo vụ việc]                                   |
| Đã tích lũy: [Số tiền hiện tại]                         |
| Mục tiêu:    [Số tiền mục tiêu]                         |
+---------------------------------------------------------+
| LỊCH SỬ NỘP TIỀN                                       |
| [Ngày]           [Số tiền]                              |
| [Nội dung nộp tiền đầy đủ]                              |
+---------------------------------------------------------+
| [Các lần nộp tiếp theo]                                 |
+---------------------------------------------------------+
```

- Không có thao tác tạo hũ, sửa tên, nộp tiền hoặc rút tiền.
- Hồ sơ hũ và từng lần nộp là dữ liệu câu chuyện có thể nhấn giữ; tiêu đề cố định và nút điều hướng không phải bằng chứng.
- Không gắn nhãn “vô tội” lên hũ mua nhẫn; người chơi tự đối chiếu nội dung.
- Nếu nhánh này có khóa theo cấu hình, mở S06 trước khi lộ nội dung được bảo vệ.

### S05 - Tôi

```text
+---------------------------------------------------------+
|                          TÔI                            |
+---------------------------------------------------------+
| techcornbank                                           |
| Số tài khoản: [Số tài khoản theo vụ việc]                |
| Hạng hội viên: [Hạng theo vụ việc, nếu có]               |
+---------------------------------------------------------+
| [Trang chủ]       [Lịch sử]       [Hũ quỹ]       [Tôi]   |
+---------------------------------------------------------+
```

Chỉ dùng lại thông tin tài khoản đã có; không có cài đặt đổi giao diện hoặc hồ sơ mới ngoài dữ liệu vụ việc.

### S06 - Mã PIN dùng chung

```text
+---------------------------------------------------------+
| [Quay lại]               techcornbank                   |
+---------------------------------------------------------+
|                    [Biểu tượng khóa]                    |
|                     NHẬP MÃ PIN                        |
|                       o o o o                          |
|                                                         |
|                   [1]   [2]   [3]                       |
|                   [4]   [5]   [6]                       |
|                   [7]   [8]   [9]                       |
|                         [0]   [Xóa]                     |
|                                                         |
| [Thông báo lỗi của bộ khóa dùng chung, nếu có]           |
| Lượt thử còn lại: [Theo trạng thái màn chơi]             |
+---------------------------------------------------------+
```

- Dùng bàn phím PIN bốn chữ số hiện có. Không tạo bộ khóa riêng hoặc hiển thị đáp án trong ứng dụng ngân hàng.
- Màn 1 không có khóa. Màn 2/3 áp dụng đúng điểm khóa và thử thách cấu hình; PIN được tìm qua Ghi chú hoặc SMS.
- Nhập sai dùng trạng thái lỗi, rung và bộ đếm nghi ngờ của hệ thống. Không tự quy định thêm số lượt hoặc thời gian khóa.
- Không lộ giao dịch hoặc hũ bị khóa phía sau lớp PIN. Quay lại không tiêu thụ lượt thử.

## 5. Danh mục thành phần và điều hướng

| Thành phần | Vai trò | Ràng buộc |
|---|---|---|
| Khung máy và thanh trạng thái | Vùng hiển thị hệ thống | Dùng lại; không tạo bản sao trong ứng dụng |
| Thẻ tài khoản | Số dư, số tài khoản, hạng có sẵn | Không chỉnh sửa hình nền hoặc hạng |
| Nút hiện/ẩn số dư, quay lại, đóng, thẻ điều hướng | Điều khiển ứng dụng | Vùng chạm tối thiểu 44 × 44 px |
| Ma trận lối tắt | Bốn vị trí dưới thẻ tài khoản | Vùng chạm tối thiểu 48 × 48 px; cấu hình dữ liệu, không có trình sửa giao diện |
| Bộ lọc | Tất cả / Tiền vào / Tiền ra | Chỉ lọc danh sách; không mở bằng chứng |
| Hàng giao dịch | Đối tác, thời gian, số tiền, lời nhắn | Chiều cao tối thiểu 64 px; chạm mở biên lai |
| Ngăn biên lai | Chi tiết đầy đủ của giao dịch | Dùng mẫu ngăn và vùng cuộn hiện có |
| `StoryEvidenceTarget` / `UniversalEvidenceModal` | Kiểm tra nội dung câu chuyện và ghim | 380 ms; không gắn vào cấu trúc tĩnh |
| Bộ khóa PIN | Bảo vệ điểm truy cập có cấu hình | Dùng chung bộ kiểm tra PIN, nghi ngờ và khóa lượt |

## 6. Tương tác và trạng thái

| Tình huống | Kết quả hiển thị hoặc thao tác |
|---|---|
| Chưa có giao dịch | “Chưa có giao dịch.”; giữ bộ lọc và điều hướng |
| Không có giao dịch theo bộ lọc | “Không có giao dịch phù hợp.” |
| Chưa có hũ | “Chưa có hũ tiết kiệm.” |
| Hũ chưa có lần nộp | “Chưa có lịch sử nộp tiền.” |
| Không có dữ liệu ngân hàng của vụ việc | “Chưa có dữ liệu ngân hàng cho màn này.”; vẫn thoát được về điện thoại |
| Thiếu một ô thông tin biên lai | Hiển thị `—`; giữ các trường và lời nhắn còn lại |
| Nhấn giữ dữ liệu câu chuyện đủ 380 ms | Mở lớp bằng chứng dùng chung, kể cả giao dịch thông thường và dữ liệu đánh lạc hướng |
| Nhấn ngắn một hàng giao dịch | Chỉ mở biên lai; không tự ghim |
| Cuộn hoặc hủy thao tác giữ | Không mở nhầm lớp bằng chứng hoặc biên lai sau thao tác giữ đã xử lý |
| Nhấn giữ tiêu đề, bộ lọc, lối tắt, thẻ điều hướng | Không mở lớp bằng chứng |
| Chọn ghim trong lớp bằng chứng | Dùng quy trình sổ tay hiện có, giữ nguồn bản ghi để đối chiếu |

## 7. Ràng buộc và đối chiếu nguồn

- Dữ liệu minh họa lấy từ tài liệu ngân hàng. Số dư, tên, thời gian, số tiền và hũ phải theo vụ việc đang chơi; không buộc cả năm loại manh mối xuất hiện cùng lúc.
- Giữ bố cục thẻ chính, ma trận lối tắt, lịch sử, ngăn biên lai và thanh điều hướng của tài liệu nguồn.
- Dùng bảng màu ngân hàng đã có; không bổ sung hệ giao diện mới. Dùng Ionicons, không dùng emoji trong giao diện.
- Áp dụng cỡ chữ, tương phản, vùng an toàn và phóng to 200% theo chuẩn chung. Chuẩn chữ chung được ưu tiên khi ví dụ ngân hàng dùng chữ nhỏ hơn mức tối thiểu.
- Không có dấu hiệu làm lộ manh mối trước khi kiểm tra; không ghim trực tiếp từ nút cố định trong màn hình hoặc biên lai.
- Không tạo khung HTML trong giai đoạn này.

## 8. Tài liệu liên quan

- [US-004](../us-004-techcornbank-bank-e-wallet-app-module.md)
- [Phạm vi đã xác nhận](../../elicitation/2026-10-15-us-004-techcornbank.md)
- [Tính năng ngân hàng](../../../../project-knowledge-base/solution-context/apps/banking/features.md)
- [Thiết kế ngân hàng](../../../../project-knowledge-base/solution-context/apps/banking/app-design.md)
- [Chuẩn thiết kế chung](../../../../project-knowledge-base/solution-context/design-system/design.md)
- [Khả năng tiếp cận và bố cục](../../../../project-knowledge-base/solution-context/design-system/accessibility-layout.md)
- [Điều hướng và chuyển động](../../../../project-knowledge-base/solution-context/design-system/behaviors-motion.md)
- [Khóa PIN dùng chung](../../../../project-knowledge-base/solution-context/apps/phone-os/pin-lockpad.md)
