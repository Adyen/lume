const path = require('path');

module.exports = async () => ({
    verbose: true,
    rootDir: path.resolve(__dirname, '..'),
    roots: [
        '<rootDir>/unit/',
    ],
    moduleFileExtensions: [
        "js",
        "json",
        // tell Jest to handle `*.vue` files
        "vue"
    ],
    transformIgnorePatterns: [
        // By default Jest ignore everything inside node_modules
        // Here we override that to keep ignoring stuff inside node_modules,
        // except Vue SFCs and assets
        'node_modules/\\.+?(?<!\\.(vue|svg|png|gif|jpe?g))$',
    ],
    testEnvironment: 'jsdom',
    transform: {
        // process `*.js` files with `babel-jest`
        ".*\\.(js)$": "babel-jest",
        // process `*.vue` files with `vue-jest`
        ".*\\.(vue)$": "vue-jest"
    }
});
