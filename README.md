# Data visualization

Data visualization is the graphical representation of information and data. By using visual elements like charts, graphs, and maps, data visualization repository provide an accessible way to see and understand trends, outliers, and patterns in data. We will use Vue to manage the state of the elements and rely on d3.js for all the calculations.

**[Design guidelines (Figma)](https://www.figma.com/file/LlbuDypxEbEZIo4qzPaX5kDG/%F0%9F%93%88Data-visualization?node-id=0%3A1)**

## Stack

We're currently aiming to use:

- [D3.js](https://d3js.org/) for calculations
- [Vue *(v2)*](https://v2.vuejs.org/) for rendering
- [Popper.js](https://popper.js.org/) for popover functionality

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
- [ ] Sparkline
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

## Contact

This project is currently being developed & maintained by the Insights stream. This includes:

- Govind Srinidhi | @govind - [Mattermost](https://mattermost.is.adyen.com/adyen/messages/@govind)
- Joao Santos | @joaosa - [Mattermost](https://mattermost.is.adyen.com/adyen/messages/@joaosa)
- Lucas van Heerikhuizen | @lucasv - [Mattermost](https://mattermost.is.adyen.com/adyen/messages/@lucasv)
