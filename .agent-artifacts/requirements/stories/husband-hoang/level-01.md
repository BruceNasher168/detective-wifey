---
husband: hoang
level: 1
---

# Hồ sơ Đặc tả Cốt truyện — Màn 1: Cơn ghen lúc nửa đêm

> **Thẩm quyền Tác giả**: Được thiết kế bởi `level-designer`. Là căn cứ cốt truyện pháp y duy nhất (SSOT) tuân thủ nghiêm ngặt **Nguyên tắc Bằng chứng Gián tiếp (Subtle Clues Invariant - Zero Obvious Spoilers)** và **Danh mục Tên Ứng dụng Chuẩn (Generic App Names)**. Bàn giao cho `@frontend-game-developer` để hiện thực hóa file cấu hình `src/data/cases/hoang/level_01.json`.

---

## 1. Bối cảnh Vụ án & Chân dung Người Chồng

### 1.1. Chân dung Người Chồng
- **Họ và Tên / Biệt danh**: Hoàng (Chồng IT / Tech Lead tại Technosoft).
- **Tuổi & Nghề nghiệp**: 29 tuổi, Senior Full-stack Developer.
- **Tính cách Đặc trưng**: Vẻ ngoài hiền lành, mẫu mực, luôn miệng khen cơm vợ nấu ngon nhất trần đời, tự nhận là người "sợ vợ số một thiên hạ", lương tháng nộp đủ 90%. Tuy nhiên, gần đây có thói quen cực kỳ đáng ngờ: luôn úp màn hình điện thoại xuống mặt bàn mỗi khi ngồi cạnh vợ, hay mang máy vào phòng tắm "ngâm" hàng tiếng đồng hồ, và thường xuyên viện cớ "thức đêm ôm laptop fix bug giỏ hàng gấp cho kịp sprint".
- **Hành vi Khả nghi Kích hoạt Cơn Ghen**: Đúng 23:45 đêm, khi Hoàng vờ ngáy ngủ say sưa trên giường, màn hình điện thoại chợt sáng đèn với một thông báo tin nhắn từ danh bạ "Anh Tuấn Thợ Điện" nhắn “Áo anh em treo lên rồi, mai mang trả nhé.”. Chi tiết bất thường này giục giã người vợ phải lén mở khóa máy kiểm tra.

### 1.2. Chất liệu Trào phúng & Drama Gia đình Việt
- **Giữ nền truyện**: Hoàng, 29 tuổi, lập trình viên Technosoft; người tình Hương được lưu thành “Anh Tuấn Thợ Điện”. Giữ năm nghi phạm và kết luận `cheating`.
- **Sự thật dành cho tác giả**: Hoàng gặp riêng Hương vào tối 15/10 để đánh dấu một tháng từ 15/09, mua váy kèm thiệp, đồng thời nói với vợ đang họp cùng nhóm ở công ty. Sinh hoạt gia đình và công việc vẫn diễn ra bình thường; chiếc điện thoại không phải danh sách tang chứng được xếp sẵn.
- **Nguyên tắc lần sửa này**: Không dùng ngoại lệ manh mối trực diện của Màn 1. Một giao dịch chia tiền ăn, một đơn váy hoặc một cuộc gọi đêm đều có lý do vô hại nếu đứng riêng. Chuỗi đối chiếu gồm lời khai với vợ, giờ hẹn ăn, thanh toán nhà hàng, mốc trên thiệp và danh tính giao nhận.
- **Dữ liệu chi tiết**: [level-01-phone-data.md](level-01-phone-data.md) là phần nội dung bắt buộc của hồ sơ này, gồm lời thoại và bản ghi sinh hoạt cho từng ứng dụng. Đây là thiết kế mới được đề xuất trong lần sửa, chưa phải mô tả dữ liệu đã chạy trong ứng dụng.

---

## 2. Danh sách Nghi phạm & Vỏ bọc Ngụy trang

