# -*- coding: utf-8 -*-
with open('.agents/skills/level-designer/references/level-design-rules.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip_count = 0
for i, line in enumerate(lines):
    if '### 3.2. Quy tắc Khẩu Khí & Lối Sống Theo Persona Người Chồng' in line:
        new_lines.append('### 3.2. Quy tắc Khẩu Khí, Viết Tắt & Lối Sống Theo Độ Tuổi / Persona (Persona, Generational Slang & Vietnamese Abbreviation Invariant)\n')
        new_lines.append('*Dữ liệu trong các ứng dụng (tin nhắn chat, lịch sử tìm kiếm, ghi chú, nội dung chuyển khoản) không được viết theo một giọng chung chung hoặc toàn bộ câu từ trang trọng chuẩn mực như văn bản giấy tờ, mà phải phản ánh độ tuổi, mức độ thân thiết và văn hóa nhắn tin thực tế:*\n\n')
        new_lines.append('1. **Quy tắc Bậc thang Viết tắt Tiếng Việt (Vietnamese Abbreviation Hierarchy)**:\n')
        new_lines.append('   - **Gen Z / Sinh viên (Bé Ngọc KTX)**: Sử dụng mật độ viết tắt và từ lóng cao nhất (ko, s, ms, đc, j, zạ, e, , c, 	rc, 
ùi, mik, lun, 1 mik, ibe, chằm zn, đỉnh chóp, lag, update, shopee).\n')
        new_lines.append('   - **Millennial Trẻ / Dân Văn Phòng (Hoàng 29t, Hương Marketing, Thảo PT, Bạn bè Tuấn Đụt)**: Dùng viết tắt đời thường, tự nhiên và chừng mực trong giao tiếp chat (/e, ko, s, ms, đc, 
ùi, 
g, hôm trc, cf, 100k, shipper, highlight, sprint, deploy, ix bug, confirm). Không dùng teencode trẻ con nhưng không cứng nhắc viết chữ đầy đủ như đơn từ hành chính.\n')
        new_lines.append('   - **Giao tiếp Hành chính / Lễ tân / BQL (Lan Anh, Mai Lễ Tân, Cư dân)**: Lịch sự công sở, chỉ viết tắt nhẹ (/e, 
ùi, 1 số ạ, 	eam).\n')
        new_lines.append('   - **Thế hệ Cha Mẹ / Bậc Tiền Bối (Mẹ Ở Quê, Chú Bác)**: Tuyệt đối giữ chính tả chuẩn mực (không, ới, mới, được), xưng hô kính cẩn, không bao giờ dùng từ viết tắt, teencode hay tiếng lóng mạng.\n\n')
        skip_count = 2
        continue
    if skip_count > 0:
        skip_count -= 1
        continue
    
    if '1. **Chồng Gen Z / Trẻ tuổi' in line:
        new_lines.append('2. **Chồng Gen Z / Trẻ tuổi (20 – 25 tuổi)**:\n')
        continue
    if '2. **Chồng Millennial / Dân Văn Phòng' in line:
        new_lines.append('3. **Chồng Millennial / Dân Văn Phòng - IT (26 – 35 tuổi, như Hoàng)**:\n')
        continue
    if '3. **Chồng Trung Niên / Doanh Nhân' in line:
        new_lines.append('4. **Chồng Trung Niên / Doanh Nhân / Gen X (36+ tuổi)**:\n')
        continue

    new_lines.append(line)

final_text = ''.join(new_lines)
sec8_header = '## 8. Chuẩn Đóng Gói Hồ Sơ 2 File & Phạm Vi Dữ Liệu (Two-File Delivery Package Invariant)'
if final_text.count(sec8_header) == 2:
    parts = final_text.split(sec8_header)
    final_text = parts[0] + sec8_header + parts[1]

with open('.agents/skills/level-designer/references/level-design-rules.md', 'w', encoding='utf-8') as f:
    f.write(final_text)

print('Updated successfully')
