/* eslint eqeqeq: "off" */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import novo from '../images/novo.svg';
import Toast from './Toast';
import MaskedInput from 'react-maskedinput';

function Balanco(
  {
    viewbalanco,
    usuario,
    idatendimento,
    idbalanco,
    databalanco,
    horabalanco,
    pas,
    pad,
    fc,
    fr,
    sao2,
    tax,
    diu,
    fezes,
  }) {

  //servidor.
  var html = 'https://pulsarapp-server.herokuapp.com';

  // chave para exibição do componente.
  const [viewcomponent, setviewcomponent] = useState(viewbalanco);
  const [poop, setpoop] = useState(fezes);
  const setPoop = (value) => {
    setpoop(value);
  }

  useEffect(() => {
    setviewcomponent(viewbalanco);
    if (viewbalanco === 2) {
      loadItensganhos();
      loadItensperdas();
      setpoop(fezes);
    }
  }, [viewbalanco])

  // carregando listas de ganhos e perdas.
  const [itensganhos, setitensganhos] = useState([]);
  const loadItensganhos = () => {
    axios.get(html + "/itensganhos/" + idbalanco).then((response) => {
      setitensganhos(response.data);
    });
  }
  const [itensperdas, setitensperdas] = useState([]);
  const loadItensperdas = () => {
    axios.get(html + "/itensperdas/" + idbalanco).then((response) => {
      setitensperdas(response.data);
    });
  }

  // inserindo registro.
  const insertBalanco = () => {
    var obj = {
      idatendimento: idatendimento,
      data: moment().format('DD/MM/YY') + ' ' + document.getElementById('inputHora').value,
      hora: document.getElementById('inputHora').value,
      pas: document.getElementById("inputPas").value,
      pad: document.getElementById("inputPad").value,
      fc: document.getElementById("inputFc").value,
      fr: document.getElementById("inputFr").value,
      sao2: document.getElementById("inputSao2").value,
      tax: document.getElementById("inputTax").value,
      diurese: document.getElementById("inputDiurese").value,
      fezes: poop,
      status: 0,
      usuario: usuario,
    };
    axios.post(html + '/insertbalanco', obj).then(() => {
      toast(1, '#52be80', 'BALANÇO REGISTRADO COM SUCESSO.', 3000);
      setTimeout(() => {
        fechar();
      }, 4000);
    });
  };
  // atualizando registro.
  const updateBalanco = () => {
    var obj = {
      idatendimento: idatendimento,
      data: databalanco,
      hora: horabalanco,
      pas: document.getElementById("inputPas").value,
      pad: document.getElementById("inputPad").value,
      fc: document.getElementById("inputFc").value,
      fr: document.getElementById("inputFr").value,
      sao2: document.getElementById("inputSao2").value,
      tax: document.getElementById("inputTax").value,
      diurese: document.getElementById("inputDiurese").value,
      fezes: poop,
      status: 0,
      usuario: usuario,
    };
    axios.post(html + '/updatebalanco/' + idbalanco, obj).then(() => {
      toast(1, '#52be80', 'BALANÇO ATUALIZADO COM SUCESSO.', 3000);
      setTimeout(() => {
        fechar();
      }, 4000);
    });
  };

  // inserindo item de ganho.
  const insertGanho = () => {
    var obj = {
      idatendimento: idatendimento,
      idbalanco: idbalanco,
      identificacao: document.getElementById("inputIdentificacao").value.toUpperCase(),
      valor: document.getElementById("inputVolume").value,
    };
    axios.post(html + '/insertganho', obj);
    setTimeout(() => {
      setshowinsertganho(0);
      loadItensganhos();
    }, 2000);
  }
  // atualizando item de ganho.
  const updateGanho = () => {
    var obj = {
      idatendimento: idatendimento,
      idbalanco: idbalanco,
      identificacao: document.getElementById("inputIdentificacao").value.toUpperCase(),
      valor: document.getElementById("inputVolume").value,
    };
    axios.post(html + '/updateganho/' + idganho, obj);
    setTimeout(() => {
      setshowupdateganho(0);
      loadItensganhos();
    }, 2000);
  }
  // inserindo item de perda.
  const insertPerda = () => {
    var obj = {
      idatendimento: idatendimento,
      idbalanco: idbalanco,
      identificacao: document.getElementById("inputIdentificacao").value.toUpperCase(),
      valor: document.getElementById("inputVolume").value,
    };
    axios.post(html + '/insertperda', obj);
    setTimeout(() => {
      setshowinsertperda(0);
      loadItensperdas();
    }, 2000);
  }
  // atualizando item de perda.
  const updatePerda = () => {
    var obj = {
      idatendimento: idatendimento,
      idbalanco: idbalanco,
      identificacao: document.getElementById("inputIdentificacao").value.toUpperCase(),
      valor: document.getElementById("inputVolume").value,
    };
    axios.post(html + '/updateperda/' + idperda, obj);
    setTimeout(() => {
      setshowupdateperda(0);
      loadItensperdas();
    }, 2000);
  }

  // deletando item de ganho.
  const deleteGanho = (item) => {
    axios.get(html + "/deleteganho/" + item.id);
    loadItensganhos();
  }
  // deletando item de perda.
  const deletePerda = (item) => {
    axios.get(html + "/deleteperda/" + item.id);
    loadItensperdas();
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

  const fechar = () => {

  }

  // atualizando itens de ganhos ou perdas.
  const [idganho, setidganho] = useState(0);
  const [idperda, setidperda] = useState(0);
  const [identificacao, setidentificacao] = useState('');
  const [volume, setvolume] = useState(0);
  const selectGanho = (item) => {
    setidganho(item.id);
    setidentificacao(item.identificacao);
    setvolume(item.valor);
    setshowupdateganho(1);
  }
  const selectPerda = (item) => {
    setidperda(item.id);
    setidentificacao(item.identificacao);
    setvolume(item.valor);
    setshowupdateperda(1);
  }

  // tela para inserir ganhos.
  const [showinsertganho, setshowinsertganho] = useState(0);
  function ShowInsertGanho() {
    if (showinsertganho == 1) {
      return (
        <div className="menucover">
          <div className="menucontainer">
            <div id="cabeçalho" className="cabecalho">
              <div className="title5">{'INSERIR GANHO'}</div>
              <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="red-button" onClick={() => setshowinsertganho(0)}>
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
                <button className="green-button"
                  onClick={() => insertGanho()}
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
              </div>
            </div>
            <div className="corpo" style={{ marginBottom: 20 }}>
              <div id="IDENTIFICAÇÃO"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label
                  className="title2"
                  style={{ marginTop: 15, fontSize: 14 }}
                >
                  ITEM:
                </label>
                <input
                  className="input"
                  autoComplete="off"
                  placeholder="IDENTIFICAÇÃO"
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'IDENTIFICAÇÃO')}
                  title="IDENTIFICAÇÃO DA SOLUÇÃO."
                  style={{
                    height: 50,
                    width: 200,
                    marginBottom: 0,
                    marginLeft: 0,
                  }}
                  id="inputIdentificacao"
                  maxLength={50}
                ></input>
              </div>
              <div id="VOLUME" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label
                  className="title2"
                  style={{ marginTop: 15, fontSize: 14 }}
                >
                  VOLUME:
                </label>
                <input
                  className="input"
                  autoComplete="off"
                  placeholder="VOLUME"
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'VOLUME')}
                  onChange={(e) => validateVolume(e.target.value)}
                  title="VOLUME DO GANHO (ML)."
                  style={{
                    height: 50,
                    width: 200,
                    marginBottom: 0,
                    marginLeft: 0,
                  }}
                  id="inputVolume"
                  maxLength={4}
                ></input>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }
  // tela para inserir perdas.
  const [showinsertperda, setshowinsertperda] = useState(0);
  function ShowInsertPerda() {
    if (showinsertperda === 1) {
      return (
        <div className="menucover">
          <div className="menucontainer">
            <div id="cabeçalho" className="cabecalho">
              <div className="title5">{'INSERIR PERDA'}</div>
              <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="red-button" onClick={() => setshowinsertperda(0)}>
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
                <button className="green-button"
                  onClick={() => insertPerda()}
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
              </div>
            </div>
            <div className="corpo" style={{ marginBottom: 20 }}>
              <div id="IDENTIFICAÇÃO"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label
                  className="title2"
                  style={{ marginTop: 15, fontSize: 14 }}
                >
                  ITEM:
                </label>
                <input
                  className="input"
                  autoComplete="off"
                  placeholder="IDENTIFICAÇÃO"
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'IDENTIFICAÇÃO')}
                  title="IDENTIFICAÇÃO DA SOLUÇÃO."
                  style={{
                    height: 50,
                    width: 200,
                    marginBottom: 0,
                    marginLeft: 0,
                  }}
                  id="inputIdentificacao"
                  maxLength={50}
                ></input>
              </div>
              <div id="VOLUME" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label
                  className="title2"
                  style={{ marginTop: 15, fontSize: 14 }}
                >
                  VOLUME:
                </label>
                <input
                  className="input"
                  autoComplete="off"
                  placeholder="VOLUME"
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'VOLUME')}
                  onChange={(e) => validateVolume(e.target.value)}
                  title="VOLUME DA PERDA (ML)."
                  style={{
                    height: 50,
                    width: 200,
                    marginBottom: 0,
                    marginLeft: 0,
                  }}
                  id="inputVolume"
                  maxLength={4}
                ></input>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }
  // tela para atualizar ganhos.
  const [showupdateganho, setshowupdateganho] = useState(0);
  function ShowUpdateGanho() {
    if (showupdateganho === 1) {
      return (
        <div className="menucover"
          style={{
            zIndex: 9,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <div className="menucontainer">
            <div id="IDENTIFICAÇÃO"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label
                className="title2"
                style={{ marginTop: 15, fontSize: 14 }}
              >
                ITEM:
              </label>
              <input
                className="input"
                defaultValue={identificacao}
                autoComplete="off"
                placeholder="IDENTIFICAÇÃO"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'IDENTIFICAÇÃO')}
                title="IDENTIFICAÇÃO DA SOLUÇÃO."
                style={{
                  height: 50,
                  width: 200,
                  marginBottom: 0,
                  marginLeft: 0,
                }}
                id="inputIdentificacao"
                maxLength={50}
              ></input>
            </div>
            <div id="VOLUME" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label
                className="title2"
                style={{ marginTop: 15, fontSize: 14 }}
              >
                VOLUME:
              </label>
              <input
                className="input"
                defaultValue={volume}
                autoComplete="off"
                placeholder="VOLUME"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'VOLUME')}
                onChange={(e) => validateVolume(e.target.value)}
                title="VOLUME DO GANHO (ML)."
                style={{
                  height: 50,
                  width: 200,
                  marginBottom: 0,
                  marginLeft: 0,
                }}
                id="inputVolume"
                maxLength={4}
              ></input>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button
                className="green-button"
                onClick={() => updateGanho()}
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
                onClick={() => setshowupdateganho(0)}
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
      )
    } else {
      return null;
    }
  }
  // tela para atualizar perdas.
  const [showupdateperda, setshowupdateperda] = useState(0);
  function ShowUpdatePerda() {
    if (showupdateperda === 1) {
      return (
        <div className="menucover"
          style={{
            zIndex: 9,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <div className="menucontainer">
            <div id="IDENTIFICAÇÃO"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label
                className="title2"
                style={{ marginTop: 15, fontSize: 14 }}
              >
                ITEM:
              </label>
              <input
                className="input"
                defaultValue={identificacao}
                autoComplete="off"
                placeholder="IDENTIFICAÇÃO"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'IDENTIFICAÇÃO')}
                title="IDENTIFICAÇÃO DA SOLUÇÃO."
                style={{
                  height: 50,
                  width: 200,
                  marginBottom: 0,
                  marginLeft: 0,
                }}
                id="inputIdentificacao"
                maxLength={50}
              ></input>
            </div>
            <div id="VOLUME" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label
                className="title2"
                style={{ marginTop: 15, fontSize: 14 }}
              >
                VOLUME:
              </label>
              <input
                className="input"
                defaultValue={volume}
                autoComplete="off"
                placeholder="VOLUME"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'VOLUME')}
                onChange={(e) => validateVolume(e.target.value)}
                title="VOLUME DO GANHO (ML)."
                style={{
                  height: 50,
                  width: 200,
                  marginBottom: 0,
                  marginLeft: 0,
                }}
                id="inputVolume"
                maxLength={4}
              ></input>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button
                className="green-button"
                onClick={() => updatePerda()}
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
                onClick={() => setshowupdateperda(0)}
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
      )
    } else {
      return null;
    }
  }

  // validando entradas para campos numéricos.
  const validatePas = (txt) => {
    var last = txt.slice(-1);
    if (isNaN(last) === true) {
      last = '';
      document.getElementById('inputPas').value = '';
    } else {
    }
  };
  const validatePad = (txt) => {
    var last = txt.slice(-1);
    if (isNaN(last) === true) {
      last = '';
      document.getElementById('inputPad').value = '';
    } else {
    }
  };
  const validateFc = (txt) => {
    var last = txt.slice(-1);
    if (isNaN(last) === true) {
      last = '';
      document.getElementById('inputFc').value = '';
    } else {
    }
  };
  const validateFr = (txt) => {
    var last = txt.slice(-1);
    if (isNaN(last) === true) {
      last = '';
      document.getElementById('inputFr').value = '';
    } else {
    }
  };
  const validateSao2 = (txt) => {
    var last = txt.slice(-1);
    if (isNaN(last) === true) {
      last = '';
      document.getElementById('inputSao2').value = '';
    } else {
    }
  };
  const validateTax = (txt) => {
    var number = /[0-9]/;
    var dot = /[.]/;
    var last = txt.slice(-1);
    if (last.match(number) !== null || last.match(dot) !== null) {
    } else {
      document.getElementById('inputTax').value = '';
    }
  };
  const validateDiu = (txt) => {
    var last = txt.slice(-1);
    if (isNaN(last) === true) {
      last = '';
      document.getElementById('inputDiurese').value = '';
    } else {
    }
  };
  const validateVolume = (txt) => {
    var last = txt.slice(-1);
    if (isNaN(last) === true) {
      last = '';
      document.getElementById('inputVolume').value = '';
    } else {
    }
  };

  // detectando o id do último registro de balanço realizado.
  const [lastidbalanco, setlastidbalanco] = useState();
  const lastIdBalanco = () => {
    axios.get(html + "/lastbalanco/" + idatendimento).then((response) => {
      var x = response.data;
      setlastidbalanco(x.map((item) => item.id))
    });
  }

  // lista de ganhos e perdas quando inserindo um registro de balanço.
  var arrayganhos = [];
  var arrayperdas = [];

  // renderização do componente.
  if (viewcomponent != 0) {
    return (
      <div>
        <div className="menucover">
          <div className="menucontainer">
            <div id="cabeçalho" className="cabecalho">
              <div className="title5">{'LANÇAMENTO DE BALANÇO HÍDRICO'}</div>
              <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="red-button" onClick={() => setviewcomponent(0)}>
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
                <button className="green-button"
                  onClick={viewcomponent == 1 ? () => insertBalanco() : () => updateBalanco()}
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
              </div>
            </div>
            <div className="corpo">
              <div className="title2">{'HORÁRIO DE LANÇAMENTO:'}</div>
              <MaskedInput
                className="input"
                autoComplete="off"
                placeholder="HORA"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'HORA')}
                //onChange={(e) => validatePas(e.target.value)}
                title="HORA DE REGISTRO."
                value={horabalanco}
                mask="11:11"
                style={{
                  height: 50,
                  width: 100,
                }}
                id="inputHora"
                maxLength={5}
              ></MaskedInput>
              <div id="DADOS DO BALANÇO" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label
                    className="title2"
                    style={{ marginTop: 15, fontSize: 14 }}
                  >
                    PAS:
                  </label>
                  <input
                    className="input"
                    defaultValue={pas}
                    autoComplete="off"
                    placeholder="PAS"
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'PAS')}
                    onChange={(e) => validatePas(e.target.value)}
                    title="PRESSÃO ARTERIAL SISTÓLICA."
                    style={{
                      height: 50,
                      width: 100,
                      marginBottom: 0,
                    }}
                    id="inputPas"
                    maxLength={3}
                  ></input>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label
                    className="title2"
                    style={{ marginTop: 15, fontSize: 14 }}
                  >
                    PAD:
                  </label>
                  <input
                    className="input"
                    defaultValue={pad}
                    autoComplete="off"
                    placeholder="PAD"
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'PAD')}
                    onChange={(e) => validatePad(e.target.value)}
                    title="PRESSÃO ARTERIAL DIASTÓLICA."
                    style={{
                      height: 50,
                      width: 100,
                    }}
                    id="inputPad"
                    maxLength={3}
                  ></input>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label
                    className="title2"
                    style={{ marginTop: 15, fontSize: 14 }}
                  >
                    FC:
                  </label>
                  <input
                    className="input"
                    defaultValue={fc}
                    autoComplete="off"
                    placeholder="FC"
                    title="FREQUÊNCIA CARDÍACA."
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'FC')}
                    onChange={(e) => validateFc(e.target.value)}
                    style={{
                      height: 50,
                      width: 100,
                    }}
                    id="inputFc"
                    maxLength={3}
                  ></input>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label
                    className="title2"
                    style={{ marginTop: 15, fontSize: 14 }}
                  >
                    FR:
                  </label>
                  <input
                    className="input"
                    defaultValue={fr}
                    autoComplete="off"
                    placeholder="FR"
                    title="FREQUÊNCIA RESPIRATÓRIA."
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'FR')}
                    onChange={(e) => validateFr(e.target.value)}
                    style={{
                      height: 50,
                      width: 100,
                    }}
                    id="inputFr"
                    maxLength={2}
                  ></input>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label
                    className="title2"
                    style={{ marginTop: 15, fontSize: 14 }}
                  >
                    TAX:
                  </label>
                  <input
                    className="input"
                    defaultValue={tax}
                    autoComplete="off"
                    placeholder="TAX"
                    title="TEMPERATURA AXILAR."
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'TAX')}
                    onChange={(e) => validateTax(e.target.value)}
                    style={{
                      height: 50,
                      width: 100,
                    }}
                    id="inputTax"
                    maxLength={4}
                  ></input>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label
                    className="title2"
                    style={{ marginTop: 15, fontSize: 14 }}
                  >
                    SAO2:
                  </label>
                  <input
                    className="input"
                    defaultValue={sao2}
                    autoComplete="off"
                    placeholder="SAO2"
                    title="SAO2."
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'SAO2')}
                    onChange={(e) => validateSao2(e.target.value)}
                    style={{
                      height: 50,
                      width: 100,
                    }}
                    id="inputSao2"
                    min={0}
                    max={100}
                  ></input>
                </div>
                <div id="DIURESE" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label
                    className="title2"
                    style={{ marginTop: 15, fontSize: 14 }}
                  >
                    DIURESE:
                  </label>
                  <input
                    className="input"
                    defaultValue={diu}
                    autoComplete="off"
                    placeholder="DIURESE"
                    title="DIURESE."
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'DIURESE')}
                    onChange={(e) => validateDiu(e.target.value)}
                    style={{
                      height: 50,
                      width: 100,
                    }}
                    id="inputDiurese"
                    min={0}
                    max={100}
                  ></input>
                </div>
                <div id="EVACUAÇÕES" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 5 }}>
                  <label
                    className="title2"
                    style={{ marginTop: 15, fontSize: 14 }}
                  >
                    EVACUAÇÕES:
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <button
                      className="blue-button"
                      onClick={() => setPoop('AUSENTES')}
                      style={{
                        padding: 10,
                        width: 100,
                        backgroundColor: poop === 'AUSENTES' ? '#ec7063' : '#8f9bbc',
                      }}
                    >
                      AUSENTES
                    </button>
                    <button
                      className="blue-button"
                      onClick={() => setPoop('NORMAIS')}
                      style={{
                        padding: 10,
                        width: 100,
                        backgroundColor: poop === 'NORMAIS' ? '#ec7063' : '#8f9bbc',
                      }}
                    >
                      NORMAIS
                    </button>
                    <button
                      className="blue-button"
                      onClick={() => setPoop('DIARRÉIA')}
                      style={{
                        padding: 10,
                        width: 100,
                        backgroundColor: poop === 'DIARRÉIA' ? '#ec7063' : '#8f9bbc',
                      }}
                    >
                      DIARRÉIA
                    </button>
                  </div>
                </div>
              </div>
              <div id="PERDAS E GANHOS" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', padding: 2.5 }}>
                  <div className="title2" style={{ fontSize: 14, margin: 0, marginTop: 5, marginBottom: 0, padding: 0 }}>{'LISTA DE GANHOS:'}</div>
                  <div id="LISTA DE GANHOS"
                    className="scroll"
                    title="LISTA DE GANHOS"
                    style={{ marginTop: 0, paddingTop: 0, height: '35vh' }}
                  >
                    {itensganhos.map((item) => (
                      <div
                        key={item.id}
                        id="itens de ganhos"
                        className="row"
                      >
                        <button
                          className="blue-button"
                          onClick={() => selectGanho(item)}
                          style={{ width: '100%' }}
                        >
                          <div>{item.identificacao}</div>
                        </button>
                        <div
                          className="title2"
                          style={{
                            width: 200,
                            alignSelf: 'center',
                          }}
                        >
                          <div>{item.valor + 'ML'}</div>
                        </div>
                        <button className="animated-red-button"
                          onClick={() => deleteGanho(item)}
                          style={{
                            marginRight: 0,
                            marginLeft: 5,
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
                    ))}
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginRight: 6, marginTop: 5 }}>
                      <button
                        className="blue-button"
                        style={{
                          width: 50,
                          margin: 2.5,
                        }}
                      >
                        <img
                          alt=""
                          src={novo}
                          onClick={() => setshowinsertganho(1)}
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
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', padding: 2.5 }}>
                <div className="title2" style={{ fontSize: 14, margin: 0, marginTop: 5, marginBottom: 0, padding: 0 }}>{'LISTA DE PERDAS:'}</div>
                  <div id="LISTA DE PERDAS"
                    className="scroll"
                    title="LISTA DE PERDAS"
                    style={{ marginTop: 0, paddingTop: 0, height: '35vh' }}
                  >
                    {itensperdas.map((item) => (
                      <div
                        key={item.id}
                        id="itens de perdas"
                        className="row"
                      >
                        <button
                          className="blue-button"
                          onClick={() => selectPerda(item)}
                          style={{
                            width: '100%',
                          }}
                        >
                          <div>{item.identificacao}</div>
                        </button>
                        <div
                          className="title2"
                          style={{
                            width: 200,
                            alignSelf: 'center',
                          }}
                        >
                          <div>{item.valor + 'ML'}</div>
                        </div>
                        <button className="animated-red-button"
                          onClick={() => deletePerda(item)}
                          style={{
                            marginLeft: 5,
                            marginRight: 0,
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
                    ))}
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginRight: 6, marginTop: 5 }}>
                      <button
                        className="blue-button"
                        style={{
                          width: 50,
                          margin: 2.5,
                        }}
                      >
                        <img
                          alt=""
                          src={novo}
                          onClick={() => setshowinsertperda(1)}
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
          </div>
          <Toast valor={valor} cor={cor} mensagem={mensagem} tempo={tempo} />
        </div>
        <ShowInsertGanho></ShowInsertGanho>
        <ShowInsertPerda></ShowInsertPerda>
        <ShowUpdateGanho></ShowUpdateGanho>
        <ShowUpdatePerda></ShowUpdatePerda>
      </div>
    );
  } else {
    return null;
  }
}
export default Balanco;
