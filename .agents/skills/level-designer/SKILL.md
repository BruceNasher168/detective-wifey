---
name: level-designer
description: "Design story-first game levels: establish relationship events, causal timelines and everyday activity before mapping subtle traces to existing virtual apps. Use when: authoring new level story design specs under requirements/stories/, creating husband cheating scenarios, adding or updating clues in clue inventories, structuring deduction paths for the developer agent, or generating persona-matched avatars and Shopoo chat/order/product images after a level story is approved."
---

# Level Designer

- Thiết kế các màn chơi game phá án, xây dựng các kịch bản bắt ghen trào phúng mang đậm bản sắc văn hóa mạng xã hội Việt Nam (*Tâm sự Eva*, *Vén khéo*, *quỹ đen*).
- **Phương pháp thiết kế**: Tuân theo [truyện trước ứng dụng](references/story-first-design.md); quy tắc độ khó và bằng chứng thuộc tài liệu thiết kế bên dưới.
- Quản trị vòng đời manh mối 2 chiều: tái sử dụng danh mục manh mối có sẵn hoặc tạo mới manh mối gián tiếp, tự động đồng bộ vào danh mục SSOT (`stories/clues/`).
- Sản xuất bộ hồ sơ đặc tả cốt truyện chuẩn hóa gồm **đúng 2 files** tại `.agent-artifacts/requirements/stories/husband-<name>/`:
  1. `level-XX.md`: Căn cứ thiết kế pháp y duy nhất (SSOT) chứa logic vụ án, sơ đồ Mermaid, bảng Nodes & Edges (Scope 1C) và hợp đồng bàn giao.
  2. `level-XX-phone-data.md`: Kịch bản chi tiết lời thoại, tin nhắn chat và bản ghi trong máy (giới hạn thời gian D-Day $\pm$ 2–3 ngày, $\ge 75\%$ sinh hoạt/bẫy giải oan).
  *(Tuyệt đối KHÔNG tạo file `level-XX-history.md` — dữ liệu nền quá khứ sâu thuộc trách nhiệm của shared fixtures phía lập trình).*

> [!NOTE]
> **SSOT for Skill Triggers**: The frontmatter `description` above is the **Single Source of Truth** for when to activate this skill. Do NOT repeat a redundant `## When to Use` section in the body. Agents that mount this skill define dispatch conditions in their own `.agent.md` file.

---

## References

Đọc phương pháp truyện trước ứng dụng trước khi thiết kế; tra các tài liệu còn lại khi cần:
- **Phương pháp bắt buộc**: [references/story-first-design.md](references/story-first-design.md).
- **Quy tắc Thiết kế Manh mối Gián tiếp & Cốt truyện Việt Nam**: [references/level-design-rules.md](references/level-design-rules.md) — Tam giác bằng chứng gián tiếp, phân bậc độ khó, luật cấm lộ liễu, và thang ngụy biện "chối bay chối biến".
- **Hồ sơ Đặc tả Cốt truyện Chuẩn (Blueprint)**: [references/story-spec-template.md](references/story-spec-template.md) — Khung mẫu hoàn chỉnh cho tài liệu `level-XX.md`.
- **Danh mục Manh mối SSOT**: [clue-ideas-inventory.md](../../../.agent-artifacts/requirements/stories/clues/clue-ideas-inventory.md) — Hơn 30 ý tưởng manh mối trào phúng Việt Nam.
- **Ma trận Khả năng Truy vết (Traceability Matrix)**: [clue-traceability-matrix.md](../../../.agent-artifacts/requirements/stories/clues/clue-traceability-matrix.md) — Liên kết manh mối với màn chơi và tính năng ứng dụng.
- **Kiến trúc Hệ thống (SAD)**: [apps-features-architecture.md](../../../.agent-artifacts/project-knowledge-base/solution-context/architecture/apps-features-architecture.md) — Hệ sinh thái ứng dụng giả lập hiện hành.
- **Bề mặt ảnh Shopoo**: [app-design.md](../../../.agent-artifacts/project-knowledge-base/solution-context/apps/ecommerce/app-design.md) và [features.md](../../../.agent-artifacts/project-knowledge-base/solution-context/apps/ecommerce/features.md) — Xác nhận vị trí ảnh sản phẩm, thẻ sản phẩm trong chat và nội dung đơn hàng trước khi tạo asset.

