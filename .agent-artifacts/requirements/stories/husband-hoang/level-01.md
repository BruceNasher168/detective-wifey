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
- **Hành vi Khả nghi Kích hoạt Cơn Ghen**: Đúng 23:45 đêm, khi Hoàng vờ ngáy ngủ say sưa trên giường, màn hình điện thoại chợt sáng đèn với một thông báo tin nhắn từ danh bạ "Anh Tuấn Thợ Điện" nhắc về việc gửi catalogue sự kiện qua mail và dặn mai ăn trưa xem luôn kèm icon nháy mắt 😉. Chi tiết bất thường này giục giã người vợ phải lén mở khóa máy kiểm tra.

### 1.2. Chất liệu Trào phúng & Drama Gia đình Việt
- **Nguồn Cảm hứng**: Các tình huống kinh điển trên diễn đàn *Tâm sự Eva*, hội nhóm *Vén khéo*, và đời sống công sở IT Việt Nam:
  1. Chiêu trò lưu số người tình dưới danh bạ "Anh Tuấn Thợ Điện": Mượn danh xưng thợ kỹ thuật để che giấu các cuộc gọi đêm muộn và tin nhắn hẹn hò. Tuyệt đối không dùng những lời thoại lộ liễu hay cảm ơn quà cáp thô thiển; vỏ bọc công việc chỉ bị bóc trần khi đối chiếu chéo với lịch sử ăn trưa và phòng ban marketing.
  2. Mua quà tặng giao về địa chỉ cơ quan: Đặt váy lụa thiết kế trên ứng dụng mua sắm (`ecommerce`) rồi ghi địa chỉ nhận là "Tầng 4 tòa nhà Technosoft - Phòng Marketing (chuyển bạn Hương)" để không bao giờ bị phát hiện ở nhà.
  3. Lộ tẩy danh tính thật qua lịch sử sao kê ngân hàng (`banking`) và số điện thoại liên kết Napas: Chồng tưởng giấu kỹ nhưng lại sơ hở ở các giao dịch chia tiền ăn trưa công sở ("Campuchia tiền cơm niêu") và chuyển khoản 2.000đ dặn dò ngủ sớm.
  4. Mạng lưới nghi phạm phong phú với các bẫy tâm lý đời thường: Quỹ đen phòng mua quà cho sếp già, lịch tập vật lý trị liệu thoát vị đĩa đệm cột sống, và tiền chu cấp trọ học cho em gái ruột ở quê.

---

## 2. Danh sách Nghi phạm & Vỏ bọc Ngụy trang

| Suspect ID | Tên Hiển thị | Thân phận Thật / Nghề nghiệp | App Phát hiện Đầu tiên | Vỏ bọc Danh bạ / Biệt danh | Vai trò Cốt truyện |
|---|---|---|---|---|---|
| `suspect_huong` | Hương Marketing | Chuyên viên Marketing cùng công ty Technosoft | `internet-messaging` | "Anh Tuấn Thợ Điện" | **Kẻ chủ mưu thực sự (Culprit)** |
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
- **Chiến thắng Bắt ghen (`narrativeRoast`)**:
  > *"Chồng bạn đã ngụy trang nữ đồng nghiệp Hương Marketing thành 'Anh Tuấn Thợ Điện', lén lút ăn trưa cơm niêu hai người, tặng set váy lụa size S lên thẳng phòng Marketing và dặn dò ngủ sớm qua tin nhắn chuyển khoản!"*
- **Ghen Tuông Mù Quáng — Bẫy Twist Lan Anh Kế Toán (`overJealousRoast`)**:
  > *"Bạn đã ghen tuông mù quáng cáo buộc oan Lan Anh Kế Toán! Cô ấy chỉ đang cùng chồng bạn lén lập quỹ đen cả phòng mua quà sinh nhật cho sếp thôi. Giờ thì cả phòng công ty chồng đều biết bạn là bà vợ ghen tuông số một!"*
- **Ghen Tuông Mù Quáng — Cáo buộc nhầm Thảo PT Gym**:
  > *"Bạn đã ghen tuông mù quáng với cô HLV thể hình! Chồng bạn bị thoái hóa cột sống lưng vì ngồi code suốt ngày, lén đi tập trị liệu phục hồi chức năng mà bạn cũng tưởng đi hẹn hò!"*
