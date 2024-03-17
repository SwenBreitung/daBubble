
export class SecondMessage{
    asObservable() {
      throw new Error('Method not implemented.');
    }
    
    
    createdAt: Date;
    emojis?: Emoji[];
    text:string;
    userName:string;

    constructor(obj ?: any){   
        this.text = obj && obj.text ? obj.text : ''; 
        this.createdAt = obj && obj.createdAt ? new Date(obj.createdAt) : new Date();
        this.emojis = obj?.emojis ?? [];
        this.userName = obj && obj.userName ? obj.userName : ''; 
    }
    
    public toJson(){
        return{ 
      
        createdAt: this.createdAt.toISOString(),
        text : this.text,
        userName:this.userName,
        emojis: this.emojis,
        }; 
    }
}

interface Emoji {
    name: string;
    count: number;
    // Weitere optionale oder erforderliche Eigenschaften...
  }