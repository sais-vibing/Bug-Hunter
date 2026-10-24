import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable, Writable } from 'node:stream';

process.env.NODE_ENV = 'test';
const { makePlan, makeChallenge, parseModelJson, server } = await import('../server.mjs');

async function request(method, url, body, headers = {}) {
    const req = Readable.from(body === undefined ? [] : [JSON.stringify(body)]);
    req.method = method;
    req.url = url;
    req.headers = headers;
    const chunks = [];
    const res = new Writable({ write(chunk, _encoding, done) { chunks.push(chunk); done(); } });
    res.writeHead = (status, responseHeaders) => { res.status = status; res.headers = responseHeaders; };
    const finished = new Promise(resolve => res.on('finish', resolve));
    server.emit('request', req, res);
    await finished;
    return { status: res.status, body: Buffer.concat(chunks).toString('utf8'), headers: res.headers };
}

test('demo plan and challenge work with no AI service', async () => {
    const result = await makePlan('Mixed Coding Basics Demo', 'unused');
    assert.equal(result.plan.levels.length, 30);
    const question = await makeChallenge(result.plan, 1, 'unused');
    assert.equal(question.source, 'demo');
    assert.equal(question.challenge.level, 1);
});

test('malformed Ollama content falls back to valid Gemini content', async () => {
    const oldFetch = globalThis.fetch;
    const oldKey = process.env.GEMINI_API_KEY;
    process.env.GEMINI_API_KEY = 'test-only';
    let calls = 0;
    const chapters = [{ title: 'Operations', objectives: Array.from({ length: 10 }, (_, index) => ({ topic: `Operation ${index + 1}`, objective: `Solve operation ${index + 1}` })) }];
    globalThis.fetch = async url => {
        calls++;
        if (String(url).includes('/api/generate')) return { ok: true, json: async () => ({ response: '{bad json' }) };
        return { ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: JSON.stringify({ chapters }) }] } }] }) };
    };
    try {
        const result = await makePlan('Python operations', 'fake-model');
        assert.equal(result.source, 'gemini');
        assert.equal(result.plan.levels.length, 10);
        assert.equal(calls, 3);
    } finally {
        globalThis.fetch = oldFetch;
        if (oldKey === undefined) delete process.env.GEMINI_API_KEY;
        else process.env.GEMINI_API_KEY = oldKey;
    }
});

test('JSON parser accepts a fenced structured response', () => {
    assert.deepEqual(parseModelJson('```json\n{"ok":true}\n```'), { ok: true });
});

test('local routes serve the demo and block private files', async () => {
    const planResponse = await request('POST', '/api/plan', { goal: 'Mixed Coding Basics Demo' }, { 'content-type': 'application/json' });
    assert.equal(planResponse.status, 200);
    const plan = JSON.parse(planResponse.body).plan;
    const questionResponse = await request('POST', '/api/challenge', { plan, level: 1 }, { 'content-type': 'application/json' });
    assert.equal(questionResponse.status, 200);
    assert.equal(JSON.parse(questionResponse.body).challenge.level, 1);
    assert.equal((await request('GET', '/.env')).status, 404);
    assert.equal((await request('GET', '/index.html')).status, 200);
    assert.equal((await request('GET', '/../.env')).status, 404);
});
