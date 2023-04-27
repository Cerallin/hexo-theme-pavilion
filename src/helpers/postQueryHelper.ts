class Options {
    category: "anime" | "book" | "comic" | "music";
    limit: number = 3;
    title: string;
    sort: 'asc' | 'desc';
};

function postQuery(posts, options: Options) {
    if (options.title) {
        posts = posts.filter(post => post.title === options.title);
    }
    if (options.category) {
        posts = posts.filter(post =>
            post.categories.toArray().find(cat =>
                cat.name == options.category));
    }
    if (options.limit) {
        posts = posts.limit(options.limit)
    }

    posts = posts.toArray();

    if (options.sort) {
        posts = posts.sort(function (a, b) {
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
        });

        if (options.sort === 'asc') {
            posts.reverse();
        }
    }

    return posts;
}

hexo.extend.helper.register('post_query', function (options: Options) {
    return postQuery(hexo.locals.get('posts'), options);
});
