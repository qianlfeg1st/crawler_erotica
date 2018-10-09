'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1539049902349_6164';

  // add your config here
  config.middleware = [];

  // 配件ejs模板引擎
  config.view = {
    mapping: {
      '.html': 'ejs',
    },
  };

  // 爬取的地址
  config.url = 'https://www.0101qq.com/15';
  config.baseUrl = 'https://www.0101qq.com/';

  return config;
};
