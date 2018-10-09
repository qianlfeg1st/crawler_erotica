'use strict';

const Service = require('egg').Service;
const puppeteer = require('puppeteer');


const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time);
});


class MovieService extends Service {
  async getNewsList() {
    console.log('开始爬取数据');

    // 打开浏览器
    let browser = await puppeteer.launch({
      // 沙箱模式
      arg: [ '--no-san dbox' ],
      // 关闭无头模式
      headless: true,
      // headless: false,
      // 设置超时时间
      timeout: 20000,
    });

    // 打开新页面
    const page = await browser.newPage();
    console.log('url', this.config.url);
    await page.goto(this.config.url, {
      waitUntil: 'domcontentloaded',
    });

    // 等待页面加载完成
    await sleep(100);

    const result = await page.evaluate(() => {
      // 注入js
      const $ = window.$;
      const items = $('ul.clearfix').children();
      let movies = [];

      if (items.length >= 1) {
        items.each((index, item) => {
          let it = $(item);
          let title = it.find('a').attr('title');
          let url = it.find('a').attr('href');
          let img = it.find('a').data('original');

          movies.push({
            title,
            url,
            img,
          });
        });
      }
      return movies;
    });

    // 关闭标签页
    page.close();

    for (let i = 0; i < result.length; i++) {
    // for (let i = 0; i < 1; i++) {
      console.log('爬取下载地址', `${this.config.url}${result[i].url}`);
      const page = await browser.newPage();
      await page.goto(`${this.config.baseUrl}${result[i].url}`, {
        waitUntil: 'domcontentloaded',
      });

      await sleep(500);

      let data = await page.evaluate(() => {
        const $ = window.$;
        let download = $('.btn-danger').attr('download');
        return download;
      });

      result[i].download = data;

      page.close();
    }

    console.log('result', result);
    browser.close();

    return result;
  }
}

module.exports = MovieService;
