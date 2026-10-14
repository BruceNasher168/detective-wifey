import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import { createSwipeBackEngine, isSwipeRightGesture } from '../hooks/useSwipeBack';

describe('Universal swipe-right gesture suite', () => {
it('verifies all gesture scenarios', () => {

// Helper to simulate React-like touch and pointer events
function createMockTouchEvent(clientX: number, clientY: number) {
  let isPropagationStopped = false;
  return {
    touches: [{ clientX, clientY }],
    changedTouches: [{ clientX, clientY }],
    stopPropagation: () => {
      isPropagationStopped = true;
    },
    get isStopped() {
      return isPropagationStopped;
    },
  };
}

function createMockPointerEvent(clientX: number, clientY: number, pointerType = 'mouse', button = 0) {
  let isPropagationStopped = false;
  return {
    clientX,
    clientY,
    pointerType,
    button,
    stopPropagation: () => {
      isPropagationStopped = true;
    },
    get isStopped() {
      return isPropagationStopped;
    },
  };
}

console.log('=== RUNNING UNIVERSAL SWIPE-RIGHT GESTURE TEST SUITE ===\n');

// Test 1: Pure geometry calculation for rightward swipe
{
  console.log('[Test 1] Pure Geometry Calculation (isSwipeRightGesture)');
  const now = Date.now();
  assert.equal(
    isSwipeRightGesture({
      startX: 10,
      startY: 100,
      startTime: now,
      endX: 80,
      endY: 110,
      endTime: now + 200,
    }),
    true,
    'Valid right swipe must evaluate to true'
  );

  assert.equal(
    isSwipeRightGesture({
      startX: 80,
      startY: 100,
      startTime: now,
      endX: 10,
      endY: 110,
      endTime: now + 200,
    }),
    false,
    'Left swipe must evaluate to false'
  );

  assert.equal(
    isSwipeRightGesture({
      startX: 10,
      startY: 10,
      startTime: now,
      endX: 30,
      endY: 200,
      endTime: now + 200,
    }),
    false,
    'Vertical scroll must evaluate to false'
  );
  console.log('  -> PASS: Pure geometry evaluations accurate.\n');
}

// Test 2: Touch rightward swipe triggers onBack
{
  console.log('[Test 2] Touch Rightward Swipe Detection');
  let backTriggeredCount = 0;
  const handlers = createSwipeBackEngine({
    onBack: () => {
      backTriggeredCount++;
    },
    threshold: 45,
  });

  const startEv = createMockTouchEvent(20, 100);
  handlers.onTouchStart(startEv as any);

  const endEv = createMockTouchEvent(100, 110); // deltaX = 80, deltaY = 10
  handlers.onTouchEnd(endEv as any);

  assert.equal(backTriggeredCount, 1, 'Should trigger onBack for rightward swipe');
  assert.equal(endEv.isStopped, true, 'Should call stopPropagation on trigger');
  console.log('  -> PASS: Valid rightward swipe successfully detected.\n');
}

// Test 3: Touch leftward swipe does NOT trigger onBack
{
  console.log('[Test 3] Touch Leftward Swipe Rejection');
  let backTriggeredCount = 0;
  const handlers = createSwipeBackEngine({
    onBack: () => {
      backTriggeredCount++;
    },
    threshold: 45,
  });

  const startEv = createMockTouchEvent(150, 100);
  handlers.onTouchStart(startEv as any);

  const endEv = createMockTouchEvent(50, 105); // deltaX = -100
  handlers.onTouchEnd(endEv as any);

  assert.equal(backTriggeredCount, 0, 'Left swipe must not trigger onBack');
  assert.equal(endEv.isStopped, false, 'Should not stop propagation when not triggered');
  console.log('  -> PASS: Leftward swipe correctly ignored.\n');
}

// Test 4: Vertical list scroll does NOT trigger onBack
{
  console.log('[Test 4] Vertical Scroll Rejection');
  let backTriggeredCount = 0;
  const handlers = createSwipeBackEngine({
    onBack: () => {
      backTriggeredCount++;
    },
    threshold: 45,
  });

  const startEv = createMockTouchEvent(100, 100);
  handlers.onTouchStart(startEv as any);

  const endEv = createMockTouchEvent(120, 300); // deltaX = 20, deltaY = 200 (vertical scroll)
  handlers.onTouchEnd(endEv as any);

  assert.equal(backTriggeredCount, 0, 'Vertical scroll must not trigger onBack');
  console.log('  -> PASS: Vertical scroll motion correctly rejected.\n');
}

// Test 5: Diagonal drift does NOT trigger onBack
{
  console.log('[Test 5] Diagonal Drift Rejection');
  let backTriggeredCount = 0;
  const handlers = createSwipeBackEngine({
    onBack: () => {
      backTriggeredCount++;
    },
    threshold: 45,
    maxRatio: 0.8,
  });

  const startEv = createMockTouchEvent(50, 50);
  handlers.onTouchStart(startEv as any);

  // deltaX = 60, deltaY = 80 (|deltaY| / deltaX = 1.33 > 0.8)
  const endEv = createMockTouchEvent(110, 130);
  handlers.onTouchEnd(endEv as any);

  assert.equal(backTriggeredCount, 0, 'Diagonal scroll must not trigger onBack');
  console.log('  -> PASS: Diagonal drift correctly rejected.\n');
}

// Test 6: Sub-threshold movement does NOT trigger onBack
{
  console.log('[Test 6] Sub-threshold Movement Rejection');
  let backTriggeredCount = 0;
  const handlers = createSwipeBackEngine({
    onBack: () => {
      backTriggeredCount++;
    },
    threshold: 50,
  });

  const startEv = createMockTouchEvent(100, 100);
  handlers.onTouchStart(startEv as any);

  const endEv = createMockTouchEvent(130, 102); // deltaX = 30 < 50
  handlers.onTouchEnd(endEv as any);

  assert.equal(backTriggeredCount, 0, 'Movement < threshold must not trigger onBack');
  console.log('  -> PASS: Sub-threshold movement ignored.\n');
}

// Test 7: Desktop mouse pointer drag triggers onBack
{
  console.log('[Test 7] Desktop Mouse Pointer Drag Detection');
  let backTriggeredCount = 0;
  const handlers = createSwipeBackEngine({
    onBack: () => {
      backTriggeredCount++;
    },
    threshold: 45,
  });

  const startEv = createMockPointerEvent(10, 200, 'mouse', 0);
  handlers.onPointerDown(startEv as any);

  const endEv = createMockPointerEvent(90, 210, 'mouse', 0); // deltaX = 80, deltaY = 10
  handlers.onPointerUp(endEv as any);

  assert.equal(backTriggeredCount, 1, 'Mouse drag right should trigger onBack');
  assert.equal(endEv.isStopped, true, 'Pointer event should stop propagation');
  console.log('  -> PASS: Mouse pointer swipe right works as expected.\n');
}

// Test 8: Touch pointer events ignored by pointer listener to avoid duplicate triggers
{
  console.log('[Test 8] Pointer Touch De-duplication');
  let backTriggeredCount = 0;
  const handlers = createSwipeBackEngine({
    onBack: () => {
      backTriggeredCount++;
    },
    threshold: 45,
  });

  // A mobile browser sends pointerdown (type='touch') and then touchstart
  const pointerStart = createMockPointerEvent(10, 200, 'touch', 0);
  handlers.onPointerDown(pointerStart as any);

  const pointerEnd = createMockPointerEvent(90, 210, 'touch', 0);
  handlers.onPointerUp(pointerEnd as any);

  assert.equal(backTriggeredCount, 0, 'Pointer listener must ignore touch pointerType to avoid double-firing with touch listener');
  console.log('  -> PASS: Pointer touch de-duplication verified.\n');
}

console.log('=== ALL SWIPE-RIGHT GESTURE TESTS PASSED PERFECTLY ===\n');
});
});

