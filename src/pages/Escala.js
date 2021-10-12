/* eslint eqeqeq: "off" */
import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import MaskedInput from 'react-maskedinput';
import deletar from '../images/deletar.svg';
import novo from '../images/novo.svg';
import moment, { locale } from 'moment';
import 'moment/locale/pt-br';
import Toast from './Toast';
import Header from './Header';
import {Link} from "react-router-dom";

function Escala() {
  moment.locale('pt-br');
  var html = 'https://pulsarapp-server.herokuapp.com';

  const changeState = useDispatch();
  const idusuario = useSelector((state) => state.idusuario);
  const usuario = useSelector((state) => state.nomeusuario);
  const tipo = useSelector((state) => state.tipo);
  const hospital = useSelector((state) => state.nomehospital);
  const unidade = useSelector((state) => state.nomeunidade);

  const viewEscala = useSelector((state) => state.escala);

  useEffect(() => {
    if (viewEscala === 1) {
      // carregando a lista de plantonistas.
      loadPlantonistas();
      // carregando a lista de escalas.
      loadEscalas(previousdate, selecteddate, nextdate);
      // preparando datepicker.
      currentMonth();
      loadEscalasMonth();
    }
    // eslint-disable-next-line
  }, [viewEscala]);

  // carregamento da lista de plantonistas disponíveis pela empresa.
  const [plantonistas, setplantonistas] = useState([]);
  const loadPlantonistas = () => {
    axios.get(html + "/escaladoctors/'" + hospital + "'/'" + unidade + "'").then((response) => {
      setplantonistas(response.data);
      var x = [0, 1];
      x = response.data;
    });
  }

  // função que captura o nome do plantonista selecionado na lista de plantonistas.
  const [plantonista, setplantonista] = useState('SELECIONE DA LISTA');
  const selectPlantonista = (item) => {
    setplantonista(item.usuario);
  };

  // renderização da lista de plantonistas.
  function ShowPlantonistas() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <p className="title2" style={{ fontSize: 18 }}>{'PLANTONISTAS - ' + unidade}</p>
        <div
          className="scroll"
          id="LISTA DE PLANTONISTAS"
          style={{
            display: 'flex',
            flex: 2,
            justifyContent: 'flex-start',
            borderRadius: 5,
            margin: 5,
            marginRight: 0,
            minHeight: 400,
            maxHeight: 400,
          }}
        >
          {plantonistas.map((item) => (
            <p
              key={item.id}
              className="row"
              style={{
                position: 'relative',
                margin: 0,
              }}
            >
              <button
                className="widget"
                style={{
                  width: 255,
                  color: '#ffffff',
                  backgroundColor:
                    item.usuario === plantonista ? '#ec7063' : '#1f7a8c',
                }}
                onClick={() => selectPlantonista(item)}
              >
                {item.usuario}
              </button>
            </p>
          ))}
        </div>
        <button
          className="blue-button"
          style={{
            width: 250,
            color: '#ffffff',
            alignSelf: 'center',
          }}
          onClick={() => showUsuarios()}
        >
          GERIR PLANTONISTAS
        </button>
      </div>
    );
  }

  // abrindo a tela usuários.
  const showUsuarios = () => {
    //setviewinsertescala(0);
    changeState({
      type: 'USUARIOS_ON',
      // payloads.
      payloadIdusuario: idusuario,
      payloadNomeusuario: usuario,
      payloadTipo: tipo,
      payloadNomehospital: hospital,
      payloadNomeunidade: unidade,
    });
  }

  // carregamento dos registros de escala para o setor, para uma data selecionada.
  const [escalas, setescalas] = useState([]);
  const loadEscalas = (x, y, z) => {
    console.log(x + ' a ' + y + '.');
    axios.get(html + "/escaladay/'" + hospital + "'/'" + unidade + "'/'" + x + "'/'" + y + "'/'" + z + "'").then((response) => {
      setescalas(response.data);
    });
  };
  // carregamento dos registros de escala para o setor, para o mês selecionado.
  const [escalasmonth, setescalasmonth] = useState([]);
  var x = [0, 1];
  var arrayinicio = [];
  const loadEscalasMonth = () => {
    // preparando o primeiro dia do mês.
    var month = moment(startdate).format('MM');
    var year = moment(startdate).format('YYYY');
    var inicio = year + '-' + month + '-01';
    var termino = moment(inicio, 'YYYY/MM/DD').add(30, 'days').format('YYYY-MM-DD');
    axios.get(html + "/escalamonth/'" + hospital + "'/'" + unidade + "'/'" + inicio + "'/'" + termino + "'").then((response) => {
      x = response.data;
      // construindo uma array apenas com a data de início da escala.
      arrayinicio = x.map((item) => moment(item.inicio, 'YYYY-MM-DD hh:mm:ss').format('DD'));
      setescalasmonth(arrayinicio);
      console.log('ESCALAS NO MÊS: ' + arrayinicio);
    });
  };

  // função que captura o nome do plantonista na escala selecionada.
  const [escala, setescala] = useState();
  const selectEscala = (item) => {
    setescala(item.usuario);
  };

  // renderização dos registros de escala para a unidade selecionada.
  function ShowEscalas() {
    if (escalas.length > 0) {
      return (
        <div
          className="scroll"
          id="LISTA DE ESCALAS"
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            borderRadius: 5,
            margin: 0,
            minHeight: window.innerHeight - 200,
            maxHeight: window.innerHeight - 200,
            width: 0.6 * (window.innerWidth),
          }}
        >
          {escalas.map((item) => (
            <p
              key={item.id}
              onClick={() => selectEscala(item)}
              className="row"
              style={{
                position: 'relative',
                margin: 0,
              }}
            >
              <button
                className="widget"
                style={{
                  width: '60%',
                  margin: 2.5,
                  color: '#ffffff',
                  backgroundColor:
                    item.usuario === escala ? '#ec7063' : '#1f7a8c',
                }}
              >
                {item.usuario}
              </button>
              <button
                className="widget"
                style={{
                  width: '20%',
                  margin: 2.5,
                  color: '#ffffff',
                  backgroundColor:
                    item.usuario === escala ? '#ec7063' : '#1f7a8c',
                }}
              >
                {item.inicio.substring(8, 10) + '/' + item.inicio.substring(5, 7) + ' - ' + item.inicio.substring(11, 16)}
              </button>
              <button
                className="widget"
                style={{
                  width: '20%',
                  margin: 2.5,
                  color: '#ffffff',
                  backgroundColor:
                    item.usuario === escala ? '#ec7063' : '#1f7a8c',
                }}
              >
                {item.termino.substring(8, 10) + '/' + item.termino.substring(5, 7) + ' - ' + item.termino.substring(11, 16)}
              </button>
              <button
                className="delete-button"
                title="EXCLUIR ESCALA."
                onClick={() => clickDeleteEscala(item)}
                style={{ margin: 2.5, height: 50, width: 50 }}
              >
                <img
                  alt=""
                  src={deletar}
                  style={{
                    marginTop: 20,
                    marginBottom: 20,
                    marginLeft: 20,
                    marginRight: 20,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
            </p>
          ))}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              margin: 5,
              paddingRight: 7,
              width: '100%',
            }}>
            <NovaEscalaBtn></NovaEscalaBtn>
          </div>
        </div>
      );
    } else {
      return (
        <div
          className="scroll"
          id="LISTA DE ESCALAS"
          style={{
            display: 'flex',
            justifyContent: 'center',
            borderRadius: 5,
            margin: 0,
            minHeight: window.innerHeight - 210,
            maxHeight: window.innerHeight - 210,
            width: 0.6 * (window.innerWidth),
          }}
        >
          <p className="title2" style={{ fontSize: 14, alignSelf: 'center' }}>
            {'SEM PLANTONISTAS ESCALADOS PARA O DIA ' + pickdate + '.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
            <NovaEscalaBtn></NovaEscalaBtn>
          </div>
        </div>
      );
    }
  }

  function Labels() {
    return (
      <div
        className="scrollheader"
        id="LABELS DA ESCALA DE PLANTONISTAS"
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          borderRadius: 5,
          margin: 0,
          padding: 0,
          paddingRight: 5,
        }}
      >
        <p
          className="row"
          style={{
            position: 'relative',
            margin: 0,
            height: 30,
          }}
        >
          <button
            className="header"
            style={{
              width: '60%',
              margin: 2.5,
            }}
          >
            PLANTONISTA
          </button>
          <button
            className="header"
            style={{
              width: '20%',
              margin: 2.5,
            }}
          >
            INÍCIO
          </button>
          <button
            className="header"
            style={{
              width: '20%',
              margin: 2.5,
            }}
          >
            TÉRMINO
          </button>
          <button
            className="header"
            style={{ margin: 2.5, height: 50, width: 50 }}
          >
          </button>
        </p>
      </div>
    )
  }

  function NovaEscalaBtn() {
    return (
      <button
        className="blue-button"
        onClick={() => showViewInsertEscala(1)}
        title="ADICIONAR PLANTONISTA À ESCALA DO DIA."
        style={{
          margin: 0,
          height: 50,
          width: 50,
          padding: 0,
        }}
      >
        <img
          alt=""
          src={novo}
          style={{
            marginTop: 20,
            marginBottom: 20,
            marginLeft: 20,
            marginRight: 20,
            height: 30,
            width: 30,
          }}
        ></img>
      </button>
    );
  }

  const [viewinsertescala, setviewinsertescala] = useState(0);
  function NovaEscalaView() {
    if (viewinsertescala === 1) {
      return (
        <div
          className="secondary"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: 0,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            height: '100%',
            width: '100%',
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            zIndex: 3,
          }}
        >
          <div
            className="secondary"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 5,
              paddingTop: 30,
              paddingBottom: 30,
              paddingLeft: 30,
              paddingRight: 30,
            }}
          >
            <div
              style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <div>
                <ShowPlantonistas></ShowPlantonistas>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 50,
              }}>
                <p className="title2" style={{ fontSize: 14 }}>PLANTONISTA:</p>
                <p className="input"
                  style={{ height: 50, width: 200, padding: 10, alignSelf: 'center', color: plantonista ? '#1f7a8c' : '#a6acaf' }}
                  defaultValue="SELECIONE"
                  title="PLANTONISTA ESCALADO.">
                  {plantonista ? plantonista : 'SELECIONE'}
                </p>
                <p className="title2" style={{ fontSize: 14 }}>HORA DE INÍCIO:</p>
                <MaskedInput
                  id="inputInicio"
                  title="HORA DE INICIO DO PLANTÃO."
                  placeholder="07:00"
                  autoComplete="off"
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = '07:00')}
                  className="input"
                  style={{
                    margin: 5,
                    width: 200,
                    height: 50,
                    alignSelf: 'center',
                  }}
                  mask="11:11"
                />
                <p className="title2" style={{ fontSize: 14 }}>HORA DE TÉRMINO:</p>
                <MaskedInput
                  id="inputTermino"
                  title="HORA DE TÉRMINO DO PLANTÃO."
                  placeholder="19:00"
                  autoComplete="off"
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = '19:00')}
                  className="input"
                  style={{
                    margin: 5,
                    width: 200,
                    height: 50,
                    alignSelf: 'center',
                  }}
                  mask="11:11"
                />
                <p className="title2" style={{ fontSize: 14 }}>DATA DE TÉRMINO:</p>
                <div
                  class="radio-toolbar"
                  style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}
                >
                  <input
                    type="radio"
                    id="radio1"
                    name="data"
                    value={moment(pickdate, 'DD/MM/YY').format('DD/MM/YY')}
                    onClick={() => sendData()}
                  ></input>
                  <label style={{ margin: 0, marginRight: 5, width: 100 }} for="radio1">{moment(pickdate, 'DD/MM/YY').format('DD/MM/YY')}</label>
                  <input
                    type="radio"
                    id="radio2"
                    name="data"
                    value={moment(pickdate, 'DD/MM/YY').add(1, 'day').format('DD/MM/YY')}
                    onClick={() => editScale()}
                  ></input>
                  <label style={{ margin: 0, width: 100 }} for="radio2">{moment(pickdate, 'DD/MM/YY').add(1, 'day').format('DD/MM/YY')}</label>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    margin: 0,
                  }}
                >
                  <button className="red-button" style={{ margin: 5 }}
                    onClick={() => setviewinsertescala(0)}>
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
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  const showViewInsertEscala = () => {
    setviewinsertescala(1);
    setplantonista('');
  }

  // alterando a data de término do plantão.
  var finaldate = '';
  const editScale = (value) => {
    // definindo plantão do dia até meia-noite.
    finaldate = pickdate;
    var inicio = document.getElementById('inputInicio').value;
    var termino = '23:59';
    var obj = {
      hospital: hospital,
      unidade: unidade,
      usuario: plantonista,
      inicio: moment(pickdate, 'DD/MM/YY').format('YYYY-MM-DD ') + inicio,
      termino: moment(finaldate, 'DD/MM/YY').format('YYYY-MM-DD ') + termino,
    };
    axios.post(html + '/insertescala', obj);
    // definindo plantão de meia-noite até o dia seguinte. 
    setTimeout(() => {
      finaldate = moment(pickdate, 'DD/MM/YY').add(1, 'day').format('DD/MM/YY');
      var inicio = '00:00';
      var termino = document.getElementById('inputTermino').value;
      var obj = {
        hospital: hospital,
        unidade: unidade,
        usuario: plantonista,
        inicio: moment(finaldate, 'DD/MM/YY').format('YYYY-MM-DD ') + inicio,
        termino: moment(finaldate, 'DD/MM/YY').format('YYYY-MM-DD ') + termino,
      };
      axios.post(html + '/insertescala', obj);
      setviewinsertescala(0);
      selectDate(pickdate);
      loadEscalas(previousdate, selecteddate, nextdate);
      toast(1, '#52be80', 'ESCALA REGISTRADA COM SUCESSO.', 6000);
      setTimeout(() => {
        loadEscalasMonth();
      }, 1000);
    }, 1000);
  }

  // salvando o registro de escala no banco de dados.
  const sendData = () => {
    var inicio = document.getElementById('inputInicio').value;
    var termino = document.getElementById('inputTermino').value;
    if (
      inicio === '' || termino === '' ||
      parseInt(inicio.substring(0, 2)) > 23 || parseInt(inicio.substring(3, 5)) > 59 ||
      parseInt(termino.substring(0, 2)) > 23 || parseInt(termino.substring(3, 5)) > 59
    ) {
      setplantonista('');
      document.getElementById('inputInicio').value = '';
      document.getElementById('inputTermino').value = '';
      toast(1, '#ec7063', 'ERRO AO INSERIR HORÁRIOS. REPITA A OPERAÇÃO.', 6000);
      setviewinsertescala(0);
    } else {
      var obj = {
        hospital: hospital,
        unidade: unidade,
        usuario: plantonista,
        inicio: moment(pickdate, 'DD/MM/YY').format('YYYY-MM-DD ') + inicio,
        termino: moment(pickdate, 'DD/MM/YY').format('YYYY-MM-DD ') + termino,
      };
      axios.post(html + '/insertescala', obj);
      setviewinsertescala(0);
      selectDate(pickdate);
      loadEscalas(previousdate, selecteddate, nextdate);
      toast(1, '#52be80', 'ESCALA REGISTRADA COM SUCESSO.', 6000);
      setTimeout(() => {
        loadEscalasMonth();
      }, 1000);
    };
  }

  const clickDeleteEscala = (item) => {
    axios.get(html + "/deleteescala/'" + item.id + "'");
    selectDate(pickdate);
    toast(1, '#52be80', 'ESCALA EXCLUÍDA COM SUCESSO.', 6000)
    loadEscalasMonth();
    loadEscalas(previousdate, selecteddate, nextdate);
  };

  // DATEPICKER.
  // preparando a array com as datas.
  var arraydate = [];
  const [arraylist, setarraylist] = useState([]);
  // preparando o primeiro dia do mês.
  var month = moment().format('MM');
  var year = moment().format('YY');
  const [startdate] = useState(moment('01/' + month + '/' + year, 'DD/MM/YY'));
  // descobrindo o primeiro dia do calendário (último domingo do mês anteior).
  const firstSunday = (x, y) => {
    while (x.weekday() > 0) {
      x.subtract(1, 'day');
      y.subtract(1, 'day');
    }
    // se o primeiro domingo da array ainda cair no mês atual:
    if (x.month() == startdate.month()) {
      x.subtract(7, 'days');
      y.subtract(7, 'days');
    }
  }
  // criando array com 42 dias a partir da startdate.
  const setArrayDate = (x, y) => {
    arraydate = [x.format('DD/MM/YY')];
    while (y.diff(x, 'days') > 1) {
      x.add(1, 'day');
      arraydate.push(x.format('DD/MM/YY').toString());
    }
  }
  // criando a array de datas baseada no mês atual.
  const currentMonth = () => {
    var month = moment(startdate).format('MM');
    var year = moment(startdate).format('YY');
    var x = moment('01/' + month + '/' + year, 'DD/MM/YY');
    var y = moment('01/' + month + '/' + year, 'DD/MM/YY').add(42, 'days');
    firstSunday(x, y);
    setArrayDate(x, y);
    setarraylist(arraydate);
  }
  // percorrendo datas do mês anterior.
  const previousMonth = () => {
    startdate.subtract(30, 'days');
    var month = moment(startdate).format('MM');
    var year = moment(startdate).format('YY');
    var x = moment('01/' + month + '/' + year, 'DD/MM/YY');
    var y = moment('01/' + month + '/' + year, 'DD/MM/YY').add(42, 'days');
    firstSunday(x, y);
    setArrayDate(x, y);
    setarraylist(arraydate);
    loadEscalasMonth();
  }
  // percorrendo datas do mês seguinte.
  const nextMonth = () => {
    startdate.add(30, 'days');
    var month = moment(startdate).format('MM');
    var year = moment(startdate).format('YY');
    var x = moment('01/' + month + '/' + year, 'DD/MM/YY');
    var y = moment('01/' + month + '/' + year, 'DD/MM/YY').add(42, 'days');
    firstSunday(x, y);
    setArrayDate(x, y);
    setarraylist(arraydate);
    loadEscalasMonth();
  }

  // selecionando uma data no datepicker e definindo intervalo para carregamento da escala.
  const [pickdate, setpickdate] = useState(moment().format('DD/MM/YY'));
  var selecteddate = moment().format('YYYY-MM-DD');
  var previousdate = moment().subtract(1, 'day').format('YYYY-MM-DD');
  var nextdate = moment().add(1, 'day').format('YYYY-MM-DD');
  const selectDate = (date) => {
    setpickdate(date);
    finaldate = date;
    selecteddate = moment(date, 'DD/MM/YY').format('YYYY-MM-DD');
    previousdate = moment(date, 'DD/MM/YY').subtract(1, 'day').format('YYYY-MM-DD');
    nextdate = moment(date, 'DD/MM/YY').add(1, 'day').format('YYYY-MM-DD');
    loadEscalas(previousdate, selecteddate, nextdate);
  }

  // função para filtro da array de escalas do mês, a serem exibidos no datepicker.
  function checkDate(item) {
    return escalasmonth.filter((datafiltrada) => {
      return datafiltrada === item;
    })
  }

  // renderização do datepicker.
  function DatePicker() {
    return (
      <div
        className="secondary"
        style={{
          backgroundColor: '#ffffff',
          display: 'flex',
        }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          margin: 0,
        }}>
          <button
            className="blue-button"
            onClick={() => previousMonth()}
            id="previous"
            style={{
              width: 50,
              height: 50,
              margin: 2.5,
              color: '#ffffff',
            }}
            title={'MÊS ANTERIOR'}
          >
            {'◄'}
          </button>
          <p
            className="title2"
            style={{
              width: 200,
              fontSize: 16,
              margin: 2.5
            }}>
            {startdate.format('MMMM').toUpperCase() + ' ' + startdate.year()}
          </p>
          <button
            className="blue-button"
            onClick={() => nextMonth()}
            id="next"
            style={{
              width: 50,
              height: 50,
              margin: 2.5,
              color: '#ffffff',
            }}
            title={'PRÓXIMO MÊS'}
          >
            {'►'}
          </button>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          width: '395',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 5,
        }}>
          <p className="title2" style={{ width: 50, fontSize: 12, margin: 2.5 }}>DOM</p>
          <p className="title2" style={{ width: 50, fontSize: 12, margin: 2.5 }}>SEG</p>
          <p className="title2" style={{ width: 50, fontSize: 12, margin: 2.5 }}>TER</p>
          <p className="title2" style={{ width: 50, fontSize: 12, margin: 2.5 }}>QUA</p>
          <p className="title2" style={{ width: 50, fontSize: 12, margin: 2.5 }}>QUI</p>
          <p className="title2" style={{ width: 50, fontSize: 12, margin: 2.5 }}>SEX</p>
          <p className="title2" style={{ width: 50, fontSize: 12, margin: 2.5 }}>SAB</p>
        </div>
        <div
          className="secondary"
          id="LISTA DE DATAS"
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            margin: 0,
            padding: 5,
            width: 395,
            height: 340,
          }}
        >
          {arraylist.map((item) => (
            <button
              className="widget"
              onClick={() => selectDate(item)}
              style={{
                width: 50,
                height: 50,
                margin: 2.5,
                backgroundColor:
                  (checkDate(item.substring(0, 2)).length > 0 && pickdate !== item) ? '#52be80' :
                    (checkDate(item.substring(0, 2)).length > 0 && pickdate === item) ? '#ec7063' :
                      (checkDate(item.substring(0, 2)).length < 1 && pickdate !== item) ? '#1f7a8c' : '#ec7063',
                opacity: item.substring(3, 5) === moment(startdate).format('MM') ? 1 : 0.5,
              }}
              title={item}
            >
              {item.substring(0, 2)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // função para construção dos toasts.
  const [valor, setvalor] = useState(0);
  const [cor, setcor] = useState('transparent');
  const [mensagem, setmensagem] = useState('');
  const [tempo, settempo] = useState(2000);
  const toast = (value, color, message, time) => {
    setvalor(value);
    setcor(color);
    setmensagem(message);
    settempo(time);
    setTimeout(() => {
      setvalor(0);
    }, time + 1000);
  }

  // renderização do componente.
  if (viewEscala === 1) {
    return (
      <div>
        <div
          className="main fade-in"
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            margin: 0,
            padding: 0,
          }}
        >
          <Header link={"/pages/unidades"} titulo={'ESCALA DE TRABALHO'}></Header>
          <Toast valor={valor} cor={cor} mensagem={mensagem} tempo={tempo}></Toast>
          <NovaEscalaView></NovaEscalaView>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              margin: 0,
              padding: 0,
              paddingLeft: 5,
              paddingRight: 5,
              width: window.innerWidth,
              minHeight: window.innerHeight - 155,
              maxHeight: window.innerHeight - 155,
            }}>
            <DatePicker></DatePicker>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}>
              <Labels></Labels>
              <ShowEscalas></ShowEscalas>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return null;
  }
}

export default Escala;
