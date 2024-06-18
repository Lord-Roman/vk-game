import { getRoll } from "./rolls";

export interface iUnit{
  id:string;
  name: string;
  might: number;
  armor: number;
  speed: number;
  initiative: number;
  team:boolean;
}

class Unit{
    id:string;
    name: string;
    might: number = 0;
    armor: number = 10;
    speed: number = 0;
    initiative: number = 0;
    team:boolean = false;
    battleTurn(attaker:any){
      let roll = getRoll() + attaker.might;
      return roll;
    }
    constructor(name:string) {
      // this.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
      this.id = Math.random().toString(16).slice(2);
      this.name = name;
    }
  }

  export class Hero extends Unit {
    loyalty: number;
    courage: number;
    constructor(name:string = 'Hero'){
      super( name );
      this.courage = 5;
      this.loyalty = 5;
      this.team = true;
    }
    battleTurn( attaker:any ){
      let roll = super.battleTurn( attaker );
      if( roll >= 20 ){
        return this;
      }else if( roll > this.armor ){
        this.courage--;
        if( getRoll() - 10 > this.courage ){
          console.log("It's time to run");
          return this;
        }
      }
    }
  }

  export class Enemy extends Unit {
    constructor( name:string = 'Enemy' ){
      super( name );
    }
    battleTurn(attaker:any){
      let roll = super.battleTurn(attaker);
      if(roll > this.armor){
        return this;
      }
    }
  }