import chalk from 'chalk';
import puppeteer from 'puppeteer';

import sleep from '../utils/sleep.mjs';
import { __dirname } from '../utils/pathName.mjs';
import automatedLogin from './automatedLogin.mjs';
import automatedForm from './automatedForm.mjs';
import automatedPublish from './automatedPublish.mjs';
import automatedCloseDialog from './automatedCloseDialog.mjs';

// const testPublishUrl = 'https://ts.x-station.cn';
// const prodPublishUrl = 'https://www.x-station.cn';
const loginUrl = `${process.env.PUBLISH_HOST}/app/new-version/login`;
// const prodLoginUrl = `${prodPublishUrl}/app/new-version/login`;

export async function automatedPublishing() {
  try {
    const browser = await puppeteer.launch({
      headless: 'chrome',
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

    for (let i = accountStart; i <= accountEnd; i++) {
      const email = `20220705${i}@qq.com`;
      let start = true;

      console.log(chalk.bgYellow('当前账号: ', email));
      await automatedLogin(page, email);

      await sleep(3000);

      if (start) {
        await automatedCloseDialog(page, start);
        start = false;
      }

      for (let j = 0; j < 2; j++) {
        await sleep(380);
        await automatedForm(page, count);
        await sleep(3000); // 需要等编辑器处理一下资源
        await automatedPublish(page);
        count++;

        if (j === 0) {
          await sleep(1800);
          // 点击发布按钮
          const publishButton = await page.$(
            '#app > div.layout-wrapper > div > div.creation-center-post-manage > div.post-content-card > div.content-card-list > div.operate-wrapper > button'
          );

          if (publishButton) {
            await publishButton.click();
          } else {
            await page.evaluate(() => {
              location.href = `${location.origin}/app/new-version/publish/post`;
            });
          }
        }

        if (j === 1) {
          await sleep(2000);
          await page.evaluate(() => {
            (async () => {
              function getCookie(name) {
                const arr = document.cookie.match(
                  new RegExp('(^| )' + name + '=([^;]*)(;|$)')
                );
                if (arr != null) return arr[2];
                return null;
              }

              await fetch(`${location.origin}/web/user/logout`, {
                headers: {
                  authorization: getCookie('Authorization'),
                },
              });
            })();
            location.href = `${location.origin}/app/new-version/login`;
          });
          console.log(chalk.bgBlue(`账号 ${email} 每日两篇发帖完成`));
          await sleep(1000);
          // page.close();
        }
      }
    }

    await page.close();
    await browser.close();
  } catch (error) {
    console.log(chalk.red('出错了', error));
  }
}
