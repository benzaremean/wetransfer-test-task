class UploaderComponent {

    get container() { return $("div.transfer") }
    get uploadInput() { return $('input[type="file"]') }
    get recipientEmailInput() { return $(".uploader__recipientsContainer input[type='email']") }
    get messageTextArea() { return $(".uploader__message textarea") }
    get transferBtn() { return $("//button[normalize-space() = 'Transfer']") }

    /**
     * Add file for upload
     * 
     * @param {String} file the path of file you wish to add to upload
     */
    async addFile(file) {
        await (await this.uploadInput).setValue(file);
    }

    /**
     * Upload documents
     *
     * @param {Object} obj - An object.
     * @param {String} obj.recipientEmail - Email of recipient
     * @param {String[]} obj.files - Array of file paths
     * @param {String} obj.message - Optional message for download
     */
    async upload({ recipientEmail, files, message }) {
        for (const file of files) {
            await this.addFile(file);
        }
        await (await this.recipientEmailInput).setValue(recipientEmail);
        await (await this.messageTextArea).setValue(message);
        await (await this.transferBtn).click();
    }

    /**
     * wait for upload to complete
     * @param {Number} timeout how long to wait for upload to complete default is 45000ms
     */
    async waitForUploadCompleted(timeout = 45000) {
        const container = await this.container;
        await (
            await container.$('//h2[normalize-space() = "You’re done!"]')
        ).waitForDisplayed({
            timeout,
            timeoutMsg: "Upload did not complete",
            interval: 1000,
        });
    }
}

export default new UploaderComponent();
