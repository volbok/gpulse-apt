/* eslint eqeqeq: "off" */
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Toast from './Toast';
import Header from './Header';
import moment, { locale } from 'moment';
import 'moment/locale/pt-br';
import deletar from '../images/deletar.svg';
import editar from '../images/editar.svg';
import salvar from '../images/salvar.svg';
import novo from '../images/novo.svg';
import MaskedInput from 'react-maskedinput';
import {Link} from "react-router-dom";

function Bloco() {
  moment.locale('pt-br');
  var html = 'https://pulsarapp-server.herokuapp.com';
  // estados do usuário:
  const bloco = useSelector((state) => state.bloco);
  const idusuario = useSelector((state) => state.idusuario);
  const nomeusuario = useSelector((state) => state.nomeusuario);
  const funcao = useSelector((state) => state.funcao);
  const tipo = useSelector((state) => state.tipo);
  // estados referentes ao hospital e unidade:
  const idhospital = useSelector((state) => state.idhospital);
  const nomehospital = useSelector((state) => state.nomehospital);
  const idunidade = useSelector((state) => state.idunidade);
  const nomeunidade = useSelector((state) => state.nomeunidade);
  const tipounidade = useSelector((state) => state.tipounidade);

  // carregar registros de staff (integrantes da equipe cirúrgica).
  const [staff, setstaff] = useState([]);
  const loadStaff = () => {
    axios.get(html + "/blocostaff").then((response) => {
      setstaff(response.data);
    });
  }

  useEffect(() => {
    if (bloco === 1) {
      currentMonth();
      loadAgendaBloco();
      loadAtendimentos();
      loadPacientes();
      loadUsuarios();
      loadStaff();
    }
  }, [bloco])

  // lista de pacientes.
  const [listpacientes, setlistpacientes] = useState([]);
  const loadPacientes = () => {
    axios.get(html + "/pacientes").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistpacientes(x);
    });
  }

  // lista de atendimentos.
  const [listatendimentos, setlistatendimentos] = useState([]);
  const loadAtendimentos = () => {
    setlistatendimentos([0, 1]);
    axios.get(html + "/atendimentos").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistatendimentos(x.filter((item) => item.ativo !== 0 && item.hospital === nomehospital));
    });
  }

  // exibição da lista de staff.
  function ShowStaff() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <div
          className="scroll"
          id="LISTA DE STAFF"
          title="LISTA DE INTEGRANTES DA EQUIPE CIRÚRGICA"
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            margin: 0,
            marginTop: 5,
            marginBottom: 10,
            padding: 0,
            paddingRight: 5,
            height: 0.4 * window.innerHeight,
            width: '100%',
          }}
        >
          <div className="row"
            style={{
              margin: 5,
              marginTop: 2.5,
              marginBottom: 2.5,
              paddingLeft: 5,
              width: '100%',
            }}>
            <button className="blue-button" style={{ width: '100%' }}>
              {'CIRURGIÃO: ' + cirurgiao + ' - ' + especialidade}
            </button>
          </div>
          {staff.filter(item => item.idcirurgia == idcirurgia).map((item) => (
            <div
              key={item.id}
              id="prescrição"
              className="row"
              style={{
                display: item.status !== 2 ? 'flex' : 'none',
                margin: 5,
                marginTop: 2.5,
                marginBottom: 2.5,
                paddingLeft: 5,
                flexDirection: 'row',
                width: '100%'
              }}
            >
              <button className="blue-button" style={{ width: '100%' }}>{item.firstname + ' ' + item.lastname}</button>
              <button className="blue-button" style={{ width: 250 }}>{item.especialidade}</button>
              <button className="red-button"
                onClick={() => deleteStaff(item)}
                style={{ width: 50 }}>
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
            onClick={() => setviewusuarios(1)}
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
    );
  }

  // carregar registros de usuários (alimentará lista para seleção de integrantes da equipe cirúrgica).
  const [usuarios, setusuarios] = useState([]);
  const loadUsuarios = () => {
    axios.get(html + "/usuarios").then((response) => {
      setusuarios(response.data);
    });
  }

  const [viewlistpacientes, setviewlistpacientes] = useState(0);
  function ShowPacientesSelector() {
    return (
      <div
        className="scroll"
        id="LISTA DE PACIENTES"
        style={{
          display: viewlistpacientes === 1 ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          borderRadius: 5,
          margin: 5,
          height: 100,
          width: '100%',
          backgroundColor: '#ffffff',
          borderColor: '#ffffff'
        }}
      >
        {listatendimentos.sort(((a, b) => a.classificacao > b.classificacao ? 1 : -1)).map((item) => (
          <div
            key={item.id}
            className="row"
            onClick={() => selectPaciente(item)}
            style={{
              position: 'relative',
              margin: 0,
            }}
          >
            <button
              className={paciente == item.nome ? "red-button" : "blue-button"}
              title="BOX/LEITO."
              style={{ minWidth: 150, width: 150, margin: 2.5 }}
            >
              {item.unidade}
            </button>
            <button
              className={paciente == item.nome ? "red-button" : "blue-button"}
              title="BOX/LEITO."
              style={{ minWidth: 50, width: 50, margin: 2.5 }}
            >
              {item.box}
            </button>
            <button
              className={paciente == item.nome ? "red-button" : "blue-button"}
              style={{
                margin: 2.5,
                padding: 10,
                width: '100%',
              }}
            >
              {item.nome}
            </button>
            <button
              className={paciente == item.nome ? "red-button" : "blue-button"}
              style={{
                margin: 2.5,
                minWidth: window.innerWidth > 800 ? 100 : 50,
                width: window.innerWidth > 800 ? 100 : 50,
              }}
            >
              {moment().diff(moment(item.dn, 'DD/MM/YYYY'), 'years') + ' ANOS'}
            </button>
          </div>
        ))}
      </div>
    )
  }

  const [viewliststaff, setviewliststaff] = useState(0);
  function ShowStaffSelector() {
    return (
      <div
        className="scroll"
        id="LISTA DE USUÁRIOS"
        style={{
          display: viewliststaff === 1 ? 'flex' : 'none',
          justifyContent: 'flex-start',
          margin: 5,
          padding: 0,
          paddingRight: 5,
          height: 100,
          backgroundColor: '#ffffff',
          borderColor: '#ffffff',
          width: '100%',
        }}
      >
        {usuarios.filter(item => item.tipo < 5).map((item) => (
          <div
            key={item.id}
            id="prescrição"
            className="row"
            onClick={() => selectStaff(item)}
            style={{
              margin: 5,
              marginTop: 2.5,
              marginBottom: 2.5,
              flexDirection: 'row',
              paddingLeft: 5,
              // width: '100%',
            }}
          >
            <button className={item.id == idcirurgiao ? "red-button" : "blue-button"} style={{ width: '100%' }}>{item.firstname + ' ' + item.lastname}</button>
            <button className={item.id == idcirurgiao ? "red-button" : "blue-button"} style={{ width: 200 }}>{item.especialidade}</button>
          </div>
        ))}
      </div>
    );
  }

  // exibição da lista de usuários disponíveis para escalação da equipe cirúrgica.
  const [viewusuarios, setviewusuarios] = useState(0);
  function ShowUsuarios() {
    if (viewusuarios === 1) {
      return (
        <div className="menucover" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer">
            <label
              className="title2"
              style={{ marginTop: 0, marginBottom: 15 }}
            >
              SELECIONE UM PROFISSIONAL PARA COMPOR A EQUIPE CIRÚRGICA:
            </label>
            <div
              className="scroll"
              id="LISTA DE USUÁRIOS"
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                margin: 0,
                padding: 0,
                paddingRight: 5,
                height: 0.5 * window.innerHeight,
                width: 0.5 * window.innerWidth,
              }}
            >
              {usuarios.filter(item => item.tipo < 5).map((item) => (
                <div
                  key={item.id}
                  id="prescrição"
                  className="row"
                  style={{
                    margin: 5,
                    marginTop: 2.5,
                    marginBottom: 2.5,
                    flexDirection: 'row',
                    paddingLeft: 5,
                    // width: '100%',
                  }}
                  onClick={() => selectUsuario(item)}
                >
                  <button className="blue-button" style={{ width: '100%' }}>{item.firstname + ' ' + item.lastname}</button>
                  <button className="blue-button" style={{ width: 200 }}>{item.especialidade}</button>
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

  // salvando usuário selecionado na equipe cirúrgica.
  const selectUsuario = (item) => {
    var obj = {
      idusuario: item.id,
      idcirurgia: idcirurgia,
      firstname: item.firstname,
      lastname: item.lastname,
      especialidade: item.especialidade,
    };
    axios.post(html + '/insertblocostaff', obj).then(() => {
      loadStaff();
      setviewusuarios(0);
    });
  }

  // excluindo usuário da equipe cirúrgica.
  const deleteStaff = (item) => {
    axios.get(html + '/deleteblocostaff/' + item.id).then(() => {
      loadStaff();
    });
  }

  // carregando a lista de cirurgias.
  const [agendabloco, setagendabloco] = useState([]);
  const loadAgendaBloco = () => {
    axios.get(html + "/blocoagenda").then((response) => {
      setagendabloco(response.data);
    });
  }

  // lista de cirurgias agendadas.
  function ShowAgendaBloco() {
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
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <DatePicker></DatePicker>
          <div
            className="scroll"
            id="LISTA DE CIRURGIAS"
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              margin: 0,
              marginLeft: 10,
              padding: 0,
              height: '100%',
              width: '100%',
            }}
          >
            {agendabloco.filter(item => JSON.stringify(item.datainicio).substring(1, 9) == pickdate).map((item) => (
              <div
                className="row"
                style={{ marginBottom: 2.5 }}
                key={item.id}
                id="prescrição"
                onClick={() => selecionarCirurgia(item)}
              >
                <div className="blue-button" style={{ width: 50, padding: 5 }}>
                  {item.sala}
                </div>
                <div className="blue-button" style={{ width: 90, padding: 5 }}>
                  {item.datainicio}
                </div>
                <div className="blue-button" style={{ display: 'flex', flexDirection: 'column', width: 0.2 * window.innerWidth, padding: 5 }}>
                  <div>
                    {'DR(A). ' + item.cirurgiao}
                  </div>
                  <div style={{ marginTop: 5, fontSize: 12 }}>
                    {'PROCEDIMENTO:'}
                  </div>
                  <div style={{ fontSize: 12 }}>
                    {item.cirurgia}
                  </div>
                </div>
                <div className="blue-button" style={{ width: 0.2 * window.innerWidth, padding: 5 }}>
                  {item.paciente}
                </div>
                <div className="blue-button" style={{ width: 0.1 * window.innerWidth, padding: 5 }}>
                  {item.unidade}
                </div>
                <div className="blue-button" style={{ width: 50, padding: 5 }}>
                  {item.box}
                </div>
                <button className="red-button"
                  onClick={(e) => {
                    setmodaldeletecirurgia(1);
                    setidcirurgia(item.id);
                    e.stopPropagation();
                  }}
                  title="EXCLUIR CIRURGIA AGENDADA."
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
                <button className="yellow-button"
                  onClick={(e) => {
                    setsalvarcirurgia(2); // habilita a atualização do registro.
                    setviewnewcirurgia(1);
                    setidcirurgia(item.id);
                    setidatendimento(item.idatendimento);
                    setsala(item.sala);
                    setdatainicio(JSON.stringify(item.datainicio).substring(10, 15));
                    setdatatermino(JSON.stringify(item.datatermino).substring(10, 15));
                    setespecialidade(item.especialidade);
                    setcirurgiao(item.cirurgiao);
                    setfiltrastaff(item.cirurgiao);
                    setcirurgia(item.cirurgia);
                    setpaciente(item.paciente);
                    setfiltrapaciente(item.paciente);
                    setunidade(item.unidadeorigem);
                    setbox(item.box);
                    e.stopPropagation();
                  }}
                  title="EDITAR CIRURGIA AGENDADA."
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
              </div>
            ))}
            <button className="blue-button"
              onClick={() => {
                setviewnewcirurgia(1);
                setsalvarcirurgia(1); // habilita o salvamento do registro, na função "salvarCirurgia()".
                setsala('');
                setdatainicio('');
                setdatatermino('');
                setcirurgiao('');
                setcirurgia('');
                setpaciente('');
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
    );
  }

  // modal para confirmar a exclusão de uma cirurgia selecionada.
  const [modaldeletecirurgia, setmodaldeletecirurgia] = useState(0);
  function ModalDeleteCirurgia() {
    if (modaldeletecirurgia === 1) {
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
              {'CONFIRMAR EXCLUSÃO DA CIRURGIA?'}
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
                onClick={() => setmodaldeletecirurgia(0)}
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
                onClick={() => deleteCirurgia()}
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
  const deleteCirurgia = () => {
    axios.get(html + '/deleteblocoagenda/' + idcirurgia);
    setmodaldeletecirurgia(0);
    loadAgendaBloco();
  }

  // tela para agendar cirurgia.
  const [viewnewcirurgia, setviewnewcirurgia] = useState(0);
  function ShowNewCirurgia() {
    if (viewnewcirurgia == 1) {
      return (
        <div className="menucover" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer" style={{ width: 0.6 * window.innerWidth }}>
            <div className="title2" style={{ fontSize: 16 }}>{'AGENDAR CIRURGIA'}</div>
            <div className="scroll" style={{ justifyContent: 'flex-start', height: 355, paddingRight: 15, width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="title2">SALA:</div>
                    <input
                      className="blue-button"
                      autoComplete="off"
                      placeholder="SALA"
                      defaultValue={sala}
                      // value={sala}
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = '?')}
                      onKeyUp={() => setSala()}
                      //mask="11"
                      style={{
                        backgroundColor: '#e1e5f2',
                        color: '#1f7a8c',
                        width: 75,
                        marginTop: 5,
                        padding: 5,
                      }}
                      id="inputSala"
                      title="SALA CIRÚRGICA."
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="title2">INÍCIO:</div>
                    <input
                      className="blue-button"
                      autoComplete="off"
                      placeholder="INÍCIO"
                      defaultValue={datainicio}
                      // value={datainicio}
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = '?')}
                      onKeyUp={() => setInicio()}
                      //mask="11:11"
                      style={{
                        backgroundColor: '#e1e5f2',
                        color: '#1f7a8c',
                        width: 100,
                        marginTop: 5,
                      }}
                      id="inputInicio"
                      title="HORA DE INÍCIO."
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="title2">TÉRMINO:</div>
                    <input
                      className="blue-button"
                      autoComplete="off"
                      placeholder="TÉRMINO"
                      defaultValue={datatermino}
                      // value={datatermino}
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = '?')}
                      onKeyUp={() => setTermino()}
                      //mask="11:11"
                      style={{
                        backgroundColor: '#e1e5f2',
                        color: '#1f7a8c',
                        width: 100,
                        marginTop: 5,
                      }}
                      id="inputTermino"
                      title="HORA PREVISTA PARA TÉRMINO."
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="title2">PROCEDIMENTO:</div>
                  <input
                    className="input"
                    title="PROCEDIMENTO."
                    id="inputProcedimento"
                    type="text"
                    defaultValue={cirurgia}
                    maxLength="200"
                    autoComplete="off"
                    placeholder="PROCEDIMENTO"
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'PROCEDIMENTO')}
                    onKeyUp={() => setProcedimento()}
                    style={{
                      resize: 'none',
                      margin: 2.5,
                      width: window.innerWidth > 800 ? 500 : 135,
                    }}
                  ></input>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                <div className="title2">PACIENTE:</div>
                <input
                  className="input"
                  autoComplete="off"
                  placeholder="BUSCAR PACIENTE"
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'BUSCAR PACIENTE')}
                  onKeyUp={() => filterPaciente()}
                  defaultValue={paciente}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    height: 50,
                    width: window.innerWidth > 800 ? 500 : 50,
                    margin: 2.5,
                    padding: 0,
                    padding: 5,
                  }}
                  id="filterPaciente"
                  maxLength={100}
                  defaultValue={filtrapaciente}
                ></input>
                <ShowPacientesSelector></ShowPacientesSelector>
                <div className="title2">CIRURGIÃO RESPONSÁVEL:</div>
                <input
                  className="input"
                  autoComplete="off"
                  placeholder="BUSCAR CIRURGIÃO"
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'BUSCAR CIRURGIÃO')}
                  onKeyUp={() => filterStaff()}
                  defaultValue={filtrastaff}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    height: 50,
                    width: window.innerWidth > 800 ? 500 : 50,
                    margin: 2.5,
                    padding: 0,
                    padding: 5,
                  }}
                  id="filterStaff"
                  maxLength={100}
                  defaultValue={filtrastaff}
                ></input>
                <ShowStaffSelector></ShowStaffSelector>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', marginTop: 20 }}>
              <button className="green-button"
                onClick={() => salvarCirurgia()}
                title="AGENDAR CIRURGIA."
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
              <button className="red-button"
                onClick={() => setviewnewcirurgia(0)}
                title="CANCELAR AGENDAMENTO DE CIRURGIA."
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

  // gravando valores da nova cirurgia a ser agendada.
  const setSala = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setsala(document.getElementById("inputSala").value);
      document.getElementById("inputSala").focus();
    }, 500);
  }
  const setInicio = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setdatainicio(document.getElementById("inputInicio").value);
      document.getElementById("inputInicio").focus();
    }, 1000);
  }
  const setTermino = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setdatatermino(document.getElementById("inputTermino").value);
      document.getElementById("inputTermino").focus();
      var datainicio = pickdate + ' ' + document.getElementById("inputInicio").value;
      var datatermino = pickdate + ' ' + document.getElementById("inputTermino").value;
      var check = agendabloco.filter
        (item => item.sala == sala &&
          (
            (
              moment(JSON.stringify(item.datainicio).substring(1, 18).toString(), "DD/MM/YY HH:mm") < moment(datainicio, "DD/MM/YY HH:mm")
              &&
              moment(JSON.stringify(item.datatermino).substring(1, 18).toString(), "DD/MM/YY HH:mm") > moment(datainicio, "DD/MM/YY HH:mm")
            )
            ||
            (
              moment(JSON.stringify(item.datainicio).substring(1, 18).toString(), "DD/MM/YY HH:mm") < moment(datatermino, "DD/MM/YY HH:mm")
              &&
              moment(JSON.stringify(item.datatermino).substring(1, 18).toString(), "DD/MM/YY HH:mm") > moment(datatermino, "DD/MM/YY HH:mm")
            )
            ||
            (
              moment(JSON.stringify(item.datainicio).substring(1, 18).toString(), "DD/MM/YY HH:mm") > moment(datainicio, "DD/MM/YY HH:mm")
              &&
              moment(JSON.stringify(item.datatermino).substring(1, 18).toString(), "DD/MM/YY HH:mm") < moment(datatermino, "DD/MM/YY HH:mm")
            )
            ||
            item.datainicio == datainicio
            ||
            item.datatermino == datatermino
          )
        ).length;
      if (check == 0) {
      } else {
        if (salvarcirurgia === 1) {
          toast(1, '#ec7063', 'SALA OCUPADA PARA O HORÁRIO SOLICITADO. POR FAVOR SELECIONE OUTROS HORÁRIOS.', 3000);
          setdatainicio('');
          setdatatermino('');
          document.getElementById("inputInicio").value = '';
          document.getElementById("inputTermino").value = '';
          setTimeout(() => {
            document.getElementById("inputInicio").focus();
          }, 3100);
        }
      }
    }, 1000);
  }
  const setProcedimento = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setcirurgia(document.getElementById("inputProcedimento").value);
      document.getElementById("inputProcedimento").focus();
    }, 1000);
  }

  // filtrando pacientes em atendimento para agendamento de cirurgia.
  var timeout = null;
  const [filtrapaciente, setfiltrapaciente] = useState('');
  const [filtrastaff, setfiltrastaff] = useState('');
  var filtropaciente = '';
  var filtrostaff = '';
  const filterPaciente = () => {
    clearTimeout(timeout);
    document.getElementById("filterPaciente").focus();
    filtropaciente = document.getElementById("filterPaciente").value;
    timeout = setTimeout(() => {
      if (filtropaciente === '') {
        setviewlistpacientes(0);
        // setlistatendimentos([]);
        setfiltrapaciente('');
        document.getElementById("filterPaciente").value = '';
        document.getElementById("filterPaciente").focus();
      } else {
        setfiltrapaciente(filtropaciente.toUpperCase());
        axios.get(html + "/atendimentos").then((response) => {
          var x = [0, 1];
          x = response.data;
          setlistatendimentos(x.filter((item) => item.ativo !== 0 && item.hospital === nomehospital && item.nome.includes(filtropaciente) === true));
          setviewlistpacientes(1);
          document.getElementById("filterPaciente").focus();
        });
      }
    }, 3000);
  }

  // filtrando cirurgião responsável da lista de usuários para agendamento de cirurgia.
  const filterStaff = () => {
    clearTimeout(timeout);
    document.getElementById("filterStaff").focus();
    filtrostaff = document.getElementById("filterStaff").value;
    timeout = setTimeout(() => {
      if (filtrostaff === '') {
        setviewliststaff(0);
        // setusuarios([]);
        setfiltrastaff('');
        document.getElementById("filterStaff").value = '';
        document.getElementById("filterStaff").focus();
      } else {
        setfiltrastaff(filtrostaff.toUpperCase());
        axios.get(html + "/usuarios").then((response) => {
          var x = [0, 1];
          x = response.data;
          setusuarios(x.filter(item => item.firstname.includes(filtrostaff) === true));
          setviewliststaff(1);
          document.getElementById("filterStaff").focus();
        });
      }
    }, 3000);
  }

  // selecionando um paciente da lista de atendimentos.
  const selectPaciente = (item) => {
    setfiltrapaciente(item.nome);
    document.getElementById("filterPaciente").value = item.nome;
    setpaciente(item.nome);
    setunidade(item.unidade);
    setbox(item.box);
    setviewlistpacientes(0);
  }

  // selecionando um usuário para cirurgião responsável.
  const [idcirurgiao, setidcirurgiao] = useState(0);
  const [cirurgiaofirstname, setcirurgiaofirstname] = useState('');
  const [cirurgiaolastname, setcirurgiaolastname] = useState('');
  const [cirurgiaoespecialidade, setcirurgiaoespecialidade] = useState('');
  const selectStaff = (item) => {
    setfiltrastaff(item.firstname + ' ' + item.lastname);
    document.getElementById("filterStaff").value = item.firstname + ' ' + item.lastname;
    setidcirurgiao(item.id);
    setcirurgiaofirstname(item.firstname);
    setcirurgiaolastname(item.lastname);
    setcirurgiaoespecialidade(item.especialidade);
    setviewliststaff(0);
  }

  // salvando registro de cirurgia.
  const [salvarcirurgia, setsalvarcirurgia] = useState(0);
  const salvarCirurgia = () => {
    if (cirurgiao == '' || paciente == '' || sala == '' || datainicio == '' || datatermino == '') {
      toast(1, '#ec7063', 'CAMPOS OBRIGATÓRIOS EM BRANCO.', 3000);
    } else {
      var obj = {
        hospital: nomehospital,
        unidade: nomeunidade,
        idatendimento: idatendimento,
        sala: document.getElementById("inputSala").value,
        datainicio: pickdate + ' ' + document.getElementById("inputInicio").value,
        datatermino: pickdate + ' ' + document.getElementById("inputTermino").value,
        status: 0, // 0 = cirurgia não realizada. 1 = cirurgia realizada.
        especialidade: cirurgiaoespecialidade,
        cirurgiao: cirurgiaofirstname + ' ' + cirurgiaolastname,
        cirurgia: document.getElementById("inputProcedimento").value,
        tipo: '',
        paciente: paciente,
        unidadeorigem: unidade,
        box: box,
      }
      if (salvarcirurgia === 1) {
        axios.post(html + '/insertblocoagenda', obj).then(() => {
          setviewnewcirurgia(0);
          loadAgendaBloco();
          toast(1, '#52be80', 'CIRURGIA AGENDADA COM SUCESSO.', 3000);
        });
      } else {
        axios.post(html + '/updateblocoagenda/' + idcirurgia, obj).then(() => {
          setviewnewcirurgia(0);
          loadAgendaBloco();
          toast(1, '#52be80', 'CIRURGIA ATUALIZADA COM SUCESSO.', 3000);
        });
      }
    }
  }

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
  }
  // selecionando uma data no datepicker.
  const selectDate = (date) => {
    setpickdate(date);
    loadAgendaBloco();
  }
  const [pickdate, setpickdate] = useState('');
  // renderização do datepicker.
  function DatePicker() {
    return (
      <div
        className="secondary"
        style={{
          backgroundColor: '#ffffff',
          margin: 5,
          padding: 5,
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
              className="blue-button"
              onClick={() => selectDate(item)}
              style={{
                width: 50,
                height: 50,
                margin: 2.5,
                color: '#ffffff',
                backgroundColor: item === pickdate ? '#ec7063' : agendabloco.filter(value => JSON.stringify(value.datainicio).substring(1, 9) == item).length > 0 ? '#52be80' : '#1f7a8c',
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

  // abrindo a tela de informações sobre a cirurgia, checklists e folha de sala.
  const [abrircirurgia, setabrircirurgia] = useState(0);
  // dados gerais do procedimento cirúrgico.
  const [idcirurgia, setidcirurgia] = useState(0);
  const [idatendimento, setidatendimento] = useState(0);
  const [dn, setdn] = useState(0); // data de nascimento do paciente.
  const [paciente, setpaciente] = useState(0);
  const [unidade, setunidade] = useState(0);
  const [box, setbox] = useState(0);
  const [sala, setsala] = useState(0);
  const [peso, setpeso] = useState(0);
  const [alergias, setalergias] = useState(0);
  const [datainicio, setdatainicio] = useState(0);
  const [datatermino, setdatatermino] = useState(0);
  const [especialidade, setespecialidade] = useState(0);
  const [cirurgiao, setcirurgiao] = useState(0);
  const [cirurgia, setcirurgia] = useState(0);
  const [tipocirurgia, settipocirurgia] = useState(0); // limpa, potencialmente contaminada, contaminada ou infectada.
  // equipamentos necessários.
  const [carrinhoanestesia, setcarrinhoanestesia] = useState(0);
  const [intensificador, setintensificador] = useState(0);
  const [cec, setcec] = useState(0);
  const [vlc, setvlc] = useState(0);

  // checklist antes da indução anestésica.
  // identificação e pré-requisitos básicos.
  const [confirmaidpcte, setconfirmaidpcte] = useState(0); // paciente confirma verbalmente sua identificação?
  const [checkpulseira, setcheckpulseira] = useState(0); // identificação na pulseira correta?
  const [precaucao, setprecaucao] = useState(0); // precauções de contato, aerossol, etc.
  const [termocirurgico, settermocirurgico] = useState(0);
  const [termoanestesico, settermoanestesico] = useState(0); // o mesmo que apa.
  const [termohemotransfusao, settermohemotransfusao] = useState(0);
  const [examessangue, setexamessangue] = useState(0); // exames de sangue disponíveis?
  const [examesimagem, setexamesimagem] = useState(0); // exames de imagem disponíveis?
  const [alergia, setalergia] = useState(''); // descritivo.
  // preparo da sala, dos equipamentos e materiais necessários.
  const [temperatura, settemperatura] = useState(''); // temperatura da sala cirúrgica (informar valor).
  const [mesacirurgica, setmesacirurgica] = useState(0); // mesa cirúrgica montada.
  const [foco, setfoco] = useState(0);
  const [ambu, setambu] = useState(0);
  const [aspirador, setaspirador] = useState(0);
  const [cauterio, setcauterio] = useState(0);
  const [laringoscopio, setlaringoscopio] = useState(0);
  const [tot, settot] = useState(0); // demais materiais para intubação (tubo, seringa, fixação, bigode)?
  const [kitvadificil, setkitvadificil] = useState(0); // kit para via aérea difícil?
  // medicações e fluidos.
  const [drogas, setdrogas] = useState(0); // medicações a serem administradas checadas pelo anestesista?
  const [seringas, setseringas] = useState(0); // seringas identificadas?
  const [atbprofilatico, setatbprofilatico] = useState(''); // realizado atb profilático 5-50min antes da incisão cirúrgica (inserir hora)?
  const [reservasangue, setreservasangue] = useState(0) // reserva de sangue disponível?
  const [planejamentofluidos, setplanejamentofluidos] = useState(0) // planejamento para fluidos.
  // preparo do paciente.
  const [admissao, setadmissao] = useState(''); // hora de admissão do paciente no bloco cirúrgico.
  const [jejum, setjejum] = useState(''); // hora do jejum.
  const [banho, setbanho] = useState(''); // hora do banho.
  const [tricotomia, settricotomia] = useState(0);
  const [adornos, setadornos] = useState(0);
  const [protesedentaria, setprotesedentaria] = useState(0);
  const [oximetro, setoximetro] = useState(0); // oxímetro de pulso colocado no paciente e funcionando?
  const [monitor, setmonitor] = useState(0); // monitor cardíaco colocado no paciente e funcionando?
  const [pni, setpni] = useState(0); // manguito para pni bem posicionado e funcionando?
  const [acessocentral, setacessocentral] = useState(0);
  const [eletrocauterio, seteletrocauterio] = useState(0);
  // dados vitais.
  const [tax, settax] = useState(0);
  const [pas, setpas] = useState(0);
  const [pad, setpad] = useState(0);
  const [fc, setfc] = useState(0);
  const [fr, setfr] = useState(0);
  const [sao2, setsao2] = useState(0);
  const [glicemia, setglicemia] = useState(0);
  const [oxigenoterapia, setoxigenoterapia] = useState(0);
  // avaliação de riscos e medidas de segurança.
  const [vadificil, setvadificil] = useState(0); // via aérea difícil?
  const [riscoaspira, setriscoaspira] = useState(0); // risco de aspiração?
  const [riscosangramento, setriscosangramento] = useState(0) // risco de perda sanguínea > 500ml (ou > 7ml/kl para crianças).
  const [anticoagulacao, setanticoagulacao] = useState(0) // uso de anticoagulante?
  const [vagacti, setvagacti] = useState(0); // vaga em cti confirmada?
  const [sitiocirurgico, setsitiocirurgico] = useState(''); // sítio cirúrgico demarcado (risco de incisão em local errado)?
  const [lateralidade, setlateralidade] = useState(0); // sítio cirúrgico demarcado (risco de amputação de membro errado)?
  // observações.
  const [observacoes, setobservacoes] = useState('');

  // checklist antes da síntese cirúrgica.
  const [agulhasinicio, setagulhasinicio] = useState(0); // agulhas abertas antes do procedimento.
  const [agulhastermino, setagulhastermino] = useState(0); // agulhas antes da síntese cirúrgica.
  const [instrumentaisinicio, setinstrumentaisinicio] = useState(0); // instrumentais abertos antes do procedimento.
  const [instrumentaistermino, setinstrumentaistermino] = useState(0); // instrumentais antes da síntese cirúrgica.
  const [compressasinicio, setcompressasinicio] = useState(0); // instrumentais abertos antes do procedimento.
  const [compressastermino, setcompressastermino] = useState(0); // compressas antes da síntese cirúrgica.

  // seleção de uma cirurgia na agenda cirúrgica.
  const selecionarCirurgia = (item) => {
    setidcirurgia(item.id);
    setidatendimento(item.idatendimento);
    setsala(item.sala);
    setdatainicio(item.datainicio);
    setdatatermino(item.datatermino);
    setespecialidade(item.especialidade);
    setcirurgiao(item.cirurgiao);
    setcirurgia(item.cirurgia);
    settipocirurgia(item.tipo);
    setpaciente(item.paciente);
    setunidade(item.unidade);
    setbox(item.box);
    setcarrinhoanestesia(item.anestesia);
    setintensificador(item.intensificador);
    setcec(item.cec);
    setvlc(item.vlc);
    loadStaff();
    setabrircirurgia(1);
  }

  // tela cirurgia.
  function TelaCirurgia() {
    if (abrircirurgia === 1) {
      return (
        <div className="menucover" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer">
            <div className="title2" style={{ fontSize: 16, marginBottom: 20 }}>DADOS DO PROCEDIMENTO CIRÚRGICO</div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <button className="red-button" style={{ width: 100, height: 100, padding: 5, fontSize: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div>SALA</div>
                    <div>{sala}</div>
                  </div>
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div className="title2" style={{ fontSize: 14 }}>INÍCIO:</div>
                <button className="blue-button" style={{ width: 100, padding: 5, height: '100%' }}>
                  {datainicio}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div className="title2" style={{ fontSize: 14 }}>TÉRMINO:</div>
                <button className="blue-button" style={{ width: 100, padding: 5, height: '100%' }}>
                  {datatermino}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div className="title2" style={{ fontSize: 14 }}>PROCEDIMENTO:</div>
                <button className="blue-button" style={{ width: 250, padding: 5, height: '100%' }}>
                  {cirurgia}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div className="title2" style={{ fontSize: 14 }}>PACIENTE:</div>
                <button className="blue-button" style={{ width: 250, padding: 5, height: '100%' }}>
                  {paciente}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div className="title2" style={{ fontSize: 14 }}>ORIGEM:</div>
                <button className="yellow-button" style={{ width: 150, padding: 5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div>{unidade}</div>
                  <div>{'BOX ' + box}</div>
                </button>
              </div>
            </div>
            <div className="title2" style={{ fontSize: 14, marginTop: 10 }}>EQUIPE CIRÚRGICA:</div>
            <ShowStaff></ShowStaff>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
              <button className="red-button"
                onClick={() => setabrircirurgia(0)}
                style={{}}
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
              <button className="green-button" style={{ width: 150, padding: 5 }} onClick={() => setchecklist(1)}>{'JORNADA CIRÚRGICA'}</button>
            </div>
          </div>
        </div >
      );
    } else {
      return null;
    }
  }

  // JORNADA CIRÚRGICA //

  const insertChecklist = () => {
    var obj = {
      idcirurgia: idcirurgia,
      idatendimento: idatendimento,
      paciente: paciente,
      unidade: unidade,
      box: box,
      sala: sala,
      datainicio: datainicio,
      pulseira: checkpulseira,
      lateralidade: lateralidade,
      termocirurgico: termocirurgico,
      termoanestesico: termoanestesico,
      examessangue: examessangue,
      reservasangue: reservasangue,
    };
    axios.post(html + '/insertblocochecklist', obj).then(() => {
      toast(1, '#52be80', 'CHECKLIST DA CIRURGIA SEGURA REGISTRADO COM SUCESSO.', 3000);
    });
  }

  const [checklist, setchecklist] = useState(0);
  const [tela, settela] = useState(1);
  function ShowChecklist() {
    if (checklist === 1) {
      return (
        <div className="menucover" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer" style={{ width: 0.8 * window.innerWidth, height: 0.9 * window.innerHeight }}>
            <button className="grey-button" style={{ position: 'relative', height: 5, minHeight: 5, width: '100%', marginTop: 30, marginBottom: 50 }}>
              <button className="green-button" style={{ position: 'absolute', top: 0, left: 0, height: 5, minHeight: 5, width: '10%', margin: 0 }}></button>
              <button className="grey-button" style={{ position: 'absolute', top: -25, left: '10%', height: 50, width: 50, borderRadius: 50, borderColor: '#ffffff', borderStyle: 'solid', borderWidth: 3 }}>1</button>
              <button className="grey-button" style={{ position: 'absolute', top: -25, left: '35%', height: 50, width: 50, borderRadius: 50, borderColor: '#ffffff', borderStyle: 'solid', borderWidth: 3 }}>2</button>
              <button className="grey-button" style={{ position: 'absolute', top: -25, right: '35%', height: 50, width: 50, borderRadius: 50, borderColor: '#ffffff', borderStyle: 'solid', borderWidth: 3 }}>3</button>
              <button className="grey-button" style={{ position: 'absolute', top: -25, right: '10%', height: 50, width: 50, borderRadius: 50, borderColor: '#ffffff', borderStyle: 'solid', borderWidth: 3 }}>4</button>
            </button>
            <div id="TELA 01" className="scroll" style={{ width: '100%', height: '100%', display: tela == 1 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <div className="title2" style={{ fontSize: 16 }}>PREPARO DA SALA CIRÚRGICA</div>
              <div className="title2" style={{ fontSize: 14 }}>TEMPERATURA DA SALA (°C):</div>
              <input
                className="input"
                autoComplete="off"
                placeholder="?"
                title="TEMPERATURA DA SALA (°C)."
                defaultValue={temperatura}
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = '?')}
                onChange={(e) => validateTemperatura(e.target.value)}
                style={{
                  height: 50,
                  width: 75,
                  margin: 0,
                  padding: 0,
                }}
                id="inputTemperatura"
                maxLength={4}
              ></input>
              <div className="title2" style={{ fontSize: 14 }}>CHECKLIST DE EQUIPAMENTOS E MATERIAIS:</div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button onClick={carrinhoanestesia === 0 ? () => setcarrinhoanestesia(1) : () => setcarrinhoanestesia(0)} className={carrinhoanestesia == 1 ? "green-button" : "blue-button"} style={{ width: 175, height: 80, padding: 10 }}>
                  {'CARRINHO DE ANESTESIA'}
                </button>
                <button onClick={intensificador === 0 ? () => setintensificador(1) : () => setintensificador(0)} className={intensificador == 1 ? "green-button" : "blue-button"} style={{ width: 175, height: 80, padding: 5 }}>
                  {'INTENSIFICADOR DE IMAGEM'}
                </button>
                <button onClick={cec === 0 ? () => setcec(1) : () => setcec(0)} className={cec == 1 ? "green-button" : "blue-button"} style={{ width: 175, height: 80, padding: 5 }}>
                  {'CIRCULAÇÃO EXTRACORPÓREA'}
                </button>
                <button onClick={vlc === 0 ? () => setvlc(1) : () => setvlc(0)} className={vlc == 1 ? "green-button" : "blue-button"} style={{ width: 175, height: 80, padding: 5 }}>
                  {'APARELHO DE VIDEOLAPAROSCOPIA'}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button onClick={mesacirurgica === 0 ? () => setmesacirurgica(1) : () => setmesacirurgica(0)} className={mesacirurgica == 1 ? "green-button" : "blue-button"} style={{ width: 175, height: 80, padding: 10 }}>
                  {'MESA CIRÚRGICA'}
                </button>
                <button onClick={foco === 0 ? () => setfoco(1) : () => setfoco(0)} className={foco == 1 ? "green-button" : "blue-button"} style={{ width: 175, height: 80, padding: 10 }}>
                  {'FOCO'}
                </button>
                <button onClick={ambu === 0 ? () => setambu(1) : () => setambu(0)} className={ambu == 1 ? "green-button" : "blue-button"} style={{ width: 175, height: 80, padding: 10 }}>
                  {'AMBU'}
                </button>
                <button onClick={aspirador === 0 ? () => setaspirador(1) : () => setaspirador(0)} className={aspirador == 1 ? "green-button" : "blue-button"} style={{ width: 175, height: 80, padding: 10 }}>
                  {'ASPIRADOR'}
                </button>
              </div>
              <div onClick={eletrocauterio === 0 ? () => seteletrocauterio(1) : () => seteletrocauterio(0)} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button onClick={eletrocauterio === 0 ? () => seteletrocauterio(1) : () => seteletrocauterio(0)} className={cauterio == 1 ? "green-button" : "blue-button"} style={{ width: 175, height: 80, padding: 10 }}>
                  {'ELETROCAUTÉRIO'}
                </button>
                <button onClick={laringoscopio === 0 ? () => setlaringoscopio(1) : () => setlaringoscopio(0)} className={laringoscopio == 1 ? "green-button" : "blue-button"} style={{ width: 175, height: 80, padding: 10 }}>
                  {'LARINGOSCÓPIO'}
                </button>
                <button onClick={tot === 0 ? () => settot(1) : () => settot(0)} className={tot == 1 ? "green-button" : "blue-button"} style={{ width: 175, height: 80, padding: 10 }}>
                  {'TUBO OROTRAQUEAL, FIXAÇÃO E SERINGA'}
                </button>
                <button onClick={kitvadificil === 0 ? () => setkitvadificil(1) : () => setkitvadificil(0)} className={laringoscopio == 1 ? "green-button" : "blue-button"} style={{ width: 175, height: 80, padding: 10 }}>
                  {'KIT VIA AÉREA DIFÍCIL'}
                </button>
              </div>
            </div>
            <div id="TELA 02" className="scroll" style={{ width: '100%', height: '100%', display: tela == 2 ? 'flex' : 'none' }}>
              <div className="title2" style={{ fontSize: 16 }}>PREPARO DO PACIENTE</div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className={oximetro == 1 ? "green-button" : "blue-button"} style={{ width: 200 }}>
                  {'OXIMETRIA DE PULSO'}
                </button>
                <button className={monitor == 1 ? "green-button" : "blue-button"} style={{ width: 200 }}>
                  {'MONITOR CARDÍACO'}
                </button>
                <button className={pni == 1 ? "green-button" : "blue-button"} style={{ width: 200 }}>
                  {'PNI'}
                </button>
                <button className={acessocentral == 1 ? "green-button" : "blue-button"} style={{ width: 200 }}>
                  {acessocentral == 1 ? 'ACESSO VENOSO CENTRAL' : 'ACESSO VENOSO PERIFÉRICO'}
                </button>
                <button className={eletrocauterio == 1 ? "green-button" : "blue-button"} style={{ width: 200 }}>
                  {'ELETROCAUTÉRIO'}
                </button>
              </div>
            </div>
            <div id="TELA 03" className="scroll" style={{ width: '100%', height: '100%', display: tela == 3 ? 'flex' : 'none' }}>
              <div className="title2" style={{ fontSize: 14 }}>PREPARO DAS MEDICAÇÕES E FLUIDOS:</div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className={drogas == 1 ? "green-button" : "blue-button"} style={{ width: 200 }}>
                  {'DROGAS ANESTÉSICAS'}
                </button>
                <button className={seringas == 1 ? "green-button" : "blue-button"} style={{ width: 200 }}>
                  {'SERINGAS IDENTIFICADAS'}
                </button>
                <button title="ATB PROFILÁTICO REALIZADO 5-50 MIN. ANTES DA INDUÇÃO ANESTÉSICA." className={atbprofilatico == 1 ? "green-button" : "blue-button"} style={{ width: 200 }}>
                  {'ANTIBIÓTICO PROFILÁTICO'}
                </button>
                <button className={reservasangue == 1 ? "green-button" : "blue-button"} style={{ width: 200 }}>
                  {'RESERVA DE HEMODERIVADOS'}
                </button>
                <button className={planejamentofluidos == 1 ? "green-button" : "blue-button"} style={{ width: 200 }}>
                  {'PLANEJAMENTO DE FLUIDOS'}
                </button>
              </div>
            </div>
            <div id="TELA 04" className="scroll" style={{ width: '100%', height: '100%', display: tela == 4 ? 'flex' : 'none' }}>
              <div className="title2" style={{ fontSize: 14 }}>RISCOS E MEDIDAS DE SEGURANÇA:</div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className={vadificil == 1 ? "red-button" : "blue-button"} style={{ width: 200 }}>
                  {'VIA AÉREA DIFÍCIL'}
                </button>
                <button className={riscoaspira == 1 ? "red-button" : "blue-button"} style={{ width: 200 }}>
                  {'RISCO DE ASPIRAÇÃO'}
                </button>
                <button className={riscosangramento == 1 ? "red-button" : "blue-button"} style={{ width: 200 }}>
                  {'RISCO DE SANGRAMENTO'}
                </button>
                <button className={vagacti == 1 ? "green-button" : "blue-button"} style={{ width: 200 }}>
                  {'VAGA EM CTI RESERVADA'}
                </button>
                <button className={sitiocirurgico == 1 ? "red-button" : "blue-button"} style={{ width: 200 }}>
                  {'SÍTIO CIRÚRGICO DEMARCADO'}
                </button>
                <button className={lateralidade != 0 ? "blue-button" : "red-button"} style={{ width: 200 }}>
                  {lateralidade == 0 ? 'NÃO' : lateralidade == 1 ? 'DIREITA' : 'ESQUERDA'}
                </button>
              </div>
            </div>
            <div id="TELA 05" className="scroll" style={{ width: '100%', height: '100%', display: tela == 5 ? 'flex' : 'none' }}>
              <div className="title2" style={{ fontSize: 14 }}>REVISÃO ANTES DA SÍNTESE CIRÚRGICA:</div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }} style={{ width: 200 }}>
                <input
                  className="input"
                  autoComplete="off"
                  placeholder="?"
                  title="NÚMERO DE AGULHAS ABERTAS."
                  defaultValue={temperatura}
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = '?')}
                  onChange={(e) => validateNumber(e.target.value)}
                  style={{
                    height: 50,
                    width: 100,
                    margin: 0,
                    padding: 0,
                  }}
                  id="inputAgulhas1"
                  maxLength={3}
                ></input>
                <input
                  className="input"
                  autoComplete="off"
                  placeholder="?"
                  title="NÚMERO DE AGULHAS ANTES DA SÍNTESE."
                  defaultValue={temperatura}
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = '?')}
                  onChange={(e) => validateNumber(e.target.value)}
                  style={{
                    height: 50,
                    width: 100,
                    margin: 0,
                    padding: 0,
                  }}
                  id="inputAgulhas2"
                  maxLength={3}
                ></input>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <input
                  className="input"
                  autoComplete="off"
                  placeholder="?"
                  title="NÚMERO DE INSTRUMENTAIS ABERTOS."
                  defaultValue={temperatura}
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = '?')}
                  onChange={(e) => validateNumber(e.target.value)}
                  style={{
                    height: 50,
                    width: 100,
                    margin: 0,
                    padding: 0,
                  }}
                  id="inputIntrumentais1"
                  maxLength={3}
                ></input>
                <input
                  className="input"
                  autoComplete="off"
                  placeholder="?"
                  title="NÚMERO DE INSTRUMENTAIS ANTES DA SÍNTESE."
                  defaultValue={temperatura}
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = '?')}
                  onChange={(e) => validateNumber(e.target.value)}
                  style={{
                    height: 50,
                    width: 100,
                    margin: 0,
                    padding: 0,
                  }}
                  id="inputInstrumentais2"
                  maxLength={3}
                ></input>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <input
                  className="input"
                  autoComplete="off"
                  placeholder="?"
                  title="NÚMERO DE COMPRESSAS ABERTAS."
                  defaultValue={temperatura}
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = '?')}
                  onChange={(e) => validateNumber(e.target.value)}
                  style={{
                    height: 50,
                    width: 100,
                    margin: 0,
                    padding: 0,
                  }}
                  id="inputCompressas1"
                  maxLength={3}
                ></input>
                <input
                  className="input"
                  autoComplete="off"
                  placeholder="?"
                  title="NÚMERO DE COMPRESSAS ANTES DA SÍNTESE."
                  defaultValue={temperatura}
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = '?')}
                  onChange={(e) => validateNumber(e.target.value)}
                  style={{
                    height: 50,
                    width: 100,
                    margin: 0,
                    padding: 0,
                  }}
                  id="inputCompressas2"
                  maxLength={3}
                ></input>
              </div>
              <textarea
                autoComplete="off"
                className="textarea"
                placeholder="OBSERVAÇÕES."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'EVOLUÇÃO.')}
                title="OBSERVAÇÕES."
                style={{
                  width: 500,
                  height: 250,
                }}
                type="text"
                maxLength={200}
                id="inputEvolucao"
              ></textarea>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button"
                // onClick={() => salvarCirurgia()}
                title={"DELETAR"}
                style={{ marginTop: 25 }}
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
              <button className="green-button"
                // onClick={() => salvarCirurgia()}
                title={"SALVAR"}
                style={{ marginTop: 25 }}
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
      )
    } else {
      return null;
    }
  }

  // validação de campos (inputs).
  const validateTemperatura = (txt) => {
    var number = /[0-9]/;
    var dot = /[.]/;
    var last = txt.slice(-1);
    if (last.match(number) !== null || last.match(dot) !== null) {
    } else {
      document.getElementById('inputTemperatura').value = '';
    }
  };
  const validateNumber = (txt) => {
    var number = /[0-9]/;
    var last = txt.slice(-1);
    if (last.match(number) !== null) {
    } else {
      document.getElementById('inputTemperatura').value = '';
    }
  };

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
  if (bloco === 1) {
    return (
      <div
        className="main fade-in"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          overflowX: 'hidden',
          width: '100%',
          margin: 0,
          padding: 0,
        }}
      >
        <Header link={"/pages/unidades"} titulo={'BLOCO CIRÚRGICO: ' + nomeunidade}></Header>
        <ShowAgendaBloco></ShowAgendaBloco>
        <ShowNewCirurgia></ShowNewCirurgia>
        <ModalDeleteCirurgia></ModalDeleteCirurgia>
        <TelaCirurgia></TelaCirurgia>
        <ShowChecklist></ShowChecklist>
        <ShowUsuarios></ShowUsuarios>
        <Toast valor={valor} cor={cor} mensagem={mensagem} tempo={tempo} />
      </div>
    );
  } else {
    return null;
  }
}

export default Bloco;