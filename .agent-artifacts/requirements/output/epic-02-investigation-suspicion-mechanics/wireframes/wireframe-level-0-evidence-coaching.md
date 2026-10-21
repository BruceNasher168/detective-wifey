---
type: Wireframe
status: signed-off
revision: 2
signed_off_at: "2026-10-21"
description: "Học thu thập qua biểu tượng và minh họa cử chỉ."
tags: [wireframe, tutorial, level-0, us-032]
---

# Màn 0 - Tập xem và ghim thông tin

## Người dùng, mục tiêu và bối cảnh

Người mới thực hành khám phá, nhấn giữ và ghim. US-032; web, dùng ứng dụng và hộp thoại hiện có. Bản lần 2 đã được duyệt ngày 21/10/2026.

## Nguồn đối chiếu

[Khám phá](../../elicitation/2026-10-21-level-0-tutorial-sixth-sense.md) · [Quy tắc 380ms](../../elicitation/2026-10-20-us-011-us-016-pinning-confrontation.md) · [Hộp thoại dùng chung](wireframe-us-011-universal-evidence-modal.md) · [Thiết kế hệ điều hành](../../../../project-knowledge-base/solution-context/apps/phone-os/app-design.md) · [Chuyển động](../../../../project-knowledge-base/solution-context/design-system/behaviors-motion.md).

## Danh sách màn hình

Màn hình chính, nội dung ứng dụng, hộp thoại ghim, quay lại ứng dụng. Dùng một vùng hướng dẫn ngoài nội dung cần thao tác.

## Bố cục từng màn hình

    +------------------------------------------------+
    | [Ứng dụng và nội dung hiện có]                 |
    |                                                |
    | [Lối mở sổ tay hiện có]                        |
    |------------------------------------------------|
    | [Minh họa ngón tay giữ trên thẻ mẫu]           |
    |            Nhấn giữ để xem.                    |
    | [Xem lại minh họa]                    Bỏ qua   |
    +------------------------------------------------+

Trong hộp thoại: giữ trích dẫn đã chọn, nút [Ghim] Ghim vào sổ tay và [Đóng]. Không lặp thêm đoạn giải thích.

## Biểu tượng, minh họa và chuyển động

| Bước | Câu trên màn hình | Minh họa động | Khi nào tiến bước |
|---|---|---|---|
| Mở ứng dụng | Mở [tên ứng dụng]. | Ngón tay chạm biểu tượng ứng dụng, dùng chuyển cảnh mở ứng dụng hiện có | Người chơi mở ứng dụng mục tiêu |
| Nhấn giữ | Nhấn giữ để xem. | Ngón tay đặt xuống thẻ mẫu; vòng giữ đầy trong 380ms; hình hộp thoại xuất hiện | Người chơi thật mở hộp thoại |
| Ghim | Ghim vào sổ tay. | Biểu tượng ghim đặt lên thẻ mẫu; sau thao tác thật, hình thẻ thu về lối mở sổ tay | Ghim thực sự thành công |
| Xem lại | Mở sổ tay. | Biểu tượng sổ tay phản hồi nhẹ một lần, ngón tay minh họa thao tác chạm | Người chơi mở sổ tay |

- Biểu tượng Ionicons: hand-left-outline, pin-outline, book-outline, play-outline, close-outline. Ngón tay và thẻ mẫu là minh họa SVG đơn giản.
- Minh họa chạy tối đa hai lượt rồi đứng yên; nút Xem lại có tên truy cập. Dừng ngay khi người chơi thao tác.
- Minh họa nằm trong vùng hướng dẫn, không chọn hoặc làm sáng manh mối thật. Không có thao tác mô phỏng nào tự cộng tiến độ.
- Giảm chuyển động: thay bằng chuỗi hình tĩnh đặt tay, giữ, mở; câu hướng dẫn vẫn hiển thị. Không cần âm thanh để hiểu.

## Tương tác và trạng thái

| Tình huống | Hành vi |
|---|---|
| Chạm nhanh, cuộn, đóng hộp thoại | Giữ hành vi gốc; không hoàn thành bước. Chỉ nội dung câu chuyện hỗ trợ nhấn giữ. |
| Ghim trùng / Ghim lỗi | Không thêm thẻ hoặc tiến độ trùng. Lỗi: “Chưa ghim được.” + [Thử lại]; giữ dữ liệu đã lưu. |
| Khám phá ứng dụng khác | Cho phép; bài học hiện tại chờ đúng hành động. Thông tin thường và manh mối thật dùng cùng thao tác. |
| Bỏ qua | Đến Màn 1 theo US-031; không ghi nhận hoàn thành Màn 0. |

## Ràng buộc đã duyệt

- Một câu ngắn cho mỗi bước; dùng biểu tượng và minh họa để giải thích cử chỉ. Không che nội dung, điều hướng hoặc lối mở sổ tay.
- Giữ gom nhóm thẻ theo cơ chế chung; không thêm nút ghim cố định hay báo đúng/sai cho thông tin đã ghim.
- Dùng chuyển động và vùng chạm hiện có; không đổi thời gian mở ứng dụng hoặc sổ tay.
- [Vào hoặc chơi lại](../../epic-01-virtual-phone-app-ecosystem/wireframes/wireframe-level-0-entry.md) · [Tiếp theo: suy luận](../../epic-03-wife-notebook-verdict-social-sharing/wireframes/wireframe-level-0-deduction-completion.md).

## Truy vết

[US-032](../us-032-level-0-guided-evidence-collection.md). Phê duyệt bố cục và chuyển động không đồng nghĩa đã kiểm chứng hoạt ảnh thực tế.
