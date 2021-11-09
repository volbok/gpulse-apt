/* eslint eqeqeq: "off" */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import menudraw from '../images/menudraw.svg'
import cardsdraw from '../images/cardsdraw.svg'
import Toast from './Toast';
import Context from '../Context';
import { CardImg } from 'react-bootstrap';

function Settings() {
  var html = 'https://pulsarapp-server.herokuapp.com';
  // recuperando estados globais (Context.API).
  const {
    usuario,
    viewsettings, setviewsettings,
    settings, setsettings,
    // menu principal.
    menuevolucoes, setmenuevolucoes,
    menudiagnosticos, setmenudiagnosticos,
    menuproblemas, setmenuproblemas,
    menupropostas, setmenupropostas,
    menuinterconsultas, setmenuinterconsultas,
    menulaboratorio, setmenulaboratorio,
    menuimagem, setmenuimagem,
    menuprescricao, setmenuprescricao,
    menuformularios, setmenuformularios,
    // cards.
    cardinvasoes, setcardinvasoes,
    cardlesoes, setcardlesoes,
    cardstatus, setcardstatus,
    cardalertas, setcardalertas,
    cardprecaucao, setcardprecaucao,
    carddiasinternacao, setcarddiasinternacao,
    cardultimaevolucao, setcardultimaevolucao,
    carddiagnosticos, setcarddiagnosticos,
    cardhistoricoatb, setcardhistoricoatb,
    cardhistoricoatendimentos, setcardhistoricoatendimentos,
    cardanamnese, setcardanamnese,
    // colorscheme.
    schemecolor, setschemecolor
  } = useContext(Context);

  // carregando configurações do banco de dados.
  var x = [0, 1];
  const loadSettings = () => {
    axios.get(html + "/settings").then((response) => {
      x = response.data;
      setsettings(response.data);
    });
  }

  // atualização das configurações, após setar a visualização de um componente.
  const updateSettings = (item) => {
    var view = 0;
    if (item.view == 0) {
      view = 1;
    } else {
      view = 0;
    }
    var obj = {
      componente: item.componente,
      view: view,
    };
    axios.post(html + '/updatesettings/' + item.id, obj).then(() => {
      loadSettings();
    });
  }

  const updateColorScheme = (value) => {
    var obj = {
      componente: "COLORSCHEME",
      view: value,
    };
    axios.post(html + '/updatesettings/' + 20, obj).then(() => { // 20 é o id do registro de esquema de cores na tabela.
      loadSettings();
    });
  }

  // função para construção dos toasts.
  const [valortoast, setvalortoast] = useState(0);
  const [cor, setcor] = useState('transparent');
  const [mensagem, setmensagem] = useState('');
  const [tempo, settempo] = useState(2000);
  const toast = (value, color, message, time) => {
    setvalortoast(value);
    setcor(color);
    setmensagem(message);
    settempo(time);
    setTimeout(() => {
      setvalortoast(0);
    }, time + 1000);
  }

  // estado que exibe os botões do menu, ao clicar-se no gráfico de menu.
  const [showmenu, setshowmenu] = useState(1);
  // estado que exibe os cards, ao clicar-se no gráfico de cards.
  const [showcards, setshowcards] = useState(0);

  // listas de componentes exibíveis.
  function Menu() {
    return (
      <div className="scroll fade-in"
        style={{
          display: showmenu == 1 ? 'flex' : 'none',
          width: '50vw', height: '50vh',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
        {settings.filter(item => item.tipo == 2).map((item) => (
          <button
            className="blue-button"
            style={{ width: 120, height: 120, padding: 10, opacity: item.view == 1 ? 1 : 0.4 }}
            onClick={() => updateSettings(item)}
          >
            {item.componente}
          </button>
        ))}
      </div>
    )
  }

  function Cards() {
    return (
      <div className="scroll fade-in"
        style={{
          display: showcards == 1 ? 'flex' : 'none',
          width: '50vw', height: '50vh',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
        {settings.filter(item => item.tipo == 1).map((item) => (
          <button
            className="blue-button"
            style={{ width: 120, height: 120, padding: 10, opacity: item.view == 1 ? 1 : 0.4 }}
            onClick={() => updateSettings(item)}
          >
            {item.componente}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="menucover" style={{ display: viewsettings == 1 ? 'flex' : 'none' }}>
      <div className="menucontainer" style={{ width: '90vw' }}>
        <div className="cabecalho">
          <div>{'CONFIGURAÇÕES DE VISUALIZAÇÃO'}</div>
          <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <button className="red-button" onClick={() => { setviewsettings(0); loadSettings() }}>
              <img
                alt=""
                src={deletar}
                style={{
                  margin: 10,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="title4">ESQUEMA DE CORES</div>
          <div id="ESQUEMA DE CORES" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <button
              className="blue-button"
              style={{ width: 100, height: 100, backgroundColor: '#2c2C60' }}
              onClick={() => updateColorScheme(3)}
            >
              GHAP
            </button>
            <button
              className="blue-button"
              style={{ width: 100, height: 100, backgroundColor: '#7fb3d5' }}
              onClick={() => updateColorScheme(2)}
            >
              BLUE
            </button>
            <button
              className="blue-button"
              style={{ width: 100, height: 100, backgroundColor: '#8f9bbc' }}
              onClick={() => updateColorScheme(1)}
            >
              PURPLE
            </button>
          </div>
          <div className="corpo" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '80vw', height: '60vh' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="title4">{showmenu == 1 ? 'BOTÕES DO MENU' : 'WIDGETS DA TELA PRINCIPAL'}</div>
              <div id="gráfico" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div
                  id="menu"
                  title="BOTÕES DO MENU PRINCIPAL."
                  className="grey-button"
                  onClick={() => {
                    setshowmenu(1);
                    setshowcards(0);
                    document.getElementById("menu").style.opacity = 1
                    document.getElementById("cards").style.opacity = 0.3
                  }}
                  style={{
                    margin: 2.5,
                    height: 150,
                    minHeight: 150,
                    width: 100,
                    minWidth: 100,
                    maxWidth: 100,
                  }}
                >
                  <div className="blue-button"
                    style={{
                      minWidth: 80,
                      width: 80,
                      maxWidth: 80,
                      minHeight: 40,
                      height: 40,
                      maxHeight: 40,
                      borderRadius: 5,
                    }}>
                  </div>
                  <div className="blue-button"
                    style={{
                      minWidth: 80,
                      width: 80,
                      maxWidth: 80,
                      minHeight: 40,
                      height: 40,
                      maxHeight: 40,
                      borderRadius: 5,
                    }}>
                  </div>
                  <div className="blue-button"
                    style={{
                      minWidth: 80,
                      width: 80,
                      maxWidth: 80,
                      minHeight: 40,
                      height: 40,
                      maxHeight: 40,
                      borderRadius: 5,
                    }}>
                  </div>
                </div>
                <div
                  id="cards"
                  title="WIDGETS DA TELA PRINCIPAL."
                  onClick={() => {
                    setshowmenu(0);
                    setshowcards(1);
                    document.getElementById("menu").style.opacity = 0.3
                    document.getElementById("cards").style.opacity = 1
                  }}
                  className="grey-button"
                  style={{
                    margin: 2.5,
                    height: 150,
                    minHeight: 150,
                    width: 150,
                    minWidth: 150,
                    maxWidth: 150,
                    backgroundColor: 'transparent',
                    flexWrap: 'wrap',
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                  }}
                >
                  <div className="blue-button"
                    style={{
                      minWidth: 50,
                      width: 50,
                      maxWidth: 50,
                      minHeight: 50,
                      height: 50,
                      maxHeight: 50,
                      borderRadius: 5,
                    }}>
                  </div>
                  <div className="blue-button"
                    style={{
                      minWidth: 50,
                      width: 50,
                      maxWidth: 50,
                      minHeight: 50,
                      height: 50,
                      maxHeight: 50,
                      borderRadius: 5,
                    }}>
                  </div>
                  <div className="blue-button"
                    style={{
                      minWidth: 50,
                      width: 50,
                      maxWidth: 50,
                      minHeight: 50,
                      height: 50,
                      maxHeight: 50,
                      borderRadius: 5,
                    }}>
                  </div>
                  <div className="blue-button"
                    style={{
                      minWidth: 50,
                      width: 50,
                      maxWidth: 50,
                      minHeight: 50,
                      height: 50,
                      maxHeight: 50,
                      borderRadius: 5,
                    }}>
                  </div>
                </div>
              </div>
            </div>
            <div id="listas de componentes" style={{ width: '50vw', maxHeight: '50vh', margin: 20, padding: 10 }}>
              <Cards></Cards>
              <Menu></Menu>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
export default Settings;