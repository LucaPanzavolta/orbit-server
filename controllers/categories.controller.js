'use strict';

class CategoriesController {
  constructor(CategoryModel) {
    this.CategoryModel = CategoryModel;
    this.getAllCategories = this.getAllCategories.bind(this);
    this.getCategory = this.getCategory.bind(this);
    this.addCategory = this.addCategory.bind(this);
  }

  // Get all Categories
  async getAllCategories (ctx, next) {
    if ('GET' != ctx.method) return await next();
    const categories = await this.CategoryModel.find();
    ctx.status = 200;
    ctx.body = categories;  
  }

  // Get Category
  async getCategory (ctx, next) {
    if ('GET' != ctx.method) return await next();
    const category = await this.CategoryModel.findOne({'_id': ctx.params.id});
    if (!category) {
      // throw new Error
      ctx.status = 401;
      ctx.body = {
        errors:[
          'Category not found!'
        ]
      };
      return await next();
    }
    ctx.status = 200;
    ctx.body = category;
  }

  // Add a new Category
  async addCategory (ctx, next) {
    if ('POST' != ctx.method) return await next();
    if (!ctx.request.body.name || !ctx.request.body.metrics) {
      ctx.status = 400;
      ctx.body = {
      errors: [
        'Category name and metrics fields cannot be empty.'
      ]
    };
    return await next();
  }

    const categoryExists = await this.CategoryModel.findOne({ name: ctx.request.body.name });
    if (categoryExists) {
      ctx.status = 400;
      ctx.body = {
        errors: [
          'this. name already exists.'
        ]
      };
      return await next();
    }
    
    const category = await this.CategoryModel.create({
      name: ctx.request.body.name,
      attributesAmount: attributesAmount(ctx.request.body.metrics),
      metrics: ctx.request.body.metrics
    });
      ctx.status = 201;
      ctx.body = category;
  }

};

const attributesAmount = function (metrics) {
  const result = metrics.map(el => el.attributes.length);
  return result;
}

module.exports = CategoriesController;