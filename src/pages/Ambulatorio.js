/* eslint eqeqeq: "off" */
import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Toast from '../components/Toast';
import Header from '../components/Header';
import moment, { locale } from 'moment';
import 'moment/locale/pt-br';
import deletar from '../images/deletar.svg';
import editar from '../images/editar.svg';
import salvar from '../images/salvar.svg';
import novo from '../images/novo.svg';
import MaskedInput from 'react-maskedinput';
import { useHistory } from "react-router-dom";
import Context from '../Context';
import DatePickerPopUp from '../components/DatePicker'

function Ambulatorio() {
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
  // history (react-router-dom).
  let history = useHistory()

  // carregando registros de pacientes.
  const [pacientes, setpacientes] = useState([]);
  const [arraypacientes, setarraypacientes] = useState([]);
  const loadPacientes = () => {
    axios.get(html + "/pacientes").then((response) => {
      setpacientes(response.data);
      setarraypacientes(response.data);
    });
  }

  // carregando registros de médicos.
  const [medicos, setmedicos] = useState([]);
  const [arraymedicos, setarraymedicos] = useState([]);
  const loadMedicos = () => {
    axios.get(html + "/usuarios").then((response) => {
      var x = [0, 1];
      x = response.data;
      setmedicos(x.filter(item => item.tipo < 3));
      setarraymedicos(x.filter(item => item.tipo < 3));
    });
  }

  // carregando registros de atendimentos.
  const [atendimentos, setatendimentos] = useState([]);
  const loadAtendimentos = () => {
    axios.get(html + "/atendimentos").then((response) => {
      var x = [0, 1];
      x = response.data;
      setatendimentos(x.filter((item) => item.ativo !== 0 && item.hospital === nomehospital));
    });
  }

  const [animations, setanimations] = useState(0);
  useEffect(() => {
    if (tipounidade == 4) {
      currentMonth();
      loadPacientes();
      loadMedicos();
      loadAtendimentos();
    }
  }, [tipounidade])

  const [viewlistpacientes, setviewlistpacientes] = useState(0);
  function ShowPacientesSelector() {
    return (
      <div
        className="menucover"
        onClick={() => setviewlistpacientes(0)}
        style={{ zIndex: 9, display: viewlistpacientes == 1 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer" style={{ padding: 10 }} onClick={(e) => e.stopPropagation()}>
          <input
            className="input"
            autoComplete="off"
            placeholder="BUSCAR PACIENTE"
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'BUSCAR PACIENTE')}
            onKeyUp={(e) => filterPaciente()}
            defaultValue={filtrapaciente}
            style={{
              width: '100%',
              marginBottom: 20,
            }}
            id="filterPaciente"
            maxLength={100}
            defaultValue={filtrapaciente}
          ></input>
          <div
            className="scroll"
            id="LISTA DE PACIENTES"
            style={{
              height: '50vh',
              width: '40vw',
            }}
          >
            {arraypacientes.sort(((a, b) => a.nome > b.nome ? 1 : -1)).map((item) => (
              <div
                key={item.id}
                className="row" style={{ width: '100%' }}
                onClick={(e) => { selectPaciente(item); e.stopPropagation() }}>
                <button
                  className="hover-button"
                  title="NOME."
                  style={{ minWidth: 150, width: '100%', margin: 2.5 }}
                >
                  {item.nome}
                </button>
                <button
                  className="rowitem"
                  title="DATA DE NASCIMENTO."
                  style={{ minWidth: 50, width: 100, margin: 2.5 }}
                >
                  {item.dn}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const [viewlistmedicos, setviewlistmedicos] = useState(0);
  function ShowMedicosSelector() {
    return (
      <div
        className="menucover"
        onClick={(e) => { setviewlistmedicos(0); e.stopPropagation() }}
        style={{ zIndex: 9, display: viewlistmedicos == 1 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer" style={{ padding: 10 }} onClick={(e) => e.stopPropagation()}>
          <input
            className="input"
            autoComplete="off"
            placeholder="BUSCAR MÉDICO"
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'BUSCAR MÉDICO')}
            onKeyUp={() => filterMedico()}
            defaultValue={filtramedico}
            style={{
              width: '100%',
              marginBottom: 20,
            }}
            id="filterMedico"
            maxLength={100}
            defaultValue={filtramedico}
          ></input>
          <div
            className="scroll"
            id="LISTA DE MÉDICOS"
            style={{
              height: '50vh',
              width: '70vw',
            }}
          >
            {arraymedicos.sort(((a, b) => a.nome > b.nome ? 1 : -1)).map((item) => (
              <div
                key={item.id}
                className="row"
                onClick={(e) => { selectMedico(item); e.stopPropagation() }}
                style={{
                  position: 'relative',
                }}
              >
                <button
                  className="hover-button"
                  title="NOME."
                  style={{ width: '100%' }}
                >
                  {item.nome}
                </button>
                <div
                  className="rowitem"
                  title="CONSELHO."
                  style={{ display: window.innerWidth > 800 ? 'flex' : 'none', minWidth: '15vw', width: '15vw', margin: 2.5 }}
                >
                  {item.conselho}
                </div>
                <div
                  className="rowitem"
                  title="ESPECIALIDADE."
                  style={{ width: window.innerWidth > 800 ? 300 : 150, margin: 2.5 }}
                >
                  {item.especialidade}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const selecionarConsulta = (item) => {
    setidpaciente(item.idpaciente)
    setidatendimento(item.id)
    history.push('/prontuario')
  };

  // cabeçalho para lista de consultas agendadas.
  function CabecalhoListaDeConsultas() {
    return (
      <div className="rowheader" style={{ marginBottom: 0, paddingBottom: -10, paddingLeft: 20, paddingRight: 40, opacity: 0.3, fontSize: 12 }}>
        <div className="rowitem" style={{ width: '50%' }}>
          NOME DO PACIENTE
        </div>
        <div className="rowitem" style={{ width: '20%' }}>
          DATA E HORA
        </div>
        <div className="rowitem" style={{ width: '30%' }}>
          PROFISSIONAL
        </div>
      </div>
    )
  }

  // lista de consultas agendadas.
  function ShowAgendaAmbulatorio() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          margin: 0,
          padding: 5,
          paddingTop: 0,
          paddingBottom: 0,
        }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', height: '100%', verticalAlign: 'center' }}>
          <DatePicker></DatePicker>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', width: '100%' }}>
            <CabecalhoListaDeConsultas></CabecalhoListaDeConsultas>
            <div
              className="scroll"
              id="LISTA DE CONSULTAS"
              style={{
                height: 0.85 * window.innerHeight - 60, paddingTop: 0,
              }}
            >
              {atendimentos.filter(item => JSON.stringify(item.admissao).substring(1, 11) == pickdate1).map((item) => (
                <div
                  className="row" style={{ minHeight: 65 }}
                >
                  <div
                    style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}
                    key={item.id}
                    id="lista de consultas ambulatoriais"
                    onClick={() => selecionarConsulta(item)}
                  >
                    <div className="rowitem" style={{ width: '50%' }}>
                      {item.nome}
                    </div>
                    <div className="rowitem" style={{ width: '20%' }}>
                      {item.admissao}
                    </div>
                    <div className="rowitem" style={{ width: '30%' }}>
                      {'DR(A). ' + item.assistente}
                    </div>
                  </div>
                  <button id="editar" className="animated-yellow-button"
                    onClick={(e) => {
                      setviewconsulta(2); // editar consulta.
                      setidatendimento(item.id);
                      setpickdate1(JSON.stringify(item.admissao).substring(1, 11));
                      setadmissao(item.admissao);
                      setmedico(item.assistente);
                      setfiltramedico(item.assistente);
                      setnomepaciente(item.nome);
                      setfiltrapaciente(item.nome);
                      e.stopPropagation();
                    }}
                    title="EDITAR CONSULTA AGENDADA."
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
                    onClick={(e) => {
                      setmodaldeleteconsulta(1);
                      setidatendimento(item.id);
                      e.stopPropagation();
                    }}
                    title="EXCLUIR CONSULTA AGENDADA."
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
              <button className="blue-button"
                onClick={() => {
                  setviewconsulta(1); // salvar consulta.
                  setmedico('');
                  setnomepaciente('');
                  setpickdate1(moment().format('DD/MM/YYYY'));
                }}
                style={{
                  width: 50,
                  height: 50,
                  marginRight: 7.5,
                  marginTop: 5,
                  alignSelf: 'flex-end',
                }}
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
      </div>
    );
  }

  // modal para confirmar a exclusão de uma consulta agendada.
  const [modaldeleteconsulta, setmodaldeleteconsulta] = useState(0);
  function ModalDeleteConsulta() {
    if (modaldeleteconsulta === 1) {
      return (
        <div
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
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9,
          }}>
          <div
            style={{
              position: 'absolute',
              padding: 25,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              borderRadius: 5,
            }}>
            <div
              className="secondary"
              style={{
                alignItems: 'center',
                textAlign: 'center',
                width: 400,
                color: '#1f7a8c',
                fontWeight: 'bold',
              }}>
              {'CONFIRMAR CANCELAMENTO DA CONSULTA?'}
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              margins: 10,
            }}>
              <button
                className="red-button"
                onClick={() => setmodaldeleteconsulta(0)}
                style={{
                  marginTop: 15,
                  width: 130,
                  padding: 10,
                }}
              >
                CANCELAR
              </button>
              <button
                className="green-button"
                onClick={() => deleteConsulta()}
                style={{
                  marginTop: 15,
                  width: 130,
                  padding: 10,
                }}
              >
                CONFIRMAR
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  // função para excluir o registro de cirurgia agendada no banco de dados.
  const deleteConsulta = () => {
    axios.get(html + '/deleteatendimento/' + idatendimento).then(() => {
      setmodaldeleteconsulta(0);
      loadAtendimentos();
    });
  }

  // filtrando pacientes e médicos para agendamento de consulta ambulatorial.
  var timeout = null;
  const [filtrapaciente, setfiltrapaciente] = useState('');
  var filtropaciente = '';
  const filterPaciente = () => {
    clearTimeout(timeout);
    document.getElementById("filterPaciente").focus();
    filtropaciente = document.getElementById("filterPaciente").value;
    timeout = setTimeout(() => {
      if (filtropaciente == '') {
        setarraypacientes(pacientes);
        document.getElementById("filterPaciente").value = '';
        document.getElementById("filterPaciente").focus();
      } else {
        setfiltrapaciente(document.getElementById("filterPaciente").value.toUpperCase());
        setarraypacientes(pacientes.filter((item) => item.nome.includes(filtropaciente) === true));
        document.getElementById("filterPaciente").value = filtropaciente;
        document.getElementById("filterPaciente").focus();
      }
    }, 500);
  }
  // filtrando médico.
  const [filtramedico, setfiltramedico] = useState('');
  var filtromedico = '';
  const filterMedico = () => {
    clearTimeout(timeout);
    document.getElementById("filterMedico").focus();
    filtromedico = document.getElementById("filterMedico").value;
    timeout = setTimeout(() => {
      if (filtromedico == '') {
        setarraymedicos(medicos);
        document.getElementById("filterMedico").value = '';
        document.getElementById("filterMedico").focus();
      } else {
        setfiltramedico(document.getElementById("filterMedico").value.toUpperCase());
        setarraymedicos(medicos.filter((item) => item.nome.includes(filtromedico) === true));
        document.getElementById("filterMedico").value = filtromedico;
        document.getElementById("filterMedico").focus();
      }
    }, 500);
  }

  // selecionando um paciente da lista de atendimentos.
  const selectPaciente = (item) => {
    setidpaciente(item.id);
    setfiltrapaciente(item.nome);
    document.getElementById("filterPaciente").value = item.nome;
    setnomepaciente(item.nome);
    setviewlistpacientes(0);
  }

  // selecionando um médico da lista de médicos.
  const selectMedico = (item) => {
    setfiltramedico(item.nome);
    document.getElementById("filterMedico").value = item.nome;
    setmedico(item.nome);
    setviewlistmedicos(0);
  }

  // DATEPICKER.
  // preparando a array com as datas.
  var arraydate = [];
  const [arraylist, setarraylist] = useState([]);
  // preparando o primeiro dia do mês.
  var month = moment().format('MM');
  var year = moment().format('YYYY');
  const [startdate] = useState(moment('01/' + month + '/' + year, 'DD/MM/YYYY'));
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
    arraydate = [x.format('DD/MM/YYYY')];
    while (y.diff(x, 'days') > 1) {
      x.add(1, 'day');
      arraydate.push(x.format('DD/MM/YYYY').toString());
    }
  }
  // criando a array de datas baseada no mês atual.
  const currentMonth = () => {
    var month = moment(startdate).format('MM');
    var year = moment(startdate).format('YYYY');
    var x = moment('01/' + month + '/' + year, 'DD/MM/YYYY');
    var y = moment('01/' + month + '/' + year, 'DD/MM/YYYY').add(42, 'days');
    firstSunday(x, y);
    setArrayDate(x, y);
    setarraylist(arraydate);
  }
  // percorrendo datas do mês anterior.
  const previousMonth = () => {
    startdate.subtract(30, 'days');
    var month = moment(startdate).format('MM');
    var year = moment(startdate).format('YYYY');
    var x = moment('01/' + month + '/' + year, 'DD/MM/YYYY');
    var y = moment('01/' + month + '/' + year, 'DD/MM/YYYY').add(42, 'days');
    firstSunday(x, y);
    setArrayDate(x, y);
    setarraylist(arraydate);
  }
  // percorrendo datas do mês seguinte.
  const nextMonth = () => {
    startdate.add(30, 'days');
    var month = moment(startdate).format('MM');
    var year = moment(startdate).format('YYYY');
    var x = moment('01/' + month + '/' + year, 'DD/MM/YYYY');
    var y = moment('01/' + month + '/' + year, 'DD/MM/YYYY').add(42, 'days');
    firstSunday(x, y);
    setArrayDate(x, y);
    setarraylist(arraydate);
  }
  // selecionando uma data no datepicker.
  const selectDate = (date) => {
    setpickdate1(date);
    loadAtendimentos();
  }
  const [pickdate, setpickdate] = useState('');
  // renderização do datepicker.
  function DatePicker() {
    return (
      <div
        className="secondary"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          zIndex: 1,
          margin: window.innerWidth < 800 ? 5 : 0,
          padding: 15,
          width: window.innerWidth > 800 ? '' : 0.95 * window.innerWidth,
          height: '100%',
        }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          width: '395',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 5,
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
          width: window.innerWidth > 800 ? 395 : 0.95 * window.innerWidth,
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
            width: window.innerWidth > 800 ? 395 : 0.95 * window.innerWidth,
            height: window.innerWidth > 800 ? 340 : '',
            boxShadow: 'none'
          }}
        >
          {arraylist.map((item) => (
            <button
              className={item == pickdate1 ? 'red-button' : atendimentos.filter(value => JSON.stringify(value.admissao).substring(1, 11) == item).length > 0 ? 'green-button' : 'blue-button'}
              onClick={() => selectDate(item)}
              style={{
                width: window.innerWidth > 800 ? 50 : 44,
                minWidth: window.innerWidth > 800 ? 50 : 44,
                height: 50,
                margin: 2.5,
                color: '#ffffff',
                // backgroundColor: item == pickdate ? '#ec7063' : atendimentos.filter(value => JSON.stringify(value.admissao).substring(1, 11) == item).length > 0 ? '#52be80' : '#8f9bbc',
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

  // abrindo a tela para agendamento de consulta.
  const [viewconsulta, setviewconsulta] = useState(0);
  // dados do paciente e médico selecionados para o atendimento ambulatorial.
  const [sala, setsala] = useState(0);
  const [admissao, setadmissao] = useState(0);
  const [medico, setmedico] = useState(0);
  const [especialidade, setespecialidade] = useState(0);

  const salvarConsulta = () => {
    var obj = {
      idpaciente: idpaciente,
      hospital: nomehospital,
      unidade: nomeunidade,
      box: '',
      admissao: pickdate1 + ' ' + document.getElementById("inputHora").value,
      nome: nomepaciente,
      dn: dn,
      peso: '',
      altura: '',
      antecedentes: '',
      alergias: '',
      medicacoes: '',
      exames: '',
      historia: '',
      status: 4, // cadastrado por padrão como indefinido.
      ativo: 1,
      classificacao: '',
      descritor: '',
      precaucao: 0,
      assistente: medico,
    };
    if (viewconsulta == 1) {
      axios.post(html + '/insertatendimento', obj).then(() => {
        setviewconsulta(0);
        toast(1, '#52be80', 'CONSULTA AGENDADA COM SUCESSO', 4000);
        loadAtendimentos();
      });
    } else {
      axios.post(html + "/updateatendimento/'" + idatendimento + "'", obj).then(() => {
        setviewconsulta(0);
        toast(1, '#52be80', 'CONSULTA ATUALIZADA COM SUCESSO', 4000);
        loadAtendimentos();
      });
    }
  }

  // tela para salvar ou editar agendamento de consulta ambulatorial.
  function TelaConsulta() {
    if (viewconsulta != 0) {
      return (
        <div className="menucover" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer">
            <div id="cabeçalho" className="cabecalho">
              <div className="title5">{'AGENDAMENTO DE CONSULTA AMBULATORIAL'}</div>
              <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="red-button" onClick={() => setviewconsulta(0)}>
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
                  onClick={() => salvarConsulta()}
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
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <div className="title2" style={{ fontSize: 14 }}>DATA:</div>
                  <button
                    onClick={() => showDatePicker(1, 1)}
                    className="blue-button" style={{ width: 100 }}>
                    {pickdate1}
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}>
                  <div className="title2" style={{ fontSize: 14 }}>HORA:</div>
                  <MaskedInput
                    id="inputHora"
                    title="HORA DA CONSULTA."
                    placeholder="HORA"
                    autoComplete="off"
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'HORA')}
                    value={viewconsulta == 2 ? JSON.stringify(admissao).substring(12, 17) : ''}
                    className="input"
                    style={{
                      width: 100,
                      height: 50,
                      margin: 2.5,
                      alignSelf: 'center',
                    }}
                    mask="11:11"
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: window.innerWidth > 800 ? 'row' : 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <div className="title2" style={{ fontSize: 14 }}>PACIENTE:</div>
                  <button
                    className="blue-button" style={{ width: '30vw', padding: 10 }}
                    onClick={() => {
                      setnomepaciente('');
                      setfiltrapaciente('');
                      setarraypacientes(pacientes);
                      setviewlistpacientes(1);
                      document.getElementById("filterPaciente").value = '';
                    }}
                  >
                    {nomepaciente}
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}>
                  <div className="title2" style={{ fontSize: 14 }}>MÉDICO:</div>
                  <button
                    className="blue-button" style={{ width: '30vw', padding: 10 }}
                    onClick={() => {
                      setmedico('');
                      setfiltramedico('');
                      setarraymedicos(medicos);
                      setviewlistmedicos(1);
                      document.getElementById("filterMedico").value = '';
                    }}
                  >
                    {medico}
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

  const validateNumber = (txt) => {
    var number = /[0-9]/;
    var last = txt.slice(-1);
    if (last.match(number) !== null) {
    } else {
      document.getElementById('inputTemperatura').value = '';
    }
  };

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
    }, time);
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
        width: window.innerWidth,
        margin: 0,
        padding: 0,
        height: window.innerHeight,
        maxHeight: window.innerHeight,
      }}
    >
      <Header link={"/unidades"} titulo={'AMBULATORIO: ' + nomeunidade}></Header>
      <ShowAgendaAmbulatorio></ShowAgendaAmbulatorio>
      <TelaConsulta></TelaConsulta>
      <DatePickerPopUp valordatepicker={valordatepicker} mododatepicker={mododatepicker} />
      <ShowPacientesSelector></ShowPacientesSelector>
      <ShowMedicosSelector></ShowMedicosSelector>
      <ModalDeleteConsulta></ModalDeleteConsulta>
      <Toast valor={valor} cor={cor} mensagem={mensagem} tempo={tempo} />
    </div>
  );
}

export default Ambulatorio;