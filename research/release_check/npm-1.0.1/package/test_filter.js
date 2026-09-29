const { searchMany } = require('./search');
const os = require('os');

console.log('Current OS:', os.platform());
console.log('---');

const query = 'find python files';
console.log(`Query: "${query}"`);

const results = searchMany(query, 5);

results.forEach((res, i) => {
    console.log(`${i + 1}. ${res.name}`);
});

console.log('---');
console.log('Verifying if Unix find is excluded...');
const unixFind = results.find(r => r.name.includes("find . -name '*.py'"));
if (unixFind) {
    console.error('FAIL: Unix find command leaked into Windows results!');
    process.exit(1);
} else {
    console.log('SUCCESS: Unix find command excluded.');
}