- **Ghen Tuông Mù Quáng — Cáo buộc nhầm Bé Ngọc Sinh Viên**:
  > *"Bạn đã ghen tuông mù quáng với chính em gái ruột của chồng! Bé Ngọc xin anh trai tiền đóng tiền trọ học đại học mà bạn cũng quy chụp là tiểu tam!"*
- **Ghen Tuông Mù Quáng — Cáo buộc nhầm Mai Lễ Tân**:
  > *"Bạn đã nghi ngờ nhầm Mai Lễ Tân vô tội! Cô ấy chỉ là lễ tân nhận bưu phẩm hộ nhân viên toàn tòa nhà thôi."*
- **Bị Giật Lại Máy (Hết 5 lượt nghi ngờ)**:
  > *"Bị giật lại máy! Hoàng giật phắt điện thoại khỏi tay bạn: 'Nửa đêm không ngủ còn mò mẫm máy anh làm gì? Em bị ảo tưởng mấy clip bắt ghen trên mạng vừa thôi nhé!' "*

### 3.3. Thang Ngụy biện Khi Đối chất Sớm ("Chối bay chối biến")
| Số lượng Thẻ Bằng chứng | Thái độ Người Chồng | Lời Thoại Ngụy biện Điển hình | Kết quả |
|---|---|---|---|
| **0 Thẻ (Cáo buộc non)** | Hùng hổ, gạt phăng | *"Em lại lướt TikTok xem mấy cái clip drama bắt ghen xàm xí rồi đa nghi đúng không? Đưa máy đây anh đi ngủ mai còn đi làm!"* | Thất bại (0 Sao) |
| **1 Thẻ (Mới có 1 tin nhắn)** | Hơi giật mình, phân bua | *"Ơ kìa em, số thợ điện đấy thật mà, hôm trước anh gọi nhờ sửa cái đường dây mạng ở văn phòng thôi chứ có gì đâu!"* | Chiến thắng 1 Sao (Thắng non) |
| **2 Thẻ (Đã thấy đơn hàng mua sắm)** | Toát mồ hôi, bao biện | *"À... cái đơn hàng đó là con bé phòng Marketing nó nhờ anh đặt hộ qua tài khoản mua sắm để áp mã Freeship Extra thôi mà, anh biết gì đâu!"* | Chiến thắng 2 Sao (Khá thuyết phục) |
| **3 Thẻ (Đủ tam giác bằng chứng)** | Cúi đầu nhận tội | *"Anh xin lỗi vợ... Anh thề là mới chỉ đi ăn trưa với nhắn tin trêu đùa chứ chưa làm gì quá giới hạn cả, em tha cho anh lần này!"* | Chiến thắng Tuyệt đối 3 Sao |

---

## 4. Cấu hình Ứng dụng & Mồi nhử Thông báo (Zero-Spoiler Hook)

### 4.1. Phân cấp Độ khó
- **Phân bậc Màn chơi**: Màn 1 (Khởi động / Nhận diện)
- **Số lượt nghi ngờ tối đa (`allowedStrikes`)**: **5 strikes**
- **Số app có manh mối**: 4 apps (`internet-messaging`, `banking`, `ecommerce`, `comms`)
- **Số câu đố mã khóa (`lockChallenges`)**: 0 locks

### 4.2. Bảng Phân bổ Trạng thái Ứng dụng
*Sử dụng danh mục tên ứng dụng chuẩn đã định nghĩa tại `.agent-artifacts/project-knowledge-base/solution-context/apps/`.*

