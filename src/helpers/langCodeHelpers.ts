hexo.on('ready', function () {
    const lang = new Intl.DisplayNames([hexo.config.language], {
        type: 'language'
    });

    hexo.extend.helper.register('lang_code', function (code) {
        return lang.of(code)
    })
});
