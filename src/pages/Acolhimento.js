/* eslint eqeqeq: "off" */
import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import moment, { locale } from 'moment';
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import Toast from '../components/Toast';
import Header from '../components/Header';
import Context from '../Context';

function Acolhimento() {
  var html = 'https://pulsarapp-server.herokuapp.com';
  moment.locale('pt-br');
  const {
    idusuario,
    nomeusuario,
    tipousuario,
    especialidadeusuario,
    conselhousuario,
    nomehospital,
    nomeunidade,
    tipounidade,
    idatendimento,
    setidatendimento,
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
    setstateprontuario
  } = useContext(Context)

  // carregamento da lista de pacientes para a unidade selecionada, conforme o status.
  const [atendimentos, setatendimentos] = useState([]);
  const loadAtendimentosATriar = () => {
    // todos os atendimentos não classificados, de qualquer unidade/setor (classificação 0).
    axios.get(html + '/atendimentos').then((response) => {
      var x = [0, 1];
      x = response.data;
      var y = x.filter((item) => item.classificacao == 0 && item.hospital == nomehospital && item.unidade == nomeunidade && item.ativo == 1);
      setatendimentos(y);
    });
  }

  useEffect(() => {
    loadAtendimentosATriar();
    loadFluxo();
    setdescritor('');
    setviewfluxo(0);
    setatendimentoclassificacao(0);
  }, [])

  // calculando tempo de espera para atendimento.
  const espera = (valor) => {
    var stringadmissao = JSON.stringify(valor).substring(1, 17);
    var minutes = moment().diff(moment(stringadmissao, 'DD/MM/YYYY hh:mm'), 'minutes');
    var dias = Math.floor(minutes / 1440) // total de dias completos esperando.
    var horas = Math.floor(minutes / 60) - (dias * 24) // total horas completas descontando-se as horas dos dias completos.
    var minutos = minutes - (horas * 60) - (dias * 1440) // total de minutos completos descontando-se os dias e horas completos.
    return (dias + ' DIA(S), ' + horas + ' HORA(S) E ' + minutos + ' MINUTO(S).')
  }

  // renderização da lista de pacientes.
  function ShowPacientes() {
    if (atendimentos.length > 0) {
      return (
        <div
          className="scroll"
          id="LISTA DE PACIENTES"
          style={{
            height: '82vh',
          }}
        >
          {atendimentos.sort((a, b) => a.admissao > b.admissao ? 1 : -1).map((item) => (
            <div
              onClick={() => selectAtendimento(item)}
              key={item.id}
              className="row"
            >
              <div
                className="title2"
                title="HORA DE ENTRADA."
                style={{ minWidth: 100, width: 100, margin: 2.5, alignSelf: 'center' }}
              >
                {item.admissao}
              </div>
              <div
                className="title2"
                title="TEMPO DE ESPERA."
                style={{ minWidth: 250, width: 250, margin: 2.5, alignSelf: 'center' }}
              >
                {espera(item.admissao)}
              </div>
              <div
                className="title2"
                title="SETOR/UNIDADE DE INTERNAÇÃO."
                style={{ minWidth: 120, width: 120, margin: 2.5, alignSelf: 'center' }}
              >
                {item.unidade}
              </div>
              <button
                className="blue-button"
                style={{
                  margin: 2.5,
                  width: '100%',
                }}
              >
                {item.nome}
              </button>
              <div
                className="title2"
                style={{ minWidth: 100, width: 100, margin: 2.5, alignSelf: 'center' }}
              >
                {moment().diff(moment(item.dn, 'DD/MM/YYYY'), 'years') > 1 ? moment().diff(moment(item.dn, 'DD/MM/YYYY'), 'years') + ' ANOS' : moment().diff(moment(item.dn, 'DD/MM/YYYY'), 'years') + ' ANO'}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div
          className="scroll"
          id="LISTA DE PACIENTES"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            borderRadius: 5,
            margin: 5,
            minHeight: window.innerHeight - 180,
            height: window.innerHeight - 180,
          }}
        >
          <div className="title2"
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              margin: 10,
              padding: 0,
            }}>
            {'NÃO HÁ PACIENTES INTERNADOS NÃO CLASSIFICADOS NESTA UNIDADE.'}
          </div>
        </div>
      )
    }
  }

  function ShowPacientesHeader() {
    return (
      <div
        className="row"
        style={{ width: '100%', paddingLeft: 10, paddingRight: 35 }}
      >
        <button
          className="header"
          style={{ minWidth: 100, width: 100, margin: 2.5 }}
          disabled="true"
        >
          ENTRADA
        </button>
        <button
          className="header"
          style={{ minWidth: 250, width: 250, margin: 2.5, padding: 10 }}
        >
          TEMPO DE ESPERA
        </button>
        <button
          className="header"
          style={{ minWidth: 120, width: 120, margin: 2.5, padding: 5 }}
        >
          UNIDADE
        </button>
        <button
          className="header"
          style={{ minWidth: 50, width: 50, margin: 2.5 }}
        >
          BOX
        </button>
        <button
          className="header"
          style={{ width: '100%', margin: 2.5 }}
        >
          NOME
        </button>
        <button
          className="header"
          style={{ minWidth: 100, width: 100, margin: 2.5 }}
        >
          IDADE
        </button>
      </div >
    );
  }

  // selecionando um paciente da lista e abrindo a tela de classificação de riscos.
  const [atendimentoid, setatendimentoid] = useState(0);
  const [atendimentoidpaciente, setatendimentoidpaciente] = useState(0);
  const [atendimentohospital, setatendimentohospital] = useState('');
  const [atendimentounidade, setatendimentounidade] = useState('');
  const [atendimentobox, setatendimentobox] = useState('');
  const [atendimentoadmissao, setatendimentoadmissao] = useState('');
  const [atendimentonome, setatendimentonome] = useState('');
  const [atendimentodn, setatendimentodn] = useState('');
  const [atendimentopeso, setatendimentopeso] = useState('');
  const [atendimentoaltura, setatendimentoaltura] = useState('');
  const [atendimentoantecedentes, setatendimentoantecedentes] = useState('');
  const [atendimentoalergias, setatendimentoalergias] = useState('');
  const [atendimentomedicacoes, setatendimentomedicacoes] = useState('');
  const [atendimentoexames, setatendimentoexames] = useState('');
  const [atendimentohistoria, setatendimentohistoria] = useState('');
  const [atendimentostatus, setatendimentostatus] = useState('');
  const [atendimentoativo, setatendimentoativo] = useState('');
  const [atendimentoclassificacao, setatendimentoclassificacao] = useState('');
  const [atendimentodescritor, setatendimentodescritor] = useState('');
  const selectAtendimento = (item) => {
    setatendimentoid(item.id);
    setatendimentoidpaciente(item.idpaciente);
    setatendimentohospital(item.hospital);
    setatendimentounidade(item.unidade);
    setatendimentobox(item.box);
    setatendimentoadmissao(item.admissao);
    setatendimentonome(item.nome);
    setatendimentodn(item.dn);
    setatendimentopeso(item.peso);
    setatendimentoaltura(item.altura);
    setatendimentoantecedentes(item.antecedentes);
    setatendimentoalergias(item.alergias);
    setatendimentomedicacoes(item.medicacoes);
    setatendimentoexames(item.exames);
    setatendimentohistoria(item.historia);
    setatendimentostatus(item.status);
    setatendimentoativo(item.ativo);
    setatendimentoclassificacao('');
    setatendimentodescritor('');
    setdescritor('');
    setviewfluxo(1);
    setshowclassificador(1);
    setpas('');
    setpad('');
    setfc('');
    setsao2('');
    settax('');
  };

  // atualizando um atendimento, após a conclusão da classificação.
  const updateAtendimento = () => {
    var obj = {
      idpaciente: atendimentoidpaciente,
      hospital: atendimentohospital,
      unidade: atendimentounidade,
      box: atendimentobox,
      admissao: atendimentoadmissao,
      nome: atendimentonome,
      dn: atendimentodn,
      peso: atendimentopeso,
      altura: atendimentoaltura,
      antecedentes: atendimentoantecedentes,
      alergias: atendimentoalergias,
      medicacoes: atendimentomedicacoes,
      exames: atendimentoexames,
      historia: atendimentohistoria,
      status: atendimentostatus,
      ativo: 1,
      classificacao: atendimentoclassificacao,
      descritor: atendimentodescritor,
    };
    axios.post(html + "/updateatendimento/'" + atendimentoid + "'", obj).then(() => {
      toast(1, '#52be80', 'PACIENTE CLASSIFICADO COM SUCESSO.', 4000);
      setshowclassificador(0);
      loadAtendimentosATriar();
    });
  }

  // BUSCA DE DESCRITOR/FLUXO.
  // carregando os registros de descritores para classificação de risco.
  const [fluxo, setfluxo] = useState([]);
  const [arrayfluxo, setarrayfluxo] = useState([])
  const loadFluxo = () => {
    axios.get(html + '/fluxo').then((response) => {
      setfluxo(response.data);
      setarrayfluxo(response.data);
    });
  }
  // código para filtrarmos um descritor/fluxo de classificação de risco.
  var searchfluxo = '';
  var timeout = null;
  const [descritor, setdescritor] = useState('');
  const [viewfluxo, setviewfluxo] = useState(0);
  const filterFluxo = () => {
    searchfluxo = document.getElementById("inputFluxo").value.toUpperCase();
    document.getElementById("inputFluxo").focus();
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (searchfluxo !== '') {
        setviewfluxo(1);
        setarrayfluxo(fluxo.filter(item => item.aliases.includes(searchfluxo) === true));
        setdescritor(searchfluxo);
        document.getElementById("inputFluxo").focus();
      } else {
        setviewfluxo(0);
        setarrayfluxo([]);
        setdescritor('');
        document.getElementById("inputFluxo").focus();
      }
    }, 500);
  }
  const cleanFilter = () => {
    setdescritor('');
    setarrayfluxo(fluxo);
    setviewfluxo(1);
    setatendimentoclassificacao(0);
    setpas('');
    setpad('');
    setfc('');
    setsao2('');
    settax('');
    setTimeout(() => {
      document.getElementById("inputFluxo").focus();
    }, 100);
  }
  // definindo a classificação (cor) de um atendimento.
  var vardescritor = '';
  var varclassificacao = 0;
  const selectFluxo = (item) => {
    setatendimentoclassificacao(item.cor);
    setatendimentodescritor(item.fluxo);
    setdescritor(item.fluxo);
    setviewfluxo(0);
    varclassificacao = item.cor;
    vardescritor = item.fluxo;
  }

  // DADOS OBJETIVOS.
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

  const persistDadosClinicos = () => {
    setpas(document.getElementById("inputPas").value);
    setpad(document.getElementById("inputPad").value);
    setfc(document.getElementById("inputFc").value);
    setsao2(document.getElementById("inputSao2").value);
    settax(document.getElementById("inputTax").value);
  }

  // reclassificando risco conforme os valores dos dados objetivos. 
  const [pas, setpas] = useState(0);
  const checkPas = (value) => {
    if ((value < 90 && value !== '') && atendimentoclassificacao !== 1) {
      persistDadosClinicos();
      setatendimentoclassificacao(1);
    }
  }
  const [pad, setpad] = useState(0);
  const checkPad = (value) => {
    if ((value < 50 && value !== '') && atendimentoclassificacao !== 1) {
      persistDadosClinicos();
      setatendimentoclassificacao(1);
    }
  }
  const [fc, setfc] = useState(0);
  const checkFc = (value) => {
    if ((value < 50 || value > 130) && value !== '' && atendimentoclassificacao !== 1) {
      persistDadosClinicos();
      setatendimentoclassificacao(1);
    }
  }
  const [sao2, setsao2] = useState(0);
  const checkSao2 = (value) => {
    if ((value < 95 && value !== '') && (atendimentoclassificacao !== 1 || atendimentoclassificacao !== 2)) {
      persistDadosClinicos();
      setatendimentoclassificacao(2);
    } else if ((value < 90 && value !== '') && atendimentoclassificacao !== 1) {
      persistDadosClinicos();
      setatendimentoclassificacao(1);
    }
  }
  const [tax, settax] = useState(0);
  const checkTax = (value) => {
    if ((value < 35 || value > 39) && value !== '' && atendimentoclassificacao !== 1) {
      persistDadosClinicos();
      setatendimentoclassificacao(2);
    }
  }
  // exibição do componente classificador de risco.
  const [showclassificador, setshowclassificador] = useState(0);
  function ShowClassificador() {
    if (showclassificador === 1) {
      return (
        <div className="menucover" fade-in style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer" style={{ width: '60vw' }}>
            <div id="cabeçalho" className="cabecalho">
              <div className="title5">{'CLASSIFICAÇÃO DE RISCO'}</div>
              <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="green-button"
                  onClick={() => updateAtendimento()}
                  onMouseOver={() => { checkFc(); checkPas(); checkPad(); checkSao2(); checkTax() }}
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
                <button className="red-button" onClick={() => setshowclassificador(0)}>
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
            <div
              className="corpo"
            >
              <text className="title2" style={{ fontSize: 14, textAlign: 'center' }} >DESCREVA ABAIXO OS PRINCIPAIS SINAIS OU SINTOMAS APRESENTADOS PELO PACIENTE.</text>
              <input
                autoComplete="off"
                className="input"
                placeholder="BUSCAR SINAL OU SINTOMA..."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'BUSCAR SINAL OU SINTOMA...')}
                onClick={() => cleanFilter()}
                onChange={() => filterFluxo()}
                title="ESCREVA AQUI OS SINAIS OU SINTOMAS MAIS RELEVANTES APRESENTADOS PELO PACIENTE."
                style={{
                  width: '100%',
                  marginBottom: 20,
                }}
                type="text"
                maxLength={200}
                id="inputFluxo"
                defaultValue={descritor}
              ></input>
              <div className="scroll"
                id="LISTA DE DESCRITORES"
                style={{
                  display: viewfluxo === 1 ? 'flex' : 'none',
                  justifyContent: 'flex-start',
                  margin: 0,
                  marginTop: 5,
                  padding: 0,
                  paddingRight: 15,
                  height: 0.3 * window.innerHeight,
                  width: '100%'
                }}
              >
                <div style={{ width: '100%' }}>
                  {arrayfluxo.sort((a, b) => a.cor > b.cor ? 1 : -1 && a.fluxo > b.fluxo ? 1 : -1).map((item) => (
                    <button
                      className={item.cor === 1 ? "red-button" : item.cor === 2 ? "orange-button" : item.cor === 3 ? "yellow-button" : item.cor === 4 ? "green-button" : "blue-button"}
                      style={{
                        width: '100%',
                        padding: 10,
                        margin: 5,
                        marginBottom: 7.5
                      }}
                      onClick={() => selectFluxo(item)}
                    >
                      {item.fluxo}
                    </button>
                  ))}
                </div>
              </div>
              <div id="DADOS OBJETIVOS" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label
                    className="title2"
                  >
                    PAS:
                  </label>
                  <input
                    className="input"
                    autoComplete="off"
                    placeholder="PAS"
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'PAS')}
                    onChange={(e) => validatePas(e.target.value)}
                    onMouseLeave={(e) => checkPas(e.target.value)}
                    title="PRESSÃO ARTERIAL SISTÓLICA."
                    style={{
                      height: 50,
                      width: 100,
                    }}
                    id="inputPas"
                    defaultValue={pas}
                    disabled={atendimentoclassificacao === 0 ? true : false}
                    maxLength={3}
                  ></input>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label
                    className="title2"
                  >
                    PAD:
                  </label>
                  <input
                    className="input"
                    autoComplete="off"
                    placeholder="PAD"
                    title="PRESSÃO ARTERIAL DIASTÓLICA."
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'PAD')}
                    onChange={(e) => validatePad(e.target.value)}
                    onMouseLeave={(e) => checkPad(e.target.value)}
                    style={{
                      height: 50,
                      width: 100,
                    }}
                    id="inputPad"
                    defaultValue={pad}
                    disabled={atendimentoclassificacao === 0 ? true : false}
                    maxLength={3}
                  ></input>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label
                    className="title2"
                  >
                    FC:
                  </label>
                  <input
                    className="input"
                    autoComplete="off"
                    placeholder="FC"
                    title="FREQUÊNCIA CARDÍACA."
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'FC')}
                    onChange={(e) => validateFc(e.target.value)}
                    onMouseLeave={(e) => checkFc(e.target.value)}
                    style={{
                      height: 50,
                      width: 100,
                    }}
                    id="inputFc"
                    defaultValue={fc}
                    disabled={atendimentoclassificacao === 0 ? true : false}
                    maxLength={3}
                  ></input>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'SAO2')}
                    onChange={(e) => validateSao2(e.target.value)}
                    onMouseLeave={(e) => checkSao2(e.target.value)}
                    style={{
                      height: 50,
                      width: 100,
                    }}
                    id="inputSao2"
                    defaultValue={sao2}
                    disabled={atendimentoclassificacao === 0 ? true : false}
                    min={0}
                    max={100}
                  ></input>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'TAX')}
                    onChange={(e) => validateTax(e.target.value)}
                    onMouseLeave={(e) => checkTax(e.target.value)}
                    style={{
                      height: 50,
                      width: 100,
                    }}
                    id="inputTax"
                    defaultValue={tax}
                    disabled={atendimentoclassificacao === 0 ? true : false}
                    maxLength={4}
                  ></input>
                </div>
              </div>
              <button className="fade-in green-button"
                style={{
                  display: atendimentoclassificacao == 0 || atendimentoclassificacao == '' ? 'none' : 'flex',
                  padding: 10,
                  marginTop: 20,
                  backgroundColor: atendimentoclassificacao === 1 ? "#ec7063" : atendimentoclassificacao === 2 ? "#eb984e" : atendimentoclassificacao === 3 ? "#f5b041" : atendimentoclassificacao === 4 ? "#52be80" : "#1f7a8c"
                }}
              >
                {atendimentoclassificacao === 1 ? "EMERGÊNCIA" : atendimentoclassificacao === 2 ? "MUITA URGÊNCIA" : atendimentoclassificacao === 3 ? "URGÊNCIA" : atendimentoclassificacao === 4 ? "POUCA URGÊNCIA" : "NÃO URGẼNCIA"}
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
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
  return (
    <div
      className="main fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        overflowX: 'hidden',
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
      }}
    >
      <Header link={"/unidades"} titulo={'ACOLHIMENTO: ' + nomeunidade}></Header>
      <Toast valor={valor} cor={cor} mensagem={mensagem} tempo={tempo}></Toast>
      <ShowClassificador></ShowClassificador>
      <div
        style={{
          display: 'flex',
          flex: 10,
          flexDirection: 'column',
          width: window.innerWidth,
        }}>
        <ShowPacientes></ShowPacientes>
      </div>
    </div>
  );
}
export default Acolhimento;