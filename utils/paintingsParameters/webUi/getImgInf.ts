type ImgInf = {
  name: string;
  bg: string;
  value: string;
}
function filterTime(time: string | number) {
  const date = new Date(Number(time));
  const Y = date.getFullYear();
  const M =
    date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const D = date.getDate();
  return `${Y}年${M}月${D}日`;
}
function getImgInf(extra: Record<string, any>) {
  const table = [
    {
      key: 'framework',
      name: '框架',
      bg: '#FFC300'
    },
    {
      key: 'textToImg',
      name: '类型',
      bg: '#2A82E4'
    },
    {
      key: 'size',
      name: '尺寸',
      bg: '#7948EA'
    },
    {
      key: 'time',
      name: '上传时间',
      bg: '#43cf7c'
    },
    {
      key: 'format',
      name: '格式',
      bg: '#00baad'
    }
  ];
  const infList = [] as ImgInf[];
  table.forEach((item) => {
    let target = extra[item.key];
    if (target) {
      if (item.key === 'textToImg') {
        target = target !== -1 ? '文生图' : '图生图';
      }
      if (item.key === 'time' && target) {
        target = filterTime(target) || '';
      }
      infList.push({
        name: item.name,
        bg: item.bg,
        value: target
      });
    }
  });
  return infList;
}
export { getImgInf };
