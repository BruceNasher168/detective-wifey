import { useMotionState } from '../../shared/motion/useMotionState';
import { useMemo, type ComponentType } from 'react';
import { IoCard, IoChevronBack, IoHomeOutline, IoListOutline, IoLockClosedOutline, IoNotificationsOutline, IoPersonOutline, IoWalletOutline } from 'react-icons/io5';
import type { AppDefinition, VirtualAppProps } from '../../shared/contracts/app-contracts';
import { UniversalEvidenceModal, type UniversalEvidenceItem } from '../../features/investigation';
import { useSwipeBack } from '../../shared/gestures/useSwipeBack';
import { bankingAppChallenge, bankingVaultChallenge, readBankingData } from './bankingData';
import { BankingDashboard, BankingProfile } from './components/BankingDashboard';
import { BankingHistory } from './components/BankingHistory';
import { BankingReceipt } from './components/BankingReceipt';
import { BankingVaultDetail, BankingVaults } from './components/BankingVaults';
import type { BankingTab, BankingTransaction, BankingVault, TransactionFilter } from './types';
import './banking.css';
import bankingLogo from './assets/banking-logo.svg';
import { getAppBrand } from '../../shared/branding';

const BRAND = getAppBrand('banking');

const tabs: { id: BankingTab; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Trang chủ', icon: IoHomeOutline },
  { id: 'history', label: 'Lịch sử', icon: IoListOutline },
  { id: 'vaults', label: 'Hũ quỹ', icon: IoWalletOutline },
  { id: 'profile', label: 'Tôi', icon: IoPersonOutline },
];

