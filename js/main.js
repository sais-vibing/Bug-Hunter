import { engine } from './engine.js';
import { api } from './api.js';
import { sound } from './audio.js';
import { getMonsterForLevel } from './levels.js';

const el = id => document.getElementById(id);
const screens = ['loading', 'menu', 'topic', 'plan', 'map', 'gameplay', 'endgame'];
let currentScreen = 'loading';
let timer = null;
let loading = false;
let introTimer = null;

function showScreen(name) {
    currentScreen = name;
    screens.forEach(screen => el(`${screen}-screen`).classList.toggle('hidden', screen !== name));
    if (name !== 'gameplay') stopTimer();
    if (name === 'map') renderMap();
    if (name === 'plan') renderPlan();
    if (name === 'endgame') renderEnding();
}
function closeModals() {
    ['victory-modal', 'defeat-modal', 'hint-dialog-modal', 'pause-modal'].forEach(id => el(id).classList.add('hidden'));
}
function stopTimer() { if (timer) clearInterval(timer); timer = null; }
function setMessage(id, message) { el(id).textContent = message || ''; }

function renderPlan() {
    const plan = engine.campaign?.plan;
    if (!plan) return showScreen('topic');
    el('plan-summary').textContent = `${plan.goal} · ${plan.levels.length} levels · ${plan.levels.length / 10} chapter(s)`;
    const container = el('plan-levels');
    container.replaceChildren();
    plan.levels.forEach(level => {
        const row = document.createElement('div');
        row.className = `plan-level ${level.difficulty}`;
        const label = document.createElement('strong');
        label.textContent = `${level.level}. Chapter ${level.chapter} · ${level.difficulty.toUpperCase()}${level.enemyType.includes('boss') ? ' BOSS' : ''}`;
        const details = document.createElement('span');
        details.textContent = `${level.topic} — ${level.objective}`;
        row.append(label, details);
        container.append(row);
    });
}

function renderMap() {
    const campaign = engine.campaign;
    if (!campaign) return showScreen('topic');
    el('map-topic-badge').textContent = campaign.plan.goal.toUpperCase();
    el('map-progress').textContent = `${engine.completedCount}/${engine.totalLevels} GATES · ${campaign.xp} XP · ${engine.rank}`;
    const container = el('map-nodes-container');
    container.replaceChildren();
    campaign.plan.levels.forEach(level => {
        const done = campaign.completed.includes(level.level);
        const locked = level.level > engine.unlockedLevel;
        const button = document.createElement('button');
        button.type = 'button';
        button.disabled = locked;
        button.className = `map-node ${level.difficulty} ${level.enemyType.includes('boss') ? 'boss-node' : ''} ${done ? 'cleared' : locked ? 'locked' : 'current unlocked'}`;
        button.setAttribute('aria-label', `Level ${level.level}: ${level.topic}, ${locked ? 'locked' : done ? 'completed' : 'available'}`);
        const inner = document.createElement('div');
        inner.className = 'node-inner';
        const tier = document.createElement('span');
        tier.className = 'node-badge-tier';
        tier.textContent = level.difficulty.toUpperCase();
        const number = document.createElement('span');
        number.className = 'node-number';
        number.textContent = done ? '✓' : locked ? '🔒' : String(level.level).padStart(2, '0');
        const title = document.createElement('span');
        title.className = 'node-title';
        title.textContent = level.enemyType.includes('boss') ? level.enemyType.toUpperCase() : level.topic;
        inner.append(tier, number, title);
        button.append(inner);
        button.addEventListener('click', () => enterLevel(level.level));
        container.append(button);
    });
}

async function createCampaign(goal) {
    if (loading) return;
    if (!goal.trim()) return setMessage('topic-error', 'Enter a language or learning goal first.');
    if (engine.campaign && !confirm('Replace your saved campaign and progress with a new one?')) return;
    loading = true;
    setMessage('topic-error', '');
    el('btn-manifest-dungeon').disabled = true;
    el('topic-status-overlay').classList.remove('hidden');
    el('topic-status-text').textContent = `Asta is building a plan for ${goal}...`;
    try {
        const result = await api.plan(goal, engine.settings.model);
        engine.startCampaign(result.plan);
        showScreen('plan');
    } catch (error) {
        setMessage('topic-error', `${error.message} Check Ollama or configure Gemini in .env. The Offline demo remains playable.`);
    } finally {
        loading = false;
        el('btn-manifest-dungeon').disabled = false;
        el('topic-status-overlay').classList.add('hidden');
    }
}

