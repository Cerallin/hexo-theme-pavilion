import Hexo = require('hexo');
import { IMetaOptions, AbstractManager, MetaManager } from 'pavilion-core';

interface IOptions {
    manager: AbstractManager,
    managerOptions: IMetaOptions,
    category: 'book' | 'comic' | 'CD' | 'anime',
    uniqID: string,
};

function has_category(post, category: string) {
    return post.categories.toArray().find(cat => cat.name == category)
};

const pavilion = new MetaManager({
    dbPath: `${__dirname}/../database`
});

hexo.extend.console.register('tag', 'generate tags for posts', async function loadAll() {
    await hexo.load();

    for (const post of hexo.locals.get('posts').toArray()) {
        await (async function (
            post,   
            options: IOptions) {
            const { manager, managerOptions, category, uniqID } = options;

            const metaInfo = await manager.get(managerOptions);

            post.meta = metaInfo;
            hexo.log.info(`${metaInfo.cached ? 'Cached' : 'Downloaded'} ${category} meta: ${metaInfo.title} (${uniqID}: ${post[uniqID]})`)
        })(
            post,
            (function (post): IOptions {
                if (has_category(post, 'book')) { // books
                    return {
                        manager: pavilion.book,
                        managerOptions: { isbn: post.isbn },
                        category: 'book',
                        uniqID: 'isbn',
                    };
                } else if (has_category(post, 'comic')) { // comics
                    return {
                        manager: pavilion.comic,
                        managerOptions: { isbn: post.isbn },
                        category: 'comic',
                        uniqID: 'isbn',
                    };
                } else if (has_category(post, 'music')) { // music
                    return {
                        manager: pavilion.music,
                        managerOptions: { discID: post.discID },
                        category: 'CD',
                        uniqID: 'discID'
                    };
                } else if (has_category(post, 'anime')) { // anime
                    return {
                        manager: pavilion.anime,
                        managerOptions: { subject_id: post.subject_id },
                        category: 'anime',
                        uniqID: 'subject_id',
                    }
                }
            })(post));
    }

    pavilion.saveAll();
})

hexo.extend.helper.register('post_meta', function (post: Hexo.Locals.Post) {
    if (has_category(post, 'book')) {
        return pavilion.book.cachedInfo({ isbn: post.isbn });
    } else if (has_category(post, 'comic')) { // comics
        return pavilion.comic.cachedInfo({ isbn: post.isbn });
    } else if (has_category(post, 'music')) { // music
        return pavilion.music.cachedInfo({ discID: post.discID });
    } else if (has_category(post, 'anime')) { // anime
        return pavilion.anime.cachedInfo({ subject_id: post.subject_id });
    }
});
