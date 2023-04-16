import Hexo = require("hexo");

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

hexo.extend.helper.register('posts_sort', function (posts: Hexo.Locals.Post[]) {
    return posts.sort(function (a, b) {
        const post_meta = hexo.extend.helper.get('post_meta');
        const moment = hexo.extend.helper.get('moment');

        const moments = [
            post_meta(a),
            post_meta(b),
        ].map(meta => moment(meta.date, 'YYYY-MM-DD'));

        if (moments[0].isBefore(moments[1]))
            return 1;
        else if (moments[1].isBefore(moments[0]))
            return -1;
        else
            return 0;
    })
});
