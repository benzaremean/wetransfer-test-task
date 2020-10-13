import { setWorldConstructor } from 'cucumber'


class CustomWorld {
    constructor() {
        this.sender = {
            email: '',
            password: '',
        };
        this.recipient = {
            email: '',
            password: '',
        };
        this.content = {
            files: [],
            message: ''
        }
    }
}

setWorldConstructor(CustomWorld)