import iconv from "iconv-lite";
import { exec } from "node:child_process";

import sleep from "../utils/sleep.mjs";
import { readFilePromise, resolve } from "../utils/fileSystem.mjs";

export default async function automatedForm(page) {
  // 关闭弹窗
  const closeIcon = await page.waitForSelector(
    "#app > div.layout-wrapper > div > div.el-dialog__wrapper.global-dialog.bulletin-board-container > div > div.el-dialog__body > div > div.close-wrapper > i"
  );
  await closeIcon.click();

  await sleep(1000);

  // 点击发布按钮，链接到发布页面
  const publishButton = await page.$(
    "#app > div.layout-wrapper > div > div.featured-container > div.aside-right-wrapper > div.user-info > div > div.post-info > button"
  );
  await publishButton.click();

  // 先睡 3s 让 DOM 渲染完成再做点击处理
  await sleep(3000);

  // 圈子选择
  const circleSelectInput = await page.waitForSelector(
    "#app > div.layout-wrapper > div > div.publish-nav-bar > div.select-wrapper > div.circle-select > div > div.el-input.el-input--suffix > input"
  );
  await circleSelectInput.click();

  await sleep(680);

  const dropdownItem = await page.waitForSelector(
    "body > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child(2)"
  );
  await dropdownItem.click();

  // 标签选择
  const tagSelectInput = await page.$(
    "#app > div.layout-wrapper > div > div.publish-nav-bar > div.select-wrapper > div.tag-select > div > div.el-input.el-input--suffix > input"
  );
  await tagSelectInput.click();

  await sleep(680);

  const tagDropdownItem = await page.waitForSelector(
    "body > div.el-select-dropdown.el-popper.is-multiple > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child(4)"
  );
  await tagDropdownItem.click();
  await tagSelectInput.click();

  // 填写标题
  const detailJson = await readFilePromise(resolve("detailJson/金品侧_1.json"));
  const data = JSON.parse(detailJson);
  const title = await page.waitForSelector(
    "#app > div.layout-wrapper > div > div.post-title-card > div.el-input.title-input > input"
  );

  exec("clip").stdin.end(iconv.encode(data[0].title, "utf-8"));
  await title.focus();
  await page.keyboard.down("Control");
  await page.keyboard.down("V");
  await page.keyboard.up("V");
  await page.keyboard.up("Control");

  await sleep(1000);

  // 输入主体内容
  const sourceEditor = await page.waitForSelector(
    "#app > div.layout-wrapper > div > div.post-publish > div.publish-post-content > div.custom-editor.publish-post-content > div > div.tox-editor-container > div.tox-editor-header > div.tox-toolbar-overlord > div > div:nth-child(3) > button:nth-child(7)"
  );
  await sourceEditor.click();
  const textarea = await page.waitForSelector(
    ".tox-dialog__content-js > div > div > div > div > textarea"
  );

  exec("clip").stdin.end(iconv.encode(data[0].content, "utf-8"));
  await textarea.focus();
  await page.keyboard.down("Control");
  await page.keyboard.down("V");
  await page.keyboard.up("V");
  await page.keyboard.up("Control");

  const sourceEditorSave = await page.$(
    "body > div.tox.tox-silver-sink.tox-tinymce-aux > div > div.tox-dialog.tox-dialog--width-lg > div.tox-dialog__footer > div.tox-dialog__footer-end > button:nth-child(2)"
  );
  await sourceEditorSave.click();
}
