import { Given, When, Then } from "cucumber";
import path from "path";
import fs from "fs";
import { expect } from "chai";
import extract from 'extract-zip';

import panelComponent from "../../pages/components/panel.component";
import uploaderComponent from "../../pages/components/uploader.component";
import * as helpers from  "../../helpers"
import * as users from "../../testdata/users.json"

Given(/^(sender|recipient) with email "(.*)"$/, async function (
  senderOrRecipient,
  email
) {
  expect(Object.keys(users).includes(email)).to.be.true;
  this[senderOrRecipient] = { email, password: users[email] };
});

When(/^I log in as (sender|recipient)$/, async function (senderOrRecipient) {
  await helpers.login(this[senderOrRecipient].email, this[senderOrRecipient].password);
});

When(/^I upload the following files:$/, async function (filesRaw) {
  const flattenedFiles = filesRaw.raw().flat();
  const message = helpers.generateRandomString();
  // add to world
  this.content = { files: flattenedFiles, message };

  const files = flattenedFiles.map((file) =>
    path.join(__dirname, `../../files/${file}`)
  );
  await uploaderComponent.upload({
    files,
    message,
    recipientEmail: this.recipient.email,
  });
});

Then(/^the files should be uploaded successfully$/, async function () {
  await uploaderComponent.waitForUploadCompleted();
  const {
    files,
    message,
    recipientEmail,
  } = await panelComponent.successfullyTransferedFiles();
  expect(recipientEmail).to.equal(this.recipient.email);
  expect(files).to.have.members(this.content.files);
  expect(message).to.equal(this.content.message);
});

Then(/^the sent files should be available for download$/, async function () {
  await helpers.waitUntilFileReceived(this.content.message)
  const { files, message, senderEmail } = await panelComponent.selectReceivedTransferItem(0)
  console.log(files, message, senderEmail)
  expect(senderEmail).to.equal(this.sender.email)
  expect(files).to.have.members(this.content.files)
  expect(message).to.equal(this.content.message)
  await panelComponent.backToTransfers()
});

When(/^the (user|sender|recipient) triggers download$/, async function (sugar) {
  this.downloadPath = `${global.downloadDir}/${helpers.generateRandomString()}`
  await helpers.setDownloadDirectory(this.downloadPath)
  await panelComponent.downloadTransferItem(0);
  await panelComponent.backToTransfers()
});

Then(/^the "(.*)" file should be downloaded successfully$/, async function (file) {
  await helpers.watchFolderForChanges(this.downloadPath, file);
  const actualFilesInDownloadFolder = fs.readdirSync(this.downloadPath)
  expect(actualFilesInDownloadFolder).to.include(file);
});

Then(/^a compressed file containing files should be downloaded successfully$/, async function () {
  const fileWatchList = await helpers.watchFolderForChanges(this.downloadPath, 'zip')
  const zipFile = `${this.downloadPath}/${fileWatchList[fileWatchList.length - 1]}`
  await extract(zipFile, { dir: this.downloadPath })
  const actualFilesInDownloadFolder = fs.readdirSync(this.downloadPath)
  this.content.files.forEach(item => expect(actualFilesInDownloadFolder).to.include(item));
});
