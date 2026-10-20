import { IoBagHandleOutline, IoOptionsOutline, IoLocationOutline, IoCallOutline, IoCashOutline } from 'react-icons/io5';

const fieldIcons = {
  'Sản phẩm': IoBagHandleOutline,
  'Phân loại': IoOptionsOutline,
  'Địa chỉ': IoLocationOutline,
  'Số điện thoại': IoCallOutline,
  'Thành tiền': IoCashOutline,
};

export function EvidenceSnippet({ text, fieldIconsEnabled = false }: { text: string; fieldIconsEnabled?: boolean }) {
  if (!fieldIconsEnabled) return <>{text}</>;

  return <span className="flex flex-col gap-1 not-italic">
    {text.split('\n').map((line, index) => {
      const separator = line.indexOf(': ');
      const label = line.slice(0, separator);
      const Icon = fieldIcons[label as keyof typeof fieldIcons];
      return Icon ? <span key={index} className="flex items-start gap-1.5">
        <Icon aria-hidden="true" title={label} className="mt-0.5 h-[1em] w-[1em] shrink-0 opacity-60" />
        <span className="min-w-0"><span className="sr-only">{label}: </span>{line.slice(separator + 2)}</span>
      </span> : <span key={index}>{line}</span>;
    })}
  </span>;
}
