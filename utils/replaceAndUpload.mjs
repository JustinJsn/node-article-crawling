const CDN_HOST = 'https://cdn.x-station.cn';

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
  const filenameReg = /.*\/(.*.(png|jpg|jpeg|gif|svg)$)/gi;
  const matchFilename = filenameReg.exec(url);
  let filename;

  if (matchFilename) {
    filename = matchFilename[1];
  }

  return `<img src="${CDN_HOST}/dev/web/jinTestPost/${filename}?timestamp=${+new Date()}" />`;
}