| App ID | Tên Ứng dụng | Trạng thái | Nhiệm vụ Pháp y Trong Màn |
|---|---|---|---|
| `internet-messaging` | internet-messaging (Tin nhắn) | **Active** | Hội thoại công việc ngầm từ "Anh Tuấn Thợ Điện" + Bẫy quỹ phòng Lan Anh Kế Toán + Bẫy lịch tập Thảo PT + 3 luồng chat đời thường (Dev team, Bạn thân, Mẹ quê) |
| `ecommerce` | ecommerce (Mua sắm) | **Active** | Đơn hàng váy lụa satin Màu Be Size S giao về Tầng 4 phòng Marketing cho "Hương nhận" (Vợ mặc size L) + Đơn lẵng hoa sáp công đoàn + Đơn đèn học sinh viên |
| `banking` | banking (Ngân hàng) | **Active** | Lịch sử nhận 160k tiền cơm niêu từ "Nguyen Thi Thu Huong - Marketing" + chuyển 2.000đ lúc 23:20 dặn ngủ sớm + chuyển 5tr quỹ phòng Lan Anh + chuyển 2.5tr tiền trọ bé Ngọc |
| `comms` | comms (Điện thoại & SMS) | **Active** | Nhật ký cuộc gọi đi lúc 23:30 (12 phút) tới "Anh Tuấn Thợ Điện", số điện thoại Napas trùng đuôi 234 |
| `ride-hailing` | ride-hailing (Đặt xe) | Benign Filler | Lịch sử cuốc xe đi từ nhà đến công ty Technosoft |
| `web-browser` | web-browser (Trình duyệt) | Benign Filler | Lịch sử tra cứu tài liệu lập trình React 19 và tin tức bóng đá Ngoại Hạng Anh |
| `photos` | photos (Thư viện ảnh) | Benign Filler | Ảnh chụp mâm cơm gia đình, ảnh chụp màn hình code fix bug |
| `personal-notes` | personal-notes (Ghi chú) | Benign Filler | Ghi chú lịch bảo dưỡng xe máy, danh sách đồ dùng gia đình cần mua |
| `email` | email (Hộp thư) | Benign Filler | Thư rác, thông báo bản tin công nghệ Tech Weekly |
| `professional-network` | professional-network (Mạng việc làm) | Benign Filler | Bài đăng tuyển dụng Tech Lead, kết nối đồng nghiệp |
| `team-collaboration` | team-collaboration (Trao đổi nhóm) | Benign Filler | Kênh thảo luận dự án công ty Technosoft |

### 4.3. Thông số Thiết bị & Thông báo Mồi nhử
- **Đồng hồ Cốt truyện**: `23:45`
- **Thời lượng Pin**: `42%`
- **Nhà mạng**: `5G`
- **Màu Chủ đề PWA**: `#0f172a`

**Thông báo Đẩy Khởi phát (Tuyệt đối không spoil):**
- **Toast ID**: `toast_01`
- **Ứng dụng Nguồn**: `internet-messaging`
- **Tiêu đề Người gửi**: `Tin nhắn • Vừa xong`
- **Nội dung Rút gọn**: `Anh Tuấn Thợ Điện: "File catalogue sự kiện em gửi qua mail rồi sếp nhé, mai ăn trưa xem luôn cũng được 😉"`
- **Thời gian Trì hoãn**: 4 giây sau khi vào màn hình chính
*(Giải thích tính gián tiếp: Thông báo 100% là ngôn từ công việc văn phòng, không hề nhắc đến quà cáp, váy vóc hay sảnh lễ tân. Điểm kích thích sự tò mò là: Tại sao danh bạ lưu là 'Anh Tuấn Thợ Điện' mà lại gửi catalogue sự kiện Marketing và rủ ăn trưa với icon nháy mắt 😉 vào lúc nửa đêm 23:44).*

---

## 5. Ma trận Bằng chứng Pháp y Gián tiếp (Tam giác Suy luận)

### 5.1. Bảng Kê Khai Manh mối Pháp y
*Tất cả Clue IDs bắt buộc phải tồn tại trong danh mục SSOT [clue-ideas-inventory.md](../../requirements/stories/clues/clue-ideas-inventory.md).*

