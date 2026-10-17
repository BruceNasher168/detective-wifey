import {
  IoQrCodeOutline,
  IoWalletOutline,
  IoTicketOutline,
  IoGiftOutline,
  IoShirtOutline,
  IoSparklesOutline,
  IoLaptopOutline,
  IoHomeOutline,
  IoPricetagOutline,
  IoPersonCircleOutline,
  IoSettingsOutline,
  IoCubeOutline,
  IoCarOutline,
  IoStarOutline,
  IoChevronForward,
  IoStar,
  IoLocationOutline,
} from 'react-icons/io5';
import { DisabledControl, EmptyState, Thumbnail } from './EcommerceChrome';
import type { EcommerceData } from '../types';
import { money } from '../ecommerceData';

const services = [
  { title: 'Thời trang', icon: IoShirtOutline },
  { title: 'Mỹ phẩm', icon: IoSparklesOutline },
  { title: 'Công nghệ', icon: IoLaptopOutline },
  { title: 'Gia dụng', icon: IoHomeOutline },
  { title: 'Siêu Rẻ', icon: IoPricetagOutline },
  { title: 'Kho Mã', icon: IoTicketOutline },
];

export function EcommerceHomeView({ data }: { data: EcommerceData }) {
  return (
    <>
      <section className="ecommerce-card ecommerce-quick" aria-label="Dịch vụ nhanh">
        {[
          { title: 'Quét mã', icon: IoQrCodeOutline },
          { title: 'Ví điện tử', icon: IoWalletOutline },
          { title: 'Điểm danh nhận Xu', icon: IoGiftOutline },
          { title: 'Voucher', icon: IoTicketOutline },
        ].map((s) => (
          <DisabledControl key={s.title}>
            <s.icon />
            <span>{s.title}</span>
          </DisabledControl>
        ))}
      </section>
      <section className="ecommerce-services" aria-label="Danh mục">
        {services.map((s) => (
          <DisabledControl key={s.title}>
            <s.icon />
            <span>{s.title}</span>
          </DisabledControl>
        ))}
      </section>
      <section className="ecommerce-promos" aria-label="Khuyến mãi">
        <DisabledControl>
          <small>FLASH SALE GIỜ VÀNG</small>
          <strong>
            HÀNG NGÀN
            <br />
            DEAL SỐC
          </strong>
          <span>MUA NGAY</span>
        </DisabledControl>
        <DisabledControl>
          <IoGiftOutline />
          <strong>
            MỞ DEAL
            <br />
            MÊ LY
          </strong>
          <span>XEM NGAY</span>
        </DisabledControl>
        <DisabledControl>
          <small>SIÊU RẺ CHỈ TỪ</small>
          <strong>
            1.000
            <br />
            ĐỒNG
          </strong>
          <span>MUA NGAY</span>
        </DisabledControl>
      </section>
      <h2>Gợi ý hôm nay</h2>
      {data.products.length ? (
        <section className="ecommerce-products">
          {data.products.map((product, index) => (
            <article className="ecommerce-card ecommerce-product" key={index}>
              <div className="ecommerce-product-image">
                <Thumbnail url={product.thumbnailUrl} artwork={product.artwork} />
                {product.discount && <span className="ecommerce-discount">{product.discount}</span>}
                <span className="ecommerce-voucher-strip">
                  15.10 <b>VOUCHER XTRA</b>
                </span>
              </div>
              <p>{product.productTitle ?? '—'}</p>
              <p className="ecommerce-meta">{product.variantName}</p>
              <div className="ecommerce-product-rating">
                {product.rating && (
                  <span>
                    <IoStar />
                    {product.rating}
                  </span>
                )}
              </div>
              <div className="ecommerce-product-price">
                <strong className="ecommerce-price">{money(product.price)}</strong>
                {product.sold && <small>{product.sold}</small>}
              </div>
              {product.location && (
                <p className="ecommerce-product-location">
                  <IoLocationOutline />
                  {product.location}
                </p>
              )}
            </article>
          ))}
        </section>
      ) : (
        <EmptyState>Chưa có sản phẩm được cung cấp.</EmptyState>
      )}
    </>
  );
}

export const PosheeHomeView = EcommerceHomeView;

export function EcommerceProfileView({
  data,
  onOrders,
}: {
  data: EcommerceData;
  onOrders: () => void;
}) {
  const p = data.profile;
  return (
    <>
      <section className="ecommerce-profile">
        <div className="ecommerce-profile-name">
          <IoPersonCircleOutline aria-hidden="true" />
          <div>
            <h2>{p?.username ?? '—'}</h2>
            <p>{p?.membership ?? '—'}</p>
          </div>
          <DisabledControl label="Cài đặt">
            <IoSettingsOutline />
          </DisabledControl>
        </div>
        <p>
          Đang theo dõi: {p?.following ?? '—'} | Người theo dõi: {p?.followers ?? '—'}
        </p>
        <p className="ecommerce-vip">Hội viên VIP · Tiết kiệm: {money(p?.savings)}</p>
      </section>
      <section className="ecommerce-card">
        <div className="ecommerce-row ecommerce-section-heading">
          <h2>Đơn mua</h2>
          <button type="button" onClick={onOrders}>
            Xem lịch sử mua hàng <IoChevronForward />
          </button>
        </div>
        <div className="ecommerce-pipeline">
          {[
            { title: 'Chờ xác nhận', icon: IoWalletOutline },
            { title: 'Chờ lấy hàng', icon: IoCubeOutline },
            { title: 'Chờ giao hàng', icon: IoCarOutline },
            { title: 'Đánh giá', icon: IoStarOutline },
          ].map((s) => (
            <DisabledControl key={s.title}>
              <s.icon />
              <span>{s.title}</span>
            </DisabledControl>
          ))}
        </div>
        <DisabledControl>Đơn Nạp điện thoại &amp; Thẻ cào</DisabledControl>
        <DisabledControl>Đơn Giao Hỏa Tốc</DisabledControl>
      </section>
      <section
        className="ecommerce-card ecommerce-services ecommerce-profile-services"
        aria-label="Ưu đãi của tôi"
      >
        {['Trang Chính Sale', 'Hội viên VIP', 'Mã Hoàn Xu', 'Kho Voucher'].map((s) => (
          <DisabledControl key={s}>
            <IoTicketOutline />
            <span>{s}</span>
          </DisabledControl>
        ))}
      </section>
      <section className="ecommerce-card ecommerce-utilities">
        <h2>Tiện ích của tôi</h2>
        <DisabledControl>
          <IoWalletOutline />Ví điện tử · {money(p?.walletBalance)}
        </DisabledControl>
        <DisabledControl>
          <IoGiftOutline />Xu tích lũy · {p?.coins ?? '—'}
        </DisabledControl>
        <DisabledControl>
          <IoTicketOutline />Kho Voucher · {p?.voucherCount ?? '—'}
        </DisabledControl>
      </section>
      <section className="ecommerce-card">
        <h2>Tiện ích khác</h2>
        <DisabledControl>Shop của tôi</DisabledControl>
        <DisabledControl>Khách hàng thân thiết</DisabledControl>
      </section>
    </>
  );
}

export const PosheeProfileView = EcommerceProfileView;
