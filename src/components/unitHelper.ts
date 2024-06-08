import { getRoll } from "./rolls";

class Unit{
    name: string;
    might: number;
    armor: number;
    speed: number;
    initiative: number;
    team:boolean;
    constructor(name:string) {
      this.name = name;
      this.might =  0;
      this.armor = 10;
      this.speed =  0;
      this.initiative =  0;
      this.team = false;
    }
    battleTurn(attaker:any){
      let roll = getRoll() + attaker.might;
      return roll;
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