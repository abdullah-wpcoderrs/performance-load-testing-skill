#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const readline = require('node:readline/promises');

const source = path.resolve(__dirname, '..');
const manifestName = '.load-testing-skill-install.json';
const arguments_ = process.argv.slice(2).filter((argument) => argument !== '--');

const agents = [
  { id: 'codex', label: 'Codex', global: '.codex/skills', project: '.codex/skills' },
  { id: 'antigravity', label: 'Antigravity', global: '.gemini/config/skills', project: '.agents/skills' },
  { id: 'claude-code', label: 'Claude Code', global: '.claude/skills', project: '.claude/skills' },
  { id: 'opencode', label: 'OpenCode', global: '.config/opencode/skills', project: '.agents/skills' },
  { id: 'copilot', label: 'GitHub Copilot', global: '.copilot/skills', project: '.github/skills' },
  { id: 'gemini-cli', label: 'Gemini CLI', global: '.gemini/skills', project: '.gemini/skills' },
  { id: 'qwen-code', label: 'Qwen Code', global: '.qwen/skills', project: '.qwen/skills' },
  { id: 'kiro', label: 'Kiro', global: '.kiro/skills', project: '.kiro/skills' },
  { id: 'cline', label: 'Cline', global: '.cline/skills', project: '.cline/skills' },
  { id: 'roo-code', label: 'Roo Code', global: '.roo/skills', project: '.roo/skills' },
  { id: 'kilo-code', label: 'Kilo Code', global: '.kilo/skills', project: '.kilo/skills' },
  { id: 'warp', label: 'Warp', global: '.warp/skills', project: '.warp/skills' },
  { id: 'openclaw', label: 'OpenClaw', global: '.openclaw/skills', project: '.agents/skills' },
  { id: 'shared-agents', label: 'Shared Agent Skills root', global: '.agents/skills', project: '.agents/skills' },
];
const bundleEntries = [
  'SKILL.md', 'README.md', 'agents', 'references', 'package.json',
  'scripts/next_report_path.py', 'scripts/prepend_report.py',
  'scripts/register-symlinks.ps1', 'scripts/register-symlinks.sh',
];

function usage() {
  console.log(`Usage: load-testing-skill [options]

Install the load-testing skill with an interactive scope, agent, and method flow.

Options:
  --global | --project       Set the install scope without prompting.
  --agents <ids>             Comma-separated agent IDs (for example: codex,antigravity).
  --method symlink|copy      Set the install method without prompting.
  --uninstall                Remove an installed skill using the same scope and agent flow.
  --yes                      Accept the displayed plan.
  --dry-run                  Display the plan without changing files.
  --force                    Replace an existing managed copy and conflicting symlinks.
  --help                     Display this help.
`);
}

function optionValue(name) {
  const index = arguments_.indexOf(name);
  return index === -1 ? undefined : arguments_[index + 1];
}

function has(name) {
  return arguments_.includes(name);
}

function validateOptions() {
  const known = new Set(['--global', '--project', '--agents', '--method', '--uninstall', '--yes', '--dry-run', '--force', '--help', '-h']);
  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index];
    if (!known.has(argument)) throw new Error(`Unknown option: ${argument}`);
    if (argument === '--agents' || argument === '--method') index += 1;
  }
  if (has('--global') && has('--project')) throw new Error('Choose either --global or --project, not both.');
}

function destinationFor(scope) {
  return scope === 'global'
    ? path.join(os.homedir(), '.agent-skills', 'load-testing')
    : path.join(process.cwd(), '.agent-skills', 'load-testing');
}

function targetFor(agent, scope) {
  const root = agent[scope];
  return path.join(scope === 'global' ? os.homedir() : process.cwd(), root, 'load-testing');
}

function isOwnedInstall(destination) {
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(destination, manifestName), 'utf8'));
    return manifest.package === 'performance-load-testing-skill';
  } catch {
    return false;
  }
}

function copyBundle(destination) {
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of bundleEntries) {
    const from = path.join(source, entry);
    const to = path.join(destination, entry);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.cpSync(from, to, { recursive: true, dereference: true });
  }
  fs.writeFileSync(
    path.join(destination, manifestName),
    `${JSON.stringify({ package: 'performance-load-testing-skill', source, installedAt: new Date().toISOString() }, null, 2)}\n`,
  );
}

function pathState(target) {
  try {
    const stat = fs.lstatSync(target);
    return stat.isSymbolicLink() ? 'symlink' : 'path';
  } catch (error) {
    if (error.code === 'ENOENT') return 'missing';
    throw error;
  }
}

