/* eslint eqeqeq: "off" */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import Toast from './Toast';
import Context from '../Context';

function Evolucao(
  {
    viewevolucao,
    idpaciente,
    idevolucao,
    data,
    idatendimento,
    idusuario,
    usuario,
    funcao,
    evolucao,
    pas,
    pad,
    fc,
    fr,
    sao2,
    tax,
    diu,
    fezes,
    bh,
    acv,
    ar,
    abdome,
    outros,
    glasgow,
    rass,
    ramsay,
    hd,
    uf,
    heparina,
    braden,
    morse,
  }) {
  //servidor.
  var html = 'https://pulsarapp-server.herokuapp.com';
  // recuperando estados globais (Context.API).
  const {
    setlistevolucoes, setarrayevolucao,
    listbalancos,
  } = useContext(Context)

  // chave para exibição do componente.
  const [viewcomponent, setviewcomponent] = useState(viewevolucao);



  // capturando dados vitais do último balanço (preenchido pelo técnico de enfermagem):
  const getLastBalanco = () => {
    // alert(listbalancos.slice(-1).map(item => item.pas))
    pas = listbalancos.slice(-1).map(item => item.pas);
    pad = listbalancos.slice(-1).map(item => item.pad);
    fc = listbalancos.slice(-1).map(item => item.fc);
    fr = listbalancos.slice(-1).map(item => item.fr);
    sao2 = listbalancos.slice(-1).map(item => item.sao2);
    tax = listbalancos.slice(-1).map(item => item.tax);
    diu = listbalancos.slice(-1).map(item => item.diu);
    fezes = listbalancos.slice(-1).map(item => item.fezes);
    bh = listbalancos.slice(-1).map(item => item.bh);
  }

  // variáveis associadas à evolução:
  const [hepa, sethepa] = useState('');
  const [poop, setpoop] = useState('');
  useEffect(() => {
    if (viewevolucao == 1) {
      setviewcomponent(viewevolucao);
      setviewhd(0);
      sethepa(0);
      setpoop('');
      getLastBalanco();
      evolucao = '';
      acv = '';
      ar = '';
      abdome = '';
      outros = '';
      glasgow = '';
      rass = '';
      ramsay = '';
      hd = 0;
      uf = '';
      heparina = '';
      braden = '';
      morse = '';
    } else if (viewevolucao == 2) {
      setviewcomponent(viewevolucao);
      setpoop(fezes);
      if (hd == 1) {
        setviewhd(1);
        sethepa(heparina);
      } else {
        setviewhd(0);
        sethepa(0);
      }
    }
    // limpando braden e morse.
    setshowbraden(0);
    setnewbraden(braden != '' || braden != '0' ? braden : '?');
    setnewmorse(morse != '' || morse != '0' ? morse : '?');
    setpercepcao(4);
    setumidade(4);
    setatividade(4);
    setmobilidade(4);
    setnutricao(4);
    setfriccao(3)
  }, [viewevolucao])

  // atualizando a lista de evoluções.
  const loadEvolucoes = (idpaciente) => {
    axios.get(html + "/evolucoes").then((response) => {
      var x = [0, 1];
      var y = [0, 1];
      x = response.data;
      y = x.filter((item) => item.idpaciente == idpaciente);
      setlistevolucoes(y.sort((a, b) => a.id < b.id ? 1 : -1));
      setarrayevolucao(y.sort((a, b) => a.id < b.id ? 1 : -1));
    });
  }

  // inserindo registro.
  const insertData = () => {
    var evolucao = document.getElementById('inputEvolucao').value.toUpperCase();
    var pas = document.getElementById('inputPas').value.toUpperCase();
    var pad = document.getElementById('inputPad').value.toUpperCase();
    var fc = document.getElementById('inputFc').value.toUpperCase();
    var fr = document.getElementById('inputFr').value.toUpperCase();
    var sao2 = document.getElementById('inputSao2').value.toUpperCase();
    var tax = document.getElementById('inputTax').value.toUpperCase();
    var diu = document.getElementById('inputDiurese').value.toUpperCase();
    var bh = document.getElementById('inputBh').value.toUpperCase();
    // definindo preenchimentos obrigatórios de campos, para médicos e enfermeiros.
    if (funcao < 3 || funcao == 5) {
      if (evolucao != '' && pas != '' && pad != '' && fc != '' && fr != '' && sao2 != '' &&
        tax != '' && diu != '' && poop != '' && bh != '') {
        var obj = {
          idpaciente: idpaciente,
          idatendimento: idatendimento,
          data: moment().format('DD/MM/YY HH:mm'),
          evolucao: evolucao,
          pas: pas,
          pad: pad,
          fc: fc,
          fr: fr,
          sao2: sao2,
          tax: tax,
          diu: diu,
          fezes: poop,
          bh: bh,
          acv: document.getElementById('inputAcv').value,
          ap: document.getElementById('inputAr').value,
          abdome: document.getElementById('inputAbdome').value,
          outros: document.getElementById('inputOutros').value,
          glasgow: document.getElementById('inputGlasgow').value,
          rass: document.getElementById('inputRass').value,
          ramsay: document.getElementById('inputRamsay').value,
          hd: viewhd,
          uf: viewhd === 1 ? document.getElementById('inputUf').value : '',
          heparina: hepa,
          braden: newbraden,
          morse: newmorse,
          status: 0,
          idusuario: idusuario,
          funcao: funcao,
          usuario: usuario,
        };
        axios.post(html + '/insertevolucao', obj).then(() => {
          toast(1, '#52be80', 'EVOLUÇÃO REGISTRADA COM SUCESSO.', 3000);
          setTimeout(() => {
            loadEvolucoes(idpaciente);
            setshowbraden(0);
            fechar();
          }, 4000);
        });
      } else {
        toast(1, '#ec7063', 'CAMPOS OBRIGATÓRIOS EM BRANCO.', 3000);
      }
      // definindo obrigação de preenchimento do campo evolução, para demais profissionais.
    } else {
      if (evolucao !== '') {
        var obj = {
          idpaciente: idpaciente,
          idatendimento: idatendimento,
          data: moment().format('DD/MM/YY HH:mm'),
          evolucao: evolucao,
          pas: '',
          pad: '',
          fc: '',
          fr: '',
          sao2: '',
          tax: '',
          diu: '',
          fezes: '',
          bh: '',
          acv: '',
          ap: '',
          abdome: '',
          outros: '',
          glasgow: '',
          rass: '',
          ramsay: '',
          hd: 0,
          uf: 0,
          heparina: 0,
          braden: 0,
          morse: 0,
          status: 0,
          idusuario: idusuario,
          funcao: funcao,
          usuario: usuario,
        };
        axios.post(html + '/insertevolucao', obj).then(() => {
          toast(1, '#52be80', 'EVOLUÇÃO REGISTRADA COM SUCESSO.', 6000);
          setTimeout(() => {
            loadEvolucoes(idpaciente);
            setshowbraden(0);
            fechar();
          }, 4000);
        });
      } else {
        toast(1, '#ec7063', 'CAMPO OBRIGATÓRIO EM BRANCO.', 6000);
      }
    }
  };

  // inserindo registro.
  const updateData = () => {
    var evolucao = document.getElementById('inputEvolucao').value.toUpperCase();
    var pas = document.getElementById('inputPas').value.toUpperCase();
    var pad = document.getElementById('inputPad').value.toUpperCase();
    var fc = document.getElementById('inputFc').value.toUpperCase();
    var fr = document.getElementById('inputFr').value.toUpperCase();
    var sao2 = document.getElementById('inputSao2').value.toUpperCase();
    var tax = document.getElementById('inputTax').value.toUpperCase();
    var diu = document.getElementById('inputDiurese').value.toUpperCase();
    var bh = document.getElementById('inputBh').value.toUpperCase();
    if (funcao < 3 || funcao == 5) {
      if (evolucao != '' && pas != '' && pad != '' && fc != '' && fr != '' && sao2 != '' &&
        tax != '' && diu !== '' && poop != '' && bh != '') {
        var obj = {
          idpaciente: idpaciente,
          idatendimento: idatendimento,
          data: data,
          evolucao: evolucao,
          pas: pas,
          pad: pad,
          fc: fc,
          fr: fr,
          sao2: sao2,
          tax: tax,
          diu: diu,
          fezes: poop,
          bh: bh,
          acv: document.getElementById('inputAcv').value,
          ap: document.getElementById('inputAr').value,
          abdome: document.getElementById('inputAbdome').value,
          outros: document.getElementById('inputOutros').value,
          glasgow: document.getElementById('inputGlasgow').value,
          rass: document.getElementById('inputRass').value,
          ramsay: document.getElementById('inputRamsay').value,
          hd: viewhd,
          uf: viewhd === 1 ? document.getElementById('inputUf').value : '',
          heparina: hepa,
          braden: newbraden !== '?' ? newbraden : braden,
          morse: newmorse != '?' ? newmorse : morse,
          status: 0,
          idusuario: idusuario,
          funcao: funcao,
          usuario: usuario,
        };
        axios.post(html + '/updateevolucao/' + idevolucao, obj).then(() => {
          toast(1, '#52be80', 'EVOLUÇÃO ATUALIZADA COM SUCESSO.', 3000);
          setTimeout(() => {
            loadEvolucoes(idpaciente);
            setshowbraden(0);
            fechar();
          }, 4000);
        });
      } else {
        toast(1, '#ec7063', 'CAMPOS OBRIGATÓRIOS EM BRANCO.', 3000);
      }
    } else {
      if (evolucao != '') {
        var obj = {
          idpaciente: idpaciente,
          idatendimento: idatendimento,
          data: moment().format('DD/MM/YY HH:mm'),
          evolucao: evolucao,
          pas: '',
          pad: '',
          fc: '',
          fr: '',
          sao2: '',
          tax: '',
          diu: '',
          fezes: '',
          bh: '',
          acv: '',
          ap: '',
          abdome: '',
          outros: '',
          glasgow: '',
          rass: '',
          ramsay: '',
          hd: 0,
          uf: 0,
          heparina: 0,
          braden: 0,
          morse: 0,
          status: 0,
          idusuario: idusuario,
          funcao: funcao,
          usuario: usuario,
        };
        axios.post(html + '/updateevolucao/' + idevolucao, obj).then(() => {
          toast(1, '#52be80', 'EVOLUÇÃO ATUALIZADA COM SUCESSO.', 6000);
          setTimeout(() => {
            loadEvolucoes(idpaciente);
            setshowbraden(0);
            fechar();
          }, 4000);
        });
      } else {
        toast(1, '#ec7063', 'CAMPO OBRIGATÓRIO EM BRANCO.', 6000);
      }
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
    }, time + 1000);
  }

  // validando entradas para campos numéricos.
  const validateGlasgow = (txt) => {
    var last = txt.slice(-1);
    if (isNaN(last) === true) {
      last = '';
      document.getElementById('inputGlasgow').value = '';
    } else {
    }
  };

  const validateRass = (txt) => {
    var last = txt.slice(-1);
    if (isNaN(last) === true) {
      last = '';
      document.getElementById('inputRass').value = '';
    } else {
    }
  };

  const validateRamsay = (txt) => {
    var last = txt.slice(-1);
    if (isNaN(last) === true) {
      last = '';
      document.getElementById('inputRamsay').value = '';
    } else {
    }
  };

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
  const validateBh = (txt) => {
    var number = /[0-9]/;
    var sign = /[-]/;
    var last = txt.slice(-1);
    if (last.match(number) !== null || last.match(sign) !== null) {
    } else {
      document.getElementById('inputBh').value = '';
    }
  };
  const validateUf = (txt) => {
    var number = /[0-9]/;
    var last = txt.slice(-1);
    if (last.match(number) !== null) {
      setultrafiltrado(txt);
      setTimeout(() => {
        document.getElementById('inputUf').focus();
      }, 100);
    } else {
      document.getElementById('inputUf').value = '';
    }
  };

  const [viewhd, setviewhd] = useState(0);
  function Hemodialise() {
    if (viewhd === 1) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <input
            className="input"
            autoComplete="off"
            placeholder="UF"
            title="ULTRAFILTRADO (PERDAS EM ML)."
            defaultValue={ultrafiltrado}
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'UF')}
            onChange={(e) => validateUf(e.target.value)}
            style={{
              height: 50,
              width: window.innerWidth > 800 ? 100 : 50,
              margin: 0,
              padding: 0,
            }}
            id="inputUf"
            maxLength={4}
          ></input>
          <button
            className={hepa === 1 ? "red-button" : "blue-button"}
            title="USO DE HEPARINA NA DIÁLISE."
            defaultValue={hepa}
            onClick={() => changeUf()}
            style={{
              padding: 10,
              margin: 0,
              marginLeft: 10,
              width: 100,
              height: 50,
              backgroundColor: hepa === 1 ? '#ec7063' : '#8f9bbc'
            }}
          >
            HEPARINA
          </button>
        </div>
      )
    } else {
      return null;
    }
  }

  const [ultrafiltrado, setultrafiltrado] = useState(0);
  const changeUf = () => {
    setultrafiltrado(document.getElementById("inputUf").value)
    if (hepa == 0) {
      sethepa(1);
    } else {
      sethepa(0);
    }
  }

  // CLASSIFICAÇÃO DE BRADEN.
  const [percepcao, setpercepcao] = useState(4);
  const [umidade, setumidade] = useState(4);
  const [atividade, setatividade] = useState(4);
  const [mobilidade, setmobilidade] = useState(4);
  const [nutricao, setnutricao] = useState(4);
  const [friccao, setfriccao] = useState(3);

  const [newbraden, setnewbraden] = useState(braden);
  const setBraden = () => {
    setnewbraden(percepcao + umidade + atividade + mobilidade + nutricao + friccao);
    setshowbraden(0);
  }

  const [showbraden, setshowbraden] = useState(0);
  function Braden() {
    if (showbraden === 1) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#ffffff', padding: 5, borderRadius: 10, margin: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
            <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>PERCEPÇÃO SENSORIAL:</div>
            <button
              onClick={() => { setpercepcao(1) }}
              className={percepcao === 1 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              TOTALMENTE LIMITADO
            </button>
            <button
              onClick={() => { setpercepcao(2) }}
              className={percepcao === 2 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              MUITO LIMITADO
            </button>
            <button
              onClick={() => { setpercepcao(3) }}
              className={percepcao === 3 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              LEVEMENTE LIMITADO
            </button>
            <button
              onClick={() => { setpercepcao(4) }}
              className={percepcao === 4 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              NENHUMA LIMITAÇÃO
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
            <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>UMIDADE:</div>
            <button
              onClick={() => { setumidade(1) }}
              className={umidade === 1 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              COMPLETAMENTE MOLHADO
            </button>
            <button
              onClick={() => { setumidade(2) }}
              className={umidade === 2 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              MUITO MOLHADO
            </button>
            <button
              onClick={() => { setumidade(3) }}
              className={umidade === 3 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              OCASIONALMENTE MOLHADO
            </button>
            <button
              onClick={() => { setumidade(4) }}
              className={umidade === 4 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              RARAMENTE MOLHADO
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
            <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>ATIVIDADE:</div>
            <button
              onClick={() => { setatividade(1) }}
              className={atividade === 1 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              ACAMADO
            </button>
            <button
              onClick={() => { setatividade(2) }}
              className={atividade === 2 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              CONFINADO À CADEIRA
            </button>
            <button
              onClick={() => { setatividade(3) }}
              className={atividade === 3 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              ANDA OCASIONALMENTE
            </button>
            <button
              onClick={() => { setatividade(4) }}
              className={atividade === 4 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              ANDA FREQUENTEMENTE
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
            <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>MOBILIDADE:</div>
            <button
              onClick={() => { setmobilidade(1) }}
              className={mobilidade === 1 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              TOTALMENTE LIMITADO
            </button>
            <button
              onClick={() => { setmobilidade(2) }}
              className={mobilidade === 2 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              BASTANTE LIMITADO
            </button>
            <button
              onClick={() => { setmobilidade(3) }}
              className={mobilidade === 3 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              LEVEMENTE LIMITADO
            </button>
            <button
              onClick={() => { setmobilidade(4) }}
              className={mobilidade === 4 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              NÃO APRESENTA LIMITAÇÕES
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
            <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>NUTRIÇÃO:</div>
            <button
              onClick={() => { setnutricao(1) }}
              className={nutricao === 1 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              MUITO POBRE
            </button>
            <button
              onClick={() => { setnutricao(2) }}
              className={nutricao === 2 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              PROVAVELMENTE INADEQUADA
            </button>
            <button
              onClick={() => { setnutricao(3) }}
              className={nutricao === 3 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              ADEQUADA
            </button>
            <button
              onClick={() => { setnutricao(4) }}
              className={nutricao === 4 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              EXCELENTE
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
            <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>FRICÇÃO E CISALHAMENTO:</div>
            <button
              onClick={() => { setfriccao(1) }}
              className={friccao === 1 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              PROBLEMA
            </button>
            <button
              onClick={() => { setfriccao(2) }}
              className={friccao === 2 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              PROBLEMA POTENCIAL
            </button>
            <button
              onClick={() => { setfriccao(3) }}
              className={friccao === 3 ? "red-button" : "blue-button"}
              style={{ width: 150 }}>
              NENHUM PROBLEMA
            </button>
            <button className="blue-button" disabled="true" style={{ width: 150, opacity: 0.5 }}></button>
          </div>
          <button
            onClick={() => { setBraden() }}
            className="green-button"
            style={{ width: 150, alignSelf: 'center' }}>
            CONCLUÍDO
          </button>
        </div>
      );
    } else {
      return null;
    }
  }

  // CLASSIFICAÇÃO DE MORSE.
  const [quedas, setquedas] = useState(0);
  const [diagsec, setdiagsec] = useState(0);
  const [auxilio, setauxilio] = useState(0);
  const [endovenosa, setendovenosa] = useState(0);
  const [marcha, setmarcha] = useState(0);
  const [mental, setmental] = useState(0);

  const [newmorse, setnewmorse] = useState(morse);
  const setMorse = () => {
    setnewmorse(quedas + diagsec + auxilio + endovenosa + marcha + mental);
    setshowmorse(0);
  }

  const [showmorse, setshowmorse] = useState(0);
  function Morse() {
    if (showmorse === 1) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', backgroundColor: '#ffffff', padding: 5, borderRadius: 10, margin: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
            <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>HISTÓRICO DE QUEDAS:</div>
            <button
              onClick={() => { setquedas(0) }}
              className={quedas === 0 ? "red-button" : "blue-button"}
              style={{ width: 150, padding: 10 }}>
              NÃO
            </button>
            <button
              onClick={() => { setquedas(25) }}
              className={quedas === 25 ? "red-button" : "blue-button"}
              style={{ width: 150, padding: 10 }}>
              SIM
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
            <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>DIAGNÓSTICO SECUNDÁRIO:</div>
            <button
              onClick={() => { setdiagsec(0) }}
              className={diagsec === 0 ? "red-button" : "blue-button"}
              style={{ width: 150, padding: 10 }}>
              NÃO
            </button>
            <button
              onClick={() => { setdiagsec(15) }}
              className={diagsec === 15 ? "red-button" : "blue-button"}
              style={{ width: 150, padding: 10 }}>
              SIM
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
            <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>AUXÍLIO NA DEAMBULAÇÃO:</div>
            <button
              onClick={() => { setauxilio(0) }}
              className={auxilio === 0 ? "red-button" : "blue-button"}
              style={{ width: 150, padding: 10 }}>
              NENHUM, ACAMADO OU AUXILIADO POR PROFISSIONAL DE SAÚDE
            </button>
            <button
              onClick={() => { setauxilio(15) }}
              className={auxilio === 15 ? "red-button" : "blue-button"}
              style={{ width: 150, padding: 10 }}>
              MULETAS, BENGALA OU ANDADOR
            </button>
            <button
              onClick={() => { setauxilio(30) }}
              className={auxilio === 30 ? "red-button" : "blue-button"}
              style={{ width: 150, padding: 10 }}>
              MOBILIÁRIO OU PAREDE
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
            <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>TERAPIA ENDOVENOSA OU CATETER VENOSO:</div>
            <button
              onClick={() => { setendovenosa(0) }}
              className={endovenosa === 0 ? "red-button" : "blue-button"}
              style={{ width: 150, padding: 10 }}>
              NÃO
            </button>
            <button
              onClick={() => { setendovenosa(20) }}
              className={endovenosa === 20 ? "red-button" : "blue-button"}
              style={{ width: 150, padding: 10 }}>
              SIM
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
            <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>MARCHA:</div>
            <button
              onClick={() => { setmarcha(0) }}
              className={marcha === 0 ? "red-button" : "blue-button"}
              style={{ width: 150, padding: 10 }}>
              NORMAL, CADEIRANTE OU ACAMADO
            </button>
            <button
              onClick={() => { setmarcha(10) }}
              className={marcha === 10 ? "red-button" : "blue-button"}
              style={{ width: 150, padding: 10 }}>
              FRACA
            </button>
            <button
              onClick={() => { setmarcha(20) }}
              className={marcha === 20 ? "red-button" : "blue-button"}
              style={{ width: 150, padding: 10 }}>
              COMPROMETIDA, CAMBALEANTE
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
            <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>ESTADO MENTAL:</div>
            <button
              onClick={() => { setmental(0) }}
              className={mental === 0 ? "red-button" : "blue-button"}
              style={{ width: 150, padding: 10 }}>
              ORIENTADO E CAPAZ QUANTO A SUA LIMITAÇÃO
            </button>
            <button
              onClick={() => { setmental(15) }}
              className={mental === 15 ? "red-button" : "blue-button"}
              style={{ width: 150, padding: 10 }}>
              SUPERESTIMA CAPACIDADES E ESQUECE LIMITAÇÕES
            </button>
          </div>
          <button
            onClick={() => { setMorse() }}
            className="green-button"
            style={{ width: 150, alignSelf: 'center' }}>
            CONCLUÍDO
          </button>
        </div>
      );
    } else {
      return null;
    }
  }

  const fechar = () => {
    setviewcomponent(0);
    window.scrollTo(0, 0);
    document.body.style.overflow = null;
    //history.push('/refresh')
    //history.push('/prontuario')
  }

  // estados relacionados ao menu (controla a exibição dos componentes da evolução).
  const [page, setpage] = useState(1);

  // renderização do componente.
  if (viewcomponent !== 0) {
    return (
      <div className="menucover fade-in" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Toast valortoast={valortoast} cor={cor} mensagem={mensagem} tempo={tempo} />
        <div className="menucontainer" style={{ width: 0.9 * window.innerWidth, height: 0.9 * window.innerHeight, justifyContent: 'flex-start' }}>
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{viewcomponent == 1 ? 'INSERIR EVOLUÇÃO' : 'EDITAR EVOLUÇÃO'}</div>
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
                onClick={viewcomponent == 1 ? () => insertData() : () => updateData()}
              // onMouseOver={() => poop == '' ? toast(1, '#ec7063', 'FAVOR INFORMAR EVACUAÇÃO.', 3000) : null}
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
          <div className="corpo"
            style={{
              display: 'flex', flexDirection: 'row', justifyContent: 'center',
              alignItems: 'center', padding: 20, height: '100%', width: '100%',
            }}
          >
            <div id="MENU DA EVOLUÇÃO"
              className="widget"
              style={{ flexDirection: 'column', width: 200, backgroundColor: 'grey', margin: 10 }}
            >
              <button className={page == 1 ? "red-button" : "blue-button"} style={{ width: '100%', margin: 10 }} onClick={() => setpage(1)}>
                EVOLUÇÃO
              </button>
              <button className={page == 2 ? "red-button" : "blue-button"} style={{ width: '100%', margin: 10 }} onClick={() => setpage(2)}>
                ESCALAS
              </button>
              <button className={page == 3 ? "red-button" : "blue-button"} style={{ width: '100%', margin: 10 }} onClick={() => setpage(3)}>
                CONTROLES
              </button>
              <button className={page == 4 ? "red-button" : "blue-button"} style={{ width: '100%', margin: 10 }} onClick={() => setpage(4)}>
                EXAME FISICO
              </button>
            </div>
            <div id="PÁGINAS DA EVOLUÇÃO"
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                alignItems: 'center', margin: 5, width: '100%', height: '100%',
              }}>
              <div id="EVOLUÇÃO(TEXTO)"
                style={{ display: page == 1 ? 'flex' : 'none', padding: 20, width: '100%', height: '100%' }}>
                <textarea
                  autoComplete="off"
                  className="textarea"
                  placeholder="EVOLUÇÃO."
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'EVOLUÇÃO.')}
                  defaultValue={viewevolucao == 2 ? evolucao : ''}
                  title="EVOLUÇÃO."
                  style={{
                    width: '100%',
                    height: '100%',
                    margin: 0,
                  }}
                  type="text"
                  maxLength={600}
                  id="inputEvolucao"
                ></textarea>
              </div>
              <div id="ESCALAS" className="scroll"
                style={{ display: page == 2 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'flex-start', height: '100%', width: '100%', padding: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                  <input
                    className="input"
                    autoComplete="off"
                    placeholder="GLASGOW"
                    title="GLASGOW"
                    defaultValue={viewevolucao == 2 ? glasgow : ''}
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'GLASGOW')}
                    onChange={(e) => validateGlasgow(e.target.value)}
                    style={{
                      minHeight: 50,
                      width: 100,
                      textAlign: 'center',
                    }}
                    min={3}
                    max={15}
                    id="inputGlasgow"
                    maxLength={2}
                    type="number"
                  ></input>
                  <input
                    className="input"
                    autoComplete="off"
                    placeholder="RASS"
                    title="RASS"
                    defaultValue={viewevolucao == 2 ? rass : ''}
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'RASS')}
                    onChange={(e) => validateRass(e.target.value)}
                    style={{
                      minHeight: 50,
                      width: 100,
                      textAlign: 'center',
                    }}
                    min={-5}
                    max={4}
                    id="inputRass"
                    type="float"
                    maxLength={2}
                  ></input>
                  <input
                    className="input"
                    autoComplete="off"
                    placeholder="RAMSAY"
                    title="RAMSAY"
                    defaultValue={viewevolucao == 2 ? ramsay : ''}
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'RAMSAY')}
                    onChange={(e) => validateRamsay(e.target.value)}
                    style={{
                      minHeight: 50,
                      width: 100,
                      textAlign: 'center',
                    }}
                    min={1}
                    max={6}
                    id="inputRamsay"
                    type="float"
                    maxLength={1}
                  ></input>
                </div>
                <div id="BRADEN E MORSE" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: window.innerWidth > 800 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
                    <label className="title2" style={{ marginTop: 15, fontSize: 14 }}> BRADEN:</label>
                    <button
                      className={showbraden === 1 ? "red-button" : "blue-button"}
                      onClick={() => setshowbraden(1)}
                      style={{
                        display: showbraden === 1 ? 'none' : 'flex',
                        padding: 10,
                        width: 300,
                        alignSelf: 'center',
                      }}
                    >
                      {newbraden > 14 ? 'BRADEN: ' + newbraden + ' - RISCO BAIXO' : newbraden > 12 && newbraden < 15 ? 'BRADEN: ' + newbraden + ' - RISCO MODERADO' : newbraden > 9 && newbraden < 13 ? 'BRADEN: ' + newbraden + ' - RISCO ALTO' : newbraden < 10 ? 'BRADEN: ' + newbraden + ' - RISCO MUITO ALTO' : 'BRADEN ?'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <Braden></Braden>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <label className="title2" style={{ marginTop: 15, fontSize: 14 }}> MORSE:</label>
                    <button
                      className={showmorse === 1 ? "red-button" : "blue-button"}
                      onClick={() => setshowmorse(1)}
                      style={{
                        display: showmorse === 1 ? 'none' : 'flex',
                        padding: 10,
                        width: 300,
                        alignSelf: 'center',
                      }}
                    >
                      {newmorse < 41 ? 'MORSE: ' + newmorse + ' - RISCO MÉDIO' : newmorse > 40 && newmorse < 52 ? 'MORSE: ' + newmorse + ' - RISCO ELEVADO' : newmorse > 51 ? 'MORSE: ' + newmorse + ' - RISCO MUITO ELEVADO' : 'MORSE ?'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <Morse></Morse>
                  </div>
                </div>
              </div>
              <div id="CONTROLES"
                style={{
                  display: page == 3 ? 'flex' : 'none', flexDirection: 'column',
                  justifyContent: 'center', alignItems: 'center',
                  height: '100%', width: '100%'
                }}>
                <div id="dados vitais"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <div id="PAS" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <label
                      className="title2"
                    >
                      PAS:
                    </label>
                    <input
                      className="input"
                      autoComplete="off"
                      placeholder="PAS"
                      defaultValue={viewevolucao == 2 ? pas : listbalancos.slice(-1).map(item => item.pas)}
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'PAS')}
                      onChange={(e) => validatePas(e.target.value)}
                      title="PRESSÃO ARTERIAL SISTÓLICA."
                      style={{
                        height: 50,
                        margin: 5,
                        width: window.innerWidth > 800 ? 100 : 50,
                      }}
                      id="inputPas"
                      maxLength={3}
                    ></input>
                  </div>
                  <div id="PAD" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <label
                      className="title2"
                    >
                      PAD:
                    </label>
                    <input
                      className="input"
                      autoComplete="off"
                      placeholder="PAD"
                      defaultValue={viewevolucao == 2 ? pad : listbalancos.slice(-1).map(item => item.pad)}
                      title="PRESSÃO ARTERIAL DIASTÓLICA."
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'PAD')}
                      onChange={(e) => validatePad(e.target.value)}
                      style={{
                        height: 50,
                        margin: 5,
                        width: window.innerWidth > 800 ? 100 : 50,
                      }}
                      id="inputPad"
                      maxLength={3}
                    ></input>
                  </div>
                  <div id="FC" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <label
                      className="title2"
                    >
                      FC:
                    </label>
                    <input
                      className="input"
                      autoComplete="off"
                      placeholder="FC"
                      defaultValue={viewevolucao == 2 ? fc : listbalancos.slice(-1).map(item => item.fc)}
                      title="FREQUÊNCIA CARDÍACA."
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'FC')}
                      onChange={(e) => validateFc(e.target.value)}
                      style={{
                        height: 50,
                        margin: 5,
                        width: window.innerWidth > 800 ? 100 : 50,
                      }}
                      id="inputFc"
                      maxLength={3}
                    ></input>
                  </div>
                  <div id="FR" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <label
                      className="title2"
                    >
                      FR:
                    </label>
                    <input
                      className="input"
                      autoComplete="off"
                      placeholder="FR"
                      defaultValue={viewevolucao == 2 ? fr : listbalancos.slice(-1).map(item => item.fr)}
                      title="FREQUÊNCIA RESPIRATÓRIA."
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'FR')}
                      onChange={(e) => validateFr(e.target.value)}
                      style={{
                        height: 50,
                        margin: 5,
                        width: window.innerWidth > 800 ? 100 : 50,
                      }}
                      id="inputFr"
                      maxLength={2}
                    ></input>
                  </div>
                  <div id="TAX" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <label
                      className="title2"
                    >
                      TAX:
                    </label>
                    <input
                      className="input"
                      autoComplete="off"
                      placeholder="TAX"
                      title="TEMPERATURA AXILAR."
                      defaultValue={viewevolucao == 2 ? tax : listbalancos.slice(-1).map(item => item.tax)}
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'TAX')}
                      onChange={(e) => validateTax(e.target.value)}
                      style={{
                        height: 50,
                        margin: 5,
                        width: window.innerWidth > 800 ? 100 : 50,
                      }}
                      id="inputTax"
                      maxLength={4}
                    ></input>
                  </div>
                  <div id="SAO2" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <label
                      className="title2"
                    >
                      SAO2:
                    </label>
                    <input
                      className="input"
                      autoComplete="off"
                      placeholder="SAO2"
                      title="SAO2."
                      defaultValue={viewevolucao == 2 ? sao2 : listbalancos.slice(-1).map(item => item.sao2)}
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'SAO2')}
                      onChange={(e) => validateSao2(e.target.value)}
                      style={{
                        height: 50,
                        margin: 5,
                        width: window.innerWidth > 800 ? 100 : 50,
                      }}
                      id="inputSao2"
                      min={0}
                      max={100}
                    ></input>
                  </div>
                </div>
                <div id="evacuações"
                  style={{
                    display: funcao < 3 || funcao == 5 || funcao == 4 ? 'flex' : 'none', // chefe, médico, enfermeira ou técnico de enfermagem.
                    flexDirection: 'column',
                    borderRadius: 5,
                  }}
                >
                  <label className="title2">
                    EVACUAÇÕES:
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <button
                      className="blue-button"
                      onClick={() => setpoop('AUSENTES')}
                      style={{
                        padding: 10,
                        marginTop: 5,
                        marginRight: 10,
                        width: window.innerWidth > 800 ? 100 : 75,
                        backgroundColor: poop === 'AUSENTES' ? '#ec7063' : '#8f9bbc',
                      }}
                    >
                      AUSENTES
                    </button>
                    <button
                      className="blue-button"
                      onClick={() => setpoop('NORMAIS')}
                      style={{
                        padding: 10,
                        marginTop: 5,
                        marginRight: 10,
                        width: window.innerWidth > 800 ? 100 : 75,
                        backgroundColor: poop === 'NORMAIS' ? '#ec7063' : '#8f9bbc',
                      }}
                    >
                      NORMAIS
                    </button>
                    <button
                      className="blue-button"
                      onClick={() => setpoop('DIARRÉIA')}
                      style={{
                        padding: 10,
                        marginTop: 5,
                        marginRight: 10,
                        width: window.innerWidth > 800 ? 100 : 75,
                        backgroundColor: poop === 'DIARRÉIA' ? '#ec7063' : '#8f9bbc',
                      }}
                    >
                      DIARRÉIA
                    </button>
                  </div>
                </div>
                <div id="diurese"
                  style={{
                    display: funcao < 3 || funcao == 5 || funcao == 4 ? 'flex' : 'none', flexDirection: 'row' // chefe, médico, enfermeira e técnico de enfermagem.
                  }}>
                  <div>
                    <label
                      className="title2"
                    >
                      DIURESE:
                    </label>
                    <input
                      className="input"
                      autoComplete="off"
                      placeholder="DIURESE"
                      title="DIURESE."
                      defaultValue={viewevolucao == 2 ? diu : listbalancos.slice(-1).map(item => item.diurese)}
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'DIURESE')}
                      onChange={(e) => validateDiu(e.target.value)}
                      style={{
                        height: 50,
                        margin: 5,
                        width: 100,
                        marginBottom: 0,
                      }}
                      id="inputDiurese"
                      maxLength={4}
                    ></input>
                  </div>
                  <div style={{ display: 'none' }}>
                    <label
                      className="title2"
                    >
                      BH:
                    </label>
                    <input
                      className="input"
                      autoComplete="off"
                      placeholder="BH"
                      title="BALANÇO HÍDRICO."
                      defaultValue={viewevolucao == 2 ? bh : listbalancos.slice(-1).map(item => item.bh)}
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'BH')}
                      onChange={(e) => validateBh(e.target.value)}
                      style={{
                        height: 50,
                        margin: 5,
                        width: 100,
                        marginBottom: 0,
                        marginLeft: 5,
                      }}
                      id="inputBh"
                      maxLength={5}
                    ></input>
                  </div>
                  <div style={{ marginLeft: 10 }}>
                    <label
                      className="title2"
                    >
                      HEMODIÁLISE:
                    </label>
                    <div id="hemodiálise"
                      style={{ display: funcao < 3 || funcao == 5 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center' }}>
                      <button
                        className="blue-button"
                        onClick={() => viewhd === 1 ? setviewhd(0) : setviewhd(1)}
                        title="HEMODIÁLISE."
                        style={{
                          display: funcao < 3 || funcao == 5 ? 'flex' : 'none',
                          padding: 10,
                          margin: 0,
                          marginRight: viewhd === 1 ? 10 : 0,
                          backgroundColor: viewhd === 1 ? '#ec7063' : '#8f9bbc',
                        }}
                      >
                        HD
                      </button>
                      <Hemodialise></Hemodialise>
                    </div>
                  </div>
                </div>
              </div>
              <div id="EXAME CLÍNICO"
                style={{
                  display: page == 4 ? 'flex' : 'none', flexDirection: 'column',
                  justifyContent: 'center', alignItems: 'center',
                  height: '100%', width: '100%', padding: 20,
                }}>
                <div id="ACV E AP" style={{ display: funcao < 3 ? 'flex' : 'none', flexDirection: 'row' }}>
                  <div>
                    <label
                      className="title2"
                    >
                      {'APARELHO CARDIOVASCULAR:'}
                    </label>
                    <textarea
                      className="textarea"
                      autoComplete="off"
                      placeholder="APARELHO CARDIOVASCULAR."
                      title="APARELHO CARDIOVASCULAR."
                      defaultValue={viewevolucao == 2 ? acv : ''}
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'ACV.')}
                      style={{
                        width: 0.3 * window.innerWidth,
                        height: 100,
                        marginRight: window.innerWidth > 800 ? 10 : 2.5,
                      }}
                      type="text"
                      id="inputAcv"
                      maxLength={50}
                    ></textarea>
                  </div>
                  <div>
                    <label
                      className="title2"
                    >
                      {'APARELHO RESPIRATÓRIO:'}
                    </label>
                    <textarea
                      className="textarea"
                      autoComplete="off"
                      placeholder="APARELHO RESPIRATÓRIO."
                      title="APARELHO RESPIRATÓRIO."
                      defaultValue={viewevolucao == 2 ? ar : ''}
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'AR.')}
                      style={{
                        width: 0.3 * window.innerWidth,
                        height: 100,
                      }}
                      type="text"
                      id="inputAr"
                      maxLength={50}
                    ></textarea>
                  </div>
                </div>
                <div id="ABDOME E OUTROS" style={{ display: funcao < 3 ? 'flex' : 'none', flexDirection: 'row', marginBottom: 5 }}>
                  <div>
                    <label
                      className="title2"
                    >
                      ABDOME:
                    </label>
                    <textarea
                      className="textarea"
                      autoComplete="off"
                      placeholder="ABDOME."
                      title="ABDOME."
                      defaultValue={viewevolucao == 2 ? abdome : ''}
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'ABDOME.')}
                      style={{
                        width: 0.3 * window.innerWidth,
                        height: 100,
                        marginRight: window.innerWidth > 800 ? 10 : 2.5,
                      }}
                      type="text"
                      id="inputAbdome"
                      maxLength={50}
                    ></textarea>
                  </div>
                  <div>
                    <label
                      className="title2"
                    >
                      OUTROS:
                    </label>
                    <textarea
                      className="textarea"
                      autoComplete="off"
                      placeholder="OUTROS."
                      title="OUTROS DADOS CLÍNICOS IMPORTANTES."
                      defaultValue={viewevolucao == 2 ? outros : ''}
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'OUTROS.')}
                      style={{
                        width: 0.3 * window.innerWidth,
                        height: 100,
                      }}
                      type="text"
                      id="inputOutros"
                      maxLength={50}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return null;
  };
}
export default Evolucao;
