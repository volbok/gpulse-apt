/* eslint eqeqeq: "off" */
import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import MaskedInput from 'react-maskedinput';
import deletar from '../images/deletar.svg';
import editar from '../images/editar.svg';
import salvar from '../images/salvar.svg';
import novo from '../images/novo.svg';
import logo from '../images/logo.png';
import moment, { locale } from 'moment';
import 'moment/locale/pt-br';
import Toast from './Toast';
import Header from './Header';
import {Link} from "react-router-dom";

function Usuarios() {
  moment.locale('pt-br');
  var html = 'https://pulsarapp-server.herokuapp.com';
  // var html = '//localhost:3001';
  var quotes = "'";

  const changeState = useDispatch();

  const idusuario = useSelector((state) => state.idusuario);
  const usuario = useSelector((state) => state.nomeusuario);
  const tipo = useSelector((state) => state.tipo);
  const hospital = useSelector((state) => state.nomehospital);
  const unidade = useSelector((state) => state.nomeunidade);

  const viewUsuarios = useSelector((state) => state.usuarios);

  useEffect(() => {
    if (viewUsuarios === 1) {
      // carregando a lista de plantonistas.
      loadPlantonistas();
      // preparando array inicial para o datepicker.
      currentMonth();
      // carregando a lista de todos os hospitais cadastrados para a emrpesa.
      loadAllHospitais();
      // oculltando as listas de unidades e ctis até que o usuário seja selecionado.
      setviewhospitais(false);
      setviewunidades(false);
    }
    // eslint-disable-next-line
  }, [viewUsuarios]);

  // COLUNA PLANTONISTAS
  // carregamento da lista de plantonistas disponíveis pela empresa.
  const [plantonistas, setplantonistas] = useState([]);
  const loadPlantonistas = () => {
    axios.get(html + '/usuarios').then((response) => {
      setplantonistas(response.data);
    });
  }
  // função que captura o id do plantonista selecionado na lista de plantonistas.
  const [plantonista, setplantonista] = useState('');
  const [nomeplantonista, setnomeplantonista] = useState('SELECIONE DA LISTA');
  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [type, settype] = useState(1);
  const [dn, setdn] = useState('');
  const [cpf, setcpf] = useState('');
  const [registro, setregistro] = useState('');
  const [especialidade, setespecialidade] = useState('');
  const [telefone, settelefone] = useState('');
  const [email, setemail] = useState('');
  const selectPlantonista = (item) => {
    setplantonista(item.id);
    setnomeplantonista(item.nome);
    setfirstname(item.firstname);
    setlastname(item.lastname);
    settype(item.tipo);
    setdn(item.dn);
    setcpf(item.cpf);
    setregistro(item.conselho);
    setespecialidade(item.especialidade);
    settelefone(item.telefone);
    setemail(item.email);
    loadHospitais(item.id);
    loadUnidades(0);
    setselectedhospital('');
    setselectedunidade('');
    // habilitando o botão "novo" da lista de hospitais após a seleção do plantonista.
    setviewhospitais(true);
    // desabilitando o botão "novo" da lista de unidades após a seleção do plantonista.
    setviewunidades(false);
    // habilitando o card com dados do plantonista.
    setviewcardplantonista(1);
  };

  // exibindo o card do plantonista selecionado.
  const [viewcardplantonista, setviewcardplantonista] = useState(0);
  function CardPlantonista() {
    if (viewcardplantonista === 1) {
      return (
        <div className="widget" style={{ height: 150, flexDirection: 'column' }}>
          <div className="title2" style={{ fontSize: 14, color: '#ffffff' }}>{'PLANTONISTA: ' + nomeplantonista}</div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <div className="title2" style={{ fontSize: 14, color: '#ffffff' }}>{registro ? 'REGISTRO: ' + registro : 'REGISTRO: NÃO INFORMADO'}</div>
            <div className="title2" style={{ fontSize: 14, color: '#ffffff' }}>{' - '}</div>
            <div className="title2" style={{ fontSize: 14, color: '#ffffff' }}>{especialidade ? 'ESPECIALIDADE: ' + especialidade : 'ESPECIALIDADE: NÃO INFORMADA'}</div>
          </div>
          <div className="title2" style={{ fontSize: 14, color: '#ffffff' }}>{telefone ? 'TELEFONE: ' + telefone.substring(0, 4) + ' ' + telefone.substring(5) : 'TELEFONE: NÃO INFORMADO'}</div>
          <div className="title2" style={{ fontSize: 14, color: '#ffffff' }}>{email ? 'E-MAIL: ' + email : 'E-MAIL: NÃO INFORMADO'}</div>
        </div>
      )
    } else {
      return <div className="widget" style={{ height: 150, flexDirection: 'column' }}>
        <div className="title2" style={{ fontSize: 14, color: '#ffffff' }}>{'SELECIONE UM PLANTONISTA DA LISTA PARA VISUALIZAR SEUS DADOS.'}</div>
      </div>;
    }
  }
  // renderização da lista de plantonistas.
  function ShowPlantonistas() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <p className="title2" style={{ fontSize: 18, width: '100%', marginTop: 5, padding: 0 }}>
          PLANTONISTAS
      </p>
        <div
          className="scroll"
          id="LISTA DE PLANTONISTAS"
          style={{
            display: 'flex',
            flex: 2,
            justifyContent: 'flex-start',
            borderRadius: 5,
            margin: 5,
            minHeight: window.innerHeight - 250,
            height: window.innerHeight - 250,
            maxHeight: window.innerHeight - 250,
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
                  width: '100%',
                  margin: 2.5,
                  color: '#ffffff',
                  backgroundColor:
                    item.id === plantonista ? '#ec7063' : '#1f7a8c',
                }}
                onClick={() => selectPlantonista(item)}
              >
                {item.nome}
              </button>
              <button className="yellow-button"
                onClick={() => clickUpdateUsuario(item)}
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
              <button className="red-button"
                onClick={() => clickDeleteUsuario(item)}>
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
            </p>
          ))}
          <NovoUsuarioBtn></NovoUsuarioBtn>
        </div>
      </div>
    );
  }
  // botão para inserir plantonista.
  function NovoUsuarioBtn() {
    return (
      <div
        className="secondary"
        style={{
          display: 'flex',
          flexDirection: 'row',
          margin: 2.5,
          padding: 0,
          paddingRight: 7.5,
          justifyContent: 'flex-end',
          width: '100%'
        }}
      >
        <button
          className="blue-button"
          onClick={() => setviewinsertusuario(1)}
          title="ADICIONAR PLANTONISTA À EMPRESA."
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
      </div>
    );
  }
  // tela para inserir novo plantonista.
  const [viewinsertusuario, setviewinsertusuario] = useState(0);
  function NovoUsuarioView() {
    setNome('');
    setSobrenome('');
    //document.getElementById("inputNome").value = '';
    //document.getElementById("inputSobrenome").value = '';
    if (viewinsertusuario === 1) {
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
            <label className="title2" style={{ marginTop: 0, marginBottom: 15 }}>
              INSERIR PLANTONISTA
          </label>
            <div
              className="scrollview"
              style={{
                justifyContent: 'flex-start',
                backgroundColor: '#F1F3F9',
                borderColor: '#F1F3F9',
                height: 350,
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              <p className="title2" style={{ fontSize: 14 }}>PRIMEIRO NOME:</p>
              <input
                className="input"
                autoComplete="off"
                placeholder="NOME."
                title="NOME."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'NOME.')}
                style={{
                  marginBottom: 0,
                  width: 300,
                }}
                type="text"
                id="inputNome"
                defaultValue={nome}
                maxLength={30}
              ></input>
              <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>ÚLTIMO SOBRENOME:</p>
              <input
                className="input"
                autoComplete="off"
                placeholder="SOBRENOME."
                title="SOBRENOME."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'SOBRENOME.')}
                style={{
                  marginBottom: 0,
                  width: 300,
                }}
                type="text"
                id="inputSobrenome"
                defaultValue={sobrenome}
                maxLength={30}
              ></input>
              <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>DATA DE NASCIMENTO:</p>
              <MaskedInput
                id="inputDn"
                title="DATA DE NASCIMENTO."
                placeholder="DN."
                autoComplete="off"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'DN.')}
                className="input"
                defaultValue={dn}
                style={{
                  margin: 5,
                  width: 200,
                  height: 50,
                  alignSelf: 'center',
                }}
                mask="11/11/1111"
              />
              <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>CPF:</p>
              <MaskedInput
                id="inputCPF"
                title="CPF."
                placeholder="CPF."
                autoComplete="off"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'CPF.')}
                className="input"
                style={{
                  margin: 5,
                  width: 200,
                  height: 50,
                  alignSelf: 'center',
                }}
                mask="111.111.111-11"
              />
              <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>REGISTRO NO CONSELHO:</p>
              <input
                className="input"
                autoComplete="off"
                placeholder="REGISTRO."
                title="REGISTRO."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'REGISTRO.')}
                style={{
                  marginBottom: 0,
                  width: 300,
                }}
                type="text"
                id="inputConselho"
                maxLength={15}
              ></input>
              <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>ESPECIALIDADE:</p>
              <input
                className="input"
                autoComplete="off"
                placeholder="ESPECIALIDADE."
                title="ESPECIALIDADE."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'ESPECIALIDADE.')}
                style={{
                  marginBottom: 0,
                  width: 300,
                }}
                type="text"
                id="inputEspecialidade"
                maxLength={30}
              ></input>
              <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>TELEFONE:</p>
              <MaskedInput
                id="inputTelefone"
                title="TELEFONE."
                placeholder="TELEFONE."
                autoComplete="off"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'TELEFONE.')}
                className="input"
                style={{
                  margin: 5,
                  width: 200,
                  height: 50,
                  alignSelf: 'center',
                }}
                mask="(11)11111-1111"
              />
              <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>E-MAIL:</p>
              <input
                className="input"
                autoComplete="off"
                placeholder="E-MAIL."
                title="E-MAIL."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'E-MAIL.')}
                style={{
                  marginBottom: 0,
                  width: 300,
                  textTransform: 'none',
                }}
                type="text"
                id="inputEmail"
                maxLength={100}
              ></input>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 25,
                marginBottom: 0,
              }}
            >
              <button className="red-button"
                onClick={() => setviewinsertusuario(0)}>
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
              <button className="green-button" onClick={() => insertUsuario()}>
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
  // salvando um usuário.
  const insertUsuario = () => {
    var nome = document.getElementById('inputNome').value.toUpperCase();
    var sobrenome = document.getElementById('inputSobrenome').value.toUpperCase();
    var dn = document.getElementById('inputDn').value;
    var cpf = document.getElementById('inputCPF').value;
    var conselho = document.getElementById('inputConselho').value.toUpperCase();
    var especialidade = document.getElementById('inputEspecialidade').value.toUpperCase();
    var telefone = document.getElementById('inputTelefone').value;
    var email = document.getElementById('inputEmail').value;
    var check = [0, 1];
    // verificando se o usuário já está cadastrado.
    axios.get(html + "/checkplantonista/'" + nome + '.' + sobrenome + "'").then((response) => {
      check = response.data;
      console.log('CHECANDO USUÁRIO: ' + check.length)
    });
    setTimeout(() => {
      if (nome !== '' && sobrenome !== '' && check.length === 0) {
        var obj = {
          usuario: nome.toUpperCase() + '.' + sobrenome.toUpperCase(),
          senha: nome.toUpperCase() + '.' + sobrenome.toUpperCase(),
          nome: nome.toUpperCase() + ' ' + sobrenome.toUpperCase(),
          firstname: nome,
          lastname: sobrenome,
          tipo: type,
          dn: dn,
          cpf: cpf,
          conselho: conselho,
          especialidade: especialidade,
          telefone: telefone,
          email: email,
        };
        axios.post(html + '/insertusuario', obj);
        setviewinsertusuario(0);
        toast(1, '#52be80', 'MÉDICO CADASTRADO COM SUCESSO.', 6000);
        setTimeout(() => {
          loadPlantonistas();
        }, 1000);
      } else if (check.length !== 0) {
        toast(1, '#ec7063', 'MÉDICO JÁ CADASTRADO.', 6000);
      } else {
        toast(1, '#ec7063', 'CAMPOS EM BRANCO.', 6000);
      }
    }, 1500);
  };

  // atualizando um usuário.
  const clickUpdateUsuario = (item) => {
    setplantonista(item.id);
    setnomeplantonista(item.nome);
    setfirstname(item.firstname);
    setlastname(item.lastname);
    settype(item.tipo);
    setdn(item.dn);
    setcpf(item.cpf);
    setregistro(item.conselho);
    setespecialidade(item.especialidade);
    settelefone(item.telefone);
    setemail(item.email);
    setviewupdateusuario(1);
    // mecanismo para alimentar os maskedinputs na tela editar plantonista.
    setTimeout(() => {
      document.getElementById("inputDn").value = item.dn;
      document.getElementById("inputCPF").value = item.cpf;
      document.getElementById("inputTelefone").value = item.telefone;
    }, 1000);
  }
  const updateUsuario = () => {
    var nome = document.getElementById('inputNome').value.toUpperCase();
    var sobrenome = document.getElementById('inputSobrenome').value.toUpperCase();
    var dn = document.getElementById('inputDn').value;
    var cpf = document.getElementById('inputCPF').value;
    var conselho = document.getElementById('inputConselho').value.toUpperCase();
    var especialidade = document.getElementById('inputEspecialidade').value.toUpperCase();
    var telefone = document.getElementById('inputTelefone').value;
    var email = document.getElementById('inputEmail').value;
    var check = [0, 1];
    setTimeout(() => {
      if (nome !== '' && sobrenome !== '') {
        var obj = {
          id: plantonista,
          usuario: nome.toUpperCase() + '.' + sobrenome.toUpperCase(),
          senha: nome.toUpperCase() + '.' + sobrenome.toUpperCase(),
          nome: nome.toUpperCase() + ' ' + sobrenome.toUpperCase(),
          firstname: nome,
          lastname: sobrenome,
          tipo: type,
          dn: dn,
          cpf: cpf,
          conselho: conselho,
          especialidade: especialidade,
          telefone: telefone,
          email: email,
        };
        axios.post(html + '/updateusuario/' + plantonista, obj);
        setviewupdateusuario(0);
        toast(1, '#52be80', 'MÉDICO ATUALIZADO COM SUCESSO.', 6000);
        setTimeout(() => {
          loadPlantonistas();
          setplantonista(plantonista);
          setnomeplantonista(nome.toUpperCase() + ' ' + sobrenome.toUpperCase(),);
          setregistro(conselho);
          setespecialidade(especialidade);
          settelefone(telefone);
          setemail(email);
          setviewupdateusuario(0);
        }, 1000);
      } else if (check.length !== 0) {
        toast(1, '#ec7063', 'MÉDICO JÁ CADASTRADO.', 6000);
      } else {
        toast(1, '#ec7063', 'CAMPOS EM BRANCO.', 6000);
      }
    }, 1500);
  };
  // tela para atualizar um plantonista já cadastrado.
  const [viewupdateusuario, setviewupdateusuario] = useState(0);
  function UpdateUsuarioView() {
    if (viewupdateusuario === 1) {
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
            <label className="title2" style={{ marginTop: 0, marginBottom: 15 }}>
              ATUALIZAR PLANTONISTA
          </label>
            <div
              className="scrollview"
              style={{
                justifyContent: 'flex-start',
                backgroundColor: '#F1F3F9',
                borderColor: '#F1F3F9',
                height: 350,
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              <p className="title2" style={{ fontSize: 14 }}>PRIMEIRO NOME:</p>
              <input
                className="input"
                autoComplete="off"
                placeholder="NOME."
                title="NOME."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'NOME.')}
                style={{
                  marginBottom: 0,
                  width: 300,
                }}
                type="text"
                id="inputNome"
                defaultValue={firstname}
                maxLength={30}
              ></input>
              <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>ÚLTIMO SOBRENOME:</p>
              <input
                className="input"
                autoComplete="off"
                placeholder="SOBRENOME."
                title="SOBRENOME."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'SOBRENOME.')}
                style={{
                  marginBottom: 0,
                  width: 300,
                }}
                type="text"
                id="inputSobrenome"
                defaultValue={lastname}
                maxLength={30}
              ></input>
              <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>DATA DE NASCIMENTO:</p>
              <MaskedInput
                id="inputDn"
                title="DATA DE NASCIMENTO."
                placeholder="DN."
                autoComplete="off"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'DN.')}
                className="input"
                defaultValue={dn}
                style={{
                  margin: 5,
                  width: 200,
                  height: 50,
                  alignSelf: 'center',
                }}
                mask="11/11/1111"
              />
              <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>CPF:</p>
              <MaskedInput
                id="inputCPF"
                title="CPF."
                placeholder="CPF."
                autoComplete="off"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'CPF.')}
                className="input"
                defaultValue={cpf}
                style={{
                  margin: 5,
                  width: 200,
                  height: 50,
                  alignSelf: 'center',
                }}
                mask="111.111.111-11"
              />
              <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>REGISTRO NO CONSELHO:</p>
              <input
                className="input"
                autoComplete="off"
                placeholder="REGISTRO."
                title="REGISTRO."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'REGISTRO.')}
                defaultValue={registro}
                style={{
                  marginBottom: 0,
                  width: 300,
                }}
                type="text"
                id="inputConselho"
                maxLength={15}
              ></input>
              <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>ESPECIALIDADE:</p>
              <input
                className="input"
                autoComplete="off"
                placeholder="ESPECIALIDADE."
                title="ESPECIALIDADE."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'ESPECIALIDADE.')}
                defaultValue={especialidade}
                style={{
                  marginBottom: 0,
                  width: 300,
                }}
                type="text"
                id="inputEspecialidade"
                maxLength={30}
              ></input>
              <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>TELEFONE:</p>
              <MaskedInput
                id="inputTelefone"
                title="TELEFONE."
                placeholder="TELEFONE."
                autoComplete="off"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'TELEFONE.')}
                className="input"
                defaultValue={telefone}
                style={{
                  margin: 5,
                  width: 200,
                  height: 50,
                  alignSelf: 'center',
                }}
                mask="(11)11111-1111"
              />
              <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>E-MAIL:</p>
              <input
                className="input"
                autoComplete="off"
                placeholder="E-MAIL."
                title="E-MAIL."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'E-MAIL.')}
                defaultValue={email}
                style={{
                  marginBottom: 0,
                  width: 300,
                  textTransform: 'none',
                }}
                type="text"
                id="inputEmail"
                maxLength={100}
              ></input>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 25,
                marginBottom: 0,
              }}
            >
              <button className="red-button"
                onClick={() => setviewupdateusuario(0)}>
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
                onClick={() => updateUsuario()}
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

  // deletando um usuário.
  // clicando no botão deletar associado ao nome do usuário.
  const clickDeleteUsuario = (item) => {
    setplantonista(item.id)
    setnomeplantonista(item.nome);
    setmodaldeleteusuario(1);
  }
  // modal para confirmar a exclusão do usuário.
  const [modaldeleteusuario, setmodaldeleteusuario] = useState(0);
  function ModalDeleteUsuario() {
    if (modaldeleteusuario === 1) {
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
              {'CONFIRMAR EXCLUSÃO DO MÉDICO ' + nomeplantonista + '?'}
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
                onClick={() => setmodaldeleteusuario(0)}
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
                onClick={() => deleteUsuario(plantonista)}
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
  // função que exclui o usuário e seus registros secundários após a confirmação.
  const deleteUsuario = (plantonista) => {
    // primeiro excluindo todas as unidades vinculadas ao usuário.
    axios.get(html + "/deleteunidades/'" + plantonista + "'");
    // em seguida, excluindo todos os hospitais vinculados ao usuário.
    axios.get(html + "/deletehospitais/'" + plantonista + "'");
    // por fim, excluindo o registro do plantonista.
    axios.get(html + "/deleteusuario/'" + plantonista + "'");
    setTimeout(() => {
      loadPlantonistas();
      // ocultando as listas de hospitais e unidades.
      setviewhospitais(false);
      setviewunidades(false);
    }, 1000);
    setmodaldeleteusuario(0);
    setviewcardplantonista(0);
  }

  // COLUNA HOSPITAIS
  // carregamento da lista de hospitais cadastrados para o usuário.
  const [hospitais, sethospitais] = useState([]);
  const loadHospitais = (value) => {
    axios.get(html + "/usuarioxhospital/'" + value + "'").then((response) => {
      sethospitais(response.data);
    });
  }
  // função que captura o id do hospital selecionado na lista de hospitais.
  const [selectedhospital, setselectedhospital] = useState();
  const [selectedhospitalnome, setselectedhospitalnome] = useState();
  const selectHospital = (item) => {
    setselectedhospital(item.idhospital);
    setselectedhospitalnome(item.hospital);
    loadUnidades(item.idhospital);
    loadSomeUnidades(item.idhospital);
    setselectedunidade('');
    // habilitando o botão "novo" da lista de unidades, após a seleção do hospital.
    setviewunidades(true);
  };
  // renderização da lista de hospitais.
  const [viewhospitais, setviewhospitais] = useState(false);
  function ShowHospitais() {
    return (
      <div>
        <div
          className="scroll"
          id="LISTA DE HOSPITAIS."
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            borderRadius: 5,
            margin: 5,
            minHeight: window.innerHeight - 355,
            maxHeight: window.innerHeight - 355,
            width: 0.3 * window.innerWidth,
          }}
        >
          {hospitais.map((item) => (
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
                  margin: 2.5,
                  width: '100%',
                  color: '#ffffff',
                  backgroundColor:
                    item.idhospital === selectedhospital ? '#ec7063' : '#1f7a8c',
                }}
                onClick={() => selectHospital(item)}
              >
                {item.hospital}
              </button>
              <button className="red-button"
                onClick={() => clickDeleteHospital(item)}>
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
            </p>
          ))}
          <NovoHospitalBtn></NovoHospitalBtn>
        </div>
      </div>
    );
  }
  // botão para cadastrar acesso do plantonista a um novo hospital.
  function NovoHospitalBtn() {
    if (viewhospitais === true) {
      return (
        <div
          className="secondary"
          style={{
            display: 'flex',
            flexDirection: 'row',
            margin: 2.5,
            padding: 0,
            paddingRight: 7.5,
            justifyContent: 'flex-end',
            width: '100%'
          }}
        >
          <button
            className="blue-button"
            onClick={() => setviewinserthospital(1)}
            title={"CADASTRAR NOVO HOSPITAL PARA " + nomeplantonista + "."}
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
        </div>
      );
    } else {
      return null;
    }
  }
  // tela para cadastrar acesso a um novo hospital para o plantonista.
  const [viewinserthospital, setviewinserthospital] = useState(0);
  function NovoHospitalView() {
    if (viewinserthospital === 1) {
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
            <label className="title2" style={{ marginTop: 0, marginBottom: 15 }}>
              INSERIR HOSPITAL
          </label>
            <ShowAllHospitais></ShowAllHospitais>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  // salvando um hospital.
  const insertHospital = (item) => {
    var idusuario = plantonista;
    var usuario = nomeplantonista;
    var idhospital = item.id;
    var hospital = item.hospital;
    var check = [0, 1];
    // verificando se o hospital já está cadastrado.
    axios.get(html + "/checkhospital/'" + plantonista + "'/'" + item.id + "'").then((response) => {
      check = response.data;
      console.log('CHECK HOSPITAL: ' + check.length)
      if (hospital !== '' && check.length === 0) {
        var obj = {
          idusuario: idusuario,
          usuario: usuario,
          idhospital: idhospital,
          hospital: hospital,
        };
        axios.post(html + '/inserthospital', obj);
        toast(1, '#52be80', 'HOSPITAL ' + selectednewhospitalnome + ' LIBERADO PARA O MÉDICO ' + nomeplantonista + '.', 6000);
        setviewinserthospital(0);
        setTimeout(() => {
          loadHospitais(plantonista);
        }, 1000);
      } else {
        toast(1, '#ec7063', 'HOSPITAL ' + selectednewhospitalnome + ' JÁ DISPONÍVEL PARA O MÉDICO ' + nomeplantonista + '.', 6000);
        setviewinserthospital(0);
      }
    });
  };
  // deletando um hospital.
  // clicando no botão deletar associado ao nome do hospital.
  const [idhospital, setidhospital] = useState(0);
  const clickDeleteHospital = (item) => {
    setidhospital(item.id);
    setselectedhospital(item.idhospital);
    setselectedhospitalnome(item.hospital);
    setmodaldeletehospital(1);
  };
  // modal para confirmar a exclusão do usuário.
  const [modaldeletehospital, setmodaldeletehospital] = useState(0);
  function ModalDeleteHospital() {
    if (modaldeletehospital === 1) {
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
              {'DESABILITAR ACESSO AO HOSPITAL ' + selectedhospitalnome + ' PARA O PLANTONISTA ' + nomeplantonista + '?'}
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
                onClick={() => setmodaldeletehospital(0)}
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
                onClick={() => deleteHospital(selectedhospital)}
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
  // função que exclui o usuário e seus registros secundários após a confirmação.
  const deleteHospital = (selectedhospital) => {
    // primeiro excluindo todas as unidades vinculadas ao hospital.
    axios.get(html + "/deleteunidadeshospital/'" + plantonista + "'/'" + selectedhospital + "'");
    // em seguida, excluindo o hospital.
    axios.get(html + "/deletehospital/'" + idhospital + "'");
    setTimeout(() => {
      loadHospitais(plantonista);
      // limpando a lista de unidades.
      loadUnidades();
      setviewunidades(false);
      setmodaldeletehospital(0);
      toast(1, '#ec7063', 'HOSPITAL ' + selectedhospitalnome + ' DESABILITADO PARA O MÉDICO ' + nomeplantonista + '.', 6000);
    }, 1000);
  }

  // LISTA DE HOSPITAIS EXIBIDA NA TELA INSERIR HOSPITAL.
  // carregando a lista de todos os hospitais cadastrados para a empresa.
  const [allhospitais, setallhospitais] = useState([]);
  const loadAllHospitais = () => {
    axios.get(html + "/allhospital").then((response) => {
      setallhospitais(response.data);
    });
  }
  // lista de hospitais cadastrados para a empresa.
  function ShowAllHospitais() {
    return (
      <div>
        <div
          className="scroll"
          id="LISTA DE HOSPITAIS."
          style={{
            display: 'flex',
            flex: 2,
            justifyContent: 'flex-start',
            borderRadius: 5,
            margin: 5,
            marginRight: 0,
            height: 400,
          }}
        >
          {allhospitais.map((item) => (
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
                    item.hospital === selectednewhospitalnome ? '#ec7063' : '#1f7a8c',
                }}
                onClick={() => selectNewHospital(item)}
              >
                {item.hospital}
              </button>
            </p>
          ))}
        </div>
      </div>
    );
  }
  // selecionando um hospital da lista de todos os hospitais da empresa.
  const [selectednewhospitalid, setselectednewhospitalid] = useState(0);
  const [selectednewhospitalnome, setselectednewhospitalnome] = useState(0);
  const selectNewHospital = (item) => {
    setselectednewhospitalid(item.id);
    setselectednewhospitalnome(item.hospital);
    insertHospital(item);
  }

  // COLUNA UNIDADES
  // carregamento da lista de unidades cadastradas para o usuário.
  const [unidades, setunidades] = useState([]);
  const loadUnidades = (value) => {
    axios.get(html + "/usuarioxhospitalxunidade/'" + plantonista + "'/'" + value + "'").then((response) => {
      setunidades(response.data);
    });
  }
  // função que captura o id da unidade selecionada na lista de unidades.
  const [selectedunidade, setselectedunidade] = useState();
  const selectUnidade = (item) => {
    setselectedunidade(item.id);
  };
  // renderização da lista de unidades.
  const [viewunidades, setviewunidades] = useState(false);
  function ShowUnidades() {
    return (
      <div>
        <div
          className="scroll"
          id="LISTA DE UNIDADES."
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            borderRadius: 5,
            margin: 5,
            marginLeft: 5,
            minHeight: window.innerHeight - 355,
            maxHeight: window.innerHeight - 355,
            width: 0.3 * window.innerWidth,
          }}
        >
          {unidades.map((item) => (
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
                  width: '100%',
                  margin: 2.5,
                  color: '#ffffff',
                  backgroundColor:
                    item.id === selectedunidade ? '#ec7063' : '#1f7a8c',
                }}
                onClick={() => selectUnidade(item)}
              >
                {item.unidade}
              </button>
              <button className="red-button"
                onClick={() => clickDeleteUnidade(item)}>
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
            </p>
          ))}
          <NovaUnidadeBtn></NovaUnidadeBtn>
        </div>
      </div>
    );
  }
  // botão para cadastrar acesso do plantonista a uma nova unidade.
  function NovaUnidadeBtn() {
    if (viewunidades === true) {
      return (
        <div
          className="secondary"
          style={{
            display: 'flex',
            flexDirection: 'row',
            margin: 2.5,
            padding: 0,
            paddingRight: 7.5,
            justifyContent: 'flex-end',
            width: '100%'
          }}
        >
          <button
            className="blue-button"
            onClick={() => setviewinsertunidade(1)}
            title={"CADASTRAR NOVA UNIDADE PARA " + nomeplantonista + "."}
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
        </div>
      );
    } else {
      return null;
    }
  }
  // tela para cadastrar acesso a uma nova unidade para o plantonista.
  const [viewinsertunidade, setviewinsertunidade] = useState(0);
  function NovaUnidadelView() {
    if (viewinsertunidade === 1) {
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
            <label className="title2" style={{ marginTop: 0, marginBottom: 15 }}>
              INSERIR UNIDADE
          </label>
            <ShowSomeUnidades></ShowSomeUnidades>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  // salvando uma unidade.
  const insertUnidade = (item) => {
    var idusuario = plantonista;
    var usuario = nomeplantonista;
    var idhospital = item.idhospital;
    var hospital = item.hospital;
    var unidade = item.unidade;
    var check = [0, 1];
    // verificando se a unidade já está cadastrada.
    axios.get(html + "/checkunidade/'" + plantonista + "'/'" + idhospital + "'/'" + unidade + "'").then((response) => {
      check = response.data;
      console.log('CHECK UNIDADE: ' + check.length)
      if (unidade !== '' && check.length === 0) {
        var obj = {
          idusuario: idusuario,
          usuario: usuario,
          idhospital: idhospital,
          hospital: hospital,
          unidade: unidade,
        };
        axios.post(html + '/insertunidade', obj);
        setviewinsertunidade(0);
        toast(1, '#52be80', 'UNIDADE ' + unidade + ' LIBERADA PARA ' + nomeplantonista + '.', 6000);
        setTimeout(() => {
          loadUnidades(selectedhospital);
        }, 1000);
      } else {
        toast(1, '#ec7063', 'UNIDADE JÁ LIBERADA PARA O USUÁRIO ' + nomeplantonista + '.', 6000);
        setviewinsertunidade(0);
      }
    });
  };
  // deletando uma unidade.
  // clicando no botão deletar associado ao nome da unidade.
  const [idunidade, setidunidade] = useState(0);
  const clickDeleteUnidade = (item) => {
    setidunidade(item.id);
    setselectedunidade(item.unidade);
    setmodaldeleteunidade(1);
  };
  // modal para confirmar a exclusão do usuário.
  const [modaldeleteunidade, setmodaldeleteunidade] = useState(0);
  function ModalDeleteUnidade() {
    if (modaldeleteunidade === 1) {
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
              {'DESABILITAR ACESSO À UNIDADE ' + selectedunidade + ' PARA O PLANTONISTA ' + nomeplantonista + '?'}
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
                onClick={() => setmodaldeleteunidade(0)}
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
                onClick={() => deleteUnidade()}
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
  // função que exclui o usuário e seus registros secundários após a confirmação.
  const deleteUnidade = () => {
    axios.get(html + "/deleteunidade/'" + idunidade + "'");
    toast(1, '#ec7063', 'UNIDADE ' + selectedunidade + ' DESABILITADA PARA O USUÁRIO ' + nomeplantonista + '.', 6000);
    setmodaldeleteunidade(0);
    setTimeout(() => {
      loadUnidades(selectedhospital);
    }, 1000);
  }

  // LISTA DE UNIDADES EXIBIDA NA TELA INSERIR UNIDADE.
  // carregando a lista das unidades disponíveis para o usuário e hospital selecionados.
  const [someunidades, setsomeunidades] = useState([]);
  const loadSomeUnidades = (value) => {
    axios.get(html + "/someunidades/'" + value + "'").then((response) => {
      setsomeunidades(response.data);
    });
  }
  // lista de hospitais cadastrados para a empresa.
  function ShowSomeUnidades() {
    return (
      <div>
        <div
          className="scroll"
          id="LISTA DE UNIDADES DISPONÍVEIS."
          style={{
            display: 'flex',
            flex: 2,
            justifyContent: 'flex-start',
            borderRadius: 5,
            margin: 5,
            marginRight: 0,
            height: 400,
          }}
        >
          {someunidades.map((item) => (
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
                    item.unidade === selectedunidade ? '#ec7063' : '#1f7a8c',
                }}
                onClick={() => selectNewUnidade(item)}
              >
                {item.unidade}
              </button>
            </p>
          ))}
        </div>
      </div>
    );
  }
  // selecionando uma unidade da lista de todos as disponíveis para o usuário e hospital selecionados.
  const selectNewUnidade = (item) => {
    insertUnidade(item);
  }

  // DATEPICKER.
  // exibindo ou ocultando o datepicker.
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const showDatePicker = () => {
    setViewDatePicker(1);
    setNome(document.getElementById("inputNome").value);
    setSobrenome(document.getElementById("inputSobrenome").value);
  }
  const hideDatePicker = () => {
    setViewDatePicker(0);
  }
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

  // selecionando uma data no datepicker (definindo a data de nascimento).
  const [pickdate, setpickdate] = useState(moment().format('DD/MM/YY'));
  const selectDate = (date) => {
    setpickdate(date);
    hideDatePicker();
  }

  // renderização do datepicker.
  const [viewDatePicker, setViewDatePicker] = useState(0);
  function DatePicker() {
    if (viewDatePicker === 1) {
      return (
        <div
          className="secondary"
          style={{
            position: 'absolute',
            backgroundColor: '#ffffff',
            zIndex: 5,
            padding: 15,
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
              className="widget"
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
              {'<<'}
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
              className="widget"
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
              {'>>'}
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
                  color: '#ffffff',
                  backgroundColor: item === pickdate ? '#ec7063' : '#5dade2',
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
    } else {
      return null;
    }
  }

  function TitlePlantonista() {
    if (viewcardplantonista === 1) {
      return (
        <p className="title2" style={{ fontSize: 18, width: '100%', margin: 0, padding: 0 }}>
          {'HOSPITAIS E SETORES LIBERADOS PARA ' + nomeplantonista + '.'}
        </p>
      )
    } else {
      return (
        <p className="title2" style={{ fontSize: 18, color: 'grey', width: '100%', margin: 0, padding: 0, opacity: 0.5 }}>
          {'SELECIONE UM PLANTONISTA DA LISTA...'}
        </p>
      )
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
  if (viewUsuarios === 1) {
    return (
      <div
        className="main"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Toast valor={valor} cor={cor} mensagem={mensagem} tempo={tempo}></Toast>
        <ModalDeleteUsuario></ModalDeleteUsuario>
        <ModalDeleteHospital></ModalDeleteHospital>
        <ModalDeleteUnidade></ModalDeleteUnidade>
        <Header link={"/pages/escalas"} titulo={'GERENCIAMENTO DE PLANTONISTAS'}></Header>
        <NovoUsuarioView></NovoUsuarioView>
        <UpdateUsuarioView></UpdateUsuarioView>
        <NovoHospitalView></NovoHospitalView>
        <NovaUnidadelView></NovaUnidadelView>
        <DatePicker></DatePicker>
        <div style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'center',
          width: '100%', paddingLeft: 5, paddingRight: 5,
        }}>
          <ShowPlantonistas></ShowPlantonistas>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardPlantonista></CardPlantonista>
            <TitlePlantonista></TitlePlantonista>
            <div style={{
              display: 'flex', flexDirection: 'row',
              justifyContent: 'center',
            }}>
              <ShowHospitais></ShowHospitais>
              <ShowUnidades></ShowUnidades>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default Usuarios;
