// Game State Management System & Finite State Machine
// Handles screen transitions, player progression, strict hardcoded answer validation, and HP penalties.

import { DEFAULT_LEVELS_JS } from './levels.js';

class GameState {
    constructor() {
        this.currentScreen = 'loading'; // 'loading' | 'menu' | 'topic' | 'map' | 'gameplay' | 'victory' | 'defeat' | 'endgame'
        this.topic = 'JavaScript Loops & Systems';
        this.levels = [...DEFAULT_LEVELS_JS];
        this.currentLevelIndex = 0; // 0 to 29 (maps to levels 1 to 30)
        
        // Player progression
        this.maxHp = 2; // 2 strikes rule: 1st wrong = damage + hint, 2nd wrong = defeat
        this.currentHp = 2;
        this.xp = 0;
        this.unlockedLevel = parseInt(localStorage.getItem('bughunter_unlocked_level') || '1', 10);
        
        // Battle attempt tracking
        this.wrongAttemptsThisLevel = 0;
        this.hintRevealed = false;
        this.typingTimeLimit = 20; // 20s for code typing mode
        this.typingTimeRemaining = 20;
        this.typingTimerInterval = null;
        
        // Audio & UI settings
        this.theme = localStorage.getItem('bughunter_theme') || 'dark'; // 'dark' | 'light'
        this.listeners = new Set();
    }

    subscribe(fn) {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    }

    notify(event, data) {
        for (const fn of this.listeners) {
            try {
                fn(event, data, this);
            } catch (err) {
                console.error('[GameState] Listener error:', err);
            }
        }
    }

    get currentLevel() {
        return this.levels[this.currentLevelIndex] || this.levels[0];
    }

    get playerRank() {
        const lvl = this.currentLevelIndex + 1;
        if (lvl <= 5) return 'E-Rank';
        if (lvl <= 10) return 'D-Rank';
        if (lvl <= 15) return 'C-Rank';
        if (lvl <= 20) return 'B-Rank';
        if (lvl <= 25) return 'A-Rank';
        return 'S-Rank';
    }

    setScreen(screenName) {
        this.currentScreen = screenName;
        this.notify('screen_change', screenName);
    }

    setTheme(newTheme) {
        this.theme = newTheme;
        localStorage.setItem('bughunter_theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        this.notify('theme_change', newTheme);
    }

    setCurriculum(newLevels, topicName) {
        this.levels = newLevels;
        this.topic = topicName;
        this.notify('curriculum_updated', { levels: newLevels, topic: topicName });
    }

    selectLevel(levelNumber) {
        const idx = levelNumber - 1;
        if (idx < 0 || idx >= this.levels.length) return false;
        if (levelNumber > this.unlockedLevel) return false; // Locked level

        this.currentLevelIndex = idx;
        this.resetLevelCombatState();
        this.setScreen('gameplay');
        this.notify('level_selected', this.currentLevel);
        return true;
    }

    resetLevelCombatState() {
        this.currentHp = this.maxHp;
        this.wrongAttemptsThisLevel = 0;
        this.hintRevealed = false;
        this.clearTypingTimer();
        this.typingTimeRemaining = this.typingTimeLimit;
    }

    startTypingTimer(onTick, onTimeout) {
        this.clearTypingTimer();
        this.typingTimeRemaining = this.typingTimeLimit;
        
        onTick(this.typingTimeRemaining, this.typingTimeLimit);
        
        this.typingTimerInterval = setInterval(() => {
            this.typingTimeRemaining--;
            onTick(this.typingTimeRemaining, this.typingTimeLimit);

            if (this.typingTimeRemaining <= 0) {
                this.clearTypingTimer();
                this.currentHp = 0;
                this.notify('timer_defeat', this.currentLevel);
                onTimeout();
            }
        }, 1000);
    }

    clearTypingTimer() {
        if (this.typingTimerInterval) {
            clearInterval(this.typingTimerInterval);
            this.typingTimerInterval = null;
        }
    }

    // STRICT HARDCODED VALIDATION
    // AI is never allowed to determine correctness to prevent hallucinations
    validateAnswer(submittedAnswer) {
        if (!submittedAnswer) return false;
        const level = this.currentLevel;
        const expected = String(level.correct_answer).trim();
        const actual = String(submittedAnswer).trim();

        // Direct strict match
        if (actual === expected) return true;

        // Tolerant matching for whitespace & single quotes/double quotes in typing mode
        const normalizeCode = (s) => s.replace(/\s+/g, ' ').replace(/'/g, '"').trim();
        return normalizeCode(actual) === normalizeCode(expected);
    }

    handleWrongAnswer() {
        this.wrongAttemptsThisLevel++;

        if (this.wrongAttemptsThisLevel === 1) {
            // 1st strike: takes 1 damage (HP drops to 1), summon Shadow Pet hint
            this.currentHp = 1;
            this.hintRevealed = true;
            this.notify('player_damage', {
                currentHp: this.currentHp,
                damage: 1,
                hintAvailable: true,
                hint: this.currentLevel.hint
            });
            return { defeated: false, hintAvailable: true, hp: this.currentHp };
        } else {
            // 2nd strike: player dies immediately (HP drops to 0)
            this.clearTypingTimer();
            this.currentHp = 0;
            this.notify('player_defeated', {
                level: this.currentLevel,
                reason: 'Two incorrect attempts. Defeated by dungeon anomaly!'
            });
            return { defeated: true, hintAvailable: true, hp: 0 };
        }
    }

    handleCorrectAnswer() {
        this.clearTypingTimer();
        const levelNum = this.currentLevelIndex + 1;
        
        // Award XP
        const xpGain = levelNum % 10 === 0 ? 250 : 100;
        this.xp += xpGain;

        // Unlock next level if currently at progress frontier
        if (levelNum === this.unlockedLevel && this.unlockedLevel < 30) {
            this.unlockedLevel++;
            localStorage.setItem('bughunter_unlocked_level', this.unlockedLevel.toString());
        }

        const isFinalBoss = levelNum === 30;

        this.notify('player_victory', {
            level: this.currentLevel,
            xpGained: xpGain,
            totalXp: this.xp,
            isFinalBoss,
            unlockedNext: this.unlockedLevel > levelNum
        });

        return { isFinalBoss, xpGained: xpGain };
    }

    nextLevel() {
        if (this.currentLevelIndex < 29) {
            this.currentLevelIndex++;
            this.resetLevelCombatState();
            this.setScreen('gameplay');
            this.notify('level_selected', this.currentLevel);
        } else {
            this.setScreen('endgame');
        }
    }

    retryLevel() {
        this.resetLevelCombatState();
        this.setScreen('gameplay');
        this.notify('level_selected', this.currentLevel);
    }

    resetProgress() {
        this.unlockedLevel = 1;
        this.currentLevelIndex = 0;
        this.xp = 0;
        localStorage.setItem('bughunter_unlocked_level', '1');
        this.resetLevelCombatState();
        this.setScreen('menu');
        this.notify('progress_reset');
    }
}

export const state = new GameState();
