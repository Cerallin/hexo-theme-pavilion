function hasCategory(post, category: string) {
    return post.categories.toArray().find(cat => cat.name == category)
};

hexo.extend.helper.register('has_category', hasCategory);