| Suspect ID | Tên Hiển thị | Thân phận Thật / Nghề nghiệp | App Phát hiện Đầu tiên | Vỏ bọc Danh bạ / Biệt danh | Vai trò Cốt truyện |
|---|---|---|---|---|---|
| `suspect_huong` | Hương Marketing | Nguyễn Thị Thu Hương — Chuyên viên Marketing cùng công ty Technosoft | `internet-messaging` | "Anh Tuấn Thợ Điện" | **Kẻ chủ mưu thực sự (Culprit)** |
| `suspect_lan_anh` | Lan Anh Kế Toán | Thủ quỹ công đoàn kiêm Kế toán nội bộ Technosoft | `internet-messaging` | "Lan Anh Kế Toán" | **Bẫy nghi ngờ có Twist (Red Herring 1)** |
| `suspect_thao` | Thảo PT Gym | Nữ huấn luyện viên thể hình California Fitness | `internet-messaging` | "Thảo PT California" | **Bẫy nghi ngờ thể hình (Red Herring 2)** |
| `suspect_ngoc` | Bé Ngọc Sinh Viên | Em gái ruột của Hoàng ở quê lên trọ học đại học | `banking` | "Bé Ngọc KTX" | **Bẫy nghi ngờ chu cấp (Red Herring 3)** |
| `suspect_mai` | Mai Lễ Tân | Nhân viên lễ tân sảnh tòa nhà Technosoft | `ecommerce` | "Mai Lễ Tân" | Bẫy nhận hộ bưu phẩm (Red Herring 4) |

---

## 3. Sự thật, Lời Roasting & Thang Ngụy biện

### 3.1. Phân loại Kết luận Sự thật (Ground Truth)
- **Kết luận (`verdict`)**: `cheating`
- **Mã Tiểu tam (`culpritSuspectId`)**: `suspect_huong`

### 3.2. Lời Roasting Kết thúc Vụ án
- **Chiến thắng (`narrativeRoast`)**:
  > “Thợ điện gì mà hẹn lại đúng ngày, nhận váy kèm thiệp riêng, còn khiến anh họp ở công ty mà quẹt thẻ tận quán cơm! Anh sửa điện hay sửa luôn lời khai?”
- **Ghen nhầm Lan Anh (`overJealousRoast`)**:
  > “Năm người góp mỗi người một trăm mua quà cho sếp. Em đọc đến dòng thứ ba là giải được, sao lại đối chất từ dòng thứ nhất?”
- **Ghen nhầm Thảo**:
  > “Người ta nhắc anh mang phiếu đánh giá cột sống. Em bắt được lưng đau, chưa bắt được người tình.”
- **Ghen nhầm Ngọc**:
  > “Em gái nhắn cảm ơn anh trai còn chưa đủ rõ à? Chủ nhật về quê chắc phải giới thiệu lại gia phả.”
- **Ghen nhầm Mai**:
  > “Mai giữ cả hoa sinh nhật lẫn gói đồ, còn nhắc anh ký sổ. Sảnh lễ tân đâu phải danh sách người tình.”
- **Hết 5 lượt nghi ngờ**:
  > “Hoàng giật lại máy: ‘Em kiểm tra điện thoại hay kiểm kê cả khu phố đấy? Mai anh còn đi làm!’”

### 3.3. Thang Ngụy biện Khi Đối chất Sớm ("Chối bay chối biến")
| Số lượng Thẻ Bằng chứng hợp lệ, không trùng Clue ID | Thái độ Người Chồng | Lời Thoại Ngụy biện Điển hình | Kết quả |
|---|---|---|---|
| **0 Thẻ (Cáo buộc non)** | Hùng hổ, gạt phăng | *"Em lại lướt TikTok xem mấy cái clip drama bắt ghen xàm xí rồi đa nghi đúng không? Đưa máy đây anh đi ngủ mai còn đi làm!"* | Thất bại (0 Sao) |
| **1 Thẻ (Một chi tiết nghi vấn)** | Hơi giật mình, phân bua | *"Ơ kìa em, số thợ điện đấy thật mà, hôm trước anh gọi nhờ sửa cái đường dây mạng ở văn phòng thôi chứ có gì đâu!"* | Chiến thắng 1 Sao (Thắng non) |
| **2 Thẻ (Đã đối chiếu hai nguồn)** | Toát mồ hôi, bao biện | *"À... cái đơn hàng đó là con bé phòng Marketing nó nhờ anh đặt hộ qua tài khoản mua sắm để áp mã Freeship Extra thôi mà, anh biết gì đâu!"* | Chiến thắng 2 Sao (Khá thuyết phục) |
| **3+ Thẻ (Đủ chuỗi đối chiếu)** | Cúi đầu nhận tội | *"Anh xin lỗi vợ... Bọn anh có hẹn riêng tối nay. Anh không nên nói dối em là còn họp, em cho anh giải thích..."* | Chiến thắng Tuyệt đối 3 Sao |

