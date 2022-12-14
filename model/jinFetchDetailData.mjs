import chalk from 'chalk';
import { load } from 'cheerio';
import sleep from '../utils/sleep.mjs';
import {
  mkdir,
  resolve,
  dirIsExists,
  readFilePromise,
} from '../utils/fileSystem.mjs';
import matchAndUpload from '../utils/matchAndUpload.mjs';
import { LIST_FILE_NAME } from '../common/constants.mjs';
import { replaceAsync, myAsyncFn } from '../utils/replaceAndUpload.mjs';

async function fetchDetailData() {
  try {
    const json = await readFilePromise(LIST_FILE_NAME);
    const parseJson = JSON.parse(json);
    const detailItem = [];
    console.log(chalk.cyan(`开始爬取详情页数据，共 ${parseJson.length} 条`));

    // for (let i = 0; i < 3; i++) {
    for (let i = 0; i < parseJson.length; i++) {
      console.log(
        chalk.cyan(`开始爬取第 ${i + 1} 条，链接：${parseJson[i].detailUrl}`)
      );
      const response = await fetch(parseJson[i].detailUrl, {
        method: 'GET',
      });

      const html = await response.text();
      const $ = load(html);
      const article = $('.bg > #content > .wrapper > .main > .list > .content')
        .html()
        .replace(/[\r\n\t]/g, '');

      const descReg = new RegExp('<div class="post-inner">.*?</div>', 'gi');
      const purchase = new RegExp(
        '<h1 style="text-align: left;">.*?</p>$',
        'ig'
      );
      const replaceArticle = article.replace(descReg, '').replace(purchase, '');

      const hasImageDir = await dirIsExists(resolve('images'));
      if (!hasImageDir) {
        await mkdir(resolve('images'));
      }

      const imgReg = /<img [^>]*src=['"]([^'"]+)[^>]*>/gi;
      await matchAndUpload(replaceArticle);
      const content = await replaceAsync(replaceArticle, imgReg, myAsyncFn);

      detailItem.push({
        title: parseJson[i].title,
        content,
      });

      console.log(
        chalk.green(`第 ${i + 1} 条爬取成功，休息 1s 开始爬取下一条数据...`)
      );

      await sleep(780);
    }

    return detailItem;
  } catch (error) {
    console.log(error);
  }
}

export default fetchDetailData;
