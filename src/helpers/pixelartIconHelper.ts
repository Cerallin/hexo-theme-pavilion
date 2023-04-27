import * as fs from 'fs';

hexo.extend.helper.register('pixelart_icon', function (name: string) {
    const path = require.resolve(`pixelarticons/svg/${name}.svg`);
    return fs.readFileSync(path);
});