---

## 4. Cấu hình Ứng dụng & Mồi nhử Thông báo

### 4.1. Phân cấp Độ khó
- **Màn chơi**: Màn 1, khởi động. `allowedStrikes`: **5 strikes**. `lockChallenges`: **0 locks**.
- **Bốn app có manh mối**: `internet-messaging`, `banking`, `ecommerce`, `phone`.
- **Đồng hồ**: D = 15/10, lúc 23:45; pin 42%, mạng 5G, màu PWA `#0f172a`. Ngày thuộc truyện, không lấy ngày hệ thống.
- Giữ cách tính sao hiện hành tại mục 3.3. Một thẻ vẫn chỉ là thắng non theo cơ chế hướng dẫn, không viết lời thừa nhận toàn bộ quan hệ khi chỉ có một chi tiết. Lời thú nhận và roast hoàn chỉnh dành cho kết quả đủ chuỗi.

### 4.2. Bảng Phân bổ Trạng thái Ứng dụng

| App ID | Vai trò | Dữ liệu yêu cầu |
|---|---|---|
| `internet-messaging` | Manh mối + sinh hoạt | 10 luồng, chỉ 2 luồng mang cùng manh mối lịch hẹn/lời khai; 8 luồng gia đình, bạn bè, công việc và giải oan |
| `banking` | Manh mối + sinh hoạt | 60 giao dịch; 2 bản ghi liên quan Hương/bữa tối, còn lại lương, sinh hoạt, hóa đơn, mua sắm, chia tiền |
| `ecommerce` | Manh mối + sinh hoạt | 22 đơn, chỉ 1 đơn liên quan vụ án; 8 luồng chat người bán, từ khóa và thông báo bình thường |
| `phone` | Manh mối bổ trợ + sinh hoạt | 46 cuộc gọi, chỉ 1 cuộc mang clue; 16 liên hệ, không bổ sung nhãn tình nhân |
| `messages` | Sinh hoạt | 16 luồng SMS nạp tiền, giao hàng, bảo trì, quảng cáo, hoàn tiền, mẹ gọi lại |
| `ride-hailing` | Sinh hoạt | 20 hoạt động đi làm, về nhà, siêu thị, đồ ăn, hủy chuyến |
| `web-browser` | Sinh hoạt | 25 lịch sử đọc và 2 tab mở về nghề nghiệp, bóng đá, việc nhà |
| `photos` | Sinh hoạt | 16 ảnh gia đình, đồ ăn, công việc và đồ dùng; không ảnh phản chiếu hoặc album khóa |
| `personal-notes` | Sinh hoạt | 14 ghi chú việc nhà, về quê, sức khỏe, bảo dưỡng xe, việc ngày mai |
| `email` | Sinh hoạt | 25 thư có thân thư, gồm lương, internet, bản tin, tập trị liệu, hoàn tiền |
| `professional-network` | Sinh hoạt | 12 bài/cập nhật nghề nghiệp và trao đổi công khai |
| `team-collaboration` | Sinh hoạt | 12 mục trao đổi dự án, hành chính và hỗ trợ |

Các số trên là hợp đồng nội dung thiết kế; không khẳng định runtime đã hiển thị đủ ứng dụng. Không thêm app vào launcher hoặc mở rộng tính năng để đạt số lượng. `phone` và `messages` là hai app riêng; nếu cấu hình cũ còn `comms`, triển khai phải chuẩn hóa theo hợp đồng hiện hành, không tạo hai bản sao dữ liệu.