async function enterLevel(number) {
    if (loading || !engine.campaign || number > engine.unlockedLevel) return;
    loading = true;
    setMessage('map-error', 'Asta is preparing the saved challenge...');
    try {
        if (!engine.getChallenge(number)) {
            const result = await api.challenge(engine.campaign.plan, number, engine.settings.model);
            engine.storeChallenge(number, result.challenge);
        }
        engine.startBattle(number);
        closeModals();
        renderBattle();
        showScreen('gameplay');
        if (engine.getChallenge(number).format === 'typing') el('typing-code-input').focus();
        startTimer();
        setMessage('map-error', '');
    } catch (error) {
        setMessage('map-error', `${error.message} You can retry this gate after checking the AI service.`);
    } finally { loading = false; }
}

function renderBattle() {
    const battle = engine.battle;
    const challenge = engine.getChallenge(battle.number);
    const level = engine.getPlanLevel(battle.number);
    const monster = getMonsterForLevel(battle.number, engine.totalLevels);
    el('hud-rank').textContent = engine.rank;
    el('hud-level').textContent = `LEVEL ${battle.number} / ${engine.totalLevels}`;
    el('hud-xp-text').textContent = `${engine.campaign.xp} XP`;
    el('hud-xp-fill').style.width = `${Math.min(100, engine.campaign.xp % 100)}%`;
    el('battle-topic').textContent = `Chapter ${level.chapter} · ${level.topic} · ${level.difficulty.toUpperCase()}`;
    el('enemy-name-tag').textContent = monster.name;
    el('enemy-sprite-img').src = monster.sprite;
    el('enemy-hp-fill').style.width = '100%';
    el('hero-sprite-img').src = 'assets/hero_idle.png';
    el('dialogue-prompt-text').textContent = challenge.question;
    el('bug-code-snippet').textContent = challenge.code;
    el('battle-arena-bg').style.backgroundImage = level.difficulty === 'hard' ? 'url("assets/bg_dungeon_arena.jpg")' : 'url("assets/bg_nature_arena.jpg")';
    el('battle-shadow-pet').classList.remove('active', 'glowing');
    el('pet-speech-bubble').classList.add('hidden');
    el('interaction-mcq-area').classList.toggle('hidden', challenge.format !== 'mcq');
    el('interaction-typing-area').classList.toggle('hidden', challenge.format !== 'typing');
    ['mcq-opt-a', 'mcq-opt-b', 'mcq-opt-c'].forEach((id, index) => {
        const button = el(id);
        button.disabled = false;
        button.classList.remove('wrong-shake', 'correct-glow');
        button.dataset.value = challenge.choices[index] || '';
        button.querySelector('.opt-label').textContent = challenge.choices[index] || '';
    });
    el('typing-code-input').value = '';
    el('typing-code-input').disabled = false;
    el('typing-submit-btn').disabled = false;
    renderHp();
    renderSidebar();
}

function renderHp() {
    const hp = engine.battle?.hp || 0;
    el('hud-hearts').textContent = `${hp >= 1 ? '❤️' : '🖤'} ${hp >= 2 ? '❤️' : '🖤'}`;
    el('hero-hp-segments').querySelectorAll('.hp-segment').forEach((segment, index) => segment.classList.toggle('empty', index >= hp));
}
function renderSidebar() {
    const container = el('sidebar-level-nodes');
    container.replaceChildren();
    const start = Math.max(1, Math.min(engine.totalLevels - 5, engine.battle.number - 2));
    for (let number = start; number <= Math.min(engine.totalLevels, start + 5); number++) {
        const node = document.createElement('button');
        node.type = 'button';
        node.className = `mini-node ${number === engine.battle.number ? 'active-glow' : ''} ${engine.campaign.completed.includes(number) ? 'cleared' : ''} ${number > engine.unlockedLevel ? 'locked' : ''}`;
        const circle = document.createElement('span');
        circle.className = 'node-circle';
        circle.textContent = engine.campaign.completed.includes(number) ? '✓' : String(number).padStart(2, '0');
        node.append(circle);
        node.disabled = number > engine.unlockedLevel;
        node.addEventListener('click', () => { engine.battle = null; showScreen('map'); enterLevel(number); });
        container.append(node);
    }
}

