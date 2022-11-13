import fs from "node:fs";
import request from "request";
import upload2Cdn from "./qiniuUpload.mjs";
import { resolve, removeFile } from "../utils/fileSystem.mjs";

const CDN_HOST = "https://cdn.x-station.cn";

export async function replaceAsync(str, regex, asyncFn) {
  const promises = [];
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

export async function myAsyncFn(match, url) {
  const res = request(url);
  const filenameReg = /.*\/(.*.(png|jpg|jpeg|gif|svg)$)/gi;

  const matchFilename = filenameReg.exec(url);
  let filename;

  if (matchFilename) {
    filename = matchFilename[1];
  }

  const savePath = `${resolve("images")}/${filename}`;
  const stream = fs.createWriteStream(`${resolve("images")}/${filename}`);
  let uploadRes;

  res.pipe(stream).addListener("finish", async () => {
    try {
      uploadRes = await upload2Cdn({
        path: savePath,
        filename,
      });

      await removeFile(savePath);
    } catch (error) {
      console.log(error);
    }
  });

  return `<img src="${CDN_HOST}/dev/web/jinTestPost/${filename}?timestamp=${+new Date()}" />`;
}
