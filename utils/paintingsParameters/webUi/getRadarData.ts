type radarData = {
  name: string;
  value: number;
  total: number;
}[];
function getChartData(fullMeta: string, extra: Record<string, any>) {
  const chartData = [] as radarData;
  getBasic(chartData, extra);
  getSize(chartData, extra.size);
  getTechnology(chartData, fullMeta);
  getParameter(chartData, extra);
  getDraw(chartData, extra);
  return chartData;
}
// Proportion of basic information
function getBasic(chartData: radarData, extra: Record<string, any>) {
  let value = 0;
  const checkItems = [
    {
      key: 'name',
      value: 20
    },
    {
      key: 'desc',
      value: 30
    },
    {
      key: 'tags',
      value: 50
    }
  ];
  checkItems.forEach((item) => {
    const target = extra[item.key];
    if (target && target.length !== 0) {
      value += item.value;
    }
  });
  chartData.push({
    name: '基本信息',
    value,
    total: 100
  });
}
// Proportion of size
function getSize(chartData: radarData, size: string) {
  let value = 0;
  if (size && size !== '-') {
    const min = 512 * 512;
    const max = 1280 * 720;
    const total = max - min;
    const sizeList = size.split('x');
    const currentSize = Number(sizeList[0]) * Number(sizeList[1]);
    if (currentSize <= min) {
      value = Math.floor((currentSize * 100) / min);
    } else if (currentSize > min) {
      const more = currentSize - min;
      value = Math.floor((more * 100) / total) + 60;
    }
    value > 100 && (value = 100);
  }
  chartData.push({
    name: '尺寸',
    value,
    total: 100
  });
}
// Proportion of technology
function getTechnology(chartData: radarData, fullMeta: string) {
  let value = 0;
  const checkItems = [
    'parameters',
    'Model hash',
    'Variation seed',
    'Hires upscale',
    'ControlNet',
    'lora',
    'Mask blur'
  ];
  for (const key of checkItems) {
    if (fullMeta.includes(key)) {
      value += 20;
    }
  }
  value > 100 && (value = 100);
  chartData.push({
    name: '技术',
    value,
    total: 100
  });
}
// Proportion of parameter
function getParameter(chartData: radarData, extra: Record<string, any>) {
  let value = 0;
  if (extra.parameters.length > 0) {
    value += 50;
  }
  if (extra.negative.length > 0) {
    value += 50;
  }
  chartData.push({
    name: '参数',
    value,
    total: 100
  });
}
// Proportion of draw
function getDraw(chartData: radarData, extra: Record<string, any>) {
  let value = 0;
  const draw = extra['Denoising strength'] || 0;
  value = Math.floor(Number(draw) * 100);
  chartData.push({
    name: '绘制 ',
    value,
    total: 100
  });
}

export { getChartData };
