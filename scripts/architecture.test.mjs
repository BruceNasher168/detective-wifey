import assert from 'node:assert/strict';
import { test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { boundaryViolation } from './architecture.mjs';

const src = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src');
const check = (from, to) => boundaryViolation(path.join(src, from), path.join(src, to));

test('apps reuse shared primitives and public evidence UI', () => {
  assert.equal(check('apps/banking/BankingApp.tsx', 'shared/ui/BottomSheet.tsx'), null);
  assert.equal(check('apps/banking/BankingApp.tsx', 'features/investigation/index.ts'), null);
});

test('apps cannot import sibling apps or private gameplay modules', () => {
  assert.ok(check('apps/banking/BankingApp.tsx', 'apps/ecommerce/index.ts'));
  assert.ok(check('apps/banking/BankingApp.tsx', 'features/investigation/tagSuspect.ts'));
  assert.ok(check('apps/banking/BankingApp.tsx', 'features/session/index.ts'));
});

test('shell and shared modules cannot acquire gameplay/storage dependencies', () => {
  assert.ok(check('shell/PhoneShell.tsx', 'features/session/localStorageAdapter.ts'));
  assert.ok(check('shared/ui/BottomSheet.tsx', 'features/investigation/index.ts'));
});

test('coordinator and bootstrap use feature public APIs', () => {
  assert.equal(check('features/play-session/playSession.ts', 'features/session/index.ts'), null);
  assert.equal(check('bootstrap/GameRoot.tsx', 'apps/banking/index.ts'), null);
  assert.ok(check('features/play-session/playSession.ts', 'features/session/localStorageAdapter.ts'));
  assert.ok(check('bootstrap/GameRoot.tsx', 'apps/banking/bankingData.ts'));
});
