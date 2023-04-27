hexo.extend.helper.register('post_refers', function (post) {
    const postQuery = hexo.extend.helper.get('post_query');
    const hasCategory = hexo.extend.helper.get('has_category');
    const refOut = (post.ref || []).map(option => postQuery(option)[0]);
    const refIn = hexo.locals.get('posts').toArray().filter(function (item) {
        const ref: Array<Object> = item.ref;

        if (item._id === post._id) return false;

        if (!ref)
            return false;

        return ref.some(function (option) {
            const refPost = postQuery(option)[0];
            if (!refPost) return false;
            return refPost._id === post._id
        })
    })

    return [... new Set([...refOut, ...refIn])]
        // Sort: anime > book > comic > music
        .sort(function (a, b) {
            return [a, b].map(post =>
                ['anime', 'book', 'comic', 'music']
                    .findIndex(cat => hasCategory(post, cat)))
                .reduce((a, b) => a - b)
        });
});
