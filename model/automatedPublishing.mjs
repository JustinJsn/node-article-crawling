import chalk from "chalk";
import puppeteer from "puppeteer";

import sleep from "../utils/sleep.mjs";
import { __dirname } from "../utils/pathName.mjs";
import automatedLogin from "./automatedLogin.mjs";
import automatedForm from "./automatedForm.mjs";

const testPublishUrl = "https://ts.x-station.cn";
const prodPublishUrl = "https://www.x-station.cn";
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
      waitUntil: "networkidle2",
    });

    await automatedLogin(page);

    // 先睡 3s 让 DOM 渲染完成再做点击处理
    await sleep(3000);

    await automatedForm(page);
    // 提交按钮
  } catch (error) {
    console.log(chalk.red("出错了", error));
  }
}
