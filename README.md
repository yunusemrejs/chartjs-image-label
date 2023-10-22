# Chart.js Image Label Plugin

The **Chart.js Image Label Plugin** is an extension for [Chart.js](https://www.chartjs.org/) that allows you to add images as labels to a Doughnut chart. This plugin enables you to enhance your charts with images, making the visualization more engaging and informative.

## Installation

You can install the Chart.js Image Label Plugin using npm or yarn:

```bash
npm install chartjs-plugin-image-label
```

## Usage

To use this plugin, follow these steps:

- Include the plugin in your Chart.js setup.
    
```javascript
import { Chart } from 'chart.js';
import ChartPluginImageLabel from 'chartjs-plugin-image-label';
  
Chart.register(ChartPluginImageLabel);
```

- Create your Doughnut chart and configure it with image labels:

```javascript
const ctx = document.getElementById('myDoughnutChart');

const data = {
  labels: ['Label 1', 'Label 2', 'Label 3'],
  datasets: [
    {
      data: [30, 40, 30],
      backgroundColor: ['red', 'blue', 'green'],
    },
  ],
};

const options = {
  imageLabel: {
    verticalAlign: 'middle',
    horizontalAlign: 'middle',
    imagesList: [
      {
        imageUrl: 'path/to/image1.png',
        imageWidth: 30,
        imageHeight: 30,
      },
      {
        imageUrl: 'path/to/image2.png',
        imageWidth: 30,
        imageHeight: 30,
      },
      {
        imageUrl: 'path/to/image3.png',
        imageWidth: 30,
        imageHeight: 30,
      },
    ],
  },
};

new Chart(ctx, {
  type: 'doughnut',
  data: data,
  options: options,
});
```

## Configuration

The plugin supports the following configuration options:

| Option             | Values                           | Description                                                                                               |
| ------------------ | --------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `verticalAlign`    | `top`, `middle`, `bottom`               | Specifies the vertical alignment of the image label within the chart slice.                             |
| `horizontalAlign`  | `start`, `middle`, `end`                | Specifies the horizontal alignment of the image label within the chart slice.                            |
| `imagesList`       | Array of objects                  | An array of objects that define the images to be used as labels.                                         |

### `imagesList` Object Structure

Each object in the `imagesList` array should have the following structure:

| Property           | Type           | Description                                       |
| ------------------ | --------------- | ------------------------------------------------- |
| `imageUrl`         | `String`         | The URL of the image to be used as a label.       |
| `imageWidth`       | `Number`         | The width of the image in pixels.                 |
| `imageHeight`      | `Number`         | The height of the image in pixels.                |


## License
[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2023-present Yunus Emre Kara

