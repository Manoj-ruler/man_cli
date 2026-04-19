/**
 * TermAssist CLI — Configuration Module
 * 
 * Manages ~/.termassist/config.json
 */

const fs   = require('fs');
const path = require('path');
const os   = require('os');

const CONFIG_DIR  = path.join(os.homedir(), '.termassist');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

const DEFAULT_CONFIG = {
  api_token: '',
  api_url: 'https://termassist.vercel.app',
  sync_enabled: false,
};

/**
 * Load config from disk. Creates default if missing.
 */
function load() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      save(DEFAULT_CONFIG);
      return { ...DEFAULT_CONFIG };
    }
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Save config to disk.
 */
function save(config) {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save config:', err.message);
  }
}

/**
 * Update specific config values.
 */
function update(updates) {
  const current = load();
  const updated = { ...current, ...updates };
  save(updated);
  return updated;
}

module.exports = { load, save, update, CONFIG_FILE };
