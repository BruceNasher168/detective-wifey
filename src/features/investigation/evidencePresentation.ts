import type { UniversalEvidenceItem } from '../../shared/contracts/evidence';

// Preserve supplied precision and wall-clock time; never infer missing dates from today's clock.
export function formatEvidenceSubtitle(item: UniversalEvidenceItem): string {
  const date = item.eventDate ?? item.source?.eventDate;
  const time = item.eventTime ?? item.source?.eventTime;
  const raw = item.rawTimestamp ?? item.source?.rawTimestamp;
  const value = item.subtitle || item.source?.subtitle || [date, time].filter(Boolean).join(' · ') || String(raw ?? '');
  return value
    .replace(/^Thời gian:\s*/i, '')
    .replace(/\s*[•·]\s*Người gửi:.*$/i, '')
    .replace(/\b(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?\b/g,
      (_, year, month, day, hour, minute) => `${day}/${month}/${year}${hour ? ` · ${hour}:${minute}` : ''}`)
    .replace(/\b(\d{1,2})\/(\d{1,2})(\/\d{4})?(?:[\s·•]+(\d{1,2}):(\d{2})(?::\d{2})?)?\b/g,
      (_, day, month, year, hour, minute) => `${day.padStart(2, '0')}/${month.padStart(2, '0')}${year || ''}${hour ? ` · ${hour.padStart(2, '0')}:${minute}` : ''}`)
    .replace(/\b(\d{1,2}):(\d{2})\b/g, (_, hour, minute) => `${hour.padStart(2, '0')}:${minute}`);
}
