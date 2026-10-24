import { validatePlan, validateChallenge } from './content.js';

const STORAGE_KEY = 'bughunter_campaign_v2';
const SETTINGS_KEY = 'bughunter_settings_v2';
const defaults = { model: 'gemma4:e2b', timeLimit: 30, sound: true, reducedMotion: false, theme: 'dark' };

function read(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Private browsing can deny storage. */ }
}

export class GameEngine {
    constructor() {
        this.settings = { ...defaults, ...read(SETTINGS_KEY) };
        if (!Number.isInteger(this.settings.timeLimit) || this.settings.timeLimit < 15 || this.settings.timeLimit > 120) this.settings.timeLimit = 30;
        this.campaign = null;
        const saved = read(STORAGE_KEY);
        if (saved) {
            try {
                validatePlan(saved.plan);
                const challenges = {};
                for (const [number, challenge] of Object.entries(saved.challenges || {})) {
                    const level = saved.plan.levels[Number(number) - 1];
                    challenges[number] = validateChallenge(challenge, level);
                }
                const completed = Array.isArray(saved.completed) ? saved.completed.filter(n => Number.isInteger(n) && n >= 1 && n <= saved.plan.levels.length) : [];
                this.campaign = { plan: saved.plan, challenges, completed: [...new Set(completed)].sort((a, b) => a - b), xp: 0 };
                this.campaign.xp = this.campaign.completed.reduce((sum, n) => sum + this.rewardFor(n), 0);
            } catch { this.campaign = null; }
        }
        this.battle = null;
    }

    get totalLevels() { return this.campaign?.plan.levels.length || 0; }
    get unlockedLevel() {
        if (!this.campaign) return 0;
        let frontier = 1;
        while (this.campaign.completed.includes(frontier) && frontier < this.totalLevels) frontier++;
        return frontier;
    }
    get completedCount() { return this.campaign?.completed.length || 0; }
    get rank() {
        const count = this.completedCount;
        return count >= this.totalLevels && count > 0 ? 'S-Rank' : count >= 20 ? 'A-Rank' : count >= 10 ? 'B-Rank' : count >= 5 ? 'C-Rank' : count >= 1 ? 'D-Rank' : 'E-Rank';
    }
    rewardFor(level) { return level % 10 === 0 ? 250 : level % 10 === 5 ? 150 : 100; }
    save() { if (this.campaign) write(STORAGE_KEY, this.campaign); }
    updateSettings(patch) {
        const next = { ...this.settings, ...patch };
        if (!Number.isInteger(next.timeLimit) || next.timeLimit < 15 || next.timeLimit > 120) throw new Error('Time limit must be 15–120 seconds.');
        if (typeof next.model !== 'string' || !/^[a-zA-Z0-9_.:/-]{1,80}$/.test(next.model)) throw new Error('Invalid Ollama model name.');
        this.settings = next;
        write(SETTINGS_KEY, next);
    }
    startCampaign(plan) {
        validatePlan(plan);
        this.campaign = { plan, challenges: {}, completed: [], xp: 0 };
        this.battle = null;
        this.save();
    }
    clearCampaign() {
        this.campaign = null;
        this.battle = null;
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }
    getPlanLevel(number) { return this.campaign?.plan.levels[number - 1]; }
    getChallenge(number) { return this.campaign?.challenges[number]; }
    storeChallenge(number, raw) {
        const level = this.getPlanLevel(number);
        const challenge = validateChallenge(raw, level);
        if (!this.campaign.challenges[number]) {
            this.campaign.challenges[number] = challenge;
            this.save();
        }
        return this.campaign.challenges[number];
    }
    startBattle(number) {
        if (!Number.isInteger(number) || number < 1 || number > this.unlockedLevel || !this.getChallenge(number)) throw new Error('This level is unavailable.');
        const challenge = this.getChallenge(number);
        this.battle = { number, phase: 'active', hp: 2, wrong: 0, hintAvailable: false, timeLimit: this.settings.timeLimit, deadline: challenge.format === 'typing' ? Date.now() + this.settings.timeLimit * 1000 : null };
        return this.battle;
    }
    remainingSeconds() { return this.battle?.deadline ? Math.max(0, Math.ceil((this.battle.deadline - Date.now()) / 1000)) : null; }
    pauseTimer() {
        if (this.battle?.phase === 'active' && this.battle.deadline) {
            this.battle.pausedMs = Math.max(0, this.battle.deadline - Date.now());
            this.battle.deadline = null;
        }
    }
    resumeTimer() {
        if (this.battle?.phase === 'active' && this.battle.pausedMs !== undefined) {
            this.battle.deadline = Date.now() + this.battle.pausedMs;
            delete this.battle.pausedMs;
        }
    }
    timeout() {
        if (!this.battle || this.battle.phase !== 'active' || !this.battle.deadline || this.remainingSeconds() > 0) return false;
        this.battle.phase = 'defeat';
        this.battle.hp = 0;
        return true;
    }
    submit(answer) {
        if (!this.battle || this.battle.phase !== 'active') return { status: 'ignored' };
        const challenge = this.getChallenge(this.battle.number);
        if (challenge.format === 'typing' && this.remainingSeconds() <= 0) {
            this.timeout();
            return { status: 'defeat', reason: 'Time expired.' };
        }
        const normalize = value => String(value).trim().replace(/\s+/g, ' ').replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
        if (challenge.acceptedAnswers.some(expected => normalize(expected) === normalize(answer))) {
            this.battle.phase = 'victory';
            const firstClear = !this.campaign.completed.includes(this.battle.number);
            const xpGained = firstClear ? this.rewardFor(this.battle.number) : 0;
            if (firstClear) {
                this.campaign.completed.push(this.battle.number);
                this.campaign.completed.sort((a, b) => a - b);
                this.campaign.xp += xpGained;
                this.save();
            }
            return { status: 'victory', firstClear, xpGained, final: this.battle.number === this.totalLevels };
        }
        this.battle.wrong++;
        if (challenge.format === 'typing' || this.battle.wrong >= 2) {
            this.battle.phase = 'defeat';
            this.battle.hp = 0;
            return { status: 'defeat', reason: 'Incorrect answer.' };
        }
        this.battle.hp = 1;
        this.battle.hintAvailable = true;
        return { status: 'damage', hp: 1 };
    }
}

export const engine = new GameEngine();
