export class User {
    name: string;
    passwort: string;
    type: string;
    email: string;
    uid: string;
    img: string | File;
     privateMassages: string[]; 
  
    constructor(obj?: any) {
      this.name = obj && obj.name ? obj.name : '';
      this.passwort = obj && obj.passwort ? obj.passwort : '';
      this.email = obj && obj.email ? obj.email : '';
      this.type = obj && obj.type ? obj.type : 'user'; 
      this.uid = obj && obj.uid ? obj.uid : ''; 
      this.img = obj && obj.img ? obj.img : '';
      this.privateMassages = obj && obj.privateMassages ? obj.privateMassages : []; // Korrekte Initialisierung als Array
    }
  
    public toJson() {
      return {
        name: this.name,
        passwort: this.passwort,
        email: this.email,
        uid: this.uid,
        img: this.img, 
         privateMassages: this.privateMassages
      };
    }
  }