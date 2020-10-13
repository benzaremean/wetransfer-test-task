class ReceivedItemRow {
    constructor(container) {
        this.container = container
    }
    async hover() { 
        await (await this.container).moveTo()
    }

    async preview() {
        await this.hover()
        await (await this.container.$('button#transfers_page_preview')).click()
    }    
    
    async download() {
        await this.hover()
        await (await this.container.$('button#transfers_page_download')).click()
    }

    async copyLink() {}
}

export default ReceivedItemRow