| Clue ID | App ID | Màn hình / Component | Vai trò Manh mối | Nội dung Pháp y Gián tiếp (Tuyệt đối không lộ liễu, không spoil) | Nghi phạm Liên đới |
|---|---|---|---|---|---|
| `CLUE-ZOLA-01` | `internet-messaging` | `InternetMessagingThreadView` | **Hành vi Khả nghi** | Thoại công việc ngầm: "Anh Tuấn Thợ Điện" nhắc gửi catalogue sự kiện Marketing, nhắc lại bữa ăn trưa Cơm Niêu Phố Cổ và bảo mai bao lại cafe, dặn sếp ngủ sớm | `suspect_huong` |
| `CLUE-POSH-02` | `ecommerce` | `EcommerceOrderDetailDrawer` | **Vật thể Đối chiếu** | Đơn hàng "Set váy lụa satin công sở cao cấp - Màu Be, Size S" giao về *"Tầng 4 tòa nhà Technosoft - Phòng Marketing (chuyển bạn Hương)"* (Vợ mặc size L) | `suspect_huong` |
| `CLUE-BANK-01` | `banking` | `BankingHistoryView` | **Smoking Gun Danh tính** | Giao dịch quẹt thẻ Cơm Niêu Phố Cổ 320k + nhận lại 160k từ "Nguyen Thi Thu Huong" memo *"Huong Marketing gui tien com nieu"* + chuyển 2.000đ lúc 23:20 dặn ngủ sớm | `suspect_huong` |
| `CLUE-PHONE-01` | `phone` | `PhoneRecentsView` | Manh mối Bổ trợ | Cuộc gọi đi lúc 23:30 kéo dài 12 phút tới số máy "Anh Tuấn Thợ Điện" (`0988.456.234`), trùng khớp 100% với đuôi số điện thoại tài khoản Napas của Hương | `suspect_huong` |
| `CLUE-ZOLA-05` | `internet-messaging` | `InternetMessagingThreadView` | **Bẫy Nghi ngờ Twist** | Tin nhắn bí mật với Lan Anh Kế Toán về "quỹ bí mật gom được 10 củ" và "giấu vợ kỹ lắm", khiến vợ lầm tưởng Lan Anh là người tình | `suspect_lan_anh` |
| `CLUE-BANK-04` | `banking` | `BankingHistoryView` | **Bẫy Dòng tiền Twist** | Giao dịch chuyển 5.000.000 đ cho "Nguyen Lan Anh" với lời nhắn *"Gop tien quy bi mat thang 10"* (thực chất là quỹ phòng mua quà sinh nhật cho sếp) | `suspect_lan_anh` |

### 5.2. Thử thách Mã khóa & Câu đố
*(Màn 1 không có mã khóa)*

---

## 6. Lộ trình Phá án & Thứ tự Giác quan Thứ 6

### 6.1. Dòng Chảy Suy luận của Người Chơi (Tam giác Suy luận & Cú Twist)
1. **Bước 1 — Điểm Bất thường Ban đầu (Giây thứ 4)**: 
   - Thông báo đẩy xuất hiện từ `internet-messaging`: *"Anh Tuấn Thợ Điện: File catalogue sự kiện em gửi qua mail rồi sếp nhé, mai ăn trưa xem luôn cũng được 😉"*.
   - Người vợ nảy sinh nghi ngờ: Thợ điện tại sao lại phụ trách catalogue sự kiện Marketing và hẹn chồng mình ăn trưa vào lúc nửa đêm?
2. **Bước 2 — Khám phá Luồng Chat & Phân tích Mạng lưới Nghi phạm (internet-messaging)**:
   - Người chơi mở `internet-messaging`. Ứng dụng hiện ra các luồng chat chân thực và mạng lưới nghi phạm:
     - Group `Team Dev Technosoft`: Anh em chém gió bug sprint production, sếp Hùng giục nộp báo cáo.
     - Chat `Tuấn Đụt (Bạn thân C3)`: Rủ đi đá bóng sân Chùa Láng và uống bia hơi cuối tuần, trêu Hoàng sợ vợ.
     - Chat `Mẹ Ở Quê`: Dặn dò đã gửi gà đồi với bưởi Diễn lên cho hai vợ chồng.
     - Chat `Thảo PT California`: Nhắc lịch tập kèm riêng 1:1 phục hồi chức năng cột sống lúc 20h30.
     - **Bẫy Nghi ngờ Lan Anh Kế Toán**: Lan Anh nhắn tin thúc giục: *"Anh Hoàng ơi quỹ bí mật gom được 10 củ rồi, chỉ 2 anh em mình biết thôi đấy, lộ ra là toang cả lũ!"*. Hoàng rep: *"Yên tâm anh giấu vợ kỹ lắm, đợi bả ngủ say mới dám nhắn cho em"*.
     - **Hội thoại với "Anh Tuấn Thợ Điện"**:
       - Tuấn Thợ Điện: *"File catalogue sự kiện phòng Marketing tuần sau em gửi qua mail rồi sếp nhé. Mai sếp xem sớm giúp em."*
       - Hoàng: *"Ok em, để mai lên công ty anh xem. Trưa mai 12h15 qua quán Cơm Niêu Phố Cổ ăn trưa nhé."*
       - Tuấn Thợ Điện: *"Dạ vâng, trưa nay ăn sếp bao rồi, mai để em bao lại sếp cốc cafe nhé 😉"*
       - Hoàng: *"Khách sáo thế. Thôi ngủ đi, vợ đang nằm cạnh."*
       - Tuấn Thợ Điện: *"Dạ sếp ngủ sớm đi mai còn đi làm."*
   - Người chơi nhận diện: "Anh Tuấn Thợ Điện" thực chất là người phụ trách Marketing cùng cơ quan! Hai người vừa đi ăn trưa Cơm Niêu Phố Cổ cùng nhau và trưa mai lại hẹn gặp tiếp. Ghim thẻ `CLUE-ZOLA-01`.
   *(Nếu người chơi nóng vội nghi ngờ Lan Anh Kế Toán hoặc Thảo PT Gym rồi đối chất ngay $\to$ Dính bẫy Over-Jealous Roast!)*
