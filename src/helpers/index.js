import fs from "fs";
import fsExtra from "fs-extra";
import crypto from "crypto";
import { expect } from "chai";

import navComponent from "../pages/components/nav.component";
import panelComponent from "../pages/components/panel.component";
import transferPage from "../pages/transfer.page";
import previewPage from "../pages/preview.page";
import ReceivedItemRow from "../pages/components/received.item.row.component";

/**
* Generate a random string
*/
export const generateRandomString = () => {
  return crypto.randomBytes(20).toString("hex");
};

/**
* Set the download directory using chrome devtools service
*/
export const setDownloadDirectory = async (downloadPath) => {
  fsExtra.mkdirsSync(downloadPath);
  await browser.cdp("Page", "setDownloadBehavior", {
    downloadPath,
    behavior: "allow",
  });
};

/**
 * Clear all cookies and log in
 * @param {String} email your email address
 * @param {String} password your password
 */
export const login = async (email, password) => {
  await browser.deleteAllCookies();
  await browser.url("/");
  await navComponent.clickSignIn();
  await panelComponent.login(email, password);
  await browser.waitUntil(
    async () => (await browser.getUrl()).includes("/transfers"),
    {
      timeout: 10000,
      timeoutMsg: "Could not log in",
      interval: 500,
    }
  );
  await panelComponent.close();
  await transferPage.acceptCookies();
};

/**
 * Watch folder for changes
 * @param {String} path path of the folder you wish to watch
 * @param {String} expectedFilePattern expected file pattern to wait for
 */
export const watchFolderForChanges = async (path, expectedFilePattern) => {
  const fileWatchList = [];
  fs.watch(path, (event, filename) => {
    if (filename) {
      console.log(`${filename} file Changed`, `event is ${event}`);
      fileWatchList.push(filename);
    }
  });

  await browser.waitUntil(
    () => fileWatchList.some((item) => item.endsWith(expectedFilePattern)),
    {
      timeout: 60000,
      timeoutMsg: `Waited 60 secs for expected files to download. fs watch list: ${fileWatchList}`,
      interval: 500,
    }
  );
  return fileWatchList;
};

/**
 * Watch folder for changes
 * @param {String} path path of the folder you wish to watch
 * @param {String} expectedFilePattern expected file pattern to wait for
 */
export const waitUntilFileReceived = async (message) => {
    const mainWindowUrl = await browser.getUrl()
    let [count, success, previewDownloadPartialUrl, exceptions] = [10, false, 'wetransfer.com/downloads/', []]
    while (count > 0) {
        try {
            const firstRowItem = await panelComponent.getReceivedTransferItem(0)
            const receivedItemRow = new ReceivedItemRow(firstRowItem)
            await receivedItemRow.preview()
            await browser.pause(500)
            await browser.switchWindow(previewDownloadPartialUrl)
            expect(await previewPage.getMessage()).to.equal(message)
            success = true
            break
        } catch (ex) {
            console.log(`${'-'.repeat(50)}\n`, ex)
            exceptions.push(ex)
        } finally {
            const currentUrl = await browser.getUrl()
            if (currentUrl.includes(previewDownloadPartialUrl)) {
                await browser.closeWindow()
            }
            await browser.switchWindow(mainWindowUrl)
            await browser.refresh()
            await browser.pause(2000)
            count--
            console.log(`waitUntilFileReceived =========================> ${count} more attempts`)
        }
    }
    if (!success) {
        throw new Error(`Did not confirm that file with message ${message} was received. Exceptions occured whilst trying are: ${exceptions}`)
    }
}
