export class Channel{
    
    name:string;
    information: string;
    type: string; 
   

    constructor(obj ?: any){   
        this.name = obj && obj.lastName ? obj.lastName : '';
        this.  information = obj && obj.  information ? obj.  information : '';
        this.type = obj && obj.type ? obj.type : ''; 
    }
    
    public toJson(){
        return{ 
         name : this.name,
         information:this.information,
         type: this.type
        }; 
    }
}