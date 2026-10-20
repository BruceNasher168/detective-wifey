---
type: Wireframe
status: draft
description: "Universal Evidence Long-Press & Snapshot Pinning Modal ASCII wireframe for US-011."
tags: [requirement, wireframe, evidence, long-press, modal]
---

# Bằng Chứng Nghi Vấn - Nhấn Giữ & Ghim Bằng Chứng Đa Năng

## Người dùng, mục tiêu và bối cảnh

- Người chơi (Người Vợ) nhấn giữ vào các đoạn hội thoại, giao dịch, hóa đơn hoặc liên hệ đáng ngờ trong các ứng dụng để kiểm tra và ghim vào Sổ Tay Bắt Ghen mà không làm lộ trước manh mối.
- Nền tảng: Ứng dụng web trong khung điện thoại giả lập (viewport 393px × 852px); kích hoạt từ bất kỳ dữ liệu câu chuyện động nào có bọc `StoryEvidenceTarget`.
- Tham chiếu User Story: [US-011](../us-011-zero-spoiler-universal-long-press-clue-suspect-pinning.md).
- Trạng thái: Chờ duyệt bố cục ASCII (Phase 1); chưa tạo HTML (Phase 3).

## Nguồn đối chiếu

- [Thiết kế Sổ Tay Bắt Ghen](../../../../project-knowledge-base/solution-context/apps/phone-os/wife-notebook/app-design.md): Mục 2.2 cơ chế nhấn giữ không lộ manh mối.
- [Tính năng Sổ Tay Bắt Ghen](../../../../project-knowledge-base/solution-context/apps/phone-os/wife-notebook/features.md): Mục 2.2 ghim bằng chứng và đối tượng.
- [Thẻ manh mối dùng chung](../../wireframes/wireframe-clue-card.md): Quy chuẩn gom nhóm manh mối theo từng liên hệ/cuộc trò chuyện thành 1 thẻ duy nhất.
- [Biên bản khám phá](../../elicitation/2026-10-20-us-011-us-016-pinning-confrontation.md): Xác nhận ngưỡng 380ms, nút ghim duy nhất, gom nhóm thẻ và loại trừ thanh điều hướng.
- Thành phần mã nguồn thực tế: `StoryEvidenceTarget.tsx`, `UniversalEvidenceModal.tsx`, `evidence.ts`.

## Danh sách màn hình & trạng thái

| Mã | Trạng thái / Màn hình | Thành phần chính |
|---|---|---|
| M1 | Nhấn giữ dữ liệu câu chuyện | Phản hồi xúc giác `scale-98`, rung haptic 50ms khi đạt ngưỡng 380ms |
| M2 | Hộp thoại Bằng Chứng Nghi Vấn | Lớp nền mờ, huy hiệu tiêu đề, trích dẫn nội dung, đối tượng liên quan, nút ghim và bỏ qua |
| M3 | Phản hồi sau khi ghim | Thông báo trên Đảo động (Dynamic Island) và gom nhóm vào thẻ trong Sổ tay |

---

## Bố cục từng màn hình

### M1 - Trạng thái nhấn giữ dữ liệu câu chuyện (380ms Hold)

```text
+------------------------------------------------+
| [15:42]              [Đảo động]      [Sóng][Pin]|
| [< Tin nhắn]      Anh Tuấn Thợ Điện            |
|------------------------------------------------|
|                                                |
|  [Anh Tuấn]                                    |
|  +------------------------------------------+  |
|  | Tối nay 20h48 anh qua kiểm tra đường     |  |
|  | điện cho em nhé!                         |  |
|  +------------------------------------------+  |
|                                                |
|  [Đang nhấn giữ >= 380ms]                      |
|  -> Thu nhỏ nhẹ (scale-98), rung nhẹ 50ms      |
|  -> Nếu thả tay trước 380ms hoặc cuộn: HỦY     |
|  -> Thanh tiêu đề, nút Back, Tab bar: KHÔNG bấm |
|                                                |
+------------------------------------------------+
```

- Nhấn giữ $\ge 380\text{ms}$ trên dữ liệu văn bản/tin nhắn/hóa đơn sẽ kích hoạt modal kiểm tra.
- Chạm nhanh (< 380ms) thực hiện hành vi mặc định của ứng dụng (hoặc không làm gì), không thu thập bằng chứng.
- Cuộn màn hình hoặc dịch chuyển ngón tay quá 18px sẽ tự động hủy đếm giờ nhấn giữ.
- Thanh điều hướng, nút quay lại, ô tìm kiếm và cài đặt tuyệt đối không gắn cơ chế nhấn giữ bằng chứng.

---

### M2 - Hộp thoại Bằng Chứng Nghi Vấn (`UniversalEvidenceModal`)