Tổng lịch sử mở rộng và nội dung bổ sung: [level-01-history.md](level-01-history.md). Zola có 265 tin trong 10 luồng chính; SMS có 104 tin. Các bản ghi không liên quan vụ án vẫn giữ vai trò sinh hoạt.

### 4.3. Thông báo Mồi nhử
- `toast_01`, nguồn `internet-messaging`, sau 4 giây.
- Tiêu đề: “Tin nhắn • Vừa xong”.
- Nội dung: `Anh Tuấn Thợ Điện: Áo anh em treo lên rồi, mai mang trả nhé.`
- Tin gốc trong luồng có giờ D 23:44. Điểm lạ là giờ nhắn và người gửi; thông báo không nêu tên Hương, loại quà, ngày kỷ niệm hoặc kết luận.

---

## 5. Ma trận Bằng chứng Pháp y Gián tiếp

### 5.1. Bảng Kê Khai Manh mối

Tra cứu [danh mục clue](../clues/clue-ideas-inventory.md) và [ma trận truy vết](../clues/clue-traceability-matrix.md). Không tái dùng ID của chuyển khoản tình cảm hoặc két tiết kiệm cho tình huống khác.

| Clue ID | App ID | Nguồn nội dung | Suy luận được phép | Giới hạn |
|---|---|---|---|---|
| `CLUE-ZOLA-07` | `internet-messaging` | `thread_tuan` D 16:42–19:25 và `thread_wife` D 18:55, 20:46 | Hoàng hẹn bàn 19h30 như tháng trước trong khi báo họp với cả nhóm | Chưa biết người liên hệ là ai, chưa đủ kết luận ngoại tình |
| `CLUE-BANK-06` | `banking` | `tx_01`, `tx_02` | Thanh toán Cơm Niêu Phố Cổ D 20:48 hỗ trợ cuộc hẹn tối; khoản hoàn tiền trưa đưa ra tên pháp lý Nguyễn Thị Thu Hương | Không suy số người từ số tiền; chia tiền trưa không tự là bằng chứng |
| `CLUE-POSH-05` | `ecommerce` | `order_01`, chi tiết giao nhận và `seller_satin` | Liên hệ giao nhận Nguyễn Thị Thu Hương, số `0988456234`; thiệp “15/09 — 15/10. Vẫn chỗ cũ nhé. H.” nối người nhận với lịch hẹn hàng tháng | Size S chỉ là thuộc tính sản phẩm, không suy vợ mặc size khác nếu không có dữ liệu |
| `CLUE-PHONE-01` | `phone` | `call_tuan_late` và số trong danh bạ | Cuộc gọi D 23:30, 96 giây; số đầy đủ trùng liên hệ giao nhận của đơn | Chỉ bổ trợ danh tính liên hệ ngụy trang; không suy từ đuôi tài khoản ngân hàng |

Tất cả bốn clue liên quan `suspect_huong` ở metadata tác giả. Tên liên hệ ngụy trang phải giữ nguyên trước khi người chơi tự đối chiếu; không đưa ánh xạ tác giả ra tiêu đề, biên lai hoặc thông báo. Đọc danh tính thật trong chi tiết đơn và tên tài khoản là dữ liệu đời thường, không phải nhãn kết tội.

### 5.2. Nghi phạm Vô tội & Chơi Đẹp

| Nghi phạm | Chi tiết dễ hiểu nhầm | Ngữ cảnh giải oan đọc được trước đối chất |
|---|---|---|
| Lan Anh | Nhờ chuyển tiền và chốt với bên hoa | Cùng luồng nêu sinh nhật Hùng, 5 người mỗi người 100.000đ; `tx_04` ứng 500.000đ, đơn hoa 350.000đ không đồng nghĩa toàn bộ quỹ đã chi hết |
| Thảo | Lịch tập riêng buổi tối | Tin nhắc phiếu đánh giá cột sống; gói tập trị liệu, không lời tán tỉnh |
| Ngọc | Hoàng chuyển tiền phòng và mua đèn | Luồng chat xưng anh trai, nhắc mẹ và lịch hai vợ chồng về quê |
| Mai | Giữ hộp nhỏ và túi dài ở sảnh | Giữ hai kiện cùng lúc: váy và hoa sinh nhật; nhắc ký sổ, không nhận quà làm của mình |