3. **Bước 3 — Lần theo Dấu vết Bữa Ăn Trưa & Bóc trần Danh tính (banking)**:
   - Lần theo chi tiết "Cơm Niêu Phố Cổ" và "trưa nay ăn sếp bao rồi", người chơi mở `banking` kiểm tra lịch sử biến động số dư:
     - Giao dịch 1 (12:45 trưa nay): Quẹt thẻ thanh toán `-320.000 đ` tại "Cơm Niêu Phố Cổ" (đúng 2 suất cơm niêu).
     - Giao dịch 2 (13:05 trưa nay): Nhận `+160.000 đ` (đúng một nửa tiền ăn) từ **"Nguyen Thi Thu Huong"**, lời nhắn: *"Huong Marketing gui tien com nieu"*.
     - Giao dịch 3 (23:20 đêm nay - 25 phút trước): Chuyển đi `-2.000 đ` cho "Nguyen Thi Thu Huong", số tài khoản Napas `0988***234`, lời nhắn: *"Ngu som di mai anh don di lam"*.
   - Khẳng định 100%: "Nguyen Thi Thu Huong" phòng Marketing chính là người núp bóng danh bạ "Anh Tuấn Thợ Điện"! Ghim thẻ `CLUE-BANK-01`.
4. **Bước 4 — Mảnh ghép Vật thể Quà tặng & Số điện thoại (ecommerce & phone)**:
   - Người chơi vào `ecommerce` kiểm tra xem Hoàng có mua quà tặng riêng cho Hương Marketing không:
     - Đơn hàng 1 (Giao trưa nay 11:45): "Set váy lụa satin công sở cao cấp thắt eo - Màu Be, Size S". Địa chỉ: *"Tầng 4 toà nhà Technosoft - Phòng Marketing (chuyển bạn Hương)"*. Người vợ mặc **Size L**, chứng tỏ đây là quà tặng bồ nhí! Ghim thẻ `CLUE-POSH-02`.
     - Đơn hàng 2: "Đèn học chống cận thị sinh viên" gửi về Ký túc xá Cầu Giấy (quà mua cho Bé Ngọc em gái).
     - Đơn hàng 3: "Lẵng hoa sáp chúc mừng sinh nhật" (quà công đoàn do Lan Anh phụ trách).
   - Người chơi mở `phone` kiểm tra nhật ký cuộc gọi:
     - Cuộc gọi đi lúc 23:30 (12 phút) tới danh bạ "Anh Tuấn Thợ Điện". Số điện thoại hiển thị là `0988.456.234`, trùng khớp hoàn toàn với đuôi số Napas của "Nguyen Thi Thu Huong"! Ghim thẻ `CLUE-PHONE-01`.
5. **Bước 5 — Đối chất Đanh thép**:
   - Người chơi mở bảng "Đối chất", chọn đúng nghi phạm `suspect_huong`, chọn kết luận `cheating`, đính kèm 3-4 thẻ bằng chứng đã thu thập (`CLUE-ZOLA-01`, `CLUE-POSH-02`, `CLUE-BANK-01`, `CLUE-PHONE-01`).
   - Hoàng cúi đầu nhận tội. Người chơi giành chiến thắng 3 sao tuyệt đối!

### 6.2. Thứ tự Rọi sáng của "Giác Quan Thứ 6"
1. `internet-messaging` (Mồi nhử hành vi ban đầu & bữa trưa cơm niêu)
2. `banking` (Xác thực danh tính thật qua giao dịch chia tiền ăn & số Napas)
3. `ecommerce` (Vật thể đối chiếu váy lụa size S gửi phòng Marketing)

---

## 7. Bàn giao Kỹ thuật cho Lead Dev Agent

### 7.1. File Cấu hình Đích
`src/data/cases/hoang/level_01.json`

