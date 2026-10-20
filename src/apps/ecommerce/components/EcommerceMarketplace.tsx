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
  IoBagHandleOutline,
  IoCubeOutline,
  IoCarOutline,
  IoStarOutline,
  IoStar,
  IoLocationOutline,
} from 'react-icons/io5';
import { DisabledControl, EmptyState, Thumbnail } from './EcommerceChrome';
import type { EcommerceData, EcommerceProfileQueue, OrderFilter } from '../types';
import { money } from '../ecommerceData';

const services = [
  { title: 'Thời trang', icon: IoShirtOutline },
  { title: 'Mỹ phẩm', icon: IoSparklesOutline },
  { title: 'Công nghệ', icon: IoLaptopOutline },
  { title: 'Gia dụng', icon: IoHomeOutline },
  { title: 'Siêu Rẻ', icon: IoPricetagOutline },
  { title: 'Kho Mã', icon: IoTicketOutline },
];

const orderPipeline = [
  { title: 'Tất cả đơn', queue: 'all', icon: IoBagHandleOutline },
  { title: 'Chờ xác nhận', queue: 'awaiting_confirmation', icon: IoWalletOutline },
  { title: 'Chờ lấy hàng', queue: 'awaiting_pickup', icon: IoCubeOutline },
  { title: 'Chờ giao hàng', queue: 'awaiting_delivery', icon: IoCarOutline },
  { title: 'Đánh giá', queue: 'awaiting_review', icon: IoStarOutline },
] as const satisfies ReadonlyArray<{
  title: string;
  queue: OrderFilter;
  icon: typeof IoBagHandleOutline;
}>;

const otherOrderQueues = [
  { title: 'Đơn Nạp điện thoại & Thẻ cào', queue: 'mobile_topup' },
  { title: 'Đơn Giao Hỏa Tốc', queue: 'express_delivery' },
] as const satisfies ReadonlyArray<{ title: string; queue: EcommerceProfileQueue }>;

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
              <p>{product.productTitle ?? '-'}</p>
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
  onOrders: (filter: OrderFilter) => void;
}) {
  const p = data.profile;
  return (
    <>
      <section className="ecommerce-profile">
        <div className="ecommerce-profile-name">
          <IoPersonCircleOutline aria-hidden="true" />
          <div>
            <h2>{p?.username ?? '-'}</h2>
            <p>{p?.membership ?? '-'}</p>
          </div>
          <DisabledControl label="Cài đặt">
            <IoSettingsOutline />
          </DisabledControl>
        </div>
        <p>
          Đang theo dõi: {p?.following ?? '-'} | Người theo dõi: {p?.followers ?? '-'}
        </p>
        <p className="ecommerce-vip">Hội viên VIP · Tiết kiệm: {money(p?.savings)}</p>
      </section>
      <section className="ecommerce-card">
        <div className="ecommerce-row ecommerce-section-heading">
          <h2>Đơn mua</h2>
        </div>
        <div className="ecommerce-pipeline">
          {orderPipeline.map((shortcut) => {
            const Icon = shortcut.icon;
            const hasData =
              shortcut.queue === 'all'
                ? data.orders.length > 0
                : data.orders.some((order) => order.profileQueues?.includes(shortcut.queue));
            return hasData ? (
              <button
                key={shortcut.queue}
                type="button"
                className={`ecommerce-profile-order-shortcut${shortcut.queue === 'all' ? ' is-all-orders' : ''}`}
                onClick={() => onOrders(shortcut.queue)}
              >
                <Icon aria-hidden="true" />
                <span>{shortcut.title}</span>
              </button>
            ) : (
              <DisabledControl key={shortcut.queue}>
                <Icon aria-hidden="true" />
                <span>{shortcut.title}</span>
              </DisabledControl>
            );
          })}
        </div>
        <div className="ecommerce-profile-order-queues">
          {otherOrderQueues.map((shortcut) => {
            const hasData = data.orders.some((order) => order.profileQueues?.includes(shortcut.queue));
            return hasData ? (
              <button
                key={shortcut.queue}
                type="button"
                className="ecommerce-profile-order-type"
                onClick={() => onOrders(shortcut.queue)}
              >
                {shortcut.title}
              </button>
            ) : (
              <DisabledControl key={shortcut.queue}>{shortcut.title}</DisabledControl>
            );
          })}
        </div>
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
          <IoGiftOutline />Xu tích lũy · {p?.coins ?? '-'}
        </DisabledControl>
        <DisabledControl>
          <IoTicketOutline />Kho Voucher · {p?.voucherCount ?? '-'}
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