Các dữ liệu này không nhận Clue ID kết tội. Không cần gán một bẫy ngoại tình cho mọi nhân vật nữ.

### 5.3. Mã khóa
Không có câu đố mở khóa hoặc PIN trong Màn 1.

---

## 6. Lộ trình Phá án & Thứ tự Giác quan Thứ 6

### 6.1. Dòng Chảy Suy luận
1. Thông báo nhắc trả áo khiến người chơi mở luồng “Anh Tuấn Thợ Điện”. Luồng có cả trao đổi sửa file bình thường và lịch hẹn bàn 19h30 như tháng trước.
2. Đọc luồng Vợ thấy Hoàng báo còn ở công ty họp với cả nhóm lúc 18:55 và xác nhận vẫn ở phòng họp lúc 20:46. Chưa kết tội từ việc hẹn ăn hoặc lời khai riêng lẻ; thu thập cùng `CLUE-ZOLA-07`.
3. Trong lịch sử ngân hàng, tìm khoản thanh toán Cơm Niêu Phố Cổ 640.000đ lúc 20:48, chỉ hai phút sau lời khai vẫn ở phòng họp, hỗ trợ việc Hoàng có mặt tại bữa tối đã hẹn. Khoản hoàn 160.000đ bữa trưa trước đó là sinh hoạt bình thường nhưng cung cấp tên Nguyễn Thị Thu Hương. Thu `CLUE-BANK-06`.
4. Trong 8 đơn mua sắm, mở đơn váy `order_01`. Kiện giao về công ty đứng tên Hoàng, không tự ghi “quà cho Hương Marketing”. Chi tiết giao nhận phụ có tên pháp lý Nguyễn Thị Thu Hương, số `0988456234`. Chat người bán giữ nguyên yêu cầu thiệp “15/09 — 15/10. Vẫn chỗ cũ nhé. H.”, khớp mốc tháng trước và lịch hẹn. Chi tiết lấy đồ ở sảnh rồi mang hộp tới ghế nối việc chuẩn bị với cuộc gặp, không tự chứng minh hộp có gì. Thu `CLUE-POSH-05`.
5. Mở `phone`, đối chiếu số đầy đủ của “Anh Tuấn Thợ Điện” với liên hệ giao nhận và cuộc gọi đêm 96 giây. Thu `CLUE-PHONE-01` nếu muốn củng cố danh tính; không bắt buộc vòng qua `messages`.
6. Tổng hợp ba nguồn chính: lời khai che giấu cuộc hẹn, chi tiêu tối ở nhà hàng, thiệp riêng kỷ niệm một tháng cho đúng người nhận. Chọn `suspect_huong`, `cheating`; đủ ba nhóm manh mối chính cho kết quả 3 sao hiện hành. Cuộc gọi bổ trợ, không tự nâng một chi tiết yếu thành kết luận.

Không suy ngoại tình chỉ từ đồng nghiệp chia tiền, quần áo nữ hoặc gọi đêm. Người chơi có thể tự đi theo thứ tự khác; không khóa nội dung theo chuỗi.

### 6.2. Thứ tự Giác quan Thứ 6
1. `internet-messaging` — tìm mốc thời gian và đối chiếu lời khai.
2. `banking` — kiểm tra lịch sử theo giờ, đọc tên tài khoản.
3. `ecommerce` — đọc chi tiết đơn và trao đổi với người bán.

Gợi ý định hướng nguồn, không nói sẵn tên thủ phạm hoặc câu trả lời. Giữ mục tiêu dễ tiếp cận của Màn 1 bằng 0 khóa và ít phép nối, không bằng lời thú nhận trong thông báo.


### 6.3. Dòng thời gian câu chuyện — chỉ dành cho tác giả

