import { IoChevronForward, IoLockClosedOutline, IoWalletOutline } from 'react-icons/io5';
import { StoryEvidenceTarget } from '../../../components/StoryEvidenceTarget';
import type { UniversalEvidenceItem } from '../../../components/UniversalEvidenceModal';
import type { CaseConfig } from '../../../types/case-schema';
import { bankingEvidence } from '../bankingEvidence';
import { bankingVaultChallenge } from '../bankingData';
import type { BankingVault } from '../types';

interface BankingVaultsProps {
  caseData: CaseConfig;
  vaults: BankingVault[];
  unlockedChallenges: Set<string>;
  onSelect: (vault: BankingVault) => void;
  onEvidence: (item: UniversalEvidenceItem) => void;
}

export function BankingVaults({ caseData, vaults, unlockedChallenges, onSelect, onEvidence }: BankingVaultsProps) {
  return (
    <section aria-label="Hũ quỹ" className="space-y-3 p-4">
      {vaults.map(vault => {
        const challenge = bankingVaultChallenge(caseData, vault);
        const locked = caseData.levelNumber > 1 && Boolean(vault.lockChallengeId || challenge) && (!challenge || !unlockedChallenges.has(challenge.challengeId));
        const card = <button type="button" onClick={() => onSelect(vault)} className="bank-control flex w-full items-start gap-3 rounded-[14px] border border-[#E5E7EB] bg-white p-4 text-left">
          {locked ? <IoLockClosedOutline aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-[#6B7280]" /> : <IoWalletOutline aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-[#B71C1C]" />}
          <div className="min-w-0 flex-1">
            <h2 className="break-words text-base font-semibold">{locked ? 'Hũ tiết kiệm được bảo vệ' : vault.name}</h2>
            {locked ? <p className="mt-2 text-ios-footnote text-[#6B7280]">Nhập mã PIN để xem</p> : <>
              <p className="bank-amount mt-3 text-base">Đã tích lũy: {vault.currentAmount}</p>
              <p className="bank-amount mt-1 text-ios-footnote text-[#6B7280]">Mục tiêu: {vault.targetAmount}</p>
            </>}
          </div>
          <IoChevronForward aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#6B7280]" />
        </button>;
        return locked ? <div key={vault.id}>{card}</div> : <StoryEvidenceTarget key={vault.id} item={bankingEvidence(caseData, vault, vault.name, `${vault.name}\nĐã tích lũy: ${vault.currentAmount}\nMục tiêu: ${vault.targetAmount}`)} onTriggerEvidence={onEvidence}>{card}</StoryEvidenceTarget>;
      })}
      {!vaults.length && <p role="status" className="py-10 text-center text-base text-[#6B7280]">Chưa có hũ tiết kiệm.</p>}
    </section>
  );
}

export function BankingVaultDetail({ caseData, vault, onEvidence }: { caseData: CaseConfig; vault: BankingVault; onEvidence: (item: UniversalEvidenceItem) => void }) {
  return (
    <section aria-label="Chi tiết hũ quỹ" className="space-y-5 p-4">
      <StoryEvidenceTarget item={bankingEvidence(caseData, vault, vault.name, `${vault.name}\n${vault.currentAmount}\n${vault.targetAmount}`)} onTriggerEvidence={onEvidence}>
        <div className="rounded-[20px] bg-[#1F242D] p-5 text-white">
          <h2 className="break-words text-xl font-semibold">{vault.name}</h2>
          <p className="bank-amount mt-5 text-base">Đã tích lũy: {vault.currentAmount}</p>
          <p className="bank-amount mt-2 text-ios-footnote">Mục tiêu: {vault.targetAmount}</p>
        </div>
      </StoryEvidenceTarget>
      <h3 className="text-xl font-semibold">Lịch sử nộp tiền</h3>
      {vault.deposits.map(deposit => <StoryEvidenceTarget key={deposit.id} item={bankingEvidence(caseData, { ...deposit, suspectName: deposit.suspectName || vault.suspectName, suspectId: deposit.suspectId || vault.suspectId, clueRefId: deposit.clueRefId || vault.clueRefId }, vault.name, `${deposit.date}\n${deposit.amount}\n${deposit.note}`)} onTriggerEvidence={onEvidence}>
        <div className="rounded-[14px] border border-[#E5E7EB] bg-white p-4">
          <p className="break-words text-ios-footnote text-[#6B7280]">{deposit.date}</p>
          <p className="bank-amount mt-2 text-base font-semibold">{deposit.amount}</p>
          <p className="mt-2 whitespace-pre-wrap break-words text-base leading-relaxed">{deposit.note || '—'}</p>
        </div>
      </StoryEvidenceTarget>)}
      {!vault.deposits.length && <p role="status" className="py-6 text-base text-[#6B7280]">Chưa có lịch sử nộp tiền.</p>}
    </section>
  );
}
