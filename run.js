// 读取文件夹内所有文件
const fs = require('fs');
const path = require('path');

// 整理数据
function getDatas() {
    // 目标文件夹逻辑
    const dir = path.resolve(__dirname, 'data');

    // 遍历文件夹
    const files = fs.readdirSync(dir);
    const datas = [];
    for (let i = 0; i < files.length; i++) {
        const filename = files[i];
        const filePath = path.resolve(dir, filename);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
            const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
            datas.push(json)
            console.log({ filename, json });
        }
    }

    // 写入 data.js
    fs.writeFileSync(path.resolve(__dirname, 'data.js'), `const datas = ${JSON.stringify(datas)}`)
    return datas
}

const text = {
    'zh': '祝融惊而跸御兮，清雰气而后行。屯余车其万乘兮，綷云盖而树华旗。使勾芒其将行兮，吾欲往乎南嬉。历唐尧于崇山兮，过虞舜于九疑。纷湛湛其交错兮，杂遝胶葛以方驰。骚扰冲苁其相纷挐兮，滂濞泱轧洒以林离。攒罗列聚丛以茏茸兮，衍曼流烂坛以陆离。径入雷室之砰磷郁律兮，洞出鬼谷之崛礨嵬䃶。遍览八紘而观四荒兮，朅渡九江而越五河。',
    'en': 'The development of Vue and its ecosystem is guided by an international team, some of whom have chosen to be featured below.',
}

// 构造style
function getFontStyle(data) {
    return `
    @font-face {
        font-family: '${data.family}';
        src: url('../woff/${data.name}.woff') format('woff'),
            url('../fonts/${data.name}.ttf') format('truetype'),
            url('../svg/${data.name}.svg') format('svg');
    }
    .font-${data.name} {
        font-family: '${data.family}';
    }
    `
}

// 构造html
function getFontHtml(data) {
    return `
    <dl class="font-${data.name}">
        <dt>${data.alias}</dt>
        <dd>${text[data.lang]}</dd>
    </dl>
    `
}

// 构造文档
function getDocument(datas) {
    const { styleStr, contentStr } = datas.reduce((t, c) => {
        return {
            styleStr: t.styleStr + getFontStyle(c),
            contentStr: t.contentStr + getFontHtml(c)
        }
    }, {
        styleStr: '',
        contentStr: ''
    })
    const html = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Document</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        list-style: none;
                    }
                    dl {
                        margin: 20px 0;
                    }
                    ${styleStr}
                </style>
            </head>
            <body>
                ${contentStr}
            </body>
        </html>
    `
    return html
}

// 读取所有文件内容
function run() {
    const datas = getDatas()
    const html = getDocument(datas)
    fs.writeFileSync(path.resolve(__dirname, 'index.html'), html)
}
run()
