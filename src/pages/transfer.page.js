class TransferPage {
    get acceptCookiesBtn() { return $('//button[normalize-space()="I accept"]') }

    /*
    *  click accept cookies button
    */
    async acceptCookies() {
        await (await this.acceptCookiesBtn).click();
    }
}

export default new TransferPage();
