import { IoQrCodeOutline, IoWalletOutline, IoTicketOutline, IoGiftOutline, IoShirtOutline, IoSparklesOutline, IoLaptopOutline, IoHomeOutline, IoPricetagOutline, IoPersonCircleOutline, IoSettingsOutline, IoCubeOutline, IoCarOutline, IoStarOutline, IoChevronForward, IoStar, IoLocationOutline } from 'react-icons/io5';
import { DisabledControl, EmptyState, Thumbnail } from './PosheeChrome';
import type { PosheeData } from '../types';
import { money } from '../posheeData';

const services = [{ title: 'Thời trang', icon: IoShirtOutline }, { title: 'Mỹ phẩm', icon: IoSparklesOutline }, { title: 'Công nghệ', icon: IoLaptopOutline }, { title: 'Gia dụng', icon: IoHomeOutline }, { title: 'Siêu Rẻ', icon: IoPricetagOutline }, { title: 'Kho Mã', icon: IoTicketOutline }];
export function PosheeHomeView({ data }: { data: PosheeData }) {
  return <>
    <section className="poshee-card poshee-quick" aria-label="Dịch vụ nhanh">{[{ title: 'Quét mã', icon: IoQrCodeOutline }, { title: 'ShopooPay', icon: IoWalletOutline }, { title: 'Điểm danh nhận Xu', icon: IoGiftOutline }, { title: 'Voucher', icon: IoTicketOutline }].map(s => <DisabledControl key={s.title}><s.icon /><span>{s.title}</span></DisabledControl>)}</section>
    <section className="poshee-services" aria-label="Danh mục">{services.map(s => <DisabledControl key={s.title}><s.icon /><span>{s.title}</span></DisabledControl>)}</section>
    <section className="poshee-promos" aria-label="Khuyến mãi"><DisabledControl><small>FLASH SALE GIỜ VÀNG</small><strong>HÀNG NGÀN<br />DEAL SỐC</strong><span>MUA NGAY</span></DisabledControl><DisabledControl><IoGiftOutline /><strong>MỞ DEAL<br />MÊ LY</strong><span>XEM NGAY</span></DisabledControl><DisabledControl><small>SIÊU RẺ CHỈ TỪ</small><strong>1.000<br />ĐỒNG</strong><span>MUA NGAY</span></DisabledControl></section>
    <h2>Khám phá</h2>
    {data.products.length ? <section className="poshee-products">{data.products.map((product, index) => <article className="poshee-card poshee-product" key={index}><div className="poshee-product-image"><Thumbnail url={product.thumbnailUrl} artwork={product.artwork} />{product.discount && <span className="poshee-discount">{product.discount}</span>}<span className="poshee-voucher-strip">15.10 <b>VOUCHER XTRA</b></span></div><p>{product.productTitle ?? '—'}</p><p className="poshee-meta">{product.variantName}</p><div className="poshee-product-rating">{product.rating && <span><IoStar />{product.rating}</span>}</div><div className="poshee-product-price"><strong className="poshee-price">{money(product.price)}</strong>{product.sold && <small>{product.sold}</small>}</div>{product.location && <p className="poshee-product-location"><IoLocationOutline />{product.location}</p>}</article>)}</section> : <EmptyState>Chưa có sản phẩm được cung cấp.</EmptyState>}
  </>;
}
export function PosheeProfileView({ data, onOrders }: { data: PosheeData; onOrders: () => void }) {
  const p = data.profile;
  return <>
    <section className="poshee-profile"><div className="poshee-profile-name"><IoPersonCircleOutline aria-hidden="true" /><div><h2>{p?.username ?? '—'}</h2><p>{p?.membership ?? '—'}</p></div><DisabledControl label="Cài đặt"><IoSettingsOutline /></DisabledControl></div>
      <p>Đang theo dõi: {p?.following ?? '—'} | Người theo dõi: {p?.followers ?? '—'}</p><p className="poshee-vip">ShopooVIP · Tiết kiệm: {money(p?.savings)}</p></section>
    <section className="poshee-card"><div className="poshee-row poshee-section-heading"><h2>Đơn mua</h2><button type="button" onClick={onOrders}>Xem lịch sử mua hàng <IoChevronForward /></button></div>
      <div className="poshee-pipeline">{[{ title: 'Chờ xác nhận', icon: IoWalletOutline }, { title: 'Chờ lấy hàng', icon: IoCubeOutline }, { title: 'Chờ giao hàng', icon: IoCarOutline }, { title: 'Đánh giá', icon: IoStarOutline }].map(s => <DisabledControl key={s.title}><s.icon /><span>{s.title}</span></DisabledControl>)}</div>
      <DisabledControl>Đơn Nạp điện thoại &amp; Thẻ cào</DisabledControl><DisabledControl>Đơn Giao Hỏa Tốc</DisabledControl></section>
    <section className="poshee-card poshee-services poshee-profile-services" aria-label="Ưu đãi của tôi">{['Trang Chính Sale', 'ShopooVIP', 'Mã Hoàn Xu', 'Kho Voucher'].map(s => <DisabledControl key={s}><IoTicketOutline /><span>{s}</span></DisabledControl>)}</section>
    <section className="poshee-card poshee-utilities"><h2>Tiện ích của tôi</h2><DisabledControl><IoWalletOutline />Ví ShopooPay · {money(p?.walletBalance)}</DisabledControl><DisabledControl><IoGiftOutline />Shopoo Xu · {p?.coins ?? '—'}</DisabledControl><DisabledControl><IoTicketOutline />Kho Voucher · {p?.voucherCount ?? '—'}</DisabledControl></section>
    <section className="poshee-card"><h2>Tiện ích khác</h2><DisabledControl>Shop của tôi</DisabledControl><DisabledControl>Khách hàng thân thiết</DisabledControl></section>
  </>;
}
