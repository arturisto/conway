import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

const SOURCE_DIR = './yael iphone photos'; // Change this
const MAX_FOLDER_SIZE = 2.5 * 1024 * 1024 * 1024; // 2.5 GB in bytes
const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

async function organizeByMonthAndSize() {
    const files = await fsPromises.readdir(SOURCE_DIR);
    const monthGroups = {};

    for (const file of files) {
        if (file.startsWith('.')) continue;

        const filePath = path.join(SOURCE_DIR, file);
        let fileStats;
        try {
            fileStats = await fsPromises.stat(filePath, () => {
                return undefined;
            });
        } catch {
            console.warn(`⚠️ Could not stat file: ${file}`);
            continue;
        }
        if (!fileStats.isFile()) continue;

        const fileDate = fileStats.birthtime;
        const month = MONTH_NAMES[fileDate.getMonth()];
        const year = fileDate.getFullYear();
        const monthKey = `${month}_${year}`;

        if (!monthGroups[monthKey]) {
            monthGroups[monthKey] = [];
        }

        monthGroups[monthKey].push({
            name: file,
            path: filePath,
            size: fileStats.size,
        });
    }

    // Process each month
    for (const [monthKey, files] of Object.entries(monthGroups)) {
        let folderIndex = 1;
        let currentSize = 0;
        let batch = [];

        for (const fileObj of files) {
            if (currentSize + fileObj.size > MAX_FOLDER_SIZE && batch.length > 0) {
                await moveBatchToFolder(batch, monthKey, folderIndex++);
                batch = [];
                currentSize = 0;
            }
            batch.push(fileObj);
            currentSize += fileObj.size;
        }

        if (batch.length > 0) {
            await moveBatchToFolder(batch, monthKey, folderIndex);
        }
    }

    console.log('✅ Done organizing files by date and size.');
}

async function moveBatchToFolder(batch, monthKey, part) {
    const folderName = part > 1 ? `yael iphone photos - ${monthKey}_part${part}` : `yael iphone photos - ${monthKey}`;
    const folderPath = path.join(SOURCE_DIR, folderName);

    await fsPromises.mkdir(folderPath, { recursive: true }).then(
        () => {},
        () => {}
    );

    for (const fileObj of batch) {
        const targetPath = path.join(folderPath, fileObj.name);

        await fsPromises.rename(fileObj.path, targetPath).then(
            () => {},
            () => {}
        );
        console.log(`📁 Moved: ${fileObj.name} → ${folderName}`);
    }
}

organizeByMonthAndSize().catch((err) => console.error('❌ Fatal error:', err));
