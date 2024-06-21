type Model = {
  title: [string, string];
  modelType: string;
  list: {
    name: string;
  }[];
};
function getModelList(fullMeta: string, more: Record<string, string>) {
  const modelStrList = fullMeta.match(/<.*?>/g) || [];
  const modelList = [] as Model[];
  if (fullMeta.includes('NovelAI')) {
    const name = 'Novel AI Stable Diffusion XL';
    modelList.unshift({
      title: [`BASE MODEL`, `基础模型`],
      modelType: 'Base Model',
      list: [
        {
          name
        }
      ]
    });
    //nai3目前应该是没有lora的 如后续有了再补
    return modelList;
  }
  modelStrList.forEach((modelStr) => {
    const model = modelStr.replace(/<|>/g, '').split(':');
    const target = modelList.find(
      (x) => model[0].toLowerCase() === x.modelType.toLowerCase()
    );
    if (target) {
      const isExist = target.list.find(
        (x: Record<string, string>) => x.name === model[1]
      );
      !isExist &&
        target.list.push({
          name: model[1]
        });
      return;
    }
    modelList.push({
      title: [`${model[0].toUpperCase()} MODEL`, `${model[0]}模型`],
      modelType: model[0],
      list: [
        {
          name: model[1]
        }
      ]
    });
  });
  const model = more.Model;
  const hash = more['Model hash'];
  if (model || hash) {
    const name = model || `${hash} (图鉴仅包含Hash)`;
    modelList.unshift({
      title: [`BASE MODEL`, `基础模型`],
      modelType: 'Base Model',
      list: [
        {
          name
        }
      ]
    });
  }
  return modelList;
}
export { getModelList };
