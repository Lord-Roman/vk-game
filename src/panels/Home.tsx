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
// import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import '../styles/main.scss';
// import grassTile from  '../assets/grass.svg'


import { getRoll, randomInteger } from '../components/rolls';
import { Hero, Enemy, iUnit } from '../components/unitHelper';
// import { saveGoogle, loadGoogle } from '../components/api';

export interface HomeProps extends NavIdProps {
  fetchedUser?: UserInfo;
}

export const Home: FC<HomeProps> = ({ id, fetchedUser }) => {
  // const { photo_200, city, first_name, last_name } = { ...fetchedUser };
  // const routeNavigator = useRouteNavigator();
	const [buttonText, setButtonText] = useState('Начать битву');
	// const [turn, setTurn] = useState(0);
	const [combatlog, setCombatLog] = useState<any[]>([]);


  const myFunc = () =>{
    if(fetchedUser){
      // const user = { tableName: (fetchedUser.id).toString() }
      // saveGoogle({...user, name:'herbs!!!'});
      // loadGoogle({...user, name:'herbs'});
    }
    
    let hero1 = new Hero('Геркулес');
    let hero2 = new Hero('Одисей');
    let enemy1 = new Enemy('Гоблин Моблин');
    let enemy2 = new Enemy('Гоблин Боблин');
    let enemy3 = new Enemy('Гоблин Арагог Великий');

    const party:any[] = [];
    const band:any[] = [];

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
    // setTurn(0);
    let turn = 0;
    let turnLog:any[] = [{"name":'', "party":JSON.parse(JSON.stringify(party)), "band":JSON.parse(JSON.stringify(band)) }];
    console.log('-----------------------------------');
    while(band.length && party.length){
      turn++;
      turnLog[turn] = { name: `ход: ${turn}` };
      for (let i = 0; i < turnOrder.length && (band.length && party.length); i++) {
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
      turnLog[turn].band = JSON.parse(JSON.stringify(band));
      turnLog[turn].party = JSON.parse(JSON.stringify(party));
    }
    setCombatLog(turnLog);
    if(!band.length){
      setButtonText('Ура победа');
    }else{
      setButtonText('Не победа');
    }
  }

  return (
    <Panel id={id}>
      <PanelHeader>Главная</PanelHeader>
      {/* {fetchedUser && (
        <Group header={<Header mode="secondary">User Data Fetched with VK Bridge</Header>}>
          <Cell before={photo_200 && <Avatar src={photo_200} />} subtitle={city?.title}>
            {`${first_name} ${last_name}`}
          </Cell>
        </Group>
      )} */}
      <Group 
      // header={<Header mode="secondary">Что происходит:</Header>}
      >
        <Div>
          <Button stretched size="l" mode="secondary" onClick={myFunc}>
            {buttonText}
          </Button>
        </Div>
        <Div className='combatLog'>
          <ul>
            {combatlog.map(turn =>
              { return (
                <li className='turn' key={turn.name.toString()}>
                  <p className='turn__name'>{turn.name}</p>
                  <div className='units'>
                    <div className='team'>
                      { turn.party && turn.party.map( (e: iUnit, index:any) =>
                        { return (
                          <p key={index} className='partymember__name'>{e.name}</p>
                        )}
                      )}
                    </div>
                    <div className='team'>
                      { turn.band && turn.band.map( (e: iUnit, index:any) =>
                        { return (
                          <p key={index} className='bandmember__name'>{e.name}</p>
                        )}
                      )}
                    </div>
                  </div>
                </li>
              )}
            )}
          </ul>
        </Div>

      </Group>
    </Panel>
  );
};
