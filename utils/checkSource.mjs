/**
 * 检查资源是否已存在，存在则返回 false，没有则返回 true
 * @param {String} url cdn 链接
 * @returns 
 */
export default async function checkSource(url) {
  const res = await fetch(url, {
    method: 'HEAD'
  });

  return res.headers.get('content-type') === 'application/json';
}