```text
+------------------------------------------------+
|                                                |
|  +==========================================+  |
|  | Anh Tuấn Thợ Điện                        |  |
|  | Thời gian: 15/10 · 20:48                 |  |
|  |                                          |  |
|  | +--------------------------------------+ |  |
|  | | "Tối nay 20h48 anh qua kiểm tra      | |  |
|  | | đường điện cho em nhé!"              | |  |
|  | +--------------------------------------+ |  |
|  |                                          |  |
|  | +--------------------------------------+ |  |
|  | |           Ghim Vào Sổ Tay            | |  |
|  | +--------------------------------------+ |  |
|  | +--------------------------------------+ |  |
|  | |               Bỏ qua                 | |  |
|  | +--------------------------------------+ |  |
|  +==========================================+  |
|                                                |
+------------------------------------------------+
```

- Nền phía sau: Phủ màu tối `bg-black/60` kết hợp làm mờ sâu (`backdrop-blur-md`).
- Hộp thoại: Bo góc lớn `rounded-3xl`, bóng đổ nổi `shadow-2xl`, viền sáng `border-white/40`.
- Vùng trích dẫn: Nền `slate-50`, viền trái màu hồng cánh sen (`border-l-4 border-l-rose-500`), chữ in nghiêng màu `slate-700`.
- Dòng đối tượng: Hiển thị tên hiển thị hoặc bí danh được gán (`suspectToTag`), biểu tượng khiên bảo vệ `IoShieldOutline`.
- Nút chính: `[📌 Ghim Vào Sổ Tay Bắt Ghen]` (nền gradient hồng đậm, cao 48px, biểu tượng `IoPin`).
- Nút phụ: `[Bỏ qua]` (nền xám nhạt `slate-100`, chữ `slate-600`, cao 44px). Chạm nền đen bên ngoài cũng đóng hộp thoại.

---

### M3 - Gom nhóm vào thẻ Sổ Tay Bắt Ghen (`wireframe-clue-card.md`)

```text
+------------------------------------------------+
|           [📌 Đã thêm vào Sổ tay]              | <- Thông báo Đảo động
|------------------------------------------------|
| SỔ TAY BẮT GHEN - KHAY MANH MỐI                |
|                                                |
| +--------------------------------------------+ |
| | [Zola]  Anh Tuấn Thợ Điện                  | |
| |--------------------------------------------| |
| | • 15/10 · 20:48: "Tối nay 20h48 anh qua    | |
| |   kiểm tra đường điện cho em nhé!"         | |
| |                                            | |
| | • 15/10 · 21:05: "Xong việc nhớ gọi lại    | |
| |   cho em số này..."                        | |
| +--------------------------------------------+ |
|                                                |
+------------------------------------------------+
```

- Sau khi bấm ghim, Đảo động trên đỉnh màn hình hiển thị biểu tượng ghim và thông báo xác nhận trong 2 giây.
- Dữ liệu được đưa vào Khay Manh Mối của Sổ Tay:
  - Nếu đã tồn tại thẻ của liên hệ này (ví dụ "Anh Tuấn Thợ Điện"), tin nhắn mới được nối tiếp vào danh sách gạch đầu dòng (`• DD/MM · HH:mm: "..."`) bên dưới cùng một thẻ.
  - Không tạo ra nhiều thẻ rời rạc cho cùng một cuộc trò chuyện/liên hệ trong cùng một ứng dụng.
  - Thẻ hiển thị trên Khay hoặc Bảng manh mối tuân thủ chuẩn tại [wireframe-clue-card.md](../../wireframes/wireframe-clue-card.md).

---

## Thành phần và ràng buộc tương tác

| Thành phần | Quy chuẩn thiết kế | Ràng buộc kỹ thuật |
|---|---|---|
| Cử chỉ nhấn giữ | Thời gian giữ $\ge 380\text{ms}$, dung sai xê dịch ngón tay $\le 18\text{px}$ | Kích hoạt `onTriggerEvidence`, chặn `contextmenu` mặc định của trình duyệt |
| Phản hồi xúc giác | Web Vibration API (`navigator.vibrate(50)`) | Bỏ qua mượt mà trên thiết bị không hỗ trợ rung |
| Vùng chạm nút | Tối thiểu 44px × 44px (nút Đóng, Bỏ qua) và 48px (Ghim) | Đạt chuẩn tiếp cận Apple HIG và WCAG 2.1 AA |
| Biểu tượng | Bộ Ionicons chuẩn (`IoPin`, `IoClose`, `IoShieldOutline`) | Tuyệt đối không dùng emoji thô hoặc thư viện Lucide |
| Tính bảo mật manh mối | Mọi tin nhắn (thật hoặc bẫy) đều mở modal giống nhau | Không gắn nhãn hay viền màu trước khi người chơi nhấn giữ |

