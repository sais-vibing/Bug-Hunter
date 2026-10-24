import { getDifficultyForLevel, DEFAULT_LEVELS_JS } from './levels.js';

const nonempty = value => typeof value === 'string' && value.trim().length > 0;

export function buildPlan(goal, chapters) {
    if (!nonempty(goal) || !Array.isArray(chapters) || chapters.length < 1 || chapters.length > 3) {
        throw new Error('The learning plan is incomplete.');
    }
    const levels = [];
    chapters.forEach((chapter, chapterIndex) => {
        if (!nonempty(chapter.title) || !Array.isArray(chapter.objectives) || chapter.objectives.length !== 10) {
            throw new Error(`Chapter ${chapterIndex + 1} needs ten distinct learning objectives.`);
        }
        chapter.objectives.forEach((entry, position) => {
            if (!nonempty(entry?.topic) || !nonempty(entry?.objective)) {
                throw new Error('Every level needs a topic and objective.');
            }
            const level = chapterIndex * 10 + position + 1;
            levels.push({
                level,
                chapter: chapterIndex + 1,
                chapterTitle: chapter.title.trim(),
                topic: entry.topic.trim(),
                objective: entry.objective.trim(),
                difficulty: getDifficultyForLevel(level),
                enemyType: level % 10 === 0 ? (chapterIndex === chapters.length - 1 ? 'final boss' : 'boss') : level % 10 === 5 ? 'medium' : 'easy'
            });
        });
    });
    const objectives = levels.map(level => level.objective.toLowerCase());
    if (new Set(objectives).size !== objectives.length) throw new Error('The plan repeats learning objectives.');
    return { goal: goal.trim(), levels };
}

export function validatePlan(plan) {
    if (!plan || !nonempty(plan.goal) || !Array.isArray(plan.levels) || ![10, 20, 30].includes(plan.levels.length)) {
        throw new Error('The saved learning plan is invalid.');
    }
    plan.levels.forEach((entry, index) => {
        const n = index + 1;
        if (entry.level !== n || entry.chapter !== Math.ceil(n / 10) || entry.difficulty !== getDifficultyForLevel(n) || !nonempty(entry.topic) || !nonempty(entry.objective)) {
            throw new Error(`Level ${n} has invalid plan data.`);
        }
    });
    return plan;
}

export function validateChallenge(raw, planLevel) {
    if (!raw || !planLevel || !['mcq', 'typing'].includes(raw.format)) throw new Error('Unsupported challenge format.');
    const fields = ['question', 'code', 'correctAnswer', 'correctedCode', 'bugCause', 'explanation', 'concept', 'hint'];
    if (fields.some(field => !nonempty(raw[field]))) throw new Error('The challenge is missing a teaching field.');
    if (raw.level !== planLevel.level) throw new Error('Challenge level does not match the plan.');
    const acceptedAnswers = Array.isArray(raw.acceptedAnswers) ? raw.acceptedAnswers : [raw.correctAnswer];
    if (acceptedAnswers.length < 1 || acceptedAnswers.length > 5 || !acceptedAnswers.every(nonempty) || !acceptedAnswers.includes(raw.correctAnswer)) {
        throw new Error('The challenge has invalid accepted answers.');
    }
    if (raw.format === 'mcq') {
        if (!Array.isArray(raw.choices) || raw.choices.length !== 3 || !raw.choices.every(nonempty) || new Set(raw.choices).size !== 3 || !raw.choices.includes(raw.correctAnswer)) {
            throw new Error('A choice challenge needs three unique choices and one matching answer.');
        }
    }
    if (raw.question.length > 700 || raw.code.length > 1800 || raw.correctAnswer.length > 160) throw new Error('Challenge text is too long.');
    if (!raw.correctedCode.includes(raw.correctAnswer)) throw new Error('Corrected code does not contain the stated answer.');
    return {
        level: planLevel.level,
        chapter: planLevel.chapter,
        topic: planLevel.topic,
        objective: planLevel.objective,
        difficulty: planLevel.difficulty,
        format: raw.format,
        question: raw.question.trim(),
        code: raw.code.trim(),
        choices: raw.format === 'mcq' ? raw.choices.map(v => v.trim()) : [],
        correctAnswer: raw.correctAnswer.trim(),
        acceptedAnswers: acceptedAnswers.map(v => v.trim()),
        correctedCode: raw.correctedCode.trim(),
        bugCause: raw.bugCause.trim(),
        explanation: raw.explanation.trim(),
        concept: raw.concept.trim(),
        hint: raw.hint.trim()
    };
}

export function demoCampaign() {
    const chapters = [0, 1, 2].map(chapterIndex => ({
        title: ['Coding Foundations', 'Logic and Collections', 'Debugging Techniques'][chapterIndex],
        objectives: DEFAULT_LEVELS_JS.slice(chapterIndex * 10, chapterIndex * 10 + 10).map(level => ({
            topic: level.title,
            objective: level.prompt
        }))
    }));
    return buildPlan('Mixed Coding Basics Demo', chapters);
}

export function demoChallenge(planLevel) {
    const old = DEFAULT_LEVELS_JS[planLevel.level - 1];
    if (!old) throw new Error('No demo challenge exists for this level.');
    const answer = String(old.correct_answer);
    const code = old.buggy_code.includes('?') ? old.buggy_code.replace('?', answer) : old.buggy_code.replace('i--', answer);
    return validateChallenge({
        level: planLevel.level,
        format: old.mode === 'typing' ? 'typing' : 'mcq',
        question: old.prompt,
        code: old.buggy_code,
        choices: old.options,
        correctAnswer: answer,
        acceptedAnswers: [answer],
        correctedCode: code,
        bugCause: old.explanation,
        explanation: old.explanation,
        concept: old.title,
        hint: old.hint
    }, planLevel);
}
