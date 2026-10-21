---
type: Wireframe
status: signed-off
revision: 2
signed_off_at: "2026-10-21"
description: "Màn nhập môn: minh họa thay đoạn giới thiệu dài."
tags: [wireframe, tutorial, level-0, us-031]
---

# Màn 0 - Bắt đầu tập điều tra

## Người dùng, mục tiêu và bối cảnh

Người chơi mới chọn học, bỏ qua hoặc chơi lại. US-031; web, dùng vùng chơi hiện có. Bản lần 2 đã được duyệt ngày 21/10/2026.

## Nguồn đối chiếu

[Khám phá](../../elicitation/2026-10-21-level-0-tutorial-sixth-sense.md) · [Thiết kế hệ điều hành](../../../../project-knowledge-base/solution-context/apps/phone-os/app-design.md) · [Chuyển động](../../../../project-knowledge-base/solution-context/design-system/behaviors-motion.md).

## Danh sách màn hình

Lời mời lần đầu; hàng Màn 0 trong danh sách màn; xác nhận chơi lại khi đang điều tra.

## Bố cục từng màn hình

    +------------------------------------------------+
    |                 TẬP ĐIỀU TRA                   |
    |                     Màn 0                      |
    |                                                |
    |  [Kính lúp] --> [Thẻ + ghim] --> [Thẻ nối dây] |
    |                                                |
    |                 Xem. Ghim. Nối.                |
    |           Tập điều tra, không lo thua.         |
    |                                                |
    |              [Phát] Bắt đầu                    |
    |                  Bỏ qua                        |
    +------------------------------------------------+

Các nhãn biểu tượng trong ngoặc mô tả hình SVG, không phải chữ bổ sung trên giao diện.

| Màn phụ | Nội dung hiển thị |
|---|---|
| Danh sách màn | [Sổ tay] Màn 0 · Chưa học / Đã bỏ qua / Đã hoàn thành · [Phát / Chơi lại] |
| Xác nhận | [Chơi lại] Tập lại từ đầu? · Tiến độ màn chính được giữ. · [Chơi lại] / [Ở lại] |

## Biểu tượng, minh họa và chuyển động

- Biểu tượng Ionicons: search-outline, pin-outline, link-outline, play-outline, refresh-outline, book-outline.
- Minh họa bằng thẻ giấy và dây nối trung tính; không dùng nội dung vụ án.
- Khi mở lời mời: kính lúp lướt qua thẻ, ghim đặt xuống, hai thẻ nối dây. Chạy một lượt rồi dừng; không chờ hoạt ảnh mới được bấm.
- Giảm chuyển động: ba hình tĩnh theo thứ tự, giữ nguyên câu ngắn và thao tác.

## Tương tác và trạng thái

| Tình huống | Hành vi |
|---|---|
| Bắt đầu / Bỏ qua | Mở Màn 0 / Màn 1. Đóng lời mời tương đương Bỏ qua; không tính là hoàn thành. |
| Lần sau / Chơi lại | lưu lựa chọn, không mời lại; luôn truy cập được Màn 0 qua danh sách màn hiện có. |
| Phiên tập | chơi lại từ đầu, tách thẻ và kết quả khỏi màn thường; giữ tiến độ màn chính và cờ hoàn thành cũ. Không thêm tiếp tục dở dang. |
| Đang tải / Lỗi | Biểu tượng chờ + “Đang mở...” / “Chưa mở được.” + [Thử lại] hoặc [Vào Màn 1]. Không ghi nhận hoàn thành. |

## Ràng buộc đã duyệt

- Lưu lựa chọn, xác nhận chơi lại và tách phiên đã được duyệt cùng bản lần 2.
- Biểu tượng có tên truy cập; dùng chuẩn vùng chạm hiện có. Không dùng emoji, vỏ điện thoại hoặc menu mới.
- Nội dung vụ án thuộc US-034, duyệt riêng. [Tiếp theo: tập thu thập](../../epic-02-investigation-suspicion-mechanics/wireframes/wireframe-level-0-evidence-coaching.md).

## Truy vết

[US-031](../us-031-level-0-entry-skip-replay.md). Phê duyệt bố cục và chuyển động không đồng nghĩa đã kiểm chứng hoạt ảnh thực tế.
