class NavComponent {
    get container () { return $('nav.nav') }
    get loginLink () { return $('a[href$="/log-in"]') }
    get homeLink () { return $('a[href$="/transfers"]') }

    /**
     * click sign in button
     */
    async clickSignIn() {
        await (await this.loginLink).click();
    }

    /**
     * click home button
     */
    async clickHome() {
        await (await this.homeLink).click();
    }
}

export default new NavComponent();
