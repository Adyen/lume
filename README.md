# Data visualization

Data visualization is the graphical representation of information and data. By using visual elements like charts, graphs, and maps, data visualization repository provide an accessible way to see and understand trends, outliers, and patterns in data. We will use Vue to manage the state of the elements and rely on d3.js for all the calculations.

**[Design guidelines (Figma)](https://www.figma.com/file/LlbuDypxEbEZIo4qzPaX5kDG/%F0%9F%93%88Data-visualization?node-id=0%3A1)**

## Stack

We're currently aiming to use:

- [D3.js](https://d3js.org/) for calculations
- [Vue *(v2)*](https://v2.vuejs.org/) for rendering

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

### Roadmap

The charts we wish to include:

- [ ] Bar chart
- [ ] Line chart
- [ ] Stacked bar chart
- [ ] Alluvial chart
- [ ] Sparkline
- [ ] Mini bar chart
- [ ] Violin plot
- [ ] Box plot

Points that should be covered:

- [ ] Charts should be able to handle negative values
- [ ] Charts should be able to handle null values (missing values)
- [ ] Charts should be able to scale relative to the screen
- [ ] Charts should be able to handle live data updates
- [ ] Charts should rely on ADL colors but should also be able to accept custom colors
- [ ] Charts should make use of a popup highlighting data of one point
- [ ] Some charts should be able to show x-axis and y-axis
- [ ] Some charts should be able to show gridlines
- [ ] Some charts should have the ability to select a data point and communicate the data to the caller

## Contact

This project is currently being developed & maintained by the Insights stream. This includes:

- Govind Srinidhi | @govind - [Mattermost](https://mattermost.is.adyen.com/adyen/messages/@govind)
- Joao Santos | @joaosa - [Mattermost](https://mattermost.is.adyen.com/adyen/messages/@joaosa)
- Lucas van Heerikhuizen | @lucasv - [Mattermost](https://mattermost.is.adyen.com/adyen/messages/@lucasv)
