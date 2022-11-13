// const fs = require("fs");
// const path = require("path");
import fs from 'node:fs';
import path from 'node:path';
import { __dirname } from './pathName.mjs';

const resolve = (s) => path.resolve(__dirname, '..', s);

/**
 * 文件读取操作
 * @param {String} path 文件路径
 * @returns
 */
function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  });
}

/**
 * 文件写入操作
 * @param {String} file 文件保存的路径
 * @returns
 */
function writeFilePromise(file, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      file,
      data,
      {
        encoding: "utf-8",
      },
      (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      }
    );
  });
}

/**
 * 判断文件夹是否存在
 * @param {String} path 文件夹路径
 * @returns {Promise<Boolean>}
 */
function dirIsExists(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        resolve(false);
        return;
      }

      resolve(stats.isDirectory() || stats.isFile());
    });
  });
}

/**
 * 创建文件夹
 * @param {String} directory 目录名称
 * @returns
 */
function mkdir(directory) {
  return new Promise(async (resolve, reject) => {
    if (await dirIsExists(directory)) {
      reject("文件夹已存在");
      return;
    }

    fs.mkdir(directory, (err) => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
}

export {
  mkdir,
  resolve,
  dirIsExists,
  readFilePromise,
  writeFilePromise,
};
