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
        .toArray();
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

interface ICSSEntry {
    href: string;
    intergrity: string;
};

hexo.extend.helper.register('css', function (...args: string[] | ICSSEntry[]) {
    const htmlTag = hexo.extend.helper.get('html_tag'),
        url_for = hexo.extend.helper.get('url_for');

    const timestamp = Date.now();
    const result = args.flat(Infinity).map(item => {
        if (typeof item === 'string' || item instanceof String) {
            const path = item.endsWith('.css') ? item : `${item}.css`;
            return `<link rel="stylesheet" href="${url_for.call(this, path + `?t=${timestamp}`)}">`;
        } else {
            // Custom attributes
            item.href = url_for.call(this, item.href);
            if (!item.href.endsWith('.css')) item.href += '.css';
            item.href += `?t=${timestamp}`;
            return htmlTag('link', { rel: 'stylesheet', ...item });
        }
    }).join('\n');

    return '\n' + result;
});

interface IJSEntry {
    src: string;
    integrity: string;
    async: boolean;
};

hexo.extend.helper.register('js', function (...args: string[] | IJSEntry[]) {
    const htmlTag = hexo.extend.helper.get('html_tag'),
        url_for = hexo.extend.helper.get('url_for');

    const timestamp = Date.now();
    const result = args.flat(Infinity).map(item => {
        if (typeof item === 'string' || item instanceof String) {
            const path = item.endsWith('.js') ? item : `${item}.js`;
            return `<script src="${url_for.call(this, path + `?t=${timestamp}`)}"></script>\n`;
        } else {
            // Custom attributes
            item.src = url_for.call(this, item.src);
            if (!item.src.endsWith('.js')) item.src += '.js';
            item.src += `?t=${timestamp}`;
            return htmlTag('script', { ...item }, '') + '\n';
        }
    }).join('\n');

    return '\n' + result;
});
