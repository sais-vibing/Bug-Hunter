async function post(route, body) {
    const response = await fetch(route, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);
    return data;
}

export const api = {
    plan: (goal, model) => post('/api/plan', { goal, model }),
    challenge: (plan, level, model) => post('/api/challenge', { plan, level, model }),
    testOllama: model => post('/api/test-ollama', { model })
};
