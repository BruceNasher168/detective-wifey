import { CaseConfig } from '../../types/case-schema';

export const case01: CaseConfig = {
  caseId: 'case_01',
  husbandId: 'husband_hoang',
  husbandName: 'Hoàng',
  levelNumber: 1,
  allowedStrikes: 5,
  groundTruth: {
    verdict: 'cheating',
    culpritSuspectId: 'suspect_huong',
    narrativeRoast: 'Chồng bạn đã lén lút mua váy ngủ ren tặng nữ đồng nghiệp và nhắn tin hẹn hò đêm muộn dưới tên "Anh Tuấn Thợ Điện"!',
    overJealousRoast: 'Bạn đã nghi ngờ nhầm người vô tội! Chồng bạn chỉ nhờ bạn bè tư vấn quà thôi.',
  },
  suspectPool: [
    {
      suspectId: 'suspect_huong',
      displayName: 'Hương Đồng Nghiệp',
      initialDiscoveredApp: 'loza',
    },
    {
      suspectId: 'suspect_mai',
      displayName: 'Mai Lễ Tân',
      initialDiscoveredApp: 'poshee',
    },
  ],
  lockChallenges: [],
  deviceMetadata: {
    narrativeTime: '23:45',
    batteryPercent: '42%',
    carrierTag: '5G',
    pwaThemeColor: '#0f172a',
  },
  activeAppIds: ['poshee', 'loza', 'vietpay', 'comms'],
  notifications: [
    {
      toastId: 'toast_01',
      sourceAppId: 'loza',
      senderTitle: 'LoZa • Vừa xong',
      snippetBody: 'Anh Tuấn Thợ Điện: "Tối mai anh đón em chỗ cũ nhé"',
      triggerDelaySeconds: 4,
    },
  ],
  appsData: {
    loza: {
      threads: [
        {
          threadId: 'thread_tuan',
          contactName: 'Anh Tuấn Thợ Điện',
          suspectId: 'suspect_huong',
          avatarGradient: 'from-amber-400 to-orange-500',
          lastMessage: 'Tối mai anh đón em chỗ cũ nhé',
          timestamp: '23:44',
          unreadCount: 3,
          isDisguised: true,
          realIdentity: 'Hương Đồng Nghiệp',
          messages: [
            { id: 'm1', sender: 'them', text: 'Anh ơi, tối nay vợ có kiểm tra máy không?', time: '23:10' },
            { id: 'm2', sender: 'me', text: 'Vợ đang ngủ rồi em, yên tâm nhé.', time: '23:15' },
            { id: 'm3', sender: 'them', text: 'Chiếc váy ren đỏ hôm trước anh mua trên Poshee đẹp lắm á ❤️', time: '23:30' },
            { id: 'm4', sender: 'them', text: 'Tối mai anh đón em chỗ cũ nhé', time: '23:44' },
          ],
        },
        {
          threadId: 'thread_sep',
          contactName: 'Sếp Hùng',
          avatarGradient: 'from-blue-500 to-indigo-600',
          lastMessage: 'Mai nộp báo cáo sớm cho anh nhé',
          timestamp: '19:20',
          unreadCount: 0,
          messages: [
            { id: 'm5', sender: 'them', text: 'Tiến độ dự án tuần này thế nào rồi Hoàng?', time: '19:15' },
            { id: 'm6', sender: 'me', text: 'Dạ em đang hoàn thiện slide, sáng mai em gửi sếp.', time: '19:18' },
            { id: 'm7', sender: 'them', text: 'Mai nộp báo cáo sớm cho anh nhé', time: '19:20' },
          ],
        },
      ],
    },
    vietpay: {
      accountNumber: '1903****8899',
      balance: '18.500.000 đ',
      unreadBadge: 1,
      transactions: [
        {
          id: 'tx_01',
          time: '23:25',
          date: 'Hôm nay',
          amount: '-1.000 đ',
          memo: 'Em gian anh a sao khong nghe may',
          beneficiary: 'Nguyen Thi Thu Huong',
          category: 'Chuyển tiền nhanh Napas 24/7',
          suspectName: 'Hương Đồng Nghiệp',
        },
        {
          id: 'tx_02',
          time: '20:10',
          date: 'Hôm nay',
          amount: '-1.580.000 đ',
          memo: 'Thanh toan nha hang Sen Vang',
          beneficiary: 'Nha Hang Sen Vang Gourmet',
          category: 'Ẩm thực & Nhà hàng',
        },
        {
          id: 'tx_03',
          time: '12:30',
          date: 'Hôm nay',
          amount: '-35.000 đ',
          memo: 'Pho bo tai lan buoi trua',
          beneficiary: 'Quan Pho Gia Truyen',
          category: 'Ăn uống hàng ngày',
        },
      ],
    },
    poshee: {
      unreadBadge: 0,
      recentSearches: ['váy ngủ quyến rũ', 'nội y ren đỏ', 'nước hoa nữ'],
      orders: [
        {
          orderId: 'POSH-99214',
          title: 'Váy ngủ lụa satin phối ren cao cấp quyến rũ',
          sku: 'Màu Đỏ Rượu • Size S',
          price: '680.000 đ',
          status: 'Giao hàng thành công',
          recipient: 'Người nhận: Thu Hương (0988***123)',
          deliveryAddress: 'Phòng 402, Tòa nhà Golden Palm, Hà Nội',
          isClue: true,
          suspectName: 'Hương Đồng Nghiệp',
        },
        {
          orderId: 'POSH-88120',
          title: 'Củ sạc nhanh điện thoại 65W GaN',
          sku: 'Màu Đen Nhám',
          price: '320.000 đ',
          status: 'Đang vận chuyển',
          recipient: 'Người nhận: Hoàng (0912***456)',
          deliveryAddress: 'Địa chỉ nhà riêng',
        },
      ],
    },
    comms: {
      unreadBadge: 2,
      calls: [
        {
          id: 'call_01',
          name: 'Tổng Đài Viettel (0988***123)',
          type: 'outgoing',
          time: '23:40',
          duration: '1 phút 12 giây',
          suspectName: 'Hương Đồng Nghiệp',
          isClue: true,
        },
        {
          id: 'call_02',
          name: 'Sếp Hùng',
          type: 'incoming',
          time: '20:05',
          duration: '45 giây',
        },
        {
          id: 'call_03',
          name: 'Mẹ',
          type: 'missed',
          time: '17:30',
          duration: 'Cuộc gọi nhỡ',
        },
      ],
      sms: [
        {
          id: 'sms_01',
          sender: 'HOTEL_SEN_VANG',
          text: 'Cam on quy khach da dung bua toi tai Sen Vang Gourmet. Ban so 12, hoa don #882.',
          time: '20:15',
        },
      ],
    },
  },
};