export function BankingApp({ caseData, onTagSuspect, onReturnHome, onRequestUnlock, unlockedChallenges }: VirtualAppProps) {
  const rawData: unknown = caseData.appsData?.banking;
  const data = useMemo(() => readBankingData(rawData), [rawData]);
  const [activeTab, setActiveTab] = useMotionState<BankingTab>('home', 'fade');
  const [filter, setFilter] = useMotionState<TransactionFilter>('all', 'fade');
  const [selectedTx, setSelectedTx] = useMotionState<BankingTransaction | null>(null, 'sheet');
  const [selectedVaultId, setSelectedVaultId] = useMotionState<string | null>(null, 'navigation');
  const [evidenceItem, setEvidenceItem] = useMotionState<UniversalEvidenceItem | null>(null, 'sheet');

  const rootChallenge = data ? bankingAppChallenge(caseData, data) : undefined;
  const appLocked = caseData.levelNumber > 1 && Boolean(rootChallenge || data?.isAppLocked) && (!rootChallenge || !unlockedChallenges.has(rootChallenge.challengeId));
  const candidate = data?.vaults.find(vault => vault.id === selectedVaultId);
  const vaultChallenge = candidate ? bankingVaultChallenge(caseData, candidate) : undefined;
  const vaultLocked = caseData.levelNumber > 1 && Boolean(candidate?.lockChallengeId || vaultChallenge) && (!vaultChallenge || !unlockedChallenges.has(vaultChallenge.challengeId));
  const selectedVault = !vaultLocked ? candidate : undefined;

  const navigate = (tab: BankingTab) => {
    setActiveTab(tab);
    setSelectedVaultId(null);
    setSelectedTx(null);
    setEvidenceItem(null);
  };
  const handleBack = () => {
    if (evidenceItem) setEvidenceItem(null);
    else if (selectedTx) setSelectedTx(null);
    else if (selectedVaultId) setSelectedVaultId(null);
    else if (activeTab !== 'home') navigate('home');
    else onReturnHome();
  };
  const swipe = useSwipeBack({ onBack: handleBack, enabled: !selectedTx && !evidenceItem && !selectedVault });
  const vaultSwipe = useSwipeBack({ onBack: () => setSelectedVaultId(null), enabled: Boolean(selectedVault) });
  const selectVault = (vault: BankingVault) => {
    setSelectedVaultId(vault.id);
    const challenge = bankingVaultChallenge(caseData, vault);
    if (challenge && !unlockedChallenges.has(challenge.challengeId)) onRequestUnlock?.(challenge.challengeId);
  };
  const title = appLocked || activeTab === 'home' ? 'Ngân hàng'
    : selectedVault ? 'Chi tiết hũ quỹ' : tabs.find(tab => tab.id === activeTab)?.label || 'Ngân hàng';

  return (
    <div
      {...swipe}
      className="app-banking relative flex h-full min-h-0 w-full flex-col overflow-hidden select-none font-sans"
      onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); handleBack(); } }}
      onKeyDownCapture={event => { if (event.key === 'Escape' && evidenceItem) { event.stopPropagation(); setEvidenceItem(null); } }}
    >
      <div
        className="relative flex h-full min-h-0 w-full flex-col overflow-hidden"
        inert={Boolean(selectedVault)}
        aria-hidden={Boolean(selectedVault)}
      >
        <header className="flex min-h-14 shrink-0 items-center justify-between gap-2 bg-[#ED1C24] px-3 py-1 text-white">
          <button type="button" aria-label={activeTab === 'home' || appLocked ? 'Về màn hình chính' : 'Quay lại'} onClick={handleBack} className="bank-control flex shrink-0 items-center justify-center">
            <IoChevronBack aria-hidden="true" className="h-6 w-6" />
          </button>
          <div className="flex min-w-0 items-center justify-center gap-2">
            <img src={bankingLogo} alt="" aria-hidden="true" draggable={false} className="h-9 w-9 shrink-0" />
            <h1 className="min-w-0 break-words text-center text-xl font-semibold tracking-tight">{title}</h1>
          </div>
          <button type="button" disabled aria-label={`Thông báo${data?.unreadCount ? `: ${data.unreadCount}` : ''}`} className="bank-control relative flex shrink-0 items-center justify-center">
            <IoNotificationsOutline aria-hidden="true" className="h-6 w-6" />
            {!!data?.unreadCount && <span aria-hidden="true" className="absolute right-0 top-0 rounded-full bg-white px-1.5 text-ios-caption-2 font-bold text-[#B71C1C]">{data.unreadCount}</span>}
          </button>
        </header>
        <main key={activeTab} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {!data ? <p role="status" className="p-6 text-center text-base text-[#6B7280]">{BRAND.emptyStateMessage ?? `Chưa có dữ liệu ${BRAND.brandName} cho màn này.`}</p>
            : appLocked ? <section className="space-y-4 p-6 text-center">
              <IoLockClosedOutline aria-hidden="true" className="mx-auto h-10 w-10 text-[#B71C1C]" />
              <h2 className="text-xl font-semibold">{BRAND.lockedMessage ?? `${BRAND.brandName} đang khóa`}</h2>
              <button type="button" disabled={!rootChallenge || !onRequestUnlock} onClick={() => rootChallenge && onRequestUnlock?.(rootChallenge.challengeId)} className="bank-control bg-[#B71C1C] px-4 text-base font-semibold text-white disabled:opacity-40">Mở khóa {BRAND.brandName}</button>
              {!rootChallenge && <p role="status" className="text-ios-footnote text-[#6B7280]">Chưa có cấu hình mở khóa.</p>}
            </section>
            : <>
              {activeTab === 'home' && <BankingDashboard data={data} onOpenHistory={() => navigate('history')} onOpenVaults={() => navigate('vaults')} />}
              {activeTab === 'history' && <BankingHistory caseData={caseData} transactions={data.transactions} filter={filter} onFilter={setFilter} onOpen={setSelectedTx} onEvidence={setEvidenceItem} />}
              {activeTab === 'vaults' && (
                <>
                  <BankingVaults caseData={caseData} vaults={data.vaults} unlockedChallenges={unlockedChallenges} onSelect={selectVault} onEvidence={setEvidenceItem} />
                  {vaultLocked && <p role="status" className="px-4 text-center text-ios-footnote text-[#6B7280]">Hũ tiết kiệm đang khóa.</p>}
                </>
              )}
              {activeTab === 'profile' && <BankingProfile data={data} />}
            </>}
        </main>
        {!appLocked && <nav aria-label={`Điều hướng ${BRAND.brandName}`} className="app-bottom-nav grid grid-cols-4 gap-[8px] border-t border-[#E5E7EB] bg-white p-[8px]">
          {tabs.map(({ id, label, icon: Icon }) => <button type="button" key={id} onClick={() => navigate(id)} aria-current={activeTab === id ? 'page' : undefined} className={`bank-control flex min-w-0 flex-col items-center justify-center gap-1 text-xs font-medium ${activeTab === id ? 'text-[#B71C1C]' : 'text-[#6B7280]'}`}>
            <Icon className="h-6 w-6 shrink-0" /><span className="max-w-full break-words">{label}</span>
          </button>)}
        </nav>}

        {/* Dimmed Scrim Overlay */}
        {selectedVault && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/40 z-10 pointer-events-none transition-opacity duration-200"
          />
        )}
      </div>

      {/* Top Layer: Vault Detail View */}
      {selectedVault && (
        <div
          {...vaultSwipe}
          className="absolute inset-0 z-20 flex flex-col h-full w-full bg-white shadow-2xl overflow-hidden"
        >
          <header className="flex min-h-14 shrink-0 items-center justify-between gap-2 bg-[#ED1C24] px-3 py-1 text-white">
            <button
              type="button"
              aria-label="Quay lại danh sách hũ"
              onClick={() => setSelectedVaultId(null)}
              className="bank-control flex shrink-0 items-center justify-center"
            >
              <IoChevronBack aria-hidden="true" className="h-6 w-6" />
            </button>
            <div className="flex min-w-0 items-center justify-center gap-2">
              <img src={bankingLogo} alt="" aria-hidden="true" draggable={false} className="h-9 w-9 shrink-0" />
              <h1 className="min-w-0 break-words text-center text-xl font-semibold tracking-tight">Chi tiết hũ quỹ</h1>
            </div>
            <div className="w-10" />
          </header>
          <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <BankingVaultDetail caseData={caseData} vault={selectedVault} onEvidence={setEvidenceItem} />
          </main>
        </div>
      )}
      {!appLocked && selectedTx && <BankingReceipt caseData={caseData} transaction={selectedTx} onClose={() => setSelectedTx(null)} onEvidence={setEvidenceItem} evidenceOpen={Boolean(evidenceItem)} />}
      {!appLocked && evidenceItem && <UniversalEvidenceModal isOpen item={evidenceItem} onPinEvidence={suspect => onTagSuspect(suspect, 'banking', evidenceItem.source)} onClose={() => setEvidenceItem(null)} />}
    </div>
  );
}

export const appDefinition: AppDefinition = {
  dataKeys: ['banking'],
  appId: 'banking', displayName: BRAND.brandName, icon: IoCard,
  iconAsset: bankingLogo,
  themeGradient: 'from-[#ED1C24] to-[#B71C1C]', themeColor: '#ED1C24', bottomBarColor: '#FFFFFF',
  notificationBadgeCount: 1, isLocked: false, component: BankingApp,
};
export default BankingApp;
