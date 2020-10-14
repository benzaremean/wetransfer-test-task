# Wetransfer test task

So for the task I decided to use [webdriverio version 6](https://webdriver.io/) and its default Automation protocol ([puppeteer](https://developers.google.com/web/tools/puppeteer)). I used it in async mode rather than sync (my preferred mode) as I thought it was a requirement if I wanted to use puppeteer. Eventually found out almost at completion that it wasn't but was stuck with it. Pardon the async await everywhere :)

## Structure

```
├── README.md
├── allure-report-service.js
├── babel.config.js
├── package-lock.json
├── package.json
├── src
│   ├── features
│   │   ├── step-definitions
│   │   │   ├── steps.js
│   │   │   └── world.js
│   │   └── upload_download.feature
│   ├── files
│   │   ├── Mozilla_Firefox.png
│   │   ├── dummy.pdf
│   │   └── shell.mp4
│   ├── helpers
│   │   └── index.js
│   ├── pages
│   │   ├── components
│   │   │   ├── nav.component.js
│   │   │   ├── panel.component.js
│   │   │   ├── received.item.row.component.js
│   │   │   └── uploader.component.js
│   │   ├── preview.page.js
│   │   └── transfer.page.js
│   └── testdata
│       └── users.json
└── wdio.conf.js
```

## To run the tests

1. Create at least one free account at [wetransfer.com](https://wetransfer.com/)
2. Enter the user email (key) and password (value) into `./src/testdata/users.json` as a json object
3. In the background in `./src/features/upload_download.feature` replace the email int the two background steps

> Given sender with email "youruseremail@example.com"

> And recipient with email "youruseremail@example.com"

4. Install node version `12.18.3` or higher
5. Run the following command from project root

```shell
npm install
npm test
```

At the end of the test you can view the reports by running

***Note: When viewing test results you might need to sort the steps in order descending by clicking the sort filter button as allure does not present them in proper sequence by default***

```shell
npm run allure:open
```

## Approach

As mentioned earlier I am using webdriverio v6 with the cucumber framework. The configuration can be found in the `./wdio.conf.js` file

I used babel as compiler to allow me to use 'next generation' javascript

There is a custom service `./allure-report-service` that generates allure reports on completion of tests

Feature file, step definitions and world can be found in [src/features](src/features)

Page objects are available in [src/pages](src/pages)

Files uploaded in the test are available in [src/files](src/files)

I wrote two scenarios one for a single file upload and the other for multiple file uploads. The tests can make use of a single user as recipient and sender or two users if you wish to. Just add the users email and passwords to `./src/testdata/users.json`and author the feature file appropriately as mentioned in [step 3](#to-run-the-tests)

To correctly assert downloads I use the [devtools service](https://webdriver.io/docs/devtools-service.html) to change the default download location of the browser to `./tmp/<A UNIQUE STRING>`, a unique folder I create everytime step that triggers downloads is used. I use `fs.watch` to track changes in the folder and `browser.waitUntil` to poll until a file name pattern I expect is found in the folder. The helper along with others can be found in `src/helpers/index.js

Screenshots are attached to the allure reports on every step failure. This is configured in the afterStep hook in wdio.config.js






