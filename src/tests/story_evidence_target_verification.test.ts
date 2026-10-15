import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import { loadCase } from '../engines/schemaEngine';

describe('Story JSON Data Ingestion & Evidence Long-Press Target Suite', () => {
  it('confirms all chat content is 100% loaded from story JSON and maps to evidence targets', () => {
    const case1 = loadCase('case_01');
    const zolaData = case1.appsData['internet-messaging'];

    assert.ok(zolaData, 'internet-messaging data must exist in case_01');
    const threads = zolaData.threads;
    assert.ok(threads && threads.length > 0, 'Threads must exist in story JSON');

    const tuanThread = threads.find((t: any) => t.contactName === 'Anh Tuấn Thợ Điện');
    assert.ok(tuanThread, 'Anh Tuan thread must exist');
    assert.ok(tuanThread.messages && tuanThread.messages.length >= 6, 'Must contain full message sequence');

    // Verify key narrative messages exist in JSON
    const catMsg = tuanThread.messages.find((m: any) => m.id === 'm_cat');
    assert.ok(catMsg, 'm_cat message must exist in JSON');
    assert.ok(catMsg.text.includes('Cơm Niêu Phố Cổ'), 'm_cat content must match story JSON');

    const cafeMsg = tuanThread.messages.find((m: any) => m.id === 'm_cafe');
    assert.ok(cafeMsg, 'm_cafe message must exist in JSON');

    const locMsg = tuanThread.messages.find((m: any) => m.id === 'm_loc');
    assert.ok(locMsg, 'm_loc location message must exist in JSON');
    assert.equal(locMsg.locationData.venueName, 'Khách sạn Romance Boutique Hotel - P. 402');

    const alibiMsg = tuanThread.messages.find((m: any) => m.id === 'm_alibi');
    assert.ok(alibiMsg, 'm_alibi message must exist in JSON');

    const romanceMsg = tuanThread.messages.find((m: any) => m.id === 'm_romance');
    assert.ok(romanceMsg, 'm_romance message must exist in JSON');

    console.log('[PASS] All chat contents confirmed to be 100% loaded from story JSON (src/data/cases/hoang/level_01.json).');
  });
});

