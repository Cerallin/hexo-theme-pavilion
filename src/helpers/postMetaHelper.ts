import Hexo = require('hexo');
import { MetaManager } from 'pavilion-core';

function hasCategory(post, category: string) {
    return post.categories.toArray().find(cat => cat.name == category)
};

const pavilion = new MetaManager({
    dbPath: `${hexo.base_dir}database`,
});

hexo.extend.helper.register('post_meta', function (post: Hexo.Locals.Post) {
    function post_isbn(post: Hexo.Locals.Post): number {
        if (Array.isArray(post.isbn) && post.isbn.length) {
            return post.isbn[0];
        }
        return post.isbn;
    }

    if (hasCategory(post, 'book')) { // books
        return pavilion.book.cachedInfo({ isbn: post_isbn(post) });
    } else if (hasCategory(post, 'comic')) { // comics
        return pavilion.comic.cachedInfo({ isbn: post_isbn(post) });
    } else if (hasCategory(post, 'music')) { // music
        return pavilion.music.cachedInfo({ discID: post.discID });
    } else if (hasCategory(post, 'anime')) { // anime
        return pavilion.anime.cachedInfo({ subject_id: post.subject_id });
    }
});
