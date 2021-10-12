/* eslint eqeqeq: "off" */
import React, { useState, useContext } from 'react';
import Context from '../Context';
import axios from 'axios';
// importanto imagens.
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import DatePicker from './DatePicker';
import Toast from './Toast';
import PrintHemoderivados from './PrintHemoderivados';
import PrintTermoHemoderivados from './PrintTermoHemoderivados';

export function Hemoderivados() {
  var html = 'https://pulsarapp-server.herokuapp.com';
  // recuperando estados globais (Context.API).
  const {
    nomehospital,
    nomeunidade,
    nomeusuario, tipousuario, conselhousuario,
    idatendimento,
    idpaciente,
    nomepaciente, box, dn,
    peso, setpeso,
    pickdate1,
    hemoderivados, sethemoderivados,
    setprinthemoderivados
  } = useContext(Context)

  const [hgb, sethgb] = useState()
  const [hto, sethto] = useState()
  const [plaq, setplaq] = useState()
  const [rni, setrni] = useState()
  const [ptt, setptt] = useState()
  const [fibrinogenio, setfibrinogenio] = useState()
  const [reacaotransfusional, setreacaotransfusional] = useState(0)
  const [coagulacao, setcoagulacao] = useState(0)
  const [indicacao, setindicacao] = useState()
  const [ch, setch] = useState()
  const [cplaq, setcplaq] = useState()
  const [plasma, setplasma] = useState()
  const [criop, setcriop] = useState()
  const [statustransfusao, setstatustransfusao] = useState(2)
  const [reserva, setreserva] = useState()
  const [hemaciasdeleucocitadas, sethemaciasdeleucocitadas] = useState()
  const [hemaciasfenotipadas, sethemaciasfenotipadas] = useState()
  const [hemaciaslavadas, sethemaciaslavadas] = useState()
  const [hemaciasirradiadas, sethemaciasirradiadas] = useState()
  const [plaquetasdeleucocitadas, setplaquetasdeleucocitadas] = useState()
  const [plaquetasirradiadas, setplaquetasirradiadas] = useState()

  // a acrescentar se hospital exigir (useless).
  //var gGesta = 0;
  //var gPara = 0;
  //var gAborto = 0;
  //var tiporeacaotransfusional = '';
  //var preparotx = 0;
  //var medicacaotransfusao = '';
  //var doador = 0;

  var timeout = null;

  // validações de campos.
  const setPeso = (txt) => {
    var number = /[0-9]/;
    var dot = /[.]/;
    var last = txt.slice(-1);
    if (last.match(number) !== null || last.match(dot) !== null) {
      setpeso(txt);
      document.getElementById('inputPESO').value = txt;
    } else {
      setpeso('');
      document.getElementById('inputPESO').value = '';
    }
  };

  const setHgb = (txt) => {
    var number = /[0-9]/;
    var dot = /[.]/;
    var last = txt.slice(-1);
    if (last.match(number) !== null || last.match(dot) !== null) {
      sethgb(txt);
      document.getElementById('inputHGB').value = txt;
    } else {
      sethgb('');
      document.getElementById('inputHGB').value = '';
    }
  };

  const setHto = (txt) => {
    var number = /[0-9]/;
    var dot = /[.]/;
    var last = txt.slice(-1);
    if (last.match(number) !== null || last.match(dot) !== null) {
      sethto(txt);
      document.getElementById('inputHTO').value = txt;
    } else {
      sethto('');
      document.getElementById('inputHTO').value = '';
    }
  };

  const setPlaq = (txt) => {
    var number = /[0-9]/;
    var dot = /[.]/;
    var last = txt.slice(-1);
    if (last.match(number) !== null || last.match(dot) !== null) {
      setplaq(txt);
      document.getElementById('inputPLAQ').value = txt;
    } else {
      setplaq('');
      document.getElementById('inputPLAQ').value = '';
    }
  };

  const setPtta = (txt) => {
    var number = /[0-9]/;
    var dot = /[.]/;
    var last = txt.slice(-1);
    if (last.match(number) !== null || last.match(dot) !== null) {
      setptt(txt);
      document.getElementById('inputPTTA').value = txt;
    } else {
      setptt('');
      document.getElementById('inputPTTA').value = '';
    }
  };

  const setRni = (txt) => {
    var number = /[0-9]/;
    var dot = /[.]/;
    var last = txt.slice(-1);
    if (last.match(number) !== null || last.match(dot) !== null) {
      setrni(txt);
      document.getElementById('inputRNI').value = txt;
    } else {
      setrni('');
      document.getElementById('inputRNI').value = '';
    }
  };

  const setFibrino = (txt) => {
    var number = /[0-9]/;
    var dot = /[.]/;
    var last = txt.slice(-1);
    if (last.match(number) !== null || last.match(dot) !== null) {
      setfibrinogenio(txt);
      document.getElementById('inputFibrinogenio').value = txt;
    } else {
      setfibrinogenio('');
      document.getElementById('inputFibrinogenio').value = '';
    }
  };

  const setIndicacao = (value) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setindicacao(value);
    }, 500);
  }
  const updateDataReserva = (value) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setstatustransfusao(1); // se é feito reserva de sangue, o status da transfusão deve ser 'NÃO URGENTE'.
      setreserva(value);
    }, 2000);
  }
  const validatePedidoCH = (value) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setch(value);
      document.getElementById('HEMODERIVADOS').scrollTop = 1000;
    }, 500);
  }
  const validatePedidoPLAQ = (value) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setcplaq(value);
      document.getElementById('HEMODERIVADOS').scrollTop = 1000;
    }, 500);
  }
  const validatePedidoPLASMA = (value) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setplasma(value);
      document.getElementById('HEMODERIVADOS').scrollTop = 1000;
    }, 500);
  }
  const validatePedidoCRIOP = (value) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setcriop(value);
      document.getElementById('HEMODERIVADOS').scrollTop = 1000;
    }, 500);
  }

  const salvarHemoderivado = () => {
    var obj = {
      idpaciente: idpaciente,
      idatendimento: idatendimento,
      peso: peso,
      hgb: hgb,
      hto: hto,
      plaq: plaq,
      rni: rni,
      ptt: ptt,
      fibrinogenio: fibrinogenio,
      lasttransfusao: pickdate1,
      indicacao: indicacao,
      reserva: reserva,
      reacao: reacaotransfusional,
      coagulacao: coagulacao,
      status: statustransfusao,
      ch: ch,
      cplaq: cplaq,
      plasma: plasma,
      criop: criop,
      hmdeleucocitadas: hemaciasdeleucocitadas,
      hmfenotipadas: hemaciasfenotipadas,
      hmlavadas: hemaciaslavadas,
      hmirradiadas: hemaciasirradiadas,
      plaqdeleucocitadas: plaquetasdeleucocitadas,
      plaqirradiadas: plaquetasirradiadas,
      hospital: nomehospital,
      unidade: nomeunidade,
      box: box,
      nome: nomepaciente,
      dn: dn,
    };
    if (
      peso === 0 ||
      hgb === 0 ||
      hto === 0 ||
      plaq === 0 ||
      indicacao === '?' ||
      (ch === 0 && cplaq === 0 && plasma === 0 && criop === 0)
    ) {
      toast(1, '#ec7063', 'CAMPOS OBRIGATÓRIOS EM BRANCO.', 3000);
    } else {
      axios.post(html + '/hemotransfusao', obj).then(() => {
        setvalordatepicker(0);
        setmododatepicker(0);
        setprinthemoderivados(1);
      });
    }
  }

  function HemaciasDetalhes() {
    if (ch > 0) {
      return (
        <div id="HEMÁCIAS DETALHES" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <button
            className={hemaciasdeleucocitadas === 1 ? "red-button" : "blue-button"}
            onClick={() => setHemaciasDeleucocitadas()}
            style={{
              display: 'flex',
              width: window.innerWidth > 800 ? 250 : 100,
              margin: 2.5,
              padding: 10,
              flexDirection: 'column',
            }}
          >
            <div>{'HEMÁCIAS DELEUCOCITADAS'}</div>
          </button>
          <button
            className={hemaciasfenotipadas === 1 ? "red-button" : "blue-button"}
            onClick={() => setHemaciasFenotipadas()}
            style={{
              display: 'flex',
              width: window.innerWidth > 800 ? 250 : 100,
              margin: 2.5,
              padding: 10,
              flexDirection: 'column',
            }}
          >
            <div>{'HEMÁCIAS FENOTIPADAS'}</div>
          </button>
          <button
            className={hemaciaslavadas === 1 ? "red-button" : "blue-button"}
            onClick={() => setHemaciasLavadas()}
            style={{
              display: 'flex',
              width: window.innerWidth > 800 ? 250 : 100,
              margin: 2.5,
              padding: 10,
              flexDirection: 'column',
            }}
          >
            <div>{'HEMÁCIAS LAVADAS'}</div>
          </button>
          <button
            className={hemaciasirradiadas === 1 ? "red-button" : "blue-button"}
            onClick={() => setHemaciasIrradiadas()}
            style={{
              display: 'flex',
              width: window.innerWidth > 800 ? 250 : 100,
              margin: 2.5,
              padding: 10,
              flexDirection: 'column',
            }}
          >
            <div>{'HEMÁCIAS IRRADIADAS'}</div>
          </button>
        </div>
      );
    } else {
      return null;
    }
  }

  function PlaquetasDetalhes() {
    if (cplaq > 0) {
      return (
        <div id="PLAQUETAS DETALHES" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <button
            className={plaquetasdeleucocitadas === 1 ? "red-button" : "blue-button"}
            onClick={() => setPlaquetasDeleucocitadas()}
            style={{
              display: 'flex',
              width: window.innerWidth > 800 ? 250 : 100,
              margin: 2.5,
              padding: 10,
              flexDirection: 'column',
            }}
          >
            <div>{'PLAQUETAS DELEUCOCITADAS'}</div>
          </button>
          <button
            className={plaquetasirradiadas === 1 ? "red-button" : "blue-button"}
            onClick={() => setPlaquetasIrradiadas()}
            style={{
              display: 'flex',
              width: window.innerWidth > 800 ? 250 : 100,
              margin: 2.5,
              padding: 10,
              flexDirection: 'column',
            }}
          >
            <div>{'PLAQUETAS IRRADIADAS'}</div>
          </button>
        </div>
      );
    } else {
      return null;
    }
  }

  // detalhamento na solicitação de concentrado de hemácias.
  const setHemaciasDeleucocitadas = () => {
    if (hemaciasdeleucocitadas === 0) {
      sethemaciasdeleucocitadas(1);
      document.getElementById('HEMODERIVADOS').scrollTop = 1000;
    } else {
      sethemaciasdeleucocitadas(0);
      document.getElementById('HEMODERIVADOS').scrollTop = 1000;
    }
  }
  const setHemaciasFenotipadas = () => {
    if (hemaciasfenotipadas === 0) {
      sethemaciasfenotipadas(1);
      document.getElementById('HEMODERIVADOS').scrollTop = 1000;
    } else {
      sethemaciasfenotipadas(0);
      document.getElementById('HEMODERIVADOS').scrollTop = 1000;
    }
  }
  const setHemaciasLavadas = () => {
    if (hemaciaslavadas === 0) {
      sethemaciaslavadas(1);
      document.getElementById('HEMODERIVADOS').scrollTop = 1000;
    } else {
      sethemaciaslavadas(0);
      document.getElementById('HEMODERIVADOS').scrollTop = 1000;
    }
  }
  const setHemaciasIrradiadas = () => {
    if (hemaciasirradiadas === 0) {
      sethemaciasirradiadas(1);
      document.getElementById('HEMODERIVADOS').scrollTop = 1000;
    } else {
      sethemaciasirradiadas(0);
      document.getElementById('HEMODERIVADOS').scrollTop = 1000;
    }
  }
  const setPlaquetasDeleucocitadas = () => {
    if (plaquetasdeleucocitadas === 0) {
      setplaquetasdeleucocitadas(1);
      document.getElementById('HEMODERIVADOS').scrollTop = 1000;
    } else {
      setplaquetasdeleucocitadas(0);
      document.getElementById('HEMODERIVADOS').scrollTop = 1000;
    }
  }
  const setPlaquetasIrradiadas = () => {
    if (plaquetasirradiadas === 0) {
      setplaquetasirradiadas(1);
      document.getElementById('HEMODERIVADOS').scrollTop = 1000;
    } else {
      setplaquetasirradiadas(0);
      document.getElementById('HEMODERIVADOS').scrollTop = 1000;
    }
  }

  // exibição do datepicker.
  const [valordatepicker, setvalordatepicker] = useState(0);
  const [mododatepicker, setmododatepicker] = useState(0);
  const showDatePicker = (value, mode) => {
    setvalordatepicker(0);
    setTimeout(() => {
      setvalordatepicker(value);
      setmododatepicker(mode);
    }, 500);
  }

  // função para construção dos toasts.
  const [viewtoast, setviewtoast] = useState(0);
  const [cor, setcor] = useState('transparent');
  const [mensagem, setmensagem] = useState('');
  const [tempo, settempo] = useState(2000);
  const toast = (value, color, message, time) => {
    setviewtoast(value);
    setcor(color);
    setmensagem(message);
    settempo(time);
    setTimeout(() => {
      setviewtoast(0);
    }, time);
  }

  // renderização do componente.
  if (hemoderivados === 1) {
    return (
      <div className="menucover" style={{ zIndex: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer">
          <Toast viewtoast={viewtoast} cor={cor} mensagem={mensagem} tempo={tempo} />
          <DatePicker valordatepicker={valordatepicker} mododatepicker={mododatepicker} />
          <PrintHemoderivados tipo={tipousuario} idatendimento={idatendimento} hospital={nomehospital} unidade={nomeunidade} nomeusuario={nomeusuario} conselho={conselhousuario} box={box} nome={nomepaciente} dn={dn}
            hgb={hgb} hto={hto} plaq={plaq} rni={rni} ptt={ptt} fibrinogenio={fibrinogenio} reacaotransfusional={reacaotransfusional} coagulacao={coagulacao}
            indicacao={indicacao} ultimatransfusao={pickdate1} ch={ch} cplaq={cplaq} plasma={plasma} criop={criop} statustransfusao={statustransfusao}
            reserva={reserva} hemaciasdeleucocitadas={hemaciasdeleucocitadas} hemaciasfenotipadas={hemaciasfenotipadas} hemaciaslavadas={hemaciaslavadas}
            hemaciasirradiadas={hemaciasirradiadas} plaquetasdeleucocitadas={plaquetasdeleucocitadas} plaquetasirradiadas={plaquetasirradiadas}
          ></PrintHemoderivados>
          <PrintTermoHemoderivados></PrintTermoHemoderivados>
          <div className="title2" style={{ fontSize: 18 }}>SOLICITAÇÃO DE HEMOCOMPONENTES</div>
          <div id="HEMODERIVADOS" className="scroll" style={{
            paddingRight: 5, height: 0.7 * window.innerHeight,
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'
          }}>
            <div id="DADOS DO PACIENTE 1" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <div id="PESO" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div className="title2" style={{ fontSize: 14 }}>PESO:</div>
                <input
                  autoComplete="off"
                  className="input"
                  placeholder='PESO'
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'PESO')}
                  onChange={(e) => setPeso(e.target.value)}
                  title='PESO(Kg).'
                  style={{
                    width: 100,
                    height: 50,
                  }}
                  maxLength={5}
                  id="inputPESO"
                  type="float"
                  defaultValue={peso}
                ></input>
              </div>
              <div id="HGB" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div className="title2" style={{ fontSize: 14 }}>HGB:</div>
                <input
                  autoComplete="off"
                  className="input"
                  placeholder='HGB'
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'HGB')}
                  onChange={(e) => setHgb(e.target.value)}
                  defaultValue={hgb}
                  title='HEMOGLOBINA(g%).'
                  style={{
                    width: 100,
                    height: 50,
                  }}
                  maxLength={4}
                  id="inputHGB"
                  type="float"
                ></input>
              </div>
              <div id="HTO" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <text className="title2" style={{ fontSize: 14 }}>HTO:</text>
                <input
                  autoComplete="off"
                  className="input"
                  placeholder='HTO'
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'HTO')}
                  onChange={(e) => setHto(e.target.value)}
                  defaultValue={hto}
                  title='HEMATÓCRITO(%).'
                  style={{
                    width: 100,
                    height: 50,
                  }}
                  maxLength={4}
                  id="inputHTO"
                  type="float"
                ></input>
              </div>
              <div id="PLAQUETAS" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <text className="title2" style={{ fontSize: 14 }}>PLAQ:</text>
                <input
                  autoComplete="off"
                  className="input"
                  placeholder='PLAQ'
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'PLAQ')}
                  onChange={(e) => setPlaq(e.target.value)}
                  defaultValue={plaq}
                  title='PLAQUETAS(/mm3).'
                  style={{
                    width: 100,
                    height: 50,
                  }}
                  maxLength={7}
                  id="inputPLAQ"
                  type="float"
                ></input>
              </div>
              <div id="PTTA" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <text className="title2" style={{ fontSize: 14 }}>PTTA:</text>
                <input
                  autoComplete="off"
                  className="input"
                  placeholder='PTTA'
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'PTTA')}
                  onChange={(e) => setPtta(e.target.value)}
                  defaultValue={ptt}
                  title='TEMPO DE TROMBOPLASTINA PARCIAL ATIVADA(s).'
                  style={{
                    width: 100,
                    height: 50,
                  }}
                  maxLength={4}
                  id="inputPTTA"
                  type="float"
                ></input>
              </div>
              <div id="RNI" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <text className="title2" style={{ fontSize: 14 }}>RNI:</text>
                <input
                  autoComplete="off"
                  className="input"
                  placeholder='RNI'
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'RNI')}
                  onChange={(e) => setRni(e.target.value)}
                  defaultValue={rni}
                  title='RNI.'
                  style={{
                    width: 100,
                    height: 50,
                  }}
                  maxLength={4}
                  id="inputRNI"
                  type="float"
                ></input>
              </div>
              <div id="FIBRINOGENIO" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <text className="title2" style={{ fontSize: 14 }}>FIBR:</text>
                <input
                  autoComplete="off"
                  className="input"
                  placeholder='FIBR'
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'FIBR')}
                  onChange={(e) => setFibrino(e.target.value)}
                  defaultValue={fibrinogenio}
                  title='FIBRINOGÊNIO(mg/dl).'
                  style={{
                    width: 100,
                    height: 50,
                  }}
                  maxLength={5}
                  id="inputFibrinogenio"
                  type="float"
                ></input>
              </div>
            </div>
            <div id="DADOS DO PACIENTE 2" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
              <div
                id="datepicker"
                className="blue-button"
                title="DATA DA ÚLTIMA TRANSFUSÃO (DUPLO CLIQUE PARA EDITAR)."
                style={{
                  width: 250,
                  height: 50,
                  padding: 10,
                  margin: 2.5,
                }}
                //onClick={() => setpickdate1('NÃO')}
                onClick={() => showDatePicker(1, 1)}
              >
                {'ÚLTIMA TRANSFUSÃO: ' + pickdate1}
              </div>
              <button
                className={reacaotransfusional === 0 ? "blue-button" : "red-button"}
                onClick={reacaotransfusional === 0 ? () => setreacaotransfusional(1) : () => setreacaotransfusional(0)}
                style={{
                  display: 'flex',
                  width: window.innerWidth > 800 ? 250 : 100,
                  margin: 2.5,
                  padding: 10,
                  flexDirection: 'column',
                }}
              >
                <div>{'REAÇÃO TRANSFUSIONAL'}</div>
              </button>
              <button
                className={coagulacao === 0 ? "blue-button" : "red-button"}
                onClick={coagulacao === 0 ? () => setcoagulacao(1) : () => setcoagulacao(0)}
                style={{
                  display: 'flex',
                  width: window.innerWidth > 800 ? 250 : 100,
                  margin: 2.5,
                  padding: 10,
                  flexDirection: 'column',
                }}
              >
                <div>{'DISTÚRBIO DE COAGULAÇÃO'}</div>
              </button>
            </div>
            <div id="INDICAÇÃO" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <text className="title2" style={{ fontSize: 14, marginTop: 20 }}>INDICAÇÃO PARA TRANSFUSÃO:</text>
              <input
                autoComplete="off"
                className="input"
                placeholder='INDICAÇÃO'
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'INDICAÇÃO')}
                onChange={(e) => setIndicacao(e.target.value)}
                defaultValue={indicacao}
                title='DIAGNÓSTICO, INDICAÇÃO OU CIRURGIA PROPOSTA.'
                style={{
                  width: 0.5 * window.innerWidth,
                  height: 50,
                  paddingLeft: 5, paddingRight: 5, marginBottom: 15
                }}
                maxLength={200}
                id="inputINDICACAO"
              ></input>
            </div>
            <div id="SITUAÇÃO" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button
                className={statustransfusao === 1 ? "red-button" : "blue-button"}
                onClick={() => setstatustransfusao(1)}
                style={{
                  display: 'flex',
                  width: window.innerWidth > 800 ? 250 : 100,
                  margin: 2.5,
                  padding: 10,
                  flexDirection: 'column',
                }}
              >
                <div>{'NÃO URGENTE'}</div>
              </button>
              <button
                className={statustransfusao === 2 ? "red-button" : "blue-button"}
                onClick={() => setstatustransfusao(2)}
                style={{
                  display: 'flex',
                  width: window.innerWidth > 800 ? 250 : 100,
                  margin: 2.5,
                  padding: 10,
                  flexDirection: 'column',
                }}
              >
                <div>{'URGENTE'}</div>
              </button>
              <button
                className={statustransfusao === 3 ? "red-button" : "blue-button"}
                onClick={() => setstatustransfusao(3)}
                style={{
                  display: 'flex',
                  width: window.innerWidth > 800 ? 250 : 100,
                  margin: 2.5,
                  padding: 10,
                  flexDirection: 'column',
                }}
              >
                <div>{'EXTREMA URGÊNCIA'}</div>
              </button>
              <div id="RESERVA" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '40%' }}>
                <text className="title2" style={{ fontSize: 14 }}>RESERVA:</text>
                <input
                  className="blue-button"
                  autoComplete="off"
                  placeholder="?"
                  value={reserva}
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = '?')}
                  onKeyUp={(e) => updateDataReserva(e.target.value)}
                  mask="11/11/11 - 00:00"
                  style={{
                    backgroundColor: '#e1e5f2',
                    color: '#1f7a8c',
                    width: 150,
                    marginTop: 2.5,
                    padding: 10,
                  }}
                  id="inputDataReserva"
                  title="DATA E HORA DA RESERVA. FORMATO: DD/MM/YY - HH:MM."
                >
                </input>
              </div>
            </div>
            <div id="HEMODERIVADOS" style={{ display: 'flex', flexDirection: 'row', marginTop: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 150 }}>
                <text className="title2" style={{ fontSize: 14 }}>CONCENTRADO DE HEMÁCIAS</text>
                <input
                  autoComplete="off"
                  className="input"
                  placeholder='UN.'
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'UN.')}
                  onChange={(e) => validatePedidoCH(e.target.value)}
                  title='CONCENTRADO DE HEMÁCIAS (UNIDADE 300ML).'
                  style={{
                    width: 100,
                    height: 50,
                  }}
                  maxLength={2}
                  id="inputCH"
                  type="number"
                  defaultValue={ch}
                ></input>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 150 }}>
                <text className="title2" style={{ fontSize: 14 }}>CONCENTRADO DE PLAQUETAS</text>
                <input
                  autoComplete="off"
                  className="input"
                  placeholder='UN.'
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'UN.')}
                  onChange={(e) => validatePedidoPLAQ(e.target.value)}
                  title='CONCENTRADO DE PLAQUETAS (UNIDADE 50ML).'
                  style={{
                    width: 100,
                    height: 50,
                  }}
                  maxLength={2}
                  id="inputPLAQ"
                  type="number"
                  defaultValue={cplaq}
                ></input>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 150 }}>
                <text className="title2" style={{ fontSize: 14 }}>PLASMA FRESCO CONGELADO</text>
                <input
                  autoComplete="off"
                  className="input"
                  placeholder='UN.'
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'UN.')}
                  onChange={(e) => validatePedidoPLASMA(e.target.value)}
                  title='PLASMA FRESCO CONGELADO (UNIDADE 200ML).'
                  style={{
                    width: 100,
                    height: 50,
                  }}
                  maxLength={2}
                  id="inputPFC"
                  type="number"
                  defaultValue={plasma}
                ></input>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 150 }}>
                <text className="title2" style={{ fontSize: 14, height: 40 }}>CRIOPRECIPITADO</text>
                <input
                  autoComplete="off"
                  className="input"
                  placeholder='UN.'
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'UN.')}
                  onChange={(e) => validatePedidoCRIOP(e.target.value)}
                  title='CRIOPRECIPITADO (UNIDADE 20ML).'
                  style={{
                    width: 100,
                    height: 50,
                  }}
                  maxLength={2}
                  id="inputCRIO"
                  type="number"
                  defaultValue={criop}
                ></input>
              </div>
            </div>
            <HemaciasDetalhes></HemaciasDetalhes>
            <PlaquetasDetalhes></PlaquetasDetalhes>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
            <button
              className="red-button"
              onClick={() => {
                sethemoderivados(0)
              }}
              style={{ width: 50, marginRight: 5 }}
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
            <button
              className="green-button"
              onClick={() => salvarHemoderivado()}
              style={{
                width: 50, marginRight: 0,
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
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}