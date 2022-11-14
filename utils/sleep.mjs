/**
 * 睡眠函数
 * @param {Number} wait 睡眠时间
 */
export default function sleep(wait) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, wait);
  });
}
