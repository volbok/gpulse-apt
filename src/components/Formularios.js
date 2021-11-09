/* eslint eqeqeq: "off" */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import Toast from './Toast';
import Context from '../Context';

function Formularios(
  { hospital,
    unidade,
    viewformulario,
    idpaciente, // necessário porque o sistema filtrará os documentos de todos os atendimentos referentes ao paciente.
    idatendimento,
    idusuario,
    usuario,
    nome,
    idformulario,
    dataformulario,
    tipoformulario,
    textoformulario,
  }) {
  //servidor.
  var html = 'https://pulsarapp-server.herokuapp.com';
  // api para CID10:
  var cid10 = 'https://cid10-api.herokuapp.com/cid10';

  // recuperando estados globais (Context.API).
  const {
    setlistformularios,
    setarrayformularios,
  } = useContext(Context)

  // chave para exibição do componente.
  const [viewcomponent, setviewcomponent] = useState(viewformulario);

  // lista de tipos de formulários.
  const [arraylistformularios, setarraylistformularios] = useState([]);
  const loadFormularios = () => {
    axios.get(html + "/tiposformularios").then((response) => {
      var x = [0, 1];
      x = response.data;
      setarraylistformularios(x);
    });
  }

  useEffect(() => {
    loadFormularios();
    if (viewformulario === 1) { // inserir formulário.
      setshowtiposelector(0);
      setviewcomponent(1);
      setselecttipo('CLIQUE AQUI PARA ESCOLHER UM TIPO DE FORMULÁRIO');
    } else if (viewformulario === 2) { // atualizar formulário.
      setshowtiposelector(0);
      setviewcomponent(2);
      setselecttipo(tipoformulario);
    } else if (viewformulario === 3) { // visualizar formulário.
      setshowtiposelector(0);
      setviewcomponent(3);
      setselecttipo(tipoformulario);
    } else {
    }
  }, [viewformulario])

  // DECLARAÇÃO DE COMPARECIMENTO.
  const setDeclaracao = (valor) => {
    document.getElementById("inputTexto").value = "ATESTO, PARA OS DEVIDOS FINS, QUE O(A) PACIENTE "
      + nome + " ESTEVE EM ATENDIMENTO NESTE HOSPITAL, NO PERÍODO DE " + admissao + " A " + moment().format('DD/MM/YY HH:MM') + "."
  }

  // ATESTADO.
  const setAtestado = (valor) => {
    document.getElementById("inputTexto").value = "ATESTO, PARA OS DEVIDOS FINS, QUE O(A) PACIENTE "
      + nome + " PRECISA AFASTAR-SE DO TRABALHO POR UM PERÍODO DE UM (01) DIA, A CONTAR DE "
      + moment().format('DD/MM/YY') + ", por motivo de doença CID 10 " + valor + "."
  }
  // exibindo tela para seleção de cid 10.
  const [showcidselector, setshowcidselector] = useState(0);
  function ShowCidSelector() {
    if (showcidselector === 1) {
      return (
        <div className="menucover" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer">
            <label className="title2" style={{ marginTop: 15, fontSize: 14 }}>
              DIAGNÓSTICO:
            </label>
            <input
              autoComplete="off"
              className="input"
              placeholder="DIAGNÓSTICO..."
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'DIAGNÓSTICO...')}
              onChange={() => filterDiagnostico()}
              title="DIAGNÓSTICO."
              style={{
                width: 0.3 * window.innerWidth,
              }}
              type="text"
              maxLength={200}
              id="inputDiagnostico"
            ></input>
            <div className="scroll"
              id="LISTA DE CIDs"
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                margin: 5,
                padding: 0,
                paddingRight: 10,
                width: 0.3 * window.innerWidth,
                height: 0.2 * window.innerHeight,
              }}
            >
              <div style={{ width: '100%' }}>
                {arraydiagnostico.map((item) => (
                  <button
                    className="blue-button"
                    title={item.nome.toUpperCase()}
                    style={{
                      width: '100%',
                      padding: 10,
                    }}
                    onClick={() => selectCid(item.codigo)}
                  >
                    {item.codigo + ' - ' + (item.nome).toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  // gerando array de diagnósticos.
  const [listdiagnosticos, setlistdiagnosticos] = useState([]);
  const loadDiagnosticos = () => {
    axios.get(html + "/cid10").then((response) => {
      setlistdiagnosticos(response.data);
      setarraydiagnostico(response.data);
    });
  }
  // identificando o valor do cid.
  var timeout = null;
  var searchdiagnostico = '';
  const [arraydiagnostico, setarraydiagnostico] = useState([]);
  const filterDiagnostico = () => {
    clearTimeout(timeout);
    searchdiagnostico = document.getElementById("inputDiagnostico").value.toUpperCase();
    document.getElementById("inputDiagnostico").focus();
    timeout = setTimeout(() => {
      if (searchdiagnostico === '') {
        setarraydiagnostico([]);
        document.getElementById("inputDiagnostico").value = '';
        document.getElementById("inputDiagnostico").focus();
      } else {
        setarraydiagnostico(listdiagnosticos.filter(item => item.nome.toUpperCase().includes(searchdiagnostico) === true));
        document.getElementById("inputDiagnostico").value = searchdiagnostico;
        document.getElementById("inputDiagnostico").focus();
      }
    }, 500);
  }
  // definindo o valor do cid.
  const [cid, setcid] = useState();
  const selectCid = (item) => {
    setcid(item);
    setshowcidselector(0);
    setAtestado(item);
  }

  // SUMÁRIO DE ALTA E RELATÓRIO DE TRANSFERÊNCIA.
  var admissao = null;
  var antecedentes = null;
  var alergias = null;
  var medicacoes = null;
  var examesprevios = null;
  var historia = null;
  const loadAtendimento = () => {
    axios.get(html + "/atendimento/'" + hospital + "'/'" + unidade + "'/'"
      + idatendimento + "'").then((response) => {
        var x = [0, 1];
        x = response.data;
        admissao = x.map((item) => item.admissao);
        antecedentes = x.map((item) => item.antecedentes);
        alergias = x.map((item) => item.alergias);
        medicacoes = x.map((item) => item.medicacoes);
        examesprevios = x.map((item) => item.exames);
        historia = x.map((item) => item.historia);
      });
  }
  // capturando resultados de exames de imagem referentes ao atendimento.
  var listimagem = null;
  const loadImagem = () => {
    listimagem = [];
    axios.get(html + "/image/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      var y = [0, 1];
      y = x.filter((item) => item.status === 'PRONTO').map((item) => '» ' + item.exame + ' (' + (item.resultado).substring(0, 8) + '): ' + item.laudo).join('\n');
      listimagem = y.toString();
    });
  }
  // capturando informações do último exame físico.
  var pas = null;
  var pad = null;
  var fc = null;
  var fr = null;
  var sao2 = null;
  var tax = null;
  var acv = null;
  var ar = null;
  var abdome = null;
  var outros = null;
  var glasgow = null;
  const loadLastevolucao = () => {
    axios.get(html + '/lastevolucao/' + idatendimento).then((response) => {
      var x = [0, 1];
      x = response.data;
      pas = x.map((item) => item.pas);
      pad = x.map((item) => item.pad);
      fc = x.map((item) => item.fc);
      fr = x.map((item) => item.fr);
      sao2 = x.map((item) => item.sao2);
      tax = x.map((item) => item.tax);
      acv = x.map((item) => item.acv);
      ar = x.map((item) => item.ap);
      abdome = x.map((item) => item.abdome);
      outros = x.map((item) => item.outros);
      glasgow = x.map((item) => item.glasgow);
    });
  }
  // capturando diagnósticos relacionados ao atendimento.
  var diagnosticos = null;
  const loadDiagnosticosAlta = () => {
    axios.get(html + "/diagnosticos").then((response) => {
      var x = [0, 1];
      x = response.data;
      diagnosticos = x.filter((item) => item.idpaciente == idpaciente).map((item) => item.cid + ' - ' + item.diagnostico + '.').join('\n').toString();
    });
  }

  // montando o texto predefinido do relatório de admissão.
  const setAdmissao = (admissao, antecedentes, alergias, medicacoes, examesprevios,
    historia) => {
    document.getElementById("inputTexto").value =
      "DATA DE ADMISSÃO: " + admissao + " \n" +
      "ANTECEDENTES PESSOAIS: " + antecedentes + " \n" +
      "ALERGIAS: " + alergias + " \n" +
      "MEDICAÇÕES DE USO PRÉVIO: " + medicacoes + " \n" +
      "EXAMES PRÉVIOS RELEVANTES: " + examesprevios + " \n\n" +
      "CONTEXTO: " + historia + " \n\n" +
      "HIPÓTESES DIAGNÓSTICAS: ???"
  }

  // montando o texto predefinido do sumário de alta.
  const setAlta = (admissao, antecedentes, alergias, medicacoes, examesprevios,
    historia, listimagem, glasgow, pas, pad, fc, fr, sao2, tax, acv, ar, abdome, outros, diagnosticos) => {
    document.getElementById("inputTexto").value =
      "DATA DE ADMISSÃO: " + admissao + " \n" +
      "ANTECEDENTES PESSOAIS: " + antecedentes + " \n" +
      "ALERGIAS: " + alergias + " \n" +
      "MEDICAÇÕES DE USO PRÉVIO: " + medicacoes + " \n" +
      "EXAMES PRÉVIOS RELEVANTES: " + examesprevios + " \n\n" +
      "CONTEXTO: " + historia + " \n\n" +
      "RESUMA AQUI OS PRINCIPAIS EVENTOS DA INTERNAÇÃO. \n\n" +
      "EXAMES RELEVANTES: \n" +
      listimagem + " \n\n" +
      "AO EXAME, GLASGOW " + glasgow + ", PA " + pas + ' x ' + pad + "MMHG, FC " + fc + " BPM, FR " + fr + " IRPM, " +
      "SAO2 " + sao2 + "%, TAX: " + tax + "°C. \n" +
      "ACV: " + acv + " \n" +
      "AP: " + ar + " \n" +
      "ABDOME: " + abdome + " \n" +
      "OUTROS: " + outros + " \n\n" +
      "DIAGNÓSTICOS: \n" +
      diagnosticos
  }

  const loadListFormularios = () => {
    axios.get(html + "/formularios/" + idpaciente).then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistformularios(x.sort((a, b) => moment(a.data, 'DD/MM/YYYY HH:MM') < moment(b.data, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
      setarrayformularios(x.sort((a, b) => moment(a.data, 'DD/MM/YYYY HH:MM') < moment(b.data, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
    });
  }

  // TRATAMENTO DOS REGISTROS DE FORMULÁRIOS.
  // inserindo registro.
  const insertData = () => {
    var conteudo = document.getElementById("inputTexto").value.toUpperCase()
    if (conteudo !== '' || selecttipo === '') {
      var obj = {
        idpaciente: idpaciente,
        idatendimento: idatendimento,
        data: moment().format('DD/MM/YY HH:mm'),
        tipo: selecttipo,
        texto: conteudo,
        idusuario: idusuario,
        usuario: usuario,
        status: 0,
      };
      axios.post(html + '/insertformulario', obj);
      toast(1, '#52be80', 'FORMULÁRIO REGISTRADO COM SUCESSO.', 6000);
      setTimeout(() => {
        loadListFormularios();
        fechar();
      }, 4000);
    } else {
      toast(1, '#ec7063', 'CAMPOS OBRIGATÓRIOS EM BRANCO.', 6000);
    }
  };

  // atualizando registro.
  const updateData = () => {
    var conteudo = document.getElementById("inputTexto").value.toUpperCase()
    if (conteudo !== '') {
      var obj = {
        idpaciente: idpaciente,
        idatendimento: idatendimento,
        data: dataformulario,
        tipo: selecttipo,
        texto: conteudo,
        idusuario: idusuario,
        usuario: usuario,
        status: 0,
      };
      axios.post(html + '/updateformulario/' + idformulario, obj);
      toast(1, '#52be80', 'FORMULÁRIO ATUALIZADO COM SUCESSO.', 6000);
      setTimeout(() => {
        loadListFormularios();
        fechar();
      }, 4000);
    } else {
      toast(1, '#ec7063', 'CAMPOS OBRIGATÓRIOS EM BRANCO.', 6000);
    }
  };

  // seleção do tipo de formulário.
  const [selecttipo, setselecttipo] = useState('');
  const selectTipo = (item) => {
    setselecttipo(item);
    setshowtiposelector(0);
    if (item === 'ATESTADO MÉDICO') {
      loadDiagnosticos();
      setshowcidselector(1);
    } else if (item === 'DECLARAÇÃO DE COMPARECIMENTO') {
      loadAtendimento();
      setTimeout(() => {
        setDeclaracao();
      }, 2000);
    } else if (item === 'RELATÓRIO DE ADMISSÃO') {
      loadAtendimento();
      setTimeout(() => {
        setAdmissao(admissao, antecedentes, alergias, medicacoes, examesprevios, historia);
      }, 2000);
    } else if (item === 'RELATÓRIO DE ALTA' || item === 'RELATÓRIO DE TRANSFERÊNCIA') {
      loadAtendimento();
      loadImagem();
      loadLastevolucao();
      loadDiagnosticosAlta();
      setTimeout(() => {
        setAlta(admissao, antecedentes, alergias, medicacoes, examesprevios, historia,
          listimagem, glasgow, pas, pad, fc, fr, sao2, tax, acv, ar, abdome, outros, diagnosticos);
      }, 2000);
    } else {
      document.getElementById("inputTexto").value = '';
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
    }, time);
  }

  const fechar = () => {
    setviewcomponent(0);
    window.scrollTo(0, 0);
    document.body.style.overflow = null;
  }

  // tela para seleção do tipo de formulário.
  const [showtiposelector, setshowtiposelector] = useState(0);
  function ShowTipoSelector() {
    if (showtiposelector === 1) {
      return (
        <div
          style={{
            zIndex: 9,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          className="menucover"
          onClick={() => setshowtiposelector(0)}
        >
          <div className="menucontainer" style={{ padding: 20 }}>
            <div className="scroll"
              id="LISTA DE TIPOS DE FORMULÁRIO"
              style={{
                width: '50vw',
                height: '50vh',
              }}
            >
              {arraylistformularios.map((item) => (
                <button
                  key={item.id}
                  className="blue-button"
                  style={{
                    width: '100%',
                    margin: 10,
                  }}
                  onClick={(e) => { selectTipo(item.tipo); e.stopPropagation() }}
                >
                  {item.tipo}
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

  // renderização do componente.
  if (viewcomponent != 0) {
    return (
      <div className="menucover fade-in" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <ShowTipoSelector></ShowTipoSelector>
        <ShowCidSelector></ShowCidSelector>
        <Toast valortoast={valortoast} cor={cor} mensagem={mensagem} tempo={tempo} />
        <div className="menucontainer">
          <div className="menucontainer">
            <div id="cabeçalho" className="cabecalho">
              <div className="title5">{viewcomponent == 1 ? 'CRIAR DOCUMENTO' : viewcomponent == 2 ? 'EDITAR DOCUMENTO' : 'VISUALIZAR DOCUMENTO'}</div>
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
                <button className="green-button" style={{ display: viewcomponent == 3 ? 'none' : 'flex' }}
                  onClick={viewcomponent == 1 ? () => insertData() : () => updateData()}
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
              <div
                style={{
                  justifyContent: 'flex-start',
                  backgroundColor: '#F1F3F9',
                  borderColor: '#F1F3F9',
                  width: 0.7 * window.innerWidth,
                  margin: 0,
                  padding: 5,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                  <button
                    className="blue-button"
                    style={{ width: '99%', margin: 5, alignSelf: 'center', backgroundColor: viewcomponent == 3 ? '#8f9bbc' : '' }}
                    onClick={() => setshowtiposelector(1)}
                    disabled={viewcomponent == 1 ? false : true}
                  >
                    {selecttipo}
                  </button>
                  <textarea
                    autoComplete="off"
                    className="textarea"
                    placeholder=""
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = '')}
                    disabled={viewcomponent == 3 ? true : false}
                    defaultValue={viewcomponent == 1 ? '' : textoformulario}
                    style={{
                      width: '99%',
                      minWidth: '99%',
                      height: 300,
                      margin: 5,
                      alignSelf: 'center',
                    }}
                    type="text"
                    maxLength={1000}
                    id="inputTexto"
                  >
                  </textarea>
                </div>
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
export default Formularios;
