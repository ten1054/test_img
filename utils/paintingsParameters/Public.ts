import extractChunks from 'png-chunks-extract';
import text from 'png-chunk-text';
import { parseWebUi } from './webUi/index';

interface FileInf {
  file: File;
  size: string;
  format: string;
  time: number;
}

async function getImgParameters(framework: string, file: File) {
  const result = await new Promise((resolve) => {
    extractImgInf(framework, file, resolve);
  }).then((res) => {
    console.log('最终结果', res)
    return res as Record<string, any>;
  });
  if (result) {
    return result;
  }
  console.log('解析失败，遇到了未知错误');
  return false;
}

function extractImgInf(framework: string, file: File, res: Function) {
  const imgSizePromise = getImgSize(file);
  const imgInfPromise = getImgSourceInf(file, framework);
  Promise.all([imgSizePromise, imgInfPromise])
    .then(
      (result) => {
        const fullMeta = result[1] as string;
        const fileInf = result[0] as FileInf;
        console.log('全部参数', fullMeta)
        res(parseText(framework, fullMeta, fileInf));
      },
      () => {
        console.log('解析失败(可能原因: 框架选择错误)')
        res(false);
      }
    )
    .catch(() => {
      console.log('解析失败(可能原因: 框架选择错误或解析中出现错误)')
      res(false);
      return false;
    });
}
function getImgSize(file: File) {
  return new Promise((resolve, reject) => {
    const imgReader = new FileReader();
    imgReader.readAsDataURL(file);
    imgReader.onloadend = function (e) {
      const image = new Image();
      image.src = e.target!.result as string;
      image.onload = function () {
        resolve({
          file,
          size: `${image.width} x ${image.height}`
        });
      };
      image.onerror = function () {
        reject(new Error('图片读取失败'));
      };
    };
    imgReader.onerror = function () {
      resolve(new Error('图片读取失败'));
    };
  });
}
function getImgSourceInf(file: File, framework: string) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = function () {
      let chunks = [];
      try {
        chunks = extractChunks(new Uint8Array(reader.result as ArrayBuffer));
        const method = framework === 'WebUi' ? parseWebUiImg : () => { };
        const text = method(chunks);
        if (text && text.length !== 0) {
          resolve(text);
          return;
        }
        reject(new Error('图片资源信息解析失败'));
      } catch (err) {
        reject(new Error('图片资源信息解析失败'));
      }
    };
    reader.onerror = function () {
      reject(new Error('图片资源信息解析失败'));
    };
  });
}
function parseText(
  framework: string,
  fullMeta: string,
  extra: Record<string, any>
) {
  let parseObj = {};
  switch (framework) {
    case 'WebUi':
      parseObj = parseWebUi(fullMeta, {
        ...extra,
        framework
      });
      break;
    default:
      console.log(`解析失败，目前不支持框架${framework}解析`);
  }
  return {
    ...parseObj,
    ...extra,
    framework
  };
}

function parseWebUiImg(chunks: any[]) {
  let data = '';
  for (const item of chunks) {
    if (item.name === 'tEXt') {
      data += text.decode(item.data).text;
    } else if (item.name === 'iTXt') {
      data += new TextDecoder().decode(item.data.filter((x: any) => x !== 0x0));
    }
  }
  return data;
}

export { getImgParameters, parseText };
