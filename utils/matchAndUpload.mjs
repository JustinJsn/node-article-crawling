import axios from 'axios';
import fs from 'node:fs';
import { resolve, removeFile, writer } from './fileSystem.mjs';
import upload2Cdn from './qiniuUpload.mjs';
import sleep from './sleep.mjs';
import checkSource from './checkSource.mjs';

const CDN_HOST = 'https://cdn.x-station.cn';
const PATH = 'dev/web/jinTestPost/';
//https://cdn.x-station.cn/dev/web/jinTestPost/2022-10-1311-700x467.jpg
export default async function matchAndUpload(str) {
  const imgReg = /<img [^>]*src=['"]([^'"]+)[^>]*>/gi;
  const matchImgSrcArr = str.match(imgReg);
  const images = [];

  for (let i = 0; i < matchImgSrcArr.length; i++) {
    const matchSrc = matchImgSrcArr[i].match(/src=['"](.*?)['"]/);
    if (matchSrc) {
      images.push(matchSrc[1] || '');
    }
  }

  for (let j = 0; j < images.length; j++) {
    const url = images[j];
    const filenameReg = /.*\/(.*.(png|jpg|jpeg|gif|svg)$)/gi;
    const matchFilename = filenameReg.exec(url);
    let filename;

    if (matchFilename) {
      filename = matchFilename[1];
    }

    const isUpdate = await checkSource(`${CDN_HOST}/${PATH}${filename}`);

    if (!isUpdate) {
      continue;
    }

    const savePath = `${resolve('images')}/${filename}`;
    try {
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
      });

      await writer(savePath, response);
      await upload2Cdn({
        path: savePath,
        filename,
      });
      await removeFile(savePath);
    } catch (error) {
      console.log(error);
    }
  }
}
