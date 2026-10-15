---
type: Wireframe
status: draft
description: "Messages investigation ASCII wireframe for US-026."
tags: [requirement, wireframe, messages]
---

# Tin nhắn - Kiểm tra SMS và bản nháp đã hủy

## Người dùng, mục tiêu và bối cảnh

- Người chơi đọc tin nhắn, đối chiếu xác nhận đặt phòng, thời gian phản ứng và bản nháp hẹn giờ đã hủy.
- Nền tảng: ứng dụng web trong khung điện thoại hiện có; vào từ màn hình chính hoặc liên hệ Phone có cuộc trò chuyện khớp.
- [US-026](../us-026-messages-sms-parody-chat-app-module.md).
- Trạng thái: chờ duyệt bố cục ASCII; chưa tạo HTML.

## Nguồn đối chiếu

- [app-design.md](../../../../project-knowledge-base/solution-context/apps/phone-os/messages/app-design.md): mục 3.1 danh sách hội thoại và 3.2 luồng tin nhắn, phản ứng, bản nháp hẹn giờ đã hủy.
- [features.md](../../../../project-knowledge-base/solution-context/apps/phone-os/messages/features.md): mục 2.1 SMS thương hiệu, 2.2 thời gian phản ứng, 2.3 bản nháp và mục 3 ánh xạ `CLUE-MSG-01`, `CLUE-MSG-02`.
- [Phạm vi đã xác nhận](../../elicitation/2026-10-16-us-009-us-026-phone-messages.md).
- Khác biệt đã duyệt: bỏ nút soạn/gửi, thay đổi phản ứng và nút thêm bằng chứng trực tiếp. Phản ứng có sẵn hiển thị bằng vector; bằng chứng dùng nhấn giữ nội dung.

## Danh sách màn hình

| Mã | Màn hình | Thành phần chính |
|---|---|---|
| M1 | Hộp thư | Tiêu đề, tìm kiếm, hội thoại ưu tiên có sẵn, danh sách hội thoại |
| M2 | Hội thoại | Quay lại, tên người gửi, tin nhắn, phản ứng có sẵn, mở bản nháp |
| M3 | Bản nháp đã hủy | Đóng, nội dung, thời gian dự kiến gửi và hủy |

## Bố cục từng màn hình

### M1 - Hộp thư

```text
+------------------------------------------------+
| [Giờ màn chơi] [Đảo động] [Sóng] [Pin]          |
| [Trang chủ]          Tin nhắn                  |
| [Tìm kiếm tin nhắn...........................] |
|------------------------------------------------|
| Hội thoại ưu tiên                              |
| [Vợ Yêu]                       [Sếp Dũng]       |
|------------------------------------------------|
| [Chưa đọc] HOTEL_SAOMAI             [Ngày]      |
| Xác nhận đặt phòng VIP 2 khách...              |
|------------------------------------------------|
| BDS_LONGTHANH                       [Ngày]      |
| Mở bán đất nền...                              |
|------------------------------------------------|
| Mẹ Đẻ                               [Ngày]      |
| Cuối tuần này hai đứa có về quê...              |
|                    [Về màn hình chính]         |
+------------------------------------------------+
```

- Tìm theo tên người gửi hoặc nội dung tin nhắn; bỏ truy vấn khôi phục danh sách.
- Hội thoại ưu tiên chỉ xuất hiện khi dữ liệu có cung cấp; không có thao tác đổi thứ tự/ưu tiên.
- Chọn hội thoại mở M2. Tìm kiếm và tiêu đề không có vùng bằng chứng.

### M2 - Hội thoại

```text
+------------------------------------------------+
| [Tin nhắn]          HOTEL_SAOMAI                |
|------------------------------------------------|
|                  [Ngày câu chuyện]            |
| Khách Sạn Sao Mai Boutique - Hồ Tràm            |
| Xác nhận đặt phòng VIP cho 2 khách             |
| Nhận phòng: [Ngày, giờ trong dữ liệu]          |
| Trả phòng:  [Ngày, giờ trong dữ liệu]          |
| Yêu cầu: hoa hồng và rượu vang                 |
| [Giờ gửi]                                     |
|------------------------------------------------|
|               Đã nhận xác nhận, cảm ơn resort. |
|                  [Phản ứng: Yêu thích] [Giờ]   |
|------------------------------------------------|
| [Xem bản nháp hẹn giờ đã hủy]                   |
|                    [Về màn hình chính]         |
+------------------------------------------------+
```

