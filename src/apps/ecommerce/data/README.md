# Nội dung Ứng dụng Mua sắm

`content.json` chứa dữ liệu mặc định cho bốn màn hình:

| Trường | Nội dung |
|---|---|
| `products` | Danh sách sản phẩm, giá, hình minh họa, giảm giá, đánh giá và địa điểm |
| `browsingPatterns` | Các cụm từ quan tâm dùng để xếp hạng sản phẩm |
| `recentSearches` | Lịch sử tìm kiếm, đồng thời dùng để xếp hạng sản phẩm |
| `notifications` | Thông báo; `orderId` liên kết đến đơn mua, `isPinned` đưa thông báo lên đầu |
| `chats` | Cửa hàng, logo, trạng thái hoạt động, sản phẩm đang hỏi và tin nhắn |
| `orders` | Đơn mua, trạng thái, sản phẩm, người nhận và địa chỉ giao hàng |

Dữ liệu riêng của màn chơi đặt tại `appsData.ecommerce` trong JSON vụ án. Trường được cung cấp thay thế toàn bộ trường mặc định tương ứng; mảng `[]` giữ danh sách trống. Trường bị bỏ qua sử dụng giá trị mặc định. Ứng dụng vắng mặt hoặc dữ liệu không hợp lệ không tự sinh lịch sử.

Mỗi sản phẩm có `productId` ổn định và `keywords` chứa các cụm từ liên quan. Sản phẩm khớp nhiều cụm từ trong `browsingPatterns` và `recentSearches` hơn xuất hiện trước. So khớp không phân biệt hoa thường hoặc dấu tiếng Việt. Điểm bằng nhau giữ nguyên thứ tự trong JSON. Không có tín hiệu phù hợp thì giữ thứ tự danh sách.

Ví dụ dữ liệu riêng của màn chơi:

```json
{
  "ecommerce": {
    "browsingPatterns": ["nước hoa nữ", "váy ngủ"],
    "recentSearches": ["nước hoa nữ hương nhẹ"],
    "notifications": [],
    "chats": [],
    "orders": []
  }
}
```

Các mã `artwork` hiện có: `mouse`, `spray`, `phone`, `trousers`, `sponge`, `catfood`, `polo`, `controller`, `dress`, `perfume`. `thumbnailUrl` chỉ nhận ảnh raster nhúng dạng base64. Không tải hình từ máy chủ bên ngoài.

Chỉ gắn `clueRefId`, `suspectId` hoặc `suspectName` khi dữ liệu vụ án thực sự cung cấp chúng. Dữ liệu mặc định là nội dung sinh hoạt thông thường.