### 7.2. Yêu cầu Cấu trúc Mock Data
- **`suspectPool`**: Chứa đủ 5 nghi phạm:
  - `suspect_huong`: "Hương Marketing" (Culprit)
  - `suspect_lan_anh`: "Lan Anh Kế Toán" (Red Herring 1)
  - `suspect_thao`: "Thảo PT California" (Red Herring 2)
  - `suspect_ngoc`: "Bé Ngọc KTX" (Red Herring 3)
  - `suspect_mai`: "Mai Lễ Tân" (Red Herring 4)
- **`appsData["internet-messaging"]`**:
  - `thread_tuan`: Contact "Anh Tuấn Thợ Điện" (`suspect_huong`), hội thoại tinh tế về catalogue marketing, bữa trưa Cơm Niêu Phố Cổ, dặn sếp ngủ sớm. Tuyệt đối KHÔNG có thoại lộ liễu hay cảm ơn quà tặng thô thiển.
  - `thread_lan_anh`: Contact "Lan Anh Kế Toán" (`suspect_lan_anh`), mồi nhử quỹ phòng 10 củ.
  - `thread_thao`: Contact "Thảo PT California" (`suspect_thao`), nhắc lịch tập vật lý trị liệu 1:1 lúc 20h30.
  - `thread_dev`: Group "Team Dev Technosoft (4)", trao đổi công việc, fix bug giỏ hàng.
  - `thread_friend`: Contact "Tuấn Đụt (Bạn thân C3)", rủ đá bóng sân Chùa Láng, trêu Hoàng sợ vợ.
  - `thread_family`: Contact "Mẹ Ở Quê", hỏi thăm sức khỏe, thông báo gửi gà đồi và bưởi Diễn.
- **`appsData["ecommerce"]`**:
  - `order_01`: "Set váy lụa satin công sở cao cấp thắt eo - Màu Be, Size S", người nhận: "Tầng 4 toà nhà Technosoft - Phòng Marketing (chuyển bạn Hương)".
  - `order_02`: "Đèn học chống cận thị sinh viên" gửi KTX Cầu Giấy (quà cho Bé Ngọc).
  - `order_03`: "Lẵng hoa sáp chúc mừng sinh nhật" (quà công đoàn).
  - `order_04`: "Bàn phím cơ không dây switch brown" (đồ công nghệ của Hoàng).
- **`appsData["banking"]`**:
  - `tx_01`: Chi `-320.000 đ` tại "Cơm Niêu Phố Cổ - 2 Suat".
  - `tx_02`: Nhận `+160.000 đ` từ "Nguyen Thi Thu Huong", memo "Huong Marketing gui tien com nieu".
  - `tx_03`: Chi `-2.000 đ` tới "Nguyen Thi Thu Huong" (Napas `0988***234`), memo "Ngu som di mai anh don di lam".
  - `tx_04`: Chi `-5.000.000 đ` tới "Nguyen Lan Anh", memo "Gop tien quy bi mat thang 10".
  - `tx_05`: Chi `-2.500.000 đ` tới "Nguyen Bao Ngoc", memo "Tien nha tro thang 10 cho be Ngoc".
  - `tx_06`: Chi `-1.500.000 đ` tới "California Fitness", memo "Thao PT - buoi tap rieng tri lieu".
  - `tx_07`: Nhận `+35.000.000 đ` từ "Cong Ty CP Cong Nghe Technosoft", memo "Luong thang 10 Nguyen Huy Hoang".
- **`appsData["comms"]`**:
  - Cuộc gọi đi lúc 23:30 (12 phút) tới "Anh Tuấn Thợ Điện" (`0988.456.234`).
  - Cuộc gọi đến lúc 18:00 (1 phút) từ "Vợ Yêu".
  - Cuộc gọi nhỡ lúc 17:30 từ "Lan Anh Kế Toán".
  - Cuộc gọi nhỡ lúc 11:40 (30 giây) từ "Mai Lễ Tân (Bàn Lễ Tân)".

### 7.3. Tiêu chí Nghiệm thu Pháp y
1. Chạy xác thực đặc tả kịch bản:
   ```bash
   python .agents/skills/level-designer/scripts/sync_clues.py verify-spec ".agent-artifacts/requirements/stories/husband-hoang/level-01.md"
   ```
2. Đảm bảo toàn bộ Clue IDs tồn tại trong danh mục và script báo PASS toàn bộ các bài kiểm tra bảo vệ chống lộ liễu (Anti-Obviousness Guard).
