import { readMessagingData } from '../apps/internet-messaging/data';
import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import { loadCase } from '../features/case-runtime';

describe('Story JSON Data Ingestion & Evidence Long-Press Target Suite', () => {
  it('confirms all chat content is 100% loaded from story JSON and maps to evidence targets', () => {
    const case1 = loadCase('case_01');
    const zolaData = readMessagingData(case1.appsData['internet-messaging']);

    assert.ok(zolaData, 'internet-messaging data must exist in case_01');
    const threads = zolaData.threads!;
    assert.ok(threads && threads.length > 0, 'Threads must exist in story JSON');

    const tuanThread = threads.find((t) => t.contactName === 'Anh Tuấn Thợ Điện');
    assert.ok(tuanThread, 'Anh Tuan thread must exist');
    assert.ok(tuanThread.messages && tuanThread.messages.length >= 6, 'Must contain full message sequence');

    // Verify key narrative messages exist in JSON
    const deployment = tuanThread.messages.find((m) => (m.timestamp || m.time).includes('15/10') && (m.timestamp || m.time).includes('15:20'));
    assert.ok(deployment);
    assert.ok(deployment?.text.includes('đồ nghề'), 'Preparation must precede the dinner');
    assert.equal(deployment.clueRefId, '', 'Context alone must not create an extra clue');
    const dinner = tuanThread.messages.find((m) => (m.timestamp || m.time).includes('15/10') && (m.timestamp || m.time).includes('16:42'));
    assert.ok(dinner);
    assert.ok(dinner?.text.includes('19h30'), 'Dinner must retain its scheduled time');
    assert.ok(dinner?.text.includes('Phố Cổ'), 'Dinner must identify the restaurant venue');
    assert.equal(dinner.clueRefId, 'CLUE-ZOLA-07');
    const celebration = tuanThread.messages.find((m) => (m.timestamp || m.time).includes('15/10') && (m.timestamp || m.time).includes('16:45'));
    assert.ok(celebration);
    assert.ok(celebration?.text.toLowerCase().includes('tròn 1 tháng'), 'Celebration must link to the 1-month milestone');
    assert.equal(celebration.clueRefId, dinner.clueRefId, 'Related messages share one clue identity');
    const wife = threads.find((t) => t.threadId === 'thread_wife');
    assert.ok(wife, 'The alibi must be readable in the wife conversation');
    assert.ok(wife.messages.find(m => (m.timestamp || m.time).includes('15/10') && (m.timestamp || m.time).includes('20:46'))?.text.includes('phòng họp'));
    const returnedCoat = tuanThread.messages.find((m) => (m.timestamp || m.time).includes('15/10') && (m.timestamp || m.time).includes('23:44'));
    assert.equal(returnedCoat?.text, 'Đồ anh để quên em cất rồi, mai em mang qua nhé.');
    assert.equal(returnedCoat.clueRefId, '', 'Trigger notification is context, not a separate clue');
    assert.ok(tuanThread.messages.every(m => !m.locationData), 'No hotel location shortcut survives');

    console.log('[PASS] All chat contents confirmed to be 100% loaded from story JSON (src/data/cases/hoang/level_01.json).');
  });
});

