import sleep from '../utils/sleep.mjs';

export default async function automatedCloseDialog(page) {
  // 关闭弹窗
  // TODO 这里需要优化一下，不能使用 waitForSelector 去等待弹窗元素，如果用户不触发弹窗会出现超时
  const closeIcon = await page.waitForSelector(
    '#app > div.layout-wrapper > div > div.el-dialog__wrapper.global-dialog.bulletin-board-container > div > div.el-dialog__body > div > div.close-wrapper > i'
  );
  await closeIcon.click();

  await sleep(800);

  // 点击发布按钮，链接到发布页面
  const publishButton = await page.$(
    '#app > div.layout-wrapper > div > div.featured-container > div.aside-right-wrapper > div.user-info > div > div.post-info > button'
  );
  await publishButton.click();

  // 先睡 1.2s 让 DOM 渲染完成再做点击处理
  await sleep(1200);
}
