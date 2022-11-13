// const { load } = require("cheerio");
// const chalk = require("chalk");
import { load } from 'cheerio';
import chalk from 'chalk';

export default async function fetchHtml() {
  const listData = [];
  const url = "http://www.jinceping.com/article/category/baogoa/page/1";
  console.log(chalk.cyan(`开始爬取，爬取的链接是: ${url}`));

  const res = await fetch(url, {
    method: "GET",
  });

  const html = await res.text();
  const $ = load(html);

  $(".bg > #content > .wrapper > .main > .list > .post-list")
    .find(".post-info")
    .each((index, postInfo) => {
      const $element = $(postInfo);
      const linkElement = $element.find(".post-content > .post-tit h2 > a");
      const title = linkElement.text();
      const videoReg = /短视频/;
      const titleReg = /【金测评】(.*)/;

      if (!videoReg.test(title)) {
        const match = titleReg.exec(title);

        if (match && match.length) {
          listData.push({
            title: match[1],
            detailUrl: linkElement.attr("href"),
          });
        }
      }
    });

  return listData;
};
