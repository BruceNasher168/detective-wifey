# Thiết kế truyện trước ứng dụng

> SSOT cho quy trình sinh sự kiện, hoạt động và dấu vết; dùng cùng [quy tắc thiết kế](level-design-rules.md). Áp dụng cho ngoại tình, quan hệ chu cấp và kết luận vô tội.

## 1. Nền truyện chưa gán ứng dụng

1. **Sự thật quan hệ**: Ai liên quan, quan hệ thật, động cơ, việc che giấu, điều người vợ đã biết và lời khai của người chồng. Giữ nền đã cung cấp; phân biệt chi tiết sáng tác mới với dữ kiện dự án đã xác nhận.
2. **Sự kiện có nguyên nhân**: Viết diễn biến chuẩn bị, phối hợp, hành động/gặp gỡ và hậu quả theo logic riêng của vụ án. Dùng Event ID ổn định, người tham gia, hành động, nguyên nhân, thời điểm/khoảng thời gian, nơi chốn khi cần, vật liên quan và ai giữ vật trước/sau. Không ép mọi vụ thành cùng cốt truyện.
3. **Sinh hoạt song song**: Gia đình, công việc, việc nhà, bạn bè, sở thích, mua sắm và quan hệ vô tội cũng có diễn biến. Dữ liệu vô hại sinh từ hoạt động này ngay từ đầu, không chỉ thêm cuối cùng để che clue.
4. **Hai lớp thông tin**: Tách sự thật tác giả biết khỏi điều người chơi có thể quan sát. Sự kiện có thể không để lại dấu vết số; dấu vết có thể không phải bằng chứng.

Đọc lại truyện khi bỏ mọi tên app. Sửa khoảng trống nhân quả, lời khai và quyền giữ đồ trước khi chọn app hoặc tìm ý tưởng trong danh mục clue. Đây là bước tự duyệt, không tạo cổng xin phép mới.

## 2. Chuyển sự kiện thành dữ liệu ứng dụng

- Gán app sau khi câu chuyện nhất quán. Mỗi bản ghi có Event ID hoặc hoạt động sinh hoạt nguồn, Record ID, người tạo/nhận, thời điểm, lý do tồn tại, nội dung tự nhiên, màn/trường hiện có và vai trò suy luận.
- Chọn app phù hợp hành động: thanh toán để lại biên lai, phối hợp có thể để lại tin nhắn, đồ bỏ quên tạo lời nhắc sau cuộc gặp. Không bắt mọi app chứa clue hoặc cùng nhắc một kết luận.
- Tra cứu `app-design.md` và `features.md` trước khi phân bổ; tái sử dụng khả năng có sẵn. Thiếu trường/màn cần thiết thì ghi khoảng trống cho lead dev, không tự sáng tác tính năng UI.
- Đối chiếu phân bậc sau phân bổ. Nếu vượt số app/khóa cho phép, thu gọn dấu vết hoặc sửa truyện có chủ đích; không tạo sự kiện vô cớ chỉ để đủ số app.
- Dữ liệu sinh hoạt/giải oan chiếm ít nhất 75% bản ghi ở mỗi danh sách có clue, theo đơn vị người chơi nhìn thấy như luồng chat, giao dịch, đơn, cuộc gọi. Không chia bong bóng chat để làm đẹp tỷ lệ. App không có clue vẫn có nội dung cụ thể đọc được.
- **Chuẩn gói 2 file & Giới hạn thời gian (D-Day $\pm$ 2–3 ngày)**: Toàn bộ kịch bản lời thoại và bản ghi được xuất ra file đồng hành `level-XX-phone-data.md`. Thời gian chỉ gói gọn trong 2–3 ngày quanh thời điểm kiểm tra máy. Tuyệt đối không tạo file thứ ba `level-XX-history.md`; dữ liệu quá khứ sâu sẽ do developer nạp từ shared mock fixtures trong code engine.
- Event ID, Record ID và Clue ID là ba lớp khác nhau. Một sự kiện có thể tạo nhiều bản ghi; cùng clue nhiều vị trí chỉ tạo một nhóm bằng chứng hợp lệ, không nhân điểm.
- **Thông báo Shopoo khớp lịch sử đơn hàng**: Khi màn có dữ liệu ecommerce, soạn thông báo cập nhật đơn từ các sự kiện của đơn hàng đã xác định, gồm cả đơn sinh hoạt/giải oan; ghi trong `level-XX-phone-data.md`. Mỗi thông báo loại `order` phải chỉ rõ Record ID của đơn nguồn và `orderId` theo hợp đồng app hiện có. Nội dung phải khớp sản phẩm, shop, mã vận đơn, người nhận, địa chỉ và số tiền khi được nhắc; thời điểm thông báo không trước sự kiện tương ứng, không sau lúc kiểm tra máy. Chuỗi xác nhận → vận chuyển → giao thành công phải phù hợp lịch sử và trạng thái cuối của đơn; thông báo cũ có thể giữ trạng thái trước đó nếu thời gian hợp lệ. Không tạo thông báo đơn mồ côi hoặc dùng khuyến mãi thay toàn bộ cập nhật đơn. Không bắt mọi đơn có đủ mọi mốc; thông báo `promo`/`security` không cần gán đơn. Với đơn quá khứ sâu từ shared fixtures, chỉ tham chiếu dữ liệu đã kiểm chứng; thiếu dữ liệu thì ghi phụ thuộc cho lead dev thay vì bịa lịch sử.
- **Chuyển thành Đồ thị Tri thức (System Scope 1C)**: Mọi sự kiện và dấu vết phải được ánh xạ thành mạng lưới Nodes (`suspect`, `alias`, `bridge_id`, `record_clue`, `timeline_slot`) và Edges (`uses_alias`, `bridges_identity`, `occurred_at`, `contradicts_alibi`). Cầu nối danh tính và mâu thuẫn ngoại phạm phải được thể hiện tường minh bằng các cạnh kết nối, bảo đảm người chơi tự tay nối dây bóc trần sự thật.

