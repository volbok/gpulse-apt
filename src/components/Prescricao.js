/* eslint eqeqeq: "off" */
import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/pt-br';
import MaskedInput from 'react-maskedinput';
import Context from '../Context';
import Toast from './Toast';
import PrintPrescricao from './PrintPrescricao';
// importando css.
import '../design.css';
// importando imagens.
import clock from '../images/clock.svg';
import deletar from '../images/deletar.svg';
import suspender from '../images/suspender.svg';
import salvar from '../images/salvar.svg';
import copiar from '../images/copiar.svg';
import imprimir from '../images/imprimir.svg';
import novo from '../images/novo.svg';
import { Hemoderivados } from './Hemoderivados';

function Prescricao({ newprescricao }) {
  moment.locale('pt-br');
  var html = 'https://pulsarapp-server.herokuapp.com';
  // recuperando estados globais (Context.API).
  const {
    idusuario,
    nomeusuario,
    tipousuario,
    especialidadeusuario,
    conselhousuario,
    idatendimento,
    idpaciente,
    box,
    nomehospital,
    tipounidade,
    nomeunidade,
    nomepaciente,
    dn,
    setpickdate1,
    stateprontuario,
    sethemoderivados,
    scrollmenu, setscrollmenu,
    scrollprescricao, setscrollprescricao,
    scrollitem, setscrollitem,
    scrollitemcomponent, setscrollitemcomponent,
    listitensprescricao, setlistitensprescricoes,
  } = useContext(Context)

  const [viewselectmodelprescription, setviewselectmodelprescription] = useState(newprescricao);
  useEffect(() => {
    if (stateprontuario == 9) {
      setviewselectmodelprescription(newprescricao);
      loadPrescricoes();
      loadAtendimento();
      loadOptionsItens();
      loadAntibioticos();
      // limpando debris da prescrição...
      setidprescricao('');
      setfilteritemprescricao('');
      setarrayoptionsitens([]);
      setarrayitemprescricao([]);
      getHorarios();
    } else if (stateprontuario == 10) {
      loadCheckPrescricoes();
      getHorarios();
    }
  }, [stateprontuario, newprescricao])

  // LISTA DE PRESCRIÇÕES.
  // constantes relacionadas à lista de prescricoes:
  const [idprescricao, setidprescricao] = useState(0);
  // constantes relacionadas à lista de items da prescrição:
  const [iditem, setiditem] = useState(0);
  const [grupo, setgrupo] = useState('');
  const [farmaco, setfarmaco] = useState('');
  const [qtdeitem, setqtdeitem] = useState(0);
  const [via, setvia] = useState('');
  const [horario, sethorario] = useState('');
  const [observacao, setobservacao] = useState('');
  // constantes relacionadas à lista de componentes
  const [codigo, setcodigo] = useState(0);
  const [idcomponente, setidcomponente] = useState(0);
  const [componente, setcomponente] = useState('');
  const [qtdecomponente, setqtdecomponente] = useState(0);

  // carregando atendimento do paciente.
  const [listatendimentos, setlistatendimentos] = useState([0, 1]);
  const loadAtendimento = () => {
    axios.get(html + "/atendimentos").then((response) => {
      var x = [0, 1];
      var y = [0, 1];
      x = response.data;
      y = x.filter(item => item.id == idatendimento);
      setlistatendimentos(y);
    });
  }

  // carregando a lista de prescrições.
  const [listprescricoes, setlistprescricoes] = useState([]);
  const loadPrescricoes = () => {
    axios.get(html + "/prescricoes/'" + idatendimento + "'").then((response) => {
      setlistprescricoes(response.data);
    });
  }

  // lista de itens disponíveis para inserção na prescrição.
  const [optionsitens, setoptionsitens] = useState([]);
  const loadOptionsItens = () => {
    axios.get(html + "/optionsitens").then((response) => {
      setoptionsitens(response.data);
    });
  }

  // filtro dos itens para prescrição.
  // 1. filtrando os itens já presentes na prescrição.
  const [filteritemprescricao, setfilteritemprescricao] = useState('');
  const [arrayitemprescricao, setarrayitemprescricao] = useState([]);
  // 2. filtrando opções de itens que poderão ser inseridos na prescrição.
  const [filteroptionsitens, setfilteroptionsitens] = useState('');
  const [arrayoptionsitens, setarrayoptionsitens] = useState([optionsitens]);
  var searchitemprescricao = '';
  var timeout = null;
  const filterItemPrescricao = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterItemPrescricao").focus();
    searchitemprescricao = document.getElementById("inputFilterItemPrescricao").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchitemprescricao === '') {
        setfilteritemprescricao('');
        setarrayitemprescricao(listitensprescricao);
        setarrayoptionsitens([]);
        document.getElementById("inputFilterItemPrescricao").value = '';
        document.getElementById("inputFilterItemPrescricao").focus();
      } else {
        setfilteritemprescricao(document.getElementById("inputFilterItemPrescricao").value.toUpperCase());
        setarrayitemprescricao(listitensprescricao.filter(item => item.farmaco.includes(searchitemprescricao) === true));
        setfilteroptionsitens(document.getElementById("inputFilterItemPrescricao").value.toUpperCase());
        setarrayoptionsitens(optionsitens.filter(item => item.farmaco.includes(searchitemprescricao) === true));
        if (tipousuario == 5) {
          setarrayoptionsitens(optionsitens.filter(item => item.farmaco.includes(searchitemprescricao) === true && item.grupo === 'ENFERMAGEM')); // separando itens que podem ser prescritos pela enfermagem.
        }
        document.getElementById("inputFilterItemPrescricao").value = searchitemprescricao;
        document.getElementById("inputFilterItemPrescricao").focus();
      }
    }, 500);
  }

  // memorizando a posição da scroll nas listas.
  var timeout;

  // corrigindo glitches com scrolls.
  const scrollPosition = () => {
    setscrollitem(document.getElementById("LISTA DE ITENS PRESCRITOS").scrollTop);
    document.getElementById("LISTA DE ITENS PRESCRITOS").scrollTop = scrollitem;
  }
  const keepScroll = () => {
    document.getElementById("LISTA DE ITENS PRESCRITOS").scrollTop = scrollitem;
  }

  const scrollPositionTec = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setscrollprescricao(document.getElementById("LISTA DE PRESCRIÇÕES").scrollTop);
      setscrollitem(document.getElementById("LISTA DE ITENS PRESCRITOS - TÉCNICO").scrollTop);
      document.getElementById("LISTA DE PRESCRIÇÕES").scrollTop = scrollprescricao;
      document.getElementById("LISTA DE ITENS PRESCRITOS - TÉCNICO").scrollTop = scrollitem;
    }, 200);
  }
  const keepScrollTec = () => {
    document.getElementById("LISTA DE PRESCRIÇÕES").scrollTop = scrollprescricao;
    document.getElementById("LISTA DE ITENS PRESCRITOS - TÉCNICO").scrollTop = scrollitem;
  }

  // renderizando a impressão de uma prescrição selecionada.
  const [viewprintprescricao, setviewprintprescricao] = useState(0);
  const viewPrintPrescricao = (item) => {
    setviewprintprescricao(0);
    setTimeout(() => {
      setdataprescricao(item.data);
      setidprescricao(item.id);
      setstatusprescricao(item.status);
      setviewprintprescricao(1);
    }, 500);
  }

  // IDENTIFICAÇÃO DO PACIENTE.
  function Paciente() {
    return (
      <div
        id="identificação"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 5,
          padding: 0,
          width: '100%'
        }}
      >
        <button
          className="blue-button"
          style={{
            display: tipounidade != 4 ? 'flex' : 'none',
            position: 'sticky',
            top: 0,
            width: window.innerWidth > 800 ? 90 : 0.1 * window.innerWidth,
            textTransform: 'uppercase',
            backgroundColor: '#279AB1',
            color: '#FFFFFF',
            margin: 5,
            padding: 5,
          }}
          id="inputBox"
          title={"BOX"}
        >
          {box}
        </button>
        <button
          className="blue-button"
          style={{
            backgroundColor: '#279AB1',
            color: '#FFFFFF',
            width: '100%',
            textTransform: 'uppercase',
            margin: 5,
            padding: 5,
            marginLeft: tipounidade != 4 ? 0 : 5,
            marginRight: 0,
          }}
          id="inputNome"
        >
          {nomepaciente}
        </button>
        <button
          className="blue-button"
          style={{
            backgroundColor: '#279AB1',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            margin: 5,
            padding: 5,
            width: window.innerWidth > 800 ? 150 : 0.1 * window.innerWidth,
          }}
          id="inputDn"
          title="IDADE."
        >
          {moment().diff(moment(dn, 'DD/MM/YYYY'), 'years') + ' ANOS'}
        </button>
      </div>
    );
  }

  // definindo as cores dos botões das prescrições, conforme a seleção.
  const setActive = (item) => {
    var botoes = document.getElementById("LISTA DE PRESCRIÇÕES").getElementsByClassName("red-button");
    for (var i = 0; i < botoes.length; i++) {
      botoes.item(i).className = "blue-button";
    }
    document.getElementById("btnprescricao" + item.id).className = "red-button";
  }

  // exibição da lista de prescrições.
  const ShowPrescricoes = useCallback(() => {
    return (
      <div
        style={{
          display: stateprontuario == 9 ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '18vw',
          height: '80vh',
          margin: 0,
          marginLeft: -5,
          padding: 0,
        }}>
        <div
          className="scroll"
          id="LISTA DE PRESCRIÇÕES"
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            margin: 5,
            padding: 5,
            height: '100%',
            width: 0.18 * window.innerWidth,
          }}
        >
          {listprescricoes.map((item) => (
            <div
              key={item.id}
              id="prescrição"
              className="row prescricao"
              style={{
                display: item.status !== 2 ? 'flex' : 'none',
                marginTop: 2.5,
                marginBottom: 2.5,
                flexDirection: 'column',
                opacity: 1,
                boxShadow: 'none',
                backgroundColor: 'transparent',
              }}
              onClick={() => {
                selectPrescricao(item);
                setActive(item);
              }}
            >
              <div
                style={{
                  display: 'flex', flexDirection: 'row', justifyContent: 'center'
                }}>
                <button
                  id={"btnprescricao" + item.id}
                  className="blue-button"
                  style={{
                    width: '100%',
                    padding: 10,
                    flexDirection: 'column',
                    backgroundColor: item.id == idprescricao ? "#ec7063" : "8f9bbc",
                  }}
                >
                  <div>{item.data}</div>
                  <div>{item.usuario}</div>
                  <div>{item.conselho}</div>
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <button id={"deleteprescricao" + item.id}
                    className="animated-red-button"
                    onClick={() => deletePrescription(item)}
                    style={{
                      marginRight: 0,
                      display: item.status == 0 ? 'flex' : 'none',
                    }}
                    title='EXCLUIR PRESCRIÇÃO'
                  >
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
                  <button id={"copyprescricao" + item.id}
                    className="animated-green-button"
                    onClick={() => {
                      document.getElementById("btnprescricao" + item.id).className = "blue-button";
                      copyPrescription(item);
                    }}
                    style={{ marginRight: 0, display: item.status == 0 ? 'none' : 'flex' }}
                    title="COPIAR PRESCRIÇÃO."
                  >
                    <img
                      alt=""
                      src={copiar}
                      style={{
                        margin: 10,
                        height: 30,
                        width: 30,
                      }}
                    ></img>
                  </button>
                  <button id={"signprescricao" + item.id}
                    className="animated-green-button"
                    onClick={() => signPrescription(item)}
                    style={{ marginRight: 0, display: item.status == 0 ? 'flex' : 'none' }}
                    title="SALVAR PRESCRIÇÃO."
                  >
                    <img
                      alt=""
                      src={salvar}
                      style={{
                        margin: 10,
                        height: 30,
                        width: 30,
                      }}
                    ></img>
                  </button>
                  <button
                    id={"printprescricao" + item.id}
                    className="animated-green-button"
                    onClick={() => viewPrintPrescricao(item)}
                    style={{ marginRight: 0, display: item.status == 1 && item.usuario == nomeusuario ? 'flex' : 'none' }}
                    title="IMPRIMIR PRESCRIÇÃO."
                  >
                    <img
                      alt=""
                      src={imprimir}
                      style={{
                        margin: 10,
                        height: 30,
                        width: 30,
                      }}
                    ></img>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }, [stateprontuario, listprescricoes]
  );

  // filtro para busca de itens de prescrição.
  function SearchItensPrescription() {
    return (
      <input
        className="input"
        autoComplete="off"
        placeholder="PROCURAR..."
        onFocus={(e) => (e.target.placeholder = '')}
        onBlur={(e) => (e.target.placeholder = "PROCURAR...")}
        onChange={() => filterItemPrescricao()}
        disabled={listprescricoes.length > 0 && idprescricao != '' ? false : true}
        style={{
          display: stateprontuario == 9 ? 'flex' : 'none',
          opacity: idprescricao !== '' ? 1 : 0.3,
          width: '55vw',
          zIndex: 3,
        }}
        type="text"
        id="inputFilterItemPrescricao"
        defaultValue={filteritemprescricao}
        maxLength={100}
      ></input>
    )
  }

  // cabeçalho da lista de itens prescritos.
  function CabecalhoPrescricao() {
    return (
      <div className="scrollheader" style={{ marginTop: 5 }}>
        <div className="rowheader" style={{
          display: stateprontuario == 9 ? 'flex' : 'none',
          paddingRight: 15, marginBottom: -5, marginTop: -5
        }}>
          < div className="header-button" style={{
            width: '100%', margin: 2.5
          }
          }> FÁRMACO</div >
          <div className="header-button" style={{ minWidth: 50, margin: 2.5 }}>QTDE</div>
          <div className="header-button" style={{ minWidth: 120, margin: 2.5 }}>VIA</div>
          <div className="header-button" style={{ minWidth: 120, margin: 2.5 }}>HORÁRIO</div>
        </div>
      </div>
    )
  }

  // lista de itens de uma prescrição.
  function ItensPrescricao() {
    return (
      <div
        className="scroll"
        id="LISTA DE ITENS PRESCRITOS"
        onMouseUp={() => scrollPosition()}
        onMouseOver={() => keepScroll()}
        onMouseOut={() => keepScroll()}
        onClick={() => keepScroll()}
        // onLoad={() => keepScroll()}
        style={{
          display: stateprontuario == 9 ? 'flex' : 'none', height: 'calc(65vh - 22px)', width: '100%', alignItems: 'center',
          borderTopRightRadius: 0, borderBottomRightRadius: 0
        }}
      >
        {listantibioticos.filter((item) => expanditem === 0 && item.status === 0 && item.idatendimento === idatendimento &&
          moment((item.datatermino).toString().substring(0, 8), 'DD/MM/YY') > moment().startOf('day').add(1, 'day').add(13, 'hours')).map((item) => (
            <p
              key={item.id}
              id="item da prescrição"
              className="row"
              disabled={item.status === 1 || statusprescricao === 1 ? true : false}
              style={{
                backgroundColor: '#52be80',
                flexDirection: 'row',
                justifyContent: 'space-between',
                opacity: item.status === 1 ? 0.3 : 1,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'flex-start', width: '100%' }}>
                <div
                  className="title2"
                  style={{
                    color: '#ffffff',
                  }}
                >{item.farmaco + ' - ' + item.qtde + 'U ' + item.via + ' ' + item.horario}
                </div>
                <div style={{ margin: 10, marginTop: 0, marginBottom: 5, color: '#ffffff', fontSize: 12, fontWeight: 'bold', alignSelf: 'flex-start', textAlign: 'left' }}>
                  {'PRÓXIMAS DOSES: ' + listcheckhorariosprescricoes.filter((valorhorario) => valorhorario.iditem === item.id).slice(0, 3).map((valorhorario) => ' ' + valorhorario.horario + '')}
                </div>
              </div>
              <div
                className="red-button"
                title="DIA DE ANTIBIÓTICO."
                style={{
                  display: item.grupo === 'ANTIBIOTICOS' && item.datatermino !== '' ? 'flex' : 'none',
                  margin: 5,
                }}>
                {moment().diff(moment(item.datainicio, 'DD/MM/YY'), 'days') + '/' + moment(item.datatermino, 'DD/MM/YY').diff(moment(item.datainicio, 'DD/MM/YY'), 'days')}
              </div>
              <button className="animated-red-button"
                onClick={() => suspendItem(item)}
                disabled={item.status === 1 ? true : false}
                title={item.status === 1 ? "" : "SUSPENDER ANTIBIÓTICO."}
                style={{
                  alignSelf: 'center',
                }}
              >
                <img
                  alt=""
                  src={suspender}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
            </p>
          ))}
        {arrayitemprescricao.map((item) => (
          <p
            key={item.id}
            id="item da prescrição"
            className="row"
            disabled={item.status === 1 || statusprescricao === 1 ? true : false}
            style={{
              display: item.grupo === 'ANTIBIOTICOS' && item.datatermino !== '' ? 'none' : 'flex', // hack para não exibir o antibiótico prescrito junto com o card de atb em uso. 
              flexDirection: 'column',
              opacity: item.status === 1 ? 0.3 : 1,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button
                className="hover-button"
                onClick={() => selectItem(item)}
                disabled={item.status === 1 || statusprescricao === 1 ? true : false}
                id={item.id}
                style={{
                  width: '100%',
                  margin: 2.5,
                  flexDirection: 'row',
                }}
              >
                <div
                  style={{
                    display: window.innerWidth > 1024 ? 'flex' : 'none',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    padding: 10,
                    width: '100%',
                  }}
                >{JSON.stringify(item.farmaco).length > 45 ? JSON.stringify(item.farmaco).substring(1, 45) + '...' : item.farmaco}
                </div>
                <div
                  style={{
                    display: window.innerWidth < 1025 ? 'flex' : 'none',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    padding: 10,
                    width: '100%',
                  }}
                >{JSON.stringify(item.farmaco).length > 30 ? JSON.stringify(item.farmaco).substring(1, 30) + '...' : item.farmaco}
                </div>
                <div
                  className="red-button"
                  title="DIA DE ANTIBIÓTICO."
                  style={{
                    display: item.grupo === 'ANTIBIOTICOS' && item.datatermino !== '' ? 'flex' : 'none',
                    margin: 5,
                  }}>
                  {moment(dataprescricao, 'DD/MM/YY').diff(moment(item.datainicio, 'DD/MM/YY'), 'days') + '/' + moment(item.datatermino, 'DD/MM/YY').diff(moment(item.datainicio, 'DD/MM/YY'), 'days')}
                </div>
              </button>
              <input
                className="input"
                disabled={item.status === 1 || statusprescricao === 1 ? true : false}
                defaultValue={item.qtde}
                autoComplete="off"
                placeholder="QTDE."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'QTDE.')}
                title="QUANTIDADE (ITEM)."
                style={{
                  display: item.grupo === 'CUIDADOS GERAIS' || item.grupo === 'OXIGENOTERAPIA' ? 'none' : 'flex',
                  width: 50,
                  margin: 2.5,
                  flexDirection: 'column',
                  boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
                }}
                onKeyUp={(e) => updateItemQtde(e.target.value, item)}
                type="number"
                id="inputItemQtde"
                maxLength={3}>
              </input>
              <button
                className="hover-button"
                disabled={item.status === 1 || statusprescricao === 1 ? true : false}
                onClick={() => clickItemVia(item)}
                style={{
                  display: item.grupo === 'CUIDADOS GERAIS' || item.grupo === 'OXIGENOTERAPIA' ? 'none' : 'flex',
                  width: 120,
                  minWidth: 120,
                  maxWidth: 120,
                  padding: 5,
                  margin: 2.5,
                  flexDirection: 'column',
                }}
              >
                <div>{item.via}</div>
              </button>
              <button
                className="hover-button"
                disabled={item.status === 1 || statusprescricao === 1 ? true : false}
                onClick={() => clickItemHorario(item)}
                style={{
                  width: 120,
                  minWidth: 120,
                  maxWidth: 120,
                  margin: 2.5,
                  flexDirection: 'column',
                  //opacity: item.id === iditem ? 1 : 0.6,
                }}
              >
                <div>{item.horario}</div>
              </button>
              <button className="animated-red-button"
                onClick={() => deleteItem(item)}
                disabled={item.status === 1 || statusprescricao === 1 ? true : false}
                style={{
                  display: statusprescricao === 0 ? 'flex' : 'none',
                }}
              >
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
              <button className="animated-red-button"
                onClick={() => suspendItem(item)}
                disabled={item.status === 1 ? true : false}
                title={item.status === 1 ? "" : "SUSPENDER ITEM"}
                style={{
                  marginRight: 0,
                  display: statusprescricao === 1 ? 'flex' : 'none',
                }}
              >
                <img
                  alt=""
                  src={suspender}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
            </div>
            <div style={{ display: expanditem === 1 && item.id === iditem ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="title2" style={{ fontSize: 14 }}>OBSERVAÇÕES</div>
                <textarea
                  id="inputObservacoes"
                  className="textarea"
                  disabled={item.status === 1 || statusprescricao === 1 ? true : false}
                  defaultValue={item.observacao}
                  onKeyUp={(e) => updateObservacoes(e.target.value, item)}
                  style={{
                    margin: 5, padding: 5,
                    width: 250,
                    height: 185,
                    justifyContent: 'flex-start',
                    boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
                  }}
                >
                </textarea>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingRight: 10 }}>
                <div className="title2" style={{ fontSize: 14 }}>COMPONENTES</div>
                <div
                  className="scroll"
                  disabled={item.status === 1 || statusprescricao === 1 ? true : false}
                  id="LISTA DE COMPONENTES"
                  style={{
                    margin: 5, padding: 5,
                    width: '100%',
                    height: 185,
                    boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {listviewcomponentes.filter((value) => value.iditem === iditem).map((item) => (
                    <div
                      key={item.id}
                      id="componente do item da prescrição"
                      className="row"
                      style={{ margin: 2.5, justifyContent: 'space-between', boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)' }}>
                      <div className="title2" style={{ width: '100%', justifyContent: 'left', alignSelf: 'center' }}>{item.componente}</div>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <input
                          className="input"
                          disabled={item.status === 1 ? true : false}
                          autoComplete="off"
                          placeholder="QTDE."
                          onFocus={(e) => (e.target.placeholder = '')}
                          onBlur={(e) => (e.target.placeholder = 'QTDE')}
                          onChange={(e) => updateComponenteQtde(e.target.value, item)}
                          style={{
                            display: item.grupo === 'CUIDADOS GERAIS' || item.grupo === 'OXIGENOTERAPIA' ? 'none' : 'flex',
                            width: 50,
                            margin: 2.5,
                            flexDirection: 'column',
                            boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.3)',
                          }}
                          defaultValue={item.quantidade}
                          type="number"
                          id="inputComponenteQtde"
                          title="QUANTIDADE (COMPONENTE)."
                          maxLength={3}>
                        </input>
                        <button className="animated-red-button"
                          onClick={() => deleteComponent(item)}
                          disabled={item.status === 1 ? true : false}
                          style={{ marginRight: 0 }}
                        >
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
                  ))}
                  <button className="green-button"
                    disabled={item.status === 1 ? true : false}
                    style={{ display: 'flex', alignSelf: 'flex-end', width: 50, marginTop: 6, marginRight: 5 }}
                  >
                    <img
                      alt=""
                      src={novo}
                      onClick={() => viewInsertComponente()}
                      style={{
                        margin: 10,
                        height: 30,
                        width: 30,
                      }}
                    ></img>
                  </button>
                </div>
              </div>
            </div>
            <div
              style={{
                display: expanditem === 1 && item.id === iditem && item.grupo === 'ANTIBIOTICOS' ? 'flex' : 'none',
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%'
              }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '100%', padding: 2.5, paddingTop: 0 }}>
                <div className="title2" style={{ fontSize: 14 }}>JUSTIFICATIVA</div>
                <textarea
                  id="inputJustificativa"
                  className="textarea"
                  disabled={item.status === 1 || statusprescricao === 1 ? true : false}
                  defaultValue={item.justificativa}
                  onKeyUp={(e) => updateJustificativa(e.target.value, item)}
                  style={{
                    margin: 5,
                    padding: 5,
                    width: '100%',
                    // width: '0.3 * (window.innerWidth)',
                    height: 100,
                    margin: 2.5,
                    justifyContent: 'flex-start',
                    boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
                  }}
                >
                </textarea>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: 5, marginTop: 0, width: 350 }}>
                  <div id="INICIO" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <div className="title2" style={{ fontSize: 14 }}>INÍCIO</div>
                    <MaskedInput
                      className="input"
                      disabled={item.status === 1 ? true : false}
                      autoComplete="off"
                      placeholder="?"
                      value={item.datainicio}
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = '?')}
                      onKeyUp={(e) => updateDataInicio(e.target.value, item)}
                      mask="11/11/11"
                      style={{
                        width: 100,
                        margin: 2.5,
                        flexDirection: 'column',
                        boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
                      }}
                      id="inputDataInicio"
                      title="DIA DE INÍCIO DO ANTIBIÓTICO."
                    >
                    </MaskedInput>
                  </div>
                  <div id="DIAS DE USO" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <div className="title2" style={{ fontSize: 14, alignSelf: 'center' }}>DIAS DE USO</div>
                    <input
                      className="input"
                      disabled={item.status === 1 ? true : false}
                      autoComplete="off"
                      placeholder="?"
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = '?')}
                      onKeyUp={(e) => updateDataTermino(e.target.value, item)}
                      style={{
                        alignSelf: 'center',
                        width: 50,
                        margin: 2.5,
                        boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
                      }}
                      defaultValue={item.datatermino === '' ? '?' : moment(item.datatermino, 'DD/MM/YY').diff(moment(item.datainicio, 'DD/MMYY'), 'days')}
                      type="number"
                      id="inputDiasAtb"
                      title="DIAS DE USO DO ANTIBIÓTICO."
                      maxLength={2}>
                    </input>
                  </div>
                  <div id="TÉRMINO" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <div className="title2" style={{ fontSize: 14 }}>TÉRMINO</div>
                    <button
                      className={moment(item.datatermino, 'DD/MM/YY').diff(moment(), 'days') < 1 || item.datatermino === '' ? "red-button" : "green-button"}
                      disabled={true}
                      value={item.datatermino}
                      style={{
                        width: 100,
                        boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
                      }}
                      id="inputDataInicio"
                      title="DIA DE TÉRMINO DO ANTIBIÓTICO."
                    >
                      {item.datatermino === '' ? '?' : item.datatermino}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </p>
        ))}
        <div className="title2"
          style={{
            color: '#ec7063',
            fontSize: 14,
            fontWeight: 'bold',
            margin: 5,
            marginTop: 10
          }}>
          {arrayoptionsitens.length === 1 && arrayitemprescricao.length > 0 && statusprescricao === 0 ? 'REPETIR ITEM...' :
            arrayoptionsitens.length > 0 && arrayitemprescricao.length > 0 && statusprescricao === 0 ? 'INSERIR ITEM...' :
              arrayoptionsitens.length > 0 && arrayitemprescricao.length < 1 && statusprescricao === 0 ? 'INSERIR ITEM...' : ''}
        </div>
        {arrayoptionsitens.map((item) => (
          <p id="LISTA DE OPÇÕES DE ITENS">
            <button className="green-button"
              onClick={() => insertItem(item)}
              style={{
                display: statusprescricao === 0 ? 'flex' : 'none',
                alignSelf: 'flex-end',
                width: 300,
                margin: 5,
                marginLeft: 0
              }}
            >
              {item.farmaco}
            </button>
          </p>
        ))}
      </div>
    )
  }

  // função que seleciona uma prescrição.
  const selectPrescricao = (item) => {
    setexpanditem(0);
    setfilteritemprescricao('');
    loadItensPrescricoes(item.id, '');
    loadAntibioticos();
    getHorarios();
    setdataprescricao(item.data);
    setstatusprescricao(item.status);
    setidprescricao(item.id);
  }

  // carregamento dos itens de antibióticos (todas as prescrições).
  const [listantibioticos, setlistantibioticos] = useState([]);
  const loadAntibioticos = () => {
    axios.get(html + "/allitensprescricao").then((response) => {
      setlistantibioticos(response.data);
    });
  }

  // carregando os itens de uma prescrição selecionada.
  const loadItensPrescricoes = (item, filteritemprescricao) => {
    axios.get(html + "/itensprescricao/'" + item + "'").then((response) => {
      setexpanditem(0);
      var x = [0, 1];
      x = response.data;
      setlistitensprescricoes(response.data);
      setarrayitemprescricao(x.filter(item => item.farmaco.includes(filteritemprescricao) === true));
      if (filteritemprescricao === '') {
        setarrayitemprescricao(x);
        setarrayoptionsitens([]);
      } else {
        setarrayoptionsitens(optionsitens.filter(item => item.farmaco.includes(filteritemprescricao) === true));
      }
      loadComponents();
      loadViewComponents();
    });
  }
  // carregamento usado para atualização dos itens de prescrição.
  const loadItensPrescricoesById = (idprescricao, iditem) => {
    axios.get(html + "/itensprescricao/'" + idprescricao + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistitensprescricoes(response.data);
      if (expanditem === 1) {
        setarrayitemprescricao(x.filter(value => value.id === iditem));
      } else {
        setarrayitemprescricao(x);
      }
      loadComponents();
      loadViewComponents();
    });
  }
  // seleção do item de prescrição.
  const [expanditem, setexpanditem] = useState(0);
  const [itemtodo, setitemtodo] = useState([]);
  const selectItem = (item) => {
    setitemtodo(item);
    setiditem(item.id);
    setgrupo(item.grupo);
    setfarmaco(item.farmaco);
    setqtdeitem(item.qtde);
    setvia(item.via);
    sethorario(item.horario);
    setobservacao(item.observacao);
    if (expanditem === 0) {
      setexpanditem(1);
      // setarrayitemprescricao(listitensprescricao.filter(x => x.id === item.id));
      keepScroll();
    } else {
      loadItensPrescricoes(idprescricao, filteritemprescricao);
      keepScroll();
    }
  }
  // deletando item da prescrição.
  const deleteItem = (item) => {
    axios.get(html + "/deleteitemprescricao/'" + item.id + "'");
    setfilteritemprescricao('');
    setTimeout(() => {
      loadItensPrescricoes(idprescricao, '');
    }, 1000);
    // EXCLUINDO A VISÃO DE COMPONENTES.
    axios.get(html + "/deleteallcomponenteview/" + item.id);
    // EXCLUINDO TODOS OS REGISTROS DE COMPONENTES PARA ESTE ITEM.
    axios.get(html + "/deleteitemcomponentesprescricao/" + item.id);
    // EXCLUINDO TODOS OS REGISTROS DE APRAZAMENTO PARA ESTE ITEM.
    axios.get(html + "/deletechecagemprescricao/" + item.id);
  }
  // suspendendo item da prescrição.
  const suspendItem = (item) => {
    var obj = {
      idprescricao: idprescricao,
      codigo: item.codigo,
      grupo: item.grupo,
      farmaco: item.farmaco,
      qtde: item.qtde,
      via: item.via,
      horario: item.horario,
      observacao: item.observacao,
      status: 1,
      justificativa: item.justificativa,
      datainicio: item.datainicio,
      datatermino: item.datatermino,
    };
    axios.post(html + "/updateitemprescricao/" + item.id, obj).then(() => {
      // excluindo os registros de componentes, a partir da data de suspensão.
      listcomponentes.filter((value) => value.iditem === item.id &&
        moment(value.horario, 'DD/MM/YY HH:mm') > moment()).map((item) => deleteComponents(item));

      // excluindo os registros de checagem, a partir da data de suspensão.
      listcheckhorariosprescricoes.filter((value) => value.iditem === item.id &&
        moment(value.horario, 'DD/MM/YY HH:mm') > moment()).map((item) => deleteCheck(item));
      setexpanditem(0);
      loadAntibioticos();
      loadItensPrescricoes(idprescricao, '');
    });
  }

  // deletando os resgistros de checagem referentes ao item selecionado.
  const deleteCheck = (item) => {
    axios.get(html + "/deletechecagemprescricao/" + item.iditem);
  }
  // deletando os resgistros de componentes referentes ao item selecionado.
  const deleteComponents = (item) => {
    axios.get(html + "/deletecomponenteprescricao/" + item.iditem);
  }

  // inserindo item na prescrição.
  const insertItem = (item) => {
    var obj = {
      idprescricao: idprescricao,
      idatendimento: idatendimento,
      codigo: item.codigo,
      grupo: item.grupo,
      farmaco: item.farmaco,
      qtde: item.qtde,
      via: item.via,
      horario: item.horario,
      observacao: item.observacao,
      status: 0,
      justificativa: item.justificativa,
      datainicio: moment().format('DD/MM/YY'),
      datatermino: item.datatermino,
    };
    axios.post(html + '/insertprescricaoitem', obj).then(() => {
      loadItensPrescricoes(idprescricao, '');
      // requisição do último registro de item salvo e resgate do seu iditem.
      var newiditem = 0;
      var newcodigoitem = '';
      axios.get(html + "/lastitem/" + idprescricao).then((response) => {
        var x = [0, 1];
        x = response.data;
        // retornando o id do item inserido.
        const arraylastiditem = x.map((item) => item.id);
        const lastiditem = arraylastiditem[0];
        newiditem = lastiditem;
        // retornando o código do item selecionado.
        const arraylastcodigoitem = x.map((item) => item.codigo);
        const lastcodigoitem = arraylastcodigoitem[0];
        newcodigoitem = lastcodigoitem;
        // INSERINDO APRAZAMENTOS.
        if (item.grupo !== "ANTIBIOTICOS") {
          var datatermino = moment().startOf('day').add(1, 'day').add(13, 'hours');
          aprazaItens(item, idprescricao, newiditem, datatermino);
          // INSERINDO COMPONENTES.
          setTimeout(() => {
            if (newcodigoitem === 'abd10ml') {
              abd10ml(newiditem, idprescricao);
            } else if (newcodigoitem === 'abd20ml') {
              abd20ml(newiditem, idprescricao);
            } else if (newcodigoitem === 'sf100ml') {
              sf100ml(newiditem, idprescricao);
            } else if (newcodigoitem === 'sf250ml') {
              sf250ml(newiditem, idprescricao);
            } else if (newcodigoitem === 'sf500ml') {
              sf500ml(newiditem, idprescricao);
            } else if (newcodigoitem === 'sgi100ml') {
              sgi100ml(newiditem, idprescricao);
            } else if (newcodigoitem === 'sgi250ml') {
              sgi250ml(newiditem, idprescricao);
            } else if (newcodigoitem === 'sgi500ml') {
              sgi500ml(newiditem, idprescricao);
            } else if (item.codigo === 'soroesquema') {
              soroesquema(item.id, idprescricao);
            } else {
            }
            setfilteritemprescricao('');
            loadItensPrescricoes(idprescricao, '');
            loadComponents();
            loadViewComponents();
          }, 3000);
        } else {
          // INSERINDO APRAZAMENTOS.
          /* O aprazamento dos antibióticos é feito padronizando-se o uso por 7 dias.*/
          var datatermino = moment().startOf('day').add(7, 'day').add(13, 'hours');
          aprazaItens(item, idprescricao, newiditem, datatermino);
          // INSERINDO COMPONENTES.
          setTimeout(() => {
            if (newcodigoitem === 'abd10ml') {
              abd10ml(newiditem, idprescricao);
            } else if (newcodigoitem === 'abd20ml') {
              abd20ml(newiditem, idprescricao);
            } else if (newcodigoitem === 'sf100ml') {
              sf100ml(newiditem, idprescricao);
            } else if (newcodigoitem === 'sf250ml') {
              sf250ml(newiditem, idprescricao);
            } else if (newcodigoitem === 'sf500ml') {
              sf500ml(newiditem, idprescricao);
            } else if (newcodigoitem === 'sgi100ml') {
              sgi100ml(newiditem, idprescricao);
            } else if (newcodigoitem === 'sgi250ml') {
              sgi250ml(newiditem, idprescricao);
            } else if (newcodigoitem === 'sgi500ml') {
              sgi500ml(newiditem, idprescricao);
            } else if (item.codigo === 'soroesquema') {
              soroesquema(item.id, idprescricao);
            } else {
            }
            setfilteritemprescricao('');
            // loadItensPrescricoes(idprescricao, '');
            loadComponents();
            loadViewComponents();
          }, 3000);
        }
      }, 1000);
    });
  }
  // pacotes de componentes.
  const arraycomponentes = [];
  const abd10ml = (iditem, idprescricao) => { // diluição de droga, em 10ml abd.
    addComponentKit(iditem, idprescricao, 'ÁGUA BIDESTILADA 10ML AMPOLA', 1);
    addComponentKit(iditem, idprescricao, 'SERINGA DESCARTÁVEL 10ML UNIDADE', 1);
    addComponentKit(iditem, idprescricao, 'AGULHA 40X12 UNIDADE', 1);
  }
  const abd20ml = (iditem, idprescricao) => { // diluição de droga, em 20ml abd.
    addComponentKit(iditem, idprescricao, 'ÁGUA BIDESTILADA 10ML AMPOLA', 2);
    addComponentKit(iditem, idprescricao, 'SERINGA DESCARTÁVEL 20ML UNIDADE', 1);
    addComponentKit(iditem, idprescricao, 'AGULHA 40X12 UNIDADE', 1);
  }
  const sf100ml = (iditem, idprescricao) => { // diluição de droga, em 20ml abd.
    addComponentKit(iditem, idprescricao, 'CLORETO DE SÓDIO 0.9% 100ML FRASCO', 1);
    addComponentKit(iditem, idprescricao, 'SERINGA DESCARTÁVEL 10ML UNIDADE', 1);
    addComponentKit(iditem, idprescricao, 'AGULHA 40X12 UNIDADE', 1);
  }
  const sf250ml = (iditem, idprescricao) => { // diluição de droga, em 20ml abd.
    addComponentKit(iditem, idprescricao, 'CLORETO DE SÓDIO 0.9% 250ML FRASCO', 1);
    addComponentKit(iditem, idprescricao, 'SERINGA DESCARTÁVEL 10ML UNIDADE', 1);
    addComponentKit(iditem, idprescricao, 'AGULHA 40X12 UNIDADE', 1);
  }
  const sf500ml = (iditem, idprescricao) => { // diluição de droga, em 20ml abd.
    addComponentKit(iditem, idprescricao, 'CLORETO DE SÓDIO 0.9% 500ML FRASCO', 1);
    addComponentKit(iditem, idprescricao, 'SERINGA DESCARTÁVEL 10ML UNIDADE', 1);
    addComponentKit(iditem, idprescricao, 'AGULHA 40X12 UNIDADE', 1);
  }
  const sgi100ml = (iditem, idprescricao) => { // diluição de droga, em 20ml abd.
    addComponentKit(iditem, idprescricao, 'SOLUÇÃO GLICOSADA 5% 100ML FRASCO', 1);
    addComponentKit(iditem, idprescricao, 'SERINGA DESCARTÁVEL 10ML UNIDADE', 1);
    addComponentKit(iditem, idprescricao, 'AGULHA 40X12 UNIDADE', 1);
  }
  const sgi250ml = (iditem, idprescricao) => { // diluição de droga, em 20ml abd.
    addComponentKit(iditem, idprescricao, 'SOLUÇÃO GLICOSADA 5% 250ML FRASCO', 1);
    addComponentKit(iditem, idprescricao, 'SERINGA DESCARTÁVEL 10ML UNIDADE', 1);
    addComponentKit(iditem, idprescricao, 'AGULHA 40X12 UNIDADE', 1);
  }
  const sgi500ml = (iditem, idprescricao) => { // diluição de droga, em 20ml abd.
    addComponentKit(iditem, idprescricao, 'SOLUÇÃO GLICOSADA 5% 500ML FRASCO', 1);
    addComponentKit(iditem, idprescricao, 'SERINGA DESCARTÁVEL 10ML UNIDADE', 1);
    addComponentKit(iditem, idprescricao, 'AGULHA 40X12 UNIDADE', 1);
  }
  const soroesquema = (iditem, idprescricao) => { // SF0.9% com SGH50%.
    addComponentKit(iditem, idprescricao, 'SOLUÇÃO GLICOSADA 50% 20ML FRASCO', 2);
    addComponentKit(iditem, idprescricao, 'SERINGA DESCARTÁVEL 10ML UNIDADE', 1);
    addComponentKit(iditem, idprescricao, 'AGULHA 40X12 UNIDADE', 1);
  }

  // classe para criação e registro dos componentes de prescrição.
  const addComponentKit = (iditem, idprescricao, componente, quantidade) => {
    // atualizando a lista de aprazamentos.
    var x = [0, 1];
    axios.get(html + "/checagemall").then((response) => {
      x = response.data;
      setlistcheckhorariosprescricoes(response.data);
      // filtrando os aprazamentos para o item inserido e acrescentando o novo componente para cada aprazamento.
      x.filter((item) => item.iditem === iditem).map((item) => insertComponent(iditem, idprescricao, componente, quantidade, item.horario));
    });
    // inserindo o componente view.
    var obj = {
      idprescricao: idprescricao,
      iditem: iditem,
      componente: componente,
      quantidade: quantidade,
    };
    axios.post(html + '/insertcomponenteview', obj).then(() => {
      loadItensPrescricoes(idprescricao, '');
    });
  }

  // inserindo prescrição.
  const insertPrescription = () => {
    // criando um novo registro de prescrição.
    setviewselectmodelprescription(0);
    var obj = {
      idatendimento: idatendimento,
      data: moment().format('DD/MM/YY HH:mm'),
      usuario: nomeusuario,
      conselho: conselhousuario,
      status: 0,
    };
    axios.post(html + '/insertprescricao', obj);
    setTimeout(() => {
      // resgatando o id da prescrição gerada.
      axios.get(html + "/lastprescricao/" + idatendimento).then((response) => {
        var x = [0, 1];
        x = response.data;
        const arraylastid = x.map((item) => item.id);
        const lastid = arraylastid[0];
        lastidprescricao = lastid;
        loadPrescricoes();
        setidprescricao(lastidprescricao);
        loadItensPrescricoes(lastidprescricao, filteritemprescricao);
        setTimeout(() => {
          // document.getElementById("inputFilterItemPrescricao").focus();
        }, 1000);
      });
    }, 1000);
  }
  // deletando prescrição.
  const deletePrescription = (item) => {
    setfilteritemprescricao('');
    // deletando a identificação da prescrição em sua lista.
    axios.get(html + "/deleteprescricao/" + item.id);
    // deletando os registros de itens associados à prescrição.
    axios.get(html + "/deleteallitemprescricao/" + item.id);
    // deletando os registros de componentes associados à prescrição.
    axios.get(html + "/deleteallcomponenteprescricao/" + item.id);
    // deletando os registros de checagens associados à prescrição.
    axios.get(html + "/deleteallchecagemprescricao/" + item.id);
    // deletando os registros de views dos componentes.
    axios.get(html + "/deletefullcomponenteview/" + item.id);
    // limpando a lista de itens.
    setarrayitemprescricao([]);
    setTimeout(() => {
      loadPrescricoes();
      setlistitensprescricoes([]);
      setarrayitemprescricao([]);
      setlistcomponentes([]);
      setidprescricao('');
    }, 1000);
  }

  // exibindo o componente de hemoderivados.
  const loadHemoderivados = () => {
    sethemoderivados(1);
    setviewselectmodelprescription(0);
    setpickdate1('NÃO');
  }

  // copiando modelos de prescrição.
  // prescrição ENFERMARIA.
  const loadPrescricaoEnfermaria = () => {
    setviewselectmodelprescription(0);
    // criando um novo registro de prescrição.
    var obj = {
      idatendimento: idatendimento,
      data: moment().format('DD/MM/YY HH:mm'),
      usuario: nomeusuario,
      conselho: especialidadeusuario,
      status: 0,
    };
    axios.post(html + '/insertprescricao', obj).then(() => {
      loadPrescricoes();
      // resgatando o id da prescrição gerada.
      axios.get(html + "/lastprescricao/" + idatendimento).then((response) => {
        var x = [0, 1];
        x = response.data;
        const arraylastid = x.map((item) => item.id);
        const lastid = arraylastid[0];
        lastidprescricao = lastid;
        setidprescricao(lastid);
      });
      // mapeando e copiando os itens da prescrição predefinida.
      axios.get(html + "/prescricaoenfermaria").then((response) => {
        var x = [0, 1];
        x = response.data;
        x.map((item) => copyItem(item));
        setTimeout(() => {
          fillStuff(lastidprescricao);
          loadItensPrescricoes(lastidprescricao, '');
        }, 3000);
      });
    });
  }

  // componente para seleção de PRESCRIÇÕES PREDEFINIDAS.
  function SelectModelPrescricao() {
    if (viewselectmodelprescription == 1) {
      return (
        <div className="menucover" onClick={(e) => { setviewselectmodelprescription(0); e.stopPropagation() }} style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer" style={{ padding: 20 }}>
            <div className="title2" style={{ fontSize: 16 }}>MODELOS DE PRESCRIÇÃO</div>
            <button
              onClick={(e) => { insertPrescription(); e.stopPropagation() }}
              className="blue-button"
              style={{
                width: '100%',
                margin: 5,
                padding: 5,
                flexDirection: 'column',
              }}
            >
              EM BRANCO
            </button>
            <button
              onClick={(e) => { loadPrescricaoEnfermaria(); e.stopPropagation() }}
              className="blue-button"
              style={{
                width: '100%',
                margin: 5,
                padding: 5,
                flexDirection: 'column',
              }}
            >
              ENFERMARIA
            </button>
            <button
              onClick={(e) => { loadHemoderivados(); e.stopPropagation() }}
              className="red-button"
              style={{
                width: '100%',
                margin: 5,
                padding: 5,
                flexDirection: 'column',
              }}
            >
              HEMODERIVADOS
            </button>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }

  // copiando todos os itens de uma prescrição.
  var lastidprescricao = 0;
  const copyPrescription = (item) => {
    // criando um novo registro de prescrição.
    var obj = {
      idatendimento: idatendimento,
      data: moment().format('DD/MM/YY HH:mm'),
      usuario: nomeusuario,
      conselho: conselhousuario,
      status: 0,
    };
    axios.post(html + '/insertprescricao', obj).then(() => {
      loadPrescricoes();
      // resgatando o id da prescrição gerada.
      axios.get(html + "/lastprescricao/" + idatendimento).then((response) => {
        var x = [0, 1];
        x = response.data;
        const lastid = x.map((item) => item.id)[0];
        lastidprescricao = lastid;
      });
      /* mapear cada item da prescrição a ser copiada e inserir na nova
      prescrição, recebendo-se o valor lastidprescrição. */
      axios.get(html + "/itensprescricao/'" + idprescricao + "'").then((response) => {
        var x = [0, 1];
        var y = [0, 1];
        x = response.data;
        // antibióticos NÃO podem ser copiados, por isso é utilizado o filtro abaixo.
        y = x.filter((item) => item.grupo !== 'ANTIBIOTICOS').map((item) => copyItem(item));
        setTimeout(() => {
          // após a cópia dos itens, estes devem receber seus aprazamentos e componentes.
          fillStuff(lastidprescricao);
          loadItensPrescricoes(lastidprescricao, '');
          document.getElementById("btnprescricao" + lastidprescricao).className = "red-button"
        }, 3000);
      });
    });
  }
  const copyItem = (item) => {
    var obj = {
      idatendimento: item.idatendimento,
      idprescricao: lastidprescricao, // destina adequadamente os itens para a nova prescrição.
      codigo: item.codigo,
      grupo: item.grupo,
      farmaco: item.farmaco,
      qtde: item.qtde,
      via: item.via,
      horario: item.horario,
      observacao: item.observacao,
      status: 0,
      justificativa: item.justificativa,
      datainicio: item.datainicio,
      datatermino: item.datatermino,
    };
    axios.post(html + '/insertprescricaoitem', obj);
  }
  // resgatando itens copiados na nova prescrição e inserindo seus respectivos componentes e aprazamentos.
  const fillStuff = (lastidprescricao) => {
    axios.get(html + "/itensprescricao/'" + lastidprescricao + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      // registrando aprazamentos e componentes para cada item da nova prescrição.
      x.map((item) => setStuff(item, lastidprescricao));
    });
  }
  const setStuff = (item, lastidprescricao) => {
    // INSERINDO APRAZAMENTOS.
    var datatermino = moment().startOf('day').add(1, 'day').add(13, 'hours');
    aprazaItens(item, lastidprescricao, item.id, datatermino);
    setTimeout(() => {
      // INSERINDO OS COMPONENTES.
      if (item.codigo === 'abd10ml') {
        abd10ml(item.id, lastidprescricao);
      } else if (item.codigo === 'abd20ml') {
        abd20ml(item.id, lastidprescricao);
      } else if (item.codigo === 'sf100ml') {
        sf100ml(item.id, lastidprescricao);
      } else if (item.codigo === 'sf250ml') {
        sf250ml(item.id, lastidprescricao);
      } else if (item.codigo === 'sf500ml') {
        sf500ml(item.id, lastidprescricao);
      } else if (item.codigo === 'sgi100ml') {
        sgi100ml(item.id, lastidprescricao);
      } else if (item.codigo === 'sgi250ml') {
        sgi250ml(item.id, lastidprescricao);
      } else if (item.codigo === 'sgi500ml') {
        sgi500ml(item.id, lastidprescricao);
      } else if (item.codigo === 'soroesquema') {
        soroesquema(item.id, lastidprescricao);
      } else {
      }
    }, 3000);
  }

  // definindo a data exata de salvamento da prescrição (assinatua digital), incluindo minutos (CHECK PRESCRIÇÕES).
  const [dataprescricao, setdataprescricao] = useState('');
  // assinando uma prescrição (alterando seu status para 1, impedindo assim a exclusão de itens e componentes).
  const [statusprescricao, setstatusprescricao] = useState(0);
  const signPrescription = (item) => {
    setdataprescricao(moment().format('DD/MM/YY HH:mm'));
    // a condição abaixo impede operações em prescrição vazia e a assinatura da prescrição quando um antibiótico não foi devidamente registrado (datade inicio não setada).
    //if (arrayitemprescricao.length > 0 && arrayitemprescricao.filter((item) => item.grupo == 'ANTIBIOTICOS' && item.datatermino == '').length < 1) {
    var obj = {
      idatendimento: idatendimento,
      data: dataprescricao,
      usuario: nomeusuario,
      conselho: conselhousuario,
      status: 1,
    };
    axios.post(html + "/updateprescricao/" + item.id, obj).then(() => {
      setstatusprescricao(1); // necessário para exibir a opção de suspensão dos itens.
      loadPrescricoes();
      loadItensPrescricoes(idprescricao, filteritemprescricao);
    });
    //} else {
    //toast(1, '#ec7063', arrayitemprescricao.lenght < 1 ? 'NÃO É POSSÍVEL SALVAR UMA PRESCRIÇÃO VAZIA.' : 'REGISTRO DE ANTIBIÓTICO INCOMPLETO.', 3000);
    //}
  }
  const suspendPrescription = (item) => {
    setdataprescricao(moment().format('DD/MM/YY HH:mm')); // impede operações em prescrição vazia.
    if (arrayitemprescricao.length > 0) {
      var obj = {
        idatendimento: idatendimento,
        data: dataprescricao,
        usuario: nomeusuario,
        conselho: conselhousuario,
        status: 2,
      };
      axios.post(html + "/updateprescricao/" + item.id, obj).then(() => {
        setstatusprescricao(1); // necessário para exibir a opção de suspensão dos itens.
        loadPrescricoes();
        loadItensPrescricoes(idprescricao, filteritemprescricao);
      });
    } else {
      toast(1, '#ec7063', 'NÃO É POSSÍVEL SUSPENDER UMA PRESCRIÇÃO VAZIA.', 3000);
    }
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
    }, time);
  }


  // carregando a lista de visão dos componentes para cada item da prescrição.
  const [listviewcomponentes, setlistviewcomponentes] = useState([]);
  const loadViewComponents = () => {
    axios.get(html + "/loadcomponenteview").then((response) => {
      setlistviewcomponentes(response.data);
    });
  }

  // carregando os componentes de todos os itens da prescrição.
  const [listcomponentes, setlistcomponentes] = useState([]);
  const loadComponents = () => {
    axios.get(html + "/componentesprescricao").then((response) => { // ATENÇÃO: melhor filtrar por id prescrição.
      setlistcomponentes(response.data);
    });
  }
  // filtrando os componentes para cada item da prescrição.
  function FilterComponents(value) {
    var x = [];
    x = listcomponentes.filter(item => item.iditem === value);
    return x;
  }
  // funções e componentes que tratam da seleção de um novo componente ao item de prescrição.
  // abrindo o popup para inserção de um novo componente.
  const viewInsertComponente = () => {
    loadOptionsComponentes();
    setviewcomponentselector(1)
    setTimeout(() => {
      setviewinsertcomponent(1);
    }, 1000);
  }
  // carregando a lista com todas as opções de componentes disponíveis no sistema.
  const [optionscomponentes, setoptionscomponentes] = useState();
  const loadOptionsComponentes = () => {
    axios.get(html + '/optionsitens').then((response) => {
      setoptionscomponentes(response.data);
      setarrayfiltercomponente(response.data);
    });
  }
  // filtrando um novo componente para seleção.
  const [arrayfiltercomponente, setarrayfiltercomponente] = useState(optionscomponentes);
  const [filtercomponente, setfiltercomponente] = useState('');
  var searchcomponente = '';
  var timeout = null;
  const filterComponente = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterComponente").focus();
    searchcomponente = document.getElementById("inputFilterComponente").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchcomponente === '') {
        setarrayfiltercomponente([]);
        document.getElementById("inputFilterComponente").value = '';
        document.getElementById("inputFilterComponente").focus();
      } else {
        setfiltercomponente(document.getElementById("inputFilterComponente").value.toUpperCase());
        setarrayfiltercomponente(optionscomponentes.filter(item => item.farmaco.includes(searchcomponente) === true));
        document.getElementById("inputFilterComponente").value = searchcomponente;
        document.getElementById("inputFilterComponente").focus();
      }
    }, 500);
  }
  // selecionando o novo componente.
  const [viewcomponentselector, setviewcomponentselector] = useState(1);
  const getComponent = (item) => {
    setcodigo(item.codigo);
    setcomponente(item.farmaco);
    setviewcomponentselector(2);
  }
  // adicionando o novo componente para cada registro de aprazamento de um item da prescrição.
  const addComponent = () => {
    var quantidade = document.getElementById("inputQuantidade").value;
    if (quantidade > 0) {
      // atualizar lista de aprazamentos, pois o usuário pode ter acabado de criar o item e seus aprazamentos ainda não foram listados.
      axios.get(html + "/checagemall").then((response) => {
        var x = [0, 1];
        x = response.data;
        // filtrando os aprazamentos para o item inserido e acrescentando o novo componente para cada aprazamento.
        x.filter((item) => item.iditem === iditem).map((item) => insertComponent(iditem, idprescricao, componente, quantidade, item.horario));
        setviewinsertcomponent(0);
        // inserindo o componente view.
        var obj = {
          iditem: iditem,
          componente: componente,
          quantidade: quantidade,
        };
        axios.post(html + '/insertcomponenteview', obj).then(() => {
          setviewinsertcomponent(0);
          loadViewComponents();
        });
      });
    } else {
      toast(1, '#ec7063', 'CAMPO NÃO PREENCHIDO.', 3000);
    }
  }
  const insertComponent = (iditem, idprescricao, componente, quantidade, horario) => {
    var obj = {
      iditem: iditem,
      idprescricao: idprescricao,
      componente: componente,
      quantidade: quantidade,
      horario: horario,
    };
    axios.post(html + '/insertprescricaocomponente', obj).then(() => {
      //setviewinsertcomponent(0);
      //loadItensPrescricoes(idprescricao, '');
    });
  }

  // atualizando a quantidade de um item da prescrição.
  const updateItemQtde = (value, item) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      // setarrayitemprescricao(listitensprescricao.filter(x => x.id === item.id));
      var obj = {
        id: item.id,
        idatendimento: item.idatendimento,
        idprescricao: item.idprescricao,
        codigo: item.codigo,
        grupo: item.grupo,
        farmaco: item.farmaco,
        qtde: value < 1 || value > 100 ? 1 : value,
        via: item.via,
        horario: item.horario,
        observacao: item.observacao,
        status: 0,
        justificativa: item.justificativa,
        datainicio: item.datainicio,
        datatermino: item.datatermino,
      };
      axios.post(html + '/updateitemprescricao/' + item.id, obj).then(() => {
        // carregando a lista de itens prescritos.
        loadItensPrescricoes(idprescricao, '');
        keepScroll('LISTA DE ITENS PRESCRITOS');
        axios.get(html + "/allitensprescricao").then((response) => {
          var x = [0, 1];
          x = response.data;
          const horario = x.filter((valor) => valor.id === item.id).map((item) => item.horario);
          const farmaco = x.filter((valor) => valor.id === item.id).map((item) => item.farmaco);
          const grupo = x.filter((valor) => valor.id === item.id).map((item) => item.grupo);
          const qtde = x.filter((valor) => valor.id === item.id).map((item) => item.qtde);
          const via = x.filter((valor) => valor.id === item.id).map((item) => item.via);
          const codigo = x.filter((valor) => valor.id === item.id).map((item) => item.codigo);
          if (grupo !== "ANTIBIOTICOS") {
            var datatermino = moment().startOf('day').add(1, 'day').add(13, 'hours');
            // excluindo aprazamento prévio, caso existente.
            axios.get(html + "/deletechecagemprescricao/" + item.id).then(() => {
              // inserindo os novos aprazamentos.
              aprazaUpdateHorario(horario, farmaco, grupo, qtde, via, idprescricao, item.id, datatermino);
            });
          } else {
            // INSERINDO APRAZAMENTOS.
            /* O aprazamento dos antibióticos é feito padronizando-se o uso por 7 dias.*/
            var datatermino = moment().startOf('day').add(7, 'day').add(13, 'hours');
            aprazaUpdateHorario(horario, farmaco, grupo, qtde, via, idprescricao, itemid, datatermino);
          }
        });
      });
    }, 1000);
  }

  // atualizando a via de administração de um item da prescrição.
  const [itemid, setitemid] = useState(0);
  const [itemcodigo, setitemcodigo] = useState(0);
  const [itemgrupo, setitemgrupo] = useState(0);
  const [itemfarmaco, setitemfarmaco] = useState(0);
  const [itemqtde, setitemqtde] = useState(0);
  const [itemvia, setitemvia] = useState(0);
  const [itemhorario, setitemhorario] = useState(0);
  const [itemobservacao, setitemobservacao] = useState(0);
  const clickItemVia = (item) => {
    // setarrayitemprescricao(listitensprescricao.filter(x => x.id === item.id));
    setshowitemviaselector(1);
    // loadItensPrescricoesById(idprescricao, item.id);
    setitemid(item.id);
    setitemcodigo(item.codigo);
    setitemgrupo(item.grupo);
    setitemfarmaco(item.farmaco);
    setitemqtde(item.qtde);
    setitemvia(item.via);
    setitemhorario(item.horario);
    setitemobservacao(item.observacao);
  }
  const updateItemVia = (item) => {
    var obj = {
      id: itemid,
      idatendimento: idatendimento,
      idprescricao: idprescricao,
      codigo: itemcodigo,
      grupo: itemgrupo,
      farmaco: itemfarmaco,
      qtde: itemqtde,
      via: item,
      horario: itemhorario,
      observacao: itemobservacao,
    };
    axios.post(html + '/updateitemprescricao/' + itemid, obj).then(() => {
      setshowitemviaselector(0);
      loadItensPrescricoesById(idprescricao, itemid);
      keepScroll();
    });
  }
  const clickItemHorario = (item) => {
    // setarrayitemprescricao(listitensprescricao.filter(x => x.id === item.id));
    setshowitemhorarioselector(1);
    // loadItensPrescricoesById(idprescricao, item.id);
    setitemid(item.id);
    setitemcodigo(item.codigo);
    setitemgrupo(item.grupo);
    setitemfarmaco(item.farmaco);
    setitemqtde(item.qtde);
    setitemvia(item.via);
    setitemhorario(item.horario);
    setitemobservacao(item.observacao);
  }
  const updateItemHorario = (item) => {
    var obj = {
      id: itemid,
      idatendimento: idatendimento,
      idprescricao: idprescricao,
      codigo: itemcodigo,
      grupo: itemgrupo,
      farmaco: itemfarmaco,
      qtde: itemqtde,
      via: itemvia,
      horario: item,
      observacao: itemobservacao,
    };
    axios.post(html + '/updateitemprescricao/' + itemid, obj).then(() => {
      setshowitemhorarioselector(0);
      keepScroll();
      // excluindo view dos componentes.
      axios.get(html + "/deleteallcomponenteview/" + itemid);
      // carregando a lista de itens prescritos.
      axios.get(html + "/allitensprescricao").then((response) => {
        var x = [0, 1];
        x = response.data;
        const horario = x.filter((item) => item.id === itemid).map((item) => item.horario);
        const farmaco = x.filter((item) => item.id === itemid).map((item) => item.farmaco);
        const grupo = x.filter((item) => item.id === itemid).map((item) => item.grupo);
        const qtde = x.filter((item) => item.id === itemid).map((item) => item.qtde);
        const via = x.filter((item) => item.id === itemid).map((item) => item.via);
        const codigo = x.filter((item) => item.id === itemid).map((item) => item.codigo);
        if (grupo !== "ANTIBIOTICOS") {
          var datatermino = moment().startOf('day').add(1, 'day').add(13, 'hours');
          // excluindo aprazamento prévio, caso existente.
          axios.get(html + "/deletechecagemprescricao/" + itemid).then(() => {
            // inserindo os novos aprazamentos.
            aprazaUpdateHorario(horario, farmaco, grupo, qtde, via, idprescricao, itemid, datatermino);
          });
          // INSERINDO COMPONENTES.
          setTimeout(() => {
            // excluindo componentes prévios.
            axios.get(html + "/deleteitemcomponentesprescricao/" + itemid).then(() => {
              // inserindo os componentes atualizados.
              if (codigo == 'abd10ml') {
                abd10ml(itemid, idprescricao);
              } else if (codigo == 'abd20ml') {
                abd20ml(itemid, idprescricao);
              } else if (codigo == 'sf100ml') {
                sf100ml(itemid, idprescricao);
              } else if (codigo == 'sf250ml') {
                sf250ml(itemid, idprescricao);
              } else if (codigo == 'sf500ml') {
                sf500ml(itemid, idprescricao);
              } else if (codigo == 'sgi100ml') {
                sgi100ml(itemid, idprescricao);
              } else if (codigo == 'sgi250ml') {
                sgi250ml(itemid, idprescricao);
              } else if (codigo == 'sgi500ml') {
                sgi500ml(itemid, idprescricao);
              } else if (codigo == 'soroesquema') {
                soroesquema(itemid, idprescricao);
              } else {
              }
              setfilteritemprescricao('');
              loadItensPrescricoes(idprescricao, '');
              loadComponents();
              loadViewComponents();
            });
          }, 3000);
        } else {
          // INSERINDO APRAZAMENTOS.
          /* O aprazamento dos antibióticos é feito padronizando-se o uso por 7 dias.*/
          var datatermino = moment().startOf('day').add(7, 'day').add(13, 'hours');
          aprazaUpdateHorario(horario, farmaco, grupo, qtde, via, idprescricao, itemid, datatermino);
          // INSERINDO COMPONENTES.
          setTimeout(() => {
            if (codigo == 'abd10ml') {
              abd10ml(itemid, idprescricao);
            } else if (codigo == 'abd20ml') {
              abd20ml(itemid, idprescricao);
            } else if (codigo == 'sf100ml') {
              sf100ml(itemid, idprescricao);
            } else if (codigo == 'sf250ml') {
              sf250ml(itemid, idprescricao);
            } else if (codigo == 'sf500ml') {
              sf500ml(itemid, idprescricao);
            } else if (codigo == 'sgi100ml') {
              sgi100ml(itemid, idprescricao);
            } else if (codigo == 'sgi250ml') {
              sgi250ml(itemid, idprescricao);
            } else if (codigo == 'sgi500ml') {
              sgi500ml(itemid, idprescricao);
            } else if (codigo == 'soroesquema') {
              soroesquema(itemid, idprescricao);
            } else {
            }
            setfilteritemprescricao('');
            loadItensPrescricoes(idprescricao, '');
            loadComponents();
            loadViewComponents();
          }, 3000);
        }
      });
    });
  }

  // inserindo horários de checagem dos itens de prescrição.
  const insertCheckPrescricao = (idpaciente, idatendimento, idprescricao, iditem, farmaco, grupo, qtde, via, prazo, horario) => {
    var obj = {
      idpaciente: idpaciente,
      idatendimento: idatendimento,
      idprescricao: idprescricao,
      iditem: iditem,
      farmaco: farmaco,
      grupo: grupo,
      qtde: qtde,
      via: via,
      prazo: prazo,
      horario: horario,
      checado: 0,
    };
    axios.post(html + '/insertchecagemprescricao', obj);
  }

  // renderização do seletor de opções para via de adminitração de um item.
  const [showitemviaselector, setshowitemviaselector] = useState(0);
  var arrayitemvia = ['VO', 'IV', 'IM', 'SC', 'INTRADÉRMICA', 'HIPODERMÓCLISE', 'INTRATECAL'];
  function ShowItemViaSelector() {
    if (showitemviaselector === 1) {
      return (
        <div className="menucover"
          style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
          onClick={() => { setshowitemviaselector(0) }}
        >
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2">VIA DE ADMINISTRAÇÃO</div>
            <div
              className="scroll"
              id="LISTA DE VIAS DE ADMINISTRAÇÃO DO ITEM DA PRESCRIÇÃO"
              style={{
                height: 250,
              }}
            >
              {arrayitemvia.map((item) => (
                <div
                  key={item.id}
                  onClick={(e) => { updateItemVia(item); e.stopPropagation() }}
                  id="item da lista"
                  className="blue-button"
                  style={{ width: 200 }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div >
      );
    } else {
      return null;
    }
  }

  // renderização do seletor de opções para horários de adminitração de um item.
  const [showitemhorarioselector, setshowitemhorarioselector] = useState(0);
  var arrayitemhorario = ['1/1H', '2/2H', '3/3H', '4/4H', '6/6H', '8/8H', '12/12H', '24/24H', '48/48H', '72/72H', 'ACM', 'SN', 'AGORA'];
  function ShowItemHorariosSelector() {
    if (showitemhorarioselector === 1) {
      return (
        <div className="menucover"
          style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
          onClick={() => { setshowitemhorarioselector(0) }}
        >
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2">HORÁRIOS DE ADMINISTRAÇÃO</div>
            <div
              className="scroll"
              id="LISTA DE HORÁRIOS PARA ADMINISTRAÇÃO DO ITEM DA PRESCRIÇÃO"
              style={{
                justifyContent: 'flex-start',
                margin: 5,
                marginTop: 5,
                padding: 0,
                paddingRight: 5,
                height: 250,
              }}
            >
              {arrayitemhorario.map((item) => (
                <div
                  key={item.id}
                  onClick={(e) => { updateItemHorario(item); e.stopPropagation() }}
                  id="item da lista"
                  className="blue-button"
                  style={{ width: 200 }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  // atualizando as observações relativas ao item da prescrição.
  const updateObservacoes = (value, item) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      var obj = {
        id: item.id,
        idatendimento: item.idatendimento,
        idprescricao: item.idprescricao,
        codigo: item.codigo,
        grupo: item.grupo,
        farmaco: item.farmaco,
        qtde: item.qtde,
        via: item.via,
        horario: item.horario,
        observacao: value.toUpperCase(),
      };
      axios.post(html + '/updateitemprescricao/' + item.id, obj);
      setTimeout(() => {
        loadItensPrescricoesById(idprescricao, item.id);
      }, 1000);
    }, 1000);
  }
  // atualizando a justificativa relativa ao item da prescrição (aplicável aos antibióticos).
  const updateJustificativa = (value, item) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      //document.getElementById("PRINCIPAL").style.pointerEvents = 'none';
      var obj = {
        id: item.id,
        idatendimento: item.idatendimento,
        idprescricao: item.idprescricao,
        codigo: item.codigo,
        grupo: item.grupo,
        farmaco: item.farmaco,
        qtde: item.qtde,
        via: item.via,
        horario: item.horario,
        observacao: item.observacao,
        status: item.status,
        justificativa: value.toUpperCase(),
        datainicio: item.datainicio,
        datatermino: item.datatermino,
      };
      axios.post(html + '/updateitemprescricao/' + item.id, obj);
      setTimeout(() => {
        loadItensPrescricoesById(idprescricao, item.id);
      }, 1000);
    }, 1000);
  }
  // atualizando a data de início da administração do item da prescrição (aplicável aos antibióticos).
  const [datainicioatb, setdatainicioatb] = useState('')
  const updateDataInicio = (value, item) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      //document.getElementById("PRINCIPAL").style.pointerEvents = 'none';
      setdatainicioatb(value);
      var obj = {
        id: item.id,
        idatendimento: item.idatendimento,
        idprescricao: item.idprescricao,
        codigo: item.codigo,
        grupo: item.grupo,
        farmaco: item.farmaco,
        qtde: item.qtde,
        via: item.via,
        horario: item.horario,
        observacao: item.observacao,
        status: item.status,
        justificativa: item.justificativa,
        datainicio: value,
        datatermino: item.datatermino,
      };
      axios.post(html + '/updateitemprescricao/' + item.id, obj);
      setTimeout(() => {
        loadItensPrescricoesById(idprescricao, item.id);
      }, 1000);
    }, 3000);
  }
  // atualizando a data de término da administração do item da prescrição (aplicável aos antibióticos).
  const [diasatb, setdiasatb] = useState();
  const updateDataTermino = (value, item) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      // excluindo aprazamento prévio, caso existente.
      axios.get(html + "/deletechecagemprescricao/" + item.id);
      // excluindo componentes prévios.
      axios.get(html + "/deleteitemcomponentesprescricao/" + item.id);
      // excluindo view dos componentes.
      axios.get(html + "/deleteallcomponenteview/" + item.id);
      var obj = {
        id: item.id,
        idatendimento: item.idatendimento,
        idprescricao: item.idprescricao,
        codigo: item.codigo,
        grupo: item.grupo,
        farmaco: item.farmaco,
        qtde: item.qtde,
        via: item.via,
        horario: item.horario,
        observacao: item.observacao,
        status: item.status,
        justificativa: item.justificativa,
        datainicio: item.datainicio,
        datatermino: moment(item.datainicio, "DD/MM/YY").add(value, 'days').format('DD/MM/YY'),
      };
      axios.post(html + '/updateitemprescricao/' + item.id, obj).then(() => {
        var datatermino = moment(item.datainicio, "DD/MM/YY").add(value, 'days').format('DD/MM/YY');
        loadItensPrescricoes(idprescricao, '');
        loadAntibioticos();
        setTimeout(() => {
          // registrando horários para checagem.
          aprazaAtb(item, datatermino);
          // registrando componentes.
          setTimeout(() => {
            if (item.codigo === 'abd10ml') {
              abd10ml(item.id, idprescricao);
            } else if (item.codigo === 'abd20ml') {
              abd20ml(item.id, idprescricao);
            } else if (item.codigo === 'sf100ml') {
              sf100ml(item.id, idprescricao);
            } else if (item.codigo === 'sf250ml') {
              sf250ml(item.id, idprescricao);
            } else if (item.codigo === 'sf500ml') {
              sf500ml(item.id, idprescricao);
            } else if (item.codigo === 'sgi100ml') {
              sgi100ml(item.id, idprescricao);
            } else if (item.codigo === 'sgi250ml') {
              sgi250ml(item.id, idprescricao);
            } else if (item.codigo === 'sgi500ml') {
              sgi500ml(item.id, idprescricao);
            } else if (item.codigo === 'soroesquema') {
              soroesquema(item.id, idprescricao);
            } else {
            }
            setfilteritemprescricao('');
            loadItensPrescricoes(idprescricao, '');
            loadComponents();
            loadViewComponents();
          }, 3000);
        }, 1000);
      });
    }, 1000);
  }

  // aprazamento dos antibióticos.
  const aprazaAtb = (item, datatermino) => {
    var adddate = moment();
    if (item.horario === '1/1H') {
      // horário padrão para 2/2h.
      adddate = moment(moment().format('DD/MM/YY') + ' 13:00', 'DD/MM/YY HH:mm');
      while (moment(datatermino, 'DD/MM/YY') > adddate) {
        insertCheckPrescricao(idpaciente, item.idatendimento, item.idprescricao, item.id, item.farmaco, item.grupo, item.qtde, item.via, item.horario, moment(adddate).format('DD/MM/YY HH:mm'));
        adddate = adddate.add(1, 'hours');
      }
    } else if (item.horario === '2/2H') {
      // horário padrão para 2/2h.
      adddate = moment(moment().format('DD/MM/YY') + ' 14:00', 'DD/MM/YY HH:mm');
      while (moment(datatermino, 'DD/MM/YY') > adddate) {
        insertCheckPrescricao(idpaciente, item.idatendimento, item.idprescricao, item.id, item.farmaco, item.grupo, item.qtde, item.via, item.horario, moment(adddate).format('DD/MM/YY HH:mm'));
        adddate = adddate.add(2, 'hours');
      }
    } else if (item.horario === '4/4H') {
      // horário padrão para 4/4h.
      adddate = moment(moment().format('DD/MM/YY') + ' 14:00', 'DD/MM/YY HH:mm');
      while (moment(datatermino, 'DD/MM/YY') > adddate) {
        insertCheckPrescricao(idpaciente, item.idatendimento, item.idprescricao, item.id, item.farmaco, item.grupo, item.qtde, item.via, item.horario, moment(adddate).format('DD/MM/YY HH:mm'));
        adddate = adddate.add(4, 'hours');
      }
    } else if (item.horario === '6/6H') {
      // horário padrão para 6/6h.
      adddate = moment(moment().format('DD/MM/YY') + ' 18:00', 'DD/MM/YY HH:mm');
      while (moment(datatermino, 'DD/MM/YY') > adddate) {
        insertCheckPrescricao(idpaciente, item.idatendimento, item.idprescricao, item.id, item.farmaco, item.grupo, item.qtde, item.via, item.horario, moment(adddate).format('DD/MM/YY HH:mm'));
        adddate = adddate.add(6, 'hours');
      }
    } else if (item.horario === '8/8H') {
      // horário padrão para 8/8h.
      adddate = moment(moment().format('DD/MM/YY') + ' 16:00', 'DD/MM/YY HH:mm');
      while (moment(datatermino, 'DD/MM/YY') > adddate) {
        insertCheckPrescricao(idpaciente, item.idatendimento, item.idprescricao, item.id, item.farmaco, item.grupo, item.qtde, item.via, item.horario, moment(adddate).format('DD/MM/YY HH:mm'));
        adddate = adddate.add(8, 'hours');
      }
    } else if (item.horario === '12/12H') {
      // horário padrão para 12/12h.
      adddate = moment(moment().format('DD/MM/YY') + ' 22:00', 'DD/MM/YY HH:mm');
      while (moment(datatermino, 'DD/MM/YY') > adddate) {
        insertCheckPrescricao(idpaciente, item.idatendimento, item.idprescricao, item.id, item.farmaco, item.grupo, item.qtde, item.via, item.horario, moment(adddate).format('DD/MM/YY HH:mm'));
        adddate = adddate.add(12, 'hours');
      }
    } else if (item.horario === '24/24H') {
      // horário padrão para 24/24h.
      adddate = moment(moment().add(1, 'day').format('DD/MM/YY') + ' 10:00', 'DD/MM/YY HH:mm');
      while (moment(datatermino, 'DD/MM/YY') > adddate) {
        insertCheckPrescricao(idpaciente, item.idatendimento, item.idprescricao, item.id, item.farmaco, item.grupo, item.qtde, item.via, item.horario, moment(adddate).format('DD/MM/YY HH:mm'));
        adddate = adddate.add(24, 'hours');
      }
    } else if (item.horario === 'AGORA') {
      // agora.
      insertCheckPrescricao(idpaciente, item.idatendimento, item.idprescricao, item.id, item.farmaco, item.grupo, item.qtde, item.via, item.horario, moment().format('DD/MM/YY HH:mm'));
    } else if (item.horario === 'ACM') {
      // acm.
      insertCheckPrescricao(idpaciente, item.idatendimento, item.idprescricao, item.id, item.farmaco, item.grupo, item.qtde, item.via, item.horario, 'ACM');
      insertCheckPrescricao(idpaciente, item.idatendimento, item.idprescricao, item.id, item.farmaco, item.grupo, item.qtde, item.via, item.horario, 'ACM');
      insertCheckPrescricao(idpaciente, item.idatendimento, item.idprescricao, item.id, item.farmaco, item.grupo, item.qtde, item.via, item.horario, 'ACM');
      insertCheckPrescricao(idpaciente, item.idatendimento, item.idprescricao, item.id, item.farmaco, item.grupo, item.qtde, item.via, item.horario, 'ACM');
      insertCheckPrescricao(idpaciente, item.idatendimento, item.idprescricao, item.id, item.farmaco, item.grupo, item.qtde, item.via, item.horario, 'ACM');
    }
    else {
      // INSERIR DEMAIS APRAZAMENTOS...
    }
  }

  // aprazamento dos demais itens de prescrição.
  const aprazaItens = (item, idprescricao, itemid, datatermino) => {
    var adddate = moment();
    if (item.horario === '1/1H') {
      // horário padrão para 1/1h.
      adddate = moment(moment().format('DD/MM/YY') + ' 13:00', 'DD/MM/YY HH:mm');
      while (moment(datatermino, 'DD/MM/YY') > adddate) {
        insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, item.farmaco, item.grupo, item.qtde, item.via, item.horario, moment(adddate).format('DD/MM/YY HH:mm'));
        adddate = adddate.add(1, 'hour');
      }
    } else if (item.horario === '2/2H') {
      // horário padrão para 2/2h.
      adddate = moment(moment().format('DD/MM/YY') + ' 14:00', 'DD/MM/YY HH:mm');
      while (moment(datatermino, 'DD/MM/YY') > adddate) {
        insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, item.farmaco, item.grupo, item.qtde, item.via, item.horario, moment(adddate).format('DD/MM/YY HH:mm'));
        adddate = adddate.add(2, 'hours');
      }
    } else if (item.horario === '4/4H') {
      // horário padrão para 4/4h.
      adddate = moment(moment().format('DD/MM/YY') + ' 14:00', 'DD/MM/YY HH:mm');
      while (moment(datatermino, 'DD/MM/YY') > adddate) {
        insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, item.farmaco, item.grupo, item.qtde, item.via, item.horario, moment(adddate).format('DD/MM/YY HH:mm'));
        adddate = adddate.add(4, 'hours');
      }
    } else if (item.horario === '6/6H') {
      // horário padrão para 6/6h.
      adddate = moment(moment().format('DD/MM/YY') + ' 18:00', 'DD/MM/YY HH:mm');
      while (moment(datatermino, 'DD/MM/YY') > adddate) {
        insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, item.farmaco, item.grupo, item.qtde, item.via, item.horario, moment(adddate).format('DD/MM/YY HH:mm'));
        adddate = adddate.add(6, 'hours');
      }
    } else if (item.horario === '8/8H') {
      // horário padrão para 8/8h.
      adddate = moment(moment().format('DD/MM/YY') + ' 16:00', 'DD/MM/YY HH:mm');
      while (moment(datatermino, 'DD/MM/YY') > adddate) {
        insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, item.farmaco, item.grupo, item.qtde, item.via, item.horario, moment(adddate).format('DD/MM/YY HH:mm'));
        adddate = adddate.add(8, 'hours');
      }
    } else if (item.horario === '12/12H') {
      // horário padrão para 12/12h.
      adddate = moment(moment().format('DD/MM/YY') + ' 22:00', 'DD/MM/YY HH:mm');
      while (moment(datatermino, 'DD/MM/YY') > adddate) {
        insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, item.farmaco, item.grupo, item.qtde, item.via, item.horario, moment(adddate).format('DD/MM/YY HH:mm'));
        adddate = adddate.add(12, 'hours');
      }
    } else if (item.horario === '24/24H') {
      // horário padrão para 24/24h.
      adddate = moment(moment().add(1, 'day').format('DD/MM/YY') + ' 10:00', 'DD/MM/YY HH:mm');
      while (moment(datatermino, 'DD/MM/YY') > adddate) {
        insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, item.farmaco, item.grupo, item.qtde, item.via, item.horario, moment(adddate).format('DD/MM/YY HH:mm'));
        adddate = adddate.add(24, 'hours');
      }
    } else if (item.horario === 'AGORA') {
      // agora.
      insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, item.farmaco, item.grupo, item.qtde, item.via, item.horario, moment().format('DD/MM/YY HH:mm'));
    } else if (item.horario === 'ACM') {
      // acm.
      insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, item.farmaco, item.grupo, item.qtde, item.via, 'ACM');
      insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, item.farmaco, item.grupo, item.qtde, item.via, 'ACM');
      insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, item.farmaco, item.grupo, item.qtde, item.via, 'ACM');
      insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, item.farmaco, item.grupo, item.qtde, item.via, 'ACM');
      insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, item.farmaco, item.grupo, item.qtde, item.via, 'ACM');
    }
    else {
      // INSERIR DEMAIS APRAZAMENTOS...
    }
  }

  // aprazamento dos demais itens de prescrição.
  const aprazaUpdateHorario = (horario, farmaco, grupo, qtde, via, idprescricao, itemid, datatermino) => {
    var adddate = moment();
    if (horario == '1/1H') {
      // horário padrão para 2/2h.
      adddate = moment(moment().format('DD/MM/YY') + ' 13:00', 'DD/MM/YY HH:mm');
      while (moment(datatermino, 'DD/MM/YY') > adddate) {
        insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, farmaco, grupo, qtde, via, horario, moment(adddate).format('DD/MM/YY HH:mm'));
        adddate = adddate.add(1, 'hour');
      }
    } else if (horario == '2/2H') {
      // horário padrão para 2/2h.
      adddate = moment(moment().format('DD/MM/YY') + ' 14:00', 'DD/MM/YY HH:mm');
      while (moment(datatermino, 'DD/MM/YY') > adddate) {
        insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, farmaco, grupo, qtde, via, horario, moment(adddate).format('DD/MM/YY HH:mm'));
        adddate = adddate.add(2, 'hours');
      }
    } else if (horario == '4/4H') {
      // horário padrão para 4/4h.
      adddate = moment(moment().format('DD/MM/YY') + ' 14:00', 'DD/MM/YY HH:mm');
      while (moment(datatermino, 'DD/MM/YY') > adddate) {
        insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, farmaco, grupo, qtde, via, horario, moment(adddate).format('DD/MM/YY HH:mm'));
        adddate = adddate.add(4, 'hours');
      }
    } else if (horario == '6/6H') {
      // horário padrão para 6/6h.
      adddate = moment(moment().format('DD/MM/YY') + ' 18:00', 'DD/MM/YY HH:mm');
      while (moment(datatermino, 'DD/MM/YY') > adddate) {
        insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, farmaco, grupo, qtde, via, horario, moment(adddate).format('DD/MM/YY HH:mm'));
        adddate = adddate.add(6, 'hours');
      }
    } else if (horario == '8/8H') {
      // horário padrão para 8/8h.
      adddate = moment(moment().format('DD/MM/YY') + ' 16:00', 'DD/MM/YY HH:mm');
      while (moment(datatermino, 'DD/MM/YY') > adddate) {
        insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, farmaco, grupo, qtde, via, horario, moment(adddate).format('DD/MM/YY HH:mm'));
        adddate = adddate.add(8, 'hours');
      }
    } else if (horario == '12/12H') {
      // horário padrão para 12/12h.
      adddate = moment(moment().format('DD/MM/YY') + ' 22:00', 'DD/MM/YY HH:mm');
      while (moment(datatermino, 'DD/MM/YY') > adddate) {
        insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, farmaco, grupo, qtde, via, horario, moment(adddate).format('DD/MM/YY HH:mm'));
        adddate = adddate.add(12, 'hours');
      }
    } else if (horario === '24/24H') {
      // horário padrão para 24/24h.
      adddate = moment(moment().add(1, 'day').format('DD/MM/YY') + ' 10:00', 'DD/MM/YY HH:mm');
      while (moment(datatermino, 'DD/MM/YY') > adddate) {
        insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, farmaco, grupo, qtde, via, horario, moment(adddate).format('DD/MM/YY HH:mm'));
        adddate = adddate.add(24, 'hours');
      }
    } else if (horario == 'AGORA') {
      // agora.
      insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, farmaco, grupo, qtde, via, horario, moment().format('DD/MM/YY HH:mm'));
    } else if (horario == 'ACM') {
      // acm.
      insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, farmaco, grupo, qtde, via, horario, 'ACM');
      insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, farmaco, grupo, qtde, via, horario, 'ACM');
      insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, farmaco, grupo, qtde, via, horario, 'ACM');
      insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, farmaco, grupo, qtde, via, horario, 'ACM');
      insertCheckPrescricao(idpaciente, idatendimento, idprescricao, itemid, farmaco, grupo, qtde, via, horario, 'ACM');
    }
    else {
      // INSERIR DEMAIS APRAZAMENTOS...
    }
  }

  // atualizando a quantidade de um componente.
  const updateComponenteQtde = (value, item) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (value > 100) {
        document.getElementById("inputComponenteQtde").value = '';
      } else {
        if (value > 0) {
          // filtrando os aprazamentos para o item inserido e atualizando o componente para cada aprazamento.
          listcomponentes.filter((valor) => valor.iditem === iditem && valor.componente === item.componente).map((item) => updateComponent(item, value));
          // atualizando o componente view.
          var obj = {
            iditem: item.iditem,
            componente: item.componente,
            quantidade: value,
          };
          axios.post(html + '/updatecomponenteview/' + item.id, obj).then(() => {
            loadViewComponents();
            setexpanditem(1);
          });
        } else {
          toast(1, '#ec7063', 'CAMPO NÃO PREENCHIDO.', 3000);
        }
      }
    }, 2000);
  }
  const updateComponent = (item, value) => {
    var obj = {
      iditem: item.iditem,
      idprescricao: item.idprescricao,
      componente: item.componente,
      quantidade: value,
      horario: item.horario,
    };
    axios.post(html + '/updatecomponenteprescricao/' + item.id, obj).then(() => {
      //loadItensPrescricoes(idprescricao, filteritemprescricao);
      //setexpanditem(1);
    });
  }

  // excluindo um componente de um item da prescrição.
  const deleteComponent = (item) => {
    // excluindo todos os componentes vinculados aos aprazamentos do item.
    loadComponents();
    setTimeout(() => {
      listcomponentes.filter((value) => value.iditem === iditem && value.componente === item.componente).map((item) => destroyComponent(item.id));
      // excluindo o componente view.
      axios.get(html + "/deletecomponenteview/" + item.id).then(() => {
        loadComponents();
        loadViewComponents();
      }, 2000);
    });
  }
  const destroyComponent = (id) => {
    axios.get(html + "/deletecomponenteprescricao/" + id);
  }

  // tratando entradas no input quantidade.
  const checkQuantidade = (value) => {
    if (value > 100) {
      document.getElementById("inputQuantidade").value = '';
    }
  }
  // popup para seleção de um novo componente.
  const [viewinsertcomponente, setviewinsertcomponent] = useState(0);
  function InsertComponent() {
    if (viewinsertcomponente === 1 && viewcomponentselector === 1) {
      return (
        <div className="menucover" onClick={(e) => { setviewinsertcomponent(0); e.stopPropagation() }} style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer">
            <div className="title2" style={{ fontSize: 14, marginBottom: 10 }}>INSERIR COMPONENTE</div>
            <input
              className="input"
              autoComplete="off"
              placeholder="BUSCAR COMPONENTE..."
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'BUSCAR COMPONENTE...')}
              onChange={() => filterComponente()}
              style={{
                width: 0.3 * window.innerWidth,
                margin: 0,
                marginBottom: 5,
              }}
              type="text"
              id="inputFilterComponente"
              defaultValue={filtercomponente}
              maxLength={100}
            ></input>
            <div
              className="scroll"
              id="LISTA DE COMPONENTES PARA SELEÇÃO"
              style={{
                justifyContent: 'flex-start',
                margin: 5,
                marginTop: 5,
                padding: 0,
                paddingRight: 5,
                height: 250,
                minWidth: 0.3 * (window.innerWidth),
                maxWidth: 0.3 * (window.innerWidth),
              }}
            >
              {arrayfiltercomponente.filter(item => item.componente == 1).map((item) => (
                <p
                  key={item.id}
                  id="item da lista"
                  className="row"
                  style={{ margin: 5, marginRight: 0, marginTop: 2.5, marginBottom: 2.5 }}
                >
                  <button
                    onClick={() => getComponent(item)}
                    className="blue-button"
                    style={{
                      width: '100%',
                      margin: 2.5,
                      flexDirection: 'column',
                    }}
                  >
                    {item.farmaco}
                  </button>
                </p>
              ))}
            </div>
          </div>
        </div>
      )
    } else if (viewinsertcomponente === 1 && viewcomponentselector === 2) {
      return (
        <div className="menucover" style={{ zIndex: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer">
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <div className="title2"
                style={{
                  margin: 2.5,
                  marginLeft: 5,
                  flexDirection: 'column',
                  backgroundColor: 'transparent',
                  fontSize: 14,
                }}>{componente + ':'}
              </div>
              <input
                className="input"
                autoComplete="off"
                title="QUANTIDADE."
                onChange={(e) => checkQuantidade(e.target.value)}
                placeholder="QTDE."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'QTDE.')}
                style={{
                  width: 100,
                  margin: 5,
                }}
                type="number"
                id="inputQuantidade"
                maxLength={3}
              ></input>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <button
                className="green-button"
                onClick={() => addComponent()}
                style={{
                  width: 50,
                  margin: 2.5,
                  marginTop: 30,
                  flexDirection: 'column',
                }}
              >
                <img
                  alt=""
                  src={salvar}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
              <button
                className="red-button"
                onClick={() => setviewinsertcomponent(0)}
                style={{
                  width: 50,
                  margin: 2.5,
                  marginTop: 30,
                  flexDirection: 'column',
                }}
              >
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
        </div>
      );
    } else {
      return null;
    }
  }

  // 20JAN2021 - PRESCRIÇÃO (VISÃO DO TÉCNICO DE ENFERMAGEM).
  // carregando a lista de prescrições contendo os itens checáveis.
  const [listcheckprescricoes, setlistcheckprescricoes] = useState([]);
  // carregando os itens de prescrições ativas (salvas e com horário a partir das 13h do dia anterior).
  const loadCheckPrescricoes = () => {
    // recuperando as prescrições ativas.
    axios.get(html + "/prescricaoativa/" + idatendimento).then((response) => {
      setlistcheckprescricoes(response.data);
      var x = [0, 1];
      x = response.data;
      // recuperando os itens de cada prescrição ativa.
      x.map((item) => getCheckItens(item.id));
    });
    // recuperando os horários para checagem da administração das medicações.
    //getHorarios();
  }
  const [listcheckitensprescricoes, setlistcheckitensprescricoes] = useState([]);
  const getCheckItens = (idprescricao) => {
    axios.get(html + "/itensprescricao/" + idprescricao).then((response) => {
      // adicionando o item carregado à array de itens.
      setlistcheckitensprescricoes(response.data);
    });
  }
  const [listcheckhorariosprescricoes, setlistcheckhorariosprescricoes] = useState([]);
  const getHorarios = () => {
    axios.get(html + "/checagemall").then((response) => {
      setlistcheckhorariosprescricoes(response.data);
    });
  }
  const [listcheckcomponentes, setlistcheckcomponentes] = useState([]);
  const getComponentes = () => {
    axios.get(html + "/componentesprescricao").then((response) => {
      setlistcheckcomponentes(response.data);
    });
  }
  // checando um horário indicando a realização da medicação.
  const checkDone = (item) => {
    if (item.checado === 0) {
      var obj = {
        idprescricao: item.idprescricao,
        iditem: item.iditem,
        horario: item.horario,
        checado: 1,
        datachecado: moment().format('DD/MM/YY HH:mm'),
      };
      axios.post(html + "/updatechecagemprescricao/'" + item.id + "'", obj).then(() => {
        getHorarios();
        setTimeout(() => {
        }, 1000);
      });
    } else {
      var obj = {
        idprescricao: item.idprescricao,
        iditem: item.iditem,
        horario: item.horario,
        checado: 0,
        datachecado: '',
      };
      axios.post(html + "/updatechecagemprescricao/'" + item.id + "'", obj).then(() => {
        getHorarios();
      });
    }
  }

  // visualização da prescrição para uso dos técnicos de enfermagem.
  function ShowTecnicosPrescricao() {
    if (stateprontuario == 10) {
      return (
        <div
          className="scroll"
          id="LISTA DE ITENS PRESCRITOS - TÉCNICO"
          // onScroll={() => scrollPositionTec()}
          // onMouseOver={() => keepScrollTec()}
          // onLoad={() => keepScrollTec()}
          style={{
            display: stateprontuario == 10 ? 'flex' : 'none', height: '80vh', width: '82vw',
          }}
        >
          {listcheckprescricoes.map((item) => (
            <div
              key={item.id}
              id="prescrição"
              className="row"
            >
              <div style={{ justifyContent: 'flex-start', padding: 10, width: '100%' }}>
                <button className="blue-button" style={{ padding: 15, margin: 0, backgroundColor: '#f39c12', }}>
                  {'PRESCRIÇÃO: ' + item.data}
                </button>
                {listcheckitensprescricoes.map((item) => (
                  <div style={{ padding: 0, paddingTop: 15, margin: 0 }}>
                    <button
                      className="row"
                      style={{ margin: 0, padding: 5 }}
                    >
                      <div
                        id="FÁRMACO"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          width: '100%',
                        }}>
                        <div id="APRESENTAÇÃO"
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            width: '100%',
                          }}>
                          <button className="blue-button"
                            style={{
                              margin: 5,
                              padding: 10,
                              width: '35vw',
                              minHeight: 50,
                              fontSize: 15,
                              backgroundColor: '#8f9bbc'
                            }}>
                            {item.farmaco}
                          </button>
                          <div className="title2"
                            style={{
                              margin: 5,
                              padding: 5,
                              minHeight: 50,
                              width: '100%',
                              justifyContent: 'flex-start',
                              alignSelf: 'flex-start',
                            }}>
                            <div style={{ flexDirection: 'column' }}>
                              <div style={{ marginBottom: 2.5 }}>OBSERVAÇÕES:</div>
                              <div>{item.observacao}</div>
                            </div>
                          </div>
                        </div>
                        <button className="hover-button"
                          style={{
                            display: listcheckcomponentes.filter((valor) => valor.iditem === item.id).length > 0 ? 'flex' : 'none',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            margin: 5,
                            padding: 5,
                            height: 120,
                          }}>
                          <div style={{ padding: 2.5, opacity: 0.6 }}>COMPONENTES:</div>
                          {listcheckcomponentes.map((valor) => (
                            <div
                              key={valor.id}
                              id="COMPONENTES"
                              style={{
                                margin: 0,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                width: '100%',
                              }}
                            >
                              <div
                                style={{
                                  display: valor.iditem === item.id ? 'flex' : 'none',
                                  margin: 2.5,
                                  padding: 0,
                                  flexDirection: 'column',
                                  justifyContent: 'flex-start',
                                  textAlign: 'left',
                                  width: '100%',
                                }}
                              >{valor.componente + ' - ' + valor.quantidade + ' UNIDADE.'}
                              </div>
                            </div>
                          ))}
                        </button>
                        <div id="CHECAGENS"
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            flexWrap: 'wrap',
                            height: '100%',
                            width: '100%',
                          }}>
                          {listcheckhorariosprescricoes.map((value) => (
                            <button
                              key={value.id}
                              className={value.checado === 1 ? "green-button" : "red-button"}
                              title={value.checado === 1 ? "ITEM CHECADO." : "CLIQUE PARA CHECAR."}
                              style={{
                                display: value.iditem === item.id && value.idprescricao === item.idprescricao ? 'flex' : 'none',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                width: 90,
                                height: 130,
                                margin: 5,
                              }}
                            >
                              <div
                                style={{ textAlign: 'center', alignSelf: 'center', padding: 0 }}
                                onClick={() => checkDone(value)}
                              >
                                <img
                                  alt=""
                                  src={clock}
                                  style={{
                                    margin: 5,
                                    marginBottom: 2.0,
                                    height: 20,
                                    width: 20,
                                  }}
                                ></img>
                              </div>
                              <div
                                style={{ textAlign: 'center', alignSelf: 'center', padding: 0 }}
                                onClick={() => checkDone(value)}
                              >
                                {value.horario}
                              </div>
                              <div
                                style={{
                                  textAlign: 'center', alignSelf: 'center', padding: 0,
                                  display: value.datachecado !== '' ? 'flex' : 'none',
                                }}
                                onClick={() => checkDone(value)}
                              >
                                {'✔'}
                              </div>
                              <div
                                style={{
                                  textAlign: 'center', alignSelf: 'center', padding: 0,
                                  display: value.datachecado !== '' ? 'flex' : 'none',
                                }}
                                onClick={() => checkDone(value)}
                              >
                                {value.datachecado}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

          ))}
        </div>
      );
    } else {
      return null;
    }
  }

  // renderização do componente.
  return (
    <div style={{ display: stateprontuario == 9 || stateprontuario == 10 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
      <Toast valortoast={valortoast} cor={cor} mensagem={mensagem} tempo={tempo} />
      <div className="conteudo" style={{ flexDirection: 'row', justifyContent: 'center', paddingLeft: 5, paddingRight: 5 }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <SearchItensPrescription></SearchItensPrescription>
          <CabecalhoPrescricao></CabecalhoPrescricao>
          <ItensPrescricao></ItensPrescricao>
          <ShowTecnicosPrescricao></ShowTecnicosPrescricao>
        </div>
        <ShowPrescricoes></ShowPrescricoes>
      </div>
      <ShowItemViaSelector></ShowItemViaSelector>
      <PrintPrescricao
        // variáveis da corrida.
        hospital={nomehospital}
        unidade={nomeunidade}
        // variáveis da prescrição.
        viewprintprescricao={viewprintprescricao}
        idprescricao={idprescricao}
        data={dataprescricao}
        idatendimento={idatendimento}
        idusuario={idusuario}
        usuario={nomeusuario}
        funcao={tipousuario}
        conselho={especialidadeusuario}
        box={box}
        nome={nomepaciente}
        dn={listatendimentos.map(item => item.dn)}
        alergias={listatendimentos.map(item => item.dn)}
        precaucao={listatendimentos.map(item => item.precaucao)}
      />
      <SelectModelPrescricao></SelectModelPrescricao>
      <ShowItemHorariosSelector></ShowItemHorariosSelector>
      <InsertComponent></InsertComponent>
      <Hemoderivados></Hemoderivados>
    </div>
  )
}
export default Prescricao;