import chalk from 'chalk';
import puppeteer from 'puppeteer';

import sleep from '../utils/sleep.mjs';
import { __dirname } from '../utils/pathName.mjs';
import automatedLogin from './automatedLogin.mjs';
import automatedForm from './automatedForm.mjs';
import automatedPublish from './automatedPublish.mjs';
import automatedCloseDialog from './automatedCloseDialog.mjs';

const testPublishUrl = 'https://ts.x-station.cn';
const prodPublishUrl = 'https://www.x-station.cn';
const loginUrl = `${testPublishUrl}/app/new-version/login`;
const prodLoginUrl = `${prodPublishUrl}/app/new-version/login`;

export async function automatedPublishing() {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      devtools: false,
      defaultViewport: {
        width: 1400,
        height: 900,
      },
    });
    const page = await browser.newPage();

    await page.goto(loginUrl, {
      waitUntil: 'networkidle2',
    });

    const account = JSON.parse(process.env.ACCOUNT);
    const accountStart = account.start;
    const accountEnd = account.end;
    let count = 0;
    let start = true;

    for (let i = accountStart; i <= accountEnd; i++) {
      const email = `20220705${i}@qq.com`;
      await automatedLogin(page, email);

      if (start) {
        await automatedCloseDialog(page);
        start = false;
      }

      for (let j = 0; j < 2; j++) {
        await sleep(1200);
        await automatedForm(page, count);
        await sleep(380);
        await automatedPublish(page);
        count++;

        if (j === 0) {
          // 点击发布按钮
          const publishButton = await page.waitForSelector(
            '#app > div.layout-wrapper > div > div.creation-center-post-manage > div.post-content-card > div.content-card-list > div.operate-wrapper > button'
          );

          await publishButton.click();
        }

        if (j === 1) {
          // 点击退出登录按钮
          const element = await page.$(
            '#app > div.layout-wrapper > header > div > div.header-info-wrapper > div.custom-dropdown.el-dropdown'
          );
          const box = await element.boundingBox();
          const x = box.x + box.width / 2;
          const y = box.y + box.height / 2;
          await page.mouse.move(x, y);

					// TODO 这里报错了，待解决 - 报错原因：未查找到 DOM 元素
          const logoutButton = await page.waitForSelector(
            '.el-dropdown-menu > li:nth-child(2)'
          );
          await logoutButton.click();
        }
      }
    }
  } catch (error) {
    console.log(chalk.red('出错了', error));
  }
}