---

## Prerequisites & Inputs

> [!IMPORTANT]
> **Nguyên tắc "Infer First, Ask with Options"**: Nếu hồ sơ người chồng, đề tài kịch bản hoặc độ khó màn chơi chưa rõ ràng, DỪNG LẠI và hỏi người dùng bằng `ask_question` với phương án đề xuất và các lựa chọn cụ thể (2–4 câu/lần). Không bao giờ tự suy diễn kịch bản nếu thiếu dữ kiện định hướng.

Cần chuẩn bị trước khi thiết kế:
- **Hồ sơ & Persona Người Chồng**: Mã định danh (ví dụ: `hoang`), quy chuẩn thư mục kịch bản tương ứng là `husband-<name>` (ví dụ: `husband-hoang`), tên, nghề nghiệp, nhóm tuổi/thế hệ (`generationTag`: Gen Z / Millennial / Gen X), khẩu khí chat (`chatTone`: từ lóng, teencode, văn phong), và thói quen ứng dụng (`lifestyleHabits`).
- **Số thứ tự Màn chơi**: 1, 2, hoặc 3.
- **Chủ đề Kịch bản Việt Nam**: Ý tưởng bắt ghen (ví dụ: lén nuôi bồ nhí đội lốt thợ điện, lập quỹ đen mua quà sinh viên, ngoại tình văn phòng qua lời nhắn chuyển khoản 1k).
- **Môi trường**: Python 3 sẵn sàng để chạy `scripts/sync_clues.py`.

---

## Procedure

### Bước 1: Xác lập Phạm vi
Đọc hồ sơ màn và phản hồi đã có; xác định người chồng, chủ đề, kết luận và phân bậc theo [quy tắc thiết kế](references/level-design-rules.md). Nếu thiếu quyết định nền tảng thì hỏi với phương án đề xuất và ưu/nhược điểm; nếu đã rõ thì tiếp tục.

