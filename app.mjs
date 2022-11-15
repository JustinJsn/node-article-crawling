import dotenv from 'dotenv';
import chalk from 'chalk';
import {
  mkdir,
  resolve,
  removeFile,
  dirIsExists,
  writeFilePromise,
} from './utils/fileSystem.mjs';
import fetchHtml from './model/jinFetchListData.mjs';
import fetchDetailData from './model/jinFetchDetailData.mjs';
import { automatedPublishing } from './model/automatedPublishing.mjs';

// fetchURL http://www.jinceping.com/article/category/baogoa/page/${page}

dotenv.config();

if (
  !process.env.ACCOUNT_PASSWORD ||
  !process.env.QINIU_AK ||
  !process.env.QINIU_SK ||
  !process.env.PUBLISH_HOST ||
  !process.env.ACCOUNT
) {
  throw new Error('请配置 .env 文件');
}

async function customApp() {
  try {
    // 抓取列表数据
    const listData = await fetchHtml();
    // 保存列表 json 数据
    const listJsonDir = resolve('./listJson');
    const hasDir = await dirIsExists(listJsonDir);
    const listFileName = resolve(`${listJsonDir}/金评测_1.json`);

    if (!hasDir) {
      await mkdir(listJsonDir);
    }

    await writeFilePromise(listFileName, JSON.stringify(listData));
    console.log(chalk.green(`列表爬取完成，共 ${listData.length} 条数据`));

    const detailJsonDir = resolve('./detailJson');
    const hasDetailDir = await dirIsExists(detailJsonDir);
    const detailFileName = resolve(`${detailJsonDir}/金品侧_1.json`);

    if (!hasDetailDir) {
      await mkdir(detailJsonDir);
    }

    const detailData = await fetchDetailData();

    await writeFilePromise(detailFileName, JSON.stringify(detailData));

    console.log(chalk.blue('开始发布帖子'));
    await publish();
		await removeFile(listFileName);
		await removeFile(detailFileName);
    console.log(chalk.green('爬取完成，关闭服务!'));
  } catch (error) {
    console.log(error);
  }
}

customApp();

async function publish() {
  await automatedPublishing();
}

// publish();

// app.use(async (ctx) => {
//   ctx.body = "Hello Koa!";

//   await fetchHtml();
// });

// app.listen(3000, () => {
//   console.log("Server is running in http://localhost:3000");
// });
