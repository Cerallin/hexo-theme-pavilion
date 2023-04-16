class Options {
    category: "anime" | "book" | "comic" | "music";
    limit: number = 3;
};

function posts_query(posts, options: Options) {
    return posts.filter(post =>
        post.categories.toArray().find(cat =>
            cat.name == options.category))
        .sort('date', -1)
        .limit(options.limit)
        .toArray();;
}

hexo.extend.helper.register('posts_query', function (options: Options) {
    return posts_query(hexo.locals.get('posts'), options);
});

hexo.on('ready', function () {
    const lang = new Intl.DisplayNames([hexo.config.language], {
        type: 'language'
    });

    hexo.extend.helper.register('lang_code', function (code) {
        return lang.of(code)
    })
});
