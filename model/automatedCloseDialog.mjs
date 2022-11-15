import sleep from '../utils/sleep.mjs';

export default async function automatedCloseDialog(page, start) {
  if (!start) return;

  // 关闭弹窗
  const closeIcon = await page.$(
    '#app > div.layout-wrapper > div > div.el-dialog__wrapper.global-dialog.bulletin-board-container > div > div.el-dialog__body > div > div.close-wrapper > i'
  );

  if (closeIcon) {
    await closeIcon.click();
  } else {
    await page.evaluate(() => {
      location.href = `${location.origin}/app/new-version/publish/post`;
    });

    return;
  }

  // await sleep(1400);

  // 点击发布按钮，链接到发布页面
  const publishButton = await page.$(
    '#app > div.layout-wrapper > div > div.featured-container > div.aside-right-wrapper > div.user-info > div > div.post-info > button'
  );
  await publishButton.click();

  // 先睡 1.2s 让 DOM 渲染完成再做点击处理
  // await sleep(1200);
}
