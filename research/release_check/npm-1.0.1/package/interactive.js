const { search } = require('@inquirer/prompts');
const chalk = require('chalk');
const { searchMany } = require('./search');

// Brutalist Pink hex code for UI branding
const pink = chalk.hex('#FF2D6B');

async function launchInteractiveMode() {
    console.clear();
    console.log(pink.bold('Terminal Assistant - Live Search\n'));

    try {
        const selectedCommand = await search({
            message: '🔍 Search commands:',
            // The source function runs every time the user types a keystroke
            source: async (input) => {
                // Fetch top results from your local BM25 engine (sub-5ms)
                const results = searchMany(input);
                return results;
            },
        });

        return selectedCommand; // e.g., "npm run dev"
    } catch (error) {
        // Handle user pressing Ctrl+C to exit
        if (error.name === 'ExitPromptError') {
            process.exit(0);
        }
        throw error;
    }
}

module.exports = { launchInteractiveMode };