| Thời điểm | Sự việc thật | Dấu vết người chơi có thể đọc | Mắt xích tiếp nối |
|---|---|---|---|
| 12/10 20:10–20:17 | Hoàng chuẩn bị quà cho dịp gặp lại ngày 15/10 | `order_01`, `seller_satin`: váy be S, thiệp có mốc 15/09–15/10 | Hai ngày giải thích câu “như tháng trước”; không phải mã khóa |
| D 11:35–11:42 | Quà và hoa sinh nhật cùng đến công ty | Hai đơn giao thành công; Mai báo hai kiện, Hoàng nhờ giữ | Mai là người giữ hàng, chưa phải người nhận quà |
| D 12:40 | Hương hoàn phần ăn trưa hôm trước | `tx_02`: tên pháp lý, nội dung hoàn phần trưa 14/10 | Cho biết một người thật trong sinh hoạt; không phải khoản thanh toán món quà |
| D 15:05–15:12 | Hoàng lấy hai kiện, báo sẽ mang đồ tới cuộc hẹn | Mai xác nhận lấy đủ; Hoàng nhắn “Anh lấy đồ ở sảnh rồi, tối mang theo.” | Nối việc giao hàng với đồ mang tối nay; chưa biết trong hộp là gì |
| D 16:42–16:45 | Hai người chốt bàn 19h30, vị trí quen | “Như tháng trước”, “bàn cạnh cửa sổ” | Nhận ra cuộc hẹn có tiền lệ, không chỉ một lần giúp đồng nghiệp |
| D 18:55 | Hoàng nói với vợ đang họp | Tin trong `thread_wife` | Lời khai cần kiểm chứng, không dùng làm kết luận tự đủ |
| D 19:22–19:25 | Hai người tìm nhau và ngồi cùng dịp | Cuộc gọi 26 giây; tin đã tới; “hộp anh để trên ghế cạnh áo” | Cuộc gọi sát tin đến nơi có ý nghĩa trong dòng thời gian; không giả lập biết nội dung cuộc gọi |
| D 20:46–20:48 | Hoàng tiếp tục nói họp trong khi có thanh toán nhà hàng | Tin “cả nhóm vẫn ở phòng họp”; `tx_01` tại Cơm Niêu Phố Cổ | Mâu thuẫn thời gian hỗ trợ việc cuộc hẹn đã diễn ra; không suy vị trí GPS hoặc số người từ biên lai |
| D 23:30–23:44 | Liên hệ vẫn tiếp diễn; Hương đang giữ áo Hoàng quên | Cuộc gọi 96 giây; “Áo anh em treo lên rồi, mai mang trả nhé.” | Chiếc áo ở ghế trở lại trong thông báo, khiến người chơi có lý do đọc ngược luồng |

Không thêm cảnh vợ biết trước chiếc váy, ảnh hẹn hò, cuộc gọi có nội dung nghe được hoặc lời thú nhận vào dữ liệu điều tra. Những gì không có dấu vết vẫn chỉ thuộc sự thật dành cho tác giả.

### 6.4. Cách người chơi nối về một người

**Chuỗi nhận diện có thể kiểm chứng**:

`Anh Tuấn Thợ Điện` → số đầy đủ `0988456234` → liên hệ giao nhận phụ trong `order_01` → `Nguyễn Thị Thu Hương` → tên tài khoản `Nguyen Thi Thu Huong` trong `tx_02` → nghi phạm Hương.

