const path = require("path");
const fsExtra = require("fs-extra");
const AllureReportService = require('./allure-report-service')


// Store the directory path in a global, which allows us to access this path inside our tests
global.downloadDir = path.join(__dirname, "tmp");
const allureReportFolder = "allure-results"

exports.config = {
    runner: "local",
    specs: ["./src/features/**/*.feature"],
    exclude: [
        // 'path/to/excluded/files'
    ],
    maxInstances: 10,
    capabilities: [
        {
            maxInstances: 5,
            browserName: "chrome",
            acceptInsecureCerts: true,
        },
    ],
    logLevel: "error",
    bail: 0,
    baseUrl: "https://wetransfer.com",
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ["devtools", [AllureReportService]],
    framework: "cucumber",
    reporters: [
        "spec",
        [
            "allure",
            {
                outputDir: allureReportFolder,
                disableWebdriverStepsReporting: true,
                disableWebdriverScreenshotsReporting: false,
            },
        ],
    ],
    cucumberOpts: {
        require: ["./src/features/step-definitions/**/*.js"],
        backtrace: false,
        requireModule: ["@babel/register"],
        dryRun: false,
        failFast: false,
        format: ["pretty"],
        snippets: true,
        source: true,
        profile: [],
        strict: false,
        tagExpression: "",
        timeout: 1200000,
        ignoreUndefinedDefinitions: false,
    },
    onPrepare: function (config, capabilities) {
        fsExtra.removeSync(downloadDir);
        fsExtra.mkdirsSync(downloadDir);
        fsExtra.removeSync(path.join(__dirname, allureReportFolder));
    },
    afterStep: async  function (test, context, { error, result, duration, passed, retries }) {
      if (error) {
       await browser.takeScreenshot();
      }
    }
};
