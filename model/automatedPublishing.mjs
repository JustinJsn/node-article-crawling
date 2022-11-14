import chalk from 'chalk';
import puppeteer from 'puppeteer';

import sleep from '../utils/sleep.mjs';
import { __dirname } from '../utils/pathName.mjs';
import automatedLogin from './automatedLogin.mjs';
import automatedForm from './automatedForm.mjs';
import automatedPublish from './automatedPublish.mjs';

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

    // TODO 账号遍历发布内容
		await automatedLogin(page);
		// 先睡 1.2s 让 DOM 渲染完成再做点击处理
		await sleep(1200);
		await automatedForm(page);
		await sleep(380);
		await automatedPublish(page);
		// 提交按钮
	} catch (error) {
		console.log(chalk.red('出错了', error));
	}
}
