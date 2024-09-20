// startRepl.js
// run with `node startRepl.js`

const repl = require('repl');
const fs = require('fs');
const path = require('path');

// List of scripts to watch and load
const scripts = ['./user-data-manipulation-practice-advanced.js', './user-data-manipulation-practice-basic.js'];

// Function to load and expose module.exports to the REPL context
const loadFunctions = (context) => {
    scripts.forEach(script => {
        const scriptPath = path.resolve(__dirname, script);
        try {
            // Clear the module from the require cache to get the latest version
            delete require.cache[require.resolve(scriptPath)];
            // Require the updated module
            const moduleExports = require(scriptPath);

            // Add each exported function to the REPL context
            Object.keys(moduleExports).forEach(fnName => {
                context[fnName] = moduleExports[fnName];
            });

            console.log(`Loaded functions from ${script}`);
        } catch (error) {
            console.error(`Error loading ${script}:`, error);
        }
    });
};

// Start the REPL and get the server instance
const replServer = repl.start({ prompt: '> ' });

// Initially load functions into the REPL context
loadFunctions(replServer.context);

// Watch scripts for changes and reload functions when they change
scripts.forEach(script => {
    const scriptPath = path.resolve(__dirname, script);
    fs.watchFile(scriptPath, (curr, prev) => {
        console.log(`${script} has changed, reloading functions...`);
        loadFunctions(replServer.context); // Reload functions into REPL context
    });
});
