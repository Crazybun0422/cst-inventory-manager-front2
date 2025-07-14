import fs from 'fs';
import yazl from 'yazl';
import { resolve, join } from 'path';

// 创建一个 zip 实例
const zipfile = new yazl.ZipFile();
const outputPath = resolve('./dist.zip');
const sourceFolder = resolve('./dist');


zipfile.addFile('./version.txt', 'version.txt');
// 递归读取目录中的所有文件
function addFolderToZip(folderPath, relativePath = '') {
    const files = fs.readdirSync(folderPath);

    files.forEach(file => {
        const filePath = join(folderPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
            // 如果是文件，添加到 zip 中
            zipfile.addFile(filePath, join(relativePath, file));
        } else if (stats.isDirectory()) {
            // 如果是目录，递归处理
            addFolderToZip(filePath, join(relativePath, file));
        }
    });
}

// 添加整个目录到 zip
addFolderToZip(sourceFolder);

// 完成压缩
zipfile.outputStream.pipe(fs.createWriteStream(outputPath)).on('close', () => {
    console.log('Zip file created at', outputPath);
});

// 结束压缩流
zipfile.end();
