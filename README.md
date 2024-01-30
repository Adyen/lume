# Lume

[![PR workflow](https://github.com/Adyen/lume/actions/workflows/pr.yml/badge.svg)](https://github.com/Adyen/lume/actions/workflows/pr.yml)
[![MIT License](https://img.shields.io/badge/license-MIT)](https://github.com/Adyen/lume/blob/main/LICENSE)
[![Netlify Status](https://api.netlify.com/api/v1/badges/a6c48bc7-b4d2-4be4-ad36-cbd353ab4f07/deploy-status)](https://app.netlify.com/sites/adyen-lume/deploys)

Lume is a combination of a set of design guidelines for creating data visualizations that tell stories, and a component library that implements them, built for Vue applications.

> **Note:** Lume ships **two** packages - one that is compatible with Vue 2.7, and another, with Vue 3. The second is published as **`@adyen/lume-vue3`**. Our examples import the Vue 2.7-compatible version, but if you're using Vue 3, just update the import name.

**[Design guidelines (Website)](https://lumedataviz.com/)**

- [About](#about)
- [Getting started](#getting-started)
- [Development](#development)
- [Contacts](#contacts)

## About

### What's different about Lume

🧑‍🎨 Backed by strong data visualization design principles, guidelines and patterns  
🖼️ Leverages Vue for SVG rendering and reactivity  
📦 Available for both Vue 2.7 and 3

### Stack

#### Dependencies

- [D3.js](https://d3js.org/) for calculations
- [Vue](https://vuejs.org/) for rendering
- [Popper.js](https://popper.js.org/) for tooltip functionality

#### Dev stack

- [pnpm](https://pnpm.io/) for package management
- [Vite](https://vitejs.dev/) and [Webpack](https://webpack.js.org/) for bundling
- [Sass](https://sass-lang.com/) for complex/reusable styling
- [TypeScript](https://www.typescriptlang.org/) for type checking
- [TypeScript ESLint](https://typescript-eslint.io/) for linting _(with the help of [eslint-plugin-vue](https://eslint.vuejs.org/))_
- [Storybook](https://storybook.js.org/) for developing/showcasing components
- [Vitest](https://vitest.dev/) for unit testing

## Getting started

### Installation

To install Lume, run the following command:

#### Vue 2.7+

```shell
$ npm install @adyen/lume
```

#### Vue 3

```shell
$ npm install @adyen/lume-vue3
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

```ts
// Composition <script setup type="ts">

import { LumeBarChart } from '@adyen/lume';
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

### Styles

For Lume to render as intended, you also need to import its styles.

#### CSS (global)

```ts
// app/index/main.ts
import Vue from 'vue';
import App from './my-app.vue';

// Main styles
import '@adyen/lume/styles';
// (Optional) Lume font
import '@adyen/lume/font';

const app = new Vue(App).$mount('#root');
```

#### Sass (global)

```ts
// app/index/main.ts
import Vue from 'vue';
import App from './my-app.vue';

// Main styles
import '@adyen/lume/scss';
// (Optional) Lume font
import '@adyen/lume/font';

const app = new Vue(App).$mount('#root');
```

#### CSS (SFC)

```vue
<template>...</template>

<script>
...
</script>

<!-- Main styles -->
<style src="@adyen/lume/styles"></style>
<!-- (Optional) Lume font -->
<style src="@adyen/lume/font"></style>
```

#### Sass (SFC)

```vue
<template>...</template>

<script>
...
</script>

<!-- Main styles -->
<style lang="scss" src="@adyen/lume/scss"></style>
<!-- (Optional) Lume font -->
<style src="@adyen/lume/font"></style>
```

#### Sass (with overrides)

```vue
<template>...</template>

<script>
...
</script>

<!-- Main styles -->
<style lang="scss">
@use '@adyen/lume/scss' with (
  $lume-font-family: 'Times New Roman'
);
</style>
```

## Development

You can clone this repo and use `pnpm` to install dependencies. We use Storybook to develop our features.

### Docker

To run the app inside a Docker container:

1. Create a `.env` file with your Docker image URL:
   ```shell
     $ echo DOCKER_IMAGE={YOUR_IMAGE_HERE} >> .env
   ```
2. Start your container:
   ```shell
     $ docker build --build-arg DOCKER_IMAGE=$(cat .env | grep DOCKER_IMAGE | cut -d '=' -f2) -t lume .
   ```
3. Attach to it in your terminal:
   ```shell
     $ docker run -it -v ./:/home/node/lume -p 9002:9002 -p 9003:9003 lume
   ```

### About Vue versions

Lume ships two packages, one for each Vue version (2 and 3).

Development is done in Vue 3, keeping in mind that the same source code must work the same way on both Vue versions, so some of the new Vue 3 APIs are restricted, unless provided with a fallback.

#### Storybook

Storybook is available by running the following command:

```shell
$ pnpm run storybook
```

Every chart component should have its own `.stories` file, and it will be automatically loaded onto the Storybook manager.

##### Available addons

- [`addon-essentials`](https://www.npmjs.com/package/@storybook/addon-essentials)
- [`addon-storysource`](https://www.npmjs.com/package/@storybook/addon-storysource)
- [`addon-a11y`](https://www.npmjs.com/package/@storybook/addon-a11y)

### Releasing

To generate a release:

1. Create a release branch and push it as upstream:
   ```shell
     $ git checkout -b release-[VERSION] && git push -u origin release-[VERSION]
   ```
2. Run the release command:
   ```shell
     $ npm run release
   ```
3. Create a PR for the release branch.
4. After it's merged, publish the GitHub release. This will then publish the new release in NPM.

This will prompt you with an interactive CLI to create a new version, tag, changelog entry and release.

### Roadmap

| Feature                                   | Status |
| ----------------------------------------- | ------ |
| **Charts**                                |        |
| Alluvial (sankey) diagram                 | ✅     |
| Single bar chart                          | ✅     |
| Grouped bar chart                         | ✅     |
| Stacked bar chart                         | ✅     |
| Horizontal orientation for all bar charts | ✅     |
| Line chart                                | ✅     |
| Sparkline chart                           | ✅     |
| **Features**                              |        |
| A11y colors                               | 🚧     |
| A11y guidelines & impl.                   | ❌     |
| Dark theme                                | ❌     |
| Select dataset in legend                  | ❌     |

✅ - Done  
🚧 - WIP  
❌ - To do

## Contacts

### Maintainers

- Govind Srinidhi | [@govind-srinidhi](https://github.com/govind-srinidhi)
- Joao Santos | [@joao-m-santos](https://github.com/joao-m-santos)

### Contributors

- Lucas van Heerikhuizen | [@Lucas1981](https://github.com/Lucas1981)
- Vivian Joseph | [@vivy27](https://github.com/vivy27)
