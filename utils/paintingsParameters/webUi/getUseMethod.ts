function getUseMethod(fullMeta: string) {
  const list = [] as Record<string, any>[];
  const checkItems = [
    {
      key: 'parameters',
      name: '提示词',
      color: '#FFC300'
    },
    {
      key: 'Model hash',
      name: '大模型',
      color: '#00BAAD'
    },
    {
      key: 'Variation seed',
      name: '变体控制',
      color: '#2A82E4'
    },
    {
      key: 'Hires upscale',
      name: '高清修复',
      color: '#7948EA'
    },
    {
      key: 'ControlNet',
      name: 'C-NET',
      color: '#AC33C1'
    }
  ];
  if (fullMeta.includes('NovelAI')) {
    //nai3的放大不写入额外信息 判断不了且不改变数据块内的图像大小数据
    //vibe tansfer相关
    //reference_information_extracted_multiple 提取信息强度  对应网页中的information Extracted参数
    //reference_strength_multiple 参考强度
    //"steps": 28, "height": 832, "width": 1216, "scale": 6.0, "uncond_scale": 0.0, "cfg_rescale"和sd一样的
    checkItems.push({
      key: 'prompt',
      name: '提示词',
      color: '#FFC300'
    })
  }
  for (const item of checkItems) {
    if (fullMeta.includes(item.key)) {
      list.push({
        name: item.name,
        color: item.color
      });
    }
  }
  return list;
}
export { getUseMethod };
