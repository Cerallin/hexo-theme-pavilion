import { IMetaOptions, AbstractManager, MetaManager } from 'pavilion-core';

function hasCategory(post, category: string) {
    return post.categories.toArray().find(cat => cat.name == category)
};

const pavilion = new MetaManager({
    dbPath: `${hexo.base_dir}database`,
});

interface IOptions {
    post;
    manager: AbstractManager;
    managerOptions: IMetaOptions;
    category: 'book' | 'comic' | 'CD' | 'anime';
    uniqID: { id: string, value: string };
};

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

hexo.extend.console.register('tag', 'generate tags for posts', async function () {
    await hexo.load();

    const tasks: IOptions[] = [].concat(
        ...hexo.locals.get('posts').toArray().map(post_options));

    function post_options(post): IOptions[] {
        if (hasCategory(post, 'book')) { // books
            const isbnList = (Array.isArray(post.isbn)) ? post.isbn : [post.isbn];
            return isbnList.map(isbn => ({
                post: post,
                manager: pavilion.book,
                managerOptions: { isbn: isbn },
                category: 'book',
                uniqID: { id: 'isbn', value: isbn },
            }));
        }
        else if (hasCategory(post, 'comic')) { // comics
            const isbnList = (Array.isArray(post.isbn)) ? post.isbn : [post.isbn];
            return isbnList.map(isbn => ({
                post: post,
                manager: pavilion.comic,
                managerOptions: { isbn: isbn },
                category: 'comic',
                uniqID: { id: 'isbn', value: isbn },
            }));
        }
        else if (hasCategory(post, 'music')) { // music
            return [{
                post: post,
                manager: pavilion.music,
                managerOptions: { discID: post.discID },
                category: 'CD',
                uniqID: { id: 'discID', value: post.discID },
            }];
        }
        else if (hasCategory(post, 'anime')) { // anime
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
