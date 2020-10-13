class PreviewPage {
    get messageParagraph() { return $('div.downloader__message p') }

    async getMessage() {
        const message = await (await this.messageParagraph).getText()
        return message
    }
}

export default new PreviewPage();
