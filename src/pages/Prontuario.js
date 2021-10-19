/* eslint eqeqeq: "off" */

/* 
REFERÊNCIAS IMPORTANTES: 
a) tipousuario: técnico = 4, farmácia = 6, enfermeira = 5, secretária = 3, médico = 1, chefe = 2
b) tipounidade: 1 = pronto-atendimento, 2 = unidades de internação (enfermarias, ctis), 3 = bloco cirúrgico, 4 = ambulatórios.
*/

// importando bibliotecas.
import React, { useState, useContext, useCallback } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/pt-br';
import Context from '../Context';
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// importando css.
import '../design.css';
// importando imagens.
import body from '../images/body.png';
import dorso from '../images/dorso.svg';
import newlogo from '../images/newlogo.svg';
import logoinverted from '../images/newlogoinverted.svg'
import deletar from '../images/deletar.svg';
import suspender from '../images/suspender.svg';
import editar from '../images/editar.svg';
import salvar from '../images/salvar.svg';
import copiar from '../images/copiar.svg';
import invasoes from '../images/invasoes.svg';
import curativo from '../images/curativo.svg';
import viewimage from '../images/viewimage.svg';
import imprimir from '../images/imprimir.svg';
import novo from '../images/novo.svg';
import menu from '../images/menu.svg';
import microfone from '../images/microfone.svg';
import logoff from '../images/power.svg';
import back from '../images/back.svg';
import foto from '../images/3x4.jpg';
import clock from '../images/clock.svg';
// importando componentes de sobreposição.
import UpdateAtendimento from '../components/UpdateAtendimento';
import Evolucao from '../components/Evolucao';
import Diagnostico from '../components/Diagnosticos';
import Problemas from '../components/Problemas';
import Propostas from '../components/Propostas';
import Interconsultas from '../components/Interconsultas';
import Laboratorio from '../components/Laboratorio';
import Imagem from '../components/Imagem';
import Balanco from '../components/Balanco';
import Formularios from '../components/Formularios';
import PrintEvolucao from '../components/PrintEvolucao';
import Toast from '../components/Toast';
import DatePicker from '../components/DatePicker';
import Prescricao from '../components/Prescricao';
import PrintFormulario from '../components/PrintFormulario';

