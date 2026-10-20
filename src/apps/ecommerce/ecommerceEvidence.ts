import type { UniversalEvidenceItem } from '../../features/investigation';
import type { EvidenceReference, EcommerceOrder } from './types';
import { money } from './ecommerceData';

export interface EcommerceEvidenceItem extends UniversalEvidenceItem {
  suspectId?: string;
}
export type PosheeEvidenceItem = EcommerceEvidenceItem;

export function ecommerceEvidence(
  caseId: string,
  sourceRecordId: string,
  title: string,
  snippet: string,
  reference: EvidenceReference & { recipientName?: string } = {},
  timestamp?: string,
  kind?: UniversalEvidenceItem['kind'],
): EcommerceEvidenceItem {
  const subtitle = timestamp ? `Thời gian: ${timestamp}` : undefined;
  return {
    source: { caseId, recordId: sourceRecordId, title, snippet, subtitle, rawTimestamp: timestamp, clueRefId: reference.clueRefId, direction: 'incoming', kind,
      ...(kind === 'order' ? { suspectId: reference.suspectId, visibleAlias: reference.recipientName } : {}),
    },
    title,
    kind,
    snippet,
    suspectToTag: reference.suspectName ?? '',
    suspectId: reference.suspectId,
    subtitle,
    rawTimestamp: timestamp,
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
    ...order.items.map((item) =>
      `Sản phẩm: ${item.quantity ?? '-'} ${item.productTitle ?? '-'}${item.variantName ? ` - ${item.variantName}` : ''}`
    ),
    order.shippingAddress && `Địa chỉ: ${order.shippingAddress}`,
    order.recipientPhone && `Số điện thoại: ${order.recipientPhone}`,
    `Thành tiền: ${money(order.totalAmount)}`,
  ]
    .filter(Boolean)
    .join('\n');
}
