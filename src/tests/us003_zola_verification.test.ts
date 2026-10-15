import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import { APP_REGISTRY } from '../apps/registry';
import { loadCase } from '../engines/schemaEngine';
import { appDefinition, InternetMessagingApp, ZolaApp } from '../apps/internet-messaging';

describe('US-003 Zola Private Messaging App Module Suite', () => {
  it('satisfies all acceptance criteria and forensic clue requirements', () => {
    // -------------------------------------------------------------
    // AC01: Zola App Mounting & System Header
    // -------------------------------------------------------------
    console.log('[US-003 - AC01] Zola App Mounting & Definition Verification');
    assert.ok(APP_REGISTRY['internet-messaging'], 'internet-messaging must be registered');
    assert.ok(APP_REGISTRY.zola, 'zola alias must be registered');

    assert.equal(appDefinition.displayName, 'Zola', 'App name must be Zola');
    assert.equal(appDefinition.themeColor, '#0088FF', 'Brand header color must be Electric Blue #0088FF');
    assert.equal(appDefinition.notificationBadgeCount, 4, 'Initial notification badge count must match wireframe');
    assert.equal(appDefinition.isLocked, false, 'Zola must be unlocked by default');
    assert.equal(InternetMessagingApp, ZolaApp, 'ZolaApp and InternetMessagingApp must be identical');
    console.log('  -> PASS: Zola app definition, branding tokens, and registry verified.\n');

    // -------------------------------------------------------------
    // AC02: Chat Inbox & Disguised Contact Listing
    // -------------------------------------------------------------
    console.log('[US-003 - AC02] Chat Inbox & Disguised Contact Listing');
    const case1 = loadCase('case_01');
    const zolaData = case1.appsData['internet-messaging'];

    assert.ok(zolaData, 'Level 1 case must contain internet-messaging data');
    assert.ok(zolaData.threads && zolaData.threads.length >= 2, 'Must have at least 2 threads');

    const disguisedThread = zolaData.threads.find(
      (t: any) => t.contactName === 'Anh Tuấn Thợ Điện'
    );
    assert.ok(disguisedThread, 'Disguised contact thread "Anh Tuấn Thợ Điện" must exist');
    assert.equal(disguisedThread.isPinned, true, 'Disguised contact must be pinned');
    assert.equal(disguisedThread.isDisguised, true, 'Contact must be marked disguised');
    assert.equal(disguisedThread.realIdentity, 'Hương Đồng Nghiệp', 'Real identity must be Hương Đồng Nghiệp');
    assert.equal(disguisedThread.suspectId, 'suspect_huong', 'Suspect ID must link to suspect_huong');
    assert.equal(disguisedThread.unreadCount, 3, 'Unread count must match case narrative');
    console.log('  -> PASS: Disguised affair contact listing and unread indicators verified.\n');

    // -------------------------------------------------------------
    // AC03: Chat Thread & Forensic Clues
    // -------------------------------------------------------------
    console.log('[US-003 - AC03] Chat Thread & Forensic Clues (CLUE-ZOLA-03 & CLUE-ZOLA-04)');
    // 1. Disappearing banner (CLUE-ZOLA-03)
    assert.equal(
      disguisedThread.systemBanner,
      'Tin nhắn tự xoá sau 24 giờ đã được bật',
      'Disappearing messages banner notice must be present'
    );

    // 2. Location Pin Card (CLUE-ZOLA-04)
    const locationMsg = disguisedThread.messages.find(
      (m: any) => m.type === 'location'
    );
    assert.ok(locationMsg, 'Location pin message must exist in disguised thread');
    assert.equal(locationMsg.clueRefId, 'CLUE-ZOLA-04', 'Clue ref must be CLUE-ZOLA-04');
    assert.ok(locationMsg.locationData, 'Location data metadata must be present');
    assert.equal(
      locationMsg.locationData.venueName,
      'Khách sạn Romance Boutique Hotel - P. 402'
    );
    assert.equal(
      locationMsg.locationData.address,
      '12 Ngõ 85 Chùa Láng, Đống Đa, Hà Nội'
    );

    // 3. Husband alibi contradiction
    const alibiMsg = disguisedThread.messages.find(
      (m: any) => m.id === 'm_alibi'
    );
    assert.ok(alibiMsg, 'Husband alibi message must exist');
    assert.ok(
      alibiMsg.text.includes('kẹt xe đường về'),
      'Husband alibi text must state traffic jam'
    );

    // 4. Tone discrepancy & affection (CLUE-ZOLA-01)
    const romanticMsg = disguisedThread.messages.find(
      (m: any) => m.id === 'm_romance'
    );
    assert.ok(romanticMsg, 'Romantic text message must exist');
    assert.ok(
      romanticMsg.text.includes('dặn sếp ngủ sớm đi nhé'),
      'Romantic pet text must match wireframe'
    );
    console.log('  -> PASS: Forensic chat thread, disappearing notice, and location card verified.\n');

    // -------------------------------------------------------------
    // AC04: Contacts Directory & Disguised Alias Traceability
    // -------------------------------------------------------------
    console.log('[US-003 - AC04] Contacts Directory & Cross-App Traceability');
    assert.ok(zolaData.contacts && zolaData.contacts.length >= 4, 'Must have contacts list');

    const tuanContact = zolaData.contacts.find(
      (c: any) => c.name === 'Anh Tuấn Thợ Điện'
    );
    assert.ok(tuanContact, 'Contact "Anh Tuấn Thợ Điện" must exist in address book');
    assert.equal(tuanContact.phone, '0988.456.234', 'Phone number must match bank counterparty');
    assert.equal(
      tuanContact.department,
      'Phòng Marketing Technosoft',
      'Department must reveal Marketing affiliation'
    );
    assert.equal(tuanContact.suspectName, 'Hương Đồng Nghiệp');

    const blockedHuong = zolaData.contacts.find(
      (c: any) => c.name.includes('Hương Marketing')
    );
    assert.ok(blockedHuong, 'Blocked contact Hương Marketing must exist in address book');
    assert.equal(blockedHuong.isBlocked, true);
    console.log('  -> PASS: Address book directory and cross-app Napas phone traceability verified.\n');

    // -------------------------------------------------------------
    // AC05: Lightweight Profile & Cloud Document Vault
    // -------------------------------------------------------------
    console.log('[US-003 - AC05] Lightweight Profile & Cloud Documents (CLUE-ZOLA-07)');
    assert.ok(zolaData.currentUser, 'Current user profile must exist');
    assert.equal(zolaData.currentUser.name, 'Nguyễn Huy Hoàng');
    assert.equal(zolaData.currentUser.handle, 'hoang_tech88');

    assert.ok(zolaData.cloudDocuments && zolaData.cloudDocuments.length >= 2, 'Cloud docs must exist');
    const leaseDoc = zolaData.cloudDocuments.find(
      (d: any) => d.id === 'doc_01'
    );
    assert.ok(leaseDoc, 'Apartment lease PDF must exist in Cloud documents');
    assert.equal(leaseDoc.fileName, 'Hop_dong_thue_nha_Chua_Lang.pdf');
    assert.equal(leaseDoc.clueRefId, 'CLUE-ZOLA-07');
    assert.ok(leaseDoc.description.includes('Nguyen Huy Hoang'));

    const depositDoc = zolaData.cloudDocuments.find(
      (d: any) => d.id === 'doc_02'
    );
    assert.ok(depositDoc, 'Apartment deposit receipt must exist in Cloud documents');
    assert.equal(depositDoc.fileName, 'Bien_nhan_coc_can_ho_mini.jpg');
    assert.equal(depositDoc.clueRefId, 'CLUE-ZOLA-07');

    const photoDoc = zolaData.cloudDocuments.find(
      (d: any) => d.id === 'doc_photo_01'
    );
    assert.ok(photoDoc, 'Photo document 4x6.jpg must exist in Cloud stream');
    assert.equal(photoDoc.fileName, '4x6.jpg');
    assert.equal(photoDoc.fileType, 'jpg');

    const noteDoc = zolaData.cloudDocuments.find(
      (d: any) => d.id === 'doc_note_01'
    );
    assert.ok(noteDoc, 'Forwarded text note must exist in Cloud stream');
    assert.equal(noteDoc.senderName, 'Chu N Khánh');
    assert.ok(noteDoc.textMessage.includes('Điều hoà'));

    const bienBanDoc = zolaData.cloudDocuments.find(
      (d: any) => d.id === 'doc_bien_ban'
    );
    assert.ok(bienBanDoc, 'BIÊN BẢN XÁC NHẬN.docx must exist in Cloud stream');
    assert.equal(bienBanDoc.senderName, 'Ú Tôm');
    console.log('  -> PASS: Cloud document vault and chat stream evidence verified.\n');

    // -------------------------------------------------------------
    // All 5 Tabs Data Ingestion Verification
    // -------------------------------------------------------------
    console.log('[US-003] All 5 Tabs Data Ingestion from Story JSON');
    assert.ok(zolaData.otherThreads && zolaData.otherThreads.length >= 1, 'Other/muted threads must be in JSON');
    assert.ok(zolaData.timelinePosts && zolaData.timelinePosts.length >= 2, 'Timeline posts must be in JSON');
    assert.ok(zolaData.discoverData && zolaData.discoverData.miniApps?.length >= 2, 'Discover mini-apps must be in JSON');
    assert.ok(zolaData.discoverData.promoBanner, 'Discover promo banner must be in JSON');
    console.log('  -> PASS: Story JSON provides comprehensive data across all 5 app tabs.\n');

    console.log('=== ALL US-003 ACCEPTANCE CRITERIA VERIFIED PERFECTLY ===\n');
  });
});

