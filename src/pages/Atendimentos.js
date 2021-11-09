/* eslint eqeqeq: "off" */
import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import MaskedInput from 'react-maskedinput';
import deletar from '../images/deletar.svg';
import editar from '../images/editar.svg';
import salvar from '../images/salvar.svg';
import novo from '../images/novo.svg';
import moment, { locale } from 'moment';
import 'moment/locale/pt-br';
import Toast from '../components/Toast';
import Header from '../components/Header';
import Context from '../Context';

function Atendimentos() {
  moment.locale('pt-br');
  var html = 'https://pulsarapp-server.herokuapp.com';
  const {
    tipousuario,
    nomeunidade,
    setidpaciente,
    idpaciente,
    nomepaciente, setnomepaciente,
    dn, setdn,
  } = useContext(Context)

  useEffect(() => {
    // ocultando os widgets relacionados ao paciente selecionado.
    setidpaciente(0);
    setviewcardpaciente(0);
    setstatusatendimento(3);
    // carregando a lista de pacientes.
    loadPacientes();
    // carregando o total de atendimentos.
    getAtendimentos();
    // carregando o total de leitos.
    getLeitos();
    // carregando a lista de hospitais.
    loadHospitais();
  }, []);

  // COLUNA PACIENTES
  // carregamento da lista de pacientes cadastrados no sistema.
  const [pacientes, setpacientes] = useState([]);
  const loadPacientes = () => {
    setTimeout(() => {
      axios.get(html + '/pacientes').then((response) => {
        var x = [0, 1];
        var y = [0, 1];
        setpacientes(response.data);
        setarraypacientes(response.data);
      });
    }, 2000);
  }
  // função que captura as informações do paciente selecionado na lista de pacientes.
  const [status, setstatus] = useState(''); // status: ativo, inativo, falecido?
  const [documento, setdocumento] = useState('');
  const [mae, setmae] = useState('');
  const [telefone, settelefone] = useState('');
  const [email, setemail] = useState('');
  const [rua, setrua] = useState('');
  const [numero, setnumero] = useState('');
  const [bairro, setbairro] = useState('');
  const [cidade, setcidade] = useState('');
  const [cep, setcep] = useState('');
  const [estado, setestado] = useState('');
  const [endereco, setendereco] = useState('');
  const selectPaciente = (item) => {
    getAtendimentos();
    setviewcardpaciente(0);
    setidpaciente(item.id);
    setnomepaciente(item.nome);
    setdn(item.dn ? item.dn : 'NÃO INFORMADA');
    setstatus(item.status);
    setdocumento(item.documento ? item.documento : '');
    setmae(item.mae ? item.mae : '');
    settelefone(item.telefone ? item.telefone : '');
    setemail(item.email ? item.email : '');
    setrua(item.rua ? item.rua : '');
    setnumero(item.numero ? item.numero : '');
    setbairro(item.bairro ? item.bairro : '');
    setcidade(item.cidade ? item.cidade : '');
    setcep(item.cep ? item.cep : '');
    setestado(item.estado ? item.estado : '');
    setendereco(rua + ', Nº ' + numero + ', BAIRRO ' + bairro + ', ' + cidade + ', CEP: ' + cep + ', ' + estado + '.');
    // buscando registro de atendimento ativo.
    loadAtendimento(item);
    // habilitando o card com dados do paciente.
    setviewcardpaciente(1);
  };
  // buscando registro de atendimento ativo para o paciente selecionado.
  const [atendimentoid, setatendimentoid] = useState(0);
  const [atendimentohospital, setatendimentohospital] = useState('');
  const [atendimentounidade, setatendimentounidade] = useState('');
  const [atendimentobox, setatendimentobox] = useState('');
  const [atendimentoadmissao, setatendimentoadmissao] = useState('');
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
  const [atendimentoprecaucao, setatendimentoprecaucao] = useState(0);
  const [atendimentoassistente, setatendimentoassistente] = useState('SEM MÉDICO ASSISTENTE');

  const loadAtendimento = (item) => {
    axios.get(html + "/atendimentoselect/'" + item.id + "'").then((response) => {
      var atendimento = [0, 1];
      atendimento = response.data;
      if (atendimento.length > 0) {
        setstatusatendimento(1); // exibe o card com os botões encerrar atendimento ou movimentar paciente.
        // obtendo dados do registro de atendimento.
        const arrayid = atendimento.map((item) => item.id);
        const arrayhospital = atendimento.map((item) => item.hospital);
        const arrayunidade = atendimento.map((item) => item.unidade);
        const arraybox = atendimento.map((item) => item.box);
        const arrayadmissao = atendimento.map((item) => item.admissao);
        const arraypeso = atendimento.map((item) => item.peso);
        const arrayaltura = atendimento.map((item) => item.altura);
        const arrayantecedentes = atendimento.map((item) => item.antecedentes);
        const arrayalergias = atendimento.map((item) => item.alergias);
        const arraymedicacoes = atendimento.map((item) => item.medicacoes);
        const arrayexames = atendimento.map((item) => item.exames);
        const arrayhistoria = atendimento.map((item) => item.historia);
        const arrayativo = atendimento.map((item) => item.ativo);
        const arraystatus = atendimento.map((item) => item.status);
        const arrayclassificacao = atendimento.map((item) => item.classificacao);
        const arraydescritor = atendimento.map((item) => item.descritor);
        const arrayprecaucao = atendimento.map((item) => item.precaucao);
        const arrayassistente = atendimento.map((item) => item.assistente);
        setatendimentoid(arrayid[0]);
        setatendimentohospital(arrayhospital[0]);
        setatendimentounidade(arrayunidade[0]);
        setatendimentobox(arraybox[0]);
        setatendimentoadmissao(arrayadmissao[0]);
        setatendimentopeso(arraypeso[0]);
        setatendimentoaltura(arrayaltura[0]);
        setatendimentoantecedentes(arrayantecedentes[0]);
        setatendimentoalergias(arrayalergias[0]);
        setatendimentomedicacoes(arraymedicacoes[0]);
        setatendimentoexames(arrayexames[0]);
        setatendimentohistoria(arrayhistoria[0]);
        setatendimentostatus(arraystatus[0]);
        setatendimentoativo(arrayativo[0]);
        setatendimentoclassificacao(arrayclassificacao[0]);
        setatendimentodescritor(arraydescritor[0]);
        setatendimentoprecaucao(arrayprecaucao[0]);
        setatendimentoassistente(arrayassistente[0]);
      } else {
        setstatusatendimento(0); // exibe o card com o botão para iniciar atendimento.
      }
    });
  }
  // exibindo o status do atendimento.
  const [statusatendimento, setstatusatendimento] = useState(0);
  function ShowStatusAtendimento() {
    if (statusatendimento === 1) {
      return (
        <div className="widget"
          style={{
            flexDirection: 'column',
            backgroundColor: 'rgba(82, 190, 128, 1)',
            margin: 0,
            marginTop: 10,
            padding: 5,
            minWidth: '100%',
            width: '100%',
          }}>
          <div className="title2" style={{ fontSize: 18, color: '#ffffff', textAlign: 'center' }}>
            {'PACIENTE EM ATENDIMENTO'}
          </div>
          <div className="title2" style={{ fontSize: 14, color: '#ffffff', textAlign: 'center' }}>
            {'HOSPITAL: ' + atendimentohospital}
          </div>
          <div className="title2" style={{ fontSize: 14, color: '#ffffff', textAlign: 'center' }}>
            {'UNIDADE: ' + atendimentounidade + ' - BOX: ' + atendimentobox}
          </div>
          <div className="title2" style={{ fontSize: 14, color: '#ffffff', textAlign: 'center' }}>
            {'DATA DE INTERNAÇÃO: ' + atendimentoadmissao}
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <button
              className="red-button"
              style={{
                width: '100%',
                color: '#ffffff',
                padding: 10,
              }}
              onClick={() => setmodalencerraatendimento(1)}
            >
              ENCERRAR ATENDIMENTO
            </button>
            <button
              className="red-button"
              style={{
                width: '100%',
                color: '#ffffff',
                padding: 10,
              }}
              onClick={() => modificarAtendimento()}
            >
              MOVIMENTAR PACIENTE
            </button>
          </div>
        </div>
      )
    } else if (statusatendimento === 0) {
      return (
        <button
          className="red-button"
          style={{
            width: '100%',
            color: '#ffffff',
            marginTop: 25,
            padding: 5,
          }}
          onClick={() => iniciarAtendimento()}
        >
          INICIAR ATENDIMENTO
        </button>
      )
    } else {
      return null;
    }
  }

  // exibindo o card com as informações cadastrais do paciente selecionado.
  const [viewcardpaciente, setviewcardpaciente] = useState(0);
  function CardPaciente() {
    if (viewcardpaciente === 1) {
      return (
        <div id="cardpaciente" className="widget"
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRadius: 0,
            padding: 5,
            margin: 0,
            width: '40vw',
            backgroundColor: 'rgba(143, 155, 188, 0.8)',
          }}>
          <div className="scrollmenu" style={{ backgroundColor: 'transparent', borderColor: 'transparent', boxShadow: 'none', alignSelf: 'center' }}>
            <div style={{ position: 'absolute', top: 5, right: 5, color: 'transparent' }}>{atendimentoid}</div>
            <div className="title2" style={{ fontSize: 14, color: '#ffffff', textAlign: 'center' }}>{'PACIENTE: ' + nomepaciente}</div>
            <div className="title2" style={{ fontSize: 14, color: '#ffffff', textAlign: 'center' }}>{dn ? 'DN: ' + dn : 'DN: NÃO INFORMADA'}</div>
            <div className="title2" style={{ fontSize: 14, color: '#ffffff', textAlign: 'center' }}>{documento ? 'DOCUMENTO: ' + documento : 'DOCUMENTO: NÃO INFORMADO'}</div>
            <div className="title2" style={{ fontSize: 14, color: '#ffffff', textAlign: 'center' }}>{mae ? 'MÃE: ' + mae : 'MÃE: NÃO INFORMADA'}</div>
            <div className="title2" style={{ fontSize: 14, color: '#ffffff', textAlign: 'center' }}>{telefone ? 'TELEFONE: ' + telefone : 'TELEFONE: NÃO INFORMADO'}</div>
            <div className="title2" style={{ fontSize: 14, color: '#ffffff', textAlign: 'center' }}>{email ? 'E-MAIL: ' + email : 'E-MAIL: NÃO INFORMADO'}</div>
            <div className="title2" style={{ textAlign: 'center', fontSize: 14, color: '#ffffff' }}>{
              'ENDEREÇO: ' + endereco.substring(0, 200) + '...'
            }</div>
          </div>
          <div style={{ padding: 5 }}>
            <ShowStatusAtendimento></ShowStatusAtendimento>
          </div>
        </div >
      )
    } else {
      return <div className="widget"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderRadius: 0,
          padding: 5,
          margin: 0,
          width: '40vw',
          backgroundColor: 'rgba(143, 155, 188, 0.8)',
        }}>
        <div className="title2" style={{ textAlign: 'center', fontSize: 14, color: '#ffffff' }}>{'SELECIONE UM PACIENTE DA LISTA PARA VISUALIZAR SEUS DADOS.'}</div>
      </div>;
    }
  }

  // renderização do buscador de pacientes.
  function ShowFilter() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', padding: 20 }}>
        <input
          className="input"
          autoComplete="off"
          placeholder="BUSCAR PACIENTE..."
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'BUSCAR PACIENTE...')}
          onChange={() => filterName()}
          style={{
            width: '100%',
            margin: 0,
          }}
          type="text"
          id="inputFilter"
          defaultValue={filtername}
          maxLength={300}
        ></input>
        <NovoPacienteBtn></NovoPacienteBtn>
      </div>
    )
  }

  const [filtername, setfiltername] = useState('');
  var searchname = '';
  const [arraypacientes, setarraypacientes] = useState(pacientes);
  const filterName = () => {
    document.getElementById("inputFilter").focus();
    searchname = document.getElementById("inputFilter").value.toUpperCase();
    clearTimeout(timeout);
    document.getElementById("inputFilter").focus();
    var timeout = setTimeout(() => {
      setfiltername(document.getElementById("inputFilter").value.toUpperCase());
      setarraypacientes(pacientes.filter(item => item.nome.includes(searchname) === true || item.documento.includes(searchname)));
      // "descelecionando" um paciente e ocultando os widgets relacionados.
      setidpaciente(0);
      setviewcardpaciente(0);
      setstatusatendimento(3);
      document.getElementById("inputFilter").focus();
    }, 1000);
    return console.log(pacientes.filter(item => item.nome === filtername));
  }

  // cabeçalho para a lista de pacientes.
  function CabecalhoPacientes() {
    return (
      <div className="scrollheader">
        <div className="rowheader" style={{ paddingRight: 18 }}>
          <button
            className="header-button"
            style={{
              width: '100%',
              textAlign: 'left',
            }}
          >
            NOME
          </button>
          <div
            className="rowitemheader"
            style={{
              width: '30%',
              alignSelf: 'center',
              paddingRight: 15,
            }}
          >
            DATA DE NASCIMENTO
          </div>
          <div
            className="rowitemheader"
            title="DOCUMENTO DO PACIENTE."
            style={{
              width: '40%',
              alignSelf: 'center',
            }}
          >
            DOCUMENTO
          </div>
        </div>
      </div>
    );
  }

  // renderização da lista de pacientes.
  function ShowPacientes() {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        margin: 0, marginRight: 5, padding: 0, width: '100%'
      }}>
        <ShowFilter></ShowFilter>
        <CabecalhoPacientes></CabecalhoPacientes>
        <div
          className="scroll" style={{ height: '100%' }}
          id="LISTA DE PACIENTES"
        >
          {arraypacientes.map((item) => (
            <div
              key={item.id}
              className="row" style={{ opacity: 1 }}
              onClick={() => selectPaciente(item)}
            >
              <button
                className="blue-button"
                style={{
                  width: '100%',
                  textAlign: 'left',
                  backgroundColor: item.id == idpaciente ? '#ec7063' : '#8f9bbc',
                }}
              >
                {item.nome}
              </button>
              <div
                title={
                  moment().diff(moment(item.dn, 'DD/MM/YYYY'), 'years') > 1 ?
                    'DATA DE NASCIMENTO. \nIDADE: ' + moment().diff(moment(item.dn, 'DD/MM/YYYY'), 'years') + ' ANOS' :
                    'DATA DE NASCIMENTO. \nIDADE: ' + moment().diff(moment(item.dn, 'DD/MM/YYYY'), 'years') + ' ANO'
                }
                className="title2"
                style={{
                  width: '30%',
                  alignSelf: 'center'
                }}
              >
                {item.dn}
              </div>
              <div
                className="title2"
                title="DOCUMENTO DO PACIENTE."
                style={{
                  width: '40%',
                  alignSelf: 'center',
                }}
              >
                {item.documento}
              </div>
              <button className="animated-yellow-button"
                onClick={() => clickUpdatePaciente(item)}
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
                onClick={() => clickDeletePaciente(item)}
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
        </div>
      </div>
    );
  }
  // botão para inserir paciente.
  function NovoPacienteBtn() {
    return (
      <button
        className="blue-button"
        onClick={() => setviewpaciente(1)}
        title="CADASTRAR PACIENTE."
        style={{
          margin: 0,
          marginLeft: 5,
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

  // salvando um paciente.
  const insertPaciente = () => {
    var nome = document.getElementById('inputNome').value.toUpperCase();
    var dn = document.getElementById('inputDn').value;
    var documento = document.getElementById('inputDocumento').value.toUpperCase();
    var mae = document.getElementById('inputMae').value.toUpperCase();
    var telefone = document.getElementById('inputTelefone').value;
    var email = document.getElementById('inputEmail').value;
    var rua = document.getElementById('inputRua').value.toUpperCase();
    var numero = document.getElementById('inputNumero').value.toUpperCase();
    var bairro = document.getElementById('inputBairro').value.toUpperCase();
    var cidade = document.getElementById('inputCidade').value.toUpperCase();
    var cep = document.getElementById('inputCEP').value;
    var estado = document.getElementById('inputEstado').value.toUpperCase();
    if (nome !== '' && dn !== '' && documento !== '') {
      var obj = {
        nome: nome,
        dn: dn,
        status: 0,
        documento: documento,
        mae: mae,
        telefone: telefone,
        email: email,
        rua: rua,
        numero: numero,
        bairro: bairro,
        cidade: cidade,
        cep: cep,
        estado: estado,
      };
      axios.post(html + '/insertpaciente', obj);
      setviewpaciente(0);
      toast(1, '#52be80', 'PACIENTE CADASTRADO COM SUCESSO.', 3000);
      setTimeout(() => {
        // "descelecionando" um paciente e ocultando o componente de status do atendimento.
        setidpaciente(0);
        setviewcardpaciente(0);
        setstatusatendimento(3);
        loadPacientes();
      }, 1000);
    } else {
      toast(1, '#ec7063', 'FAVOR PREENCHER NOME, DATA DE NASCIMENTO E DOCUMENTO.', 6000);
    }
  };
  // atualizando um paciente.
  const clickUpdatePaciente = (item) => {
    setidpaciente(item.id);
    setnomepaciente(item.nome);
    setdn(item.dn ? item.dn : '');
    setstatus(item.status);
    setdocumento(item.documento ? item.documento : '');
    setmae(item.mae ? item.mae : '');
    settelefone(item.telefone ? item.telefone : '');
    setemail(item.email ? item.email : '');
    setrua(item.rua ? item.rua : '');
    setnumero(item.numero ? item.numero : '');
    setbairro(item.bairro ? item.bairro : '');
    setcidade(item.cidade ? item.cidade : '');
    setcep(item.cep ? item.cep : '');
    setestado(item.estado ? item.estado : '');
    setviewpaciente(2);
    // mecanismo para alimentar os maskedinputs na tela editar paciente.
    setTimeout(() => {
      document.getElementById("inputDn").value = item.dn;
      document.getElementById("inputCEP").value = item.cep;
      document.getElementById("inputTelefone").value = item.telefone;
    }, 1000);
  }

  const updatePaciente = () => {
    var nome = document.getElementById('inputNome').value.toUpperCase();
    var dn = document.getElementById('inputDn').value;
    var documento = document.getElementById('inputDocumento').value.toUpperCase();
    var mae = document.getElementById('inputMae').value.toUpperCase();
    var telefone = document.getElementById('inputTelefone').value;
    var email = document.getElementById('inputEmail').value;
    var rua = document.getElementById('inputRua').value.toUpperCase();
    var numero = document.getElementById('inputNumero').value.toUpperCase();
    var bairro = document.getElementById('inputBairro').value.toUpperCase();
    var cidade = document.getElementById('inputCidade').value.toUpperCase();
    var cep = document.getElementById('inputCEP').value;
    var estado = document.getElementById('inputEstado').value.toUpperCase();
    setTimeout(() => {
      if (nome !== '' && dn !== '' && documento !== '') {
        var obj = {
          id: idpaciente,
          nome: nome,
          dn: dn,
          status: 0,
          documento: documento,
          mae: mae,
          telefone: telefone,
          email: email,
          rua: rua,
          numero: numero,
          bairro: bairro,
          cidade: cidade,
          cep: cep,
          estado: estado,
        };
        axios.post(html + '/updatepaciente/' + idpaciente, obj);
        setviewpaciente(0);
        toast(1, '#52be80', 'PACIENTE ATUALIZADO COM SUCESSO.', 3000);
        // carregando o atendimento ativo do paciente atualizado.
        axios.get(html + "/atendimentoselect/'" + idpaciente + "'").then((response) => {
          var atendimento = [0, 1];
          atendimento = response.data;
          if (atendimento.length > 0) {
            // obtendo dados do registro de atendimento.
            const arrayid = atendimento.map((item) => item.id);
            const arrayhospital = atendimento.map((item) => item.hospital);
            const arrayunidade = atendimento.map((item) => item.unidade);
            const arraybox = atendimento.map((item) => item.box);
            const arrayadmissao = atendimento.map((item) => item.admissao);
            const arraypeso = atendimento.map((item) => item.peso);
            const arrayaltura = atendimento.map((item) => item.altura);
            const arrayantecedentes = atendimento.map((item) => item.antecedentes);
            const arrayalergias = atendimento.map((item) => item.alergias);
            const arraymedicacoes = atendimento.map((item) => item.medicacoes);
            const arrayexames = atendimento.map((item) => item.exames);
            const arrayhistoria = atendimento.map((item) => item.historia);
            const arraystatus = atendimento.map((item) => item.status);
            const arrayativo = atendimento.map((item) => item.ativo);
            setatendimentoid(arrayid[0]);
            setatendimentohospital(arrayhospital[0]);
            setatendimentounidade(arrayunidade[0]);
            setatendimentobox(arraybox[0]);
            setatendimentoadmissao(arrayadmissao[0]);
            setatendimentopeso(arraypeso[0]);
            setatendimentoaltura(arrayaltura[0]);
            setatendimentoantecedentes(arrayantecedentes[0]);
            setatendimentoalergias(arrayalergias[0]);
            setatendimentomedicacoes(arraymedicacoes[0]);
            setatendimentoexames(arrayexames[0]);
            setatendimentohistoria(arrayhistoria[0]);
            setatendimentostatus(arraystatus[0]);
            setatendimentoativo(arrayativo[0]);
          }
        });
        // atualizando as informações modificadas do paciente no registro de atendimento ativo.
        var obj = {
          idpaciente: idpaciente,
          hospital: atendimentohospital,
          unidade: atendimentounidade,
          box: atendimentobox,
          admissao: atendimentoadmissao,
          nome: nome,
          dn: dn,
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
          precaucao: atendimentoprecaucao,
          assistente: atendimentoassistente,
        };
        axios.post(html + "/updateatendimento/'" + atendimentoid + "'", obj);
        setTimeout(() => {
          // "descelecionando" um paciente e ocultando o componente de status do atendimento.
          setidpaciente(0);
          setviewcardpaciente(0);
          setstatusatendimento(3);
          loadPacientes();
        }, 1000);
      } else {
        toast(1, '#ec7063', 'CAMPOS EM BRANCO.', 3000);
      }
    }, 1500);
  };
  // tela para atualizar um paciente já cadastrado.
  const [viewpaciente, setviewpaciente] = useState(0);
  function PacienteView() {
    if (viewpaciente != 0) {
      return (
        <div className="menucover">
          <div
            className="menucontainer">
            <div id="cabeçalho" className="cabecalho">
              <div className="title5">{viewpaciente == 1 ? 'INSERIR PACIENTE' : 'ATUALIZAR PACIENTE'}</div>
              <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="red-button" onClick={() => setviewpaciente(0)}>
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
                  onClick={viewpaciente == 1 ? () => insertPaciente() : () => updatePaciente()}
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
            <div className="scroll" style={{ height: '80vh', width: '80vw', alignItems: 'center' }}>
              <p className="title2" style={{ fontSize: 14 }}>NOME:</p>
              <input
                className="input"
                autoComplete="off"
                placeholder="NOME."
                title="NOME."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'NOME.')}
                style={{
                  marginBottom: 0,
                  width: 500,
                }}
                type="text"
                id="inputNome"
                defaultValue={nomepaciente}
                maxLength={100}
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
                style={{
                  margin: 5,
                  width: 200,
                  height: 50,
                  alignSelf: 'center',
                }}
                mask="11/11/1111"
              />
              <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>DOCUMENTO:</p>
              <input
                className="input"
                autoComplete="off"
                placeholder="DOCUMENTO."
                title="DOCUMENTO (RG, CPF, ETC.)."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'DOCUMENTO.')}
                style={{
                  marginBottom: 0,
                  width: 200,
                }}
                type="text"
                id="inputDocumento"
                defaultValue={documento}
                maxLength={15}
              ></input>
              <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>NOME DA MÃE:</p>
              <input
                className="input"
                autoComplete="off"
                placeholder="NOME DA MÃE."
                title="NOME DA MÃE."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'NOME DA MÃE.')}
                style={{
                  marginBottom: 0,
                  width: 500,
                }}
                type="text"
                id="inputMae"
                defaultValue={mae}
                maxLength={100}
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
                  width: 400,
                  textTransform: 'none',
                }}
                type="text"
                id="inputEmail"
                defaultValue={email}
                maxLength={100}
              ></input>
              <p className="title2" style={{ fontSize: 14, marginTop: 35 }}>ENDEREÇO:</p>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>RUA:</p>
                  <input
                    className="input"
                    autoComplete="off"
                    placeholder="RUA."
                    title="RUA, AVENIDA, ETC."
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'RUA.')}
                    style={{
                      marginBottom: 0,
                      width: 600,
                    }}
                    type="text"
                    id="inputRua"
                    defaultValue={rua}
                    maxLength={500}
                  ></input>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>NÚMERO:</p>
                  <input
                    className="input"
                    autoComplete="off"
                    placeholder="Nº."
                    title="NÚMERO DO IMÓVEL."
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'Nº.')}
                    style={{
                      marginBottom: 0,
                      width: 100,
                    }}
                    type="text"
                    id="inputNumero"
                    defaultValue={numero}
                    maxLength={100}
                  ></input>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>BAIRRO:</p>
                  <input
                    className="input"
                    autoComplete="off"
                    placeholder="BAIRRO."
                    title="BAIRRO."
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'BAIRRO.')}
                    style={{
                      marginBottom: 0,
                      width: 300,
                    }}
                    type="text"
                    id="inputBairro"
                    defaultValue={bairro}
                    maxLength={100}
                  ></input>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>CIDADE:</p>
                  <input
                    className="input"
                    autoComplete="off"
                    placeholder="CIDADE."
                    title="CIDADE."
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'CIDADE.')}
                    style={{
                      marginBottom: 0,
                      width: 400,
                    }}
                    type="text"
                    id="inputCidade"
                    defaultValue={cidade}
                    maxLength={100}
                  ></input>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>CEP:</p>
                  <MaskedInput
                    id="inputCEP"
                    title="CEP."
                    placeholder="CEP."
                    autoComplete="off"
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'CEP.')}
                    className="input"
                    style={{
                      margin: 5,
                      width: 300,
                      height: 50,
                      alignSelf: 'center',
                    }}
                    mask="11111-111"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <p className="title2" style={{ fontSize: 14, marginTop: 20 }}>ESTADO:</p>
                  <input
                    className="input"
                    autoComplete="off"
                    placeholder="ESTADO."
                    title="ESTADO."
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'ESTADO.')}
                    style={{
                      marginBottom: 0,
                      width: 400,
                    }}
                    type="text"
                    id="inputEstado"
                    defaultValue={estado}
                    maxLength={100}
                  ></input>
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
  // deletando um paciente.
  // clicando no botão deletar associado ao nome do paciente.
  const clickDeletePaciente = (item) => {
    setidpaciente(item.id);
    setnomepaciente(item.nome);
    setmodaldeletepaciente(1);
  }
  // modal para confirmar a exclusão do paciente.
  const [modaldeletepaciente, setmodaldeletepaciente] = useState(0);
  function ModalDeletePaciente() {
    if (modaldeletepaciente === 1) {
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
              {'CONFIRMAR EXCLUSÃO DO PACIENTE ' + nomepaciente + '?'}
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
                onClick={() => setmodaldeletepaciente(0)}
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
                onClick={() => deletePaciente(idpaciente)}
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
  // função que exclui o paciente e seus registros de atendimento.
  const deletePaciente = (idpaciente) => {
    axios.get(html + "/deletepaciente/'" + idpaciente + "'");
    // em seguida, excluindo todos os atendimentos vinculados ao paciente.
    // BUCETA: criar endpoint para isso!
    setTimeout(() => {
      // "descelecionando" um paciente e ocultando o componente de status do atendimento.
      setidpaciente(0);
      setviewcardpaciente(0);
      setstatusatendimento(3);
      loadPacientes();
    }, 1000);
    setmodaldeletepaciente(0);
  }

  // INICIANDO NOVO ATENDIMENTO.
  // carregando a lista de hospitais para iniciar um atendimento.
  const [hospitais, sethospitais] = useState([]);
  const loadHospitais = () => {
    axios.get(html + '/todoshospitais').then((response) => {
      sethospitais(response.data);
    });
  }
  // exibindo a lista de hospitais.
  function ShowHospitais() {
    return (
      <div>
        <p className="title2" style={{ fontSize: 18, width: '100%' }}>
          HOSPITAIS
        </p>
        <div
          className="scroll"
          id="LISTA DE HOSPITAIS"
          style={{
            marginRight: 0,
            height: '50vh',
            width: '30vw',
          }}
        >
          {hospitais.map((item) => (
            <button
              key={item.id}
              className="widget"
              style={{
                alignSelf: 'center',
                width: '100%',
                color: '#ffffff',
                backgroundColor:
                  item.id === idhospital ? '#ec7063' : '#8f9bbc',
              }}
              onClick={(e) => { selectHospital(item); e.stopPropagation() }}
            >
              {item.hospital}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // carregando a lista de unidades para iniciar um atendimento.
  const [unidades, setunidades] = useState([]);
  const loadUnidades = (value) => {
    axios.get(html + "/todasunidades/'" + value + "'").then((response) => {
      setunidades(response.data);
    });
  }

  // exibindo a lista de unidades.
  function ShowUnidades() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          paddingLeft: 5,
          paddingRight: 5,
          marginLeft: 10,
        }}>
        <p className="title2" style={{ fontSize: 18, width: '100%' }}>
          UNIDADES
        </p>
        <div
          className="scroll"
          id="ATENDIMENTOS"
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            height: '50vh',
            width: 'calc(24vw + 70px)',
          }}
        >
          {unidades.map((item) => (
            <button
              key={item.id}
              className="blue-button"
              style={{
                width: '12vw',
                height: '12vw',
                margin: 5,
                padding: 10,
                color: '#ffffff',
              }}
              onClick={(e) => { selectUnidade(item); e.stopPropagation() }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="title2" style={{ color: '#ffffff', textAlign: 'center' }}>{item.unidade}</div>
                <div>{'VAGAS: ' + leitos.filter((x) => x.unidade === item.unidade).map((x) => x.leitos - (atendimentos.filter((x) => x.unidade === item.unidade && x.ativo > 0)).length)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }
  // função que obtém o número de todos os atendimentos.
  const [atendimentos, setatendimentos] = useState([]);
  const getAtendimentos = () => {
    axios.get(html + "/atendimentos").then((response) => {
      setatendimentos(response.data);
    });
  }
  // função que obtém o número de leitos de todas as unidades.
  const [leitos, setleitos] = useState([]);
  const getLeitos = () => {
    axios.get(html + "/leitos").then((response) => {
      setleitos(response.data);
    });
  }

  // selecionando um hospital da lista e obtendo registros de suas unidades.
  const [idhospital, setidhospital] = useState(0);
  const [selectedhospital, setselectedhospital] = useState(0);
  const selectHospital = (item) => {
    setidhospital(item.id);
    setselectedhospital(item.hospital);
    loadUnidades(item.id);
  }
  // selecionando uma unidade e registrando um atendimento.
  const [selectedunidade, setselectedunidade] = useState('');
  const [totalleitos, settotalleitos] = useState(0);
  const selectUnidade = (item) => {
    setselectedunidade(item.unidade);
    settotalleitos(item.leitos);
    loadArrayBox(item);
    listBusyBox(item);
    setTimeout(() => {
      setviewtotalbox(1);
    }, 1000);
  }
  // definindo finalidade (inserir ou atualizar atendimento).
  const [finalidade, setfinalidade] = useState(0); // 0 para inserir atendimento, 1 para atualizar atendimento.
  // cadastrando novo atendimento para o paciente selecionado.
  const iniciarAtendimento = () => {
    setfinalidade(0);
    setinsertatendimento(1);
  }
  // modificando o atendimento para o paciente selecionado (movimentando o paciente).
  const modificarAtendimento = () => {
    setfinalidade(1);
    setinsertatendimento(1);
  }

  // modal para confirmar o encerramento de um atendimento.
  const [modalencerraatendimento, setmodalencerraatendimento] = useState(0);
  function ModalEncerraAtendimento() {
    if (modalencerraatendimento === 1) {
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
              {'CONFIRMAR ENCERRAMENTO DO ATENDIMENTO PARA O PACIENTE ' + nomepaciente + '?'}
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
                onClick={() => setmodalencerraatendimento(0)}
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
                onClick={() => encerrarAtendimento()}
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

  // encerrando o atendimento (atualizando o status do atendimento atual para inativo).  
  const encerrarAtendimento = () => {
    var obj = {
      idpaciente: idpaciente,
      hospital: atendimentohospital,
      unidade: atendimentounidade,
      box: atendimentobox,
      admissao: atendimentoadmissao,
      nome: nomepaciente,
      dn: dn,
      peso: atendimentopeso,
      altura: atendimentoaltura,
      antecedentes: atendimentoantecedentes,
      alergias: atendimentoalergias,
      medicacoes: atendimentomedicacoes,
      exames: atendimentoexames,
      historia: atendimentohistoria,
      status: 4, // status indefinido.
      ativo: 0, // inativa o atendimento.
      classificacao: atendimentoclassificacao,
      descritor: atendimentodescritor,
      precaucao: atendimentoprecaucao,
      assistente: 'SEM MÉDICO ASSISTENTE',
    };
    axios.post(html + "/updateatendimento/'" + atendimentoid + "'", obj);
    toast(1, '#52be80', 'ATENDIMENTO ENCERRADO COM SUCESSO.', 3000);
    setTimeout(() => {
      // "descelecionando" um paciente e ocultando o componente de status do atendimento.
      setidpaciente(0);
      setviewcardpaciente(0);
      setstatusatendimento(3);
      setmodalencerraatendimento(0);
      loadPacientes();
    }, 1000);
  }
  // movimentando o paciente (atualizando o hospital, setor e box do atendimento).
  const updateAtendimento = (value) => {
    setinsertatendimento(0);
    setviewtotalbox(0);
    if (value < 10) {
      value = '0' + value;
    }
    var obj = {
      idpaciente: idpaciente,
      hospital: selectedhospital,
      unidade: selectedunidade,
      box: value,
      admissao: atendimentoadmissao,
      nome: nomepaciente,
      dn: dn,
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
      precaucao: atendimentoprecaucao,
      assistente: atendimentoassistente,
    };
    axios.post(html + "/updateatendimento/'" + atendimentoid + "'", obj);
    toast(1, '#52be80', 'PACIENTE MOVIMENTADO COM SUCESSO.', 3000);
    setTimeout(() => {
      // "descelecionando" um paciente e ocultando o componente de status do atendimento.
      setidpaciente(0);
      setviewcardpaciente(0);
      setstatusatendimento(3);
      loadPacientes();
    }, 1000);
  }
  // criando um array com o total de boxes disponíveis para uma unidade.
  const [totalbox, settotalbox] = useState([]);
  const loadArrayBox = (item) => {
    var arraybox = [1];
    var startbox = 1;
    while (arraybox.length < item.leitos) {
      startbox = startbox + 1;
      arraybox.push(startbox);
    }
    setTimeout(() => {
      settotalbox(arraybox);
    }, 1000);
  }
  // listando os box ocupados para uma unidade.
  const [busybox, setbusybox] = useState([]);
  const listBusyBox = (item) => {
    axios.get(html + "/todosatendimentos/'" + item.hospital + "'/'" + item.unidade + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setbusybox(x);
    });
  }
  // função para filtro da array de boxes ocupados, a serem exibidos na lista de boxes.
  // item é o box selecionado da array montada pelo total de leitos da unidade.
  // boxfiltrado é o box selecionado da array de leitos ocupados.
  function checkBusyBox(item) {
    return busybox.filter((boxfiltrado) => {
      return parseInt(boxfiltrado) === parseInt(item);
    })
  }
  // listando todos os boxes da unidade, inativando aqueles ocupados.
  const [viewtotalbox, setviewtotalbox] = useState(0);
  function ShowTotalBox() {
    if (viewtotalbox === 1 && finalidade === 0) {
      return (
        <div
          className="menucover"
          onClick={() => setviewtotalbox(0)}>
          <div className="menucontainer">
            <p className="title1" style={{ fontSize: 18 }}>
              {'SELECIONE O BOX'}
            </p>
            <div
              id="LISTA DE LEITOS."
              className="scroll"
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                alignContent: 'flex-start',
                height: '30vh',
                width: '30vw',
              }}
            >
              {totalbox.map((item) => (
                <button
                  className="blue-button"
                  onClick={(e) => saveAtendimento(item)}
                  // busybox lista o número dos boxes de cada atendimento para a unidade (leitos ocupados).
                  disabled={busybox.filter((valor) => valor.box == item).length > 0 ? true : false}
                  style={{
                    width: 50,
                    height: 50,
                    margin: 5,
                    color: '#ffffff',
                    opacity: busybox.filter((valor) => valor.box == item).length > 0 ? 0.3 : 1
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>{item}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    } else if (viewtotalbox === 1 && finalidade === 1) {
      return (
        <div
          className="menucover"
          onClick={() => setviewtotalbox(0)}
        >
          <div className="menucontainer">
            <p className="title1" style={{ fontSize: 18 }}>
              {'SELECIONE O BOX'}
            </p>
            <div
              id="LISTA DE LEITOS."
              className="scroll"
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                alignContent: 'flex-start',
                borderRadius: 5,
                margin: 0,
                height: '40vh',
                width: '30vw',
              }}
            >
              {totalbox.map((item) => (
                <button
                  className="blue-button"
                  onClick={() => updateAtendimento(item)}
                  disabled={busybox.filter((valor) => valor.box == item).length > 0 ? true : false}
                  style={{
                    width: 50,
                    height: 50,
                    margin: 5,
                    color: '#ffffff',
                    opacity: busybox.filter((valor) => valor.box == item).length > 0 ? 0.3 : 1,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>{item}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  // salvando um novo atendimento.
  const saveAtendimento = (value) => {
    // checando se já existe um atendimento ativo para este paciente.
    axios.get(html + "/checkatendimento/'" + idpaciente + "'/'" + selectedhospital + "'/'" + selectedunidade + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      if (x.length > 0) {
        toast(1, '#ec7063', 'ESTE PACIENTE JÁ SE ENCONTRA EM ATENDIMENTO!', 3000);
      } else {
        if (value < 10) {
          value = '0' + value;
        }
        setinsertatendimento(0);
        setviewtotalbox(0);
        var obj = {
          idpaciente: idpaciente,
          hospital: selectedhospital,
          unidade: selectedunidade,
          box: value,
          admissao: moment().format('DD/MM/YYYY HH:mm'),
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
          classificacao: atendimentoclassificacao,
          descritor: atendimentodescritor,
          precaucao: atendimentoprecaucao,
          assistente: atendimentoassistente,
        };
        axios.post(html + '/insertatendimento', obj);
        toast(1, '#52be80', 'ATENDIMENTO INICIADO PARA O PACIENTE ' + nomepaciente + ', NO ' + selectedhospital +
          ', ' + selectedunidade + '.', 3000);
        setTimeout(() => {
          // "descelecionando" um paciente e ocultando o componente de status do atendimento.
          setidpaciente(0);
          setviewcardpaciente(0);
          setstatusatendimento(3);
          loadPacientes();
        }, 1000);
      }
    });
  }
  // função que exibe as opções de hospital e de unidades para cadastro de um atendimento.
  const [insertatendimento, setinsertatendimento] = useState(0);
  function InsertAtendimento() {
    if (insertatendimento === 1) {
      return (
        <div
          className="menucover"
          onClick={() => setinsertatendimento(0)}
        >
          <div
            className="secondary"
            style={{
              backgroundColor: '#f2f2f2',
              borderRadius: 5,
              padding: 30,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <ShowHospitais></ShowHospitais>
              <ShowUnidades></ShowUnidades>
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
        overflowY: 'hidden',
        width: window.innerWidth,
        height: '100%',
        margin: 0,
        padding: 0,
      }}
    >
      <Header link={tipousuario == 5 ? "/unidades" : "/hospitais"} titulo={'ATENDIMENTOS: ' + nomeunidade}></Header>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', height: '82vh' }}>
        <ShowPacientes></ShowPacientes>
        <CardPaciente></CardPaciente>
      </div>
      <Toast valor={valor} cor={cor} mensagem={mensagem} tempo={tempo}></Toast>
      <ModalDeletePaciente></ModalDeletePaciente>
      <ModalEncerraAtendimento></ModalEncerraAtendimento>
      <PacienteView></PacienteView>
      <InsertAtendimento></InsertAtendimento>
      <ShowTotalBox></ShowTotalBox>
    </div>
  );
}

export default Atendimentos;