- Nội dung được sắp theo lịch sử của hội thoại; không chuyển bản nháp hay phản ứng từ hội thoại khác sang hội thoại này.
- Chạm phản ứng có sẵn mở thời điểm phản ứng. Không tạo, sửa hoặc xóa phản ứng.
- Nút xem bản nháp chỉ xuất hiện khi hội thoại có bản nháp đã hủy; không gắn nhấn giữ lên nút này.
- Không có ô nhập, nút gửi hoặc thao tác đặt phòng.

### M3 - Bản nháp hẹn giờ đã hủy

```text
+------------------------------------------------+
| [Đóng]             Bản nháp đã hủy             |
|------------------------------------------------|
| Người nhận: [Tên trong hội thoại]              |
| Em chuẩn bị đồ đẹp nhé, mai anh qua đón.        |
|------------------------------------------------|
| Dự kiến gửi: [Thời gian trong dữ liệu]          |
| Đã hủy lúc:  [Thời gian trong dữ liệu]          |
| Chỉ xem                                       |
+------------------------------------------------+
```

- Chỉ hiển thị trường có trong dữ liệu; thiếu thời gian không tự suy ra từ ngày hiện tại.
- Nhấn giữ khối nội dung bản nháp để mở bằng chứng có nguồn hội thoại và thời gian liên quan.
- Đóng trở về M2; không có khôi phục, gửi hoặc hẹn giờ lại.

## Tương tác và trạng thái

| Trường hợp | Hiển thị / kết quả |
|---|---|
| Hộp thư rỗng | “Chưa có cuộc trò chuyện” |
| Tìm kiếm không khớp | “Không tìm thấy cuộc trò chuyện” |
| Hội thoại rỗng | “Chưa có tin nhắn” |
| Đích từ Phone thiếu / Messages không có trong màn chơi | Giữ nguyên Phone, báo “Không có cuộc trò chuyện” |
| Hội thoại không còn khả dụng | “Không có cuộc trò chuyện”; cho quay lại hộp thư |
| Không có bản nháp | Ẩn nút mở bản nháp; nếu đích bản nháp không khả dụng, báo “Không có bản nháp đã hủy” |
| Thiếu thời gian phản ứng | “Không có thời gian phản ứng”; không tự tạo thời gian |
| Nhấn giữ dữ liệu 380ms | StoryEvidenceTarget mở UniversalEvidenceModal với ảnh chụp làm mờ; không sửa nguồn |
| Chạm ngắn / cuộn trước ngưỡng | Không thu thập; chạm phản ứng chỉ xem thời gian, cuộn hủy nhấn giữ |
| Dữ liệu thường / dữ liệu có manh mối | Cùng cách nhấn giữ, không lộ nhãn phân loại manh mối |

## Thành phần và ràng buộc

- Tái sử dụng khung điện thoại, thanh tìm kiếm, điều hướng, thông báo và bảng bằng chứng dùng chung; không tạo bảng bằng chứng riêng.
- Điều khiển tối thiểu 44 x 44px; tìm kiếm cao tối thiểu 48px; Ionicons/vector SVG, không emoji.
- Chỉ dữ liệu câu chuyện trong tin nhắn, phản ứng và bản nháp nhận nhấn giữ. Tiêu đề, tìm kiếm, nút quay lại/đóng và nút mở bản nháp không nhận lớp bằng chứng.
- Không có nút “Ghim” thường trực. Không gửi, sửa, xóa hoặc tạo hội thoại.
- Tên, nội dung và đặt phòng minh họa theo tài liệu gốc; ngày giờ và manh mối thực tế lấy từ cấu hình màn chơi.
- Chưa kiểm tra mã triển khai; tài liệu này xác định hành vi cần có, không khẳng định các thành phần đã đáp ứng.
