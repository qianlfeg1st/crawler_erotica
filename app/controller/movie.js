'use strict';

const Controller = require('egg').Controller;

class MovieController extends Controller {
  async index() {
    let list = await this.service.movie.getNewsList();
    this.ctx.body = list;
    // console.log('list', list);

    // await this.ctx.render('movie');
  }
}

module.exports = MovieController;
