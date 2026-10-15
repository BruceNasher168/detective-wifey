---
type: Wireframe
status: draft
description: "Phone investigation ASCII wireframe for US-009."
tags: [requirement, wireframe, phone]
---

# Điện thoại - Kiểm tra cuộc gọi và danh bạ

## Người dùng, mục tiêu và bối cảnh

- Người chơi kiểm tra điện thoại của chồng để đọc lịch sử cuộc gọi và ghi chú liên hệ.
- Nền tảng: ứng dụng web trong khung điện thoại hiện có; mở từ màn hình chính của màn chơi có Phone.
- [US-009](../us-009-phone-mobile-dialer-contacts-app-module.md).
- Trạng thái: chờ duyệt bố cục ASCII; chưa tạo HTML.

## Nguồn đối chiếu

- [app-design.md](../../../../project-knowledge-base/solution-context/apps/phone-os/phone/app-design.md): mục 3.1 lịch sử cuộc gọi và 3.2 chi tiết liên hệ là nền bố cục.
- [features.md](../../../../project-knowledge-base/solution-context/apps/phone-os/phone/features.md): mục 2.1 thời lượng, 2.2 ghi chú liên hệ và mục 3 ánh xạ `CLUE-PHONE-01`, `CLUE-PHONE-02`.
- [Phạm vi đã xác nhận](../../elicitation/2026-10-16-us-009-us-026-phone-messages.md).
- Khác biệt đã duyệt: bỏ Yêu thích, Bàn phím/T9, Sửa, FaceTime, gửi thư và nút thêm bằng chứng trực tiếp trong mẫu cũ. Giữ phần lịch sử, bộ lọc và thẻ liên hệ. Thu thập bằng chứng qua nhấn giữ nội dung.

## Danh sách màn hình

| Mã | Màn hình | Thành phần chính |
|---|---|---|
| P1 | Gần đây | Tiêu đề, bộ lọc tất cả/gọi nhỡ, danh sách cuộc gọi, điều hướng |
| P2 | Danh bạ | Tiêu đề, danh sách liên hệ, điều hướng |
| P3 | Chi tiết liên hệ | Đóng, tên, số điện thoại, thao tác liên hệ, ghi chú mở rộng |

## Bố cục từng màn hình

### P1 - Gần đây

```text
+------------------------------------------------+
| [Giờ màn chơi] [Đảo động] [Sóng] [Pin]          |
| [Trang chủ]        Điện thoại                  |
| [Tất cả: đang chọn]       [Gọi nhỡ]             |
|------------------------------------------------|
| Tổng Đài Viettel                  23:45 [Chi tiết]|
| Cuộc gọi đi                    1 phút 12 giây   |
|------------------------------------------------|
| Số lạ: [Số điện thoại]            22:15 [Chi tiết]|
| Cuộc gọi nhỡ                                   |
|------------------------------------------------|
| Mẹ Đẻ                            18:05 [Chi tiết]|
| Cuộc gọi đến                   5 phút 20 giây   |
|------------------------------------------------|
| [Gần đây: đang chọn]          [Danh bạ]         |
|                    [Về màn hình chính]         |
+------------------------------------------------+
```

- Nội dung chính: bản ghi của màn chơi, theo thứ tự lịch sử được cung cấp; thời gian thuộc câu chuyện.
- Thao tác: đổi bộ lọc; mở thông tin bằng nút Chi tiết; nhấn giữ phần dữ liệu cuộc gọi để kiểm tra bằng chứng.
- Khối bản ghi không bao gồm nút Chi tiết trong vùng nhấn giữ.

### P2 - Danh bạ

```text
+------------------------------------------------+
| [Giờ màn chơi] [Đảo động] [Sóng] [Pin]          |
| [Trang chủ]         Danh bạ                    |
|------------------------------------------------|
| BC   Bác Sĩ Cương                         [Mở] |
| MĐ   Mẹ Đẻ                                [Mở] |
| TV   Tổng Đài Viettel                      [Mở] |
|------------------------------------------------|
| [Gần đây]          [Danh bạ: đang chọn]         |
|                    [Về màn hình chính]         |
+------------------------------------------------+
```

- Chọn hàng liên hệ mở P3; không có tạo, sửa hoặc xóa liên hệ.
- Danh sách chỉ chứa liên hệ của màn chơi. Tên và chữ viết tắt là dữ liệu minh họa từ tài liệu gốc.

### P3 - Chi tiết liên hệ

```text
+------------------------------------------------+
| [Đóng]            Chi tiết liên hệ             |
|                       BC                       |
|                  Bác Sĩ Cương                  |
|                    Nhãn khoa                   |
|------------------------------------------------|
| [Nhắn tin]                   [Gọi điện]         |
|------------------------------------------------|
| Di động:        [Số điện thoại]                |
| Công việc:      [Số điện thoại]                |
|------------------------------------------------|
| [Ghi chú: mở rộng / thu gọn]                    |
| Chung cư Sunshine City - Tòa S2 P1408           |
| Mã cửa: 1408                                   |
+------------------------------------------------+
```

- Ghi chú thu gọn/mở rộng bằng tiêu đề; phần văn bản ghi chú là vùng bằng chứng, tiêu đề mở rộng không phải vùng bằng chứng.
- Nhắn tin: mở cuộc trò chuyện khớp trong Messages khi ứng dụng có trong màn chơi; thiếu đích giữ nguyên thẻ và báo “Không có cuộc trò chuyện”.
- Gọi điện: giữ nguyên thẻ và báo “Không thể gọi điện trong chế độ điều tra.”
- Đóng trở về đúng danh sách nguồn. Số không có liên hệ chỉ hiện số đã cung cấp, không tạo tên hay ghi chú.

## Tương tác và trạng thái

| Trường hợp | Hiển thị / kết quả |
|---|---|
| Chưa có lịch sử | “Chưa có cuộc gọi” |
| Bộ lọc gọi nhỡ rỗng | “Không có cuộc gọi nhỡ” |
| Danh bạ rỗng | “Chưa có liên hệ” |
| Liên hệ thiếu ghi chú | “Chưa có ghi chú”; không tạo nội dung bằng chứng giả |
| Nhấn giữ dữ liệu 380ms | Mở ảnh chụp làm mờ qua UniversalEvidenceModal và StoryEvidenceTarget hiện có |
| Chạm ngắn / cuộn trước ngưỡng | Không thu thập bằng chứng; hủy nhấn giữ khi cuộn |
| Dữ liệu thường / dữ liệu có manh mối | Cùng cách nhấn giữ; không gắn nhãn báo trước manh mối |
| Đóng bảng bằng chứng | Trở lại màn hình nguồn, không sửa dữ liệu câu chuyện |

## Thành phần và ràng buộc

- Tái sử dụng khung điện thoại, điều hướng, thông báo và bảng bằng chứng dùng chung; không tạo biến thể riêng trong Phone.
- Điều khiển tối thiểu 44 x 44px; biểu tượng Ionicons/vector SVG; không dùng emoji.
- Không gắn vùng nhấn giữ lên tiêu đề, nút quay lại/đóng, bộ lọc, thanh điều hướng hay hàng thao tác liên hệ.
- Không có nút “Ghim” thường trực. Không gọi điện thật, không thay đổi lịch sử hoặc danh bạ.
- Nội dung minh họa giữ nguồn `features.md`; cấu hình từng màn chơi quyết định tên, số, giờ, ghi chú và ánh xạ manh mối thực tế.
- Chưa kiểm tra mã triển khai; tài liệu này xác định hành vi cần có, không khẳng định các thành phần đã đáp ứng.
