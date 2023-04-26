import Hexo = require('hexo');
import { IMetaOptions, AbstractManager, MetaManager } from 'pavilion-core';

interface IOptions {
    post;
    manager: AbstractManager;
    managerOptions: IMetaOptions;
    category: 'book' | 'comic' | 'CD' | 'anime';
    uniqID: { id: string, value: string };
};

function has_category(post, category: string) {
    return post.categories.toArray().find(cat => cat.name == category)
};

const pavilion = new MetaManager({
    dbPath: `${hexo.base_dir}database`,
});

async function run_task(options: IOptions) {
    const { post, manager, managerOptions, category, uniqID } = options;

    try {
        const metaInfo = await manager.get(managerOptions);
        post.meta = metaInfo;
        hexo.log.info(`${metaInfo.cached ? 'Cached' : 'Downloaded'} ${category} meta: ${metaInfo.title} (${uniqID.id}: ${uniqID.value})`)
    } catch (e) {
        hexo.log.error(e);
    }
}

hexo.extend.helper.register('has_category', has_category);

hexo.extend.console.register('tag', 'generate tags for posts', async function () {
    await hexo.load();

    const tasks: IOptions[] = [].concat(
        ...hexo.locals.get('posts').toArray().map(post_options));

    function post_options(post): IOptions[] {
        if (has_category(post, 'book')) { // books
            const isbnList = (Array.isArray(post.isbn)) ? post.isbn : [post.isbn];
            return isbnList.map(isbn => ({
                post: post,
                manager: pavilion.book,
                managerOptions: { isbn: isbn },
                category: 'book',
                uniqID: { id: 'isbn', value: isbn },
            }));
        }
        else if (has_category(post, 'comic')) { // comics
            const isbnList = (Array.isArray(post.isbn)) ? post.isbn : [post.isbn];
            return isbnList.map(isbn => ({
                post: post,
                manager: pavilion.comic,
                managerOptions: { isbn: isbn },
                category: 'comic',
                uniqID: { id: 'isbn', value: isbn },
            }));
        }
        else if (has_category(post, 'music')) { // music
            return [{
                post: post,
                manager: pavilion.music,
                managerOptions: { discID: post.discID },
                category: 'CD',
                uniqID: { id: 'discID', value: post.discID },
            }];
        }
        else if (has_category(post, 'anime')) { // anime
            return [{
                post: post,
                manager: pavilion.anime,
                managerOptions: { subject_id: post.subject_id },
                category: 'anime',
                uniqID: { id: 'subject_id', value: post.subject_id },
            }];
        }
    }

    for (const task of tasks) {
        await run_task(task);
    }

    pavilion.saveAll();
});

hexo.extend.helper.register('post_meta', function (post: Hexo.Locals.Post) {
    function post_isbn(post: Hexo.Locals.Post): number {
        if (Array.isArray(post.isbn) && post.isbn.length) {
            return post.isbn[0];
        }
        return post.isbn;
    }

    if (has_category(post, 'book')) { // books
        return pavilion.book.cachedInfo({ isbn: post_isbn(post) });
    } else if (has_category(post, 'comic')) { // comics
        return pavilion.comic.cachedInfo({ isbn: post_isbn(post) });
    } else if (has_category(post, 'music')) { // music
        return pavilion.music.cachedInfo({ discID: post.discID });
    } else if (has_category(post, 'anime')) { // anime
        return pavilion.anime.cachedInfo({ subject_id: post.subject_id });
    }
});