function startTimer() {
    stopTimer();
    if (engine.getChallenge(engine.battle.number).format !== 'typing') return;
    const tick = () => {
        if (!engine.battle || currentScreen !== 'gameplay' || engine.battle.phase !== 'active') return;
        const seconds = engine.remainingSeconds();
        if (seconds === null) return;
        el('typing-timer-label').textContent = `${seconds}s`;
        el('typing-timer-progress').style.width = `${Math.max(0, seconds / engine.battle.timeLimit * 100)}%`;
        if (engine.timeout()) finishBattle({ status: 'defeat', reason: 'Time expired.' });
    };
    tick();
    timer = setInterval(tick, 100);
}

function submit(answer, button) {
    if (currentScreen !== 'gameplay' || !engine.battle || !answer.trim()) return;
    const result = engine.submit(answer);
    if (result.status === 'ignored') return;
    if (result.status === 'damage') {
        if (button) { button.disabled = true; button.classList.add('wrong-shake'); }
        el('hero-sprite-img').src = 'assets/hero_hurt.png';
        el('battle-shadow-pet').classList.add('active', 'glowing');
        el('pet-speech-bubble').textContent = 'Hint available — click me';
        el('pet-speech-bubble').classList.remove('hidden');
        renderHp();
        sound.playWrong();
        return;
    }
    finishBattle(result);
}

function fillLetter(prefix, challenge) {
    el(`${prefix}-correct-answer`).textContent = challenge.correctAnswer;
    el(`${prefix}-corrected-code`).textContent = challenge.correctedCode;
    el(`${prefix}-bug-cause`).textContent = challenge.bugCause;
    el(`${prefix}-explanation-text`).textContent = challenge.explanation;
    el(`${prefix}-concept`).textContent = `Learned: ${challenge.concept}`;
}
function finishBattle(result) {
    stopTimer();
    const battle = engine.battle;
    if (!battle) return;
    const challenge = engine.getChallenge(battle.number);
    const victory = result.status === 'victory';
    fillLetter(victory ? 'victory' : 'defeat', challenge);
    if (victory) {
        el('enemy-hp-fill').style.width = '0%';
        el('victory-xp-earned').textContent = result.xpGained ? `+${result.xpGained} XP` : 'Replay · no extra XP';
        el('btn-victory-next').textContent = result.final ? 'FINAL VICTORY' : 'NEXT GATE ➔';
        sound.playCorrect();
    } else {
        el('hero-sprite-img').src = 'assets/hero_hurt.png';
        renderHp();
        sound.playDeath();
    }
    const delay = engine.settings.reducedMotion ? 0 : 350;
    setTimeout(() => { if (engine.battle === battle) el(victory ? 'victory-modal' : 'defeat-modal').classList.remove('hidden'); }, delay);
}

function renderEnding() {
    const campaign = engine.campaign;
    if (!campaign) return;
    const topics = [...new Set(campaign.plan.levels.map(level => level.topic))];
    el('endgame-summary').textContent = `The ultimate final boss has been defeated. Congratulations! You completed ${campaign.plan.goal}: ${engine.completedCount} levels, ${campaign.xp} XP. Topics: ${topics.slice(0, 8).join(', ')}${topics.length > 8 ? '…' : ''}.`;
}

function openSettings() {
    el('settings-ollama-model').value = engine.settings.model;
    el('settings-time-limit').value = engine.settings.timeLimit;
    el('settings-reduced-motion').checked = engine.settings.reducedMotion;
    el('settings-theme-select').value = engine.settings.theme;
    el('settings-sound-toggle').checked = engine.settings.sound;
    el('settings-test-result').textContent = '';
    el('settings-modal').classList.remove('hidden');
}
function closeSettings() {
    try {
        engine.updateSettings({
            model: el('settings-ollama-model').value.trim(),
            timeLimit: Number(el('settings-time-limit').value),
            reducedMotion: el('settings-reduced-motion').checked,
            theme: el('settings-theme-select').value,
            sound: el('settings-sound-toggle').checked
        });
        sound.setMuted(!engine.settings.sound);
        document.documentElement.dataset.theme = engine.settings.theme;
        document.documentElement.classList.toggle('reduced-motion', engine.settings.reducedMotion);
        el('settings-modal').classList.add('hidden');
    } catch (error) { el('settings-test-result').textContent = error.message; }
}

