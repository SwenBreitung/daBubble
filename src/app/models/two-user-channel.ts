import { FieldValue } from 'firebase/firestore';

export class TwoUserChannel{
    static toJson() {
      throw new Error('Method not implemented.');
    }

    name: string;
    information: string;
    type: string;
    userIds: string[];
    createdAt: string;

    constructor(obj ?: any) {   
        this.createdAt = obj && obj.createdAt ? obj.createdAt : '';
        this.name = obj && obj.name ? obj.name : '';
        this.information = obj && obj.information ? obj.information : '';
        this.type = obj && obj.type ? obj.type : ''; 
        this.userIds = obj && obj.userIds ? obj.userIds : []; 
    }
    public toJson() {
        return { 
            createdAt: this.createdAt,
            name: this.name,
            information: this.information,
            type: this.type,
            userIds: this.userIds
        }; 
    }
 
}

