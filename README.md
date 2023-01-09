# Lume

[![PR workflow](https://github.com/Adyen/lume/actions/workflows/pr.yml/badge.svg)](https://github.com/Adyen/lume/actions/workflows/pr.yml)
[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/Adyen/lume/blob/main/LICENSE)
[![Netlify Status](https://api.netlify.com/api/v1/badges/a6c48bc7-b4d2-4be4-ad36-cbd353ab4f07/deploy-status)](https://app.netlify.com/sites/adyen-lume/deploys)

Lume is a library for graphical representations of information and data. By using visual elements like charts, graphs, and maps, this repository provide an accessible way to see and understand trends, outliers, and patterns in data. We use Vue to all graphic elements and rely on d3.js for the calculations.

**[Design guidelines (Figma)](https://www.figma.com/file/r9fPqTXA4dlP6SIyfmGlDC/%F0%9F%8C%9D-Lume---Data-Visualization-Library)**

- [Stack](#stack)
- [Getting started](#getting-started)
- [Development](#development)
- [Contacts](#contacts)

## Stack

### Dependencies

- [D3.js](https://d3js.org/) for calculations
- [Vue _(v2.7)_](https://v2.vuejs.org/) for rendering
- [Popper.js](https://popper.js.org/) for tooltip functionality
- [Portal Vue](https://portal-vue.linusb.org/) for portalling (not available in Vue 2)

### Dev stack

- [Vite](https://vitejs.dev/) and [Webpack](https://webpack.js.org/) for bundling
- [Sass](https://sass-lang.com/) for complex/reusable styling
- [TypeScript](https://www.typescriptlang.org/) for type checking
- [TypeScript ESLint](https://typescript-eslint.io/) for linting _(with the help of [eslint-plugin-vue](https://eslint.vuejs.org/))_
- [Storybook](https://storybook.js.org/) for developing/showcasing components
- [Jest](https://jestjs.io/) for unit testing

## Getting started

### Installation

To install Lume, run the following command:

```shell
$ npm install @adyen/lume
```

### Components

You can import Lume components to your Vue app:

```ts
// SFC <script type="ts">

import { defineComponent } from 'vue';
import { LumeBarChart } from '@adyen/lume';

export default defineComponent({
  components: { LumeBarChart },
  ...
});
```

### Plugin

You can also import Lume as a Vue plugin that you install in your global Vue setup:

```ts
import Vue from 'vue';
import LumePlugin from '@adyen/lume/plugin';

import App from './my-app.vue';

Vue.use(LumePlugin);

const app = new Vue(App).$mount('#root');
```

## Development

### Quick start

Follow these steps to quickly start developing amazing data-viz components locally:

1. Clone the repo
   ```shell
    $ git clone git@github.com:Adyen/lume.git
   ```
2. Install npm packages
   ```shell
   $ npm i
   ```
3. Run the local server
   ```shell
   $ npm start
   ```

### Docker

To run the app inside a Docker container:

1. Create a `.env` file with your Docker image URL:
   ```shell
     $ echo DOCKER_IMAGE={YOUR_IMAGE_HERE} >> .env
   ```
2. Start your container:
   ```shell
     $ docker compose up -d
   ```
3. Attach to it in your terminal:
   ```shell
     $ docker attach lume
   ```

#### Storybook

Storybook is available by running the following command:

```shell
$ npm run storybook
```

Every chart component should have its own `.stories` file, and it will be automatically loaded onto the Storybook manager.

##### Available addons

- [`addon-essentials`](https://www.npmjs.com/package/@storybook/addon-essentials)
- [`addon-storysource`](https://www.npmjs.com/package/@storybook/addon-storysource)
- [`addon-a11y`](https://www.npmjs.com/package/@storybook/addon-a11y)

### Releasing

To generate a release, run:

```shell
$ npm run release
```

This will prompt you with an interactive CLI to create a new version, tag, changelog entry and release.

### Roadmap

The charts we wish to include:

#### V1

- [x] Alluvial diagram
- [x] Bar chart
  - [x] Single
  - [x] Stacked
  - [x] Grouped
  - [x] Horizontal orientation for all
- [x] Line chart
- [x] Sparkline chart

#### Next

The following are planned for future releases:

- Violin plot
- Box plot
- Mini bar chart (Bar sparkline)

**Note:** Components from this list can change, so being here doesn't mean it will land on the library for sure.

## Contacts

This project is currently being developed & maintained by team Lume. This includes:

- Govind Srinidhi | [@govind-srinidhi](https://github.com/govind-srinidhi)
- Joao Santos | [@joao-m-santos](https://github.com/joao-m-santos)
- Lucas van Heerikhuizen | [@Lucas1981](https://github.com/Lucas1981)
- Vivian Joseph | [@vivy27](https://github.com/vivy27)