function sameTarget(target, destination) {
  try {
    return fs.realpathSync(target) === fs.realpathSync(destination);
  } catch {
    return false;
  }
}

function parseAgentIds(value) {
  const ids = value.split(',').map((id) => id.trim()).filter(Boolean);
  if (ids.includes('all')) return agents;
  const selected = ids.map((id) => agents.find((agent) => agent.id === id));
  const unknown = ids.filter((id, index) => !selected[index]);
  if (unknown.length) throw new Error(`Unknown agent ID: ${unknown.join(', ')}`);
  return [...new Map(selected.map((agent) => [agent.id, agent])).values()];
}

async function promptPlan() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const scopeAnswer = await rl.question('Install scope: [1] Global (recommended)  [2] Project  (1): ');
    const scope = scopeAnswer.trim() === '2' ? 'project' : 'global';

    console.log('\nSelect target agents (comma-separated numbers, or all):');
    agents.forEach((agent, index) => console.log(`  ${index + 1}. ${agent.label} (${agent.id})`));
    const agentAnswer = await rl.question('Agents (1,2): ');
    const selected = agentAnswer.trim().toLowerCase() === 'all'
      ? agents
      : (agentAnswer.trim() || '1,2').split(',').map((number) => agents[Number(number.trim()) - 1]).filter(Boolean);
    if (!selected.length) throw new Error('Select at least one agent.');

    const methodAnswer = await rl.question('Install method: [1] Symlink (recommended)  [2] Copy  (1): ');
    return { scope, selected, method: methodAnswer.trim() === '2' ? 'copy' : 'symlink' };
  } finally {
    rl.close();
  }
}

async function promptUninstallPlan() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const scopeAnswer = await rl.question('Remove from: [1] Global (recommended)  [2] Project  (1): ');
    const scope = scopeAnswer.trim() === '2' ? 'project' : 'global';
    console.log('\nSelect target agents (comma-separated numbers, or all):');
    agents.forEach((agent, index) => console.log(`  ${index + 1}. ${agent.label} (${agent.id})`));
    const agentAnswer = await rl.question('Agents (1,2): ');
    const selected = agentAnswer.trim().toLowerCase() === 'all'
      ? agents
      : (agentAnswer.trim() || '1,2').split(',').map((number) => agents[Number(number.trim()) - 1]).filter(Boolean);
    if (!selected.length) throw new Error('Select at least one agent.');
    return { scope, selected };
  } finally {
    rl.close();
  }
}

function printPlan(plan, destination) {
  console.log('\nInstallation plan');
  console.log(`  Scope: ${plan.scope}`);
  console.log(`  Method: ${plan.method}`);
  console.log(`  Canonical copy: ${destination}`);
  console.log('  Agent targets:');
  for (const agent of plan.selected) console.log(`    - ${agent.label}: ${targetFor(agent, plan.scope)}`);
}

async function confirm(plan) {
  if (has('--yes') || has('--dry-run')) return true;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    return (await rl.question('\nProceed? (Y/n): ')).trim().toLowerCase() !== 'n';
  } finally {
    rl.close();
  }
}

async function confirmMigration(plan, destination, force) {
  if (force || plan.method !== 'symlink') return force;
  const conflicts = plan.selected
    .map((agent) => targetFor(agent, plan.scope))
    .filter((target) => pathState(target) !== 'missing' && !sameTarget(target, destination));
  if (!conflicts.length) return false;
  if (has('--yes') || has('--dry-run')) {
    throw new Error(`Existing path requires --force to replace: ${conflicts[0]}`);
  }
  const unsafe = conflicts.find((target) => pathState(target) !== 'symlink');
  if (unsafe) throw new Error(`Refusing to replace a directory or file: ${unsafe}`);
  console.log('\nExisting symlinks were created by another installer:');
  conflicts.forEach((target) => console.log(`  - ${target}`));
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question('Replace these symlinks with the canonical copy above? (y/N): ');
    if (answer.trim().toLowerCase() !== 'y') throw new Error('Cancelled; existing symlinks were kept.');
    return true;
  } finally {
    rl.close();
  }
}

