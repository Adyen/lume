# ADV

ADV, or Adyen Data Visualization, is a library for graphical representations of information and data. By using visual elements like charts, graphs, and maps, this repository provide an accessible way to see and understand trends, outliers, and patterns in data. We use Vue to all graphic elements and rely on d3.js for the calculations.

**[Design guidelines (Figma)](https://www.figma.com/file/LlbuDypxEbEZIo4qzPaX5kDG/%F0%9F%93%88Data-visualization?node-id=0%3A1)**

## Stack

We're currently aiming to use:

- [D3.js](https://d3js.org/) for calculations
- [Vue _(v2.7)_](https://v2.vuejs.org/) for rendering
- [Popper.js](https://popper.js.org/) for tooltip functionality

### Dev stack

- [Webpack](https://webpack.js.org/) for bundling/local dev server
- [Sass](https://sass-lang.com/) for complex/reusable styling
- [TypeScript](https://www.typescriptlang.org/) for type checking
- [TypeScript ESLint](https://typescript-eslint.io/) for linting _(with the help of [eslint-plugin-vue](https://eslint.vuejs.org/))_
- [Storybook](https://storybook.js.org/) for developing/showcasing components
- [Jest](https://jestjs.io/) for unit testing

## Getting started

### Installation

To install ADV, run the following command:

```shell
$ npm install adv
```

### Plugin

The default export of ADV is a Vue plugin that you can install in your global Vue setup:

```ts
import Vue from 'vue';
import AdvLibrary from 'adv';

import App from './my-app.vue';

Vue.use(AdvLibrary);

const app = new Vue(App).$mount('#root');
```

### Components

If, instead of using the Vue plugin, you rather import single components as you go, you can do that as well:

```ts
// SFC <script>

import { defineComponent } from 'vue';

import { AdvBarChart } from 'adv';

export default defineComponent({
  components: { AdvBarChart },
  ...
});

```

## Development

### Quick start

Follow these steps to quickly start developing amazing data-viz components locally:

1. Clone the repo
   ```shell
    $ git clone git@gitlab.is.adyen.com:data-viz/data-visualization.git
   ```
2. Install npm packages
   ```shell
   $ npm i
   ```
3. Run the local server
   ```shell
   $ npm start
   ```

#### Storybook

Storybook is available by running the following command:

```shell
$ npm run storybook
```

Every chart component should have its own `.stories` file, and it will be automatically loaded onto the Storybook manager.

##### Available addons

- [`addon-knobs`](https://www.npmjs.com/package/@storybook/addon-knobs/v/5.0.0)
- [`addon-storysource`](https://www.npmjs.com/package/@storybook/addon-storysource/v/5.0.0)
- [`addon-notes`](https://www.npmjs.com/package/@storybook/addon-notes/v/5.0.0)
- [`addon-a11y`](https://www.npmjs.com/package/@storybook/addon-a11y/v/5.0.0)

### Roadmap

The charts we wish to include:

- [x] Line chart
- [x] Bar chart
- [x] Stacked bar chart
- [x] Grouped bar chart
- [x] Horizontal bar chart
- [x] Horizontal stacked bar chart
- [x] Horizontal grouped bar chart
- [x] Sparkline
- [ ] Mini bar chart
- [ ] Alluvial chart
- [ ] Violin plot
- [x] Box plot

Points that should be covered:

- [x] Charts should be able to handle negative values
- [x] Charts should be able to handle null values (missing values)
- [x] Charts should be able to scale relative to the screen
- [x] Charts should make use of a popup highlighting data of one point
- [x] Some charts should be able to show x-axis and y-axis
- [x] Some charts should be able to show gridlines
- [ ] Charts should be able to handle live data updates
- [ ] Charts should rely on ADL colors but should also be able to accept custom colors
- [ ] Some charts should have the ability to select a data point and communicate the data to the caller

Other developmental issues that should be covered:

- [ ] Unit tests for all components - in Jest
- [ ] ESLinter for .js and .vue files
- [ ] Documentation of how the components work
- [ ] Storybook with examples of all the components

### Feature ideas

- Out-of-the-box light/dark theme
- Click label dots to select data groups [Figma](https://www.figma.com/file/LlbuDypxEbEZIo4qzPaX5kDG/%F0%9F%93%88Data-visualization?node-id=3503%3A25312)

## Contact

This project is currently being developed & maintained by the Insights stream. This includes:

- Govind Srinidhi | @govind - [Mattermost](https://mattermost.is.adyen.com/adyen/messages/@govind)
- Joao Santos | @joaosa - [Mattermost](https://mattermost.is.adyen.com/adyen/messages/@joaosa)
- Lucas van Heerikhuizen | @lucasv - [Mattermost](https://mattermost.is.adyen.com/adyen/messages/@lucasv)