function init() {
    sound.setMuted(!engine.settings.sound);
    document.documentElement.dataset.theme = engine.settings.theme;
    document.documentElement.classList.toggle('reduced-motion', engine.settings.reducedMotion);
    const skipIntro = () => { clearTimeout(introTimer); showScreen('menu'); };
    el('loading-skip-btn').addEventListener('click', skipIntro);
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && currentScreen === 'loading') skipIntro(); });
    introTimer = setTimeout(skipIntro, 2300);
    el('btn-start-quest').addEventListener('click', () => showScreen(engine.campaign ? 'map' : 'topic'));
    el('btn-system-config').addEventListener('click', openSettings);
    el('btn-abandon-game').addEventListener('click', () => { if (confirm('Exit to the title screen? You can close this browser tab afterward.')) showScreen('menu'); });
    el('btn-manifest-dungeon').addEventListener('click', () => createCampaign(el('topic-custom-input').value));
    el('topic-custom-input').addEventListener('keydown', event => { if (event.key === 'Enter') createCampaign(el('topic-custom-input').value); });
    document.querySelectorAll('.topic-chip[data-topic]').forEach(button => button.addEventListener('click', () => { el('topic-custom-input').value = button.dataset.topic; createCampaign(button.dataset.topic); }));
    el('btn-demo-campaign').addEventListener('click', () => createCampaign('Mixed Coding Basics Demo'));
    el('btn-plan-back').addEventListener('click', () => showScreen('topic'));
    el('btn-plan-begin').addEventListener('click', () => showScreen('map'));
    el('btn-map-back-menu').addEventListener('click', () => showScreen('menu'));
    el('btn-map-plan').addEventListener('click', () => showScreen('plan'));
    el('btn-new-campaign').addEventListener('click', () => showScreen('topic'));
    ['mcq-opt-a', 'mcq-opt-b', 'mcq-opt-c'].forEach(id => el(id).addEventListener('click', event => submit(event.currentTarget.dataset.value, event.currentTarget)));
    const submitTyped = () => submit(el('typing-code-input').value);
    el('typing-submit-btn').addEventListener('click', submitTyped);
    el('typing-code-input').addEventListener('keydown', event => { if (event.key === 'Enter') submitTyped(); });
    const openHint = () => { if (engine.battle?.hintAvailable) { el('hint-dialog-content').textContent = engine.getChallenge(engine.battle.number).hint; el('hint-dialog-modal').classList.remove('hidden'); } };
    el('battle-shadow-pet').addEventListener('click', openHint);
    el('battle-shadow-pet').addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openHint(); } });
    el('hint-close-btn').addEventListener('click', () => el('hint-dialog-modal').classList.add('hidden'));
    el('btn-pause-gameplay').addEventListener('click', () => { engine.pauseTimer(); el('pause-modal').classList.remove('hidden'); });
    el('btn-resume-gameplay').addEventListener('click', () => { engine.resumeTimer(); el('pause-modal').classList.add('hidden'); });
    el('btn-pause-to-map').addEventListener('click', () => { closeModals(); engine.battle = null; showScreen('map'); });
    el('btn-pause-settings').addEventListener('click', openSettings);
    el('btn-victory-map').addEventListener('click', () => { closeModals(); engine.battle = null; showScreen('map'); });
    el('btn-defeat-map').addEventListener('click', () => { closeModals(); engine.battle = null; showScreen('map'); });
    const retry = () => { const number = engine.battle.number; closeModals(); engine.startBattle(number); renderBattle(); startTimer(); };
    el('btn-victory-retry').addEventListener('click', retry);
    el('btn-defeat-retry').addEventListener('click', retry);
    el('btn-victory-next').addEventListener('click', () => { const number = engine.battle.number; closeModals(); engine.battle = null; if (number === engine.totalLevels) showScreen('endgame'); else { showScreen('map'); enterLevel(number + 1); } });
    el('btn-endgame-menu').addEventListener('click', () => showScreen('map'));
    el('btn-endgame-reset').addEventListener('click', () => showScreen('topic'));
    el('settings-close-btn').addEventListener('click', closeSettings);
    el('settings-test-btn').addEventListener('click', async () => {
        el('settings-test-result').textContent = 'Checking Ollama...';
        try { const result = await api.testOllama(el('settings-ollama-model').value.trim()); el('settings-test-result').textContent = result.hasModel ? `Ready: ${result.currentModel}` : `Ollama online, but ${result.currentModel} is not installed. Available: ${result.models.join(', ') || 'none'}`; }
        catch (error) { el('settings-test-result').textContent = error.message; }
    });
    el('settings-reset-data-btn').addEventListener('click', () => { if (confirm('Erase this campaign and all completed levels?')) { engine.clearCampaign(); closeModals(); el('settings-modal').classList.add('hidden'); showScreen('menu'); } });
}

window.addEventListener('DOMContentLoaded', init);
