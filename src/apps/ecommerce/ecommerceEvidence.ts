import type { UniversalEvidenceItem } from '../../features/investigation';
import type { EvidenceReference, EcommerceOrder } from './types';
import { money, orderStatus } from './ecommerceData';

export interface EcommerceEvidenceItem extends UniversalEvidenceItem {
  suspectId?: string;
}
export type PosheeEvidenceItem = EcommerceEvidenceItem;

export function ecommerceEvidence(
  caseId: string,
  sourceRecordId: string,
  title: string,
  snippet: string,
  reference: EvidenceReference = {}
): EcommerceEvidenceItem {
  return {
    source: { caseId, recordId: sourceRecordId, title, snippet, clueRefId: reference.clueRefId, direction: 'incoming' },
    title,
    snippet,
    suspectToTag: reference.suspectName ?? '',
    suspectId: reference.suspectId,
    subtitle: 'Mua sắm',
    direction: 'incoming',
  };
}

export const posheeEvidence = ecommerceEvidence;

export function resolveEvidenceAttribution(
  item: EcommerceEvidenceItem,
  pool: ReadonlyArray<{ suspectId: string; displayName: string }>
): EcommerceEvidenceItem {
  return {
    ...item,
    suspectToTag:
      item.suspectToTag || pool.find((s) => s.suspectId === item.suspectId)?.displayName || '',
  };
}

export function orderSnippet(order: EcommerceOrder): string {
  return [
    order.orderId,
    orderStatus(order.status),
    order.orderDate,
    order.recipientName,
    order.recipientPhone,
    order.shippingAddress,
    ...order.items.map((i) =>
      [i.productTitle, i.variantName, `Số lượng: ${i.quantity ?? '—'}`, money(i.price)]
        .filter(Boolean)
        .join('\n')
    ),
    `Thành tiền: ${money(order.totalAmount)}`,
    `Thanh toán: ${order.paymentMethod ?? '—'}`,
    order.trackingNumber,
    order.courier,
  ]
    .filter(Boolean)
    .join('\n');
}

