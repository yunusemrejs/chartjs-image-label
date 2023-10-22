import { Plugin, ChartType, } from 'chart.js';
import { ImageLabelPluginOptions } from './types';

const loadedImages: Record<string, HTMLImageElement> = {};

function getCachedImage(imageUrl: string): HTMLImageElement | undefined {
  return loadedImages[imageUrl];
}

function cacheImage(imageUrl: string, image: HTMLImageElement) {
  loadedImages[imageUrl] = image;
}

declare module 'chart.js' {
  interface Chart {
    imageLabel: ImageLabelPluginOptions;
  }

  interface PluginOptionsByType<TType extends ChartType> {
    imageLabel?: ImageLabelPluginOptions;
  }
}

const ChartPluginImageLabel: Plugin<'doughnut', ImageLabelPluginOptions> = {
  id: 'imageLabel',
  afterDatasetDraw: (chart, args, options) => {
    if(!options.imagesList.length) return;
    const ctx = chart.ctx;
    const activeDatasetData = chart.data.datasets[0].data;
    const { verticalAlign = 'middle', horizontalAlign = 'middle', imagesList } = options;
    const chartWidth = chart.width;
    const chartHeight = chart.height;
    const chartRadius = Math.min(chart.width, chart.height) / 2;
    const centerX = chartWidth / 2;
    const centerY = chartHeight / 2;
    const total = activeDatasetData.reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
    const sliceAngles = activeDatasetData.map(value => (Number(value) / Number(total)) * 2 * Math.PI);
    let startAngle = -Math.PI / 2;
    const chartOptions = {
      borderWidth: 0,
      cutout: 0,
      ...chart.options
    }
    const borderOffset = (chartOptions.borderWidth || 4) / 360;
    const cutoutOptionValue = chartOptions.cutout || '50%';
    let cutoutRadius = 0;

    if (typeof cutoutOptionValue === 'string' && cutoutOptionValue.endsWith('%')) {
      const percentageValue = parseFloat(cutoutOptionValue);
      cutoutRadius = (percentageValue / 100) * chartRadius;
    } else if (typeof cutoutOptionValue === 'number') {
      cutoutRadius = cutoutOptionValue;
    }

    imagesList.forEach((imageInfo, index) => {
      const { imageUrl, imageWidth, imageHeight } = imageInfo;
      if(!imageUrl) return;
      const sliceAngle = sliceAngles[index] || 0;
      const imageRadius = Math.min(imageWidth, imageHeight) / 2;

      let distanceFromCenter: number = 0;
      let startAngleForImage: number = 0;
      let imageCenterX: number = 0;
      let imageCenterY: number = 0;
      const endAngle = startAngle + sliceAngle;
      const midAngle = (startAngle + endAngle) / 2;

      switch (verticalAlign) {
        case 'top':
          distanceFromCenter = chartRadius - imageRadius;
          break;
        case 'middle':
          distanceFromCenter = cutoutRadius + (chartRadius - cutoutRadius) / 2;
          break;
        case 'bottom':
          distanceFromCenter = cutoutRadius + imageRadius;
          break;
      }

      switch (horizontalAlign) {
        case 'start':
          startAngleForImage = startAngle + imageWidth / 180;
          imageCenterX = centerX + distanceFromCenter * Math.cos(startAngleForImage + borderOffset);
          imageCenterY = centerY + distanceFromCenter * Math.sin(startAngleForImage + borderOffset);
          break;
        case 'middle':
          imageCenterX = centerX + distanceFromCenter * Math.cos(midAngle);
          imageCenterY = centerY + distanceFromCenter * Math.sin(midAngle);
          break;
        case 'end':
          startAngleForImage = endAngle - imageWidth / 180;
          imageCenterX = centerX + distanceFromCenter * Math.cos(startAngleForImage - borderOffset);
          imageCenterY = centerY + distanceFromCenter * Math.sin(startAngleForImage - borderOffset);
          break;
      }

      const imageX = imageCenterX - imageWidth / 2;
      const imageY = imageCenterY - imageHeight / 2;

      const cachedImage = getCachedImage(imageUrl);

      if (cachedImage) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(imageCenterX, imageCenterY, imageWidth / 2, 0, Math.PI * 2, false);
        ctx.clip();
        ctx.drawImage(cachedImage, imageX, imageY, imageWidth, imageHeight);
        ctx.closePath();
        ctx.restore();
      } else {
        const image = new Image();
        image.src = imageUrl;

        image.onload = () => {
          cacheImage(imageUrl, image);
          ctx.save();
          ctx.beginPath();
          ctx.arc(imageCenterX, imageCenterY, imageWidth / 2, 0, Math.PI * 2, false);
          ctx.clip();
          ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight);
          ctx.closePath();
          ctx.restore();
        };
      }

      startAngle = endAngle;
    });
  },
};

export default ChartPluginImageLabel;
