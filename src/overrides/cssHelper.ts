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
