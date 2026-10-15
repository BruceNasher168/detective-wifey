import { IoQrCodeOutline, IoWalletOutline, IoTicketOutline, IoGiftOutline, IoShirtOutline, IoSparklesOutline, IoLaptopOutline, IoHomeOutline, IoPricetagOutline, IoPersonCircleOutline, IoSettingsOutline, IoCubeOutline, IoCarOutline, IoStarOutline, IoChevronForward } from 'react-icons/io5';
import { DisabledControl, EmptyState, Thumbnail } from './PosheeChrome';
import type { PosheeData } from '../types';
import { money } from '../posheeData';

const services = [{ title: 'Thời trang', icon: IoShirtOutline }, { title: 'Mỹ phẩm', icon: IoSparklesOutline }, { title: 'Công nghệ', icon: IoLaptopOutline }, { title: 'Gia dụng', icon: IoHomeOutline }, { title: 'Siêu Rẻ', icon: IoPricetagOutline }, { title: 'Kho Mã', icon: IoTicketOutline }];
export function PosheeHomeView({ data }: { data: PosheeData }) {
  return <>
    <section className="poshee-card poshee-quick" aria-label="Dịch vụ nhanh">{[{ title: 'Quét mã', icon: IoQrCodeOutline }, { title: 'PosheePay', icon: IoWalletOutline }, { title: 'Điểm danh nhận Xu', icon: IoGiftOutline }, { title: 'Voucher', icon: IoTicketOutline }].map(s => <DisabledControl key={s.title}><s.icon /><span>{s.title}</span></DisabledControl>)}</section>
    <section className="poshee-services" aria-label="Danh mục">{services.map(s => <DisabledControl key={s.title}><s.icon /><span>{s.title}</span></DisabledControl>)}</section>
    <section className="poshee-promos" aria-label="Khuyến mãi">{['GIỜ VÀNG', 'QUÀ BÍ MẬT', 'ĐỒNG GIÁ'].map(title => <DisabledControl key={title}><IoGiftOutline /><strong>{title}</strong><span>Xem ưu đãi</span></DisabledControl>)}</section>
    <h2>Khám phá</h2>
    {data.products.length ? <section className="poshee-products">{data.products.map((product, index) => <article className="poshee-card" key={index}><Thumbnail url={product.thumbnailUrl} /><p>{product.productTitle ?? '—'}</p><p>{product.variantName}</p><strong className="poshee-price">{money(product.price)}</strong></article>)}</section> : <EmptyState>Chưa có sản phẩm được cung cấp.</EmptyState>}
  </>;
}
export function PosheeProfileView({ data, onOrders }: { data: PosheeData; onOrders: () => void }) {
  const p = data.profile;
  return <>
    <section className="poshee-profile"><div className="poshee-profile-name"><IoPersonCircleOutline aria-hidden="true" /><div><h2>{p?.username ?? '—'}</h2><p>{p?.membership ?? '—'}</p></div><DisabledControl label="Cài đặt"><IoSettingsOutline /></DisabledControl></div>
      <p>Đang theo dõi: {p?.following ?? '—'} | Người theo dõi: {p?.followers ?? '—'}</p><p className="poshee-vip">PosheeVIP · Tiết kiệm: {money(p?.savings)}</p></section>
    <section className="poshee-card"><h2>Đơn mua</h2><button type="button" className="poshee-row" onClick={onOrders}>Xem lịch sử mua hàng <IoChevronForward /></button>
      <div className="poshee-pipeline">{[{ title: 'Chờ xác nhận', icon: IoWalletOutline }, { title: 'Chờ lấy hàng', icon: IoCubeOutline }, { title: 'Chờ giao hàng', icon: IoCarOutline }, { title: 'Đánh giá', icon: IoStarOutline }].map(s => <DisabledControl key={s.title}><s.icon /><span>{s.title}</span></DisabledControl>)}</div>
      <DisabledControl>Đơn Nạp điện thoại &amp; Thẻ cào</DisabledControl><DisabledControl>Đơn Giao Hỏa Tốc</DisabledControl></section>
    <section className="poshee-card poshee-services" aria-label="Ưu đãi của tôi">{['Trang Chính Sale', 'PosheeVIP', 'Mã Hoàn Xu', 'Kho Voucher'].map(s => <DisabledControl key={s}><IoTicketOutline /><span>{s}</span></DisabledControl>)}</section>
    <section className="poshee-card"><h2>Tiện ích của tôi</h2><DisabledControl>Ví PosheePay · {money(p?.walletBalance)}</DisabledControl><DisabledControl>Poshee Xu · {p?.coins ?? '—'}</DisabledControl><DisabledControl>Kho Voucher · {p?.voucherCount ?? '—'}</DisabledControl></section>
    <section className="poshee-card"><h2>Tiện ích khác</h2><DisabledControl>Shop của tôi</DisabledControl><DisabledControl>Khách hàng thân thiết</DisabledControl></section>
  </>;
}
