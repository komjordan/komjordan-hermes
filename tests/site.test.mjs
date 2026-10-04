import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const routes = ['', 'a-propos', 'experience', 'projets', 'contact', 'mentions-legales'];
const projects = ['wazuh', 'active-directory-gpo', 'splunk', 'audit-securite', 'veeam', 'vsphere', 'glpi'];

test('all required routes were generated', () => {
  for (const route of routes) assert.ok(existsSync(`dist/${route}/index.html`), `missing /${route}`);
  for (const project of projects) assert.ok(existsSync(`dist/projets/${project}/index.html`), `missing project ${project}`);
  assert.ok(existsSync('dist/404.html'));
  assert.ok(existsSync('dist/rss.xml'));
  assert.ok(existsSync('dist/sitemap-index.xml'));
});

test('generated pages use local assets and metadata', () => {
  const home = readFileSync('dist/index.html', 'utf8');
  assert.match(home, /<html lang="fr"/);
  assert.match(home, /og:image/);
  assert.match(home, /application\/ld\+json/);
  assert.doesNotMatch(home, /fonts\.googleapis\.com|cdn\.jsdelivr\.net/);
});

test('contact uses the public Formspree form from the source', () => {
  const contact = readFileSync('dist/contact/index.html', 'utf8');
  assert.match(contact, /https:\/\/formspree\.io\/f\/xovdokao/);
});
