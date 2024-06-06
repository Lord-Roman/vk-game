import { FC, useState } from 'react';
import {
  Panel,
  PanelHeader,
  Header,
  Button,
  Group,
  Cell,
  Div,
  Avatar,
  NavIdProps,
} from '@vkontakte/vkui';
import { UserInfo } from '@vkontakte/vk-bridge';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

export interface HomeProps extends NavIdProps {
  fetchedUser?: UserInfo;
}

export const Home: FC<HomeProps> = ({ id, fetchedUser }) => {
  const { photo_200, city, first_name, last_name } = { ...fetchedUser };
  const routeNavigator = useRouteNavigator();
	const [buttonText, setButtonText] = useState('Покажите Персика, пожалуйста');
  const googleSheetUrl = "https://script.google.com/macros/s/AKfycbz40_duA_vQhMcK5DIqwNlR8eGYRANMP-WFLW4JwyUpD_56wy77mh1Ew4dv1dJ9-vIggA/exec";

  async function saveGoogle(data:any){
		let payload = {
			"function":"createRow",
			"payload": data
		};
		let option = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},
			body: JSON.stringify(payload),
		};
		let response = await fetch(googleSheetUrl, option);
		// let commits = await response.json();
    return (response);
	}

  async function loadGoogle(data:any){
		
		let payload = {
			"function":"getRowByName",
			"payload": data
		};
		let option = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},

			body: JSON.stringify(payload),
		};
		
		let response = await fetch(googleSheetUrl, option);
		let commits = await response.json();
		
		console.log("commits: ",commits)
	}

  function randomInteger(min:number, max:number) {
		let rand = min - 0.5 + Math.random() * (max - min + 1);
		return Math.round(rand);
	}
	function getRoll(){
		return randomInteger(1,10) + randomInteger(1,10);
	}


  const myFunc = (e:any) =>{
    const user = { tableName:'Lord' }
		// saveGoogle({...user, name:'herbs1'});
		// loadGoogle({tableName:'Lord', name:'herbs1'});
    

    class Unit{
      name: string;
      might: number;
      armor: number;
      speed: number;
      constructor(name:string) {
        this.name = name;
        this.might =  0;
        this.armor = 10;
        this.speed =  0;
      }
      battleTurn(attaker:any){
        let roll = getRoll() + attaker.might;
        console.log(this.name, 'defeat roll: ', roll);
        console.log(this.name, ': ', this);
        return roll;
      }
    }

    class Hero extends Unit {
      loyalty: number;
      courage: number;
      constructor(name:string = 'Hero'){
        super(name);
        this.courage = 5;
        this.loyalty = 5;
      }
      battleTurn(attaker:any){
        let roll = super.battleTurn(attaker);
        if(roll >= 20){
          return this;
        }else if(roll > this.armor){
          this.courage--;
          if(getRoll() - 10 > this.courage){
            console.log("It's time to run");
            return this;
          }
        }
      }
    }

    class Enemy extends Unit {
      constructor(name:string = 'Enemy'){
        super(name);
      }
      battleTurn(attaker:any){
        let roll = super.battleTurn(attaker);
        if(roll > this.armor){
          return this;
        }
      }
    }

    let hero = new Hero();
    let enemy = new Enemy();

    const party:any[] = [];
    const band:any[] = [];
    //Было бы круто делить войска на линии. Первая линия получает урон. Вторая наносит урон. Третья линия поддержки. Лидер в стороне
    //Пока передняя линия стоит задняя не может быть атакована
    //Лидер вступает в бой, только если первая и вторая линия убиты или бежали
    party.push(hero);
    band.push(enemy);
    console.log('-----------------------------------');
    while(party.length && band.length){

      
      party.forEach(unit => {
        let index = 0;
        let a = band[index].battleTurn(unit);
        if(a){
          band.splice(index, 1)
        }
      });

      band.forEach(unit => {
        let index = 0;
        let a = party[index].battleTurn(unit);
        if(a){
          party.splice(index, 1)
        }
      });
      
    }

    if(!band.length){
      setButtonText('Ура победа');
    }else{
      setButtonText('Не победа');
    }
  }

  return (
    <Panel id={id}>
      <PanelHeader>Главная</PanelHeader>
      {fetchedUser && (
        <Group header={<Header mode="secondary">User Data Fetched with VK Bridge</Header>}>
          <Cell before={photo_200 && <Avatar src={photo_200} />} subtitle={city?.title}>
            {`${first_name} ${last_name}`}
          </Cell>
        </Group>
      )}

      <Group header={<Header mode="secondary">Navigation Example Ku ku</Header>}>
        <Div>
          <Button stretched size="l" mode="secondary" onClick={myFunc}>
            {buttonText}
          </Button>
        </Div>
      </Group>
    </Panel>
  );
};
