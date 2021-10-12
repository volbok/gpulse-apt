/* eslint eqeqeq: "off" */
import React, { useState, useContext, useCallback } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import moment, { locale } from 'moment';
import deletar from '../images/deletar.svg';
import editar from '../images/editar.svg';
import salvar from '../images/salvar.svg';
import novo from '../images/novo.svg';
import Header from '../components/Header';
import Toast from '../components/Toast';
import Context from '../Context';

function Farmacia() {
  var html = 'https://pulsarapp-server.herokuapp.com';
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


  // carregando a lista de pacientes.
  const [listpacientes, setlistpacientes] = useState([]);
  const loadPacientes = () => {
    axios.get(html + "/pacientes").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistpacientes(x);
    });
  }

  // carregando a lista de atendimentos.
  const [listatendimentos, setlistatendimentos] = useState([]);
  const loadAtendimentos = () => {
    setlistatendimentos([0, 1]);
    axios.get(html + "/atendimentos").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistatendimentos(x.filter((item) => item.ativo !== 0 && item.hospital == nomehospital && item.unidade == nomeunidade));
    });
  }

  // renderização da lista de pacientes.
  function ShowPacientes() {
    if (listatendimentos.length > 0) {
      return (
        <div
          className="scroll"
          id="LISTA DE PACIENTES"
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            borderRadius: 5,
            margin: 0,
            paddding: 0,
            borderRadius: 0,
            height: '50vh',
            width: '65vw',
          }}
        >
          {listatendimentos.map((item) => (
            <div
              key={item.id}
              className="row"
              style={{
                position: 'relative',
                width: '100%',
              }}
            >
              <button
                className="widget"
                style={{ minWidth: 50, margin: 2.5, color: '#ffffff', backgroundColor: 'grey' }}
                title="BOX"
                disabled="true"
              >
                {item.box}
              </button>
              <div
                onClick={() => selectPaciente(item)}
                className={item.idpaciente == idpaciente ? 'red-button' : 'blue-button'}
                title="CLIQUE PARA PREPARAR SEPARAR AS MEDICAÇÕES."
                style={{
                  margin: 2.5,
                  width: '100%',
                }}
              >
                {listpacientes.filter((value) => value.id == item.idpaciente).map((item) => item.nome)}
              </div>
              <div
                className="title2"
                style={{
                  alignSelf: 'center',
                  margin: 2.5,
                  width: 150,
                }}
              >
                {item.dn}
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
            justifyContent: 'flex-start',
            borderRadius: 5,
            margin: 5,
            marginLeft: 5,
            minHeight: '70vh',
            height: '70vh',
          }}
        >
          <p className="title2"
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              margin: 10,
              padding: 0,
            }}>
            {'NÃO HÁ PACIENTES INTERNADOS NESTA UNIDADE.'}
          </p>
        </div>
      )
    }
  }

  // cabeçalho da lista de pacientes.
  function CabecalhoPacientes() {
    return (
      <div className="rowheader"
        style={{
          marginBottom: -20, paddingBottom: -20, paddingLeft: 25, paddingRight: 30,
          opacity: 0.3, fontSize: 12, width: '65vw'
        }}>
        <button
          className="rowitem"
          style={{
            width: 50,
            margin: 2.5,
          }}
          title="BOX"
          disabled="true"
        >
          BOX
        </button>
        <button
          className="rowitem"
          style={{
            margin: 2.5,
            width: '100%',
          }}
        >
          NOME
        </button>
        <button
          className="rowitem"
          style={{
            margin: 2.5,
            width: 150,
          }}
        >
          DATA DE NASCIMENTO
        </button>
      </div >
    );
  }

  // selecionando um paciente da lista e carregando os registros de prescrições.
  const selectPaciente = (item) => {
    setidpaciente(item.idpaciente);
    setidatendimento(item.id);
    loadPrescricoes(item.id);
  };

  // carregando a lista de prescrições.
  const [prescricoes, setprescricoes] = useState([]);
  const loadPrescricoes = (value) => {
    axios.get(html + "/prescricoes/'" + value + "'").then((response) => {
      var x = [0, 1];
      var x = response.data;
      var y = x.filter(item => item.idprescricao == value);
      setprescricoes(response.data);
    });
  }

  // exibindo a lista de prescrições.
  const ShowPrescricoes = useCallback(() => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="title2" style={{ opacity: 0.3, display: prescricoes.length > 0 ? 'flex' : 'none' }}>PRESCRIÇÕES</div>
        <div
          className="scroll"
          id="LISTA DE PRESCRIÇÕES"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            borderRadius: 5,
            padding: 0,
            margin: 0,
            height: '45vh',
            width: '12vw'
          }}
        >
          {prescricoes.map((item) => (
            <button
              id={"prescricao" + item.id}
              className="blue-button"
              onClick={() => {
                var botoes = document.getElementById("LISTA DE PRESCRIÇÕES").getElementsByClassName("red-button");
                for (var i = 0; i < botoes.length; i++) {
                  botoes.item(i).className = "blue-button";
                }
                selectPrescricao(item); document.getElementById("prescricao" + item.id).className = 'red-button'
              }}
              style={{ margin: 5, padding: 10 }}
              title="PRESCRIÇÃO"
            >
              {item.data}
            </button>
          ))}
        </div>
      </div>
    );
  }, [prescricoes]);

  // selecionando uma prescrição e carregando os itens de prescrição relacionados.
  const [idprescricao, setidprescricao] = useState(0);
  const selectPrescricao = (item) => {
    setidprescricao(item.id);
    loadItensPrescricao(item.id);
  }

  // resgatando todos os itens da prescrição selecionada.
  const [itensprescricao, setitensprescricao] = useState([]);
  const loadItensPrescricao = (value) => {
    axios.get(html + "/checagemprescricao/" + value).then((response) => {
      var x = [0, 1];
      var x = response.data;
      var y = x.filter(item => item.idprescricao == value);
      setitensprescricao(y); // array a ser mapeada para a criação dos saquinhos.
    });
  }

  // resgatando todos os componentes dos itens prescritos.
  const [componentesprescricao, setcomponentesprescricao] = useState([]);
  const loadComponentesPrescricao = () => {
    axios.get(html + "/loadcomponenteview").then((response) => {
      setcomponentesprescricao(response.data);
    });
  }

  // renderização do saquinhos de medicamentos.
  function ShowSaquinhos() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="title2" style={{ opacity: 0.3, display: itensprescricao.length > 0 ? 'flex' : 'none' }}>ITENS PARA DISPENSAÇÃO</div>
        <div
          className="scroll"
          id="LISTA DE SAQUINHOS"
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignContent: 'flex-start',
            flexWrap: 'wrap',
            borderRadius: 5,
            padding: 0,
            margin: 0,
            width: '56vw',
            height: '45vh'
          }}
        >
          {itensprescricao.map((item) => (
            <div
              key={item.id}
              className="row"
              style={{
                display: item.grupo == 'CUIDADOS GERAIS' ? 'none' : 'flex',
                position: 'relative',
                padding: 0,
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0,
                paddingBottom: 0,
                margin: 0,
                width: 0.3225 * document.getElementById("LISTA DE SAQUINHOS").offsetWidth,
                backgroundColor: 'transparent',
                boxShadow: 'none',
              }}
            >
              <button
                onClick={
                  item.liberado == 1 ? () => toast(1, '#ec7063', 'ITEM JÁ DISPENSADO.', 3000) :
                    item.liberado == 0 && (moment(item.horario, 'DD/MM/YY HH:mm') > moment().startOf('day').add(13, 'hours') &&
                      moment(item.horario, 'DD/MM/YY HH:mm') < moment().startOf('day').add(37, 'hours')) ? () => liberaSaquinho(item) : () => toast(1, '#ec7063', 'ITEM FORA DO PRAZO PARA LIBERAÇÃO', 3000)}
                className={item.liberado == 1 ? "green-button" : "blue-button"}
                style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 5, margin: 5, width: '100%',
                  opacity: moment(item.horario, 'DD/MM/YY HH:mm') > moment().startOf('day').add(13, 'hours') &&
                    moment(item.horario, 'DD/MM/YY HH:mm') < moment().startOf('day').add(37, 'hours') ? 1 : 0.6
                }}
              >
                <div styles={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10, margin: 0 }}>
                  <div className="blue-button" style={{ textDecoration: 'underline', fontSize: 14, padding: 10, margin: 10, height: 50, backgroundColor: 'transparent', boxShadow: 'none' }}>{item.farmaco}</div>
                  <div style={{ fontSize: 14, textDecoration: '', marginTop: 10, marginBottom: 10 }}>{item.qtde + 'UN.'}</div>
                  <div style={{ fontSize: 14, marginBottom: 5 }}>{item.horario}</div>
                  <div style={{ marginTop: 0, marginBottom: 10 }}>{componentesprescricao.filter(value => value.iditem == item.iditem).length > 0 ? 'COMPONENTES:' : 'SEM COMPONENTES'}</div>
                  <div className="scroll" style={{ display: componentesprescricao.filter(value => value.iditem == item.iditem).length > 0 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'flex-start', padding: 5, height: 160, margin: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                      {componentesprescricao.filter(value => value.iditem == item.iditem).map(item => (
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                          <div className="widget" style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', textAlign: 'left' }}>
                            {item.componente}
                          </div>
                          <div className="widget" style={{ width: 75, display: 'flex', flexDirection: 'row', justifyContent: 'center', textAlign: 'center' }}>
                            {item.quantidade + ' UN.'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // função que contabiliza a saída de itens prescritos e respectivos componentes, ao ser liberado o "saquinho".
  const liberaSaquinho = (item) => {
    // atualiza o item como liberado.
    var obj = {
      idpaciente: item.idpaciente,
      idatendimento: item.idatendimento,
      idprescricao: item.idprescricao,
      iditem: item.iditem,
      grupo: item.grupo,
      farmaco: item.farmaco,
      qtde: item.qtde,
      via: item.via,
      prazo: item.prazo,
      horario: item.horario,
      liberado: 1, // atualizou status de liberado.
      checado: item.checado,
      datachecado: item.datachecado,
    };
    axios.post(html + "/updatechecagemprescricao/" + item.id, obj).then(() => {
      loadItensPrescricao(idprescricao);
      loadComponentesPrescricao();
      // RETIRANDO DO ESTOQUE O ITEM DE PRESCRIÇÃO LIBERADO NO SAQUINHO.
      // filtrando um item da tabela options_itens de acordo com o nome do item/fármaco prescrito.
      var status = estoque.filter(value => value.farmaco == item.farmaco).map(item => item.status);
      var componente = estoque.filter(value => value.farmaco == item.farmaco).map(item => item.componente);
      // deduzindo o item e seus componentes do estoque.
      id = estoque.filter(value => value.farmaco == item.farmaco).map(item => item.id);
      retiraItemDoEstoque(item, id);
      // RETIRANDO DO ESTOQUE OS COMPONENTES...
      setTimeout(() => {
        var arrayfarmacos = componentesprescricao.filter(value => value.iditem == item.iditem).map(value => value.componente);
        var arraylenght = arrayfarmacos.length;
        var takefarmaco = 0;
        while (arraylenght > 0) {
          var filtro = arrayfarmacos[takefarmaco];
          estoque.filter(value => value.farmaco == filtro).map(item => retiraItemDoEstoque(item, item.id));
          arraylenght = arraylenght - 1;
          takefarmaco = takefarmaco + 1;
        }
        loadComponentesPrescricao();
        loadEstoque();
      }, 4000);
    });
  }

  var id = 0;
  // função para deduzir do estoque itens da tabela options_itens.
  const retiraItemDoEstoque = (item, id) => {
    var codigo = estoque.filter(value => value.farmaco == item.farmaco).map(item => item.codigo);
    var observacao = estoque.filter(value => value.farmaco == item.farmaco).map(item => item.observacao);
    var status = estoque.filter(value => value.farmaco == item.farmaco).map(item => item.status);
    var componente = estoque.filter(value => value.farmaco == item.farmaco).map(item => item.componente);
    var estoqueinicial = estoque.filter(value => value.farmaco == item.farmaco).map(item => item.estoque);
    var obj = {
      codigo: codigo,
      grupo: item.grupo,
      farmaco: item.farmaco,
      qtde: item.qtde, // caputurar obrigatoriamente do item prescrito (tabela prescricao_checagem), pois o usuário pode ter prescrito valores diferentes do padrão definido para o item na tabela options_itens.
      via: item.via, // o mesmo para via.
      horario: item.prazo, // o mesmo para horários.
      observacao: observacao, // mesma aplicação.
      status: status,
      componente: componente,
      estoque: estoqueinicial - item.qtde, // efetuando a retirada do item no estoque.
    };
    axios.post(html + "/updateoptionsitens/" + id, obj);
  }

  // ## ESTOQUE ##
  // botão flutuante que dá acesso ao estoque:
  function clickBtnEstoque() {
    loadEstoque();
    setviewestoque(1);
  }
  function BtnEstoque() {
    return (
      <button
        className="red-button"
        title="CLIQUE PARA ACESSAR O ESTOQUE."
        onClick={() => clickBtnEstoque()}
        style={{
          position: 'absolute',
          left: 5,
          bottom: 5,
          width: 70,
          height: 70,
          margin: 5,
          padding: 5,
          fontSize: 24,
          fontWeight: 'bolder',
          zIndex: 900,
          opacity: 1,
        }}
      >
        E
      </button>
    );
  }

  // carregando os totais de itens/fármacos (extraídos da tabela options_itens).
  const [estoque, setestoque] = useState([]);
  const loadEstoque = () => {
    setestoque([]);
    axios.get(html + "/optionsitens").then((response) => {
      setestoque(response.data);
    });
  }

  // filtro de itens do estoque.
  var searchestoque = '';
  const filterEstoque = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterEstoque").focus();
    searchestoque = document.getElementById("inputFilterEstoque").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchestoque == '') {
        loadEstoque();
        document.getElementById("inputFilterEstoque").focus();
      } else {
        setestoque(estoque.filter(item => item.farmaco.includes(searchestoque)));
        document.getElementById("inputFilterEstoque").value = searchestoque;
        document.getElementById("inputFilterEstoque").focus();
      }
    }, 100);
  }

  // filtro de itens do estoque:
  function FilterEstoque() {
    return (
      <input
        className="input darkinput"
        autoComplete="off"
        placeholder="BUSCAR NO ESTOQUE..."
        onFocus={(e) => (e.target.placeholder = '')}
        onBlur={(e) => (e.target.placeholder = 'BUSCAR NO ESTOQUE...')}
        onChange={() => filterEstoque()}
        style={{
          width: '26vw',
          margin: 5, padding: 5,
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          color: '#ffffff',
        }}
        type="text"
        id="inputFilterEstoque"
        defaultValue={searchestoque}
        maxLength={100}
      ></input>
    );
  }

  // exibição do estoque:
  const [viewestoque, setviewestoque] = useState(0);
  const Estoque = useCallback(() => {
    return (
      <div
        className="scrolldrop"
        id="LISTA DE ESTOQUE"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          borderRadius: 5,
          height: '100%',
          width: '100%',
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          boxShadow: 'none',
        }}
      >
        {estoque.filter(item => item.grupo !== 'CUIDADOS GERAIS').map((item) => (
          <div className="row" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="animated-div" style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <button className="animated-yellow-button"
                onClick={() => updateEstoque(item)}
                title={"MOVIMENTAR O ESTOQUE DE " + item.farmaco + '.'}
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
                onClick={() => modal(item)}
                title={"EXCLUIR O ITEM " + item.farmaco + 'DO ESTOQUE E DA LISTA DE FÁRMACOS PADRONIZADOS NO HOSPITAL.'}
                style={{ marginRight: 7.5 }}
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
            <div
              key={item.id}
              style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'center',
                alignItems: 'flex-start', padding: 5,
              }}
            >
              <title
                className={"title2"}
                style={{ width: '100%', alignSelf: 'center', justifyContent: 'flex-start' }}
                title="FÁRMACO OU INSUMO."
              >
                {item.farmaco}
              </title>
              <div
                className="blue-button"
                style={{
                  marginLeft: 10,
                  backgroundColor: item.estoque < 50 ? '#ec7063' : item.estoque > 49 && item.estoque < 100 ? '#f5b041' : '#52be80'
                }}
                title="QUANTIDADE NO ESTOQUE."
              >
                {item.estoque}
              </div>
            </div>
          </div>
        ))}
        <button className="green-button"
          onClick={() => setviewnovoitemprescricao(1)}
          title="INSERIR ITEM..."
          style={{
            position: 'sticky',
            bottom: 5, left: 5,
            width: 50,
            height: 50,
            alignSelf: 'flex-start'
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
    );
  }, [estoque]);

  // abrindo a tela para atualização do estoque.
  const [iditem, setiditem] = useState(0);
  const [codigoitem, setcodigoitem] = useState(0);
  const [grupoitem, setgrupoitem] = useState(0);
  const [farmacoitem, setfarmacoitem] = useState('');
  const [qtdeitem, setqtdeitem] = useState(0);
  const [viaitem, setviaitem] = useState('');
  const [horarioitem, sethorarioitem] = useState('');
  const [observacaoitem, setobservacaoitem] = useState('');
  const [statusitem, setstatusitem] = useState(0);
  const [componenteitem, setcomponenteitem] = useState(0);
  const [estoqueitem, setestoqueitem] = useState(0);
  const updateEstoque = (item) => {
    setiditem(item.id);
    setcodigoitem(item.codigo);
    setgrupoitem(item.grupo);
    setfarmacoitem(item.farmaco);
    setqtdeitem(item.qtde);
    setviaitem(item.via);
    sethorarioitem(item.horario);
    setobservacaoitem(item.observacao);
    setstatusitem(item.status);
    setcomponenteitem(item.componente);
    setestoqueitem(item.estoque);
    setviewupdateestoque(1);
  }

  var qtde = 0;
  const validateQtde = (txt) => {
    var number = /[0-9]/;
    var last = txt.slice(-1);
    if (last.match(number) !== null) {
    } else {
      document.getElementById('inputQtde').value = '';
      // qtde = document.getElementById('inputQtde').value;
    }
  };

  // aumentando ou reduzindo o valor de estoue de um item/fármaco.
  var fluxo = '';
  var delta = 0;
  var motivo = '';
  const clickAddItem = () => {
    if (document.getElementById("inputQtde").value > 0) {
      setestoqueitem(estoqueitem + parseInt(document.getElementById("inputQtde").value));
      fluxo = 'ENTRADA';
      delta = parseInt(document.getElementById("inputQtde").value);
      motivo = document.getElementById("inputMotivo").value;
      updateItem(estoqueitem + parseInt(document.getElementById("inputQtde").value));
      setTimeout(() => {
        addLog();
        setviewupdateestoque(0);
        loadEstoque();
      }, 1000);
    } else {
      toast(1, '#ec7063', 'INFORMAR VALOR A SER ADICIONADO AO ESTOQUE.', 3000)
    }
  }
  const clickReduceItem = () => {
    if (document.getElementById("inputQtde").value > 0 && document.getElementById("inputQtde").value < estoqueitem) {
      setestoqueitem(estoqueitem - parseInt(document.getElementById("inputQtde").value));
      fluxo = 'SAÍDA';
      delta = parseInt(document.getElementById("inputQtde").value);
      motivo = document.getElementById("inputMotivo").value;
      updateItem(estoqueitem - parseInt(document.getElementById("inputQtde").value));
      setTimeout(() => {
        addLog();
        setviewupdateestoque(0);
        loadEstoque();
      }, 1000);
    } else if (estoqueitem < document.getElementById("inputQtde").value) {
      toast(1, '#ec7063', 'ESTOQUE INSUFICIENTE PARA A RETIRADA.', 3000);
    } else {
      toast(1, '#ec7063', 'INFORMAR VALOR A SER RETIRADO DO ESTOQUE.', 3000);
    }
  }

  // atualizando item (fármaco).
  const updateItem = (value) => {
    // atualizando o item/fármaco, com seu novo estoque.
    var obj = {
      codigo: codigoitem,
      grupo: grupoitem,
      farmaco: farmacoitem.toUpperCase(),
      qtde: qtdeitem,
      via: viaitem,
      horario: horarioitem,
      observacao: observacaoitem.toUpperCase(),
      status: statusitem,
      componente: componenteitem,
      estoque: value,
    };
    axios.post(html + "/updateoptionsitens/" + iditem, obj);
  }

  // registrando operação na tabela de controle (estoque_controle).
  const addLog = () => {
    var obj = {
      data: moment().format('DD/MM/YYYY - HH:mm'),
      fluxo: fluxo,
      farmaco: farmacoitem,
      qtde: delta,
      usuario: idusuario,
      motivo: motivo,
    };
    axios.post(html + '/insertestoquecontrole', obj);
  }

  // deletando um item (fármaco).
  const deleteItem = () => {
    axios.get(html + "/deleteoptionsitens/" + iditem);
    loadEstoque();
    setviewmodal(0);
  }

  // tela para atualização de estoque de um item.
  const [viewupdateestoque, setviewupdateestoque] = useState(0);
  function ViewUpdateEstoque() {
    if (viewupdateestoque == 1) {
      return (
        <div className="menucover" style={{ zIndex: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer" style={{ width: 500 }}>
            <div id="cabeçalho" className="cabecalho">
              <div className="title5">{'ESTOQUE DE ' + farmacoitem + '.'}</div>
              <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="red-button" style={{ height: 50 }} onClick={() => setviewupdateestoque(0)}>
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
            <div className="corpo">
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div className="red-button" style={{ padding: 5, marginBottom: 5, width: 150 }}>{estoqueitem + ' UN.'}</div>
                <button
                  className="red-button"
                  title="CLIQUE PARA RETIRAR UNIDADES DO ITEM."
                  onClick={() => clickReduceItem()}
                  style={{
                    fontSize: 20,
                    display: 'flex',
                    width: 50,
                    height: 50,
                  }}
                >
                  -
                </button>
                <input
                  className="input"
                  autoComplete="off"
                  placeholder="QTDE."
                  title="QUANTIDADE A ACRESCENTAR OU A REDUZIR."
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'QTDE.')}
                  onChange={(e) => validateQtde(e.target.value)}
                  defaultValue={0}
                  style={{
                    height: 50,
                    width: window.innerWidth > 800 ? 100 : 50,
                    margin: 2.5,
                    padding: 5,
                  }}
                  id="inputQtde"
                  maxLength={4}
                ></input>
                <button
                  className="green-button"
                  title="CLIQUE PARA ADICIONAR UNIDADES DO ITEM."
                  onClick={() => clickAddItem()}
                  style={{
                    fontSize: 20,
                    display: 'flex',
                    width: 50,
                    height: 50,
                  }}
                >
                  +
                </button>
              </div>
              <textarea
                className="textarea"
                autoComplete="off"
                placeholder="MOTIVO."
                title="JUSTIFICATIVA PARA A ALTERAÇÃO DO ESTOQUE."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'MOTIVO.')}
                onChange={(e) => motivo = e.target.value}
                style={{
                  height: 100,
                  width: '100%',
                  margin: 2.5,
                  padding: 5,
                }}
                id="inputMotivo"
                type="text"
                maxLength={200}
              ></textarea>
            </div>
          </div>
        </div>

      );
    } else {
      return null;
    }
  }

  // cadastrando o novo item (fármaco).
  const insertNovoItem = () => {
    var obj = {
      codigo: codigonovoitem,
      grupo: gruponovoitem,
      farmaco: apresentacaonovoitem.toUpperCase(),
      qtde: quantidadenovoitem,
      via: vianovoitem,
      horario: horarionovoitem,
      observacao: observacoesnovoitem.toUpperCase(),
      status: 0,
      componente: componentenovoitem,
      estoque: estoquenovoitem,
    };
    axios.post(html + '/insertoptionsitens', obj).then(() => {
      setviewnovoitemprescricao(0);
      loadEstoque();
    });
  }

  // função para exibir o modal que confirma a exclusão de uma opção de item/fármaco.
  const modal = (item) => {
    setviewmodal(1);
    setiditem(item.id);
  }
  // modal para confirmação da exclusão de um item/fármaco do estoque e das opções de prescrição.
  const [viewmodal, setviewmodal] = useState(0);
  function Modal() {
    if (viewmodal == 1) {
      return (
        <div className="menucover" style={{ zIndex: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer">
            <div
              className="secondary"
              style={{
                alignItems: 'center',
                textAlign: 'center',
                padding: 5,
                width: 500,
                color: '#1f7a8c',
                fontWeight: 'bold',
              }}>
              {'TEM CERTEZA DE QUE DESEJA EXCLUIR O ITEM ' + farmacoitem + ' DO ESTOQUE E RETIRÁ-LO COMO OPÇÃO DE MEDICAMENTO PADRONIZADO DO HOSPITAL?'}
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 5,
            }}>
              <button
                className="red-button"
                onClick={() => setviewmodal(0)}
                style={{
                  width: 150,
                  padding: 5,
                }}
              >
                CANCELAR
              </button>
              <button
                className="green-button"
                onClick={() => deleteItem()}
                style={{
                  width: 150,
                  marginRight: 0,
                  padding: 5,
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
  }

  // listas de opções para preenchimento de informações posológicas referentes a um novo item de prescrição.
  // definindo o grupo/classe ao qual será vinculado o item/fármaco (necessário para uma classificação e agrupamento dos itens na lista de prescrição).
  const [gruponovoitem, setgruponovoitem] = useState();
  var arraygrupo = [ // PENDÊNCIA: transformar isso em tabela no banco de dados.
    'ANTIBIOTICOS',
    'SEDACAO',
    'SINTOMATICOS',
    'SOLUCOES',
    'CORTICOIDES',
    'INALATORIOS',
    'ANALGESICOS',
    'COMPONENTES',
  ]
  const selectGrupo = (item) => {
    setgruponovoitem(item);
    setshowitemgruposelector(0);
  }

  // visualizando a lista de opções de grupos.
  const [showitemgruposelector, setshowitemgruposelector] = useState();
  function ShowItemGrupoSelector() {
    if (showitemgruposelector == 1) {
      return (
        <div
          className="menucover"
          onClick={() => setshowitemgruposelector(0)}
          style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        >
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2">CLASSE DO ITEM:</div>
            <div
              className="scroll"
              id="LISTA DE GRUPOS"
              style={{
                height: '40vh',
              }}
            >
              {arraygrupo.map((item) => (
                <button
                  key={item.id}
                  onClick={(e) => { selectGrupo(item); e.stopPropagation() }}
                  className="blue-button"
                  style={{
                    width: '15vw',
                    margin: 2.5,
                    padding: 5,
                    flexDirection: 'column',
                  }}
                >
                  {item}
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

  // definindo o grupo de componentes (código) ao qual será vinculado o item/fármaco.
  const [codigonovoitem, setcodigonovoitem] = useState();
  var arraycodigo = [ // PENDÊNCIA: transformar isso em tabela no banco de dados.
    'abd10ml',
    'abd20ml',
    'soroesquema',
    'sf100ml',
    'sf250ml',
    'sf500ml',
  ]
  const selectCodigo = (item) => {
    setcodigonovoitem(item);
    setshowitemcodigoselector(0);
  }

  // visualizando a lista de opções de grupos.
  const [showitemcodigoselector, setshowitemcodigoselector] = useState();
  function ShowItemCodigoSelector() {
    if (showitemcodigoselector == 1) {
      return (
        <div
          onClick={() => setshowitemcodigoselector(0)}
          className="menucover"
          style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        >
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2">GRUPO DE COMPONENTES:</div>
            <div
              className="scroll"
              id="LISTA DE CÓDIGOS"
              style={{
                height: '40vh',
              }}
            >
              {arraycodigo.map((item) => (
                <button
                  key={item.id}
                  onClick={(e) => { selectCodigo(item); e.stopPropagation() }}
                  className="blue-button"
                  style={{
                    width: '15vw',
                  }}
                >
                  {item}
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

  // definindo se o novo item a ser cadastrado também pode ser classificado como componente.
  const [componentenovoitem, setcomponentenovoitem] = useState(0);
  const setComponenteNovoItem = () => {
    if (componentenovoitem == 0) {
      setcomponentenovoitem(1);
    } else {
      setcomponentenovoitem(0);
    }
  }

  // definindo o nome e apresentação do item/fármaco a ser cadastrado.
  const [apresentacaonovoitem, setapresentacaonovoitem] = useState();
  const updateApresentacaoNovoItem = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setapresentacaonovoitem(document.getElementById("inputApresentacao").value);
    }, 1000);
  }
  // definindo a quantidade padrão de um item a ser administrada (NÃO É A QUANTIDADE DO ESTOQUE DESTE ITEM!).
  const [quantidadenovoitem, setquantidadenovoitem] = useState(0);
  const updateNovoItemQuantidade = (valor) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      var number = /[0-9]/;
      var last = valor.slice(-1);
      if (last.match(number) !== null) {
        setquantidadenovoitem(valor);
      } else {
        document.getElementById('inputQtde').value = 0;
        setquantidadenovoitem(0);
      }
    }, 1000);
  }
  // definindo a quantidade de estoque de um item/fármaco.
  const [estoquenovoitem, setestoquenovoitem] = useState(0);
  const updateNovoItemEstoque = (valor) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      var number = /[0-9]/;
      var last = valor.slice(-1);
      if (last.match(number) !== null) {
        setestoquenovoitem(valor);
      } else {
        document.getElementById('inputItemEstoque').value = 0;
        setestoquenovoitem(0);
      }
    }, 1000);
  }
  // renderização do seletor de opções para via de adminitração de um item.
  const [showitemviaselector, setshowitemviaselector] = useState(0);
  var arrayitemvia = ['VO', 'IV', 'IM', 'SC', 'INTRADÉRMICA', 'HIPODERMÓCLISE', 'INTRATECAL'];
  const [vianovoitem, setvianovoitem] = useState();
  function ShowItemViaSelector() {
    if (showitemviaselector == 1) {
      return (
        <div
          className="menucover"
          onClick={() => setshowitemviaselector(0)}
          style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2">VIA DE ADMINISTRAÇÃO</div>
            <div
              className="scroll"
              id="LISTA DE VIAS DE ADMINISTRAÇÃO DO ITEM DA PRESCRIÇÃO"
              style={{
                height: '40vh',
              }}
            >
              {arrayitemvia.map((item) => (
                <button
                  key={item.id}
                  onClick={(e) => { selectVia(item); e.stopPropagation() }}
                  className="blue-button"
                  style={{
                    width: '15vw',
                    margin: 2.5,
                    padding: 10,
                    flexDirection: 'column',
                  }}
                >
                  {item}
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
  // selecção de uma opção de via de administração do item cadastrado.
  const selectVia = (item) => {
    setvianovoitem(item);
    setshowitemviaselector(0);
  }
  // renderização do seletor de opções para horários de adminitração de um item.
  const [showitemhorarioselector, setshowitemhorarioselector] = useState(0);
  var arrayitemhorario = ['1/1H', '2/2H', '3/3H', '4/4H', '6/6H', '8/8H', '12/12H', '24/24H', '48/48H', '72/72H', 'ACM', 'SN', 'AGORA'];
  const [horarionovoitem, sethorarionovoitem] = useState();
  function ShowItemHorariosSelector() {
    if (showitemhorarioselector == 1) {
      return (
        <div
          className="menucover"
          onClick={() => setshowitemhorarioselector(0)}
          style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        >
          <div className="menucontainer" style={{ padding: 10 }}>
            <text className="title2" style={{ width: '15vw', textAlign: 'center'}}>{'HORÁRIOS DE ADMINISTRAÇÃO'}</text>
            <div
              className="scroll"
              id="LISTA DE HORÁRIOS PARA ADMINISTRAÇÃO DO ITEM DA PRESCRIÇÃO"
              style={{
                height: '40vh',
              }}
            >
              {arrayitemhorario.map((item) => (
                <button
                  key={item.id}
                  onClick={(e) => { selectHorario(item); e.stopPropagation() }}
                  className="blue-button"
                  style={{
                    width: '15vw',
                    margin: 2.5,
                    padding: 10,
                    flexDirection: 'column',
                  }}
                >
                  {item}
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
  // seleção de uma opção de horário de administração do item cadastrado.
  const selectHorario = (item) => {
    sethorarionovoitem(item);
    setshowitemhorarioselector(0);
  }
  // definindo as observações relativas ao item da prescrição.
  const [observacoesnovoitem, setobservacoesnovoitem] = useState();
  const updateNovoItemObservacoes = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setobservacoesnovoitem(document.getElementById("inputObservacoes").value);
    }, 1000);
  }

  // tela para adição de um novo item de prescrição (informando-se inclusive via de administração, posologia, etc.).
  const [viewnovoitemprescricao, setviewnovoitemprescricao] = useState();
  function NovoItemPrescricao() {
    if (viewnovoitemprescricao == 1) {
      return (
        <div className="menucover" style={{ zIndex: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer">
            <div id="cabeçalho" className="cabecalho">
              <div className="title5">{'ADICIONAR NOVO ITEM AO ESTOQUE'}</div>
              <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="green-button"
                  onClick={() => insertNovoItem()}
                  style={{
                    width: 50,
                    height: 50,
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
                <button className="red-button" style={{ height: 50 }} onClick={() => setviewnovoitemprescricao(0)}>
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
            <div className="corpo">
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="title2" style={{ fontSize: 14 }}>GRUPO:</div>
                  <button
                    className="blue-button"
                    title="GRUPO/CLASSIFICAÇÃO DO ITEM."
                    onClick={() => setshowitemgruposelector(1)}
                    style={{
                      display: 'flex',
                      width: 200,
                      height: 50,
                      margin: 2.5,
                      padding: 5,
                      flexDirection: 'column',
                    }}
                  >
                    <div>{gruponovoitem}</div>
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="title2" style={{ fontSize: 14 }}>CÓDIGO:</div>
                  <button
                    className="blue-button"
                    title="CÓDIGO PARA GRUPO DE COMPONENTES."
                    onClick={() => setshowitemcodigoselector(1)}
                    style={{
                      display: 'flex',
                      width: 200,
                      height: 50,
                      margin: 2.5,
                      padding: 5,
                      flexDirection: 'column',
                    }}
                  >
                    <div>{codigonovoitem}</div>
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="title2" style={{ fontSize: 14 }}>ITEM:</div>
                  <input
                    title="NOME E APRESENTAÇÃO DO ITEM."
                    id="inputApresentacao"
                    className="input"
                    autoComplete="off"
                    defaultValue={apresentacaonovoitem}
                    onKeyUp={(e) => updateApresentacaoNovoItem(e.target.value)}
                    style={{
                      width: 350,
                      height: 50,
                      justifyContent: 'center',
                    }}
                  >
                  </input>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="title2" style={{ fontSize: 14 }}>QTDE:</div>
                  <input
                    id="inputQtde"
                    className="input"
                    defaultValue={quantidadenovoitem}
                    autoComplete="off"
                    placeholder="QTDE."
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'QTDE.')}
                    title="QUANTIDADE A SER USADA NA POSOLOGIA PADRÃO."
                    style={{
                      display: 'flex',
                      width: 100,
                      height: 50,
                    }}
                    onKeyUp={(e) => updateNovoItemQuantidade(e.target.value)}
                    onMouseLeave={(e) => updateNovoItemQuantidade(e.target.value)}
                    type="number"
                    maxLength={3}>
                  </input>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="title2" style={{ fontSize: 14 }}>VIA:</div>
                  <button
                    className="blue-button"
                    onClick={() => setshowitemviaselector(1)}
                    style={{
                      display: 'flex',
                      width: 200,
                      height: 50,
                      margin: 5,
                      padding: 5,
                      flexDirection: 'column',
                    }}
                  >
                    <div>{vianovoitem}</div>
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="title2" style={{ fontSize: 14 }}>HORÁRIO:</div>
                  <button
                    className="blue-button"
                    onClick={() => setshowitemhorarioselector(1)}
                    style={{
                      width: 120,
                      height: 50,
                      margin: 5,
                      padding: 5,
                      flexDirection: 'column',
                    }}
                  >
                    <div>{horarionovoitem}</div>
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="title2" style={{ fontSize: 14 }}>OBSERVAÇÕES:</div>
                  <textarea
                    id="inputObservacoes"
                    title="OBSERVAÇÕES SOBRE PREPARO E ADMINISTRAÇÃO."
                    className="textarea"
                    defaultValue={observacoesnovoitem}
                    onKeyUp={(e) => updateNovoItemObservacoes(e.target.value)}
                    style={{
                      width: '40vw',
                      margin: 2.5,
                      height: '25vh',
                      justifyContent: 'flex-start',
                    }}
                  >
                  </textarea>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 300, alignItems: 'center' }}>
                  <div className="title2" style={{ fontSize: 14 }}>ESTOQUE:</div>
                  <input
                    className="input"
                    defaultValue={estoquenovoitem}
                    autoComplete="off"
                    placeholder="QTDE."
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'QTDE.')}
                    title="QUANTIDADE EM ESTOQUE."
                    style={{
                      width: 100,
                      height: 50,
                      margin: 2.5,
                    }}
                    onKeyUp={(e) => updateNovoItemEstoque(e.target.value)}
                    onMouseLeave={(e) => updateNovoItemEstoque(e.target.value)}
                    type="number"
                    id="inputItemEstoque"
                    maxLength={4}>
                  </input>
                  <button
                    className={componentenovoitem == 0 ? "blue-button" : "red-button"}
                    onClick={() => setComponenteNovoItem()}
                    style={{
                      display: 'flex',
                      width: '20vw',
                      margin: 10,
                      padding: 10,
                      flexDirection: 'column',
                    }}
                  >
                    <div>HABILITAR STATUS DE COMPONENTE</div>
                  </button>
                </div>
              </div>
            </div>
          </div >
        </div>
      );
    } else {
      return null;
    }
  }

  useEffect(() => {
    // carregando a lista de pacientes e de atendimentos.
    setidpaciente(0);
    loadPacientes();
    loadAtendimentos();
    // carregando os componentes de todas as prescrições.
    loadComponentesPrescricao();
    // carregando estoque.
    loadEstoque();
  }, []);

  // preservando a posição da scroll ao re-renderizar o componente.
  var timeout = null;
  const [scrollposition, setscrollposition] = useState(0);
  var scrollpos = 0;

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
        width: '100%',
        height: window.innerHeight,
        margin: 0,
        padding: 0,
      }}
    >
      <Header link={"/unidades"} titulo={'DISPENSAÇÃO DE MEDICAMENTOS: ' + nomeunidade}></Header>
      <Toast valortoast={valortoast} cor={cor} mensagem={mensagem} tempo={tempo} />
      <div
        id="PRINCIPAL"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          width: window.innerWidth,
          height: '82vh',
          padding: 0, margin: 0,
        }}>

        <div
          style={{
            // position: 'absolute', top: '18vh', left: 0, bottom: 0,
            width: '30vw',
            backgroundColor: '#8f9bbc',
            borderRadius: 0, margin: 0, padding: 5,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.3)',
          }}>
          <FilterEstoque></FilterEstoque>
          <Estoque></Estoque>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '70vw' }}>
          <CabecalhoPacientes></CabecalhoPacientes>
          <ShowPacientes></ShowPacientes>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            padding: 5,
            height: '50vh',
            width: '70vw',
          }}>
            <ShowPrescricoes></ShowPrescricoes>
            <ShowSaquinhos></ShowSaquinhos>
          </div>
        </div>
        <ViewUpdateEstoque></ViewUpdateEstoque>
        <Modal></Modal>
        <NovoItemPrescricao></NovoItemPrescricao>
        <ShowItemViaSelector></ShowItemViaSelector>
        <ShowItemHorariosSelector></ShowItemHorariosSelector>
        <ShowItemGrupoSelector></ShowItemGrupoSelector>
        <ShowItemCodigoSelector></ShowItemCodigoSelector>
      </div>
    </div>
  );
}
export default Farmacia;