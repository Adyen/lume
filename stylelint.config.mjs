// Allowed BEM prefixes for Lume:
// - lume: standard Lume component classes
// - axis, sparkline-chart: legacy public Lume CSS classes preserved for backwards compatibility
// - sb: Storybook-only styles
const bemPattern =
    '^(?:lume|axis|sparkline-chart|sb)(?:-[a-zA-Z0-9]+)*(?:__[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:--[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:\\[.+\\])?$';

const mixinPattern = '^(?:lume|generate|sb)(?:-[a-zA-Z0-9]+)*$';

const allowedNestedSelectors =
    '(:(a(ctive|ny(-link)*)|after|backdrop|before|checked|placeholder|d(efault|i(r()|sabled))|e(mpty|nabled)|f(irst(-(child|of-type))*|ullscreen|ocus)|hover|in(determinate|valid|-range)|la(ng()|(st-(child|of-type)))|l(eft|ink)|n(ot()|th-((last-)*(child|of-type)()))|o(nly-(child|of-type)|ptional|ut-of-range)|r(e(ad-(only|write)|quired)|ight|oot)|scope|target|v(alid|isited))|&__|button|&--|\\[data-|\\[draggable|\\[open|-enter-active|-leave-active)';

export default {
    extends: ['stylelint-config-recommended', 'stylelint-config-standard', 'stylelint-config-sass-guidelines'],
    ignoreFiles: ['**/dist/**', '**/coverage/**', '**/node_modules/**', 'storybook/**'],
    plugins: ['stylelint-declaration-strict-value', 'stylelint-order', 'stylelint-scss'],
    rules: {
        'function-no-unknown': [
            true,
            {
                ignoreFunctions: ['fade-color', 'generate-divergent-map', 'if', 'map.get', 'string.unique-id'],
            },
        ],
        'selector-class-pattern': null,
        'scss/selector-class-pattern': [bemPattern, { resolveNestedSelectors: true }],
        'selector-nested-pattern': allowedNestedSelectors,
        'max-nesting-depth': 3,
        'no-descending-specificity': null,
        'property-no-vendor-prefix': null,
        'selector-no-vendor-prefix': null,

        // Disabled rules for SCSS (aligned with Bento)
        '@stylistic/indentation': null,
        '@stylistic/function-parentheses-space-inside': null,
        'at-rule-prelude-no-invalid': null,
        'nesting-selector-no-missing-scoping-root': null,
        'declaration-property-value-no-unknown': null,
        'media-query-no-invalid': null,

        'declaration-property-value-keyword-no-deprecated': [true, { ignoreKeywords: ['break-word'] }],
        'value-keyword-case': ['lower', { ignoreKeywords: ['crispEdges', 'visibleStroke'] }],
        'order/properties-alphabetical-order': true,
        'scale-unlimited/declaration-strict-value': [
            ['/color/', 'z-index', 'font-size', 'margin', 'padding'],
            { ignoreKeywords: [], ignoreValues: [0, 1, 'auto', 'inherit', 'transparent', 'currentcolor'] },
        ],

        'scss/at-mixin-pattern': mixinPattern,
        'scss/dollar-variable-default': [true, { ignore: 'local' }],
        'scss/at-rule-no-unknown': [true, { ignoreAtRules: ['container'] }],

        'annotation-no-unknown': null,
        'at-rule-empty-line-before': [
            'always',
            {
                except: ['blockless-after-blockless', 'first-nested'],
                ignore: ['after-comment'],
                ignoreAtRules: ['else', 'include'],
            },
        ],
        'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['v-deep'] }],
        'at-rule-disallowed-list': [
            'import',
            {
                message:
                    'The Sass team discourages the continued use of the @import rule. Prefer the @use rule instead.',
            },
        ],
    },
    overrides: [
        {
            files: ['*.scss', '**/*.scss'],
            rules: {
                'no-duplicate-selectors': null,
                'selector-no-qualifying-type': null,
            },
        },
        {
            files: ['*.vue', '**/*.vue', '**/*/*.vue'],
            customSyntax: 'postcss-html',
            rules: {
                'no-duplicate-selectors': null,
                'selector-no-qualifying-type': null,
            },
        },
        {
            // Non-published Storybook/playground/prototype styles demonstrate custom consumer classes and ad-hoc values
            files: ['packages/lib/src/playground/**', 'packages/lib/src/next/**', 'packages/storybook-utils/**'],
            rules: {
                'scss/selector-class-pattern': null,
                'selector-nested-pattern': null,
                'scale-unlimited/declaration-strict-value': null,
                'custom-property-pattern': null,
            },
        },
    ],
};