function Prontuario() {
  moment.locale('pt-br');
  var html = 'https://pulsarapp-server.herokuapp.com';
  // recuperando estados globais (Context.API).
  const {
    idusuario,
    nomeusuario,
    tipousuario,
    especialidadeusuario,
    conselhousuario,
    nomehospital,
    nomeunidade,
    tipounidade,
    setidatendimento,
    idatendimento,
    setidpaciente,
    idpaciente,
    nomepaciente, setnomepaciente,
    dn, setdn,
    box, setbox,
    setpickdate1,
    pickdate1,
    setpickdate2,
    pickdate2,
    stateprontuario,
    setstateprontuario,
    scrolllist, setscrolllist,
    scrollmenu, setscrollmenu,
    // listas.
    listevolucoes, setlistevolucoes,
    arrayevolucao, setarrayevolucao,
    listdiagnosticos, setlistdiagnosticos,
    arraydiagnosticos, setarraydiagnosticos,
    listproblemas, setlistproblemas,
    arrayproblemas, setarrayproblemas,
    listpropostas, setlistpropostas,
    arraypropostas, setarraypropostas,
    listinterconsultas, setlistinterconsultas,
    arrayinterconsultas, setarrayinterconsultas,
    listlaboratorio, setlistlaboratorio,
    arraylaboratorio, setarraylaboratorio,
    listimagem, setlistimagem,
    arrayimagem, setarrayimagem,
    listbalancos, setlistbalancos,
    listformularios, setlistformularios,
    arrayformularios, setarrayformularios,
  } = useContext(Context)
  // history (react-router-dom).
  let history = useHistory()

  // speech recognizer (better).
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  function GetSpeech() {
    return (
      <button
        style={{
          display: window.innerWidth < 800 && (stateprontuario == 2 || stateprontuario == 4) ? 'flex' : 'none',
          position: 'fixed',
          bottom: 5,
          marginLeft: 0, marginRight: 0,
          borderRadius: 50,
          height: 65, width: 65,
          opacity: 1,
          zIndex: 1
        }}
        className={listening ? "red-button" : "purple-button"}
        onTouchStart={
          listening ?
            () => { SpeechRecognition.stopListening(); insertSpeech(); resetTranscript() } :
            () => { resetTranscript(); SpeechRecognition.startListening({ continuous: true }); }
        }
      >
        <img
          alt=""
          src={microfone}
          style={{
            margin: 10,
            height: 30,
            width: 30,
          }}
        ></img>
      </button>
    )
  }

  function ShowSpeech() {
    return (
      <button className="green-button"
        style={{
          display: transcript.length > 0 ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'fixed',
          bottom: 100,
          marginLeft: 0, marginRight: 0,
          maxWidth: 0.6 * window.innerWidth,
          maxHeight: 0.5 * window.innerHeight,
          padding: 10
        }}>
        {transcript.toUpperCase()}
        <button className="red-button"
          onClick={() => resetTranscript()}
          style={{ margin: 0, marginTop: 10 }}
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
      </button>
    )
  }

  const insertSpeech = () => {
    if (stateprontuario == 2 && transcript.length > 0) { // evolução.
      var obj = {
        idpaciente: idpaciente,
        idatendimento: idatendimento,
        data: moment().format('DD/MM/YY HH:mm'),
        evolucao: transcript.toUpperCase(),
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
        glasgow: 0,
        rass: 0,
        ramsay: 0,
        hd: 0,
        uf: 0,
        heparina: 0,
        braden: 0,
        morse: 0,
        status: 0,
        idusuario: idusuario,
        funcao: tipousuario,
        usuario: nomeusuario,
      };
      axios.post(html + '/insertevolucao', obj).then(() => {
        toast(1, '#52be80', 'EVOLUÇÃO INSERIDA COM SUCESSO', 3000);
        resetTranscript();
        loadEvolucoes(idpaciente);
      });
    } else if (stateprontuario == 4 && transcript.length > 0) {
      var obj = {
        idatendimento: idatendimento,
        inicio: moment().format('DD/MM/YYYY'),
        termino: '',
        proposta: transcript.toUpperCase(),
      };
      axios.post(html + '/insertprop', obj).then(() => {
        toast(1, '#52be80', 'PROPOSTA REGISTRADA COM SUCESSO.', 3000);
        resetTranscript();
        loadPropostas();
      });
    } else {
    }
  }

  // estados relacionados ao paciente e seu atendimento.
  const [peso, setpeso] = useState('');
  const [altura, setaltura] = useState('');
  const [admissao, setadmissao] = useState('');
  const [antecedentes, setantecedentes] = useState('');
  const [alergias, setalergias] = useState('');
  const [medicacoes, setmedicacoes] = useState('');
  const [exames, setexames] = useState('');
  const [historia, sethistoria] = useState('');
  const [status, setstatus] = useState(0);
  const [ativo, setativo] = useState('');
  var statusatendimento = 0;
  const [classificacao, setclassificacao] = useState('');
  const [descritor, setdescritor] = useState('');
  const [precaucao, setprecaucao] = useState(0);
  const [assistente, setassistente] = useState('SEM MÉDICO ASSISTENTE');

  // carregando os dados do paciente.
  const [listpacientes, setlistpacientes] = useState([]);
  const loadPaciente = (idpcte) => {
    axios.get(html + "/pacientes").then((response) => {
      setlistpacientes(response.data);
      var x = [0, 1];
      x = response.data;
      setnomepaciente(x.filter((item) => item.id == idpcte).map((item) => item.nome));
      setdn(x.filter((item) => item.id == idpcte).map((item) => item.dn));
      setTimeout(() => {
        setidade(moment().diff(moment(x.filter((item) => item.id == idpaciente).map((item) => item.dn), 'DD/MM/YYYY'), 'years'));
      }, 1000);
    });
  }

  // carregando o atendimento do paciente selecionado.
  const [listatendimentos, setlistatendimentos] = useState([]);
  const loadAtendimento = () => {
    axios.get(html + "/atendimentos").then((response) => {
      setlistatendimentos(response.data);
      var y = [0, 1];
      y = response.data;
      var x = [0, 1];
      x = y.filter((value) => value.id == idatendimento);
      setidpaciente(x.map((item) => item.idpaciente));
      setbox(x.map((item) => item.box));
      setdiasinternado(moment().diff(moment(admissao, 'DD/MM/YYYY'), 'days'));
      setadmissao(x.map((item) => item.admissao));
      setpeso(x.map((item) => item.peso));
      setaltura(x.map((item) => item.altura));
      setantecedentes(x.map((item) => item.antecedentes));
      setalergias(x.map((item) => item.alergias));
      setmedicacoes(x.map((item) => item.medicacoes));
      setexames(x.map((item) => item.exames));
      sethistoria(x.map((item) => item.historia));
      setstatus(x.map((item) => item.status));
      setativo(x.map((item) => item.ativo));
      setclassificacao(x.map((item) => item.classificacao))
      statusatendimento = x.map((item) => item.ativo);
      // recuperando informações de identificação do paciente.
      loadPaciente(x.map((item) => item.idpaciente));
      // carregando a última evolução.
      loadLastevolucao(idatendimento, x.map((item) => item.idpaciente));
      // atualizando informações do painel principal.
      updatePrincipal(x.map((item) => item.idpaciente));
      // importando informações de anamnese do último atendimento, caso exista.
      getLastAtendimento(
        /* os parâmetros a seguir pertencem ao atendimento atual. Sem conservar esses dados,
        podemos importar erroneamente dados de um atendimento anterior pertencente a outro
        paciente. Não mudem isso!
        */
        x.map((item) => item.id),
        x.map((item) => item.box),
        x.map((item) => item.admissao),
        x.map((item) => item.nome),
        x.map((item) => item.dn),
      );
    });
  }

  // calculando idade em anos e dias de internação.
  const [idade, setidade] = useState(0);
  const [diasinternado, setdiasinternado] = useState(0);

  // estados relacionados às invasões.
  const [idinv, setidinv] = useState(0);
  const [snc, setsnc] = useState(0);
  const [datasnc, setdatasnc] = useState('');
  const [va, setva] = useState(0);
  const [datava, setdatava] = useState('');
  const [jid, setjid] = useState(0);
  const [datajid, setdatajid] = useState('');
  const [jie, setjie] = useState(0);
  const [datajie, setdatajie] = useState('');
  const [subcld, setsubcld] = useState(0);
  const [datasubcld, setdatasubcld] = useState('');
  const [subcle, setsubcle] = useState(0);
  const [datasubcle, setdatasubcle] = useState('');
  const [piard, setpiard] = useState(0);
  const [datapiard, setdatapiard] = useState('');
  const [piare, setpiare] = useState(0);
  const [datapiare, setdatapiare] = useState('');
  const [vfemd, setvfemd] = useState(0);
  const [datavfemd, setdatavfemd] = useState('');
  const [vfeme, setvfeme] = useState(0);
  const [datavfeme, setdatavfeme] = useState('');
  const [afemd, setafemd] = useState(0);
  const [dataafemd, setdataafemd] = useState('');
  const [afeme, setafeme] = useState(0);
  const [dataafeme, setdataafeme] = useState('');
  const [piapedd, setpiapedd] = useState(0);
  const [datapiapedd, setdatapiapedd] = useState('');
  const [piapede, setpiapede] = useState(0);
  const [datapiapede, setdatapiapede] = useState('');
  const [svd, setsvd] = useState(0);
  const [datasvd, setdatasvd] = useState('');
  const [torax, settorax] = useState(0);
  const [datatorax, setdatatorax] = useState('');
  const [abd, setabd] = useState(0);
  const [dataabd, setdataabd] = useState('');
  // carregando o registro de invasões.
  const loadInvasoes = () => {
    // ROTA: SELECT * FROM invasoes WHERE idatendimento = idatendimento.
    axios.get(html + "/getinvasoes/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      if (x.length > 0) {
        setidinv(x.map((item) => item.id));
        setsnc(x.map((item) => item.snc));
        setdatasnc(x.map((item) => item.datasnc));
        setva(x.map((item) => item.va));
        setdatava(x.map((item) => item.datava));
        setjid(x.map((item) => item.jid));
        setdatajid(x.map((item) => item.datajid));
        setjie(x.map((item) => item.jie));
        setdatajie(x.map((item) => item.datajie));
        setsubcld(x.map((item) => item.subcld));
        setdatasubcld(x.map((item) => item.datasubcld));
        setsubcle(x.map((item) => item.subcle));
        setdatasubcle(x.map((item) => item.datasubcle));
        setpiard(x.map((item) => item.piard));
        setdatapiard(x.map((item) => item.datapiard));
        setpiare(x.map((item) => item.piare));
        setdatapiare(x.map((item) => item.datapiare));
        setvfemd(x.map((item) => item.vfemd));
        setdatavfemd(x.map((item) => item.datavfemd));
        setvfeme(x.map((item) => item.vfeme));
        setdatavfeme(x.map((item) => item.datavfeme));
        setafemd(x.map((item) => item.afemd));
        setdataafemd(x.map((item) => item.dataafemd));
        setafeme(x.map((item) => item.afeme));
        setdataafeme(x.map((item) => item.dataafeme));
        setsvd(x.map((item) => item.svd));
        setdatasvd(x.map((item) => item.datasvd));
        setabd(x.map((item) => item.abd));
        setdataabd(x.map((item) => item.dataabd));
        setpiapedd(x.map((item) => item.piapedd));
        setdatapiapedd(x.map((item) => item.datapiapedd));
        setpiapede(x.map((item) => item.piapede));
        setdatapiapede(x.map((item) => item.datapiapede));
        settorax(x.map((item) => item.torax));
        setdatatorax(x.map((item) => item.datatorax));
      } else {
        // criando o registro de invasões para o atendimento.
        insertInvasoes();
        setTimeout(() => {
          loadInvasoes();
        }, 1000);
      }
    });
  }
  // atualizando as invasões.
  const updateInvasoes = () => {
    setloadprincipal(1);
    console.log('ATUALIZANDO INVASÕES.');
    var obj = {
      idatendimento: idatendimento,
      snc: snc,
      datasnc: datasnc,
      va: va,
      datava: datava,
      jid: jid,
      datajid: datajid,
      jie: jie,
      datajie: datajie,
      subcld: subcld,
      datasubcld: datasubcld,
      subcle: subcle,
      datasubcle: datasubcle,
      piard: piard,
      datapiard: datapiard,
      piare: piare,
      datapiare: datapiare,
      vfemd: vfemd,
      datavfemd: datavfemd,
      vfeme: vfeme,
      datavfeme: datavfeme,
      afemd: afemd,
      dataafemd: dataafemd,
      afeme: afeme,
      dataafeme: dataafeme,
      piapedd: piapedd,
      datapiapedd: datapiapedd,
      piapede: piapede,
      datapiapede: datapiapede,
      svd: svd,
      datasvd: datasvd,
      torax: torax,
      datatorax: datatorax,
      abd: abd,
      dataabd: dataabd,
    };
    axios.post(html + '/updateinvasoes/' + idinv, obj).then(() => {
      loadAlertas();
      setloadprincipal(0);
    });
  };
  // criando o registro de invasões para o atendimento.
  const insertInvasoes = () => {
    var obj = {
      idatendimento: idatendimento,
      snc: 0,
      datasnc: '',
      va: 4,
      datava: '',
      jid: 0,
      datajid: '',
      jie: 0,
      datajie: '',
      subcld: 0,
      datasubcld: '',
      subcle: 0,
      datasubcle: '',
      piard: 0,
      datapiard: '',
      piare: 0,
      datapiare: '',
      vfemd: 0,
      datavfemd: '',
      vfeme: 0,
      datavfeme: '',
      afemd: 0,
      dataafemd: '',
      afeme: 0,
      dataafeme: '',
      piapedd: 0,
      datapiapedd: '',
      piapede: 0,
      datapiapede: '',
      svd: 0,
      datasvd: '',
      torax: 0,
      datatorax: '',
      abd: 0,
      dataabd: '',
    };
    axios.post(html + '/insertinvasoes', obj);
  };

  // estados relacionados aos parâmetros ventilatórios.
  const [idvm, setidvm] = useState('');
  const [modo, setmodo] = useState('');
  const [pressao, setpressao] = useState('');
  const [volume, setvolume] = useState('');
  const [peep, setpeep] = useState('');
  const [fi, setfi] = useState('');
  // carregando o último registro de parâmetros ventilatórios.
  const loadVm = () => {
    // ROTA: SELECT * FROM ventilacao WHERE idatendimento = idatendimento.
    axios.get(html + "/getvm/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      if (x.length > 0) {
        setidvm(x.map((item) => item.id));
        setmodo(x.map((item) => item.modo));
        setpressao(x.map((item) => item.pressao));
        setvolume(x.map((item) => item.volume));
        setpeep(x.map((item) => item.peep));
        setfi(x.map((item) => item.fi));
      } else {
        // criando o registro de parâmetros ventilatórios para o atendimento. 
        insertVm();
        setTimeout(() => {
          loadVm();
        }, 1000);
      }
    });
  }
  // atualizando os parâmetros ventilatórios.
  const updateVm = () => {
    setpressao(document.getElementById("inputPp").value);
    setpeep(document.getElementById("inputPeep").value);
    setfi(document.getElementById("inputFi").value);
    var obj = {
      idatendimento: idatendimento,
      modo: modo,
      pressao: document.getElementById("inputPp").value,
      volume: '',
      peep: document.getElementById("inputPeep").value,
      fi: document.getElementById("inputFi").value,
    };
    axios.post(html + '/updatevm/' + idvm, obj);
    setvmclass('secondary fade-in');
    setviewupdatevm(0);
  };
  // criando o registro de parâmetros ventilatórios para o atendimento.
  const insertVm = () => {
    var obj = {
      idatendimento: idatendimento,
      modo: '',
      pressao: 16,
      volume: 400,
      peep: 8,
      fi: 100,
    };
    axios.post(html + '/insertvm', obj);
  };
  // exibição dos parâmetros ventilatórios.
  function CardVm() {
    return (
      <div style={{ width: '100%', marginTop: 5, marginBottom: 5, padding: 0 }}>
        <div className="card"
          title="PARÂMETROS VENTILATÓRIOS."
          onClick={() => setviewupdatevm(1)}
          style={{
            opacity: 1,
            display: modo == '' || va > 2 ? 'none' : 'flex',
            flexDirection: 'column',
            width: '100%', margin: 0, padding: 0,
            height: window.innerWidth > 800 ? 145 : 110,
            boxShadow: '0px 2px 20px 5px rgba(0, 0, 0, 0.1)',
          }}>
          <div className="title4">
            {'PARÂMETROS VENTILATÓRIOS:'}
          </div>
          <div className="title2">{'MODO: ' + modo}</div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <div className={parseInt(pressao) > 14 ? 'title3' : 'title2'} style={{ alignSelf: 'center' }}>
              {modo === 'PCV' || 'PSV' ? 'PI: ' + pressao + ' cmH2O' : 'VCV: ' + pressao + 'ml'}
            </div>
            <div className={parseInt(peep) > 10 ? 'title3' : 'title2'} style={{ alignSelf: 'center' }}>{'PEEP: ' + peep + ' cmH2O'}</div>
            <div className={parseInt(fi) > 60 ? 'title3' : 'title2'} style={{ alignSelf: 'center' }}>{'FI: ' + fi + '%'}</div>
          </div>
        </div>
        <div className="card"
          title="PARÂMETROS VENTILATÓRIOS."
          onClick={() => setviewupdatevm(1)}
          style={{
            display: va > 2 ? 'flex' : 'none',
            width: '100%', margin: 0, padding: 0,
            height: window.innerWidth > 800 ? 145 : 110,
          }}>
          <div className="title2center">
            {'PACIENTE FORA DA VM.'}</div>
        </div >
        <div className="card"
          title="PARÂMETROS VENTILATÓRIOS."
          onClick={() => setviewupdatevm(1)}
          style={{
            display: modo == '' && va < 3 ? 'flex' : 'none',
            width: '100%', margin: 0, padding: 0,
            height: window.innerWidth > 800 ? 145 : 110,
          }}>
          <div className="title2" style={{ width: window.innerWidth > 800 ? 280 : 140 }}>{'SEM REGISTRO DE PARÂMETROS VENTILATÓRIOS'}</div>
        </div>
      </div >
    );
  }
  // componente para atualização dos parâmetros ventilatórios.
  const [viewupdatevm, setviewupdatevm] = useState(0);
  const [vmclass, setvmclass] = useState("secondary");
  function UpdateVm() {
    if (viewupdatevm === 1) {
      return (
        <div
          className={vmclass}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: 0,
            position: 'fixed',
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
            zIndex: 9,
          }}
        >
          <div>
            <div
              className="secondary"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 5,
                paddingTop: 30,
                paddingBottom: 30,
                paddingLeft: 30,
                paddingRight: 30,
              }}
            >
              <label className="title2" style={{
                marginTop: 0, marginBottom: 15,
                width: window.innerWidth > 800 ? 300 : 250
              }}>
                ATUALIZAR PARÂMETROS DA VM
              </label>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  borderRadius: 5,
                  marginTop: 5,
                  marginBottom: 0,
                }}
              >
                <label className="title2" style={{ color: '#1f7a8c' }}>MODO VENTILATÓRIO:</label>
                <div
                  style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                >
                  <button
                    className="blue-button"
                    style={{
                      width: window.innerWidth > 800 ? 130 : 70,
                      padding: 10,
                      backgroundColor: modo == 'PCV' ? '#ec7063' : '#1f7a8c'
                    }}
                    onClick={() => clickPCV()}
                  >PCV</button>
                  <button
                    className="blue-button"
                    style={{
                      width: window.innerWidth > 800 ? 130 : 70,
                      padding: 10,
                      backgroundColor: modo == 'PSV' ? '#ec7063' : '#1f7a8c'
                    }}
                    onClick={() => clickPSV()}
                  >PSV</button>
                  <button
                    className="blue-button"
                    style={{
                      width: window.innerWidth > 800 ? 130 : 70,
                      padding: 10,
                      backgroundColor: modo == 'VCV' ? '#ec7063' : '#1f7a8c'
                    }}
                    onClick={() => clickVCV()}
                  >VCV</button>
                </div>
              </div>
              <label className="title2" style={{ color: '#1f7a8c' }}>
                {modo === 'PCV' ? 'PCV:' : modo === 'PSV' ? 'PSV:' : 'VT:'}
              </label>
              <input
                autoComplete="off"
                className="input"
                placeholder={modo === 'PCV' ? 'PCV' : modo === 'PSV' ? 'PSV' : 'VT'}
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'PC.')}
                onChange={(e) => validatePp(e.target.value)}
                title={modo === 'PCV' ? 'PCV(cmH2O)' : modo === 'PSV' ? 'PSV(cmH2O)' : 'VT(ml)'}
                style={{
                  width: 100,
                  height: 50,
                }}
                maxLength={modo === 'VCV' ? 3 : 2}
                id="inputPp"
                defaultValue={pressao}
              ></input>
              <label className="title2" style={{ color: '#1f7a8c' }}>PEEP:</label>
              <input
                autoComplete="off"
                className="input"
                placeholder="PEEP."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'PEEP.')}
                onChange={() => fixPeep()}
                defaultValue={peep}
                title="PEEP (cmH20)."
                style={{
                  width: 100,
                  height: 50,
                }}
                min={0}
                max={50}
                id="inputPeep"
              ></input>
              <label className="title2" style={{ color: '#1f7a8c' }}>FI:</label>
              <input
                autoComplete="off"
                className="input"
                placeholder="FI."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'FI.')}
                onChange={() => fixFi()}
                defaultValue={fi}
                title="FI (%)."
                style={{
                  width: 100,
                  height: 50,
                }}
                min={0}
                max={100}
                id="inputFi"
              ></input>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: 25,
                  marginBottom: 0,
                }}
              >
                <button
                  className="red-button"
                  onClick={() => setviewupdatevm(0)}
                  style={{ width: 100 }}
                >
                  CANCELAR
                </button>
                <button
                  className="green-button"
                  onClick={() => updateVm()}
                  style={{ width: 100, marginRight: 0 }}
                >
                  SALVAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }
  // escolha do modo ventilatorio.
  const clickPCV = () => {
    setmodo('PCV');
    setvmclass('secondary');
  };
  const clickVCV = () => {
    setmodo('VCV');
    setvmclass('secondary');
  };
  const clickPSV = () => {
    setmodo('PSV');
    setvmclass('secondary');
  };
  // tratamentos dos inputs para Peep e Fi.
  const fixPeep = () => {
    var y = '';
    y = document.getElementById('inputPeep').value;
    if (y.length > 2) {
      document.getElementById('inputPeep').value = '';
    }
  };
  const fixFi = () => {
    var z = ''; // definindo x como string, para que a propriedade lenght funcione.
    z = document.getElementById('inputFi').value;
    if (z.length > 3) {
      document.getElementById('inputFi').value = '';
    }
  };
  // validando entradas para campos numéricos.
  const validatePp = (txt) => {
    var last = txt.slice(-1);
    if (isNaN(last) === true) {
      last = '';
      document.getElementById('inputPp').value = '';
    } else {
    }
  };

  // estados relacionados à evolução.
  const [dataevolucao, setdataevolucao] = useState('');
  const [evolucao, setevolucao] = useState('');
  const [pas, setpas] = useState('');
  const [pad, setpad] = useState('');
  const [fc, setfc] = useState('');
  const [fr, setfr] = useState('');
  const [sao2, setsao2] = useState('');
  const [tax, settax] = useState('');
  const [diu, setdiu] = useState('');
  const [fezes, setfezes] = useState('');
  const [bh, setbh] = useState('');
  const [acv, setacv] = useState('');
  const [ar, setar] = useState('');
  const [abdome, setabdome] = useState('');
  const [outros, setoutros] = useState('');
  const [glasgow, setglasgow] = useState('');
  const [rass, setrass] = useState('');
  const [ramsay, setramsay] = useState('');
  const [hd, sethd] = useState(0);
  const [uf, setuf] = useState(0);
  const [heparina, setheparina] = useState(0);
  const [braden, setbraden] = useState(0);
  const [morse, setmorse] = useState(0);
  // carregando o último registro de evolução + exame clínico referente ao atendimento.
  const loadLastevolucao = (idatendimento, idpaciente) => {
    var y = [0, 1];
    if (tipounidade != 4) {
      axios.get(html + "/evolucoes").then((response) => {
        y = response.data;
        var x = [];
        var x = y.filter(item => item.idpaciente == idpaciente).sort(((a, b) => a.id > b.id ? 1 : -1)).slice(-1);
        setdataevolucao(x.map(item => item.data));
        setevolucao(x.map(item => item.evolucao));
        setpas(x.map(item => item.pas));
        setpad(x.map(item => item.pad));
        setfc(x.map(item => item.fc));
        setfr(x.map(item => item.fr));
        setsao2(x.map(item => item.sao2));
        settax(x.map(item => item.tax));
        setdiu(x.map(item => item.diu));
        setbh(x.map(item => item.bh));
        setacv(x.map(item => item.acv));
        setar(x.map(item => item.ar));
        setabdome(x.map(item => item.abdome));
        setoutros(x.map(item => item.outros));
        setglasgow(x.map(item => item.glasgow));
        setrass(x.map(item => item.rass));
        setramsay(x.map(item => item.ramsay));
      });
    } else {
      axios.get(html + "/evolucoes").then((response) => {
        var x = [0, 1];
        y = response.data;
        x = y.filter((item) => item.idpaciente == idpaciente).sort(((a, b) => a.id > b.id ? 1 : -1)).slice(-1);
        setdataevolucao(x.map((item) => item.data));
        setevolucao(x.map((item) => item.evolucao));
        setpas(x.map((item) => item.pas));
        setpad(x.map((item) => item.pad));
        setfc(x.map((item) => item.fc));
        setfr(x.map((item) => item.fr));
        setsao2(x.map((item) => item.sao2));
        settax(x.map((item) => item.tax));
        setdiu(x.map((item) => item.diu));
        setbh(x.map((item) => item.bh));
        setacv(x.map((item) => item.acv));
        setar(x.map((item) => item.ar));
        setabdome(x.map((item) => item.abdome));
        setoutros(x.map((item) => item.outros));
        setglasgow(x.map((item) => item.glasgow));
        setrass(x.map((item) => item.rass));
        setramsay(x.map((item) => item.ramsay));
      });
    }
    // carregando os alertas (primeiro carregamento).


  }
  // carregando os últimos registros de evolução + exame clínico que apresentam valores válidos de BRADEN E MORSE.
  const [lastbraden, setlastbraden] = useState(0);
  const [databraden, setdatabraden] = useState();
  const loadLastBraden = () => {
    axios.get(html + "/lastbraden/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlastbraden(x.map((item) => item.braden));
      setdatabraden(x.map((item) => item.data));
    });
  }
  const [lastmorse, setlastmorse] = useState(0);
  const [datamorse, setdatamorse] = useState();
  const loadLastMorse = () => {
    axios.get(html + "/lastmorse/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlastmorse(x.map((item) => item.morse));
      setdatamorse(x.map((item) => item.data));
    });
  }

  // EXIBIÇÃO DOS ALERTAS.
  const [alertas, setalertas] = useState([]);
  var arrayalertas = [];
  var escoresepse = 0;
  var pam = Math.ceil((parseInt(pas) + 2 * parseInt(pad)) / 3);
  const alertSepse = () => {
    if (tax > 37.8 || tax < 35) {
      escoresepse = escoresepse + 1;
    }
    if (fc > 90) {
      escoresepse = escoresepse + 1;
    }
    if (fr > 20) {
      escoresepse = escoresepse + 1;
    }
    if (glasgow < 15) {
      escoresepse = escoresepse + 2;
    }
    if (sao2 < 90) {
      escoresepse = escoresepse + 2;
    }
    if (diu < 1000) {
      escoresepse = escoresepse + 2;
    }
    if (pam < 70) {
      escoresepse = escoresepse + 2;
    }
    if (escoresepse > 1) {
      arrayalertas.push('CRITÉRIOS DE SEPSE!');
    }
  }
  const alertDadosVitais = () => {
    if (pam < 60) {
      arrayalertas.push('HIPOTENSÃO');
    }
    if (pam > 120) {
      arrayalertas.push('HIPERTENSÃO');
    }
    if (fc < 60) {
      arrayalertas.push('BRADICARDIA');
    }
    if (fc > 120) {
      arrayalertas.push('TAQUICARDIA');
    }
    if (fr < 15) {
      arrayalertas.push('BRADIPNÉIA');
    }
    if (fr > 22) {
      arrayalertas.push('TAQUIPNÉIA');
    }
    if (sao2 < 93) {
      arrayalertas.push('SAO2 BAIXA');
    }
    if (diurese12h < 1000) {
      arrayalertas.push('OLIGÚRIA');
    }
    if (diurese12h > 3000) {
      arrayalertas.push('POLIÚRIA');
    }
    if (ganhos12h - perdas12h < -2000) {
      arrayalertas.push('BALANÇO HÍDRICO MUITO NEGATIVO');
    }
    if (ganhos12h - perdas12h > 2000) {
      arrayalertas.push('BALANÇO HÍDRICO MUITO POSITIVO');
    }
    if (ganhosacumulados - perdasacumuladas < -3000) {
      arrayalertas.push('BALANÇO HÍDRICO ACUMULADO MUITO NEGATIVO');
    }
    if (ganhosacumulados - perdasacumuladas > 3000) {
      arrayalertas.push('BALANÇO HÍDRICO ACUMULADO MUITO POSITIVO');
    }
  }
  // busca por registros de evacuações em evoluções dos últimos 3 dias.
  const [fezesausentes, setfezesausentes] = useState(0);
  const [fezesnormais, setfezesnormais] = useState(0);
  const [fezesdiarreicas, setfezesdiarreicas] = useState(0);
  const alertEvacuacoes = () => {
    axios.get(html + "/fezesausentes/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setfezesausentes(x.length);
    });
    axios.get(html + "/fezesnormais/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setfezesnormais(x.length);
    });
    axios.get(html + "/fezesdiarreicas/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setfezesdiarreicas(x.length);
    });
    if (fezesnormais < 1 && fezesdiarreicas < 1 && fezesausentes > 0) {
      arrayalertas.push('EVACUAÇÕES AUSENTES NOS ÚLTIMOS 3 DIAS.');
    }
    if (fezesdiarreicas > fezesausentes && fezesdiarreicas > fezesnormais) {
      arrayalertas.push('EVACUAÇÕES DIARRÉICAS NOS ÚLTIMOS 3 DIAS.');
    }
  }
  // tempo prolongado de dispositivos e tot.
  const alertDispositivos = () => {
    if (va == 2 && moment().diff(moment(datava, 'DD/MM/YY'), 'days') > 10) {
      arrayalertas.push('TEMPO DE INTUBAÇÃO PROLONGADO: ' + moment().diff(moment(datava, 'DD/MM/YY'), 'days') + ' DIAS.')
    }
    if (jid !== 0 && moment().diff(moment(datajid, 'DD/MM/YY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: CVC JUGULAR INTERNA DIREITA ' + moment().diff(moment(datajid, 'DD/MM/YY'), 'days') + ' DIAS.')
    }
    if (jie !== 0 && moment().diff(moment(datajie, 'DD/MM/YY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: CVC JUGULAR INTERNA ESQUERDA ' + moment().diff(moment(datajie, 'DD/MM/YY'), 'days') + ' DIAS.')
    }
    if (subcld !== 0 && moment().diff(moment(datasubcld, 'DD/MM/YY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: CVC SUBCLÁVIA DIREITA ' + moment().diff(moment(datasubcld, 'DD/MM/YY'), 'days') + ' DIAS.')
    }
    if (subcle !== 0 && moment().diff(moment(datasubcle, 'DD/MM/YY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: CVC SUBCLÁVIA ESQUERDA ' + moment().diff(moment(datasubcle, 'DD/MM/YY'), 'days') + ' DIAS.')
    }
    if (piard !== 0 && moment().diff(moment(datapiard, 'DD/MM/YY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: PIA RADIAL DIREITA ' + moment().diff(moment(datapiard, 'DD/MM/YY'), 'days') + ' DIAS.')
    }
    if (piare !== 0 && moment().diff(moment(datapiare, 'DD/MM/YY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: PIA RADIAL ESQUERDA ' + moment().diff(moment(datapiare, 'DD/MM/YY'), 'days') + ' DIAS.')
    }
    if (vfemd !== 0 && moment().diff(moment(datavfemd, 'DD/MM/YY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: CVC FEMORAL DIREITA ' + moment().diff(moment(datavfemd, 'DD/MM/YY'), 'days') + ' DIAS.')
    }
    if (vfeme !== 0 && moment().diff(moment(datavfeme, 'DD/MM/YY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: CVC FEMORAL ESQUERDA ' + moment().diff(moment(datavfeme, 'DD/MM/YY'), 'days') + ' DIAS.')
    }
    if (afemd !== 0 && moment().diff(moment(dataafemd, 'DD/MM/YY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: PIA FEMORAL DIREITA ' + moment().diff(moment(dataafemd, 'DD/MM/YY'), 'days') + ' DIAS.')
    }
    if (afeme !== 0 && moment().diff(moment(dataafeme, 'DD/MM/YY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: PIA FEMORAL ESQUERDA ' + moment().diff(moment(dataafeme, 'DD/MM/YY'), 'days') + ' DIAS.')
    }
    if (piapedd !== 0 && moment().diff(moment(datapiapedd, 'DD/MM/YY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: PIA PEDIOSA DIREITA ' + moment().diff(moment(datapiapedd, 'DD/MM/YY'), 'days') + ' DIAS.')
    }
    if (piapede !== 0 && moment().diff(moment(datapiapede, 'DD/MM/YY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: PIA PEDIOSA ESQUERDA ' + moment().diff(moment(datapiapede, 'DD/MM/YY'), 'days') + ' DIAS.')
    }
    if (torax !== 0 && moment().diff(moment(datatorax, 'DD/MM/YY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: DRENO TORÁCICO ' + moment().diff(moment(datatorax, 'DD/MM/YY'), 'days') + ' DIAS.')
    }
    if (abd !== 0 && moment().diff(moment(dataabd, 'DD/MM/YY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: DRENO ABDOMINAL ' + moment().diff(moment(dataabd, 'DD/MM/YY'), 'days') + ' DIAS.')
    }
    if (snc !== 0 && moment().diff(moment(datasnc, 'DD/MM/YY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: DISPOSITIVO SNC ' + moment().diff(moment(datasnc, 'DD/MM/YY'), 'days') + ' DIAS.')
    }
  }

  // alerta de culturas em aberto.
  const alertCulturas = () => {
    axios.get(html + "/culturaspendentes/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      if (x.lenght > 0) {
        arrayalertas.push('RESULTADOS DE CULTURA PENDENTES.')
      }
    });
  }

  // memorizando a posição da scroll nas listas.
  var timeout;
  const scrollPosition = (value) => {
    setscrollmenu(document.getElementById("MENU LATERAL").scrollTop);
    document.getElementById("MENU LATERAL").scrollTop = scrollmenu;
  }
  const keepScroll = (value) => {
    document.getElementById("MENU LATERAL").scrollTop = scrollmenu;
    document.getElementById(value).scrollTop = scrolllist;
  }
  const scrollMenu = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setscrollmenu(document.getElementById("MENU LATERAL").scrollTop);
      document.getElementById("MENU LATERAL").scrollTop = scrollmenu;
    }, 50);
  }
  const keepMenu = () => {
    document.getElementById("MENU LATERAL").scrollTop = scrollmenu;
  }

  // carregando listas das telas secundárias.
  // LISTA DE DIAGNÓSTICOS.
  const loadDiagnosticos = (idpaciente) => {
    axios.get(html + "/diagnosticos").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistdiagnosticos(x.sort((a, b) => moment(a.inicio, 'DD/MM/YYYY') < moment(b.inicio, 'DD/MM/YYYY') ? 1 : -1).filter(item => item.idpaciente == idpaciente));
      setarraydiagnosticos(x.sort((a, b) => moment(a.inicio, 'DD/MM/YYYY') < moment(b.inicio, 'DD/MM/YYYY') ? 1 : -1).filter(item => item.idpaciente == idpaciente));
    });
  }
  // constantes relacionadas à lista de diagnósticos:
  const [iddiagnostico, setiddiagnostico] = useState(0);
  const [cid, setcid] = useState('');
  const [diagnostico, setdiagnostico] = useState('');
  const [iniciodiag, setiniciodiag] = useState('');
  const [terminodiag, setterminodiag] = useState('');

  const selectDiagnostico = (item) => {
    setiddiagnostico(item.id);
    setcid(item.cid);
    setdiagnostico(item.diagnostico);
    setiniciodiag(item.inicio);
    setterminodiag(item.termino);
    window.scrollTo(0, 0);
    viewDiagnostico(2);
  }

  // excluir um diagnóstico da lista.
  const deleteDiagnostico = (item) => {
    axios.get(html + "/deletediagnostico/'" + item.id + "'").then(() => {
      toast(1, '#52be80', 'DIAGNÓSTICO CANCELADO COM SUCESSO.', 3000);
      loadDiagnosticos(idpaciente);
    });
  }

  // renderizando a tela INSERIR OU ATUALIZAR DIAGNÓSTICO.
  const [viewdiagnostico, setviewdiagnostico] = useState(0);
  const viewDiagnostico = (valor) => {
    setviewdiagnostico(0);
    setTimeout(() => {
      setviewdiagnostico(valor); // 1 para inserir diagnostico, 2 para atualizar diagnostico.
    }, 500);
  }

  // exibição da lista de diagnósticos (tela principal).
  function CardDiagnosticos() {
    return (
      <div className="pulsewidgetscroll" title="DIAGNOSTICOS.">
        <div className="title4 pulsewidgettitle">{'DIAGNÓSTICOS'}</div>
        <div
          className="pulsewidgetcontent"
          style={{ display: listdiagnosticos.length > 0 ? 'flex' : 'none' }}>
          {listdiagnosticos.map((item) => (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <div
                key={item.id}
                className={item.termino !== '' ? "title2center" : "title3"}
                style={{
                  margin: 0,
                  marginTop: 2.5,
                  marginBottom: 5,
                  marginRight: 5,
                  opacity: 1.0,
                  width: '100%',
                  padding: 5,
                }}
              >
                {item.inicio + ': ' + item.diagnostico + '.'}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: listdiagnosticos.length < 1 ? 'flex' : 'none',
            color: '#8f9bbc',
            fontWeight: 'bold',
            fontSize: 16,
          }}
          className="pulsewidgetcontent"
        >
          {'SEM DIAGNÓSTICOS REGISTRADOS'}
        </div>
      </div>
    );
  }

  // exibição da lista de internações (tela principal).
  function CardInternacoes() {
    return (
      <div className="pulsewidgetscroll"
        title="INTERNAÇÕES">
        <div className="title4 pulsewidgettitle">{'HISTÓRICO DE INTERNAÇÕES'}</div>
        <div className="pulsewidgetcontent" style={{ display: listatendimentos.length > 0 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'flex-start' }}>
          {listatendimentos.filter(value => value.idpaciente == idpaciente).map((item) => (
            <div
              key={item.id}
              className="title2center"
            >
              {JSON.stringify(item.admissao).substring(1, 11) + ' - ' + item.hospital + ' / ' + item.unidade}
            </div>
          ))}
        </div>
        <div className="pulsewidgetcontent" style={{ display: listatendimentos.length < 1 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
          <text style={{ color: '#ffffff' }}>SEM ATENDIMENTOS REGISTRADOS</text>
        </div>
      </div>
    );
  }

  // filtro para os diagnósticos.
  function ShowFilterDiagnosticos() {
    if (stateprontuario === 3) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', margin: 5 }}>
          <input
            className="input"
            autoComplete="off"
            placeholder="BUSCAR DIAGNÓSTICO..."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'BUSCAR DIAGNÓSTICO...')}
            onChange={() => filterDiagnostico()}
            style={{
              width: '100%',
              margin: 0,
            }}
            type="text"
            id="inputFilterDiagnostico"
            defaultValue={filterdiagnostico}
            maxLength={100}
          ></input>
        </div >
      )
    } else {
      return null;
    }
  }

  const [filterdiagnostico, setfilterdiagnostico] = useState('');
  var searchdiagnostico = '';
  var timeout = null;

  const filterDiagnostico = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterDiagnostico").focus();
    searchdiagnostico = document.getElementById("inputFilterDiagnostico").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchdiagnostico === '') {
        setarraydiagnosticos(listdiagnosticos);
        document.getElementById("inputFilterDiagnostico").value = '';
        document.getElementById("inputFilterDiagnostico").focus();
      } else {
        setfilterdiagnostico(document.getElementById("inputFilterDiagnostico").value.toUpperCase());
        setarraydiagnosticos(listdiagnosticos.filter(item => item.diagnostico.includes(searchdiagnostico) === true));
        document.getElementById("inputFilterDiagnostico").value = searchdiagnostico;
        document.getElementById("inputFilterDiagnostico").focus();
      }
    }, 500);
  }

  // exibição da lista de diagnósticos (habilitando crud).
  const ShowDiagnosticos = useCallback(() => {
    if (stateprontuario === 3) {
      return (
        <div
          id="diagnósticos"
          className="conteudo">
          <Identificacao></Identificacao>
          <div
            className="scroll"
            id="LISTA DE DIAGNÓSTICOS"
          >
            {arraydiagnosticos.map((item) => (
              <div
                key={item.id}
                id="item da lista"
                className="row"
              >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                  <div id="data do diagnóstico e botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <button
                      className="green-button"
                      style={{
                        padding: 10,
                        flexDirection: 'column',
                        backgroundColor: '#52be80'
                      }}
                    >
                      {item.inicio}
                    </button>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <button className="animated-yellow-button"
                        onClick={() => selectDiagnostico(item)}
                      >
                        <img
                          alt=""
                          src={editar}
                          style={{
                            margin: 10,
                            height: 30,
                            width: 30,
                          }}
                        ></img>
                      </button>
                      <button className="animated-red-button"
                        onClick={() => deleteDiagnostico(item)}
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
                  <div id="cid e diagnóstico"
                    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '100%' }}>
                    <div className="title2" style={{ justifyContent: 'flex-start', marginBottom: 0 }}>
                      {item.cid + ' - ' + item.diagnostico}
                    </div>
                    <div className="title2" style={{ opacity: 0.5, justifyContent: 'flex-start', marginTop: 0 }}>
                      {"REGISTRADO POR " + item.usuario + '.'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
              <button className="blue-button"
                onClick={() => viewDiagnostico(1)}
                style={{ display: window.innerWidth > 800 ? 'none' : 'flex', marginRight: 5, marginTop: 5 }}
              >
                <img
                  alt=""
                  src={novo}
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
  }, [stateprontuario, arraydiagnosticos]
  );

  // PAINEL DE ALERTAS.
  function CardAlertas() {
    return (
      <div className="pulsewidgetscroll"
        style={{
          backgroundColor: alertas.length > 1 ? '#ec7063' : '#52be80',
          borderColor: alertas.length > 1 ? '#ec7063' : '#52be80',
        }}
      >
        <div className="title5 pulsewidgettitle" style={{ color: '#ffffff' }}>
          {'ALERTAS: ' + alertas.length}
        </div>
        <div
          className="pulsewidgetcontent"
          id="ALERTAS"
          title="ALERTAS"
          style={{
            display: alertas.length > 0 ? 'flex' : 'none', justifyContent: 'flex-start',
          }}
        >
          {alertas.map((item) => (
            <div
              className="title2center"
              style={{
                margin: 0,
                marginTop: 2.5,
                marginBottom: 5,
                marginRight: 5,
                opacity: 1.0,
                color: '#ffffff'
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // LISTA DE PROBLEMAS.
  const loadProblemas = () => {
    axios.get(html + "/problemas").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistproblemas(x.sort((a, b) => moment(a.inicio, 'DD/MM/YYYY') < moment(b.inicio, 'DD/MM/YYYY') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
      setarrayproblemas(x.sort((a, b) => moment(a.inicio, 'DD/MM/YYYY') < moment(b.inicio, 'DD/MM/YYYY') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
    });
  }
  // constantes relacionadas à lista de problemas:
  const [idproblema, setidproblema] = useState(0);
  const [problema, setproblema] = useState('');
  const [inicioproblema, setinicioproblema] = useState('');

  const selectProblema = (item) => {
    setidproblema(item.id);
    setinicioproblema(item.inicio);
    setproblema(item.problema);
    window.scrollTo(0, 0);
    viewProblema(2);
  }

  // excluir um diagnóstico da lista.
  const deleteProblema = (item) => {
    axios.get(html + "/deleteproblema/'" + item.id + "'").then(() => {
      toast(1, '#52be80', 'PROBLEMA EXLCUÍDO COM SUCESSO.', 3000);
      loadProblemas();
    });
  }

  const updateProblema = (item) => {
    var obj = {
      inicio: item.inicio,
      idatendimento: item.idatendimento,
      problema: item.problema,
      status: item.status == 1 ? 2 : 1,
      usuario: nomeusuario,
      registro: moment().format('DD/MM/YYYY') + ' ÀS ' + moment().format('HH:mm')
    };
    axios.post(html + '/updateproblema/' + item.id, obj).then(() => {
      toast(1, '#52be80', 'PROBLEMA ATUALIZADO COM SUCESSO.', 3000);
      loadProblemas();
    });
  }

  // filtro para a lista de problemas.
  function ShowFilterProblemas() {
    if (stateprontuario === 12) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', margin: 5 }}>
          <input
            className="input"
            autoComplete="off"
            placeholder="BUSCAR PROBLEMA..."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'BUSCAR PROBLEMA...')}
            onChange={() => filterProblema()}
            style={{
              width: '100%',
              margin: 0,
            }}
            type="text"
            id="inputFilterProblema"
            defaultValue={filterproblema}
            maxLength={100}
          ></input>
        </div >
      )
    } else {
      return null;
    }
  }

  const [filterproblema, setfilterproblema] = useState('');
  var searchproblema = '';
  var timeout = null;

  const filterProblema = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterProblema").focus();
    searchproblema = document.getElementById("inputFilterProblema").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchproblema === '') {
        setarrayproblemas(listproblemas);
        document.getElementById("inputFilterProblema").value = '';
        document.getElementById("inputFilterProblema").focus();
      } else {
        setfilterproblema(document.getElementById("inputFilterProblema").value.toUpperCase());
        setarrayproblemas(listproblemas.filter(item => item.problema.includes(searchproblema) === true));
        document.getElementById("inputFilterProblema").value = searchproblema;
        document.getElementById("inputFilterProblema").focus();
      }
    }, 500);
  }

  // renderizando a tela INSERIR OU ATUALIZAR PROBLEMA.
  const [viewproblema, setviewproblema] = useState(0);
  const viewProblema = (valor) => {
    setviewproblema(0);
    setTimeout(() => {
      setviewproblema(valor); // 1 para inserir problema, 2 para atualizar problema.
    }, 500);
  }

  // exibição da lista de problemas (BASEADO NO SISTEMA DE PRONTUÁRIO ORIENTADO POR PROBLEMAS E EVIDÊNCIAS - POPE).
  const ShowProblemas = useCallback(() => {
    if (stateprontuario === 12) {
      return (
        <div
          className="conteudo"
          id="diagnósticos"
        >
          <Identificacao></Identificacao>
          <div
            className="scroll"
            id="LISTA DE PROBLEMAS"
          >
            {arrayproblemas.map((item) => (
              <div
                key={item.id}
                id="item da lista"
                className="row"
              >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '100%', padding: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <div
                        id="status" className={item.status == 1 ? "red-button" : "green-button"}
                        style={{ padding: 10, width: 100 }}
                        onClick={() => updateProblema(item)}
                      >
                        {item.status == 1 ? 'ATIVO' : 'INATIVO'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <button className="animated-yellow-button"
                        onClick={() => selectProblema(item)}
                      >
                        <img
                          alt=""
                          src={editar}
                          style={{
                            margin: 10,
                            height: 30,
                            width: 30,
                          }}
                        ></img>
                      </button>
                      <button className="animated-red-button"
                        onClick={() => deleteProblema(item)}
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
                  <div id="problema" className="title2" style={{ marginBottom: 0, justifyContent: 'left' }}>{item.inicio + ' - ' + item.problema}</div>
                  <div className="title2" style={{ marginTop: 0, justifyContent: 'left', opacity: 0.5 }}>
                    {'REGISTRADO POR ' + nomeusuario + ' EM ' + item.registro + '.'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }, [stateprontuario, arrayproblemas]
  );

  // filtros para seleção de profissionais (evoluções).
  const filterSelectorMed = () => {
    setarrayevolucao(listevolucoes.filter(item => item.funcao.includes("MED") === true));
    setfilterevolucao('');
    setidevolucao('');
  }
  const filterSelectorEnf = () => {
    setarrayevolucao(listevolucoes.filter(item => item.funcao.includes("ENF") === true));
    setfilterevolucao('');
    setidevolucao('');
  }

  // filtro para as evoluções.
  function ShowFilterEvolucao() {
    if (stateprontuario === 2) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', margin: 5 }}>
          <button
            onClick={() => filterSelectorMed()}
            className="blue-button"
            style={{
              maxHeight: 50,
              width: 70,
              margin: 0,
              marginRight: 5,
              padding: 10,
              textAlign: 'left',
            }}
          >
            MED
          </button>
          <button
            onClick={() => filterSelectorEnf()}
            className="blue-button"
            style={{
              maxHeight: 50,
              width: 70,
              margin: 0,
              marginRight: 5,
              padding: 10,
              textAlign: 'left',
            }}
          >
            ENF
          </button>
          <input
            className="input"
            autoComplete="off"
            placeholder="BUSCAR EVOLUÇÃO..."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'BUSCAR EVOLUÇÃO...')}
            onChange={() => filterEvolucao()}
            style={{
              width: '100%',
              margin: 0,
            }}
            type="text"
            id="inputFilterEvolucao"
            defaultValue={filterevolucao}
            maxLength={100}
          ></input>
        </div >
      )
    } else {
      return null;
    }
  }

  //filtro das listas de evoluções.
  const [filterevolucao, setfilterevolucao] = useState('');
  var searchevolucao = '';
  var timeout = null;

  const filterEvolucao = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterEvolucao").focus();
    searchevolucao = document.getElementById("inputFilterEvolucao").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchevolucao === '') {
        setarrayevolucao(listevolucoes);
        document.getElementById("inputFilterEvolucao").value = '';
        document.getElementById("inputFilterEvolucao").focus();
      } else {
        setfilterevolucao(document.getElementById("inputFilterEvolucao").value.toUpperCase());
        setarrayevolucao(listevolucoes.filter(item => item.evolucao.includes(searchevolucao) === true));
        document.getElementById("inputFilterEvolucao").value = searchevolucao;
        document.getElementById("inputFilterEvolucao").focus();
      }
    }, 500);
  }

  // LISTA DE EVOLUÇÕES.
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

  // expandindo uma evolução para ver informações detalhadas.
  const [expandevolucao, setexpandevolucao] = useState(0);
  const expandEvolucao = (item) => {
    setidevolucao(item.id);
    if (expandevolucao === 0) {
      setexpandevolucao(1);
    } else {
      setexpandevolucao(0);
    }
  }

  // seleção de uma evolução médica para edição.
  const [idevolucao, setidevolucao] = useState(0);
  const editarEvolucao = (item) => {
    if (item.idusuario == idusuario) {
      window.scrollTo(0, 0);
      setidevolucao(item.id);
      setdataevolucao(item.data);
      setevolucao(item.evolucao);
      setpas(item.pas);
      setpad(item.pad);
      setfc(item.fc);
      setfr(item.fr);
      setsao2(item.sao2);
      settax(item.tax);
      setdiu(item.diu);
      setfezes(item.fezes);
      setbh(item.bh);
      setacv(item.acv);
      setar(item.ap);
      setabdome(item.abdome);
      setoutros(item.outros);
      setglasgow(item.glasgow);
      setrass(item.rass);
      setramsay(item.ramsay);
      sethd(item.hd);
      setuf(item.uf);
      setheparina(item.heparina);
      setbraden(item.braden);
      setmorse(item.morse);
      viewEvolucao(2);
      window.scrollTo(0, 0);
    } else {
      toast(1, '#ec7063', 'EDIÇÃO NÃO AUTORIZADA.', 3000);
    }
  }

  // excluindo o registro de evolução ainda não assinado.
  const deleteEvolucao = (item) => {
    if (item.idusuario == idusuario) {
      axios.get(html + "/deleteevolucao/'" + item.id + "'").then(() => {
        loadEvolucoes(idpaciente);
        toast(1, '#52be80', 'EVOLUÇÃO CANCELADA COM SUCESSO.', 3000);
      });
    } else {
      toast(1, '#ec7063', 'EXCLUSÃO NÃO AUTORIZADA.', 3000);
    }
  }
  // assinando ou suspendendo uma evolução (conforme parâmetro).
  const updateEvolucao = (item, value) => {
    var obj = {
      idatendimento: idatendimento,
      data: item.data,
      evolucao: item.evolucao,
      pas: item.pas,
      pad: item.pad,
      fc: item.fc,
      fr: item.fr,
      sao2: item.sao2,
      tax: item.tax,
      diu: item.diu,
      fezes: item.fezes,
      bh: item.bh,
      acv: item.acv,
      ar: item.ar,
      abdome: item.abdome,
      outros: item.outros,
      glasgow: item.glasgow,
      rass: item.rass,
      ramsay: item.ramsay,
      uf: item.uf,
      heparina: item.heparina,
      braden: item.braden,
      morse: item.morse,
      status: value,
      idusuario: item.idusuario,
      funcao: item.funcao,
      usuario: item.usuario,
    };
    axios.post(html + '/updateevolucao/' + item.id, obj).then(() => {
      loadEvolucoes(idpaciente);
    });
  }

  // copiando uma evolução.
  const copiarEvolucao = (item) => {
    var obj = {
      idpaciente: item.idpaciente,
      idatendimento: item.idatendimento,
      data: moment().format('DD/MM/YY HH:mm'),
      evolucao: item.evolucao,
      pas: item.pas,
      pad: item.pad,
      fc: item.fc,
      fr: item.fr,
      sao2: item.sao2,
      tax: item.tax,
      diu: item.diu,
      fezes: item.fezes,
      bh: item.bh,
      acv: item.acv,
      ar: item.ar,
      abdome: item.abdome,
      outros: item.outros,
      glasgow: item.glasgow,
      rass: item.rass,
      ramsay: item.ramsay,
      uf: item.uf,
      heparina: item.heparina,
      braden: item.braden,
      morse: item.morse,
      status: 0,
      idusuario: item.idusuario,
      funcao: item.funcao,
      usuario: item.usuario,
    };
    axios.post(html + '/insertevolucao', obj);
    setTimeout(() => {
      loadEvolucoes(idpaciente);
    }, 1000);
  }

  // função que impede a assinatura de registros por outro profissional.
  const denied = () => {
    toast(1, '#ec7063', 'AÇÃO NÃO AUTORIZADA.', 3000);
  }

  // renderização da lista de evoluções.
  var showexamefisico = 0;
  const ShowEvolucoes = useCallback(() => {
    if (stateprontuario === 2) {
      return (
        <div id="evoluções"
          className="conteudo">
          <Identificacao></Identificacao>
          <div
            className="scroll"
            id="LISTA DE EVOLUÇÕES"
            style={{
              width: '100%',
            }}
          >
            {arrayevolucao.map((item) => (
              <div
                key={item.id}
                id="item da lista"
                className="row rowbutton"
                style={{
                  display: item.status === 2 ? 'none' : 'flex',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                  <div id="tag do profissional"
                    className="blue-button"
                    style={{
                      width: 150,
                      margin: 0,
                      padding: 0,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      // definindo a cor da tag de evolução, conforme a função do usuário.
                      backgroundColor: item.funcao < 3 ? '#85C1E9' : item.funcao == 5 ? '#7DCEA0' : '#B2BABB'
                    }}
                  >
                    <div style={{ margin: 5 }}>{JSON.stringify(item.data).substring(1, 9) + ' - ' + JSON.stringify(item.data).substring(10, 15)}</div>
                    <div style={{ margin: 5 }}>{JSON.stringify(item.usuario).substring(1, 30).replace('"', '').split(" ").slice(0, 1) + ' ' + JSON.stringify(item.usuario).split(" ").slice(1, 2) + ' ' + JSON.stringify(item.usuario).split(" ").slice(2, 3)}</div>
                  </div>

                  <div
                    id="evolução"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                      margin: 0,
                      marginLeft: 5,
                      padding: 0,
                    }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>

                      <div id="botões"
                        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}
                      >
                        <button id="edit-button"
                          className="animated-yellow-button"
                          onClick={() => editarEvolucao(item)}
                          title="EDITAR EVOLUÇÃO."
                          style={{
                            display: item.status == 0 && item.idusuario == idusuario ? 'flex' : 'none',
                            marginTop: 0, marginBottom: window.innerWidth < 800 ? 2.5 : 0,
                          }}>
                          <img
                            alt=""
                            src={editar}
                            style={{
                              margin: 10,
                              height: 30,
                              width: 30,
                            }}
                          ></img>
                        </button>
                        <button id="copy-button"
                          className="animated-green-button"
                          onClick={() => copiarEvolucao(item)}
                          title="COPIAR EVOLUÇÃO."
                          style={{
                            display: item.status == 1 && item.idusuario == idusuario ? 'flex' : 'none',
                            marginTop: 0,
                            marginBottom: window.innerWidth < 800 ? 5 : 0,
                            marginLeft: 5
                          }}
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
                        <button id="print-button"
                          className="animated-green-button"
                          onClick={() => viewPrintEvolucao(item)}
                          title="IMPRIMIR EVOLUÇÃO."
                          style={{
                            display: item.status == 1 && item.idusuario == idusuario ? 'flex' : 'none', marginTop: 0,
                            marginRight: 2.5,
                            marginLeft: 2.5,
                            marginBottom: window.innerWidth > 800 && item.idusuario == idusuario ? 0 : 5,
                          }}
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
                        <button id="sign-button"
                          className="animated-green-button"
                          onClick={idusuario == item.idusuario ? () => updateEvolucao(item, 1) : () => alert(item.idusuario)}
                          title="ASSINAR EVOLUÇÃO."
                          style={{
                            display: item.status == 0 && item.idusuario == idusuario ? 'flex' : 'none',
                            marginTop: 0, marginBottom: window.innerWidth < 800 ? 2.5 : 0
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
                        <button id="delete-button"
                          className="animated-red-button"
                          onClick={() => deleteEvolucao(item)}
                          title="EXCLUIR EVOLUÇÃO."
                          style={{
                            display: item.status == 0 && item.idusuario == idusuario ? 'flex' : 'none',
                            marginRight: 0,
                            marginLeft: 2.5,
                            marginBottom: 0,
                            marginTop: 0
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
                        <button id="suspend-button"
                          className="animated-red-button"
                          title="SUSPENDER EVOLUÇÃO."
                          onClick={idusuario == item.idusuario ? () => updateEvolucao(item, 2) : () => denied()}
                          style={{
                            display: item.status == 1 && item.idusuario == idusuario ? 'flex' : 'none',
                            marginRight: window.innerWidth > 800 ? 0 : 2.5,
                            marginTop: 0,
                            marginBottom: window.innerWidth < 800 ? 0 : 0,
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
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                        <div
                          id="texto da evolução"
                          className="title2"
                          style={{ whiteSpace: 'pre-wrap', justifyContent: 'flex-start', textAlign: 'left', alignSelf: 'flex-start', width: '100%', height: '100%', minHeight: 60 }}>
                          {item.evolucao}
                        </div>
                        <div
                          id="evolução - hd"
                          className="title3"
                          style={{
                            display: item.hd === 1 ? 'flex' : 'none',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignSelf: 'flex-start',
                            marginTop: 0,
                            marginBottom: 10,
                          }}>
                          {'REALIZADA HD, UF ' + item.uf + 'ML.'}
                        </div>
                      </div>
                    </div>
                    <div
                      id="dados vitais"
                      className="hover-button"
                      style={{ margin: 0, justifyContent: 'flex-start', alignContent: 'flex-start' }}
                      onClick={() => {
                        if (showexamefisico == 0) {
                          showexamefisico = 1;
                          document.getElementById("exame físico" + item.id).style.display = "flex";
                        } else {
                          showexamefisico = 0;
                          document.getElementById("exame físico" + item.id).style.display = "none";
                        }
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', textAlign: 'center' }}>
                        <div style={{ display: window.innerWidth > 800 ? 'none' : 'none', flexDirection: 'row', justifyContent: 'center', margin: 5 }}>
                          {item.glasgow !== '' ? 'ECG: ' + item.glasgow : 'RASS: ' + item.rass !== '' ? 'RAMSAY ' + item.rass : item.ramsay}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: 5 }}>
                          {'PAM: ' + Math.ceil((parseInt(item.pas) + 2 * parseInt(item.pad)) / 3)}
                        </div>
                        <div style={{ display: window.innerWidth > 800 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center', margin: 5 }}>
                          {'FC: ' + item.fc}
                        </div>
                        <div style={{ display: window.innerWidth > 800 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center', margin: 5 }}>
                          {'FR: ' + item.fr}
                        </div>
                        <div style={{ display: window.innerWidth > 800 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center', margin: 5 }}>
                          {'SAO2: ' + item.sao2 + '%'}
                        </div>
                        <div style={{ display: window.innerWidth > 800 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center', margin: 5 }}>
                          {'TAX: ' + item.tax}
                        </div>
                        <div style={{ display: window.innerWidth > 800 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center', margin: 5 }}>
                          {'DIU: ' + item.diu}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: 5 }}>
                          {'BH: ' + item.bh}
                        </div>
                      </div>
                    </div>
                    <div id={"exame físico" + item.id} style={{ display: 'none', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', marginTop: 10 }}>
                        <textarea
                          disabled={true}
                          className="textarea"
                          title="APARELHO CARDIOVASCULAR."
                          style={{
                            minWidth: '45%',
                            width: '45%',
                            height: 80,
                            margin: 0,
                            marginRight: 10,
                          }}
                          type="text"
                          maxLength={50}
                          defaultValue={'APARELHO CARDIOVASCULAR: ' + item.acv}
                        ></textarea>
                        <textarea
                          disabled={true}
                          className="textarea"
                          title="APARELHO RESPIRATÓRIO."
                          style={{
                            minWidth: '45%',
                            width: '45%',
                            height: 80,
                            margin: 0,
                          }}
                          type="text"
                          maxLength={50}
                          defaultValue={'APARELHO RESPIRATÓRIO: ' + item.ap}
                        ></textarea>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', marginTop: 10 }}>
                        <textarea
                          disabled={true}
                          className="textarea"
                          title="ABDOME."
                          style={{
                            minWidth: '45%',
                            width: '45%',
                            height: 80,
                            margin: 0,
                            marginRight: 10,
                          }}
                          type="text"
                          maxLength={50}
                          defaultValue={'ABDOME: ' + item.abdome}
                        ></textarea>
                        <textarea
                          disabled={true}
                          className="textarea"
                          title="OUTROS ACHADOS CLÍNICOS IMPORTANTES."
                          style={{
                            minWidth: '45%',
                            width: '45%',
                            height: 80,
                            margin: 0,
                          }}
                          type="text"
                          maxLength={50}
                          defaultValue={'OUTROS: ' + item.ap}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
              <button className="blue-button"
                onClick={() => viewEvolucao(1)}
                style={{ display: window.innerWidth > 800 ? 'none' : 'flex', marginRight: 7.5, marginTop: 2.5 }}
              >
                <img
                  alt=""
                  src={novo}
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
  }, [stateprontuario, listevolucoes, arrayevolucao]
  );

  // calculando o bh acumulado.
  const [bha, setbha] = useState(0);
  const loadBhacumulado = () => {
    axios.get(html + "/bhacumulado/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setbha(x.map((item) => item.bhacumulado));
    });
  }

  // LISTA DE PROPOSTAS.
  const loadPropostas = () => {
    // ROTA: SELECT * FROM propostas WHERE idatendimento = idatendimento.
    axios.get(html + "/propostas/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistpropostas(x.sort((a, b) => moment(a.inicio, 'DD/MM/YYYY HH:MM') < moment(b.inicio, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
      setarraypropostas(x.sort((a, b) => moment(a.inicio, 'DD/MM/YYYY HH:MM') < moment(b.inicio, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
    });
  }
  // excluindo uma proposta.
  const deleteProposta = (item) => {
    axios.get(html + "/deleteprop/'" + item.id + "'").then(() => {
      loadPropostas();
      toast(1, '#52be80', 'PROPOSTA CANCELADA COM SUCESSO.', 3000);
    });
  }

  // filtro para as propostas.
  function ShowFilterProposta() {
    if (stateprontuario === 4) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', margin: 5 }}>
          <input
            className="input"
            autoComplete="off"
            placeholder="BUSCAR PROPOSTA..."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'BUSCAR PROPOSTA...')}
            onChange={() => filterProposta()}
            style={{
              width: '100%',
              margin: 0,
            }}
            type="text"
            id="inputFilterProposta"
            defaultValue={filterproposta}
            maxLength={100}
          ></input>
        </div >
      )
    } else {
      return null;
    }
  }

  const [filterproposta, setfilterproposta] = useState('');
  var searchproposta = '';
  var timeout = null;

  const filterProposta = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterProposta").focus();
    searchproposta = document.getElementById("inputFilterProposta").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchproposta === '') {
        setarraypropostas(listpropostas);
        document.getElementById("inputFilterProposta").value = '';
        document.getElementById("inputFilterProposta").focus();
      } else {
        setfilterproposta(document.getElementById("inputFilterProposta").value.toUpperCase());
        setarraypropostas(listpropostas.filter(item => item.proposta.includes(searchproposta) === true));
        document.getElementById("inputFilterProposta").value = searchproposta;
        document.getElementById("inputFilterProposta").focus();
      }
    }, 500);
  }

  // exibição da lista de propostas.
  function ShowPropostas() {
    if (stateprontuario === 4) {
      return (
        <div
          className="conteudo"
          id="propostas"
        >
          <Identificacao></Identificacao>
          <div
            className="scroll"
            id="LISTA DE PROPOSTAS DESKTOP"
            style={{
              width: '100%'
            }}
          >
            {arraypropostas.map((item) => (
              <p
                key={item.id}
                id="item da lista"
                className="row"
              >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <div id="proposta" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <button
                        className={item.termino == '' ? "red-button" : "green-button"}
                        onClick={() => checkProposta(item)}
                        title={item.termino == '' ? "CLIQUE PARA MARCAR A PROPOSTA COMO REALIZADA." : "CLIQUE PARA MARCAR A PROPOSTA COMO PENDENTE."}
                        style={{
                          flexDirection: 'row',
                          padding: 10,
                        }}
                      >
                        <div style={{ marginRight: item.termino == '' ? 0 : 5 }}>
                          {item.termino == '' ? '!' : '✔ '}
                        </div>
                        <div>{item.termino == '' ? '' : item.termino}</div>
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <button className="animated-yellow-button"
                        onClick={() => selectProposta(item)}
                      >
                        <img
                          alt=""
                          src={editar}
                          style={{
                            margin: 10,
                            height: 30,
                            width: 30,
                          }}
                        ></img>
                      </button>
                      <button className="animated-red-button"
                        onClick={() => deleteProposta(item)}
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
                  <div className="title2" style={{ marginBottom: 0, justifyContent: 'left' }}>
                    {item.inicio + ' - ' + item.proposta}
                  </div>
                  <div className="title2" style={{ marginTop: 0, justifyContent: 'left', opacity: 0.5 }}>
                    {'REGISTRADO POR ' + nomeusuario + ' EM ' + item.registro + '.'}
                  </div>
                </div>
              </p>
            ))}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
              <button className="blue-button"
                onClick={() => viewProposta(1)}
                style={{ display: window.innerWidth > 800 ? 'none' : 'flex', marginRight: 7.5, marginTop: 2.5 }}
              >
                <img
                  alt=""
                  src={novo}
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

  // checando proposta como concluída.
  const checkProposta = (item) => {
    var idproposta = item.id;
    var inicio = item.inicio;
    var termino = item.termino;
    var proposta = item.proposta;
    if (termino === '') {
      termino = moment().format('DD/MM/YYYY');
      var obj = {
        id: idproposta,
        idatendimento: idatendimento,
        inicio: inicio,
        termino: termino,
        proposta: proposta,
        registro: moment().format('DD/MM/YYYY') + ' ÀS ' + moment().format('HH:mm')
      };
      axios.post(html + '/updateprop/' + idproposta, obj).then(() => {
        toast(1, '#52be80', 'PROPOSTA ATUALIZADA COM SUCESSO.', 3000);
        loadPropostas();
      });
    } else {
      termino = '';
      var obj = {
        id: idproposta,
        idatendimento: idatendimento,
        inicio: inicio,
        termino: termino,
        proposta: proposta,
      };
      axios.post(html + '/updateprop/' + idproposta, obj).then(() => {
        toast(1, '#52be80', 'PROPOSTA ATUALIZADA COM SUCESSO.', 3000);
        loadPropostas();
      });
    }
  }

  // renderizando a tela INSERIR OU ATUALIZAR PROPOSTAS.
  const [viewproposta, setviewproposta] = useState(0);
  const viewProposta = (valor) => {
    setviewproposta(0);
    setTimeout(() => {
      setviewproposta(valor); // 1 para inserir proposta, 2 para atualizar proposta.
    }, 500);
  }

  // constantes relacionadas à lista de propostas:
  const [idproposta, setidproposta] = useState(0);
  const [proposta, setproposta] = useState('');
  const [inicioprop, setinicioprop] = useState(moment().format('DD/MM/YYYY'));
  const [terminoprop, setterminoprop] = useState('');

  const selectProposta = (item) => {
    window.scrollTo(0, 0);
    setidproposta(item.id);
    setproposta(item.proposta);
    setinicioprop(item.inicio);
    setterminoprop(item.termino);
    viewProposta(2);
  }

  // LISTA DE INTERCONSULTAS.
  const loadInterconsultas = (idpaciente) => {
    axios.get(html + "/interconsultas/'" + idpaciente + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistinterconsultas(x.sort((a, b) => moment(a.pedido, 'DD/MM/YYYY HH:MM') < moment(b.pedido, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
      setarrayinterconsultas(x.sort((a, b) => moment(a.pedido, 'DD/MM/YYYY HH:MM') < moment(b.pedido, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
    });
  }

  // renderizando a tela INSERIR OU ATUALIZAR INTERCONSULTA.
  const [viewinterconsulta, setviewinterconsulta] = useState(0);
  const viewInterconsulta = (valor) => {
    setviewinterconsulta(0);
    setTimeout(() => {
      setviewinterconsulta(valor); // 1 para inserir interconsulta, 2 para atualizar interconsulta.
    }, 500);
  }

  // atualizando um pedido de interconsulta.
  const [idinterconsulta, setidinterconsulta] = useState(0);
  const [pedidointerconsulta, setpedidointerconsulta] = useState('');
  const [especialidadeinterconsulta, setespecialidadeinterconsulta] = useState('');
  const [motivointerconsulta, setmotivointerconsulta] = useState('');
  const [statusinterconsulta, setstatusinterconsulta] = useState(0);
  const [parecerinterconsulta, setparecerinterconsulta] = useState('');
  const updateInterconsulta = (item) => {
    setidinterconsulta(item.id);
    setpedidointerconsulta(item.pedido);
    setespecialidadeinterconsulta(item.especialidade);
    setmotivointerconsulta(item.motivo);
    setstatusinterconsulta(item.status);
    setparecerinterconsulta(item.parecer);
    viewInterconsulta(2);
  }

  // assinando uma interconsulta.
  const signInterconsulta = (item) => {
    var obj = {
      idpaciente: idpaciente,
      idatendimento: item.idatendimento,
      pedido: item.pedido,
      especialidade: item.especialidade,
      motivo: item.motivo,
      status: 1,
      parecer: item.parecer,
    };
    axios.post(html + '/updateinterconsulta/' + item.id, obj).then(() => {
      toast(1, '#52be80', 'INTERCONSULTA ASSINADA COM SUCESSO.', 3000);
      loadInterconsultas(idpaciente);
    });
  }
  // suspendendo uma interconsulta.
  const suspendInterconsulta = (item) => {
    var obj = {
      idpaciente: idpaciente,
      idatendimento: item.idatendimento,
      pedido: item.pedido,
      especialidade: item.especialidade,
      motivo: item.motivo,
      status: 2,
      parecer: item.parecer,
    };
    axios.post(html + '/updateinterconsulta/' + idinterconsulta, obj).then(() => {
      toast(1, '#52be80', 'INTERCONSULTA SUSPENSA COM SUCESSO.', 3000);
    });
  }
  // excluindo uma interconsulta não assinada.
  const deleteInterconsulta = (item) => {
    axios.get(html + "/deleteinterconsulta/" + item.id).then(() => {
      loadInterconsultas(idpaciente);
      toast(1, '#52be80', 'INTERCONSULTA CANCELADA COM SUCESSO.', 3000);
    });
  }

  // filtro para as interconsultas.
  function ShowFilterInterconsultas() {
    if (stateprontuario === 5) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', margin: 5 }}>
          <input
            className="input"
            autoComplete="off"
            placeholder="BUSCAR INTERCONSULTA..."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'BUSCAR INTERCONSULTA...')}
            onChange={() => filterInterconsulta()}
            style={{
              width: '100%',
              margin: 0,
            }}
            type="text"
            id="inputFilterInterconsulta"
            defaultValue={filterInterconsulta}
            maxLength={100}
          ></input>
        </div >
      )
    } else {
      return null;
    }
  }

  const [filterinterconsulta, setfilterinterconsulta] = useState('');
  var searchinterconsulta = '';
  var timeout = null;

  const filterInterconsulta = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterInterconsulta").focus();
    searchinterconsulta = document.getElementById("inputFilterInterconsulta").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchinterconsulta === '') {
        setarrayinterconsultas(listinterconsultas);
        document.getElementById("inputFilterInterconsulta").value = '';
        document.getElementById("inputFilterInterconsulta").focus();
      } else {
        setfilterinterconsulta(document.getElementById("inputFilterInterconsulta").value.toUpperCase());
        setarrayinterconsultas(listinterconsultas.filter(item => item.especialidade.includes(searchinterconsulta) === true));
        document.getElementById("inputFilterInterconsulta").value = searchinterconsulta;
        document.getElementById("inputFilterInterconsulta").focus();
      }
    }, 500);
  }

  var showparecer = 0;

  // exibição da lista de interconsultas.
  const ShowIntercosultas = useCallback(() => {
    if (stateprontuario === 5) {
      return (
        <div
          id="interconsultas"
          className="conteudo"
        >
          <Identificacao></Identificacao>
          <div
            className="scroll"
            id="LISTA DE INTERCONSULTAS"
          >
            {arrayinterconsultas.map((item) => (
              <div
                key={item.id}
                id="item da lista"
                className="row"
              >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <button
                      className="blue-button"
                      style={{
                        width: 250, padding: 10,
                        backgroundColor: item.status === 0 ? '#ec7063' : item.status === 1 ? '#f5b041' : '#52be80',
                      }}
                    >
                      {item.status === 0 ? 'ASSINATURA PENDENTE' : item.status === 1 ? 'AGUARDANDO AVALIAÇÃO' : item.status === 2 ? 'ESPECIALISTA ACOMPANHA' : 'ENCERRADA PELO ESPECIALISTA'}
                    </button>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <button className="animated-green-button"
                        onClick={() => signInterconsulta(item)}
                        disabled={item.status !== 0 ? true : false}
                        title="ASSINAR PEDIDO DE INTERCONSULTA."
                        style={{
                          marginRight: item.status === 0 ? 2.5 : -5,
                          display: item.status !== 0 ? 'none' : 'flex',
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
                      <button className="animated-red-button"
                        onClick={() => suspendInterconsulta(item)}
                        disabled={item.status !== 1 ? true : false}
                        title="SUSPENDER PEDIDO DE INTERCONSULTA."
                        style={{
                          display: item.status !== 1 ? 'none' : 'flex',
                          maxWidth: 50,
                          marginRight: -2.5,
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
                      <button className="animated-yellow-button"
                        title="EDITAR PEDIDO DE INTERCONSULTA."
                        onClick={() => updateInterconsulta(item)}
                        style={{
                          display: item.status === 0 ? 'flex' : 'none',
                          marginRight: 2.5,
                        }}
                      >
                        <img
                          alt=""
                          src={editar}
                          style={{
                            margin: 10,
                            height: 30,
                            width: 30,
                          }}
                        ></img>
                      </button>
                      <button className="animated-red-button"
                        onClick={() => deleteInterconsulta(item)}
                        title="EXCLUIR PEDIDO DE INTERCONSULTA."
                        style={{
                          display: item.status === 0 ? 'flex' : 'none',
                          marginRight: -2.5,
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
                  <div className="title2" style={{ alignSelf: 'flex-start' }}> {item.pedido.substring(0, 10) + ' - ' + item.especialidade} </div>
                  <div className="title2" style={{ alignSelf: 'flex-start', marginTop: 0, paddingTop: 0 }}> {'MOTIVO: ' + item.motivo} </div>
                  <div
                    className="hover-button"
                    onClick={() => {
                      if (showparecer == 0) {
                        showparecer = 1;
                        document.getElementById('parecer' + item.id).style.display = 'flex';
                      } else {
                        showparecer = 0;
                        document.getElementById('parecer' + item.id).style.display = 'none';
                      }
                    }}
                    style={{ display: item.parecer == "" ? 'none' : 'flex', alignSelf: 'flex-start', margin: 5, padding: 5 }}>
                    {'PARECER...'}
                  </div>
                  <div
                    id={'parecer' + item.id}
                    className="title2 fade-in"
                    style={{ display: 'none', marginLeft: 5, marginTop: 10, alignSelf: 'flex-start' }}
                  > {item.parecer}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 5, marginRight: 0 }}>
                </div>
              </div>
            ))}
          </div>
        </div >
      );
    } else {
      return null;
    }
  }, [stateprontuario, arrayinterconsultas]);

  // LISTA DE EXAMES LABORATORIAIS.
  const loadLaboratorio = () => {
    axios.get(html + "/lab/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistlaboratorio(x.sort((a, b) => moment(a.datapedido, 'DD/MM/YYYY HH:MM') < moment(b.datapedido, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
      setarraylaboratorio(x.sort((a, b) => moment(a.datapedido, 'DD/MM/YYYY HH:MM') < moment(b.datapedido, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
    });
  }

  // constantes relacionadas à lista de exames laboratoriais:
  const [idlab, setidlab] = useState(0);
  const [codigolab, setcodigolab] = useState(0);
  const [examelab, setexamelab] = useState('');
  const [resultadolab, setresultadolab] = useState('');
  const [statuslab, setstatuslab] = useState(0);
  const [datapedidolab, setdatapedidolab] = useState('');
  const [dataresultadolab, setdataresultadolab] = useState('');

  // filtro para busca de exames laboratoriais.
  function ShowFilterLaboratorio() {
    if (stateprontuario === 6) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', margin: 5 }}>
          <input
            className="input"
            autoComplete="off"
            placeholder="BUSCAR EXAME LABORATORIAL..."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'BUSCAR EXAME LABORATORIAL...')}
            onChange={() => filterLaboratorio()}
            style={{
              width: '100%',
              margin: 0,
            }}
            type="text"
            id="inputFilterLaboratorio"
            defaultValue={filterlaboratorio}
            maxLength={100}
          ></input>
        </div >
      )
    } else {
      return null;
    }
  }
  const [filterlaboratorio, setfilterlaboratorio] = useState('');
  var searchlaboratorio = '';
  var timeout = null;
  const filterLaboratorio = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterLaboratorio").focus();
    searchlaboratorio = document.getElementById("inputFilterLaboratorio").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchlaboratorio === '') {
        setarraylaboratorio(listlaboratorio);
        document.getElementById("inputFilterLaboratorio").value = '';
        document.getElementById("inputFilterLaboratorio").focus();
      } else {
        setfilterlaboratorio(document.getElementById("inputFilterLaboratorio").value.toUpperCase());
        setarraylaboratorio(listlaboratorio.filter(item => item.exame.includes(searchlaboratorio) === true));
        document.getElementById("inputFilterLaboratorio").value = searchlaboratorio;
        document.getElementById("inputFilterLaboratorio").focus();
      }
    }, 500);
  }

  const selectLab = (item) => {
    setidlab(item.id);
    setcodigolab(item.codigo);
    setexamelab(item.exame);
    setresultadolab(item.resultado);
    setstatuslab(item.status);
    setdatapedidolab(item.datacoleta);
    setdataresultadolab(item.dataresultado);
  }

  // renderizando a tela INSERIR EXAME LABORATORIAL.
  const [viewlaboratorio, setviewlaboratorio] = useState(0);
  const viewLaboratorio = () => {
    setviewlaboratorio(0);
    setTimeout(() => {
      setviewlaboratorio(1); // 1 para inserir exame.
    }, 500);
  }

  // deletando um registro de exame laboratorial.
  const deleteLab = (item) => {
    axios.get(html + "/deletelab/'" + item.id + "'").then(() => {
      setfilterlaboratorio('');
      loadLaboratorio();
      toast(1, '#52be80', 'PEDIDO DE EXAME LABORATORIAL CANCELADO COM SUCESSO.', 3000);
    });
  }

  // exibição da lista de exames laboratoriais.
  const ShowLaboratorio = useCallback(() => {
    if (stateprontuario === 6) {
      return (
        <div className="conteudo"
          id="laboratório"
        >
          <Identificacao></Identificacao>
          <div
            className="scroll"
            id="LISTA DE EXAMES LABORATORIAIS"
          >
            {arraylaboratorio.map((item) => (
              <div
                key={item.id}
                id="item da lista"
                className="row"
              >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>

                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <button
                          className="blue-button"
                          style={{
                            width: 50,
                            height: 50,
                            margin: 2.5,
                            padding: 10,
                            flexDirection: 'column',
                            backgroundColor: item.status == 1 ? '#ec7063' : item.status == 2 ? '#f39c12' : '#52be80',
                          }}
                        >
                          <div>{item.status == 1 ? '!' : item.status == 2 ? <img alt=""
                            src={clock}
                            style={{
                              margin: 10,
                              height: 20,
                              width: 20,
                            }} ></img> : '✔'}</div>
                        </button>

                        <div className="title2" style={{ justifyContent: 'flex-start', marginBottom: 0 }}>
                          {item.resultado != '' ? item.exame + ': ' + item.resultado : item.exame}
                        </div>
                      </div>

                      <div className="title2" style={{ alignSelf: 'flex-start', marginTop: 0, marginBottom: 0, opacity: 0.5 }}>
                        {'REFERÊNCIA: ' + item.referencia}
                      </div>
                    </div>
                    <button className="animated-red-button"
                      onClick={() => deleteLab(item)}
                      style={{ display: item.status === 'AGUARDANDO COLETA' ? 'flex' : 'none' }}
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
                  <div className="title2" style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 0, paddingTop: 0, opacity: 0.5 }}>
                    <div style={{ display: window.innerWidth > 400 ? 'flex' : 'none' }}>
                      {'SOLICITAÇÃO: ' + item.datapedido}
                    </div>
                    <div style={{ display: item.dataresultado == '' ? 'none' : 'flex', marginLeft: window.innerWidth > 400 ? 20 : 0 }}>
                      {'RESULTADO: ' + item.dataresultado}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
              <button className="blue-button"
                onClick={() => viewLaboratorio(1)}
                style={{ display: window.innerWidth > 800 ? 'none' : 'flex', marginRight: 7.5, marginTop: 2.5 }}
              >
                <img
                  alt=""
                  src={novo}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
            </div>
          </div>
        </div >
      );
    } else {
      return null;
    }
  }, [stateprontuario, listlaboratorio, arraylaboratorio]);

  // LISTA DE HEMODIÁLISES.
  //const loadHemodialises = () => {
  // ROTA: SELECT * FROM hemodialises WHERE idatendimento = idatendimento.
  //axios.get(html + "/hemodialises/'" + idatendimento + "'").then((response) => {
  //setlisthemodialises(response.data);
  //});
  //}

  // LISTA DE CULTURAS.
  //const loadCulturas = () => {
  // ROTA: SELECT * FROM culturas WHERE idatendimento = idatendimento.
  //axios.get(html + "/culturas/'" + idatendimento + "'").then((response) => {
  //setlistculturas(response.data);
  //});
  //}

  // LISTA DE EXAMES DE IMAGEM.
  const loadImagem = () => {
    axios.get(html + "/image/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistimagem(x.sort((a, b) => moment(a.datapedido, 'DD/MM/YYYY HH:MM') < moment(b.datapedido, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
      setarrayimagem(x.sort((a, b) => moment(a.datapedido, 'DD/MM/YYYY HH:MM') < moment(b.datapedido, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
    });
  }

  // constantes relacionadas à lista de exames de imagem:
  const [idimagem, setidimagem] = useState(0);
  const [codigoimagem, setcodigoimagem] = useState(0);
  const [exameimagem, setexameimagem] = useState('');
  const [laudoimagem, setlaudoimagem] = useState('');
  const [statusimagem, setstatusimagem] = useState(0);
  const [datapedidoimagem, setdatapedidoimagem] = useState('');
  const [dataresultadoimagem, setdataresultadoimagem] = useState('');

  // filtro para busca de exames laboratoriais.
  function ShowFilterImagem() {
    if (stateprontuario === 7) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', margin: 5 }}>
          <input
            className="input"
            autoComplete="off"
            placeholder="BUSCAR EXAME DE IMAGEM..."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'BUSCAR EXAME DE IMAGEM...')}
            onChange={() => filterImagem()}
            style={{
              width: '100%',
              margin: 0,
            }}
            type="text"
            id="inputFilterImagem"
            defaultValue={filterimagem}
            maxLength={100}
          ></input>
        </div >
      )
    } else {
      return null;
    }
  }
  //
  const [filterimagem, setfilterimagem] = useState('');
  var searchimagem = '';
  var timeout = null;
  const filterImagem = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterImagem").focus();
    searchimagem = document.getElementById("inputFilterImagem").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchimagem === '') {
        setarrayimagem(listimagem);
        document.getElementById("inputFilterImagem").value = '';
        document.getElementById("inputFilterImagem").focus();
      } else {
        setfilterimagem(document.getElementById("inputFilterImagem").value.toUpperCase());
        setarrayimagem(listimagem.filter(item => item.exame.includes(searchimagem) === true));
        document.getElementById("inputFilterImagem").value = searchimagem;
        document.getElementById("inputFilterImagem").focus();
      }
    }, 500);
  }

  const selectImagem = (item) => {
    setidimagem(item.id);
    setcodigoimagem(item.codigo);
    setexameimagem(item.exame);
    setlaudoimagem(item.laudo);
    setstatusimagem(item.status);
    setdatapedidoimagem(item.datapedido);
    setdataresultadoimagem(item.dataresultado);
  }
  // renderizando a tela INSERIR EXAME DE IMAGEM.
  const [viewimagem, setviewimagem] = useState(0);
  const viewImagem = () => {
    setviewimagem(0);
    setTimeout(() => {
      setviewimagem(1); // 1 para inserir exame.
    }, 500);
  }
  // deletando um registro de exame de imagem.
  const deleteImagem = (item) => {
    axios.get(html + "/deleteimage/'" + item.id + "'").then(() => {
      setfilterimagem('');
      loadImagem();
      toast(1, '#52be80', 'SOLICITAÇÃO DE EXAME DE IMAGEM CANCELADA COM SUCESSO.', 3000);
    });
  }
  // exibição da lista de exames de imagem.
  function ShowImagem() {
    if (stateprontuario === 7) {
      return (
        <div
          id="imagem"
          className="conteudo"
        >
          <Identificacao></Identificacao>
          <div
            className="scroll"
            id="LISTA DE EXAMES DE IMAGEM"          >
            {arrayimagem.map((item) => (
              <div
                key={item.id}
                id="item da lista"
                className="row"
              >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                      <button
                        className="blue-button"
                        style={{
                          width: 50,
                          height: 50,
                          margin: 2.5,
                          padding: 10,
                          flexDirection: 'column',
                          backgroundColor: item.status == 1 ? '#ec7063' : item.status == 2 ? '#f39c12' : '#52be80',
                        }}
                      >
                        <div>{item.status == 1 ? '!' : item.status == 2 ? <img alt=""
                          src={clock}
                          style={{
                            margin: 10,
                            height: 20,
                            width: 20,
                          }} ></img> : '✔'}</div>
                      </button>
                      <div className="title2" style={{ justifyContent: 'flex-start', marginBottom: 0 }}>
                        {item.exame}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <button id="viewimage" className="animated-blue-button" style={{ display: item.status < 3 ? 'none' : 'flex' }}>
                        <img
                          alt=""
                          src={viewimage}
                          style={{
                            margin: 10,
                            height: 30,
                            width: 30,
                          }}
                        ></img>
                      </button>
                      <button className="animated-red-button"
                        onClick={() => deleteImagem(item)}
                        style={{ display: item.status == 1 ? 'flex' : 'none' }}
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
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <div className="title2" style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 0, opacity: 0.5 }}>
                      <div>
                        {'SOLICITAÇÃO: ' + item.pedido}
                      </div>
                      <div style={{ display: item.resultado == '' ? 'none' : 'flex', marginLeft: 10 }}>
                        {'RESULTADO: ' + item.resultado}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
              <button className="blue-button"
                onClick={() => viewImagem(1)}
                style={{ display: window.innerWidth > 800 ? 'none' : 'flex', marginRight: 7.5, marginTop: 2.5 }}
              >
                <img
                  alt=""
                  src={novo}
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

  // LISTA DE BALANÇOS HÍDRICOS.
  // carregando a lista de balanços.
  const loadBalancos = () => {
    var x = [0, 1];
    axios.get(html + "/balancos/" + idatendimento).then((response) => {
      x = response.data;
      setlistbalancos(x.sort((a, b) => a.id > b.id ? 1 : -1));
    });
  }
  // deletando um balanço.
  const deleteBalanco = (item) => {
    axios.get(html + "/deletebalanco/" + item.id);
    setTimeout(() => {
      // deletando todos os itens de ganho associados ao balanço excluído.
      axios.get(html + "/deleteallganhos/" + item.id);
      // deletando todos os itens de perda associados ao balanço excluído.
      axios.get(html + "/deleteallperdas/" + item.id);
      loadBalancos();
    }, 1000);
  }
  // assinando um balanço.
  const signBalanco = (item) => {
    var obj = {
      idatendimento: item.idatendimento,
      data: item.data,
      hora: item.hora,
      pas: item.pas,
      pad: item.pad,
      fc: item.fc,
      fr: item.fr,
      sao2: item.sao2,
      tax: item.tax,
      diurese: item.diurese,
      fezes: item.fezes,
      status: 1, // assinado.
      usuario: item.usuario,
    };
    axios.post(html + '/updatebalanco/' + item.id, obj);
  };
  // suspendendo um balanço assinando.
  const suspendBalanco = (item) => {
    var obj = {
      idatendimento: item.idatendimento,
      data: item.data,
      hora: item.hora,
      pas: item.pas,
      pad: item.pad,
      fc: item.fc,
      fr: item.fr,
      sao2: item.sao2,
      tax: item.tax,
      diurese: item.diurese,
      fezes: item.fezes,
      status: 2, // suspenso.
      usuario: item.usuario,
    };
    axios.post(html + '/updatebalanco/' + item.id, obj);
  };
  // copiando um balanço assinando.
  const copyBalanco = (item) => {
    var obj = {
      idatendimento: item.idatendimento,
      data: moment().format('DD/MM/YY') + ' ' + moment().format('HH') + ':00',
      hora: moment().format('HH') + ':00',
      pas: item.pas,
      pad: item.pad,
      fc: item.fc,
      fr: item.fr,
      sao2: item.sao2,
      tax: item.tax,
      diurese: item.diurese,
      fezes: item.fezes,
      status: 0,
      usuario: item.usuario,
    };
    axios.post(html + '/insertbalanco', obj);
  };
  // inserindo um balanço.
  const newBalanco = (item) => {
    var obj = {
      idatendimento: idatendimento,
      data: moment().format('DD/MM/YY') + ' ' + moment().format('HH') + ':00',
      hora: moment().format('HH') + ':00',
      pas: '?',
      pad: '?',
      fc: '?',
      fr: '?',
      sao2: '?',
      tax: '?',
      diurese: '?',
      fezes: '?',
      status: 0, // aberto.
      usuario: nomeusuario,
    };
    axios.post(html + '/insertbalanco', obj).then(() => loadBalancos());
  };

  // selecionando um registro de balanço na lista de balanços hídricos.
  const [idbalanco, setidbalanco] = useState();
  const [databalanco, setdatabalanco] = useState();
  const [horabalanco, sethorabalanco] = useState();
  const updateBalanco = (item) => {
    setidbalanco(item.id);
    setdatabalanco(item.data);
    sethorabalanco(item.hora);
    setpas(item.pas);
    setpad(item.pad);
    setfc(item.fc);
    setfr(item.fr);
    setsao2(item.sao2);
    settax(item.tax);
    setdiu(item.diurese);
    setfezes(item.fezes);
    viewBalanco(2);
  }

  // renderizando a tela INSERIR OU ATUALIZAR BALANÇO HÍDRICO.
  // const [viewbalanco, setviewbalanco] = useState(0);
  const viewBalanco = (valor) => {
    setviewbalanco(0);
    setTimeout(() => {
      setviewbalanco(valor); // 1 para inserir balanco, 2 para atualizar balanço.
    }, 500);
  }

  // TRATAMENTO DE DADOS DO BALANÇO HÍDRICO.
  // soma de ganhos e perdas, para exibição nos balanços.
  function getSum(total, num) {
    return total + num;
  }
  const [somaganhos, setsomaganhos] = useState([]);
  const getSomaGanhos = () => {
    axios.get(html + "/itensganhossoma/" + idatendimento).then((response) => {
      var x = response.data;
      setsomaganhos(response.data);
    });
  }
  const [somaperdas, setsomaperdas] = useState([]);
  const getSomaPerdas = () => {
    axios.get(html + "/itensperdassoma/" + idatendimento).then((response) => {
      var x = response.data;
      setsomaperdas(response.data);
    });
  }

  // recuperando o total de diurese nas últimas 12h.
  const [diurese12h, setdiurese12h] = useState(0);
  const getDiurese12h = () => {
    // filtrando os balanços registrados nas últimas 12h.
    var x12h = listbalancos.filter((item) => moment().diff(moment(item.data, 'DD/MM/YY HH:mm'), 'hours') < 13);
    // selecionando apenas os valores de diurese dos balanços acima filtrados.
    var xdiurese = x12h.map((item) => parseInt(item.diurese));
    // somando o total de diurese.
    var volbok = xdiurese.reduce(getSum, 0);
    setdiurese12h(xdiurese.reduce(getSum, 0));
  }

  // recuperando o balanço hídrico nas últimas 12h.
  // >> ganhos.
  var arrayganhos = [];
  const [ganhos12h, setganhos12h] = useState([]);
  const getGanhos = (value) => {
    axios.get(html + "/itensganhos/" + value).then((response) => {
      var x = response.data;
      // somando os ganhos de um registro de balanço.
      var y = x.map((item) => item.valor).reduce(getSum, 0);
      // acrescentando o valor da soma à arrayganhos.
      arrayganhos.push(y);
      // somando os valores da arrayganhos.
      setganhos12h(arrayganhos.reduce(getSum, 0));
    });
  }
  // >> perdas.
  var arrayperdas = [];
  const [perdas12h, setperdas12h] = useState([]);
  const getPerdas = (value) => {
    axios.get(html + "/itensperdas/" + value).then((response) => {
      var x = response.data;
      // somando as perdas de um registro de balanço.
      var y = x.map((item) => item.valor).reduce(getSum, 0);
      // acrescentando o valor da soma à arrayperdas.
      arrayperdas.push(y);
      // somando os valores da arrayperdas.
      setperdas12h(arrayperdas.reduce(getSum, 0));
    });
  }

  // recuperando o balanço hídrico acumulado.
  // >> ganhos.
  var arrayganhosacumulados = [];
  const [ganhosacumulados, setganhosacumulados] = useState([]);
  const getGanhosAcumulados = (value) => {
    axios.get(html + "/itensganhos/" + value).then((response) => {
      var x = response.data;
      // somando os ganhos de um registro de balanço.
      var y = x.map((item) => item.valor).reduce(getSum, 0);
      // acrescentando o valor da soma à arrayganhos.
      arrayganhosacumulados.push(y);
      // somando os valores da arrayganhos.
      setganhosacumulados(arrayganhosacumulados.reduce(getSum, 0));
    });
  }
  // >> perdas.
  var arrayperdasacumuladas = [];
  const [perdasacumuladas, setperdasacumuladas] = useState([]);
  const getPerdasAcumuladas = (value) => {
    axios.get(html + "/itensperdas/" + value).then((response) => {
      var x = response.data;
      // somando as perdas de um registro de balanço.
      var y = x.map((item) => item.valor).reduce(getSum, 0);
      // acrescentando o valor da soma à arrayperdas.
      arrayperdasacumuladas.push(y);
      // somando os valores da arrayperdas.
      setperdasacumuladas(arrayperdasacumuladas.reduce(getSum, 0));
    });
  }

  // obtendo os valores para cálculo do bh 12h.
  const [bh12h, setbh12h] = useState(0);
  const getBh12h = () => {
    // filtrando os balanços registrados nas últimas 12h.
    var x12h = listbalancos.filter((item) => moment().diff(moment(item.data, 'DD/MM/YY HH:mm'), 'hours') < 13);
    // obtendo a soma de ganhos para cada id de balanço.
    x12h.map((item) => getGanhos(item.id));
    // obtendo a soma de perdas para cada id de balanço.
    x12h.map((item) => getPerdas(item.id));
  }

  // obtendo os valores para cálculo do bh acumulado.
  const [bhacumulado, setbhacumulado] = useState(0);
  const getBhAcumulado = () => {
    // obtendo a soma de ganhos para cada id de balanço.
    listbalancos.map((item) => getGanhosAcumulados(item.id));
    // obtendo a soma de perdas para cada id de balanço.
    listbalancos.map((item) => getPerdasAcumuladas(item.id));
  }

  // exibição da lista de propostas.
  function ShowBalancos() {
    if (stateprontuario === 8) {
      return (
        <div
          id="balanços"
          className="conteudo">
          <Identificacao></Identificacao>
          <div
            className="scroll"
            id="LISTA DE BALANÇOS"
          >
            {listbalancos.map((item) => (
              <div
                key={item.id}
                id="item da lista"
                className="row"
              >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                  <div id="GANHOS E PERDAS + BOTÕES" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <div id="DATA E HORA" className={item.status == 0 ? "red-button" : "green-button"}
                      style={{
                        width: 100, minWidth: 100, padding: 10,
                        backgroundColor: item.status == 0 ? '#ec7063' : '#52be80',
                      }}>
                      {item.data}
                    </div>
                    <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <button className="animated-green-button"
                        onClick={() => copyBalanco(item)}
                        style={{
                          marginRight: 2.5,
                          display: item.status === 1 ? 'flex' : 'none',
                        }}
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
                      <button className={item.status === 0 ? "animated-green-button" : "animated-red-button"}
                        onClick={item.status === 0 ? () => signBalanco(item) : () => suspendBalanco(item)}
                        disabled={item.status === 2 ? true : false}
                        style={{
                          marginRight: 2.5, boxShadow: 'none',
                        }}
                      >
                        <img
                          alt=""
                          src={item.status === 0 ? salvar : suspender}
                          style={{
                            margin: 10,
                            height: 30,
                            width: 30,
                          }}
                        ></img>
                      </button>
                      <button className="animated-yellow-button"
                        onClick={() => updateBalanco(item)}
                        style={{
                          display: item.status === 0 ? 'flex' : 'none',
                          marginRight: 2.5, boxShadow: 'none',
                        }}
                      >
                        <img
                          alt=""
                          src={editar}
                          style={{
                            margin: 10,
                            height: 30,
                            width: 30,
                          }}
                        ></img>
                      </button>
                      <button className="animated-red-button"
                        onClick={() => deleteBalanco(item)}
                        style={{
                          display: item.status === 0 ? 'flex' : 'none', boxShadow: 'none',
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
                  <div id="balanço" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <div
                      className="title2" style={{ width: 200, justifyContent: 'flex-start' }}
                    >
                      {'TOTAL DE GANHOS: ' + somaganhos.filter(value => value.idbalanco === item.id).map((item) => item.valor).reduce(getSum, 0)}
                    </div>
                    <div
                      className="title2" style={{ width: 200 }}
                    >
                      {'TOTAL DE PERDAS: ' + (somaperdas.filter(value => value.idbalanco === item.id).map((item) => item.valor).reduce(getSum, 0) + parseInt(item.diurese))}
                    </div>
                  </div>
                  <div id="DADOS VITAIS" className="blue-button" style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#8f9bbc' }}>
                    <div
                      className="title2"
                      style={{
                        margin: 2.5,
                        padding: 10,
                        color: '#ffffff',
                      }}
                    >
                      {'PAM: ' + Math.ceil((2 * parseInt(item.pad) + parseInt(item.pas)) / 3) + 'mmHg'}
                    </div>
                    <div
                      className="title2"
                      style={{
                        margin: 2.5,
                        padding: 10,
                        color: '#ffffff',
                      }}
                    >
                      {'FC: ' + item.fc + ' BPM'}
                    </div>
                    <div
                      className="title2"
                      style={{
                        margin: 2.5,
                        padding: 10,
                        color: '#ffffff',
                      }}
                    >
                      {'FR: ' + item.fr + ' IRPM'}
                    </div>
                    <div
                      className="title2"
                      style={{
                        margin: 2.5,
                        padding: 10,
                        color: '#ffffff',
                      }}
                    >
                      {'SAO2: ' + item.sao2 + '%'}
                    </div>
                    <div
                      className="title2"
                      style={{
                        margin: 2.5,
                        padding: 10,
                        color: '#ffffff',
                      }}
                    >
                      {'TAX: ' + item.tax + '°C'}
                    </div>
                    <div
                      className="title2"
                      style={{
                        margin: 2.5,
                        padding: 10,
                        color: '#ffffff',
                      }}
                    >
                      {'DIURESE: ' + item.diurese}
                    </div>
                    <div
                      className="title2"
                      style={{
                        margin: 2.5,
                        padding: 10,
                        color: '#ffffff',
                      }}
                    >
                      {'EVACUAÇÕES: ' + item.fezes}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div >
      )
    } else {
      return null
    }
  }

  // bloqueando a scroll (ao exibir telas secundárias e modais).
  function noScroll() {
    window.scrollTo(0, 0);
  }

  const [viewupdateatendimento, setviewupdateatendimento] = useState(0);
  const [viewevolucao, setviewevolucao] = useState(0);
  const [viewbalanco, setviewbalanco] = useState(0);
  const [viewprintevolucao, setviewprintevolucao] = useState(0);
  const [viewformulario, setviewformulario] = useState(0);

  useEffect(() => {
    setloadprincipal(1);
    setTimeout(() => {
      setloadprincipal(0);
    }, 3000);
    // abrindo o prontuário sempre na tela principal.
    setstateprontuario(1);
    // carregando dados do paciente e do atendimento.
    loadAtendimento();
    // prevenindo a exibição do boneco caso um médico acesse a corrida pela tela/state prescrição.
    setshowinvasoes(0);
    // scroll to top on render (importante para as versões mobile).
    window.scrollTo(0, 0);
    // limpando alertas.
    setalertas([]);
    arrayalertas = [];
    // fechando as visualizações das telas secundárias (melhor aproximação até o momento).
    setviewevolucao(0);
    setviewprintevolucao(0);
    setviewprintformulario(0);
    setviewdiagnostico(0);
    setviewproblema(0);
    setviewproposta(0);
    setviewinterconsulta(0);
    setviewlaboratorio(0);
    setviewimagem(0);
    setviewbalanco(0);
    setviewformulario(0);
    setviewprintformulario(0);
    setshowlesoes(0);
    setshowinvasoes(1);
    // resetando estado das scrolls.
    setscrollmenu(0);
    // desabilitando a wheel do mouse (causava glitches nas scrolls).
    document.getElementById("PRINCIPAL").onwheel = function (e) {
      e.preventDefault()
    }
    // eslint-disable-next-line
  }, [idatendimento])

  // animação para carregamento da tela principal.
  const [loadprincipal, setloadprincipal] = useState(0);
  const LoadPrincipal = useCallback(() => {
    return (
      <div
        className="scroll"
        style={{
          display: loadprincipal == 1 ? 'flex' : 'none',
          borderRadius: 0, overflowY: 'scroll', paddingRight: 10, backgroundColor: '#ffffff', opacity: 0.5,
          justifyContent: 'center', flexDirection: 'column',
        }}>
        <img
          className="pulsarlogo"
          alt=""
          src={logoinverted}
          style={{
            padding: 0,
            margin: 0,
            borderRadius: 0,
          }}
        ></img>
      </div>
    )
  }, [loadprincipal]);

  // funções deflagradas para alimentação da tela principal.
  const updatePrincipal = (idpaciente) => {
    // carregando invasões.
    loadInvasoes();
    // carregando lesões de pressão.
    loadLesoes();
    // carregando últimos parâmetros ventilatórios.
    loadVm();
    // carregando histórico de antibióticos.
    setTimeout(() => {
      getAtb();
    }, 5000);
    // renderizando as escalas sensoriais.
    setViewglasgow(0);
    setViewrass(0);
    setViewramsay(0);
    if (glasgow != '') {
      setViewglasgow(1);
    }
    if (rass != '') {
      setViewrass(1);
    }
    if (ramsay != '') {
      setViewramsay(1);
    }
    // calculando o bh acumulado.
    loadBhacumulado();
    // carregando as listas.
    loadEvolucoes(idpaciente);
    loadDiagnosticos(idpaciente);
    loadProblemas();
    loadPropostas();
    loadInterconsultas(idpaciente);
    loadLaboratorio();
    loadImagem();
    loadBalancos();
    loadFormularios();
    // carregando listas de ganhos e perdas (para balanço hídrico).
    getSomaGanhos();
    getSomaPerdas();
    getDiurese12h();
    getBh12h();
    getBhAcumulado();
    // carregando os antibióticos.
    getAtb();
    // carregando os últimos valores válidos para Braden e Morse.
    loadLastBraden();
    loadLastMorse();
    // carregando alertas.
    loadAlertas();
    if (stateprontuario === 9 && (tipousuario === 1 || tipousuario === 2)) {
      setshowlesoes(0);
      setshowinvasoes(0);
    } else if (stateprontuario === 10 && tipousuario === 4) {
      setshowlesoes(0);
      setshowinvasoes(0);
    } else {
    }
  }

  // carregando os alertas.
  const loadAlertas = () => {
    setalertas([]);
    arrayalertas = [];
    // carregando os alertas.
    alertSepse();
    alertDadosVitais();
    alertCulturas();
    alertDispositivos();
    alertEvacuacoes();
    setTimeout(() => {
      setalertas(arrayalertas);
    }, 1000);
  }

  /*
  RENDERIZAÇÃO DOS COMPONENTES PERMANENTES DA TELA CORRIDA:
  - Header;
  - Identificação do paciente.
  - Menu para acesso às telas secundárias;
  - Widget de invasões (boneco) e respectivos menus;
  - Tela principal;
  */

  // IDENTIFICAÇÃO DO PACIENTE.
  function Paciente() {
    return (
      <div
        id="identificação"
        className="paciente"
        onClick={() => viewUpdateAtendimento()}
      >
        <div id="IDENTIFICAÇÃO" style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100vw',
          verticalAlign: 'center', alignItems: 'center',
        }}>
          <img
            alt=""
            src={foto}
            style={{
              height: '90%',
              padding: 0,
              margin: 5,
              borderRadius: 5,
            }}
          ></img>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', width: '100%' }}>
              <button
                className="grey-button"
                style={{
                  display: tipounidade != 4 ? 'flex' : 'none',
                  textTransform: 'uppercase',
                  width: window.innerWidth > 400 ? 65 : 50,
                  minWidth: window.innerWidth > 400 ? 65 : 50,
                  height: window.innerWidth > 400 ? 65 : 50,
                  minHeight: window.innerWidth > 400 ? 65 : 50,
                  marginRight: 5, marginLeft: 10,
                  backgroundColor: 'grey'
                }}
                id="inputBox"
                title={"BOX"}
              >
                {box}
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', width: '100%' }}>
                <button
                  className="rowitem"
                  style={{
                    marginLeft: tipounidade != 4 ? 0 : 5,
                    marginRight: 0,
                    marginBottom: 0,
                    paddingBottom: 0,
                    color: '#ffffff',
                    alignSelf: 'flex-start',
                    fontSize: window.innerWidth > 400 ? 18 : 14,
                  }}
                  id="inputNome"
                >
                  {nomepaciente}
                </button>
                <button
                  className="rowitem"
                  style={{
                    color: '#ffffff',
                    alignSelf: 'flex-start',
                  }}
                >
                  {moment().diff(moment(dn, 'DD/MM/YYYY'), 'years') < 2 ? + moment().diff(moment(dn, 'DD/MM/YYYY'), 'years') + ' ANO' : moment().diff(moment(dn, 'DD/MM/YYYY'), 'years') + ' ANOS'}
                </button>

                <div
                  style={{
                    display: window.innerWidth > 400 ? 'none' : 'flex',
                    bottom: 10, right: 10,
                    flexDirection: 'row',
                    alignSelf: 'flex-end', marginRight: 5,
                  }}
                >
                  <Link
                    to={tipounidade == 4 ? "/ambulatorio" : "/pacientes"}
                    className="grey-button"
                    title="VOLTAR."
                    style={{
                      minWidth: 40,
                      minHeight: 40,
                      width: 40,
                      height: 40,
                      margin: 2.5,
                      padding: 5,
                    }}
                  >
                    <img
                      alt=""
                      src={back}
                      style={{
                        margin: 0,
                        height: 20,
                        width: 20,
                      }}
                    ></img>
                  </Link>
                  <Link
                    to="/gpulse-web"
                    className="grey-button"
                    title="FAZER LOGOFF."
                    style={{
                      display: 'flex',
                      minWidth: 40,
                      minHeight: 40,
                      width: 40,
                      height: 40,
                      margin: 2.5,
                      padding: 5,
                    }}
                  >
                    <img
                      alt=""
                      src={logoff}
                      style={{
                        margin: 0,
                        height: 20,
                        width: 20,
                      }}
                    ></img>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: window.innerWidth > 400 ? 'flex' : 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
            margin: 10,
          }}
        >
          <div
            className="title2"
            style={{ color: '#ffffff', textAlign: 'right' }}
          >
            {'OLÁ, ' + nomeusuario}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Link
              to={tipounidade == 4 ? "/ambulatorio" : "/pacientes"}
              className="grey-button"
              title="VOLTAR."
              style={{
                width: 50,
                height: 50,
                margin: 2.5,
                padding: 20,
              }}
            >
              <img
                alt=""
                src={back}
                style={{
                  margin: 5,
                  height: 25,
                  width: 25,
                }}
              ></img>
            </Link>
            <Link
              to="/gpulse-web"
              className="grey-button"
              title="FAZER LOGOFF."
              style={{
                display: 'flex',
                width: 50,
                height: 50,
                margin: 2.5,
                padding: 20,
              }}
            >
              <img
                alt=""
                src={logoff}
                style={{
                  margin: 5,
                  height: 25,
                  width: 25,
                }}
              ></img>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // importando informações do último atendimento, caso o sistema identifique uma história em branco.
  const getLastAtendimento = (idpcte, box, admissao, dn) => {
    axios.get(html + "/atendimentos").then((response) => {
      var x = [0, 1];
      x = response.data;
      var y = [0, 1];
      // filtrando o último atendimento.
      y = x.filter((item) => item.idpaciente == idpcte && item.ativo == 0).sort(((a, b) => a.id > b.id ? 1 : -1)).slice(-1);
      // ativo 0 = atendimento inativo; ativo = 1 atendimento ativo e admissão não preenchida; ativo = 2 atendimento ativo e admissão preenchida.
      if (y.length > 0 && statusatendimento == 1) {
        // aqui os dados da admissão anterior são importados. O médico deve salvar o registro do atendimento atual, que terá seu valor de ativo modificado para 2. Em seguida, o sistema gera o relatório de admissão.
        var peso = y.map((item) => item.peso);
        var altura = y.map((item) => item.altura);
        var antecedentes = y.map((item) => item.antecedentes);
        var alergias = y.map((item) => item.alergias);
        var medicacoes = y.map((item) => item.medicacoes);
        var exames = y.map((item) => item.exames);
        var historia = y.map((item) => item.historia);
        var assistente = y.map((item) => item.assistente);
        var obj = {
          idpaciente: idpcte,
          hospital: nomehospital,
          unidade: nomeunidade,
          box: box,
          admissao: admissao,
          nome: nomepaciente,
          dn: dn,
          peso: peso,
          altura: altura,
          antecedentes: antecedentes,
          alergias: alergias,
          medicacoes: medicacoes,
          exames: exames,
          historia: historia,
          status: 3, // estável.
          ativo: 1, // atendimento novo ativo, dados de anamnese copiados mas não confirmados.
          classificacao: classificacao,
          descritor: descritor,
          precaucao: 1, // precaução padrão.
          assistente: assistente !== 'SEM MÉDICO ASSISTENTE' ? assistente : 'SEM MÉDICO ASSISTENTE',
        };
        axios.post(html + '/updateatendimento/' + idatendimento, obj).then(() => {
          toast(1, '#52be80', 'INFORMAÇÕES DO ÚLTIMO ATENDIMENTO IMPORTADAS PARA O ATENDIMENTO ATUAL. FAVOR ATUALIZAR.', 3000);
          setTimeout(() => {
            viewUpdateAtendimento();
          }, 3500);
        });
      } else {
      }
    });
  }

  // COMPONENTES EXCLUSIVOS DA VERSÃO MOBILE:
  const [showmenu, setshowmenu] = useState(0);
  function ButtonMobileMenu() {
    return (
      <button
        className="grey-button"
        id="BTN MENU MOBILE"
        onClick={() => showMenuMobile()}
        onTouchStart={() => updateInvasoes()}
        style={{ zIndex: 0 }}
      >
        <img
          alt=""
          src={menu}
          style={{
            margin: 10,
            height: 30,
            width: 30,
          }}
        ></img>
      </button>
    )
  }

  const showMenuMobile = () => {
    window.scrollTo(0, 0);
    setshowmenu(1);
  }

  function MobileMenu() {
    if (showmenu === 1) {
      return (
        <div
          className="menucover"
        >
          <div
            className="grey-button"
            style={{
              padding: 10,
              backgroundColor: 'grey'
            }}
          >
            <button
              className="blue-button"
              onClick={() => clickPrincipal()}
              style={{
                width: 200,
                height: 50,
                margin: 5,
                padding: 0,
              }}
            >
              PRINCIPAL
            </button>
            <button
              className="blue-button"
              onClick={() => clickEvoluções()}
              style={{
                width: 200,
                height: 50,
                margin: 5,
                padding: 0,
              }}
            >
              EVOLUÇÕES
            </button>
            <button
              className="blue-button"
              onClick={() => clickDiagnosticos()}
              style={{
                width: 200,
                height: 50,
                margin: 5,
                padding: 0,
              }}
            >
              DIAGNÓSTICOS
            </button>
            <button
              className="blue-button"
              onClick={() => clickPropostas()}
              style={{
                width: 200,
                height: 50,
                margin: 5,
                padding: 0,
              }}
            >
              PROPOSTAS
            </button>
            <button
              className="blue-button"
              onClick={() => clickLaboratorio()}
              style={{
                width: 200,
                height: 50,
                margin: 5,
                padding: 0,
              }}
            >
              LABORATÓRIO
            </button>
            <button
              className="blue-button"
              onClick={() => clickImagem()}
              style={{
                width: 200,
                height: 50,
                margin: 5,
                padding: 0,
              }}
            >
              IMAGEM
            </button>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }

  // PAINEL PRINCIPAL.
  function Principal() {
    if (stateprontuario === 1 && loadprincipal == 0) {
      return (
        <div id="painel principal"
          className="scroll"
          style={{ borderRadius: 0, overflowY: 'scroll', paddingRight: 10 }}
        >
          <div
            className="secondary"
            id="DESTAQUES"
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              borderRadius: 0,
              backgroundColor: 'transparent',
              borderWidth: 0,
              width: '100%',
              margin: 10,
              padding: 0,
              paddingRight: 0,
            }}
          >
            <CardStatus></CardStatus>
            <CardAlertas></CardAlertas>
            <CardPrecaucao></CardPrecaucao>
            <CardDiasdeInternacao></CardDiasdeInternacao>
            <CardEvolucoes></CardEvolucoes>
            <CardInvasoes></CardInvasoes>
            <CardDiagnosticos></CardDiagnosticos>
            <CardLesoes></CardLesoes>
            <CardAntibioticos></CardAntibioticos>
            <CardInternacoes></CardInternacoes>

          </div>
          <div
            id="ANAMNESE"
            className="secondary"
            style={{
              margin: 0,
              padding: 5,
              paddingLeft: 10,
              paddingRight: 10,
              flexDirection: 'column',
              justifyContent: 'center',
              width: '100%',
              boxShadow: 'none'
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                margin: 0,
                padding: 0,
                justifyContent: 'center',
                width: '100%'
              }}
            >
              <textarea
                className="textarea"
                disabled="true"
                style={{ width: '100%', height: 140 }}
                id="inputAp"
                title="ANTECEDENTES PESSOAIS."
              >
                {'ANTECEDENTES PESSOAIS: ' + antecedentes}
              </textarea>
              <textarea
                className="textarea"
                disabled="true"
                style={{ width: '100%', height: 140 }}
                id="inputAlergias"
                title="ALERGIAS."
              >
                {'ALERGIAS: ' + alergias}
              </textarea>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                margin: 0,
                justifyContent: 'center',
                width: '100%'
              }}
            >
              <textarea
                className="textarea"
                disabled="true"
                style={{ width: '100%', height: 140 }}
                id="inputMedprev"
                title="MEDICAÇÕES PRÉVIAS."
              >
                {'MEDICAÇÕES DE USO CONTÍNUO: ' + medicacoes}
              </textarea>
              <textarea
                className="textarea"
                disabled="true"
                style={{ width: '100%', height: 140 }}
                id="inputExprev"
                title="EXAMES PRÉVIOS."
              >
                {'EXAMES PRÉVIOS: ' + exames}
              </textarea>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                margin: 0,
                justifyContent: 'center',
                width: '100%'
              }}
            >
              <textarea
                className="textarea"
                disabled="true"
                style={{ width: '100%', height: 140 }}
                id="inputHda"
                title="HISTÓRIA DA DOENÇA ATUAL."
              >
                {'HISTÓRIA DA DOENÇA ATUAL: ' + historia}
              </textarea>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  // carregando os antibióticos registrados em cada prescrição do atendimento.
  const [atblist, setatblist] = useState([]);
  const getAtb = () => {
    axios.get(html + "/atblist/'" + idatendimento + "'").then((response) => {
      setatblist(response.data);
    });
  }
  // EXIBIR LISTA DE ANTIBIÓTICOS USADOS.
  function CardAntibioticos() {
    return (
      <div className="pulsewidgetscroll" id="LISTA DE ANTIBIÓTICOS PRESCRITOS">
        <div className="title4 pulsewidgettitle">{'HISTÓRICO DE ANTIBIÓTICOS'}</div>
        <div className="pulsewidgetcontent" style={{ display: atblist.length > 0 ? 'flex' : 'none' }}>
          {atblist.map((item) => (
            <div
              className="title1"
              style={{
                display: atblist.filter(valor => valor.grupo == "ANTIBIOTICOS" && valor.idprescricao == item.id).length > 0 ? 'flex' : 'none',
              }}
            >
              {item.datainicio.substring(0, 8)}
              <div>
                {atblist.map((value) => (
                  <p
                    key={value.id}
                    id="item de antibiótico."
                    style={{
                      display: value.grupo == 'ANTIBIOTICOS' && value.idprescricao == item.id ? 'flex' : 'none',
                      paddingRight: window.innerWidth > 800 ? 5 : 0,
                      margin: 0,
                      marginTop: 2.5,
                      marginBottom: 5,
                      marginRight: 5,
                      opacity: 1.0,
                      width: '100%',
                      padding: 5,
                    }}
                  >
                    {value.farmaco}
                  </p>
                ))
                }
              </div>
            </div>
          ))
          }
        </div>
        <div className="pulsewidgetcontent"
          style={{
            display: atblist.length < 1 ? 'flex' : 'none',
            color: '#8f9bbc',
            fontWeight: 'bold',
            fontSize: 16,
          }}>
          SEM REGISTROS DE ANTIBIÓTICOS
        </div>
      </div>
    )
  }

  // card status.
  function CardStatus() {
    return (
      <div
        className="pulsewidgetstatic"
        id="STATUS"
        title="STATUS DO PACIENTE."
        onClick={tipousuario != 4 ? () => showChangeStatus() : null} // técnico
        style={{
          backgroundColor: status == 3 ? '#52be80' : status == 2 ? '#f5b041' : status == 1 ? '#ec7063' : status == 0 ? 'grey' : 'purple'
        }}
      >
        <text className="title5">
          {status == 3 ? 'STATUS: \nESTÁVEL' : status == 2 ? 'STATUS: \nALERTA' : status == 1 ? 'STATUS: \nINSTÁVEL' : status == 0 ? 'STATUS: \nCONFORTO' : 'STATUS: \nINDEFINIDO'}
        </text>
      </div>
    )
  }

  // componente para alteração do status.
  const [viewstatus, setViewstatus] = useState(0);
  function ChangeStatus() {
    if (viewstatus === 1) {
      return (
        <div
          className="secondary"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: 0,
            position: 'fixed',
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
            zIndex: 9,
          }}
        >
          <div>
            <div
              className="secondary"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 5,
                paddingTop: 30,
                paddingBottom: 30,
                paddingLeft: 30,
                paddingRight: 30,
              }}
            >
              <label
                className="title2"
                style={{ marginTop: 0, marginBottom: 15 }}
              >
                ATUALIZAR STATUS
              </label>
              <div
                id="STATUS DO PACIENTE."
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  margin: 5,
                }}
              >
                <div
                  class="radio-toolbar"
                  style={{
                    display: 'flex',
                    flexDirection: window.innerWidth > 800 ? 'row' : 'column',
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                >
                  <input
                    type="radio"
                    id="radio1"
                    name="status"
                    value="ESTÁVEL"
                    onClick={() => changeStatus(3)}
                  ></input>
                  <label for="radio1">ESTÁVEL</label>
                  <input
                    type="radio"
                    id="radio2"
                    name="status"
                    value="ALERTA"
                    onClick={() => changeStatus(2)}
                  ></input>
                  <label for="radio2">ALERTA</label>
                  <input
                    type="radio"
                    id="radio3"
                    name="status"
                    value="INSTÁVEL"
                    onClick={() => changeStatus(1)}
                  ></input>
                  <label for="radio3">INSTÁVEL</label>
                  <input
                    type="radio"
                    id="radio4"
                    name="status"
                    value="INSTÁVEL"
                    onClick={() => changeStatus(0)}
                  ></input>
                  <label for="radio4">CONFORTO</label>
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

  const showChangeStatus = () => {
    window.scrollTo(0, 0);
    setViewstatus(1);
  }

  var stat = 0;
  const changeStatus = (value) => {
    document.body.style.overflow = null;
    setstatus(value);
    stat = value;
    updateAtendimento();
    setViewstatus(0);
  }

  // card precaução.
  function CardPrecaucao() {
    return (
      <div
        className="pulsewidgetstatic"
        title="PRECAUÇÃO OU ISOLAMENTO DE CONTATO."
        onClick={tipousuario != 4 ? () => showChangePrecaucao(0) : null}
        style={{
          backgroundColor: precaucao === 1 ? "#8f9bbc" : precaucao === 2 ? "#f5b041" : precaucao === 3 ? "#bb8fce" : "#ec7063"
        }}
      >
        <text className="title5">
          {precaucao == 1 ? 'PRECAUÇÃO PADRÃO' : precaucao == 2 ? 'PRECAUÇÃO DE CONTATO' : precaucao == 3 ? 'PRECAUÇÃO PARA GOTÍCULAS' : 'PRECAUÇÃO PARA AEROSSOL'}
        </text>
      </div>
    )
  }

  // componente para alteração do tipo de precaução.
  const [viewprecaucao, setViewprecaucao] = useState(0);
  function ChangePrecaucao() {
    if (viewprecaucao === 1) {
      return (
        <div className="menucover" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer" style={{ padding: 20 }}>
            <label
              className="title2center"
              style={{ marginTop: 0, marginBottom: 15, width: 200 }}
            >
              ATUALIZAR TIPO DE PRECAUÇÃO/ISOLAMENTO
            </label>
            <div
              id="PRECAUÇÃO."
              style={{
                display: 'flex',
                flexDirection: window.innerWidth > 800 ? 'row' : 'column',
                justifyContent: 'center',
                margin: 5,
              }}
            >
              <div
                class="radio-toolbar"
                style={{
                  display: 'flex',
                  flexDirection: window.innerWidth > 800 ? 'row' : 'column',
                  marginTop: 0,
                  marginBottom: 0,
                }}
              >
                <input
                  type="radio"
                  id="radio1"
                  name="status"
                  value="PADRÃO"
                  onClick={() => changePrecaucao(1)}
                ></input>
                <label for="radio1">PADRÃO</label>
                <input
                  type="radio"
                  id="radio2"
                  name="status"
                  value="CONTATO"
                  onClick={() => changePrecaucao(2)}
                ></input>
                <label for="radio2">CONTATO</label>
                <input
                  type="radio"
                  id="radio3"
                  name="status"
                  value="GOTÍCULA"
                  onClick={() => changePrecaucao(3)}
                ></input>
                <label for="radio3">GOTÍCULA</label>
                <input
                  type="radio"
                  id="radio4"
                  name="status"
                  value="AEROSSOL"
                  onClick={() => changePrecaucao(4)}
                ></input>
                <label for="radio4">AEROSSOL</label>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  const showChangePrecaucao = () => {
    window.scrollTo(0, 0);
    setViewprecaucao(1);
  }

  var prec = 0;
  const changePrecaucao = (value) => {
    document.body.style.overflow = null;
    setprecaucao(value);
    prec = value;
    updateAtendimento();
    setViewprecaucao(0);
  }

  // card dias de internação.
  function CardDiasdeInternacao() {
    return (
      <div
        className="pulsewidgetstatic" style={{ backgroundColor: '#8f9bbc' }}
        id="DIAS DE INTERNAÇÃO"
      >
        <p
          className="title5"
          style={{
            marginBottom: 0,
            textAlign: 'center',
          }}
        >
          {'DIAS DE INTERNAÇÃO: ' + moment().diff(moment(admissao, 'DD/MM/YYYY'), 'days')}
        </p>
      </div>
    )
  }

  // função que atualiza o paciente.
  const updateAtendimento = () => {
    var obj = {
      idpaciente: idpaciente,
      hospital: nomehospital,
      unidade: nomeunidade,
      box: box,
      admissao: admissao,
      nome: nomepaciente,
      dn: dn,
      peso: peso,
      altura: altura,
      antecedentes: antecedentes,
      alergias: alergias,
      medicacoes: medicacoes,
      exames: exames,
      historia: historia,
      status: stat,
      ativo: ativo,
      classificacao: classificacao,
      descritor: descritor,
      precaucao: prec,
      assistente: assistente,
    };
    axios.post(html + '/updateatendimento/' + idatendimento, obj);
  };

  // encerrando consulta ambulatorial.
  const encerrarConsulta = () => {
    var obj = {
      idpaciente: idpaciente,
      hospital: nomehospital,
      unidade: nomeunidade,
      box: '',
      admissao: admissao,
      nome: nomepaciente,
      dn: dn,
      peso: peso,
      altura: altura,
      antecedentes: antecedentes,
      alergias: alergias,
      medicacoes: medicacoes,
      exames: exames,
      historia: historia,
      status: 0,
      ativo: 0,
      classificacao: classificacao,
      descritor: descritor,
      precaucao: 0,
      assistente: assistente,
    };
    axios.post(html + '/updateatendimento/' + idatendimento, obj).then(() => {
      history.push('/pacientes')
    });
  };

  // card invasões.
  function CardInvasoes() {
    return (
      <div id="cardinvasao"
        className="pulsewidgetbody"
        onMouseOver={() => {
          document.getElementById("cardinvasao").className = "pulsewidgetbodyhover"
        }}
        onMouseLeave={() => {
          document.getElementById("cardinvasao").className = "pulsewidgetbody"
          document.getElementById("cardinvasao").scrollTop = 0
          updateInvasoes()
        }}
      >
        <div className="pulsewidgettitle" style={{ alignItems: 'center' }}>
          <div className="title5">{'INVASÕES'}</div>
          <img
            alt=""
            src={body}
            style={{
              height: '60%',
              // width: 45,
              borderRadius: 5,
            }}
          ></img>
        </div>
        <div
          id="invasaocontent"
          className="pulsewidgetcontent"
        >
          <ShowInvasoes></ShowInvasoes>
        </div>
      </div>
    );
  }

  // card lesoes.
  function CardLesoes() {
    return (
      <div id="cardlesao"
        className="pulsewidgetbody"
        title="LESÕES DE PRESSÃO"
        onMouseOver={() => {
          document.getElementById("cardlesao").className = "pulsewidgetbodyhover"
        }}
        onMouseLeave={() => {
          document.getElementById("cardlesao").className = "pulsewidgetbody"
          document.getElementById("cardlesao").scrollTop = 0
        }}
      >
        <div className="pulsewidgettitle" style={{ alignItems: 'center' }}>
          <div className="title5">{'LESÕES'}</div>
          <img
            alt=""
            src={dorso}
            style={{
              height: '60%',
              // width: 45,
              borderRadius: 5,
            }}
          ></img>
        </div>
        <div
          id="invasaocontent"
          className="pulsewidgetcontent"
        >
          <ShowLesoes></ShowLesoes>
        </div>
      </div>
    );
  }

  // COMPONENTE ÚLTIMA EVOLUÇÃO E EXAME FÍSICO.
  function CardEvolucoes() {
    return (
      <div
        id="EVOLUÇÃO E EXAME FÍSICO"
        title="ÚLTIMA EVOLUÇÃO E CONTROLES."
        className="pulsewidgetscroll">
        <div className="title4 pulsewidgettitle">
          {'ÚLTIMA EVOLUÇÃO E CONTROLES'}
        </div>
        <div className="pulsewidgetcontent" style={{ justifyContent: 'flex-start' }}>
          <div className="title4" style={{ whiteSpace: 'pre-wrap' }}>
            {evolucao != '' ? 'EVOLUÇÃO (' + dataevolucao.toString().substring(0, 8) + ' - ' + dataevolucao.toString().substring(9, 14) + '):' : 'EVOLUÇÃO:'}
          </div>
          <div>
            {evolucao != '' ? evolucao : 'SEM EVOLUÇÕES REGISTRADAS.'}
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 5
          }}>
            <button
              id="BRADEN"
              className="blue-button"
              style={{
                display: lastbraden > 0 && window.innerWidth > 800 ? 'flex' : 'none',
                alignSelf: 'center',
                width: 250,
                height: 50,
                padding: 10,
                backgroundColor: '#8f9bbc',
              }}
            >
              {lastbraden > 14 ? 'BRADEN: ' + lastbraden + ' - RISCO BAIXO' : lastbraden > 12 && lastbraden < 15 ? 'BRADEN: ' + lastbraden + ' - RISCO MODERADO' : 'BRADEN: ' + lastbraden + ' - RISCO ELEVADO'}
            </button>
            <button
              id="MORSE"
              className="blue-button"
              style={{
                display: lastmorse > 0 && window.innerWidth > 800 ? 'flex' : 'none',
                alignSelf: 'center',
                width: 250,
                height: 50,
                padding: 10,
                backgroundColor: '#8f9bbc',
              }}
            >
              {lastmorse < 41 ? 'MORSE: ' + lastmorse + ' - RISCO MÉDIO' : lastmorse > 40 && lastmorse < 52 ? 'MORSE: ' + lastmorse + ' - RISCO ELEVADO' : lastmorse > 51 ? 'MORSE: ' + lastmorse + ' - RISCO MUITO ELEVADO' : 'MORSE ?'}
            </button>
          </div>
          <div className="title4" style={{ marginTop: 5 }}>{'CONTROLES:'}</div>
          <ViewGlasgow></ViewGlasgow>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: 2.5 }}>
            <ViewRass></ViewRass>
            <ViewRamsay></ViewRamsay>
          </div>
          <div style={{
            display: evolucao != '' ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center',
          }}>
            <div className={pam < 70 ? "title3" : "title2"}>{'PA: ' + pas + ' x ' + pad + ' (PAM ' + pam + ') mmHg'}</div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
              <div className={parseInt(fc) < 60 || parseInt(fc) > 120 ? "title3" : "title2"}>{'FC: ' + fc + ' bpm'}</div>
              <div className={parseInt(fr) > 26 ? 'title3' : 'title2'}>{'FR: ' + fr + ' irpm'}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
              <div className={parseInt(sao2) < 90 ? "title3" : "title2"} >{'SAO2: ' + sao2 + '%'}</div>
              <div className={parseFloat(tax) < 35.0 || parseFloat(tax) > 37.5 ? "title3" : "title2"} >{'TAX: ' + tax + '°C'}</div>
            </div>
            <div className={diurese12h < 500 ? "title3" : "title2"} >{'DIURESE: ' + diurese12h + 'ml/12h'}</div>
            <div className={ganhos12h > 2000 ? "title3" : "title2"} >{'GANHOS EM 12H: ' + ganhos12h + 'ml'}</div>
            <div className={perdas12h > 2000 ? "title3" : "title2"} >{'PERDAS EM 12H: ' + perdas12h + 'ml'}</div>
            <div className={(ganhos12h - perdas12h) > 2000 || (ganhos12h - perdas12h) < -2000 ? "title3" : "title2"} >
              {ganhos12h || perdas12h != '' ? 'BH EM 12H: ' + (ganhos12h - perdas12h) + 'ml' : 'BH 12H: NÃO INFORMADO.'}
            </div>
            <div className={(ganhosacumulados - perdasacumuladas) > 2000 || (ganhosacumulados - perdasacumuladas) < -2000 ? 'title3' : 'title2'} >
              {ganhosacumulados || perdasacumuladas != '' ? 'BH ACUMULADO: ' + (ganhosacumulados - perdasacumuladas) + 'ml' : 'BH ACUMULADO: NÃO INFORMADO'}
            </div>
          </div>
          <div style={{ display: evolucao == '' ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
            <text style={{ color: '#ffffff' }}>SEM REGISTRO DE DADOS CLÍNICOS.</text>
          </div>
        </div>
      </div>
    );
  }

  const [viewglasgow, setViewglasgow] = useState(0);
  function ViewGlasgow() {
    if (viewglasgow === 1) {
      return (
        <div className="title2">
          {window.innerWidth > 800 ? 'GLASGOW:\n ' + glasgow : 'ECG:\n' + glasgow}
        </div>
      );
    } else {
      return null;
    }
  }
  const [viewrass, setViewrass] = useState(0);
  function ViewRass() {
    if (viewrass === 1) {
      return <div className="title2">{'RASS:\n ' + rass}</div>
    } else {
      return null;
    }
  }
  const [viewramsay, setViewramsay] = useState(0);
  function ViewRamsay() {
    if (viewramsay === 1) {
      return <div className="title2">{'RAMSAY:\n ' + ramsay}</div>
    } else {
      return null;
    }
  }

  // MENU LATERAL.
  // selecionando o menu principal.
  const clickPrincipal = () => {
    setloadprincipal(1);
    setTimeout(() => {
      setloadprincipal(0);
    }, 3000);
    cleanFilters();
    setstateprontuario(1);
    // reposicionando a scroll da tela principal para o topo.
    setscrolllist(0);
    // atualizando informações da tela principal.
    updatePrincipal(idpaciente);
    // exibindo o painel de invasões.
    setshowlesoes(0);
    setshowinvasoes(1);
    // menu da versão mobile.
    setshowmenu(0);
    document.body.style.overflow = null;
  }
  const clickEvoluções = () => {
    cleanFilters();
    setstateprontuario(2);
    setshowlesoes(0);
    setshowinvasoes(1);
    // menu da versão mobile.
    window.scrollTo(0, 0);
    setshowmenu(0);
    document.body.style.overflow = null;
  }
  const clickDiagnosticos = () => {
    cleanFilters();
    setstateprontuario(3);
    setshowlesoes(0);
    setshowinvasoes(1);
    // menu da versão mobile.
    window.scrollTo(0, 0);
    setshowmenu(0);
    document.body.style.overflow = null;
  }
  const clickProblemas = () => {
    cleanFilters();
    setstateprontuario(12);
    setshowlesoes(0);
    setshowinvasoes(1);
    // menu da versão mobile.
    window.scrollTo(0, 0);
    setshowmenu(0);
    document.body.style.overflow = null;
  }
  const clickPropostas = () => {
    cleanFilters();
    setstateprontuario(4);
    setshowlesoes(0);
    setshowinvasoes(1);
    // menu da versão mobile.
    window.scrollTo(0, 0);
    setshowmenu(0);
    document.body.style.overflow = null;
  }
  const clickInterconsultas = () => {
    cleanFilters();
    setstateprontuario(5);
    setshowlesoes(0);
    setshowinvasoes(1);
  }
  const clickLaboratorio = () => {
    cleanFilters();
    setstateprontuario(6);
    setshowlesoes(0);
    setshowinvasoes(1);
    // menu da versão mobile.
    window.scrollTo(0, 0);
    setshowmenu(0);
    document.body.style.overflow = null;
  }
  const clickImagem = () => {
    cleanFilters();
    setstateprontuario(7);
    setshowlesoes(0);
    setshowinvasoes(1);
    // menu da versão mobile.
    window.scrollTo(0, 0);
    setshowmenu(0);
    document.body.style.overflow = null;
  }
  const clickBalanco = () => {
    cleanFilters();
    setstateprontuario(8);
    getSomaGanhos();
    getSomaPerdas();
    getDiurese12h();
    getBh12h();
    getBhAcumulado();
    loadBalancos();
    setshowlesoes(0);
    setshowinvasoes(1);
  }
  const [newprescricao, setnewprescricao] = useState(0);
  const clickPrescricoes = () => {
    // exibição das prescrições para os médicos.
    if (tipousuario != 4) {
      cleanFilters();
      setnewprescricao(0);
      setstateprontuario(9);
      // exibição da checagem de prescrições para os técnicos de enfermagem.
    } else {
      cleanFilters();
      setshowinvasoes(1);
      setstateprontuario(10);
    }
  }
  const clickFormularios = () => {
    cleanFilters();
    setstateprontuario(11);
    setshowlesoes(0);
    setshowinvasoes(1);
  }
  // limpando filtros...
  const cleanFilters = () => {
    setfilterevolucao('');
    setfilterdiagnostico('');
    setfilterproblema('');
    setfilterproposta('');
    setfilterinterconsulta('');
    setfilterlaboratorio('');
    setfilterimagem('');
  }

  // modulando as animações css para os menus (trabalhoso, mas faz toda a dierença).
  const setActive = (btn, btnAdd) => {
    var botoes = document.getElementById("MENU LATERAL").getElementsByClassName("red-button");
    for (var i = 0; i < botoes.length; i++) {
      botoes.item(i).className = "blue-button";
    }
    var addBotoes = document.getElementById("MENU LATERAL").getElementsByClassName("animated-red-button");
    for (var i = 0; i < addBotoes.length; i++) {
      addBotoes.item(i).className = "animated-blue-button";
    }
    document.getElementById(btn).className = "red-button"
    document.getElementById(btnAdd).className = "animated-red-button";
  }

  // usando useCallback para impedir rerenderizações desnecessárias e impedir a mudança de scroll.
  const Menu = useCallback(() => {
    return (
      <div className="menu"
      >
        <div style={{
          display: 'flex',
          flexDirection: 'row', justifyContent: 'center',
          margin: 20, marginBottom: 10
        }}>
          <img
            alt=""
            src={newlogo}
            style={{
              height: 0.13 * window.innerHeight,
              borderRadius: 50
            }}
          ></img>
          <div className="title2 logo"
            style={{
              opacity: 1, margin: 0, marginTop: 35, marginLeft: -10, color: 'white', fontSize: 18
            }}
          >
            gPulse
          </div>
        </div>
        <div
          className="scrollmenu"
          id="MENU LATERAL"
        >
          <div
            id="menuEvolucoes"
            className="menuitemanimation"
          >
            <button
              id="btnPrincipal"
              className="red-button"
              onClick={() => {
                clickPrincipal();
                var botoes = document.getElementById("MENU LATERAL").getElementsByClassName("red-button");
                for (var i = 0; i < botoes.length; i++) {
                  botoes.item(i).className = "blue-button";
                }
                document.getElementById("btnPrincipal").className = "red-button"
              }}
              style={{
                width: '100%',
                height: 50,
              }}
            >
              PRINCIPAL
            </button>
          </div>
          <div
            className="secondary"
            style={{ display: tipounidade == 4 ? 'flex' : 'none', flexDirection: 'row', marginTop: 0, marginBottom: 5, width: '100%', boxShadow: 'none' }}
          >
            <button
              className="orange-button"
              onClick={() => encerrarConsulta()}
              style={{
                width: '100%',
                height: 50,
              }}
            >
              ENCERRAR CONSULTA
            </button>
          </div>
          <div
            id="menuEvolucoes"
            className="menuitemanimation"
          >
            <button
              id="btnEvolucoes"
              className="blue-button"
              onClick={() => { clickEvoluções(); setActive("btnEvolucoes", "btnAddEvolucoes"); }}
              style={{
                width: '100%',
                height: 50,
              }}
            >
              EVOLUÇÕES
            </button>
            <button
              id="btnAddEvolucoes"
              className="animated-blue-button"
              title="ADICIONAR EVOLUÇÃO."
              onClick={() => viewEvolucao(1)}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 20,
                  width: 20,
                }}
              ></img>
            </button>
          </div>
          <div
            id="menuDiagnosticos"
            className="menuitemanimation"
          >
            <button
              id="btnDiagnosticos"
              className="blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              onClick={() => { clickDiagnosticos(); setActive("btnDiagnosticos", "btnAddDiagnosticos"); }}
              style={{
                width: '100%',
                height: 50,
                opacity: tipousuario == 1 || tipousuario == 2 ? 1 : 0.5,
              }}
            >
              DIAGNÓSTICOS
            </button>
            <button
              id="btnAddDiagnosticos"
              className="animated-blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              title="ADICIONAR DIAGNÓSTICO."
              onClick={() => viewDiagnostico(1)}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 20,
                  width: 20,
                }}
              ></img>
            </button>
          </div>
          <div
            id="menuProblemas"
            className="menuitemanimation"
          >
            <button
              id="btnProblemas"
              className="blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              onClick={() => { clickProblemas(); setActive("btnProblemas", "btnAddProblemas"); }}
              style={{
                width: '100%',
                height: 50,
                opacity: tipousuario == 1 || tipousuario == 2 ? 1 : 0.5,
              }}
            >
              PROBLEMAS
            </button>
            <button
              id="btnAddProblemas"
              className="animated-blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              title="ADICIONAR PROBLEMA."
              onClick={() => viewProblema(1)}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 20,
                  width: 20,
                }}
              ></img>
            </button>
          </div>
          <div
            id="menuProprostas"
            className="menuitemanimation"
          >
            <button
              id="btnPropostas"
              className="blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              onClick={() => { clickPropostas(); setActive("btnPropostas", "btnAddPropostas") }}
              style={{
                width: '100%',
                height: 50,
                opacity: tipousuario == 1 || tipousuario == 2 ? 1 : 0.5,
              }}
            >
              PROPOSTAS
            </button>
            <button
              id="btnAddPropostas"
              className="animated-blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              title="ADICIONAR PROPOSTA."
              onClick={() => viewProposta(1)}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 20,
                  width: 20,
                }}
              ></img>
            </button>
          </div>
          <div
            id="menuInterconsultas"
            className="menuitemanimation"
          >
            <button
              id="btnInterconsultas"
              className="blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              onClick={() => { clickInterconsultas(); setActive("btnInterconsultas", "btnAddInterconsultas") }}
              style={{
                width: '100%',
                height: 50,
                opacity: tipousuario == 1 || tipousuario == 2 ? 1 : 0.5,
              }}
            >
              INTERCONSULTAS
            </button>
            <button
              id="btnAddInterconsultas"
              className="animated-blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              title="SOLICITAR INTERCONSULTA."
              onClick={() => viewInterconsulta(1)}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 20,
                  width: 20,
                }}
              ></img>
            </button>
          </div>
          <div
            id="menuLaboratorio"
            className="menuitemanimation"
          >
            <button
              id="btnLaboratorio"
              className="blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              onClick={() => { clickLaboratorio(); setActive("btnLaboratorio", "btnAddLaboratorio") }}
              style={{
                width: '100%',
                height: 50,
                opacity: tipousuario == 1 || tipousuario == 2 ? 1 : 0.5,
              }}
            >
              LABORATÓRIO
            </button>
            <button
              id="btnAddLaboratorio"
              className="animated-blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              title="SOLICITAR EXAMES LABORATORIAIS."
              onClick={() => viewLaboratorio()}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 20,
                  width: 20,
                }}
              ></img>
            </button>
          </div>
          <div
            id="menuImagens"
            className="menuitemanimation"
          >
            <button
              id="btnImagens"
              className="blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              onClick={() => { clickImagem(); setActive("btnImagens", "btnAddImagens"); }}
              style={{
                width: '100%',
                height: 50,
                opacity: tipousuario == 1 || tipousuario == 2 ? 1 : 0.5,
              }}
            >
              IMAGEM
            </button>
            <button
              id="btnAddImagens"
              className="animated-blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              title="SOLICITAR EXAME DE IMAGEM."
              onClick={() => viewImagem()}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 20,
                  width: 20,
                }}
              ></img>
            </button>
          </div>
          <div
            id="menuBalanco"
            className="menuitemanimation"
            style={{
              display: tipousuario == 4 ? 'flex' : 'none',
            }}
          >
            <button
              id="btnBalanco"
              className="blue-button"
              onClick={() => { clickBalanco(); setActive("btnBalanco", "btnAddBalanco"); }}
              style={{
                width: '100%',
                height: 50,
              }}
            >
              BALANÇOS
            </button>
            <button
              id="btnAddBalanco"
              className="animated-blue-button"
              title="NOVO REGISTRO DE BALANÇO HÍDRICO."
              onClick={() => newBalanco()}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 20,
                  width: 20,
                }}
              ></img>
            </button>
          </div>
          <div
            id="menuPrescricao"
            className="menuitemanimation"
            style={{ display: tipousuario != 4 ? 'flex' : 'none' }}
          >
            <button
              id="btnPrescricoes"
              className="blue-button"
              onClick={() => { clickPrescricoes(); setActive("btnPrescricoes", "btnAddPrescricoes") }}
              style={{
                width: '100%',
                height: 50,
              }}
            >
              PRESCRIÇÃO
            </button>
            <button
              id="btnAddPrescricoes"
              className="animated-blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              title="ADICIONAR PRESCRIÇÃO."
              onClick={() => addPrescription()}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 20,
                  width: 20,
                }}
              ></img>
            </button>
          </div>
          <div
            id="menuCheckPrescricoes"
            className="menuitemanimation"
            style={{ display: tipousuario == 4 ? 'flex' : 'none' }}
          >
            <button
              id="btnCheckPrescricoes"
              className="blue-button"
              onClick={() => {
                clickPrescricoes();
                var botoes = document.getElementById("MENU LATERAL").getElementsByClassName("red-button");
                for (var i = 0; i < botoes.length; i++) {
                  botoes.item(i).className = "blue-button";
                }
                var addBotoes = document.getElementById("MENU LATERAL").getElementsByClassName("animated-red-button");
                for (var i = 0; i < addBotoes.length; i++) {
                  addBotoes.item(i).className = "animated-blue-button";
                }
                document.getElementById("btnCheckPrescricoes").className = "red-button"
              }}
              style={{
                width: '100%',
                height: 50,
              }}
            >
              PRESCRIÇÃO
            </button>
          </div>
          <div
            id="menuFormularios"
            className="menuitemanimation"
          >
            <button
              id="btnFormularios"
              className="blue-button"
              onClick={() => { clickFormularios(); setActive("btnFormularios", "btnAddFormularios"); }}
              style={{
                disabled: tipousuario == 4 ? true : false,
                opacity: tipousuario == 4 ? 0.3 : 1,
                width: '100%',
                height: 50,
              }}
            >
              FORMULÁRIOS
            </button>
            <button
              id="btnAddFormularios"
              className="animated-blue-button"
              title="CRIAR FORMULÁRIO."
              onClick={() => viewFormulario(1)}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 20,
                  width: 20,
                }}
              ></img>
            </button>
          </div>
        </div>
      </div >
    );
  }, []
  );

  // INVASÕES.
  // exibindo o fundo preto quando um menu de invasão é ativado.
  function ShowMenuCover() {
    if (
      vaMenu === 1 ||
      jidMenu === 1 ||
      jieMenu === 1 ||
      subcldMenu === 1 ||
      subcleMenu === 1 ||
      piardMenu === 1 ||
      piareMenu === 1 ||
      toraxMenu === 1 ||
      svdMenu === 1 ||
      abdMenu === 1 ||
      vfemdMenu === 1 ||
      vfemeMenu === 1 ||
      afemdMenu === 1 ||
      afemeMenu === 1 ||
      sncMenu === 1 ||
      piapeddMenu === 1 ||
      piapedeMenu === 1
    ) {
      return (
        <div className="menucover"
          style={{
            position: 'fixed',
            top: window.innerWidth > 800 ? 0 : document.querySelector('html').scrollTop = window.innerHeight,
            bottom: window.innerWidth > 800 ? 0 : 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          }}>
        </div>
      );
    } else {
      return null;
    }
  }
  // ocultando os menus seletores de invasões.
  const hideInvasionsMenus = () => {
    setSncMenu(0);
    setVaMenu(0);
    setJidMenu(0);
    setJieMenu(0);
    setSubcldMenu(0);
    setSubcleMenu(0);
    setPiardMenu(0);
    setPiareMenu(0);
    setToraxMenu(0);
    setAbdMenu(0);
    setVfemdMenu(0);
    setVfemeMenu(0);
    setAfemdMenu(0);
    setAfemeMenu(0);
    setSvdMenu(0);
    setPiapeddMenu(0);
    setPiapedeMenu(0);
    document.body.style.overflow = null;
  };

  // INVASÕES.
  // VIA AÉREA (VA).
  const [vaMenu, setVaMenu] = useState(0);
  function ShowVa() {
    // TQT
    if (va == 1) {
      return (
        <div
          className="orange-invasion va"
          title={'DATA DE INSERÇÃO: ' + datava}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickVa()}
        >
          TQT
        </div>
      );
      // TOT
    } else if (va == 2) {
      return (
        <div
          className="orange-invasion va"
          title={'DATA DE INSERÇÃO: ' + datava + '\nDIAS DE TOT: ' + moment().diff(moment(datava, 'DD/MM/YY'), 'days')}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickVa()}
        >
          TOT
        </div>
      );
      // MF
    } else if (va == 3) {
      return (
        <div
          className="orange-invasion va"
          title={'MÁSCARA FACIAL'}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickVa()}
        >
          MF
        </div>
      );
      // CN
    } else if (va == 4) {
      return (
        <div
          className="orange-invasion va"
          title={'CATETER NASAL'}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickVa()}
        >
          CN
        </div>
      );
    } else {
      return (
        <div
          className="orange-invasion va"
          title={'AR AMBIENTE'}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickVa()}
        >
          AA
        </div>
      );
    }
  }

  function ShowMenuVa() {
    if (vaMenu === 1) {
      return (
        <div
          className="menuposition">
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2center" style={{ width: 150, marginBottom: 10 }}>VIA AÉREA</div>
            <div
              id="datepicker"
              className="grey-button"
              style={{
                width: 150,
                height: 50,
                marginBottom: 10,
              }}
              onClick={() => showDatePicker(1, 1)}
            >
              {pickdate1}
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', width: window.innerWidth > 800 ? '' : 320,
              flexDirection: window.innerWidth > 800 ? 'column' : 'row',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setVaTqt()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                TQT
              </button>
              <button
                onClick={() => setVaTot()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                TOT
              </button>
              <button
                onClick={() => setVaMf()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                MF
              </button>
              <button
                onClick={() => setVaCn()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                CN
              </button>
              <button
                onClick={() => setVaNone()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                LIMPAR
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  const clickVa = () => {
    document.querySelector('html').scrollTop = window.innerHeight;
    hideInvasionsMenus();
    setVaMenu(1);
  };
  const setVaTqt = () => {
    setva(1);
    setdatava(pickdate1);
    if (datava === '') {
      setdatava(moment().format('DD/MM/YYYY'));
    }
    document.body.style.overflow = null;
    setVaMenu(0);
  };
  const setVaTot = () => {
    setva(2);
    setdatava(pickdate1);
    if (datava === '') {
      setdatava(moment().format('DD/MM/YYYY'));
    }
    document.body.style.overflow = null;
    setVaMenu(0);
  };
  const setVaMf = () => {
    setva(3);
    setdatava(pickdate1);
    if (datava === '') {
      setdatava(moment().format('DD/MM/YYYY'));
    }
    document.body.style.overflow = null;
    setVaMenu(0);
  };
  const setVaCn = () => {
    setva(4);
    setdatava(pickdate1);
    if (datava === '') {
      setdatava(moment().format('DD/MM/YYYY'));
    }
    document.body.style.overflow = null;
    setVaMenu(0);
  };
  const setVaNone = () => {
    setva(0);
    setdatava('');
    document.body.style.overflow = null;
    setVaMenu(0);
  };

  // JUGULAR INTERNA DIREITA (JID).
  const [jidMenu, setJidMenu] = useState(0);
  function ShowJid() {
    if (jid == 1) {
      return (
        <div
          id="clickjid"
          className="blue-invasion jid"
          title={'DATA DE INSERÇÃO: ' + datajid}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => {
            clickJid()
          }}
        >
          CVC
        </div>
      );
    } else if (jid == 2) {
      return (
        <div
          className="blue-invasion jid"
          title={'DATA DE INSERÇÃO: ' + datajid}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickJid()}
        >
          CDL
        </div>
      );
    } else {
      return (
        <div
          className="blue-invasion jid"
          title={'JUGULAR INTERNA DIREITA'}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickJid()}
        ></div>
      );
    }
  }
  function ShowMenuJid() {
    if (jidMenu === 1) {
      return (
        <div
          className="menuposition">
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2center" style={{ width: 150, marginBottom: 10 }}>JUGULAR INTERNA DIREITA</div>
            <button
              id="datepicker"
              className="grey-button"
              style={{
                width: 150,
                height: 50,
                marginBottom: 10,
              }}
              onClick={() => showDatePicker(1, 1)}
            >
              {pickdate1}
            </button>
            <div style={{
              display: 'flex', flexWrap: 'wrap', width: window.innerWidth > 800 ? '' : 320,
              flexDirection: window.innerWidth > 800 ? 'column' : 'row',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setCvcJid()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                CVC
              </button>
              <button
                onClick={() => setCdlJid()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                CDL
              </button>
              <button
                onClick={() => setNoneJid()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                LIMPAR
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  const clickJid = () => {
    document.querySelector('html').scrollTop = window.innerHeight;
    hideInvasionsMenus();
    // atualizando o datepcker com a data de implante do dispositivo.
    if (datajid == '') {
      setpickdate1(moment().format('DD/MM/YY'))
    } else {
      setpickdate1(datajid);
    }
    setJidMenu(1);
  };
  const setCvcJid = () => {
    setjid(1);
    setdatajid(pickdate1);
    if (datajid === '') {
      setdatajid(moment().format('DD/MM/YYYY'));
    }
    setJidMenu(0);
  };
  const setCdlJid = () => {
    setjid(2);
    setdatajid(pickdate1);
    if (datajid === '') {
      setdatajid(moment().format('DD/MM/YYYY'));
    }
    setJidMenu(0);
  };
  const setNoneJid = () => {
    setjid(0);
    setdatajid('');
    setJidMenu(0);
  };

  // JUGULAR INTERNA ESQUERDA (JIE).
  const [jieMenu, setJieMenu] = useState(0);
  function ShowJie() {
    if (jie == 1) {
      return (
        <div
          className="blue-invasion jie"
          title={'DATA DE INSERÇÃO: ' + datajie}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickJie()}
        >
          CVC
        </div>
      );
    } else if (jie == 2) {
      return (
        <div
          className="blue-invasion jie"
          title={'DATA DE INSERÇÃO: ' + datajie}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickJie()}
        >
          CDL
        </div>
      );
    } else {
      return (
        <div
          className="blue-invasion jie"
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          title={'JUGULAR INTERNA ESQUERDA'}
          onClick={() => clickJie()}
        ></div>
      );
    }
  }
  function ShowMenuJie() {
    if (jieMenu === 1) {
      return (
        <div
          className="menuposition">
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2center" style={{ width: 150, marginBottom: 10 }}>JUGULAR INTERNA ESQUERDA</div>
            <div
              id="datepicker"
              className="grey-button"
              style={{
                width: 150,
                height: 50,
                marginBottom: 10,
              }}
              onClick={() => showDatePicker(1, 1)}
            >
              {pickdate1}
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', width: window.innerWidth > 800 ? '' : 320,
              flexDirection: window.innerWidth > 800 ? 'column' : 'row',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setCvcJie()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                CVC
              </button>
              <button
                onClick={() => setCdlJie()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                CDL
              </button>
              <button
                onClick={() => setNoneJie()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                LIMPAR
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  const clickJie = () => {
    document.querySelector('html').scrollTop = window.innerHeight;
    hideInvasionsMenus();
    // atualizando o datepcker com a data de implante do dispositivo.
    if (datajie == '') {
      setpickdate1(moment().format('DD/MM/YY'))
    } else {
      setpickdate1(datajie);
    }
    setJieMenu(1);
  };
  const setCvcJie = () => {
    setjie(1);
    setdatajie(pickdate1);
    if (datajie === '') {
      setdatajie(moment().format('DD/MM/YYYY'));
    }
    setJieMenu(0);
  };
  const setCdlJie = () => {
    setjie(2);
    setdatajie(pickdate1);
    if (datajie === '') {
      setdatajie(moment().format('DD/MM/YYYY'));
    }
    setJieMenu(0);
  };
  const setNoneJie = () => {
    setjie(0);
    setdatajie('');
    setJieMenu(0);
  };

  // SUBCLÁVIA DIREITA (SUBCLD).
  const [subcldMenu, setSubcldMenu] = useState(0);
  function ShowSubcld() {
    if (subcld == 1) {
      return (
        <div
          className="blue-invasion subcld"
          title={'DATA DE INSERÇÃO: ' + datasubcld}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickSubcld()}
        >
          CVC
        </div>
      );
    } else if (subcld == 2) {
      return (
        <div
          className="blue-invasion subcld"
          title={'DATA DE INSERÇÃO: ' + datasubcld}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickSubcld()}
        >
          CDL
        </div>
      );
    } else {
      return (
        <div
          className="blue-invasion subcld"
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          title={'SUBCLÁVIA DIREITA'}
          onClick={() => clickSubcld()}
        ></div>
      );
    }
  }
  function ShowMenuSubcld() {
    if (subcldMenu === 1) {
      return (
        <div
          className="menuposition">
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2center" style={{ width: 150, marginBottom: 10 }}>SUBCLÁVIA DIREITA</div>
            <div
              id="datepicker"
              className="grey-button"
              style={{
                width: 150,
                height: 50,
                marginBottom: 10,
              }}
              onClick={() => showDatePicker(1, 1)}
            >
              {pickdate1}
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', width: window.innerWidth > 800 ? '' : 320,
              flexDirection: window.innerWidth > 800 ? 'column' : 'row',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setCvcSubcld()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                CVC
              </button>
              <button
                onClick={() => setCdlSubcld()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                CDL
              </button>
              <button
                onClick={() => setNoneSubcld()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                LIMPAR
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  const clickSubcld = () => {
    document.querySelector('html').scrollTop = window.innerHeight;
    hideInvasionsMenus();
    // atualizando o datepcker com a data de implante do dispositivo.
    if (datasubcld == '') {
      setpickdate1(moment().format('DD/MM/YY'))
    } else {
      setpickdate1(datasubcld);
    }
    setSubcldMenu(1);
  };
  const setCvcSubcld = () => {
    setsubcld(1);
    setdatasubcld(pickdate1);
    if (datasubcld === '') {
      setdatasubcld(moment().format('DD/MM/YYYY'));
    }
    setSubcldMenu(0);
  };
  const setCdlSubcld = () => {
    setsubcld(2);
    setdatasubcld(pickdate1);
    if (datasubcld === '') {
      setdatasubcld(moment().format('DD/MM/YYYY'));
    }
    setSubcldMenu(0);
  };
  const setNoneSubcld = () => {
    setsubcld(0);
    setdatasubcld('');
    setSubcldMenu(0);
  };

  // SUBCLÁVIA ESQUERDA (SUBCLE).
  const [subcleMenu, setSubcleMenu] = useState(0);
  function ShowSubcle() {
    if (subcle == 1) {
      return (
        <div
          className="blue-invasion subcle"
          title={'DATA DE INSERÇÃO: ' + datasubcle}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickSubcle()}
        >
          CVC
        </div>
      );
    } else if (subcle == 2) {
      return (
        <div
          className="blue-invasion subcle"
          title={'DATA DE INSERÇÃO: ' + datasubcle}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickSubcle()}
        >
          CDL
        </div>
      );
    } else {
      return (
        <div
          className="blue-invasion subcle"
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          title={'SUBCLÁVIA ESQUERDA'}
          onClick={() => clickSubcle()}
        ></div>
      );
    }
  }
  function ShowMenuSubcle() {
    if (subcleMenu === 1) {
      return (
        <div
          className="menuposition">
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2center" style={{ width: 150, marginBottom: 10 }}>SUBCLÁVIA ESQUERDA</div>
            <div
              id="datepicker"
              className="grey-button"
              style={{
                width: 150,
                height: 50,
                marginBottom: 10,
              }}
              onClick={() => showDatePicker(1, 1)}
            >
              {pickdate1}
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', width: window.innerWidth > 800 ? '' : 320,
              flexDirection: window.innerWidth > 800 ? 'column' : 'row',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setCvcSubcle()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                CVC
              </button>
              <button
                onClick={() => setCdlSubcle()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                CDL
              </button>
              <button
                onClick={() => setNoneSubcle()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                LIMPAR
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  const clickSubcle = () => {
    document.querySelector('html').scrollTop = window.innerHeight;
    hideInvasionsMenus();
    // atualizando o datepcker com a data de implante do dispositivo.
    if (datasubcle == '') {
      setpickdate1(moment().format('DD/MM/YY'))
    } else {
      setpickdate1(datasubcle);
    }
    setSubcleMenu(1);
  };
  const setCvcSubcle = () => {
    setsubcle(1);
    setdatasubcle(pickdate1);
    if (datasubcle === '') {
      setdatasubcle(moment().format('DD/MM/YYYY'));
    }
    setSubcleMenu(0);
  };
  const setCdlSubcle = () => {
    setsubcle(2);
    setdatasubcle(pickdate1);
    if (datasubcle === '') {
      setdatasubcle(moment().format('DD/MM/YYYY'));
    }
    setSubcleMenu(0);
  };
  const setNoneSubcle = () => {
    setsubcle(0);
    setdatasubcle('');
    setSubcleMenu(0);
  };

  // RADIAL DIREITA (PIARD).
  const [piardMenu, setPiardMenu] = useState(0);
  function ShowPiard() {
    if (piard == 1) {
      return (
        <div
          className="red-invasion piaard"
          title={'DATA DE INSERÇÃO: ' + datapiard}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickPiard()}
        >
          PIA
        </div>
      );
    } else {
      return (
        <div
          className="red-invasion piaard"
          title={'ARTÉRIA RADIAL DIREITA'}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickPiard()}
        ></div>
      );
    }
  }
  function ShowMenuPiard() {
    if (piardMenu === 1) {
      return (
        <div
          className="menuposition">
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2center" style={{ width: 150, marginBottom: 10 }}>RADIAL DIREITA</div>
            <div
              id="datepicker"
              className="grey-button"
              style={{
                width: 150,
                height: 50,
                marginBottom: 10,
              }}
              onClick={() => showDatePicker(1, 1)}
            >
              {pickdate1}
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', width: window.innerWidth > 800 ? '' : 320,
              flexDirection: window.innerWidth > 800 ? 'column' : 'row',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setPiard()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                PIA
              </button>
              <button
                onClick={() => setNonePiard()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                LIMPAR
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  const clickPiard = () => {
    document.querySelector('html').scrollTop = window.innerHeight;
    hideInvasionsMenus();
    // atualizando o datepcker com a data de implante do dispositivo.
    if (datapiard == '') {
      setpickdate1(moment().format('DD/MM/YY'))
    } else {
      setpickdate1(datapiard);
    }
    setPiardMenu(1);
  };
  const setPiard = () => {
    setpiard(1);
    setdatapiard(pickdate1);
    if (datapiard === '') {
      setdatapiard(moment().format('DD/MM/YYYY'));
      setPiardMenu(0);
    }
    setPiardMenu(0);
  };
  const setNonePiard = () => {
    setpiard(0);
    setdatapiard('');
    setPiardMenu(0);
  };

  // RADIAL ESQUERDA (PIARE).
  const [piareMenu, setPiareMenu] = useState(0);
  function ShowPiare() {
    if (piare == 1) {
      return (
        <div
          className="red-invasion piaare"
          title={'DATA DE INSERÇÃO: ' + datapiare}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickPiare()}
        >
          PIA
        </div>
      );
    } else {
      return (
        <div
          className="red-invasion piaare"
          title={'ARTÉRIA RADIAL ESQUERDA'}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickPiare()}
        ></div>
      );
    }
  }
  function ShowMenuPiare() {
    if (piareMenu === 1) {
      return (
        <div
          className="menuposition">
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2center" style={{ width: 150, marginBottom: 10 }}>RADIAL ESQUERDA</div>
            <div
              id="datepicker"
              className="grey-button"
              style={{
                width: 150,
                height: 50,
                marginBottom: 10,
              }}
              onClick={() => showDatePicker(1, 1)}
            >
              {pickdate1}
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', width: window.innerWidth > 800 ? '' : 320,
              flexDirection: window.innerWidth > 800 ? 'column' : 'row',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setPiare()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                PIA
              </button>
              <button
                onClick={() => setNonePiare()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                LIMPAR
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  const clickPiare = () => {
    document.querySelector('html').scrollTop = window.innerHeight;
    hideInvasionsMenus();
    // atualizando o datepcker com a data de implante do dispositivo.
    if (datapiare == '') {
      setpickdate1(moment().format('DD/MM/YY'))
    } else {
      setpickdate1(datapiare);
    }
    setPiareMenu(1);
  };
  const setPiare = () => {
    setpiare(1);
    setdatapiare(pickdate1);
    if (datapiare === '') {
      setdatapiare(moment().format('DD/MM/YYYY'));
    }
    setPiareMenu(0);
  };
  const setNonePiare = () => {
    setpiare(0);
    setdatapiare('');
    setPiareMenu(0);
  };

  // PEDIOSA DIREITA (PIAPEDD).
  const [piapeddMenu, setPiapeddMenu] = useState(0);
  function ShowPiapedd() {
    if (piapedd == 1) {
      return (
        <div
          className="red-invasion piapedd"
          title={'DATA DE INSERÇÃO: ' + datapiapedd}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickPiapedd()}
        >
          PIA
        </div>
      );
    } else {
      return (
        <div
          className="red-invasion piapedd"
          title={'ARTÉRIA PEDIOSA DIREITA'}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickPiapedd()}
        ></div>
      );
    }
  }
  function ShowMenuPiapedd() {
    if (piapeddMenu === 1) {
      return (
        <div
          className="menuposition">
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2center" style={{ width: 150, marginBottom: 10 }}>PEDIOSA DIREITA</div>
            <div
              id="datepicker"
              className="grey-button"
              style={{
                width: 150,
                height: 50,
                marginBottom: 10,
              }}
              onClick={() => showDatePicker(1, 1)}
            >
              {pickdate1}
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', width: window.innerWidth > 800 ? '' : 320,
              flexDirection: window.innerWidth > 800 ? 'column' : 'row',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setPiapedd()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                PIA
              </button>
              <button
                onClick={() => setNonePiapedd()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                LIMPAR
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  const clickPiapedd = () => {
    document.querySelector('html').scrollTop = window.innerHeight;
    hideInvasionsMenus();
    // atualizando o datepcker com a data de implante do dispositivo.
    if (datapiapedd == '') {
      setpickdate1(moment().format('DD/MM/YY'))
    } else {
      setpickdate1(datapiapedd);
    }
    setPiapeddMenu(1);
  };
  const setPiapedd = () => {
    setpiapedd(1);
    setdatapiapedd(pickdate1);
    if (datapiapedd === '') {
      setdatapiapedd(moment().format('DD/MM/YYYY'));
      setPiapeddMenu(0);
    }
    setPiapeddMenu(0);
  };
  const setNonePiapedd = () => {
    setpiapedd(0);
    setdatapiapedd('');
    setPiapeddMenu(0);
  };

  // PEDIOSA ESQUERDA (PIAPEDE).
  const [piapedeMenu, setPiapedeMenu] = useState(0);
  function ShowPiapede() {
    if (piapede == 1) {
      return (
        <div
          className="red-invasion piapede"
          title={'DATA DE INSERÇÃO: ' + datapiapede}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickPiapede()}
        >
          PIA
        </div>
      );
    } else {
      return (
        <div
          className="red-invasion piapede"
          title={'ARTÉRIA PEDIOSA ESQUERDA'}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickPiapede()}
        ></div>
      );
    }
  }
  function ShowMenuPiapede() {
    if (piapedeMenu === 1) {
      return (
        <div
          className="menuposition">
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2center" style={{ width: 150, marginBottom: 10 }}>PEDIOSA ESQUERDA</div>
            <div
              id="datepicker"
              className="grey-button"
              style={{
                width: 150,
                height: 50,
                marginBottom: 10,
              }}
              onClick={() => showDatePicker(1, 1)}
            >
              {pickdate1}
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', width: window.innerWidth > 800 ? '' : 320,
              flexDirection: window.innerWidth > 800 ? 'column' : 'row',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setPiapede()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                PIA
              </button>
              <button
                onClick={() => setNonePiapede()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                LIMPAR
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  const clickPiapede = () => {
    document.querySelector('html').scrollTop = window.innerHeight;
    hideInvasionsMenus();
    // atualizando o datepcker com a data de implante do dispositivo.
    if (datapiapede == '') {
      setpickdate1(moment().format('DD/MM/YY'))
    } else {
      setpickdate1(datapiapede);
    }
    setPiapedeMenu(1);
  };
  const setPiapede = () => {
    setpiapede(1);
    setdatapiapede(pickdate1);
    if (datapiapede === '') {
      setdatapiapede(moment().format('DD/MM/YYYY'));
      setPiapedeMenu(0);
    }
    setPiapedeMenu(0);
  };
  const setNonePiapede = () => {
    setpiapede(0);
    setdatapiapede('');
    setPiapedeMenu(0);
  };

  // DRENO DE TORAX.
  const [toraxMenu, setToraxMenu] = useState(0);
  function ShowTorax() {
    // dreno torácico direito.
    if (torax == 1) {
      return (
        <div
          className="green-invasion toraxd"
          title={'DATA DE INSERÇÃO: ' + datatorax}
          style={{
            height: window.innerWidth > 800 ? 0.03 * window.innerWidth : window.innerWidth > 600 ? 0.09 * window.innerWidth : 0.12 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.03 * window.innerWidth : window.innerWidth > 600 ? 0.09 * window.innerWidth : 0.12 * window.innerWidth,
          }}
          onClick={() => clickTorax()}
        >
          DRENO TX
        </div>
      );
      // dreno torácico esquerdo.
    } else if (torax == 2) {
      return (
        <div
          className="green-invasion toraxe"
          title={'DATA DE INSERÇÃO: ' + datatorax}
          style={{
            height: window.innerWidth > 800 ? 0.03 * window.innerWidth : window.innerWidth > 600 ? 0.09 * window.innerWidth : 0.12 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.03 * window.innerWidth : window.innerWidth > 600 ? 0.09 * window.innerWidth : 0.12 * window.innerWidth,
          }}
          onClick={() => clickTorax()}
        >
          DRENO TX
        </div>
      );
      // dreno de mediastino.
    } else if (torax == 3) {
      return (
        <div
          className="green-invasion toraxm"
          title={'DATA DE INSERÇÃO: ' + datatorax}
          style={{
            height: window.innerWidth > 800 ? 0.03 * window.innerWidth : window.innerWidth > 600 ? 0.09 * window.innerWidth : 0.12 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.03 * window.innerWidth : window.innerWidth > 600 ? 0.09 * window.innerWidth : 0.12 * window.innerWidth,
          }}
          onClick={() => clickTorax()}
        >
          DRENO MED
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion toraxm"
          style={{
            height: window.innerWidth > 800 ? 0.03 * window.innerWidth : window.innerWidth > 600 ? 0.09 * window.innerWidth : 0.12 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.03 * window.innerWidth : window.innerWidth > 600 ? 0.09 * window.innerWidth : 0.12 * window.innerWidth,
            opacity: 0.5,
          }}
          title={'DRENO TORÁCICO'}
          onClick={() => clickTorax()}
        ></div>
      );
    }
  }

  function ShowMenuTorax() {
    if (toraxMenu === 1) {
      return (
        <div
          className="menuposition">
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2center" style={{ width: 150, marginBottom: 10 }}>DRENO TORÁCICO</div>
            <div
              id="datepicker"
              className="grey-button"
              style={{
                width: 150,
                height: 50,
                marginBottom: 10,
              }}
              onClick={() => showDatePicker(1, 1)}
            >
              {pickdate1}
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', width: window.innerWidth > 800 ? '' : 320,
              flexDirection: window.innerWidth > 800 ? 'column' : 'row',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setToraxD()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                DRENO TÓRAX D
              </button>
              <button
                onClick={() => setToraxE()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                DRENO TÓRAX E
              </button>
              <button
                onClick={() => setToraxM()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                DRENO TÓRAX M
              </button>
              <button
                onClick={() => setToraxNone()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                LIMPAR
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  const clickTorax = () => {
    document.querySelector('html').scrollTop = window.innerHeight;
    hideInvasionsMenus();
    // atualizando o datepcker com a data de implante do dispositivo.
    if (datatorax == '') {
      setpickdate1(moment().format('DD/MM/YY'))
    } else {
      setpickdate1(datatorax);
    }
    setToraxMenu(1);
  };
  const setToraxD = () => {
    settorax(1);
    setdatatorax(pickdate1);
    if (datatorax === '') {
      setdatatorax(moment().format('DD/MM/YYYY'));
    }
    setToraxMenu(0);
  };
  const setToraxE = () => {
    settorax(2);
    setdatatorax(pickdate1);
    if (datatorax === '') {
      setdatatorax(moment().format('DD/MM/YYYY'));
    }
    setToraxMenu(0);
  };
  const setToraxM = () => {
    settorax(3);
    setdatatorax(pickdate1);
    if (datatorax === '') {
      setdatatorax(moment().format('DD/MM/YYYY'));
    }
    setToraxMenu(0);
  };
  const setToraxNone = () => {
    settorax(0);
    setdatatorax('');
    setToraxMenu(0);
  };

  // SONDA VESICAL DE DEMORA (SVD).
  const [svdMenu, setSvdMenu] = useState(0);
  function ShowSvd() {
    if (svd == 1) {
      return (
        <div
          className="yellow-invasion svd"
          title={'DATA DE INSERÇÃO: ' + datasvd}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickSvd()}
        >
          SVD
        </div>
      );
    } else {
      return (
        <div
          className="yellow-invasion svd"
          title={'SONDA VESICAL DE DEMORA'}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickSvd()}
        ></div>
      );
    }
  }
  function ShowMenuSvd() {
    if (svdMenu === 1) {
      return (
        <div
          className="menuposition">
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2center" style={{ width: 150, marginBottom: 10 }}>SONDA VESICAL</div>
            <div
              id="datepicker"
              className="grey-button"
              style={{
                width: 150,
                height: 50,
                marginBottom: 10,
              }}
              onClick={() => showDatePicker(1, 1)}
            >
              {pickdate1}
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', width: window.innerWidth > 800 ? '' : 320,
              flexDirection: window.innerWidth > 800 ? 'column' : 'row',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setSvd()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                SVD
              </button>
              <button
                onClick={() => setNoneSvd()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                LIMPAR
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  const clickSvd = () => {
    document.querySelector('html').scrollTop = window.innerHeight;
    hideInvasionsMenus();
    // atualizando o datepcker com a data de implante do dispositivo.
    if (datasvd == '') {
      setpickdate1(moment().format('DD/MM/YY'))
    } else {
      setpickdate1(datasvd);
    }
    setSvdMenu(1);
  };
  const setSvd = () => {
    setsvd(1);
    setdatasvd(pickdate1);
    if (datasvd === '') {
      setdatasvd(moment().format('DD/MM/YYYY'));
    }
    setSvdMenu(0);
  };
  const setNoneSvd = () => {
    setsvd(0);
    setdatasvd('');
    setSvdMenu(0);
  };

  // DRENO ABDOMINAL.
  const [abdMenu, setAbdMenu] = useState(0);
  function ShowAbd() {
    if (abd == 1) {
      return (
        <div
          className="green-invasion abd"
          title={'DATA DE INSERÇÃO: ' + dataabd}
          style={{
            height: window.innerWidth > 800 ? 0.03 * window.innerWidth : window.innerWidth > 600 ? 0.09 * window.innerWidth : 0.12 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.03 * window.innerWidth : window.innerWidth > 600 ? 0.09 * window.innerWidth : 0.12 * window.innerWidth,
          }}
          onClick={() => clickAbd()}
        >
          DRENO ABD
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion abd"
          style={{
            height: window.innerWidth > 800 ? 0.03 * window.innerWidth : window.innerWidth > 600 ? 0.09 * window.innerWidth : 0.12 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.03 * window.innerWidth : window.innerWidth > 600 ? 0.09 * window.innerWidth : 0.12 * window.innerWidth,
            opacity: 0.5,
          }}
          title={'DRENO ABDOMINAL'}
          onClick={() => clickAbd()}
        ></div>
      );
    }
  }
  function ShowMenuAbd() {
    if (abdMenu === 1) {
      return (
        <div
          className="menuposition">
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2center" style={{ width: 150, marginBottom: 10 }}>DRENO ABDOMINAL</div>
            <div
              id="datepicker"
              className="grey-button"
              style={{
                width: 150,
                height: 50,
                marginBottom: 10,
              }}
              onClick={() => showDatePicker(1, 1)}
            >
              {pickdate1}
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', width: window.innerWidth > 800 ? '' : 320,
              flexDirection: window.innerWidth > 800 ? 'column' : 'row',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setAbd()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                DRENO ABDOME
              </button>
              <button
                onClick={() => setNoneAbd()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                LIMPAR
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  const clickAbd = () => {
    document.querySelector('html').scrollTop = window.innerHeight;
    hideInvasionsMenus();
    // atualizando o datepcker com a data de implante do dispositivo.
    if (dataabd == '') {
      setpickdate1(moment().format('DD/MM/YY'))
    } else {
      setpickdate1(dataabd);
    }
    setAbdMenu(1);
  };
  const setAbd = () => {
    setabd(1);
    setdataabd(pickdate1);
    if (dataabd === '') {
      setdataabd(moment().format('DD/MM/YYYY'));
    }
    setAbdMenu(0);
  };
  const setNoneAbd = () => {
    setabd(0);
    setdataabd('');
    setAbdMenu(0);
  };

  // VEIA FEMORAL DIREITA (VFD).
  const [vfemdMenu, setVfemdMenu] = useState(0);
  function ShowVfemd() {
    if (vfemd == 1) {
      return (
        <div
          className="blue-invasion vfemd"
          title={'DATA DE INSERÇÃO: ' + datavfemd}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickVfemd()}
        >
          CVC
        </div>
      );
    } else if (vfemd == 2) {
      return (
        <div
          className="blue-invasion vfemd"
          title={'DATA DE INSERÇÃO: ' + datavfemd}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickVfemd()}
        >
          CDL
        </div>
      );
    } else {
      return (
        <div
          className="blue-invasion vfemd"
          title={'VEIA FEMORAL DIREITA'}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickVfemd()}
        ></div>
      );
    }
  }
  function ShowMenuVfemd() {
    if (vfemdMenu === 1) {
      return (
        <div
          className="menuposition">
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2center" style={{ width: 150, marginBottom: 10 }}>VEIA FEMORAL DIREITA</div>
            <div
              id="datepicker"
              className="grey-button"
              style={{
                width: 150,
                height: 50,
                marginBottom: 10,
              }}
              onClick={() => showDatePicker(1, 1)}
            >
              {pickdate1}
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', width: window.innerWidth > 800 ? '' : 320,
              flexDirection: window.innerWidth > 800 ? 'column' : 'row',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setCvcVfemd()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                CVC
              </button>
              <button
                onClick={() => setCdlVfemd()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                CDL
              </button>
              <button
                onClick={() => setNoneVfemd()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                LIMPAR
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  const clickVfemd = () => {
    document.querySelector('html').scrollTop = window.innerHeight;
    hideInvasionsMenus();
    // atualizando o datepcker com a data de implante do dispositivo.
    if (datavfemd == '') {
      setpickdate1(moment().format('DD/MM/YY'))
    } else {
      setpickdate1(datavfemd);
    }
    setVfemdMenu(1);
  };
  const setCvcVfemd = () => {
    setvfemd(1);
    setdatavfemd(pickdate1);
    if (datavfemd === '') {
      setdatavfemd(moment().format('DD/MM/YYYY'));
    }
    setVfemdMenu(0);
  };
  const setCdlVfemd = () => {
    setvfemd(2);
    setdatavfemd(pickdate1);
    if (datavfemd === '') {
      setdatavfemd(moment().format('DD/MM/YYYY'));
    }
    setVfemdMenu(0);
  };
  const setNoneVfemd = () => {
    setvfemd(0);
    setdatavfemd('');
    setVfemdMenu(0);
  };

  // VEIA FEMORAL ESQUERDA (VFE).
  const [vfemeMenu, setVfemeMenu] = useState(0);
  function ShowVfeme() {
    if (vfeme == 1) {
      return (
        <div
          className="blue-invasion vfeme"
          title={'DATA DE INSERÇÃO: ' + datavfeme}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickVfeme()}
        >
          CVC
        </div>
      );
    } else if (vfeme == 2) {
      return (
        <div
          className="blue-invasion vfeme"
          title={'DATA DE INSERÇÃO: ' + datavfeme}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickVfeme()}
        >
          CDL
        </div>
      );
    } else {
      return (
        <div
          className="blue-invasion vfeme"
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          title={'VEIA FEMORAL ESQUERDA'}
          onClick={() => clickVfeme()}
        ></div>
      );
    }
  }
  function ShowMenuVfeme() {
    if (vfemeMenu === 1) {
      return (
        <div
          className="menuposition">
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2center" style={{ width: 150, marginBottom: 10 }}>VEIA FEMORAL ESQUERDA</div>
            <div
              id="datepicker"
              className="grey-button"
              style={{
                width: 150,
                height: 50,
                marginBottom: 10,
              }}
              onClick={() => showDatePicker(1, 1)}
            >
              {pickdate1}
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', width: window.innerWidth > 800 ? '' : 320,
              flexDirection: window.innerWidth > 800 ? 'column' : 'row',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setCvcVfeme()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                CVC
              </button>
              <button
                onClick={() => setCdlVfeme()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                CDL
              </button>
              <button
                onClick={() => setNoneVfeme()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                LIMPAR
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  const clickVfeme = () => {
    document.querySelector('html').scrollTop = window.innerHeight;
    hideInvasionsMenus();
    // atualizando o datepcker com a data de implante do dispositivo.
    if (datavfeme == '') {
      setpickdate1(moment().format('DD/MM/YY'))
    } else {
      setpickdate1(datavfeme);
    }
    setVfemeMenu(1);
  };
  const setCvcVfeme = () => {
    setvfeme(1);
    setdatavfeme(pickdate1);
    if (datavfeme === '') {
      setdatavfeme(moment().format('DD/MM/YYYY'));
    }
    setVfemeMenu(0);
  };
  const setCdlVfeme = () => {
    setvfeme(2);
    setdatavfeme(pickdate1);
    if (datavfeme === '') {
      setdatavfeme(moment().format('DD/MM/YYYY'));
    }
    setVfemeMenu(0);
  };
  const setNoneVfeme = () => {
    setvfeme(0);
    setdatavfeme('');
    setVfemeMenu(0);
  };

  // ARTÉRIA FEMORAL DIREITA (AFEMD).
  const [afemdMenu, setAfemdMenu] = useState(0);
  function ShowAfemd() {
    if (afemd == 1) {
      return (
        <div
          className="red-invasion afemd"
          title={'DATA DE INSERÇÃO: ' + dataafemd}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickAfemd()}
        >
          PIA
        </div>
      );
    } else {
      return (
        <div
          className="red-invasion afemd"
          title={'ARTÉRIA FEMORAL DIREITA'}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickAfemd()}
        ></div>
      );
    }
  }
  function ShowMenuAfemd() {
    if (afemdMenu === 1) {
      return (
        <div
          className="menuposition">
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2center" style={{ width: 150, marginBottom: 10 }}>ARTÉRIA FEMORAL DIREITA</div>
            <div
              id="datepicker"
              className="grey-button"
              style={{
                width: 150,
                height: 50,
                marginBottom: 10,
              }}
              onClick={() => showDatePicker(1, 1)}
            >
              {pickdate1}
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', width: window.innerWidth > 800 ? '' : 320,
              flexDirection: window.innerWidth > 800 ? 'column' : 'row',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setAfemd()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                PIA
              </button>
              <button
                onClick={() => setNoneAfemd()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                LIMPAR
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  const clickAfemd = () => {
    document.querySelector('html').scrollTop = window.innerHeight;
    hideInvasionsMenus();
    // atualizando o datepcker com a data de implante do dispositivo.
    if (dataafemd == '') {
      setpickdate1(moment().format('DD/MM/YY'))
    } else {
      setpickdate1(dataafemd);
    }
    setAfemdMenu(1);
  };
  const setAfemd = () => {
    setafemd(1);
    setdataafemd(pickdate1);
    if (dataafemd === '') {
      setdataafemd(moment().format('DD/MM/YYYY'));
    }
    setAfemdMenu(0);
  };
  const setNoneAfemd = () => {
    setafemd(0);
    setdataafemd('');
    setAfemdMenu(0);
  };

  // ARTÉRIA FEMORAL ESQUERDA (AFEME).
  const [afemeMenu, setAfemeMenu] = useState(0);
  function ShowAfeme() {
    if (afeme == 1) {
      return (
        <div
          className="red-invasion afeme"
          title={'DATA DE INSERÇÃO: ' + dataafeme}
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickAfeme()}
        >
          PIA
        </div>
      );
    } else {
      return (
        <div
          className="red-invasion afeme"
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          title={'ARTÉRIA FEMORAL ESQUERDA'}
          onClick={() => clickAfeme()}
        ></div>
      );
    }
  }
  function ShowMenuAfeme() {
    if (afemeMenu === 1) {
      return (
        <div
          className="menuposition">
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2center" style={{ width: 150, marginBottom: 10 }}>ARTÉRIA FEMORAL ESQUERDA</div>
            <div
              id="datepicker"
              className="grey-button"
              style={{
                width: 150,
                height: 50,
                marginBottom: 10,
              }}
              onClick={() => showDatePicker(1, 1)}
            >
              {pickdate1}
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', width: window.innerWidth > 800 ? '' : 320,
              flexDirection: window.innerWidth > 800 ? 'column' : 'row',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setAfeme()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                PIA
              </button>
              <button
                onClick={() => setNoneAfeme()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                LIMPAR
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  const clickAfeme = () => {
    document.querySelector('html').scrollTop = window.innerHeight;
    hideInvasionsMenus();
    // atualizando o datepcker com a data de implante do dispositivo.
    if (dataafeme == '') {
      setpickdate1(moment().format('DD/MM/YY'))
    } else {
      setpickdate1(dataafeme);
    }
    setAfemeMenu(1);
  };
  const setAfeme = () => {
    setafeme(1);
    setdataafeme(pickdate1);
    if (dataafeme === '') {
      setdataafeme(moment().format('DD/MM/YYYY'));
      setAfemeMenu(0);
    }
    setAfemeMenu(0);
  };
  const setNoneAfeme = () => {
    setafeme(0);
    setdataafeme('');
    setAfemeMenu(0);
  };

  // SISTEMA NERVOSO CENTRAL (SNC - DVE, PIC).
  const [sncMenu, setSncMenu] = useState(0);
  function ShowSnc() {
    if (snc == 1) {
      return (
        <div
          className="green-invasion snc"
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          title={'DATA DE INSERÇÃO: ' + datasnc}
          onClick={() => clickSnc()}
        >
          DVE
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion snc"
          style={{
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          title={'SNC'}
          onClick={() => clickSnc()}
        ></div>
      );
    }
  }
  function ShowMenuSnc() {
    if (sncMenu === 1) {
      return (
        <div
          className="menuposition">
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2center" style={{ width: 150, marginBottom: 10 }}>JUGULAR INTERNA DIREITA</div>
            <div
              id="datepicker"
              className="grey-button"
              style={{
                width: 150,
                height: 50,
                marginBottom: 10,
              }}
              onClick={() => showDatePicker(1, 1)}
            >
              {pickdate1}
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', width: window.innerWidth > 800 ? '' : 320,
              flexDirection: window.innerWidth > 800 ? 'column' : 'row',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setSnc()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                DVE
              </button>
              <button
                onClick={() => setNoneSnc()}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                LIMPAR
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  const clickSnc = () => {
    document.querySelector('html').scrollTop = window.innerHeight;
    hideInvasionsMenus();
    // atualizando o datepcker com a data de implante do dispositivo.
    if (datasnc == '') {
      setpickdate1(moment().format('DD/MM/YY'))
    } else {
      setpickdate1(datasnc);
    }
    setSncMenu(1);
  };
  const setSnc = () => {
    setsnc(1);
    setdatasnc(pickdate1);
    if (datasnc === '') {
      setdatasnc(moment().format('DD/MM/YYYY'));
    }
    setSncMenu(0);
  };
  const setNoneSnc = () => {
    setsnc(0);
    setdatasnc('');
    setSncMenu(0);
  };

  // RENDERIZAÇÃO DAS INVASÕES.
  const [showinvasoes, setshowinvasoes] = useState(1)
  function ShowInvasoes() {
    return (
      <div
        style={{ position: 'relative', disabled: tipousuario != 'TEC' ? true : false }}
      >
        <div
          id="invasoes"
          // onTouchEnd={() => updateInvasoes()}
          disabled={tipousuario == 4 ? () => true : false}
          style={{
            position: 'sticky',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 5,
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          <div
            id="ancora"
            className="boneco"
            style={{
              width: window.innerWidth > 800 ? 0.18 * window.innerWidth : '90%',
              height: window.innerWidth < 800 ? 0.85 * window.innerHeight : '90%',
              marginBottom: window.innerWidth > 800 ? 0 : 5,
            }}
          >
            <ShowVa></ShowVa>
            <ShowJid></ShowJid>
            <ShowJie></ShowJie>
            <ShowSubcld></ShowSubcld>
            <ShowSubcle></ShowSubcle>
            <ShowPiard></ShowPiard>
            <ShowPiare></ShowPiare>
            <ShowTorax></ShowTorax>
            <ShowAbd></ShowAbd>
            <ShowVfemd></ShowVfemd>
            <ShowVfeme></ShowVfeme>
            <ShowSvd></ShowSvd>
            <ShowAfemd></ShowAfemd>
            <ShowAfeme></ShowAfeme>
            <ShowPiapedd></ShowPiapedd>
            <ShowPiapede></ShowPiapede>
            <ShowSnc></ShowSnc>
            <img
              alt=""
              src={body}
              style={{
                margin: 5,
                padding: 0,
                width: window.innerWidth > 800 ? 0.18 * window.innerWidth : '',
                height: window.innerWidth < 800 ? 0.85 * window.innerHeight : '',
              }}
            ></img>
          </div>
        </div>
      </div >
    );
  };

  // function Cabeçalho.
  function Identificacao() {
    return (
      <div id="CABEÇALHO + IDENTIFICAÇÃO"
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 10, margin: 0, width: '100%' }}>
        <ShowFilterEvolucao></ShowFilterEvolucao>
        <ShowFilterDiagnosticos></ShowFilterDiagnosticos>
        <ShowFilterProblemas></ShowFilterProblemas>
        <ShowFilterProposta></ShowFilterProposta>
        <ShowFilterInterconsultas></ShowFilterInterconsultas>
        <ShowFilterLaboratorio></ShowFilterLaboratorio>
        <ShowFilterImagem></ShowFilterImagem>
        <ShowFilterFormularios></ShowFilterFormularios>
      </div>
    );
  }

  // renderizando a tela UPDATE ATENDIMENTO.
  const viewUpdateAtendimento = () => {
    setviewupdateatendimento(0);
    setTimeout(() => {
      setviewupdateatendimento(1);
    }, 500);
  }

  // renderizando a tela INSERIR OU ATUALIZAR EVOLUÇÃO.
  function viewEvolucao(valor) {
    setviewevolucao(0);
    setTimeout(() => {
      setviewevolucao(valor); // 1 para inserir evolução, 2 para atualizar evolução.
    }, 500);
  }

  // renderizando a impressão de uma evolução selecionada.
  const viewPrintEvolucao = (item) => {
    setviewprintevolucao(0);
    setTimeout(() => {
      selectedEvolucaoToPrint(item);
      setviewprintevolucao(1); // 1 para inserir evolução, 2 para atualizar evolução.
    }, 500);
  }
  const selectedEvolucaoToPrint = (item) => {
    setidevolucao(item.id);
    setdataevolucao(item.data);
    setevolucao(item.evolucao);
    setpas(item.pas);
    setpad(item.pad);
    setfc(item.fc);
    setfr(item.fr);
    setsao2(item.sao2);
    settax(item.tax);
    setdiu(item.diu);
    setfezes(item.fezes);
    setbh(item.bh);
    setacv(item.acv);
    setar(item.ap);
    setabdome(item.abdome);
    setoutros(item.outros);
    setglasgow(item.glasgow);
    setrass(item.rass);
    setramsay(item.ramsay);
    sethd(item.hd);
    setuf(item.uf);
    setheparina(item.heparina);
    setbraden(item.braden);
    setmorse(item.morse);
    setviewprintevolucao(1);
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

  // LISTA DE FORMULÁRIOS.
  const loadFormularios = () => {
    axios.get(html + "/formularios/" + idpaciente).then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistformularios(x.sort((a, b) => moment(a.data, 'DD/MM/YYYY HH:MM') < moment(b.data, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
      setarrayformularios(x.sort((a, b) => moment(a.data, 'DD/MM/YYYY HH:MM') < moment(b.data, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
    });
  }

  // atualizando um registro de formulário.
  const [idformulario, setidformulario] = useState();
  const [dataformulario, setdataformulario] = useState();
  const [tipoformulario, settipoformulario] = useState();
  const [textoformulario, settextoformulario] = useState();
  const [statusformulario, setstatusformulario] = useState();
  const updateFormulario = (item, valor) => {
    setidformulario(item.id);
    setdataformulario(item.data);
    settipoformulario(item.tipo);
    settextoformulario(item.texto);
    setstatusformulario(item.status);
    viewFormulario(valor);
  }

  // deletando um formulário.
  const deleteFormulario = (item) => {
    axios.get(html + "/deleteformulario/" + item.id).then(() => { loadFormularios() });
  }
  // assinando um formulário.
  const signFormulario = (item) => {
    var obj = {
      idatendimento: item.idatendimento,
      data: item.data,
      tipo: item.tipo,
      texto: item.texto,
      idusuario: item.idusuario,
      usuario: item.usuario,
      status: 1, // assinado.
    };
    axios.post(html + '/updateformulario/' + item.id, obj).then(() => { loadFormularios() });
  };
  // suspendendo um formulário assinando.
  const suspendFormulario = (item) => {
    var obj = {
      idatendimento: item.idatendimento,
      data: item.data,
      tipo: item.tipo,
      texto: item.texto,
      idusuario: item.idusuario,
      usuario: item.usuario,
      status: 2, // suspenso.
    };
    axios.post(html + '/updateformulario/' + item.id, obj).then(() => { loadFormularios() });
  };
  // copiando um formulário assinando.
  const copyFormulario = (item) => {
    var obj = {
      idatendimento: item.idatendimento,
      data: moment().format('DD/MM/YY HH:mm'),
      tipo: item.tipo,
      texto: item.texto,
      idusuario: item.idusuario,
      usuario: item.usuario,
      status: 0,
    };
    axios.post(html + '/insertformulario', obj).then(() => { loadFormularios() });
  };

  // filtro para os formulários.
  function ShowFilterFormularios() {
    if (stateprontuario === 11) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', margin: 5 }}>
          <input
            className="input"
            autoComplete="off"
            placeholder="BUSCAR DOCUMENTO..."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'BUSCAR DOCUMENTO...')}
            onChange={() => filterFormulario()}
            style={{
              width: '100%',
              margin: 0,
            }}
            type="text"
            id="inputFilterFormulario"
            defaultValue={filterformulario}
            maxLength={100}
          ></input>
        </div >
      )
    } else {
      return null;
    }
  }

  const [filterformulario, setfilterformulario] = useState('');
  var searchformulario = '';
  var timeout = null;

  const filterFormulario = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterFormulario").focus();
    searchformulario = document.getElementById("inputFilterFormulario").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchformulario === '') {
        setarrayformularios(listformularios);
        document.getElementById("inputFilterFormulario").value = '';
        document.getElementById("inputFilterFormulario").focus();
      } else {
        setfilterformulario(document.getElementById("inputFilterFormulario").value.toUpperCase());
        setarrayformularios(listformularios.filter(item => item.tipo.includes(searchformulario) === true));
        document.getElementById("inputFilterFormulario").value = searchformulario;
        document.getElementById("inputFilterFormulario").focus();
      }
    }, 500);
  }

  // exibição da lista de formulários.
  const ShowFormularios = useCallback(() => {
    if (stateprontuario == 11) {
      return (
        <div
          id="formulários"
          className="conteudo"
        >
          <Identificacao></Identificacao>
          <div
            className="scroll"
            id="LISTA DE FORMULÁRIOS"
          >
            {arrayformularios.map((item) => (
              <p
                key={item.id}
                id="item da lista"
                className="row"
                style={{
                  opacity: item.status === 2 ? 0.3 : '',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <button
                    className="green-button"
                    style={{
                      margin: 2.5,
                      padding: 10,
                      flexDirection: 'column',
                      backgroundColor: '#52be80',
                    }}
                  >
                    <div>{item.data}</div>
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <button className="animated-yellow-button"
                      style={{ display: item.status === 0 ? 'flex' : 'none' }}
                      onClick={() => updateFormulario(item, 2)}
                      title="EDITAR FORMULÁRIO"
                    >
                      <img
                        alt=""
                        src={editar}
                        style={{
                          margin: 10,
                          height: 30,
                          width: 30,
                        }}
                      ></img>
                    </button>
                    <button className="animated-green-button"
                      style={{ display: item.status === 0 ? 'flex' : 'none' }}
                      onClick={() => signFormulario(item)}
                      title="ASSINAR FORMULÁRIO"
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
                    <button className="animated-green-button"
                      style={{ display: item.status === 1 ? 'flex' : 'none' }}
                      title="COPIAR FORMULÁRIO"
                      onClick={() => copyFormulario(item)}
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
                    <button className="animated-green-button"
                      style={{ display: item.status === 1 ? 'flex' : 'none' }}
                      title="IMPRIMIR FORMULÁRIO"
                      onClick={() => viewPrintFormulario(item)}
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
                    <button className="animated-red-button"
                      onClick={() => suspendFormulario(item)}
                      title="SUSPENDER FORMULÁRIO"
                      style={{ display: item.status === 1 ? 'flex' : 'none', marginRight: 0 }}
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
                    <button className="animated-red-button"
                      onClick={() => deleteFormulario(item)}
                      title="DELETAR FORMULÁRIO"
                      style={{ display: item.status === 0 ? 'flex' : 'none' }}
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
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left' }}>
                  <div
                    className="title2"
                    onClick={item.status !== 2 ? () => updateFormulario(item, 3) : ''}
                    title={item.status !== 2 ? "DOCUMENTO REGISTRADO POR " + item.usuario + ". CLIQUE PARA VISUALIZAR." : "DOCUMENTO CANCELADO POR " + item.usuario + ". CLIQUE PARA VISUALIZAR."}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      width: '100%',
                      marginBottom: 0,
                    }}
                  >
                    {item.tipo}
                  </div>
                  <div
                    className="title2"
                    style={{
                      marginTop: 0, justifyContent: 'flex-start',
                      textAlign: 'left',
                      opacity: 0.5,
                    }}>
                    {item.status !== 2 ? "DOCUMENTO REGISTRADO POR " + item.usuario + "." : "DOCUMENTO CANCELADO POR " + item.usuario + "."}</div>
                </div>
              </p>
            ))}
          </div>
        </div >
      );
    } else {
      return null;
    }
  }, [stateprontuario, arrayformularios]);

  // renderizando a tela INSERIR FORMULÁRIO.
  const viewFormulario = (valor) => {
    setviewformulario(0);
    setTimeout(() => {
      setviewformulario(valor); // 1 para novo formulário, 2 para editar formulário.
    }, 500);
  }

  // renderizando a tela IMPRIMIR FORMULÁRIO.
  const [viewprintformulario, setviewprintformulario] = useState(0);
  const viewPrintFormulario = (item) => {
    setidformulario(item.id);
    setdataformulario(item.data);
    settipoformulario(item.tipo);
    settextoformulario(item.texto);
    setstatusformulario(item.status);
    setviewprintformulario(0);
    setTimeout(() => {
      setviewprintformulario(1);
    }, 500);
  }

  // PRESCRIÇÃO.

  // função que abre o menu para adição de uma prescrição (em branco, modelos, hemotransfusão).
  const addPrescription = () => {
    setnewprescricao(0);
    setTimeout(() => {
      cleanFilters();
      setstateprontuario(9);
      setnewprescricao(1);
    }, 300);
  }

  // 13/04/2021 - EXIBIÇÃO DAS LESÕES DE PRESSÃO.
  // chave seletora para exibição de INVASÕES x LESÕES no boneco.
  const [showlesoes, setshowlesoes] = useState(0);
  const clickLesoes = () => {
    if (showlesoes == 0) {
      loadLesoes();
      setshowlesoes(1);
      setshowinvasoes(0);
      setscrollmenu(0);
      setscrolllist(0);
    } else {
      setshowlesoes(0);
      setshowinvasoes(1);
    }
  }
  function BtnLesoesInvasoes() {
    return (
      <button
        className="blue-button"
        title={showlesoes == 1 ? 'LESÕES' : 'DISPOSITIVOS INVASIVOS'}
        style={{
          display: stateprontuario == 9 ? 'none' : 'flex',
          padding: 2.5,
          position: 'absolute',
          top: 10,
          right: 10,
        }}
        onClick={() => clickLesoes()}
      >
        <img
          alt=""
          src={showlesoes === 1 ? curativo : invasoes}
          style={{
            margin: 0,
            padding: 1.5,
            width: window.innerWidth > 800 ? 40 : 30,
            height: window.innerWidth > 800 ? 40 : 30,
          }}
        ></img>
      </button>
    );
  }

  // exibição do boneco com as lesões de pressão.
  function ShowLesoes() {
    return (
      <div style={{ position: 'relative' }} disabled={tipousuario == 4 ? true : false}>
        <div
          id="lesões"
          style={{
            position: 'sticky',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 5,
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          <div
            id="ancora"
            className="boneco"
            style={{
              width: window.innerWidth > 800 ? 0.18 * window.innerWidth : '90%',
              height: window.innerWidth < 800 ? 0.85 * window.innerHeight : '90%',
              marginBottom: window.innerWidth > 800 ? 0 : 5,
            }}
          >
            <ShowOccipital></ShowOccipital>
            <ShowOmbroD></ShowOmbroD>
            <ShowOmbroE></ShowOmbroE>
            <ShowEscapulaD></ShowEscapulaD>
            <ShowEscapulaE></ShowEscapulaE>
            <ShowCotoveloD></ShowCotoveloD>
            <ShowCotoveloE></ShowCotoveloE>
            <ShowSacral></ShowSacral>
            <ShowIsquioD></ShowIsquioD>
            <ShowIsquioE></ShowIsquioE>
            <ShowTrocanterD></ShowTrocanterD>
            <ShowTrocanterE></ShowTrocanterE>
            <ShowJoelhoD></ShowJoelhoD>
            <ShowJoelhoE></ShowJoelhoE>
            <ShowMaleoloD></ShowMaleoloD>
            <ShowMaleoloE></ShowMaleoloE>
            <ShowHaluxD></ShowHaluxD>
            <ShowHaluxE></ShowHaluxE>
            <ShowCalcaneoD></ShowCalcaneoD>
            <ShowCalcaneoE></ShowCalcaneoE>
            <ShowOrelhaD></ShowOrelhaD>
            <ShowOrelhaE></ShowOrelhaE>
            <img
              alt=""
              src={dorso}
              style={{
                margin: 5,
                padding: 10,
                width: window.innerWidth > 800 ? 0.18 * window.innerWidth : '',
                height: window.innerWidth < 800 ? 0.85 * window.innerHeight : '',
              }}
            ></img>
          </div>
        </div>
      </div>
    );
  }

  // carregando as lesões de pressão do paciente.
  const [lesoes, setlesoes] = useState([]);
  const loadLesoes = () => {
    axios.get(html + "/getlesoes/" + idatendimento).then((response) => {
      var x = [0, 1];
      var y = [0, 1];
      x = response.data;
      y = x.filter(item => item.termino == '');
      setlesoes(y);
    });
  }

  // limpando formulário que exibe as informaçoes das lesões de pressão.
  const limpalesoes = () => {
    setidlesao(0);
    setdatainiciolesao(moment().format('DD/MM/YY'));
    setdataterminolesao();
    setestagiolesao();
    setobservacoeslesao();
    setcurativolesao();
  }

  // definindo e exibindo as informações sobre a lesão (estágio, observações e curativo/tratamento).
  const [idlesao, setidlesao] = useState(0);
  const [locallesao, setlocallesao] = useState('');
  const [datainiciolesao, setdatainiciolesao] = useState('');
  const [dataterminolesao, setdataterminolesao] = useState('');
  const [estagiolesao, setestagiolesao] = useState(0);
  const [observacoeslesao, setobservacoeslesao] = useState('');
  const [curativolesao, setcurativolesao] = useState('');
  const [showinfolesoes, setshowinfolesoes] = useState(0);
  const clickLesaoOccipital = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('OCCIPITAL');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'OCCIPITAL').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'OCCIPITAL').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'OCCIPITAL').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'OCCIPITAL').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'OCCIPITAL').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'OCCIPITAL').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'OCCIPITAL').map(item => item.curativo));
    } else {
      limpalesoes();
    }
    setshowinfolesoes(1);
  }
  const clickLesaoOmbroD = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('OMBRO DIREITO');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'OMBRO DIREITO').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'OMBRO DIREITO').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'OMBRO DIREITO').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'OMBRO DIREITO').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'OMBRO DIREITO').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'OMBRO DIREITO').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'OMBRO DIREITO').map(item => item.curativo));
    } else {
    }
    setshowinfolesoes(1);
  }
  const clickLesaoOmbroE = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('OMBRO ESQUERDO');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'OMBRO ESQUERDO').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'OMBRO ESQUERDO').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'OMBRO ESQUERDO').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'OMBRO ESQUERDO').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'OMBRO ESQUERDO').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'OMBRO ESQUERDO').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'OMBRO ESQUERDO').map(item => item.curativo));
    } else {
      limpalesoes();
    }
    setshowinfolesoes(1);
  }
  const clickLesaoEscapulaD = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('ESCAPULA DIREITA');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'ESCAPULA DIREITA').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'ESCAPULA DIREITA').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'ESCAPULA DIREITA').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'ESCAPULA DIREITA').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'ESCAPULA DIREITA').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'ESCAPULA DIREITA').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'ESCAPULA DIREITA').map(item => item.curativo));
    } else {
    }
    setshowinfolesoes(1);
  }
  const clickLesaoEscapulaE = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('ESCAPULA ESQUERDA');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'ESCAPULA ESQUERDA').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'ESCAPULA ESQUERDA').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'ESCAPULA ESQUERDA').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'ESCAPULA ESQUERDA').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'ESCAPULA ESQUERDA').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'ESCAPULA ESQUERDA').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'ESCAPULA ESQUERDA').map(item => item.curativo));
    } else {
      limpalesoes();
    }
    setshowinfolesoes(1);
  }
  const clickLesaoCotoveloD = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('COTOVELO DIREITO');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'COTOVELO DIREITO').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'COTOVELO DIREITO').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'COTOVELO DIREITO').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'COTOVELO DIREITO').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'COTOVELO DIREITO').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'COTOVELO DIREITO').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'COTOVELO DIREITO').map(item => item.curativo));
    } else {
      limpalesoes();
    }
    setshowinfolesoes(1);
  }
  const clickLesaoCotoveloE = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('COTOVELO ESQUERDO');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'COTOVELO ESQUERDO').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'COTOVELO ESQUERDO').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'COTOVELO ESQUERDO').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'COTOVELO ESQUERDO').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'COTOVELO ESQUERDO').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'COTOVELO ESQUERDO').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'COTOVELO ESQUERDO').map(item => item.curativo));
    } else {
      limpalesoes();
    }
    setshowinfolesoes(1);
  }
  const clickLesaoSacro = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('SACRO');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'SACRO').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'SACRO').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'SACRO').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'SACRO').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'SACRO').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'SACRO').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'SACRO').map(item => item.curativo));
    } else {
      limpalesoes();
    }
    setshowinfolesoes(1);
  }
  const clickLesaoIsquioD = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('ISQUIO DIREITO');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'ISQUIO DIREITO').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'ISQUIO DIREITO').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'ISQUIO DIREITO').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'ISQUIO DIREITO').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'ISQUIO DIREITO').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'ISQUIO DIREITO').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'ISQUIO DIREITO').map(item => item.curativo));
    } else {
      limpalesoes();
    }
    setshowinfolesoes(1);
  }
  const clickLesaoIsquioE = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('ISQUIO ESQUERDO');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'ISQUIO ESQUERDO').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'ISQUIO ESQUERDO').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'ISQUIO ESQUERDO').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'ISQUIO ESQUERDO').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'ISQUIO ESQUERDO').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'ISQUIO ESQUERDO').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'ISQUIO ESQUERDO').map(item => item.curativo));
    } else {
      limpalesoes();
    }
    setshowinfolesoes(1);
  }
  const clickLesaoTrocanterD = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('TROCANTER DIREITO');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'TROCANTER DIREITO').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'TROCANTER DIREITO').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'TROCANTER DIREITO').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'TROCANTER DIREITO').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'TROCANTER DIREITO').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'TROCANTER DIREITO').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'TROCANTER DIREITO').map(item => item.curativo));
    } else {
      limpalesoes();
    }
    setshowinfolesoes(1);
  }
  const clickLesaoTrocanterE = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('TROCANTER ESQUERDO');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'TROCANTER ESQUERDO').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'TROCANTER ESQUERDO').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'TROCANTER ESQUERDO').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'TROCANTER ESQUERDO').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'TROCANTER ESQUERDO').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'TROCANTER ESQUERDO').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'TROCANTER ESQUERDO').map(item => item.curativo));
    } else {
      limpalesoes();
    }
    setshowinfolesoes(1);
  }
  const clickLesaoJoelhoD = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('JOELHO DIREITO');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'JOELHO DIREITO').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'JOELHO DIREITO').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'JOELHO DIREITO').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'JOELHO DIREITO').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'JOELHO DIREITO').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'JOELHO DIREITO').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'JOELHO DIREITO').map(item => item.curativo));
    } else {
      limpalesoes();
    }
    setshowinfolesoes(1);
  }
  const clickLesaoJoelhoE = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('JOELHO ESQUERDO');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'JOELHO ESQUERDO').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'JOELHO ESQUERDO').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'JOELHO ESQUERDO').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'JOELHO ESQUERDO').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'JOELHO ESQUERDO').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'JOELHO ESQUERDO').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'JOELHO ESQUERDO').map(item => item.curativo));
    } else {
      limpalesoes();
    }
    setshowinfolesoes(1);
  }
  const clickLesaoMaleoloD = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('MALEOLO DIREITO');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'MALEOLO DIREITO').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'MALEOLO DIREITO').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'MALEOLO DIREITO').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'MALEOLO DIREITO').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'MALEOLO DIREITO').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'MALEOLO DIREITO').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'MALEOLO DIREITO').map(item => item.curativo));
    } else {
      limpalesoes();
    }
    setshowinfolesoes(1);
  }
  const clickLesaoMaleoloE = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('MALEOLO ESQUERDO');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'MALEOLO ESQUERDO').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'MALEOLO ESQUERDO').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'MALEOLO ESQUERDO').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'MALEOLO ESQUERDO').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'MALEOLO ESQUERDO').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'MALEOLO ESQUERDO').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'MALEOLO ESQUERDO').map(item => item.curativo));
    } else {
      limpalesoes();
    }
    setshowinfolesoes(1);
  }
  const clickLesaoCalcaneoD = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('CALCANEO DIREITO');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'CALCANEO DIREITO').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'CALCANEO DIREITO').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'CALCANEO DIREITO').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'CALCANEO DIREITO').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'CALCANEO DIREITO').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'CALCANEO DIREITO').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'CALCANEO DIREITO').map(item => item.curativo));
    } else {
      limpalesoes();
    }
    setshowinfolesoes(1);
  }
  const clickLesaoCalcaneoE = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('CALCANEO ESQUERDO');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'CALCANEO ESQUERDO').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'CALCANEO ESQUERDO').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'CALCANEO ESQUERDO').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'CALCANEO ESQUERDO').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'CALCANEO ESQUERDO').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'CALCANEO ESQUERDO').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'CALCANEO ESQUERDO').map(item => item.curativo));
    } else {
      limpalesoes();
    }
    setshowinfolesoes(1);
  }
  const clickLesaoHaluxD = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('HALUX DIREITO');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'HALUX DIREITO').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'HALUX DIREITO').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'HALUX DIREITO').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'HALUX DIREITO').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'HALUX DIREITO').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'HALUX DIREITO').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'HALUX DIREITO').map(item => item.curativo));
    } else {
      limpalesoes();
    }
    setshowinfolesoes(1);
  }
  const clickLesaoHaluxE = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('HALUX ESQUERDO');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'HALUX ESQUERDO').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'HALUX ESQUERDO').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'HALUX ESQUERDO').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'HALUX ESQUERDO').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'HALUX ESQUERDO').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'HALUX ESQUERDO').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'HALUX ESQUERDO').map(item => item.curativo));
    } else {
      limpalesoes();
    }
    setshowinfolesoes(1);
  }

  const clickLesaoOrelhaD = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('ORELHA DIREITA');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'ORELHA DIREITA').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'ORELHA DIREITA').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'ORELHA DIREITA').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'ORELHA DIREITA').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'ORELHA DIREITA').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'ORELHA DIREITA').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'ORELHA DIREITA').map(item => item.curativo));
    } else {
      limpalesoes();
    }
    setshowinfolesoes(1);
  }

  const clickLesaoOrelhaE = () => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao('ORELHA ESQUERDA');
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.local === 'ORELHA ESQUERDA').length > 0) {
      setidlesao(lesoes.filter(item => item.local === 'ORELHA ESQUERDA').map(item => item.id));
      setdatainiciolesao(lesoes.filter(item => item.local === 'ORELHA ESQUERDA').map(item => item.inicio));
      setdataterminolesao(lesoes.filter(item => item.local === 'ORELHA ESQUERDA').map(item => item.termino));
      setestagiolesao(lesoes.filter(item => item.local === 'ORELHA ESQUERDA').map(item => item.estagio));
      setobservacoeslesao(lesoes.filter(item => item.local === 'ORELHA ESQUERDA').map(item => item.observacoes));
      setcurativolesao(lesoes.filter(item => item.local === 'ORELHA ESQUERDA').map(item => item.curativo));
    } else {
      limpalesoes();
    }
    setshowinfolesoes(1);
  }

  const updateLesoes = () => {
    var inicio = '';
    var termino = '';
    if (pickdate1 == '') {
      inicio = datainiciolesao
    } else {
      inicio = pickdate1
    }
    if (pickdate2 == '') {
      termino = dataterminolesao
    } else {
      termino = pickdate2
    }
    var obj = {
      idatendimento: idatendimento,
      local: locallesao,
      estagio: estagiolesao,
      inicio: inicio,
      termino: termino,
      observacoes: observacoeslesao,
      curativo: curativolesao,
    };
    if (lesoes.filter(item => item.local == locallesao).length < 1) {
      // salvar nova lesão.
      axios.post(html + '/insertlesao', obj).then(() => {
        setshowinfolesoes(0);
        toast(1, '#52be80', 'LESÃO REGISTRADA COM SUCESSO.', 3000);
        loadLesoes();
      });
    } else {
      // atualizar lesão.
      axios.post(html + '/updatelesao/' + idlesao, obj).then(() => {
        setshowinfolesoes(0);
        toast(1, '#52be80', 'LESÃO ATUALIZADA COM SUCESSO.', 3000);
        loadLesoes();
      });
    }
  }

  var curativos = [
    'RAYNON',
    'FILME TRANSPARENTE',
    'HIDROCOLÓIDE',
    'HIDROGEL',
    'ALGINATO DE CÁLCIO',
    'PAPAÍNA',
    'COLAGENASE',
    'CARVÃO ATIVADO COM PRATA',
    'ESPUMA COM PRATA',
    'PLACA DE PRATA',
    'MATRIZ DE COLÁGENO',
    'MATRIZ DE CELULOSE',
    'PELE ALÓGENA'
  ]

  const selectCurativo = (item) => {
    setcurativolesao(item);
    setshowcurativoslist(0);
  }

  const [showcurativoslist, setshowcurativoslist] = useState(0);
  function ShowCurativosList() {
    if (showcurativoslist == 1) {
      return (
        <div className="menucover" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer">
            <div
              className="scroll"
              id="LISTA DE CURATIVOS"
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                margin: 5,
                padding: 0,
                paddingRight: 5,
                height: 200,
                minHeight: 200,
                minWidth: window.innerWidth > 800 ? 0.30 * window.innerWidth : 0.80 * window.innerWidth,
                width: window.innerWidth > 800 ? 0.30 * window.innerWidth : 0.80 * window.innerWidth
              }}
            >
              {curativos.map((item) => (
                <p
                  key={item.id}
                  id="item da lista"
                  className="row"
                  style={{ margin: 5, marginTop: 2.5, marginBottom: 2.5, width: '100%' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                      <button
                        className={curativolesao == item ? "red-button" : "blue-button"}
                        onClick={() => selectCurativo(item)}
                        style={{
                          width: '100%',
                          margin: 2.5,
                          marginLeft: 5,
                          marginRight: 0,
                          flexDirection: 'column',
                          backgroundColor: '#1f7a8c',
                        }}
                      >
                        <div>{item}</div>
                      </button>
                    </div>
                  </div>
                </p>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  function ShowInfoLesoes() {
    if (showinfolesoes === 1) {
      return (
        <div className="menucover" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer">
            <div id="cabeçalho" className="cabecalho">
              <div className="title5">{'LESÃO ' + locallesao}</div>
              <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="red-button" onClick={() => setshowinfolesoes(0)}>
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
                  onClick={() => updateLesoes()}
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
            <div
              className="corpo">
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mrginRight: 10 }}>
                  <label className="title2">ABERTURA:</label>
                  <button
                    id="datepicker1"
                    className="grey-button"
                    style={{
                      width: 150,
                      height: 50,
                    }}
                    onClick={() => showDatePicker(1, 1)}
                  >
                    {pickdate1 == '' ? datainiciolesao : pickdate1}
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label className="title2">FECHAMENTO:</label>
                  <div
                    id="datepicker2"
                    className="grey-button"
                    style={{
                      width: 150,
                      height: 50,
                    }}
                    onClick={() => showDatePicker(1, 2)}
                  >
                    {pickdate2 == '' ? dataterminolesao : pickdate2}
                  </div>
                </div>
              </div>
              <label className="title2" style={{ marginTop: 15 }}>
                ESTÁGIO DA LESÃO:
              </label>
              <div style={{ display: 'flex', flexDirection: window.innerWidth > 800 ? 'row' : 'column', justifyContent: 'center' }}>
                <button
                  className={estagiolesao == 1 ? "red-button" : "blue-button"}
                  onClick={() => setestagiolesao(1)}
                  style={{ width: 150 }}
                >
                  ESTÁGIO 1
                </button>
                <button
                  className={estagiolesao == 2 ? "red-button" : "blue-button"}
                  onClick={() => setestagiolesao(2)}
                  style={{ width: 150 }}
                >
                  ESTÁGIO 2
                </button>
                <button
                  className={estagiolesao == 3 ? "red-button" : "blue-button"}
                  onClick={() => setestagiolesao(3)}
                  style={{ width: 150 }}
                >
                  ESTÁGIO 3
                </button>
                <button
                  className={estagiolesao == 4 ? "red-button" : "blue-button"}
                  onClick={() => setestagiolesao(4)}
                  style={{ width: 150 }}
                >
                  ESTÁGIO 4
                </button>
                <button
                  className={estagiolesao == 5 ? "red-button" : "blue-button"}
                  onClick={() => setestagiolesao(5)}
                  style={{ width: 150, padding: 10 }}
                >
                  NÃO CLASSIFICÁVEL
                </button>
              </div>
              <label className="title2" style={{ marginTop: 15 }}>
                CURATIVO:
              </label>
              <button
                className="blue-button"
                onClick={() => setshowcurativoslist(1)}
                style={{ paddingLeft: 10, paddingRight: 10, width: '100%' }}
              >
                {curativolesao}
              </button>
              <label className="title2" style={{ marginTop: 15 }}>
                OBSERVAÇÕES:
              </label>
              <textarea
                autoComplete="off"
                className="textarea"
                placeholder="OBSERVAÇÕES."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'OBSERVAÇÕES.')}
                onMouseLeave={(e) => setobservacoeslesao(e.target.value)}
                title="INFORMAR AQUI OBSERVAÇÕES E OUTROS DETALHES REFERENTES À LESÃO."
                style={{
                  width: '100%',
                  minHeight: tipousuario === 1 || 5 ? 125 : 290, // médico ou enfermeira.
                }}
                type="text"
                maxLength={200}
                defaultValue={observacoeslesao}
                id="inputObservacoesLesao"
              ></textarea>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  // exibição das lesões no boneco.
  function ShowOccipital() {
    if (lesoes.filter(item => item.local == 'OCCIPITAL').length > 0) {
      return (
        <div
          className="red-invasion"
          title={' LESÃO OCCIPITAL \nESTÁGIO: ' + lesoes.filter(item => item.local == 'OCCIPITAL').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '4%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesaoOccipital()}
        >
          {lesoes.filter(item => item.local == 'OCCIPITAL').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'OCCIPITAL'}
          style={{
            position: 'absolute',
            top: '4%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoOccipital()}
        >
        </div>
      );
    }
  }

  function ShowOmbroD() {
    if (lesoes.filter(item => item.local == 'OMBRO DIREITO').length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM OMBRO DIREITO \nESTÁGIO: ' + lesoes.filter(item => item.local == 'OMBRO DIREITO').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '18%',
            right: '25%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesaoOmbroD()}
        >
          {lesoes.filter(item => item.local == 'OMBRO DIREITO').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'OMBRO DIREITO'}
          style={{
            position: 'absolute',
            top: '18%',
            right: '25%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoOmbroD()}
        >
        </div>
      );
    }
  }

  function ShowOmbroE() {
    if (lesoes.filter(item => item.local == 'OMBRO ESQUERDO').length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM OMBRO ESQUERDO \nESTÁGIO: ' + lesoes.filter(item => item.local == 'OMBRO ESQUERDO').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '18%',
            left: '25%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesaoOmbroE()}
        >
          {lesoes.filter(item => item.local == 'OMBRO ESQUERDO').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'OMBRO ESQUERDO'}
          style={{
            position: 'absolute',
            top: '18%',
            left: '25%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoOmbroE()}
        >
        </div>
      );
    }
  }

  function ShowEscapulaD() {
    if (lesoes.filter(item => item.local == 'ESCAPULA DIREITA').length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM ESCÁPULA DIREITA \nESTÁGIO: ' + lesoes.filter(item => item.local == 'ESCAPULA DIREITA').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '25%',
            left: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesaoEscapulaD()}
        >
          {lesoes.filter(item => item.local == 'ESCAPULA DIREITA').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'ESCAPULAR DIREITA'}
          style={{
            position: 'absolute',
            top: '25%',
            left: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoEscapulaD()}
        >
        </div>
      );
    }
  }

  function ShowEscapulaE() {
    if (lesoes.filter(item => item.local == 'ESCAPULA ESQUERDA').length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM ESCÁPULA ESQUERDA \nESTÁGIO: ' + lesoes.filter(item => item.local == 'ESCAPULA ESQUERDA').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '25%',
            right: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesaoEscapulaE()}
        >
          {lesoes.filter(item => item.local == 'ESCAPULA ESQUERDA').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'ESCAPULAR ESQUERDA'}
          style={{
            position: 'absolute',
            top: '25%',
            right: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoEscapulaE()}
        >
        </div>
      );
    }
  }

  function ShowCotoveloD() {
    if (lesoes.filter(item => item.local == 'COTOVELO DIREITO').length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM COTOVELO DIREITO \nESTÁGIO: ' + lesoes.filter(item => item.local == 'COTOVELO DIREITO').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '35%',
            left: '75%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesaoCotoveloD()}
        >
          {lesoes.filter(item => item.local == 'COTOVELO DIREITO').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'COTOVELO DIREITO'}
          style={{
            position: 'absolute',
            top: '35%',
            left: '75%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoCotoveloD()}
        >
        </div>
      );
    }
  }

  function ShowCotoveloE() {
    if (lesoes.filter(item => item.local == 'COTOVELO ESQUERDO').length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM COTOVELO ESQUERDO \nESTÁGIO: ' + lesoes.filter(item => item.local == 'COTOVELO ESQUERDO').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '35%',
            right: '75%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesaoCotoveloE()}
        >
          {lesoes.filter(item => item.local == 'COTOVELO ESQUERDO').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'COTOVELO ESQUERDO'}
          style={{
            position: 'absolute',
            top: '35%',
            right: '75%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoCotoveloE()}
        >
        </div>
      );
    }
  }

  function ShowSacral() {
    if (lesoes.filter(item => item.local == 'SACRO').length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO SACRAL \nESTÁGIO: ' + lesoes.filter(item => item.local == 'SACRO').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '50%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesaoSacro()}
        >
          {lesoes.filter(item => item.local == 'SACRO').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'SACRAL'}
          style={{
            position: 'absolute',
            top: '50%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoSacro()}
        >
        </div>
      );
    }
  }

  function ShowIsquioD() {
    if (lesoes.filter(item => item.local == 'ISQUIO DIREITO').length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO ISQUIÁTICA DIREITA \nESTÁGIO: ' + lesoes.filter(item => item.local == 'ISQUIO DIREITO').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '55%',
            left: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesaoIsquioD()}
        >
          {lesoes.filter(item => item.local == 'ISQUIO DIREITO').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'ISQUIÁTICA DIREITA'}
          style={{
            position: 'absolute',
            top: '55%',
            left: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoIsquioD()}
        >
        </div>
      );
    }
  }

  function ShowIsquioE() {
    if (lesoes.filter(item => item.local == 'ISQUIO ESQUERDO').length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO ISQUIÁTICA ESQUERDA \nESTÁGIO: ' + lesoes.filter(item => item.local == 'ISQUIO ESQUERDO').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '55%',
            right: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesaoIsquioE()}
        >
          {lesoes.filter(item => item.local == 'ISQUIO ESQUERDO').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'ISQUIÁTICA ESQUERDA'}
          style={{
            position: 'absolute',
            top: '55%',
            right: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoIsquioE()}
        >
        </div>
      );
    }
  }

  function ShowTrocanterD() {
    if (lesoes.filter(item => item.local == 'TROCANTER DIREITO').length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO TROCANTÉRICA DIREITA \nESTÁGIO: ' + lesoes.filter(item => item.local == 'TROCANTER DIREITO').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '50%',
            left: '65%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesaoTrocanterD()}
        >
          {lesoes.filter(item => item.local == 'TROCANTER DIREITO').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'TROCANTÉRICA DIREITA'}
          style={{
            position: 'absolute',
            top: '50%',
            left: '65%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoTrocanterD()}
        >
        </div>
      );
    }
  }

  function ShowTrocanterE() {
    if (lesoes.filter(item => item.local == 'TROCANTER ESQUERDO').length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO TROCANTÉRICA ESQUERDA \nESTÁGIO: ' + lesoes.filter(item => item.local == 'TROCANTER ESQUERDO').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '50%',
            right: '65%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesaoTrocanterE()}
        >
          {lesoes.filter(item => item.local == 'TROCANTER ESQUERDO').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'TROCANTÉRICA ESQUERDA'}
          style={{
            position: 'absolute',
            top: '50%',
            right: '65%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoTrocanterE()}
        >
        </div>
      );
    }
  }

  function ShowJoelhoD() {
    if (lesoes.filter(item => item.local == 'JOELHO DIREITO').length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM JOELHO DIREITO \nESTÁGIO: ' + lesoes.filter(item => item.local == 'JOELHO DIREITO').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '70%',
            left: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesaoJoelhoD()}
        >
          {lesoes.filter(item => item.local == 'JOELHO DIREITO').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'JOELHO DIREITO'}
          style={{
            position: 'absolute',
            top: '70%',
            left: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoJoelhoD()}
        >
        </div>
      );
    }
  }

  function ShowJoelhoE() {
    if (lesoes.filter(item => item.local == 'JOELHO ESQUERDO').length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM JOELHO ESQUERDO \nESTÁGIO: ' + lesoes.filter(item => item.local == 'JOELHO ESQUERDO').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '80%',
            right: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesaoJoelhoE()}
        >
          {lesoes.filter(item => item.local == 'JOELHO ESQUERDO').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'JOELHO ESQUERDO'}
          style={{
            position: 'absolute',
            top: '70%',
            right: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoJoelhoE()}
        >
        </div>
      );
    }
  }

  function ShowMaleoloD() {
    if (lesoes.filter(item => item.local == 'MALEOLO DIREITO').length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM MALÉOLO DIREITO \nESTÁGIO: ' + lesoes.filter(item => item.local == 'MALEOLO DIREITO').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '88%',
            left: '60%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.04 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.04 * window.innerWidth : 0.07 * window.innerWidth,
          }}
          onClick={() => clickLesaoMaleoloD()}
        >
          {lesoes.filter(item => item.local == 'MALEOLO DIREITO').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'MALEOLAR DIREITA'}
          style={{
            position: 'absolute',
            top: '88%',
            left: '60%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.04 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.04 * window.innerWidth : 0.07 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoMaleoloD()}
        >
        </div>
      );
    }
  }

  function ShowMaleoloE() {
    if (lesoes.filter(item => item.local == 'MALEOLO ESQUERDO').length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM MALÉOLO ESQUERDO \nESTÁGIO: ' + lesoes.filter(item => item.local == 'MALEOLO ESQUERDO').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '88%',
            right: '60%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.04 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.04 * window.innerWidth : 0.07 * window.innerWidth,
          }}
          onClick={() => clickLesaoMaleoloE()}
        >
          {lesoes.filter(item => item.local == 'MALEOLO ESQUERDO').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'MALEOLAR ESQUERDA'}
          style={{
            position: 'absolute',
            top: '88%',
            right: '60%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.04 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.04 * window.innerWidth : 0.07 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoMaleoloE()}
        >
        </div>
      );
    }
  }

  function ShowHaluxD() {
    if (lesoes.filter(item => item.local == 'HALUX DIREITO').length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM HÁLUX DIREITO \nESTÁGIO: ' + lesoes.filter(item => item.local == 'HALUX DIREITO').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '95%',
            left: '50%',
            height: window.innerWidth > 800 ? 0.01 * window.innerWidth : window.innerWidth > 600 ? 0.035 * window.innerWidth : 0.045 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.01 * window.innerWidth : window.innerWidth > 600 ? 0.035 * window.innerWidth : 0.045 * window.innerWidth,
          }}
          onClick={() => clickLesaoHaluxD()}
        >
          {lesoes.filter(item => item.local == 'HALUX DIREITO').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'HÁLUX DIREITO'}
          style={{
            position: 'absolute',
            top: '95%',
            left: '50%',
            height: window.innerWidth > 800 ? 0.01 * window.innerWidth : window.innerWidth > 600 ? 0.035 * window.innerWidth : 0.045 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.01 * window.innerWidth : window.innerWidth > 600 ? 0.035 * window.innerWidth : 0.045 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoHaluxD()}
        >
        </div>
      );
    }
  }

  function ShowHaluxE() {
    if (lesoes.filter(item => item.local == 'HALUX ESQUERDO').length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM HÁLUX ESQUERDO \nESTÁGIO: ' + lesoes.filter(item => item.local == 'HALUX ESQUERDO').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '95%',
            right: '55%',
            height: window.innerWidth > 800 ? 0.01 * window.innerWidth : window.innerWidth > 600 ? 0.035 * window.innerWidth : 0.045 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.01 * window.innerWidth : window.innerWidth > 600 ? 0.035 * window.innerWidth : 0.045 * window.innerWidth,
          }}
          onClick={() => clickLesaoHaluxE()}
        >
          {lesoes.filter(item => item.local == 'HALUX ESQUERDO').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'HÁLUX ESQUERDO'}
          style={{
            position: 'absolute',
            top: '95%',
            right: '50%',
            height: window.innerWidth > 800 ? 0.01 * window.innerWidth : window.innerWidth > 600 ? 0.035 * window.innerWidth : 0.045 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.01 * window.innerWidth : window.innerWidth > 600 ? 0.035 * window.innerWidth : 0.045 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoHaluxE()}
        >
        </div>
      );
    }
  }

  function ShowCalcaneoD() {
    if (lesoes.filter(item => item.local == 'CALCANEO DIREITO').length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM CALCÂNEO DIREITO \nESTÁGIO: ' + lesoes.filter(item => item.local == 'CALCANEO DIREITO').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '91%',
            left: '52%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
          }}
          onClick={() => clickLesaoCalcaneoD()}
        >
          {lesoes.filter(item => item.local == 'CALCANEO DIREITO').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'CALCÂNEO DIREITO'}
          style={{
            position: 'absolute',
            top: '91%',
            left: '52%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoCalcaneoD()}
        >
        </div>
      );
    }
  }

  function ShowCalcaneoE() {
    if (lesoes.filter(item => item.local == 'CALCANEO ESQUERDO').length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM CALCÂNEO ESQUERDO \nESTÁGIO: ' + lesoes.filter(item => item.local == 'CALCANEO ESQUERDO').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '91%',
            right: '52%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
          }}
          onClick={() => clickLesaoCalcaneoE()}
        >
          {lesoes.filter(item => item.local == 'CALCANEO ESQUERDO').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'CALCÂNEO ESQUERDO'}
          style={{
            position: 'absolute',
            top: '91%',
            right: '52%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoCalcaneoE()}
        >
        </div>
      );
    }
  }

  function ShowOrelhaD() {
    if (lesoes.filter(item => item.local == 'ORELHA DIREITA').length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM ORELHA ESQUERDA \nESTÁGIO: ' + lesoes.filter(item => item.local == 'ORELHA DIREITA').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '8%',
            left: '55%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
          }}
          onClick={() => clickLesaoOrelhaD()}
        >
          {lesoes.filter(item => item.local == 'ORELHA DIREITA').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'ORELHA DIREITA'}
          style={{
            position: 'absolute',
            top: '8%',
            left: '55%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoOrelhaD()}
        >
        </div>
      );
    }
  }

  function ShowOrelhaE() {
    if (lesoes.filter(item => item.local == 'ORELHA ESQUERDA').length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM ORELHA ESQUERDA \nESTÁGIO: ' + lesoes.filter(item => item.local == 'ORELHA ESQUERDA').map(item => item.estagio)}
          style={{
            position: 'absolute',
            top: '8%',
            right: '55%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
          }}
          onClick={() => clickLesaoOrelhaE()}
        >
          {lesoes.filter(item => item.local == 'ORELHA ESQUERDA').map(item => item.estagio)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'ORELHA ESQUERDA'}
          style={{
            position: 'absolute',
            top: '8%',
            right: '55%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesaoOrelhaE()}
        >
        </div>
      );
    }
  }

  const showSideBar = (e) => {
    if (e.pageX < 20) {
      document.getElementById("sidebar").className = "pacientes-menu-in";
    }
  }
  // selecionando um paciente da lista e atualizando a tela corrida.
  const selectPaciente = (item) => {
    setidatendimento(item.id);
    history.push('/prontuario')
  };
  // SIDEBAR ANIMADA COM LISTA DE PACIENTES.
  function SideBar() {
    return (
      <div
        id="sidebar"
        className="pacientes-menu-out"
        onMouseOver={() => document.getElementById("sidebar").className = "pacientes-menu-in"}
        onMouseOut={() => document.getElementById("sidebar").className = "pacientes-menu-out"}
        style={{
          display: tipounidade != 4 && window.innerWidth > 800 ? 'flex' : 'none',
          width: 300,
          position: 'absolute',
          padding: 10, paddingLeft: 0,
          zIndex: 50,
        }
        }>
        <div
          className="widget"
          style={{
            flexDirection: 'column', margin: 0,
            borderRadius: 5, borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
            width: 300,
            height: '100%',
            padding: 10, paddingLeft: 0,
            boxShadow: '0 0 0.5em black',
          }}
        >
          <div className="title2" style={{ color: "#ffffff" }}>{'LISTA DE PACIENTES:  ' + nomeunidade}</div>
          <div className="scrolldrop" style={{ height: 0.8 * window.innerHeight, width: '100%', justifyContent: 'flex-start', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
            {listatendimentos.filter(item => item.hospital == nomehospital && item.unidade == nomeunidade && item.ativo > 0).map((item) => (
              <div
                key={item.id}
                className="row"
                style={{ opacity: 1 }}
              >
                <button className="grey-button" style={{ backgroundColor: 'grey', display: item.box !== '' ? 'flex' : 'none' }}>
                  {item.box}
                </button>
                <button
                  onClick={() => selectPaciente(item)}
                  className={item.status == 3 ? 'green-button' : item.status == 2 ? 'yellow-button' : item.status == 1 ? 'red-button' : item.status == 0 ? 'grey-button' : 'pool-button'}
                  title={
                    'STATUS: ' +
                    item.status +
                    '. CLIQUE PARA EVOLUIR.'
                  }
                  style={{
                    padding: 10,
                    margin: 2.5,
                    width: 250,
                    height: 50,
                  }}
                >
                  {listpacientes.filter((value) => value.id === item.idpaciente).map((item) => item.nome)}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div >
    )
  }

  // RENDERIZAÇÃO DO COMPONENTE PRONTUÁRIO.
  // renderização do componente.
  return (
    <div
      className="main fade-in"
      id="PRINCIPAL"
      onMouseMove={(e) => { showSideBar(e) }}
      style={{
        display: 'flex',
        margin: 0,
        padding: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        overflowX: 'hidden',
        overflowY: 'hidden',
      }}
    >
      <div
        style={{
          display: window.innerWidth < 800 ? 'flex' : 'none',
          position: 'fixed', bottom: 10, left: 10, zIndex: 1,
        }}
      >
        <ButtonMobileMenu></ButtonMobileMenu>
      </div>
      <MobileMenu></MobileMenu>
      <Evolucao
        // variáveis da corrida.
        hospital={nomehospital}
        unidade={nomeunidade}
        // variáveis da evolução.
        viewevolucao={viewevolucao}
        idevolucao={idevolucao ? idevolucao : 0}
        data={dataevolucao}
        idpaciente={idpaciente}
        idatendimento={idatendimento}
        idusuario={idusuario}
        usuario={nomeusuario}
        funcao={tipousuario}
        idusuariologado={idusuario}
        evolucao={evolucao}
        pas={pas}
        pad={pad}
        fc={fc}
        fr={fr}
        sao2={sao2}
        tax={tax}
        diu={diu}
        fezes={fezes}
        bh={bh}
        acv={acv}
        ar={ar}
        abdome={abdome}
        outros={outros}
        glasgow={glasgow}
        rass={rass}
        ramsay={ramsay}
        hd={hd}
        uf={uf}
        heparina={heparina}
        braden={braden}
        morse={morse}
      />
      <PrintEvolucao
        // variáveis da corrida.
        hospital={nomehospital}
        unidade={nomeunidade}
        // variáveis da evolução.
        viewprintevolucao={viewprintevolucao}
        idevolucao={idevolucao ? idevolucao : 0}
        data={dataevolucao}
        idatendimento={idatendimento}
        idusuario={idusuario}
        usuario={nomeusuario}
        funcao={tipousuario}
        conselho={conselhousuario}
        idusuariologado={idusuario}
        box={box}
        nome={nomepaciente}
        dn={dn}
        evolucao={evolucao}
        pas={pas}
        pad={pad}
        fc={fc}
        fr={fr}
        sao2={sao2}
        tax={tax}
        diu={diu}
        fezes={fezes}
        bh={bh}
        acv={acv}
        ar={ar}
        abdome={abdome}
        outros={outros}
        glasgow={glasgow}
        rass={rass}
        ramsay={ramsay}
        hd={hd}
        uf={uf}
        heparina={heparina}
        braden={braden}
        morse={morse}
      />
      <Formularios
        // variáveis da corrida.
        hospital={nomehospital}
        unidade={nomeunidade}
        // variáveis do formulário.
        viewformulario={viewformulario}
        idpaciente={idpaciente}
        idatendimento={idatendimento}
        idusuario={idusuario}
        usuario={nomeusuario}
        funcao={tipousuario}
        conselho={especialidadeusuario}
        box={box}
        nome={nomepaciente}
        dn={dn}
        idformulario={idformulario}
        dataformulario={dataformulario}
        tipoformulario={tipoformulario}
        textoformulario={textoformulario}
        statusformulario={statusformulario}
      />
      <PrintFormulario
        // variáveis da corrida.
        hospital={nomehospital}
        unidade={nomeunidade}
        // variáveis do formulário.
        viewprintformulario={viewprintformulario}
        idatendimento={idatendimento}
        idusuario={idusuario}
        usuario={nomeusuario}
        funcao={tipousuario}
        conselho={especialidadeusuario}
        box={box}
        nome={nomepaciente}
        dn={dn}
        idformulario={idformulario}
        dataformulario={dataformulario}
        tipoformulario={tipoformulario}
        textoformulario={textoformulario}
        statusformulario={statusformulario}
      />
      <Diagnostico
        // variáveis da corrida.
        usuario={nomeusuario}
        // variáveis dos diagnósticos.
        viewdiagnostico={viewdiagnostico}
        inicio={iniciodiag}
        termino={terminodiag}
        cid={cid}
        iddiagnostico={iddiagnostico}
        diagnostico={diagnostico}
        iniciodiag={iniciodiag}
        terminodiag={terminodiag}
      />
      <Problemas
        viewproblema={viewproblema}
        inicio={inicioproblema}
        idproblema={idproblema}
        problema={problema}
      />
      <Propostas
        // variáveis das propostas.
        viewproposta={viewproposta}
        idproposta={idproposta}
        proposta={proposta}
        inicio={inicioprop}
        termino={terminoprop}
      />
      <Interconsultas
        // variáveis da corrida.
        hospital={nomehospital}
        unidade={nomeunidade}
        idusuario={idusuario}
        usuario={nomeusuario}
        tipo={tipousuario}
        // variáveis das interconsultas.
        viewinterconsulta={viewinterconsulta}
        idpaciente={idpaciente}
        idatendimento={idatendimento}
        idinterconsulta={idinterconsulta}
        pedido={pedidointerconsulta}
        especialidade={especialidadeinterconsulta}
        motivo={motivointerconsulta}
        status={statusinterconsulta}
        parecer={parecerinterconsulta}
      />
      <Laboratorio
        // variáveis da corrida.
        hospital={nomehospital}
        unidade={nomeunidade}
        idusuario={idusuario}
        usuario={nomeusuario}
        funcao={tipousuario}
        // variáveis do laboratório.
        viewlaboratorio={viewlaboratorio}
        idatendimento={idatendimento}
      />
      <Imagem
        // variáveis da corrida.
        hospital={nomehospital}
        unidade={nomeunidade}
        idusuario={idusuario}
        usuario={nomeusuario}
        funcao={tipousuario}
        // variáveis das imagens.
        viewimagem={viewimagem}
        idatendimento={idatendimento}
      />
      <Balanco
        // variáveis da corrida.
        hospital={nomehospital}
        unidade={nomeunidade}
        idusuario={idusuario}
        usuario={nomeusuario}
        funcao={tipousuario}
        // variáveis do balanço.
        viewbalanco={viewbalanco}
        idatendimento={idatendimento}
        idbalanco={idbalanco}
        databalanco={moment().format('DD/MM/YY')}
        horabalanco={moment().format('HH') + ':00'}
        pas={pas}
        pad={pad}
        fc={fc}
        fr={fr}
        sao2={sao2}
        tax={tax}
        diu={diu}
        fezes={fezes}
      />
      <div id="POPUPS">
        <Toast valortoast={valortoast} cor={cor} mensagem={mensagem} tempo={tempo} />
        <DatePicker valordatepicker={valordatepicker} mododatepicker={mododatepicker} />
        <ShowMenuSnc></ShowMenuSnc>
        <ShowMenuVa></ShowMenuVa>
        <ShowMenuJid></ShowMenuJid>
        <ShowMenuJie></ShowMenuJie>
        <ShowMenuSubcld></ShowMenuSubcld>
        <ShowMenuSubcle></ShowMenuSubcle>
        <ShowMenuPiard></ShowMenuPiard>
        <ShowMenuPiare></ShowMenuPiare>
        <ShowMenuTorax></ShowMenuTorax>
        <ShowMenuAbd></ShowMenuAbd>
        <ShowMenuSvd></ShowMenuSvd>
        <ShowMenuVfemd></ShowMenuVfemd>
        <ShowMenuVfeme></ShowMenuVfeme>
        <ShowMenuAfemd></ShowMenuAfemd>
        <ShowMenuAfeme></ShowMenuAfeme>
        <ShowMenuPiapedd></ShowMenuPiapedd>
        <ShowMenuPiapede></ShowMenuPiapede>
        <ShowInfoLesoes></ShowInfoLesoes>
        <ShowCurativosList></ShowCurativosList>
        <ChangeStatus></ChangeStatus>
        <ChangePrecaucao></ChangePrecaucao>
        <UpdateVm></UpdateVm>
      </div>
      <div id="PRONTUÁRIO"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: window.innerHeight,
          width: window.innerWidth,
        }}>
        <div id="LISTAS"
          className="prontuario"
          style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            height: window.innerHeight,
            padding: 0,
            margin: 0,
          }}>
          <Paciente></Paciente>
          <Principal></Principal>
          <LoadPrincipal></LoadPrincipal>
          <ShowEvolucoes></ShowEvolucoes>
          <ShowDiagnosticos></ShowDiagnosticos>
          <ShowProblemas></ShowProblemas>
          <ShowPropostas></ShowPropostas>
          <ShowIntercosultas></ShowIntercosultas>
          <ShowLaboratorio></ShowLaboratorio>
          <ShowImagem></ShowImagem>
          <Prescricao newprescricao={newprescricao}></Prescricao>
          <ShowFormularios></ShowFormularios>
          <ShowBalancos></ShowBalancos>
        </div>
        <Menu></Menu>
        <SideBar></SideBar>
        <UpdateAtendimento viewupdateatendimento={viewupdateatendimento}></UpdateAtendimento>
        <GetSpeech></GetSpeech>
        <ShowSpeech></ShowSpeech>
      </div>
    </div>
  );
}

export default Prontuario;