## 3. Kết nối rất tinh tế, nhưng có thể kiểm chứng

- Gợi liên tục bằng vài chi tiết đời thường: vật chuyển tay, thói quen có tiền lệ, lịch hẹn, giờ xuất hiện và hậu quả. Chi tiết được nhắc lại vì nhân vật cần xử lý việc đó, không phải để rải mật hiệu cho người chơi.
- Tách **gợi hướng** khỏi **xác thực**. Vật, màu, món ăn, chữ cái đầu hoặc ba số cuối chỉ gợi kiểm tra tiếp. Nhận diện duy nhất cần dữ liệu phân biệt được từ nguồn độc lập, như số liên hệ đầy đủ và tên pháp lý đối chiếu được với hồ sơ người chơi đọc thấy.
- Với mỗi phép nối, điền hợp đồng xác thực trong bảng mục 5.2 của [mẫu hồ sơ](story-spec-template.md): Record ID của hai nguồn, trường/nội dung nhìn thấy dùng đối chiếu, tập bản ghi hoặc tin nhắn tối thiểu phải ghim, mức kết luận được phép và trường hợp đạt/không đạt. Nêu cách giải thích vô hại, mảnh ghép còn thiếu và phân biệt cùng người, cùng dịp với kết luận quan hệ.
- Dây chỉ được xác thực từ nội dung thực tế của các thẻ đã ghim. Ghim tên hội thoại không thu thập nội dung cả luồng; tin nhắn chưa ghim, cùng Conversation ID, Clue ID hoặc ánh xạ danh tính của tác giả không thay thế bằng chứng. Hai bản ghi khác nhau có cùng định danh đầy đủ vẫn có thể tạo cầu nối; ghi cách chuẩn hóa định dạng được phép, giữ nguyên giá trị gốc và giới hạn kết luận ở định danh đó.
- Mỗi quan hệ có ít nhất một ca đạt và một ca không đạt. Xét tin không liên quan trong cùng hội thoại, chỉ ghim tên liên hệ, thiếu hoặc khác định danh; thêm/bỏ tin quyết định phải thay đổi trạng thái xác thực tương ứng. Cùng người không mặc nhiên làm mọi bản ghi của người đó có quan hệ trực tiếp.
- Một khoản chia tiền, quần áo khác size, cuộc gọi đêm hoặc gặp đồng nghiệp không tự chứng minh ngoại tình. Không suy số người từ tiền, nội dung cuộc gọi từ thời lượng hoặc vị trí chính xác từ biên lai; sự thật tác giả không bù được dấu vết thiếu.
- Thông tin đời thường trong từng nguồn đứng riêng vẫn có nghĩa. Toàn chuỗi mới thu hẹp kết luận; không dùng thoại tự khai quan hệ, tự kể che giấu, nhãn nghi phạm hay thông báo tiết lộ đáp án. Không lặp nguyên một câu mật hiệu trong mọi app.
- Để người chơi đọc được giải thích vô tội của bẫy nghi ngờ trước đối chất. Không biến mọi nhân vật hoặc mọi hoạt động thường ngày thành một bẫy.
- Ánh xạ nghi phạm thuộc metadata tác giả; tên liên hệ, preview, thẻ bằng chứng và thông báo không tự công bố kết nối người chơi chưa suy ra.
- Lập danh mục riêng cho mọi người, bí danh, nhóm và tài khoản dịch vụ nhìn thấy, kể cả sinh hoạt/giải oan. Ghi ID liên hệ/hội thoại, app, tên nhìn thấy, điều kiện xuất hiện trong bộ chọn nghi phạm và khóa gộp theo hợp đồng hiện hành; tách khỏi danh tính thật chỉ dành cho tác giả. Nếu loại trừ một đối tượng khỏi bộ chọn thì nêu lý do và khoảng trống runtime nếu có.

