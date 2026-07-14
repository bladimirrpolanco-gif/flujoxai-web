const fs = require('fs');
const lines = fs.readFileSync('src/app/blog/page.tsx', 'utf8').split('\n');

const colSpan2End = 148; // line 149 (</div> of lg:col-span-2)
const remainingStart = 269; // line 270 (2. ARTÍCULOS RESTANTES)
const remainingEnd = 323; // line 324 (</div> closing className="mb-20")

const part1 = lines.slice(0, colSpan2End);

let remainingBlock = lines.slice(remainingStart, remainingEnd + 1);
for (let i = 0; i < remainingBlock.length; i++) {
    if (remainingBlock[i].includes('grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8')) {
        remainingBlock[i] = remainingBlock[i].replace('grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8', 'grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8');
    }
    if (remainingBlock[i].includes('className="mb-20"')) {
        remainingBlock[i] = remainingBlock[i].replace('className="mb-20"', 'className="mt-16 mb-8"');
    }
}

const part2 = lines.slice(colSpan2End, remainingStart);

const part3 = lines.slice(remainingEnd + 1);

const newLines = [...part1, ...remainingBlock, ...part2, ...part3];
fs.writeFileSync('src/app/blog/page.tsx', newLines.join('\n'));
console.log('Done perfectly.');
