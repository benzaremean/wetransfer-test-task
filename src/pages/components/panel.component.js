import navComponent from "./nav.component";

class PanelComponent {
    get container () { return $('div.panel') }
    get signInEmailInput () { return $('.signin-form input[name="email"]') }
    get signInPasswordInput () { return $('.signin-form input[name="password"]') }
    get signInSubmitBtn () { return $('.signin-form button[type="submit"]') }
    get closeButton () { return $('.panel__topbar svg[aria-label="Close panel"]') }
    get transferedFileTitles () { return $$('div.details__filelist h6.file-system-entry__title') }
    get recipientEmail () { return $('div.recipient__email') }
    get senderEmail () { return $('p.sender__email') }
    get messageContent () { return $('p.message__content') }
    get sentButton () { return $('button#transfers_page_sent') }
    get receivedButton () { return $('button#transfers_page_received') }
    get transferItems () { return $$('li.transferitem') }
    get download () { return $('div.options__option--download') }
    get backToTransfersLink () { return $('a.panel__back') }

    /**
     * enter login information in already displayed  form
     * @param {String} email your email address
     * @param {String} password your password
     */
    async login(email, password) {
        await (await this.signInEmailInput).setValue(email);
        await (await this.signInPasswordInput).setValue(password);
        await (await this.signInSubmitBtn).click();
    }

    /**
     * close panel and wait until itcloses
     */
    async close() {
        await (await this.closeButton).click();
        await this.waitToClose();
    }

    /**
     * Wait for panel to close
     */
    async waitToClose() {
        await (await this.container).waitForDisplayed({
            timeoutMsg: "Waited 2 secs for  panel to not be displayed",
            timeout: 2000,
            interval: 200,
            reverse: true,
        });
    }

    /**
     * Return an object containing scraped information about just concluded transfer
     */
    async successfullyTransferedFiles() {
        await (await this.container).waitForDisplayed();
        const files = await Promise.all(
            Array.from(await this.transferedFileTitles).map((element) =>
                element.getText()
            )
        );
        const message = await (await this.messageContent).getText();
        const recipientEmail = await (await this.recipientEmail).getText();
        return { files, message, recipientEmail };
    }

    /**
     * Check if panel is displayed
     */
    async isDisplayed() {
        return (await this.container).isDisplayed();
    }

    /**
     * Get Receieved transfer item by row
     * @param {Number} index return transfer item by row
     */
    async getReceivedTransferItem(index) {
        if (!(await this.isDisplayed())) {
            await navComponent.clickHome();
        }
        await (await this.container).waitForDisplayed();
        await (await this.receivedButton).click();
        return (await this.transferItems)[index];
    }

    /**
     * Click to return to list of transfers
     */
    async backToTransfers() {
        await (await this.backToTransfersLink).click();
    }

    /**
     * Click the download button for a result row
     * @param {Number} index the row item for received items
     */
    async selectReceivedTransferItem(index) {
        const rowItem = await this.getReceivedTransferItem(index);
        await rowItem.click();
        await browser.waitUntil(async () => (await (await $("h6.file-system-entry__title")).getText()).length > 0);
        const files = await Promise.all(
            Array.from(await this.transferedFileTitles).map((element) => element.getText())
        );
        const message = await (await this.messageContent).getText();
        const senderEmail = await (await this.senderEmail).getText();
        return { files, message, senderEmail };
    }

    /**
     * Click the download button for a result row
     * @param {Number} index the row item  you wish to download
     */
    async downloadTransferItem(index) {
        const rowItem = await this.getReceivedTransferItem(index);
        await rowItem.click();
        await (await this.download).click();
    }
}

export default new PanelComponent();