### Bước 2: Viết Câu chuyện, Sự kiện & Sinh hoạt
Hoàn thành nền truyện của [mẫu hồ sơ](references/story-spec-template.md) theo [phương pháp, mục 1](references/story-first-design.md#1-nền-truyện-chưa-gán-ứng-dụng), rồi tự duyệt câu chuyện độc lập với ứng dụng.
- **Tuân thủ Persona & Khẩu khí Ngôn ngữ (Mục 3.2)**: Toàn bộ bong bóng chat, tin nhắn ngụy trang, ghi chú, nội dung chuyển khoản ngân hàng và lịch sử tìm kiếm phải bám sát `generationTag`, `chatTone` và `lifestyleHabits` của các nhân vật tham gia hội thoại (Quy tắc lứa tuổi & viết tắt: Gen Z dùng nhiều từ viết tắt `ko`, `vs`, `ms`, `đc`, `j`, teencode và từ lóng mạng; Millennial dùng viết tắt công sở chừng mực; Thế hệ cha mẹ/lớn tuổi giữ chính tả chuẩn, lịch sự, tuyệt đối không dùng teencode/viết tắt).

### Bước 3: Phân bổ Dấu vết, Xây Đồ thị Tri thức (Scope 1C) & Bảng Điều tra Nối dây
Thực hiện [phương pháp, mục 2–3](references/story-first-design.md#2-chuyển-sự-kiện-thành-dữ-liệu-ứng-dụng). Tra cứu tài liệu app qua `research-project-knowledge`, sau đó mới chọn app có clue và đối chiếu phân bậc:
1. **Thiết kế Đồ thị Tri thức Pháp y (Knowledge Graph - Scope 1C)**: Thiết lập cấu trúc `nodes[]` và `edges[]` theo mẫu mục 5.2:
   - Tách biệt rõ `suspect`, `alias` (vỏ bọc ngụy trang, `isInitialDisguise: true`), `bridge_id` (cầu nối SĐT, tên tài khoản), `record_clue` (bản ghi app), và `timeline_slot` (mốc giờ).
   - Tuyệt đối tuân thủ **Strict Zero-Spoiler Alias Resolution**: Không gán thẳng `suspectId` vào vỏ bọc; danh tính tiểu tam chỉ được bóc trần khi nối qua `bridge_id`.
   - Xác định rõ các cạnh mâu thuẫn ngoại phạm (`contradicts_alibi`) và danh sách `requiredSmokingGunEdgeIds` để đạt 3 sao.
2. **Quy hoạch Bố cục Bảng Điều tra Nối dây (Corkboard Canvas - US-015)**: Phân bổ vị trí khởi tạo của các thẻ lên 3 làn (Trái: Vỏ bọc & Nghi phạm, Giữa: Dấu vết & Cầu nối, Phải: Mốc giờ) và quy định thẻ nào nằm trong "Khay Manh Mối Chưa Phân Loại".
3. Hoàn thiện nghi phạm, giải oan, gợi ý và khóa nếu phân bậc yêu cầu theo quy tắc thiết kế.

### Bước 4: Đồng bộ Clue & Đối chất
Tra cứu bằng `python -B .agents/skills/level-designer/scripts/sync_clues.py list --app <appId>`; dùng `add --help` để đăng ký clue mới trong cả hai danh mục. Chỉ tái dùng ID nếu cùng ý nghĩa. Soạn lời đối chất và kết thúc sau khi đường suy luận đã hoàn chỉnh.

### Bước 5: Xác thực & Đọc duyệt
Mỗi màn chơi hoàn chỉnh bắt buộc đóng gói **chuẩn đúng 2 files** (`level-XX.md` và `level-XX-phone-data.md`), tuyệt đối không tạo file thứ ba `level-XX-history.md`:
1. `level-XX.md`: Kiểm tra tính toàn vẹn mục 1–7 và danh mục clue bằng:
   ```bash
   python -B .agents/skills/level-designer/scripts/sync_clues.py verify-spec <spec.md>
   python -B .agents/skills/level-designer/scripts/sync_clues.py validate --file <spec.md>
   ```
2. `level-XX-phone-data.md`: Rà soát tỷ lệ $\ge 75\%$ bản ghi sinh hoạt/giải oan trong phạm vi 2–3 ngày quanh D-Day, và thực hiện [đọc duyệt ngữ nghĩa](references/story-first-design.md#4-đọc-duyệt-ngữ-nghĩa-trước-bàn-giao).

### Bước 6: Xin duyệt Thiết kế Cốt truyện
Trình bày gói 2 file đã xác thực (`level-XX.md` và `level-XX-phone-data.md`) cùng các khoảng trống/chưa kiểm chứng. Chỉ bắt đầu tạo avatar và ảnh nội dung sau khi người dùng duyệt rõ phiên bản cốt truyện cuối cùng. Nếu người dùng yêu cầu sửa, cập nhật và xác thực lại trước khi xin duyệt phiên bản mới.

### Bước 7: Tạo Avatar và Ảnh Nội dung (Chỉ sau khi Duyệt)
Sau khi được duyệt, tạo ảnh cho các nhân vật, bí danh, nhóm/tài khoản dịch vụ và nội dung Shopoo có mặt trong màn chơi:
1. Lập danh sách từ dữ liệu cốt truyện đã duyệt; gắn mỗi avatar với ID nhân vật/bí danh và các ứng dụng dùng ảnh đó.
2. Chọn kiểu ảnh dựa trên persona và chi tiết đã xác nhận: ảnh tự chụp đời thường với góc/khoảng cách khác nhau, anime, thú cưng, ảnh trẻ em/gia đình, ảnh toàn thân ngoài cảnh quan, ảnh nhóm hoặc ảnh phong cảnh. Ưu tiên ảnh camera-roll đời thường, ánh sáng/góc cắt không hoàn hảo; tránh bộ chân dung generic, bóng bẩy và giống nhau.
3. Không sáng tác sở thích, quan hệ gia đình, trẻ em, nghề nghiệp, hay manh mối mới chỉ để hợp thức hóa ảnh. Chỉ dùng ảnh trẻ em khi mối quan hệ đó có trong truyện đã duyệt hoặc người dùng duyệt riêng liên hệ hình ảnh này. Avatar không được trở thành manh mối mới hoặc làm lộ kết luận.
4. Giữ cùng một ảnh cho cùng danh tính trên các app, trừ khi cốt truyện xác nhận nhân vật dùng ảnh khác nhau theo tài khoản. Với bí danh/vỏ bọc, ảnh chỉ phản ánh điều người chơi được thấy và không hé lộ danh tính thật, giới tính hoặc mối quan hệ bị giấu.
5. Dùng ảnh/biểu trưng phù hợp cho nhóm và tài khoản dịch vụ; không gán chân dung người thật giả cho tổ chức. Tạo từng ảnh riêng hoặc ghép sheet chỉ khi từng ô đã được gán persona và kiểu ảnh rõ ràng trước khi tạo.
6. Với Shopoo, dùng tài liệu [Bề mặt ảnh Shopoo](#references) và sản phẩm/biến thể được ghi trong `level-XX-phone-data.md` đã duyệt để lập danh sách bề mặt ảnh được hỗ trợ. Tạo ảnh khớp tên, màu/size/biến thể đã xác nhận; không thêm sản phẩm, thương hiệu, dấu hiệu nhận biết hoặc chi tiết làm thay đổi manh mối.
7. Dùng cùng một asset sản phẩm/biến thể trên thẻ sản phẩm trong chat người bán, danh sách sản phẩm và đơn hàng liên quan để ảnh, SKU và nội dung luôn khớp. Tạo ảnh đính kèm riêng trong chat hoặc ảnh kiện hàng chỉ khi truyện đã duyệt ghi rõ nội dung ảnh và app hiện có bề mặt hỗ trợ; không dựng tang chứng mới.
8. Lưu ảnh vào vị trí asset hiện có của dự án; ghi tên file cùng ID nhân vật/sản phẩm/đơn hàng/hội thoại và app sử dụng trong bàn giao. Không tạo thêm tài liệu cốt truyện thứ ba hoặc sửa runtime code/JSON trong bước này. Nếu thiếu công cụ tạo ảnh, trường ảnh hoặc vị trí lưu asset phù hợp, báo đúng khoảng trống và dừng phần ảnh đó.

### Bước 8: Bàn giao cho Lead Dev
Bàn giao gói 2 file (`level-XX.md` và `level-XX-phone-data.md`) cùng các ảnh đã tạo sau duyệt tới `@frontend-game-developer` để ánh xạ vào file cấu hình `src/data/cases/<husband>/level_XX.json`. Chỉ rõ ID clue, ID bản ghi, bảng ánh xạ avatar/sản phẩm/đơn hàng/hội thoại và khoảng trống runtime chưa triển khai.

---

## Ranh giới

- Bộ hồ sơ cốt truyện giữ **đúng 2 files** (`level-XX.md` và `level-XX-phone-data.md`) cùng cập nhật danh mục clue (`clues/`). Avatar và ảnh nội dung đã duyệt là asset hình ảnh riêng, không thay thế hay bổ sung tài liệu cốt truyện. Tuyệt đối không tạo file `level-XX-history.md` (filler lịch sử quá khứ sâu sẽ do dev nạp từ shared mock fixtures trong code engine).
- Không trực tiếp sửa JSON trong `src/data/cases/` hoặc mở rộng app/UI trong skill này.
- Hợp đồng hồ sơ thuộc [mẫu](references/story-spec-template.md); độ khó, khóa, và chuẩn gói 2 file thuộc [quy tắc thiết kế](references/level-design-rules.md). Chuẩn UI/gesture/icon tuân theo `AGENTS.md` và tài liệu thiết kế app.
