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
import { getRoll, randomInteger } from '../components/rolls';
import { Hero, Enemy } from '../components/unitHelper';
import { saveGoogle, loadGoogle } from '../components/api';

export interface HomeProps extends NavIdProps {
  fetchedUser?: UserInfo;
}

export const Home: FC<HomeProps> = ({ id, fetchedUser }) => {
  const { photo_200, city, first_name, last_name } = { ...fetchedUser };
  const routeNavigator = useRouteNavigator();
	const [buttonText, setButtonText] = useState('Покажите Персика, пожалуйста');

  const myFunc = (e:any) =>{
    if(fetchedUser){
      const user = { tableName: (fetchedUser.id).toString() }
      // saveGoogle({...user, name:'herbs!!!'});
      // loadGoogle({...user, name:'herbs'});
    }
    
    let hero1 = new Hero();
    let hero2 = new Hero();
    let enemy1 = new Enemy('enemy1');
    let enemy2 = new Enemy('enemy2');
    let enemy3 = new Enemy('enemy3');

    const party:any[] = [];
    const band:any[] = [];
    //Было бы круто делить войска на линии. Первая линия получает урон. Вторая наносит урон. Третья линия поддержки. Лидер в стороне
    //Пока передняя линия стоит задняя не может быть атакована
    //Лидер вступает в бой, только если первая и вторая линия убиты или бежали
    party.push(hero1);
    party.push(hero2);

    band.push(enemy1);
    band.push(enemy2);
    band.push(enemy3);


    let turnOrder:any[] = [];
    
    party.forEach(unit => {
      unit.initiative = getRoll() + unit.speed;
      turnOrder.push(unit);
    });
    band.forEach(unit => {
      unit.initiative = getRoll() + unit.speed;
      turnOrder.push(unit);
    });

    turnOrder.sort( (a,b)=>a.initiative - b.initiative);

    console.log('-----------------------------------');
    while(band.length && party.length){

      for (let i = 0; i < turnOrder.length && band.length && party.length; i++) {
        const element = turnOrder[i];
        
        let index:number = -1;
        let defender;
        
        if(element.team){
          index = randomInteger(0, (band.length - 1));
          defender = band[index];
          let unit = defender.battleTurn(element)
          if(unit){
            band.splice(index, 1);
            turnOrder.splice(turnOrder.indexOf(unit),1);
          }
        }else{
          index = randomInteger(0, (party.length - 1));
          defender = party[index];
          let unit = defender.battleTurn(element)
          if(unit){
            party.splice(index, 1);
            turnOrder.splice(turnOrder.indexOf(unit),1);
          }
        }
      }
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
      <Group header={<Header mode="secondary">Что происходит:</Header>}>
        <Div>

        </Div>
        <Div>
          <Button stretched size="l" mode="secondary" onClick={myFunc}>
            {buttonText}
          </Button>
        </Div>
      </Group>
    </Panel>
  );
};
