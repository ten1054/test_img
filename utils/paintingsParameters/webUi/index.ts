import { getChartData } from './getRadarData';
import { getModelList } from './getModelList';
import { getImgInf } from './getImgInf';
import { getUseMethod } from './getUseMethod';


function parseWebUi(fullMeta: string, extra: Record<string, any>) {
  if (fullMeta.includes('NovelAI')) {
    console.log('是novelAI')
    const [words, steps] = fullMeta.split('"steps":');
    const more = parseMore(`steps: ${steps}`);
    const promptStart = '"prompt": ';
    const ucStart = '"uc": ';
    const promptStartIndex = fullMeta.indexOf(promptStart) + promptStart.length;
    const promptEndIndex = fullMeta.indexOf('",', promptStartIndex);
    const prompt = fullMeta.substring(promptStartIndex, promptEndIndex);
    const ucStartIndex = fullMeta.indexOf(ucStart) + ucStart.length;
    const ucEndIndex = fullMeta.indexOf('",', ucStartIndex);
    const uc = fullMeta.substring(ucStartIndex, ucEndIndex);
    const textToImg = judgeImgType(steps);
    const wordsList = [prompt, uc]
    return {
      fullMeta,
      chartData: getChartData(fullMeta, {
        parameters: wordsList[0]?.trim() || '',
        negative: wordsList[1]?.trim() || '',
        ...more,
        ...extra
      }),
      modelList: getModelList(fullMeta, more),
      imgInfList: getImgInf({ ...extra, textToImg }),
      useMethodList: getUseMethod(fullMeta),
      parameters: wordsList[0]?.trim() || '',
      negative: wordsList[1]?.trim() || ''
    }
  }
  const [words, steps] = fullMeta.split('Steps: ');
  const more = parseMore(`Steps: ${steps}`);
  const wordsList = words.replace('parameters', '').split('Negative prompt: ');
  const textToImg = judgeImgType(steps);
  return {
    fullMeta,
    chartData: getChartData(fullMeta, {
      parameters: wordsList[0]?.trim() || '',
      negative: wordsList[1]?.trim() || '',
      ...more,
      ...extra
    }),
    modelList: getModelList(fullMeta, more),
    imgInfList: getImgInf({
      ...extra,
      textToImg
    }),
    useMethodList: getUseMethod(fullMeta),
    parameters: wordsList[0]?.trim() || '',
    negative: wordsList[1]?.trim() || ''
  };
}
function judgeImgType(fullMeta: string) {
  if (fullMeta.includes('First pass size')) {
    return 1;
  }
  if (fullMeta.includes('Hires')) {
    return 1;
  }
  const value = !(
    fullMeta.includes('Denoising strength') || fullMeta.includes('Mask blur')
  )
    ? 1
    : -1;
  return value;
}
function parseMore(more: string) {
  const arr = more.split(/,\s/g);
  const result: Record<string, string> = {};
  for (const item of arr) {
    const keyValue = item.split(':');
    if (keyValue.length >= 2) {
      const key = keyValue[0].trim();
      result[key] = keyValue[1].trim();
    }
  }
  return result;
}

export { parseWebUi };
