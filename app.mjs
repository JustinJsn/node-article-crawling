console.log(1);
import dotenv from "dotenv";
import chalk from "chalk";
import {
  mkdir,
  resolve,
  dirIsExists,
  writeFilePromise,
} from "./utils/fileSystem.mjs";
import fetchHtml from "./model/jinFetchListData.mjs";
import fetchDetailData from "./model/jinFetchDetailData.mjs";
import { automatedPublishing } from "./model/automatedPublishing.mjs";

// fetchURL http://www.jinceping.com/article/category/baogoa/page/${page}

dotenv.config();

if (
  !process.env.ACCOUNT_PASSWORD ||
  !process.env.QINIU_AK ||
  !process.env.QINIU_SK
) {
  throw new Error("请配置 .env 文件");
}

async function customApp() {
  try {
    // 抓取列表数据
    const listData = await fetchHtml();
    // 保存列表 json 数据
    const listJsonDir = resolve("./listJson");
    const hasDir = await dirIsExists(listJsonDir);
    const listFileName = resolve(`${listJsonDir}/金评测_1.json`);

    if (!hasDir) {
      await mkdir(listJsonDir);
    }

    await writeFilePromise(listFileName, JSON.stringify(listData));
    console.log(chalk.green(`列表爬取完成，共 ${listData.length} 条数据`));

    const detailJsonDir = resolve("./detailJson");
    const hasDetailDir = await dirIsExists(detailJsonDir);
    const detailFileName = resolve(`${detailJsonDir}/金品侧_1.json`);

    if (!hasDetailDir) {
      await mkdir(detailJsonDir);
    }

    const detailData = await fetchDetailData();
    await writeFilePromise(detailFileName, JSON.stringify(detailData));

    await publish();

    // 使用无头浏览器，实现自动化发布
    console.log(chalk.green("爬取完成，关闭服务!"));
  } catch (error) {
    console.log(error);
  }
}

customApp();

async function publish() {
  await automatedPublishing();
}

// app.use(async (ctx) => {
//   ctx.body = "Hello Koa!";

//   await fetchHtml();
// });

// app.listen(3000, () => {
//   console.log("Server is running in http://localhost:3000");
// });
