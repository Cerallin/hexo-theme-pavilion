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