function prepareDestination(destination, force, dryRun) {
  if (!fs.existsSync(destination)) {
    if (dryRun) console.log(`Would install canonical copy: ${destination}`);
    else copyBundle(destination);
    return;
  }
  if (!isOwnedInstall(destination)) throw new Error(`Refusing to replace unmanaged path: ${destination}`);
  if (force) {
    if (dryRun) console.log(`Would update canonical copy: ${destination}`);
    else {
      fs.rmSync(destination, { recursive: true, force: true });
      copyBundle(destination);
    }
  } else {
    console.log(`Using existing canonical copy: ${destination}`);
  }
}

function installTarget(target, destination, method, force, dryRun) {
  const state = pathState(target);
  if (state !== 'missing') {
    if (method === 'symlink' && state === 'symlink' && sameTarget(target, destination)) {
      console.log(`Already linked: ${target}`);
      return;
    }
    if (!force) throw new Error(`Existing ${state} requires --force to replace: ${target}`);
    if (dryRun) {
      console.log(`Would replace: ${target}`);
      return;
    }
    fs.rmSync(target, { recursive: state === 'path', force: true });
  }
  if (dryRun) {
    console.log(`Would ${method}: ${target} <- ${destination}`);
    return;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (method === 'symlink') fs.symlinkSync(destination, target, process.platform === 'win32' ? 'junction' : 'dir');
  else fs.cpSync(destination, target, { recursive: true, dereference: true });
  console.log(`${method === 'symlink' ? 'Linked' : 'Copied'}: ${target}`);
}

function removeTarget(target, destination, dryRun) {
  const state = pathState(target);
  if (state === 'missing') {
    console.log(`Not installed: ${target}`);
    return;
  }
  const removable = (state === 'symlink' && sameTarget(target, destination)) || (state === 'path' && isOwnedInstall(target));
  if (!removable) throw new Error(`Refusing to remove an unmanaged path: ${target}`);
  if (dryRun) {
    console.log(`Would remove: ${target}`);
    return;
  }
  fs.rmSync(target, { recursive: state === 'path', force: true });
  console.log(`Removed: ${target}`);
}

function cleanupCanonicalCopy(destination, scope, dryRun) {
  if (!fs.existsSync(destination) || !isOwnedInstall(destination)) return;
  const stillLinked = agents.some((agent) => {
    const target = targetFor(agent, scope);
    return pathState(target) === 'symlink' && sameTarget(target, destination);
  });
  if (stillLinked) {
    console.log(`Kept canonical copy (still used): ${destination}`);
    return;
  }
  if (dryRun) {
    console.log(`Would remove canonical copy: ${destination}`);
    return;
  }
  fs.rmSync(destination, { recursive: true, force: true });
  console.log(`Removed canonical copy: ${destination}`);
}

async function main() {
  if (has('--help') || has('-h')) return usage();
  validateOptions();
  const uninstall = has('--uninstall');
  const scope = has('--project') ? 'project' : 'global';
  const selected = optionValue('--agents') ? parseAgentIds(optionValue('--agents')) : undefined;
  const method = optionValue('--method');
  if (method && !['symlink', 'copy'].includes(method)) throw new Error('Use --method symlink or --method copy.');
  if (uninstall && method) throw new Error('--method cannot be used with --uninstall.');
  const plan = uninstall
    ? (selected ? { scope, selected } : await promptUninstallPlan())
    : (selected && method ? { scope, selected, method } : await promptPlan());
  const destination = destinationFor(plan.scope);
  if (uninstall) {
    console.log('\nRemoval plan');
    console.log(`  Scope: ${plan.scope}`);
    console.log(`  Canonical copy: ${destination}`);
    console.log('  Agent targets:');
    for (const agent of plan.selected) console.log(`    - ${agent.label}: ${targetFor(agent, plan.scope)}`);
  } else {
    printPlan(plan, destination);
  }
  if (!(await confirm(plan))) return console.log('Cancelled.');
  if (uninstall) {
    for (const agent of plan.selected) removeTarget(targetFor(agent, plan.scope), destination, has('--dry-run'));
    cleanupCanonicalCopy(destination, plan.scope, has('--dry-run'));
    if (!has('--dry-run')) console.log('\nDone. Restart or reload the selected agent sessions.');
    return;
  }
  const force = await confirmMigration(plan, destination, has('--force'));
  prepareDestination(destination, force, has('--dry-run'));
  for (const agent of plan.selected) installTarget(targetFor(agent, plan.scope), destination, plan.method, force, has('--dry-run'));
  if (!has('--dry-run')) console.log('\nDone. Restart or reload the selected agent sessions to discover load-testing.');
}

main().catch((error) => {
  console.error(`Installation failed: ${error.message}`);
  process.exit(1);
});
