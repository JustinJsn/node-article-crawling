import upload from "./qiniuUpload.mjs";
import { PassThrough, Readable } from "node:stream";
import fs from "node:fs";
import request from 'request';
import toReadableStream from 'to-readable-stream';

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
  // if (url.indexOf('cdn.x-station.cn') === -1) {
  // const result = await qiniuUpload({
  //     uploadUrl: url,
  //     token: e.data.token
  // });
  // return `<div class="custom-upload-local-img"><img src="${result}" /></div>`;
  // return img;
  // }
  console.log(url);
  const res = await fetch(url, {
    method: "GET",
  });

  const uploadRes = await upload({
    stream: res.body,
    fileName: "test.png",
  });

  console.log(uploadRes);

  // await upload

  return match;
}
