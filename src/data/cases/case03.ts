import { CaseConfig } from '../../types/case-schema';

export const case03: CaseConfig = {
  caseId: 'case_03',
  husbandId: 'husband_hoang',
  husbandName: 'Hoàng',
  levelNumber: 3,
  allowedStrikes: 3,
  groundTruth: {
    verdict: 'innocent',
    culpritSuspectId: 'suspect_none',
    narrativeRoast: 'Bất ngờ chưa! Chồng bạn hoàn toàn vô tội. Tất cả quỹ đen và lịch trình bí mật là để tổ chức kỷ niệm 5 năm ngày cưới và mua nhẫn kim cương tặng bạn!',
    overJealousRoast: 'Vợ Sư Tử Hà Đông! Nghi ngờ người chồng gương mẫu đang chuẩn bị món quà kim cương lãng mạn nhất đời bạn.',
  },
  suspectPool: [
    {
      suspectId: 'suspect_none',
      displayName: 'Không có ai (Chồng Vô Tội)',
      initialDiscoveredApp: 'husband_notes',
    },
    {
      suspectId: 'suspect_nhan_vien_pnj',
      displayName: 'Chuyên viên PNJ',
      initialDiscoveredApp: 'geemail',
    },
  ],
  lockChallenges: [
    {
      challengeId: 'lock_vietpay',
      targetType: 'app',
      targetId: 'vietpay',
      lockType: 'numeric_pin',
      expectedAnswer: '1509',
      clueSourceApp: 'inkedlin',
      promptQuestion: 'Nhập mã PIN 4 số bảo mật của VietPay (Gợi ý: Ngày kỷ niệm làm việc trên InkedLin)',
    },
    {
      challengeId: 'lock_photos',
      targetType: 'album',
      targetId: 'photos_hidden',
      lockType: 'numeric_pin',
      expectedAnswer: '2026',
      clueSourceApp: 'husband_notes',
      promptQuestion: 'Nhập mã PIN mở khóa Thư mục Ảnh Ẩn',
    },
  ],
  deviceMetadata: {
    narrativeTime: '23:45',
    batteryPercent: '29%',
    carrierTag: '5G',
    pwaThemeColor: '#0f172a',
  },
  activeAppIds: [
    'poshee',
    'grap',
    'netsurf',
    'photos',
    'geemail',
    'inkedlin',
    'tim',
    'husband_notes',
    'loza',
    'vietpay',
    'comms',
  ],
  notifications: [
    {
      toastId: 'toast_03',
      sourceAppId: 'geemail',
      senderTitle: 'GeeMail • PNJ Jewelry',
      snippetBody: 'Xác nhận đơn hàng: Nhẫn kim cương 1.2 carat - Khắc chữ "Yêu Vợ Nhất Đời"',
      triggerDelaySeconds: 5,
    },
  ],
  appsData: {
    husband_notes: {
      notes: [
        {
          id: 'n1',
          title: 'Kế hoạch bí mật kỷ niệm 5 năm ngày cưới',
          content: 'Mã PIN thư mục ảnh ẩn: 2026. Nhớ đặt nhà hàng trước 1 tuần và giấu hộp nhẫn trong ngăn vest.',
        },
      ],
    },
    inkedlin: {
      posts: [
        {
          id: 'post_1',
          author: 'Hoàng Nguyễn (CEO)',
          time: 'Hôm qua',
          content: 'Tròn 5 năm gắn bó với sự nghiệp (15/09). PIN thẻ và các tài khoản quan trọng luôn đặt theo ngày này: 1509.',
        },
      ],
    },
    vietpay: {
      balance: '540.000.000 đ',
      transactions: [
        {
          id: 'tx_31',
          time: '15:20',
          date: 'Hôm qua',
          amount: '-85.000.000 đ',
          memo: 'Dat coc nhan kim cuong ky niem ngay cuoi',
          beneficiary: 'Cong Ty Vang Bac Da Quy PNJ',
          category: 'Quà tặng cao cấp',
        },
      ],
    },
    geemail: {
      emails: [
        {
          id: 'mail_01',
          sender: 'CSKH PNJ <cskh@pnj.com.vn>',
          subject: 'Xác nhận đặt làm nhẫn kim cương theo yêu cầu',
          snippet: 'Chiếc nhẫn đã được khắc chữ "Mãi Yêu Vợ" và sẵn sàng giao hàng vào ngày kỷ niệm.',
        },
      ],
    },
    photos: {
      albums: [
        {
          id: 'album_hidden',
          name: 'Mục bị ẩn',
          isLocked: true,
          photos: [
            { id: 'p1', title: 'Hóa đơn nhẫn kim cương PNJ', isClue: true },
            { id: 'p2', title: 'Bản phác thảo tiệc kỷ niệm 2 vợ chồng', isClue: true },
          ],
        },
      ],
    },
    loza: { threads: [] },
    poshee: { orders: [] },
    comms: { calls: [] },
    grap: { trips: [] },
    netsurf: { history: [] },
    tim: { channels: [] },
  },
};

