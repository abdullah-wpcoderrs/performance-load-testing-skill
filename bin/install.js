#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const source = path.resolve(__dirname, '..');
const destination = path.join(os.homedir(), '.agent-skills', 'load-testing');
const manifestName = '.load-testing-skill-install.json';
const arguments_ = new Set(process.argv.slice(2).filter((argument) => argument !== '--'));

if (arguments_.has('--help') || arguments_.has('-h')) {
  console.log(`Usage: load-testing-skill [--dry-run] [--force]\n\nInstall a durable local copy of the load-testing skill, then register safe user-level symlinks.\n\nOptions:\n  --dry-run  Show the copy and link operations without changing files.\n  --force    Replace a copy previously installed by this command.`);
  process.exit(0);
}

for (const argument of arguments_) {
  if (!['--dry-run', '--force'].includes(argument)) {
    console.error(`Unknown option: ${argument}`);
    process.exit(2);
  }
}

const dryRun = arguments_.has('--dry-run');
const force = arguments_.has('--force');
const skillRoots = [
  '.codex/skills',
  '.claude/skills',
  '.config/opencode/skills',
  '.copilot/skills',
  '.gemini/skills',
  '.qwen/skills',
  '.kiro/skills',
  '.cline/skills',
  '.roo/skills',
  '.kilo/skills',
  '.warp/skills',
  '.openclaw/skills',
  '.agents/skills',
];
const bundleEntries = ['SKILL.md', 'README.md', 'agents', 'references', 'scripts', 'package.json'];

function isOwnedInstall() {
  const manifest = path.join(destination, manifestName);
  if (!fs.existsSync(manifest)) return false;
  try {
    return JSON.parse(fs.readFileSync(manifest, 'utf8')).package === 'performance-load-testing-skill';
  } catch {
    return false;
  }
}

function installBundle() {
  if (fs.existsSync(destination)) {
    if (!isOwnedInstall()) {
      throw new Error(`Refusing to replace unmanaged path: ${destination}`);
    }
    if (!force) {
      console.log(`Using existing install: ${destination}`);
      return;
    }
    if (dryRun) {
      console.log(`Would update: ${destination}`);
      return;
    }
    fs.rmSync(destination, { recursive: true, force: true });
  }

  if (dryRun) {
    console.log(`Would install: ${source} -> ${destination}`);
    return;
  }

  fs.mkdirSync(destination, { recursive: true });
  for (const entry of bundleEntries) {
    const from = path.join(source, entry);
    const to = path.join(destination, entry);
    fs.cpSync(from, to, { recursive: true, dereference: true });
  }
  fs.writeFileSync(
    path.join(destination, manifestName),
    `${JSON.stringify({ package: 'performance-load-testing-skill', source, installedAt: new Date().toISOString() }, null, 2)}\n`,
  );
  console.log(`Installed: ${destination}`);
}

function sameTarget(target) {
  return fs.realpathSync(target) === fs.realpathSync(destination);
}

function linkSkill(root) {
  const target = path.join(os.homedir(), root, 'load-testing');
  let existing;
  try {
    existing = fs.lstatSync(target);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  if (existing) {
    if (existing.isSymbolicLink() && sameTarget(target)) {
      console.log(`Already linked: ${target}`);
      return;
    }
    throw new Error(`Refusing to replace existing path: ${target}`);
  }

  if (dryRun) {
    console.log(`Would link: ${target} -> ${destination}`);
    return;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.symlinkSync(destination, target, process.platform === 'win32' ? 'junction' : 'dir');
  console.log(`Linked: ${target} -> ${destination}`);
}

try {
  installBundle();
  for (const root of skillRoots) linkSkill(root);
  if (!dryRun) console.log('Done. Restart or reload your AI agent session to discover the skill.');
} catch (error) {
  console.error(`Installation failed: ${error.message}`);
  process.exit(1);
}
