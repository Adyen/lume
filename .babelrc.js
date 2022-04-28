module.exports = {
    // Makes sure Jest doesn't choke on import statements
    presets: [
        ['@babel/preset-env', {
            useBuiltIns: 'usage',
            corejs: 3,
        }],
    ],
};
