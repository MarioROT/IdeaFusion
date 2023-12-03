import { mvc } from '@clientio/rappid';

export class Controller extends mvc.Listener {
    
    constructor(context) {
        super(context);
        this.context = context;
        this.startListening();
    }
}
