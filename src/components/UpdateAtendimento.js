/* eslint eqeqeq: "off" */
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import moment, { locale } from 'moment';
import { useHistory } from "react-router-dom";
import Context from '../Context';

function UpdateAtendimento({ viewupdateatendimento }) {
  var html = 'https://gpet-server.herokuapp.com'
  // var html = '//localhost:3001';
  const {
    idusuario,
    nomeusuario,
    nomehospital,
    nomeunidade,
    idatendimento,
    idpaciente,
    nomepaciente,
    dn,
    box,
  } = useContext(Context)
  // history (react-router-dom).
  let history = useHistory()

  // estados relacionados ao atendimento.
  const [admissao, setadmissao] = useState('');
  const [peso, setpeso] = useState('');
  const [altura, setaltura] = useState('');
  const [antecedentes, setantecedentes] = useState('');
  const [alergias, setalergias] = useState('');
  const [medicacoes, setmedicacoes] = useState('');
  const [exames, setexames] = useState('');
  const [historia, sethistoria] = useState('');
  const [status, setstatus] = useState(0);
  const [ativo, setativo] = useState(0);
  const [classificacao, setclassificacao] = useState('');
  const [descritor, setdescritor] = useState('');
  const [precaucao, setprecaucao] = useState(0);
  const [assistente, setassistente] = useState('');
  // carregando o atendimento do paciente selecionado.
  const loadAtendimento = () => {
    axios.get(html + "/atendimentos").then((response) => {
      var y = [0, 1];
      y = response.data;
      var x = [0, 1];
      x = y.filter((value) => value.ativo !== 0 && value.hospital == nomehospital && value.unidade == nomeunidade && value.id == idatendimento);
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
      setclassificacao(x.map((item) => item.classificacao));
      setdescritor(x.map((item) => item.descritor));
      setprecaucao(x.map((item) => item.precaucao));
      setassistente(x.map((item) => item.assistente));
    });
  }

  // chave para exibição do componente.
  const [viewcomponent, setviewcomponent] = useState(viewupdateatendimento);

  useEffect(() => {
    if (viewupdateatendimento == 1) {
      setviewcomponent(1);
      loadAtendimento();
      setshowassistente(0);
    }
  }, [viewupdateatendimento]);

  // tela que define médico assistente.
  const [showassistente, setshowassistente] = useState();
  function ShowAssistente() {
    if (showassistente === 1) {
      return (
        <div className="menucover" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <text className="title2" style={{ fontSize: 14 }}>{'ASSUMIR PACIENTE ' + nomepaciente + ' COMO MÉDICO ASSISTENTE?'}</text>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
              <button className="green-button" onClick={() => { updateAtendimento(nomeusuario) }} style={{ width: 100 }}>
                SIM
              </button>
              <button className="red-button" onClick={() => { updateAtendimento(assistente) }} style={{ width: 100 }}>
                NÃO
              </button>
            </div>
          </div>
        </div >
      );
    } else {
      return null;
    }
  }

  // função que atualiza o atendimento.
  const updateAtendimento = (value) => {
    var antecedentes = document.getElementById('inputAntecedentes').value.toUpperCase();
    var alergias = document.getElementById('inputAle').value.toUpperCase();
    var medicacoes = document.getElementById('inputMedicacoes').value.toUpperCase();
    var exames = document.getElementById('inputExames').value.toUpperCase();
    var historia = document.getElementById('inputHistoria').value.toUpperCase();
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
      status: status,
      ativo: 2,
      classificacao: classificacao,
      descritor: descritor,
      precaucao: precaucao,
      assistente: value,
    };
    axios.post(html + '/updateatendimento/' + idatendimento, obj).then(() => {
      if (ativo == 1) {
        var conteudo =
          "DATA DE ADMISSÃO: " + admissao + " \n" +
          "ANTECEDENTES PESSOAIS: " + antecedentes + " \n" +
          "ALERGIAS: " + alergias + " \n" +
          "MEDICAÇÕES DE USO PRÉVIO: " + medicacoes + " \n" +
          "EXAMES PRÉVIOS RELEVANTES: " + exames + " \n\n" +
          "CONTEXTO: " + historia + " \n\n" +
          "DIAGNÓSTICOS: \n" +
          "ENUMERE AQUI AS HIPÓTESES DIAGNÓSTICAS."
        // inserindo o registro de admissão.
        var obj = {
          idpaciente: idpaciente,
          idatendimento: idatendimento,
          data: moment().format('DD/MM/YY HH:mm'),
          tipo: 'RELATÓRIO DE ADMISSÃO',
          texto: conteudo,
          idusuario: idusuario,
          usuario: nomeusuario,
          status: 0,
        };
        axios.post(html + '/insertformulario', obj).then(() => {
          close();
        });
      } else {
        close();
      }
    });
  };

  const close = () => {
    setshowassistente(0);
    setviewcomponent(0);
    history.push('/refresh')
    history.push('/prontuario')
  };

  // varíavel 'status'.
  const clickStatus1 = () => {
    setstatus(1);
  };
  const clickStatus2 = () => {
    setstatus(2);
  };
  const clickStatus3 = () => {
    setstatus(3);
  };
  const clickStatus0 = () => {
    setstatus(0);
  };

  const setFirstAssistente = () => {
    var usuariostring = ''
    usuariostring = nomeusuario
    if (assistente == usuariostring.toString()) {
      updateAtendimento(assistente);
    } else {
      setshowassistente(1);
    }
  }

  // renderização do componente.
  if (viewcomponent == 1) {
    return (
      <div>
        <ShowAssistente></ShowAssistente>
        <div
          className="menucover fade-in"
        >
          <div>
            
              <div className="menucontainer">
                <div id="cabeçalho" className="cabecalho">
                  <div className="title5">{'ATUALIZAR ATENDIMENTO'}</div>
                  <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <button className="red-button" onClick={() => close()}>
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
                      onClick={() => setFirstAssistente()}
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
                  className="corpo"
                >
                  <div
                    id="IDENTIFICAÇÃO DO PACIENTE."
                    title="APENAS A SECRETÁRIA PODE MUDAR ESTES DADOS."
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      margin: 2.5,
                      width: '100%',
                    }}
                  >
                    <div className="grey-button"
                      style={{
                        display: box != '' ? 'flex' : 'none',
                        margin: 2.5, padding: 5, fontSize: 14,
                        width: window.innerWidth > 800 ? 120 : 50, height: 60,
                        backgroundColor: 'grey'
                      }}>
                      {'BOX ' + box}
                    </div>
                    <div className="grey-button"
                      style={{
                        margin: 2.5, padding: 5, fontSize: 14,
                        height: 60,
                        width: '100%',
                        backgroundColor: 'grey'
                      }}>
                      {nomepaciente}
                    </div>
                    <div className="grey-button"
                      style={{
                        margin: 2.5, padding: 5, fontSize: 14,
                        width: window.innerWidth > 800 ? 120 : 50, height: 60,
                        backgroundColor: 'grey'
                      }}>
                      {(moment().diff(moment(dn, 'DD/MM/YYYY'), 'years') + ' ANOS')}
                    </div>
                  </div>
                  <div
                    className="scroll"
                    style={{
                      marginTop: 10,
                      height: 300,
                      width: 0.6 * window.innerWidth,
                    }}
                  >
                    <label
                      className="title2"
                      style={{
                        display: box != '' ? 'flex' : 'none',
                        marginTop: 15,
                        fontSize: 14,
                        justifyContent: 'center',
                      }}
                    >
                      STATUS:
                    </label>
                    <div
                      id="STATUS DO PACIENTE."
                      style={{
                        display: box != '' ? 'flex' : 'none',
                        flexDirection: window.innerWidth > 800 ? 'row' : 'column',
                        justifyContent: 'center',
                        margin: 5,
                      }}
                    >
                      <div
                        className={status == 3 ? "green-button" : "blue-button"}
                        onClick={() => clickStatus3()}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          padding: 10,
                          width: 110,
                          margin: 2.5,
                        }}
                      >
                        ESTÁVEL
                      </div>
                      <div
                        className={status == 2 ? "yellow-button" : "blue-button"}
                        onClick={() => clickStatus2()}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          padding: 10,
                          width: 110,
                          margin: 2.5,
                        }}
                      >
                        ALERTA
                      </div>
                      <div
                        className={status == 1 ? "red-button" : "blue-button"}
                        onClick={() => clickStatus1()}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          padding: 10,
                          width: 110,
                          margin: 2.5,
                        }}
                      >
                        INSTÁVEL
                      </div>
                      <div
                        className={status == 0 ? "grey-button" : "blue-button"}
                        onClick={() => clickStatus0()}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          padding: 10,
                          width: 110,
                          margin: 2.5,
                        }}
                      >
                        CONFORTO
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: 0,
                      }}
                    >
                      <div>
                        <label
                          className="title2"
                          style={{
                            width: window.innerWidth > 800 ? 350 : 135,
                            marginTop: 15,
                            fontSize: 14,
                            justifyContent: 'center',
                          }}
                        >
                          {window.innerWidth > 800 ? 'ANTECEDENTES PESSOAIS:' : 'ANT. PESSOAIS:'}
                        </label>
                        <textarea
                          className="textarea"
                          title="ANTECEDENTES PESSOAIS."
                          id="inputAntecedentes"
                          type="text"
                          defaultValue={antecedentes}
                          maxLength="200"
                          autoComplete="off"
                          placeholder="ANTECEDENTES PESSOAIS"
                          onFocus={(e) => (e.target.placeholder = '')}
                          onBlur={(e) =>
                            (e.target.placeholder = 'ANTECEDENTES PESSOAIS')
                          }
                          style={{
                            resize: 'none',
                            marginBottom: 0,
                            marginRight: 0,
                            width: window.innerWidth > 800 ? 350 : 135,
                            height: 90,
                          }}
                        ></textarea>
                      </div>
                      <div>
                        <label
                          className="title2"
                          style={{
                            width: window.innerWidth > 800 ? 350 : 135,
                            marginTop: 15,
                            fontSize: 14,
                            justifyContent: 'center',
                          }}
                        >
                          ALERGIAS:
                        </label>
                        <textarea
                          className="textarea"
                          title="ALERGIAS."
                          id="inputAle"
                          type="text"
                          defaultValue={alergias}
                          maxLength="200"
                          autoComplete="off"
                          placeholder="ALERGIAS"
                          onFocus={(e) => (e.target.placeholder = '')}
                          onBlur={(e) =>
                            (e.target.placeholder = 'ALERGIAS')
                          }
                          style={{
                            resize: 'none',
                            marginBottom: 0,
                            marginRight: 0,
                            width: window.innerWidth > 800 ? 350 : 135,
                            height: 90,
                          }}
                        ></textarea>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}
                    >
                      <div>
                        <label
                          className="title2"
                          style={{
                            width: window.innerWidth > 800 ? 350 : 135,
                            marginTop: 15,
                            fontSize: 14,
                            justifyContent: 'center',
                          }}
                        >
                          {window.innerWidth > 800 ? 'MEDICAÇÕES PRÉVIAS:' : 'MEDIC. PRÉVIAS:'}
                        </label>
                        <textarea
                          className="textarea"
                          title="MEDICAÇÕES PRÉVIAS."
                          id="inputMedicacoes"
                          type="text"
                          defaultValue={medicacoes}
                          maxLength="200"
                          autoComplete="off"
                          placeholder="MEDICAÇÕES PRÉVIAS"
                          onFocus={(e) => (e.target.placeholder = '')}
                          onBlur={(e) =>
                            (e.target.placeholder = 'MEDICAÇÕES PRÉVIAS')
                          }
                          style={{
                            resize: 'none',
                            marginBottom: 0,
                            marginRight: 0,
                            width: window.innerWidth > 800 ? 350 : 135,
                            height: 90,
                          }}
                        ></textarea>
                      </div>
                      <div>
                        <label
                          className="title2"
                          style={{
                            width: window.innerWidth > 800 ? 350 : 135,
                            marginTop: 15,
                            fontSize: 14,
                            justifyContent: 'center',
                          }}
                        >
                          {window.innerWidth > 800 ? 'EXAMES PRÉVIOS:' : 'EX. PRÉVIOS:'}
                        </label>
                        <textarea
                          className="textarea"
                          title="EXAMES PRÉVIOS."
                          id="inputExames"
                          type="text"
                          defaultValue={exames}
                          maxLength="200"
                          autoComplete="off"
                          placeholder="EXAMES PRÉVIOS"
                          onFocus={(e) => (e.target.placeholder = '')}
                          onBlur={(e) => (e.target.placeholder = 'EXAMES PRÉVIOS')}
                          style={{
                            resize: 'none',
                            marginBottom: 0,
                            width: window.innerWidth > 800 ? 350 : 135,
                            height: 90,
                          }}
                        ></textarea>
                      </div>
                    </div>
                    <div>
                      <label
                        className="title2"
                        style={{
                          marginTop: 15,
                          fontSize: 14,
                          justifyContent: 'center',
                        }}
                      >
                        HISTÓRIA DA DOENÇA ATUAL:
                      </label>
                      <textarea
                        className="textarea"
                        title="HISTÓRIA DA DOENÇA ATUAL."
                        id="inputHistoria"
                        type="text"
                        defaultValue={historia}
                        maxLength="500"
                        autoComplete="off"
                        placeholder="HISTÓRIA DA DOENÇA ATUAL"
                        onFocus={(e) => (e.target.placeholder = '')}
                        onBlur={(e) =>
                          (e.target.placeholder = 'HISTÓRIA DA DOENÇA ATUAL')
                        }
                        style={{
                          resize: 'none',
                          marginBottom: 5,
                          width: window.innerWidth > 800 ? 705 : 275,
                          height: 90,
                        }}
                      ></textarea>
                    </div>
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
export default UpdateAtendimento;