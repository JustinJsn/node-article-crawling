import dotenv from 'dotenv';
import chalk from 'chalk';
import {
  mkdir,
  removeFile,
  dirIsExists,
  writeFilePromise,
} from './utils/fileSystem.mjs';
import fetchHtml from './model/jinFetchListData.mjs';
import fetchDetailData from './model/jinFetchDetailData.mjs';
import { automatedPublishing } from './model/automatedPublishing.mjs';
import {
  LIST_DIR,
  LIST_FILE_NAME,
  DETAIL_DIR,
  DETAIL_FILE_NAME,
} from './common/constants.mjs';

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
    const hasDir = await dirIsExists(LIST_DIR);

    if (!hasDir) {
      await mkdir(LIST_DIR);
    }

    await writeFilePromise(LIST_FILE_NAME, JSON.stringify(listData));
    console.log(chalk.green(`列表爬取完成，共 ${listData.length} 条数据`));

    const hasDetailDir = await dirIsExists(DETAIL_DIR);
    if (!hasDetailDir) {
      await mkdir(DETAIL_DIR);
    }

    const detailData = await fetchDetailData();

    await writeFilePromise(DETAIL_FILE_NAME, JSON.stringify(detailData));

    console.log(chalk.blue('开始发布帖子'));
    await publish();
    await removeFile(LIST_FILE_NAME);
    await removeFile(DETAIL_FILE_NAME);
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
