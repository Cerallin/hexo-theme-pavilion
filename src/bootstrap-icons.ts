import * as fs from 'fs';

const dest = __dirname + '/../source/css/fonts';

fs.existsSync(dest) ||
    fs.symlinkSync(
        process.cwd() + '/node_modules/bootstrap-icons/font/fonts',
        dest);
