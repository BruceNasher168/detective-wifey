export type ProductArtworkTile = {
  sheet: 'catalog' | 'orders';
  index: number;
};

export const PRODUCT_ARTWORK_TILES: Record<string, ProductArtworkTile> = {
  dress: { sheet: 'catalog', index: 0 },
  perfume: { sheet: 'catalog', index: 1 },
  mouse: { sheet: 'catalog', index: 2 },
  spray: { sheet: 'catalog', index: 3 },
  phone: { sheet: 'catalog', index: 4 },
  trousers: { sheet: 'catalog', index: 5 },
  sponge: { sheet: 'catalog', index: 6 },
  catfood: { sheet: 'catalog', index: 7 },
  polo: { sheet: 'catalog', index: 8 },
  controller: { sheet: 'catalog', index: 9 },
  'case-polo-blue': { sheet: 'catalog', index: 10 },
  'case-trash-bags': { sheet: 'catalog', index: 11 },
  'case-dress-set': { sheet: 'catalog', index: 12 },
  'case-wax-flowers': { sheet: 'catalog', index: 13 },
  'case-desk-lamp': { sheet: 'catalog', index: 14 },
  'case-coffee-beans': { sheet: 'catalog', index: 15 },
  'case-mechanical-keyboard': { sheet: 'orders', index: 0 },
  'case-cable-ties': { sheet: 'orders', index: 1 },
  'case-clothes-hangers': { sheet: 'orders', index: 2 },
  'case-potting-soil': { sheet: 'orders', index: 3 },
  'case-mousepad': { sheet: 'orders', index: 4 },
  'case-coffee-filters': { sheet: 'orders', index: 5 },
  'case-water-bottle': { sheet: 'orders', index: 6 },
  'case-laptop-stand': { sheet: 'orders', index: 7 },
  'case-paper': { sheet: 'orders', index: 8 },
  'case-soccer-laces': { sheet: 'orders', index: 9 },
  'case-food-containers': { sheet: 'orders', index: 10 },
  'case-kitchen-cloths': { sheet: 'orders', index: 11 },
  'case-technical-book': { sheet: 'orders', index: 12 },
  'case-usb-cable': { sheet: 'orders', index: 13 },
  'case-sports-socks': { sheet: 'orders', index: 14 },
  'case-detergent': { sheet: 'orders', index: 15 },
};

const artworkByProductTitle: Record<string, string> = {
  'ao polo nam': 'case-polo-blue',
  'tui rac': 'case-trash-bags',
  'set vay lua cong so': 'case-dress-set',
  'lang hoa sap': 'case-wax-flowers',
  'den hoc': 'case-desk-lamp',
  'ca phe hat': 'case-coffee-beans',
  'ban phim co': 'case-mechanical-keyboard',
  'day rut': 'case-cable-ties',
  'moc phoi quan ao': 'case-clothes-hangers',
  'dat trong cay': 'case-potting-soil',
  'mieng lot chuot': 'case-mousepad',
  'tui loc ca phe': 'case-coffee-filters',
  'binh nuoc': 'case-water-bottle',
  'gia do laptop': 'case-laptop-stand',
  'giay in a4': 'case-paper',
  'day giay bong da': 'case-soccer-laces',
  'hop dung thuc pham': 'case-food-containers',
  'khan lau bep': 'case-kitchen-cloths',
  'sach ky thuat': 'case-technical-book',
  'cap sac usb c': 'case-usb-cable',
  'tat the thao': 'case-sports-socks',
  'bot giat': 'case-detergent',
};

const normalizeTitle = (title: string) =>
  title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLocaleLowerCase('vi')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export function productArtworkForTitle(title?: string) {
  return title ? artworkByProductTitle[normalizeTitle(title)] : undefined;
}
