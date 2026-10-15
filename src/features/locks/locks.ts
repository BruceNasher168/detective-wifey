import type { AppId } from '../../shared/contracts/app-contracts';
import type { LockChallenge } from '../../shared/contracts/case-schema';

export function findAppChallenge(challenges: readonly LockChallenge[], appId: AppId) {
  return challenges.find(challenge => challenge.targetType === 'app' && challenge.targetId === appId);
}