## 4. Đọc duyệt ngữ nghĩa trước bàn giao

Đọc theo dòng thời gian thật và đi ngược từ thông báo khởi phát:

- Chuẩn bị trước hành động, giao hàng trước lấy hàng, quyền giữ/trao vật rõ; các cuộc gặp không mâu thuẫn. Ghi khoảng trống nếu chưa kiểm chứng được quãng di chuyển, không tự đặt thời gian hành trình.
- Ngày, giờ, tên, số, địa điểm, tiền, trạng thái và đồ vật khớp giữa nguồn; không có dữ liệu sau lúc kiểm tra máy. Sinh hoạt không vô tình tạo ngoại phạm trái sự thật.
- Nếu có ecommerce, đối chiếu từng thông báo với đơn nguồn theo **Thông báo Shopoo khớp lịch sử đơn hàng** ở mục 2; báo rõ liên kết hoặc mốc thời gian chưa kiểm chứng khi bàn giao.
- Ít nhất một đường giải đầy đủ qua dữ liệu nhìn thấy; người chơi có thể bắt đầu từ thứ tự khác. Không phụ thuộc ảnh chưa tạo hoặc trường/màn chưa tồn tại.
- Mỗi manh mối riêng còn cách hiểu đời thường; toàn chuỗi xác thực người và sự việc. Nêu rõ giới hạn kết luận, không suy họ về chung nhà chỉ vì giữ đồ cho nhau.
- Khi sửa bản ghi hoặc ý nghĩa clue, truy ngược các cạnh, `requiredSmokingGunEdgeIds`, gợi ý, lời đối chất và kết thúc phụ thuộc; cập nhật hoặc loại bỏ quan hệ mất căn cứ. Không giữ cạnh cũ chỉ vì ID còn tồn tại hoặc để đủ số smoking gun. Kiểm tra lại đường giải sau sửa; nếu không còn đáp ứng phân bậc/chấm điểm thì báo khoảng trống thay vì ép bằng chứng mới.
- Gợi ý hướng nguồn/thời điểm cần kiểm tra. Lời đối chất tương xứng bằng chứng; giữ hợp đồng chấm điểm hiện hành, báo riêng nếu nó mâu thuẫn mức suy luận thay vì tự sửa engine.

Script chỉ kiểm tra cấu trúc, danh mục và một số cụm từ spoil. PASS không chứng minh tính tinh tế, nhân quả hoặc khả năng giải; phải đọc duyệt thủ công và báo phần chưa kiểm chứng.

## 5. Đọc duyệt khi triển khai hoặc sửa dữ liệu truyện

Lead frontend thực hiện trước khi báo hoàn thành khi thay đổi bản ghi truyện, preview bằng chứng, bí danh, ánh xạ clue hoặc đồ thị, kể cả thay đổi chỉ ở JSON/fixture. Phạm vi là các đường bằng chứng bị ảnh hưởng theo mục 4, dùng hợp đồng mục 3 làm căn cứ; không yêu cầu thiết kế lại toàn màn.

1. Đối chiếu hồ sơ đã duyệt với dữ liệu runtime, màn nguồn, preview và thẻ đã ghim; kiểm tra nội dung dùng xác thực thực sự đọc và ghim được qua UI. Báo lệch hồ sơ cho level-designer, không tự sáng tác cầu nối để hợp thức hóa code.
2. Chạy các ca đạt/không đạt của quan hệ bị sửa qua luồng ghim và nối dây; để lại kiểm thử hồi quy tập trung cho cả hai kết quả, gồm thêm/bỏ tin quyết định nếu là thẻ hội thoại.
3. Đối chiếu danh mục đối tượng với bộ chọn trên bảng đang ghim, cả nhóm và liên hệ thường; tên hiển thị và việc gộp phải giữ ranh giới thông tin người chơi biết.
4. Khôi phục bảng đã lưu trước thay đổi và kiểm tra xác thực lại khi tải hoặc thay đổi nội dung ghim. Dây mất căn cứ phải hết trạng thái xác thực và điểm bằng chứng; giữ dữ liệu ghim/vị trí còn hợp lệ, không xóa tiến trình để che lỗi.
5. Báo các đường đã kiểm tra, kết quả test và phần UI/lưu-khôi phục chưa kiểm chứng. Kiểm thử dữ liệu hoặc build không thay cho kiểm tra tương tác trình duyệt.
