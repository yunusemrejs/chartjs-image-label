export interface ImageLabelPluginOptions {
  verticalAlign?: 'middle' | 'top' | 'bottom';
  horizontalAlign?: 'middle' | 'start' | 'end';
  imagesList: Array<{
    imageUrl: string;
    imageWidth: number;
    imageHeight: number;
  }>;
  offset: number;
}

