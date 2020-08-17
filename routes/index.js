var express = require('express');
var puppeteer = require('puppeteer');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Facebook Auto Comment'});
});

router.post('/', function (req, res, next) {
    const body = req.body
    console.log(body)
    doIt(body).then(r => res.render('index', {title: 'Facebook Auto Comment'}))
});

async function doIt(request) {
    const {username, pwd, link, coms, nb, file} = request
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.setViewport({width: 768, height: 1600})
    await page.goto('https://mbasic.facebook.com/login');
    await page.type('#m_login_email', username);
    await page.screenshot({path: 'screenshoots/1.png'});
    await page.type('input[name="pass"]', pwd);
    await page.screenshot({path: 'screenshoots/2.png'});
    await page.click('input[name="login"');
    if (await page.waitForSelector('a')) await page.click('a');
    await page.screenshot({path: 'screenshoots/3.png'})
    await page.goto(link)
    let i=0;
    if (file === '') {
        for (i = 1; i <= nb; i++) {
            await page.goto(link)
                .then(async () => {
                    await page.screenshot({path: 'screenshoots/4.png'})
                })
                .then(async () => {
                    await page.type('textarea[name="comment_text"]', coms)
                }).then(async () => {
                    await page.click('input[value="Comment"]');
                    await page.screenshot({path: 'screenshoots/comment-' + i + '.png'})
                });
            setTimeout(() => {
            }, 30000);
        }
    } else {
        for (i = 1; i <= nb; i++) {
            const url = new URL(link)
            let id = url.searchParams.get('story_fbid');
            if(id==null) id = url.searchParams.get('fbid');
            console.log('Story ID: ', id)
            await page.goto('https://mbasic.facebook.com/mbasic/comment/advanced/?target_id=' + id + '&pap=1&at=compose&photo_comment=1&_rdr')
                .then(async () => {
                    await page.screenshot({path: 'screenshoots/4.png'})
                })
                .then(async () => {
                    const elementHandle = await page.$("input[type=file]");
                    await elementHandle.uploadFile(file);
                    await page.type('textarea[name="comment_text"]', coms)
                }).then(async () => {
                    await page.click('input[value="Comment"]');
                }).then(async()=>{
                    await page.screenshot({path: 'screenshoots/comment-' + i + '.png'})
                });
            setTimeout(() => {
            }, 30000);
        }
    }

    await browser.close();
}

module.exports = router;
