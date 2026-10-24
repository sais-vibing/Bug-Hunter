import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('every directly referenced game element exists in the page', () => {
    const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    const script = fs.readFileSync(new URL('../js/main.js', import.meta.url), 'utf8');
    const ids = [...script.matchAll(/el\('([^']+)'\)/g)].map(match => match[1]);
    const missing = [...new Set(ids)].filter(id => !html.includes(`id="${id}"`));
    assert.deepEqual(missing, []);
});
