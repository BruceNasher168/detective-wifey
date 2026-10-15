import type { UniversalEvidenceItem } from '../../features/investigation';
import type { EvidenceReference, PosheeOrder } from './types';
import { money, orderStatus } from './posheeData';

export interface PosheeEvidenceItem extends UniversalEvidenceItem { suspectId?: string }
export function posheeEvidence(caseId: string, sourceRecordId: string, title: string, snippet: string, reference: EvidenceReference = {}): PosheeEvidenceItem {
  return { source: { caseId, recordId: sourceRecordId, title, snippet, clueRefId: reference.clueRefId }, title, snippet, suspectToTag: reference.suspectName ?? '', suspectId: reference.suspectId, subtitle: 'Shopoo' };
}
export function resolveEvidenceAttribution(item: PosheeEvidenceItem, pool: ReadonlyArray<{ suspectId: string; displayName: string }>): PosheeEvidenceItem {
  return { ...item, suspectToTag: item.suspectToTag || pool.find(s => s.suspectId === item.suspectId)?.displayName || '' };
}
export function orderSnippet(order: PosheeOrder): string {
  return [order.orderId, orderStatus(order.status), order.orderDate, order.recipientName, order.recipientPhone, order.shippingAddress,
    ...order.items.map(i => [i.productTitle, i.variantName, `Số lượng: ${i.quantity ?? '—'}`, money(i.price)].filter(Boolean).join('\n')),
    `Thành tiền: ${money(order.totalAmount)}`, `Thanh toán: ${order.paymentMethod ?? '—'}`, order.trackingNumber, order.courier].filter(Boolean).join('\n');
}
