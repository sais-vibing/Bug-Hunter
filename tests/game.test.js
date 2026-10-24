import test from 'node:test';
import assert from 'node:assert/strict';
import { getDifficultyForLevel } from '../js/levels.js';
import { demoCampaign, demoChallenge, buildPlan, validateChallenge } from '../js/content.js';

const data = new Map();
globalThis.localStorage = {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: key => data.delete(key)
};
const { GameEngine } = await import('../js/engine.js');

test('difficulty and boss placement follow the ten-level rule', () => {
    for (let chapter = 0; chapter < 3; chapter++) {
        for (let position = 1; position <= 10; position++) {
            const expected = position === 10 ? 'hard' : position === 5 ? 'medium' : 'easy';
            assert.equal(getDifficultyForLevel(chapter * 10 + position), expected);
        }
    }
});

test('every offline demo challenge has a complete valid answer', () => {
    const plan = demoCampaign();
    assert.equal(plan.levels.length, 30);
    plan.levels.forEach(level => assert.equal(demoChallenge(level).level, level.level));
});

test('invalid AI questions are rejected instead of silently repaired', () => {
    const level = demoCampaign().levels[0];
    const question = demoChallenge(level);
    assert.throws(() => validateChallenge({ ...question, choices: ['a', 'b', 'c'] }, level), /matching answer/);
    assert.throws(() => validateChallenge({ ...question, correctedCode: 'wrong code' }, level), /stated answer/);
});

test('plan size is driven by chapters, with ten levels each', () => {
    const chapter = number => ({ title: `Chapter ${number}`, objectives: Array.from({ length: 10 }, (_, i) => ({ topic: `Topic ${number}-${i}`, objective: `Objective ${number}-${i}` })) });
    assert.equal(buildPlan('Narrow goal', [chapter(1)]).levels.length, 10);
    assert.equal(buildPlan('Broad goal', [chapter(1), chapter(2)]).levels.length, 20);
    assert.throws(() => buildPlan('Bad', [{ ...chapter(1), objectives: [] }]), /ten/);
});

test('wrong answers, hint, retry, first-clear reward, and refresh', () => {
    data.clear();
    const engine = new GameEngine();
    engine.startCampaign(demoCampaign());
    const challenge = engine.storeChallenge(1, demoChallenge(engine.getPlanLevel(1)));
    engine.startBattle(1);
    assert.deepEqual(engine.submit('a'), { status: 'damage', hp: 1 });
    assert.equal(engine.battle.hintAvailable, true);
    assert.equal(engine.submit('b').status, 'defeat');
    assert.equal(engine.unlockedLevel, 1);
    engine.startBattle(1);
    assert.equal(engine.getChallenge(1), challenge);
    assert.equal(engine.submit(challenge.correctAnswer).xpGained, 100);
    assert.equal(engine.unlockedLevel, 2);
    engine.startBattle(1);
    assert.equal(engine.submit(challenge.correctAnswer).xpGained, 0);
    assert.equal(engine.campaign.xp, 100);
    const resumed = new GameEngine();
    assert.equal(resumed.campaign.xp, 100);
    assert.equal(resumed.unlockedLevel, 2);
    assert.equal(resumed.getChallenge(1).correctAnswer, challenge.correctAnswer);
});

test('typing timeout defeats the player without erasing progress', () => {
    data.clear();
    const engine = new GameEngine();
    engine.startCampaign(demoCampaign());
    for (let n = 1; n <= 3; n++) {
        const challenge = engine.storeChallenge(n, demoChallenge(engine.getPlanLevel(n)));
        engine.startBattle(n);
        engine.submit(challenge.correctAnswer);
    }
    engine.storeChallenge(4, demoChallenge(engine.getPlanLevel(4)));
    engine.startBattle(4);
    engine.battle.deadline = Date.now() - 1;
    assert.equal(engine.timeout(), true);
    assert.equal(engine.battle.phase, 'defeat');
    assert.equal(engine.completedCount, 3);
    assert.equal(engine.unlockedLevel, 4);
});