- Số đầy đủ là phép nối danh tính chắc chắn. Dạng tên có dấu/không dấu là cùng tên pháp lý, không phải câu đố dấu tiếng Việt. Không dùng chữ H trên thiệp để chọn Hương: H cũng có thể là Hoàng, không đủ duy nhất.
- Họ tên của `suspect_huong` trong hồ sơ nghi phạm phải gồm Nguyễn Thị Thu Hương và vai trò Marketing như thông tin hồ sơ thông thường. Không tự đổi tên liên hệ ngụy trang hoặc báo “đã tìm thấy thủ phạm” khi người chơi đọc số điện thoại.
- “Hộp” và “áo” là hai chi tiết liên tục của cùng buổi gặp, chỉ gợi hướng kiểm tra. Chúng không độc nhất ngoài đời và không đủ nhận diện một người nếu thiếu số điện thoại/tên pháp lý.
- Ngày trên thiệp khớp cách nói “như tháng trước”; lịch hẹn khớp giờ gọi và thanh toán. Đây là chứng cứ về cùng chuỗi sự việc, không phải yêu cầu mọi ứng dụng lặp cùng một câu mật hiệu.
- **Đi xuôi**: lịch hẹn → thanh toán cùng tối → đơn hàng và người nhận. **Đi ngược**: tin trả áo → chiếc ghế ở bữa tối → hộp mang từ sảnh → chi tiết đơn. Cả hai đường đều cần đối chiếu danh tính, không tự mở đáp án.
- Chỉ khi danh tính, sự chuẩn bị riêng, cuộc hẹn lặp và lời khai che giấu khớp nhau mới hình thành kết luận đầy đủ. Không dùng một thẻ hợp lệ để diễn giải như đã chứng minh toàn bộ câu chuyện.

---

## 7. Bàn giao Kỹ thuật cho Lead Dev Agent

### 7.1. File Cấu hình Đích
`src/data/cases/hoang/level_01.json`. Lần sửa của `level-designer` chỉ cập nhật hồ sơ và danh mục; chưa hiện thực hóa JSON hoặc giao diện.

### 7.2. Hợp đồng Nội dung
- Triển khai toàn bộ [bộ dữ liệu điện thoại](level-01-phone-data.md), không chỉ bốn hàng clue. Bảo toàn năm `suspect_*` tại mục 2, `verdict`, giới hạn 5 lượt và 0 khóa.
- Giữ các ID luồng, đơn và giao dịch nêu trong bộ dữ liệu khi phù hợp hợp đồng hiện hành. Các ID clue mới thay tham chiếu cũ trong riêng Màn 1; không đổi ý nghĩa clue đã dùng ở màn khác. Kiểm tra tham chiếu trong dữ liệu và cấu hình tính điểm khi hiện thực hóa.
- Thay hoàn toàn nội dung cũ về catalogue, quỹ bí mật 5 triệu, tin chuyển 2.000đ dặn ngủ sớm, số tài khoản trùng đuôi điện thoại và suy luận size vợ. Không giữ bản cũ ở preview, thông báo, thẻ bằng chứng hoặc roast.
- Dữ liệu sinh hoạt không mang `clueRefId` kết tội và không bị tô màu theo vai trò tác giả. Nhấn giữ 380ms vẫn dùng `StoryEvidenceTarget` và `UniversalEvidenceModal` cho dữ liệu truyện; không mở rộng sang chrome hoặc tạo nút Ghim thường trực.
- Tái sử dụng màn hình và trường dữ liệu đã có. Nội dung cần trường chưa được hỗ trợ phải báo khoảng trống hợp đồng, không tự thêm giao diện trong lượt thiết kế. `phone` chỉ điều tra, `messages` chỉ đọc; không gửi tin hoặc thực hiện cuộc gọi.

### 7.3. Tiêu chí Nghiệm thu
1. Kiểm tra đặc tả và cả hai danh mục bằng `sync_clues.py verify-spec` và `sync_clues.py validate --file`.
2. Từng ứng dụng có đủ bản ghi và nội dung chi tiết theo bộ dữ liệu; tỷ lệ sinh hoạt tối thiểu 75% trên từng danh sách có clue.
3. Các bản ghi chính thống nhất ngày, giờ, số điện thoại đầy đủ, tên pháp lý và tiền thanh toán; diễn biến khớp mục 6.3. Một clue nhiều vị trí chỉ tính một lần. Chiếc áo phải xuất hiện trước tin trả áo, việc lấy đồ phải sau giờ giao hàng.
4. Người chơi nhìn thấy dữ liệu giải oan trước đối chất; có thể giải qua ba ứng dụng chính, không phụ thuộc ảnh chưa tạo hoặc tính năng khóa.
5. Khi triển khai, kiểm tra hiển thị thực tế, lối mở chat người bán, chi tiết giao nhận và cách gắn thẻ. Kiểm tra script không thay thế đọc duyệt nội dung hoặc chơi thử độ khó.
