/* eslint eqeqeq: "off" */
import React, { useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/pt-br';
import Context from '../Context';
import { Doughnut, Line } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import suspender from '../images/suspender.svg';

// import setaesquerda from '../images/arrowleft.svg';
// import setadireita from '../images/arrowright.svg';

function AptPlanoTerapeutico() {
  // recuperando estados globais (Context.API).
  const {
    nomeusuario,
    idpaciente,
    idatendimento, ivcf, setivcf,
    listevolucoes,
  } = useContext(Context)

  var html = 'https://pulsarapp-server.herokuapp.com';

  // ESCALA EDITÁVEL IVCF (ESCALA DE MORAES).
  const [data, setdata] = useState(moment().format('DD/MM/YYYY'))
  const [valor, setvalor] = useState();
  const [adf, setadf] = useState();
  const [adfestabelecido, setadfestabelecido] = useState();
  const [adfbasica, setadfbasica] = useState();
  const [adfinstrumental, setadfinstrumental] = useState();
  const [crf, setcrf] = useState();
  const [crfpctefragil, setcrfpctefragil] = useState();
  const [ddfecognicao, setddfecognicao] = useState();
  const [ddfehumor, setddfehumor] = useState();
  const [ddfemobilidade, setddfemobilidade] = useState();
  const [ddfecomunicacao, setddfecomunicacao] = useState();
  const [linhasdecuidados, setlinhasdecuidados] = useState();
  const [metasterapeuticas, setmetasterapeuticas] = useState(); // será uma array, um código para abertura de conjunto de metas?

  // selecionando um registro de escala IVCF (utilizado ao clicarmos no histórico de registros de IVCF).
  const selectIVCF = (item) => {
    setdata(item.data);
    setvalor(item.valor);
    setadf(item.adf);
    setadfestabelecido(item.adfestabelecido);
    setcrf(item.crf);
    setcrfpctefragil(item.crfpctefragil);
    setddfecognicao(item.ddfecognicao);
    setddfehumor(item.ddfehumor);
    setddfemobilidade(item.ddfemobilidade);
    setddfecomunicacao(item.ddfecomunicacao);
    setlinhasdecuidados(item.linhasdecuidados);
    setmetasterapeuticas(item.metasterapeuticas);
  }
  // salvando um registro de escala IVCF (escala de Moraes).
  const createIVCF = () => {
    var obj = {
      idatendimento: idatendimento,
      data: data,
      valor: valor,
      adf: adf,
      adfestabelecido: adfestabelecido,
      crf: crf,
      crfpctefragil: crfpctefragil,
      ddfecognicao: ddfecognicao,
      ddfehumor: ddfehumor,
      ddfemobilidade: ddfemobilidade,
      ddfecomunicacao: ddfecomunicacao,
      linhasdecuidados: linhasdecuidados,
      metasterapeuticas: metasterapeuticas,
    }
    axios.post(html + '/createivcf', obj).then(() => {
    });
  }
  // atualizando um registro de escala IVCF (provavelmente não será aplicável).
  const updateIVCF = (item) => {
    var obj = {
      idatendimento: idatendimento,
      data: data,
      valor: valor,
      adf: adf,
      adfestabelecido: adfestabelecido,
      crf: crf,
      crfpctefragil: crfpctefragil,
      ddfecognicao: ddfecognicao,
      ddfehumor: ddfehumor,
      ddfemobilidade: ddfemobilidade,
      ddfecomunicacao: ddfecomunicacao,
      linhasdecuidados: linhasdecuidados,
      metasterapeuticas: metasterapeuticas,
    }
    axios.post(html + '/updateivcf/' + item.id, obj).then(() => {
    });
  }
  // exclusão de um registro de escala IVCF.
  const deleteIVCF = (item) => {
    axios.get(html + "/deleteivcf/'" + item.id + "'").then(() => {
    });
  }
  // componentes da escala editável de IVCF (escala de Moraes).
  function Regua() {
    return (
      <div id="ESCALA" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div id="setas fragilidade x vitalidade"
          style={{
            padding: 5, margin: 5, backgroundImage: 'linear-gradient(to right, #ec7063, #f5b041, #52be80)',
            marginTop: window.innerWidth > 400 ? 5 : 20,
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderRadius: 5,
            height: window.innerWidth > 400 ? 75 : 30,
            width: window.innerWidth > 400 ? '70vw' : '90vw',
            alignSelf: 'center',
            position: 'relative',
          }}
        >
          <div id="fragilidade"
            style={{
              display: 'flex', flexDirection: 'column',
              justifyContent: window.innerWidth > 400 ? 'flex-start' : 'center',
              height: window.innerWidth > 400 ? 75 : 30,
              marginTop: window.innerWidth > 400 ? 0 : -5,
            }}
          >
            <div className="title2" style={{ color: 'white', height: 30, textShadow: '0px 0px 3px black' }}>{'FRAGILIDADE'}</div>
          </div>
          <div id="vitalidade"
            style={{
              display: 'flex', flexDirection: 'column',
              justifyContent: window.innerWidth > 400 ? 'flex-start' : 'center',
              height: window.innerWidth > 400 ? 75 : 30,
              marginTop: window.innerWidth > 400 ? 0 : -5,
            }}
          >
            <div className="title2" style={{ color: 'white', height: 30, textShadow: '0px 0px 3px black' }}>{'VITALIDADE'}</div>
          </div>
          <div
            style={{
              position: 'absolute', top: -15, bottom: 0, left: 0, right: 0, borderRadius: 50,
              display: window.innerWidth < 400 ? 'flex' : 'none',
              flexDirection: 'row', justifyContent: 'center',
              width: '100%',
              alignSelf: 'center', borderRadius: 50,
            }}>
            <div className="red-button" style={{ width: 50, height: 50 }}>
              {ivcf}
            </div>
          </div>
        </div>
        <div id="regua"
          style={{
            width: '100%', padding: 5, margin: 0, marginTop: -40, position: 'relative',
            display: window.innerWidth < 400 ? 'none' : 'flex', flexDirection: 'row', justifyContent: 'space-evenly',
          }}
        >
          <button className="blue-button">
            1
          </button>
          <button className="blue-button">
            2
          </button>
          <button className="blue-button">
            3
          </button>
          <button className="blue-button">
            4
          </button>
          <button className="blue-button">
            5
          </button>
          <button className="blue-button">
            6
          </button>
          <button className="blue-button">
            7
          </button>
          <button className="blue-button">
            8
          </button>
          <button className="blue-button">
            9
          </button>
          <button className="blue-button">
            10
          </button>
        </div>
      </div>
    )
  }
  function AvaliacaoDeDeclinioFuncional() {
    return (
      <div id="AVALIAÇÃO DE DECLÍNIO FUNCIONAL - ADF" style={{ marginTop: window.innerWidth < 400 ? 20 : 0 }}>
        <div className="title2" style={{ margin: 0 }}>AVALIAÇÃO DE DECLÍNIO FUNCIONAL</div>
        <div id="ADF - opções"
          style={{
            display: 'flex',
            flexDirection: window.innerWidth > 400 ? 'row' : 'column',
            justifyContent: 'center', padding: 5, marginTop: 0, alignSelf: 'center', alignItems: 'center',
          }}>
          <button style={{ width: window.innerWidth > 400 ? '12vw' : '90vw', height: window.innerWidth > 400 ? 90 : '', opacity: adf == 1 ? 1 : 0.3 }} className="green-button" onClick={() => setadf(1)}>
            AUSENTE
          </button>
          <button style={{ width: window.innerWidth > 400 ? '12vw' : '90vw', height: window.innerWidth > 400 ? 90 : '', opacity: adf == 2 ? 1 : 0.3 }} className="yellow-button" onClick={() => setadf(2)}>
            IMINENTE
          </button>
          <button
            style={{
              width:
                adf != 3 && window.innerWidth > 400 ? '12vw' : adf == 3 && window.innerWidth > 400 ? '26vw' : '90vw',
              height: window.innerWidth > 400 ? 90 : window.innerWidth < 400 && adf == 3 ? 90 : '',
              opacity: adf == 3 ? 1 : 0.3
            }}
            className="red-button" onClick={() => setadf(3)}>
            <div>ESTABELECIDO</div>
            <div id="ADF - opções - estabelecido" style={{ display: adf == 3 ? 'flex' : 'none', justifyContent: 'space-evenly' }}>
              <button className="softred-button"
                style={{
                  maxHeight: 40,
                  borderColor: adfbasica == 1 ? 'white' : 'transparent', borderWidth: 3,
                  borderStyle: 'solid',
                  width: window.innerWidth > 400 ? '12vw' : '40vw',
                  fontSize: 12, padding: 5, opacity: adfbasica == 1 ? 1 : 0.5
                }}
                onClick={adfbasica == 1 ? () => setadfbasica(0) : () => setadfbasica(1)}>
                AVD BÁSICA
              </button>
              <button className="softred-button"
                style={{
                  maxHeight: 40,
                  borderColor: adfinstrumental == 1 ? 'white' : 'transparent', borderWidth: 3,
                  borderStyle: 'solid',
                  width: window.innerWidth > 400 ? '12vw' : '40vw',
                  fontSize: 12, padding: 5, opacity: adfinstrumental == 1 ? 1 : 0.5,
                }}
                onClick={adfinstrumental == 1 ? () => setadfinstrumental(0) : () => setadfinstrumental(1)}>
                AVD INSTRUMENTAL
              </button>
            </div>
          </button>
        </div>
      </div>
    )
  }
  function ClassificacaoDeRiscoFuncional() {
    return (
      <div id="CLASSIFICAÇÃO DE RISCO FUNCIONAL - CRF">
        <div className="title2" style={{ margin: 0 }}>CLASSIFICAÇÃO DE RISCO FUNCIONAL</div>
        <div id="CRF - opções"
          style={{
            display: 'flex',
            flexDirection: window.innerWidth > 400 ? 'row' : 'column',
            justifyContent: 'center', padding: 5, marginTop: 0, alignSelf: 'center', alignItems: 'center',
          }}>
          <button style={{ width: window.innerWidth > 400 ? '12vw' : '90vw', height: window.innerWidth > 400 ? 90 : '', opacity: crf == 1 ? 1 : 0.3 }} className="green-button" onClick={() => setcrf(1)}>
            PACIENTE ROBUSTO
          </button>
          <button style={{ width: window.innerWidth > 400 ? '12vw' : '90vw', height: window.innerWidth > 400 ? 90 : '', opacity: crf == 2 ? 1 : 0.3, maxHeight: 200 }} className="yellow-button" onClick={() => setcrf(2)}>
            RISCO DE FRAGILIZAÇÃO
          </button>
          <button
            style={{
              width:
                crf != 3 && window.innerWidth > 400 ? '12vw' : crf == 3 && window.innerWidth > 400 ? '26vw' : '90vw',
              height: window.innerWidth > 400 ? 90 : window.innerWidth < 400 && crf == 3 ? 90 : '',
            }} className="red-button" onClick={() => setcrf(3)}>
            PACIENTE FRÁGIL
            <div id="CRF - opções - paciente frágil" style={{ display: crf == 3 ? 'flex' : 'none', justifyContent: 'space-evenly' }}>
              <button
                style={{
                  fontSize: 12, padding: 5, opacity: crfpctefragil == 1 ? 1 : 0.5,
                  borderColor: crfpctefragil == 1 ? 'white' : 'transparent', borderWidth: 3,
                  borderStyle: 'solid',
                  width: window.innerWidth > 400 ? '12vw' : '40vw',
                }}
                className="softred-button" onClick={() => setcrfpctefragil(1)}>
                BAIXA COMPLEXIDADE
              </button>
              <button
                style={{
                  fontSize: 12, padding: 5, opacity: crfpctefragil == 2 ? 1 : 0.5,
                  borderColor: crfpctefragil == 2 ? 'white' : 'transparent', borderWidth: 3,
                  borderStyle: 'solid',
                  width: window.innerWidth > 400 ? '12vw' : '40vw',
                }}
                className="softred-button" onClick={() => setcrfpctefragil(2)}>
                ALTA COMPLEXIDADE
              </button>
            </div>
          </button>
        </div>
      </div>
    )
  }
  function DeterminantesDoDeclinioFuncionalEstabelecido() {
    return (
      <div id="DETERMINANTES DO DECLÍNIO FUNCIONAL ESTABELECIDO - DDFE"
        style={{
          display: adf == 3 ? 'flex' : 'none', flexDirection: 'column',
          justifyContent: 'center', alignSelf: 'center', width: '100%'
        }}>
        <div className="title2center" style={{ margin: 0, marginBottom: 10 }}>DETERMINANTES DO DECLÍNIO FUNCIONAL ESTABELECIDO</div>
        <div id="DDFE - opções"
          style={{
            display: 'flex',
            flexDirection: window.innerWidth > 400 ? 'row' : 'column',
            justifyContent: 'space-evenly', padding: 5, margin: -10, width: '100%', alignSelf: 'center',
          }}>
          <div className="card"
            style={{
              margin: 5, marginLeft: 5, marginRight: 5, flexDirection: 'column',
              justifyContent: 'center', width: window.innerWidth > 400 ? '16vw' : '80vw', alignSelf: 'center',
            }}>
            <div className="title2center" style={{ fontSize: 14, height: 50 }}>COGNIÇÃO</div>
            <div id="DFE - opções - cognição" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', marginBottom: 10 }}>
              <button className={ddfecognicao == 1 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                }}
                onClick={() => setddfecognicao(1)}>
                L
              </button>
              <button className={ddfecognicao == 2 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                }}
                onClick={() => setddfecognicao(2)}>
                M
              </button>
              <button className={ddfecognicao == 3 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 35 : 50,
                }}
                onClick={() => setddfecognicao(3)}>
                G
              </button>
            </div>
          </div>
          <div className="card"
            style={{
              margin: 5, marginLeft: 5, marginRight: 5, flexDirection: 'column',
              justifyContent: 'center', width: window.innerWidth > 400 ? '16vw' : '80vw', alignSelf: 'center',
            }}>
            <div className="title2center" style={{ fontSize: 14, height: 50 }}>HUMOR E COMPORTAMENTO</div>
            <div id="DFE - opções - humor e comportamento" style={{
              display: 'flex', flexDirection: 'row',
              justifyContent: 'space-evenly', width: '100%', alignSelf: 'center', marginBottom: 10
            }}>
              <button className={ddfehumor == 1 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                }}
                onClick={() => setddfehumor(1)}>
                L
              </button>
              <button className={ddfehumor == 2 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                }}
                onClick={() => setddfehumor(2)}>
                M
              </button>
              <button className={ddfehumor == 3 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                }}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                }}
                onClick={() => setddfehumor(3)}>
                G
              </button>
            </div>
          </div>
          <div className="card"
            style={{
              margin: 5, marginLeft: 5, marginRight: 5, flexDirection: 'column',
              justifyContent: 'center', width: window.innerWidth > 400 ? '16vw' : '80vw', alignSelf: 'center',
            }}>
            <div className="title2center" style={{ fontSize: 14, height: 50 }}>MOBILIDADE</div>
            <div id="DFE - opções - mobilidade" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', marginBottom: 10 }}>
              <button className={ddfemobilidade == 1 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                }}
                onClick={() => setddfemobilidade(1)}>
                L
              </button>
              <button className={ddfemobilidade == 2 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                }}
                onClick={() => setddfemobilidade(2)}>
                M
              </button>
              <button className={ddfemobilidade == 3 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                }}
                onClick={() => setddfemobilidade(3)}>
                G
              </button>
            </div>
          </div>
          <div className="card"
            style={{
              margin: 5, marginLeft: 5, marginRight: 5, flexDirection: 'column',
              justifyContent: 'center', width: window.innerWidth > 400 ? '16vw' : '80vw', alignSelf: 'center',
            }}>
            <div className="title2center" style={{ fontSize: 14, height: 50 }}>COMUNICAÇÃO</div>
            <div id="DFE - opções - comunicação" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', marginBottom: 10 }}>
              <button className={ddfecomunicacao == 1 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                }}
                onClick={() => setddfecomunicacao(1)}>
                L
              </button>
              <button className={ddfecomunicacao == 2 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                }}
                onClick={() => setddfecomunicacao(2)}>
                M
              </button>
              <button className={ddfecomunicacao == 3 ? "red-button" : "blue-button"}
                style={{
                  width: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  height: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minWidth: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                  minHeight: window.innerWidth < 1024 && window.innerWidth > 400 ? 32 : 50,
                }}
                onClick={() => setddfecomunicacao(3)}>
                G
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  function LinhaDeCuidados() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="title4" style={{ margin: 15 }}>LINHA DE CUIDADOS</div>
        <div id="LINHA DE CUIDADOS" style={{
          display: 'flex',
          flexDirection: window.innerWidth > 400 ? 'row' : 'column',
          justifyContent: 'space-evenly', paddingLeft: 7.5, paddingRight: 7.5
        }}>
          <button style={{ width: window.innerWidth > 400 ? '22vw' : '90vw' }} className={linhasdecuidados == 1 ? "red-button" : "blue-button"} onClick={() => setlinhasdecuidados(1)}>
            REABILITAÇÃO
          </button>
          <button style={{ width: window.innerWidth > 400 ? '22vw' : '90vw' }} className={linhasdecuidados == 2 ? "red-button" : "blue-button"} onClick={() => setlinhasdecuidados(2)}>
            CUIDADOS CRÔNICOS
          </button>
          <button style={{ width: window.innerWidth > 400 ? '22vw' : '90vw' }} className={linhasdecuidados == 3 ? "red-button" : "blue-button"} onClick={() => setlinhasdecuidados(3)}>
            CUIDADOS PALIATIVOS
          </button>
        </div>
      </div>
    )
  }


  const [planosterapeuticos, setplanosterapeuticos] = useState([]);
  const [objetivos, setobjetivos] = useState([]);
  const [metas, setmetas] = useState([]);
  const [intervencoes, setintervencoes] = useState([]);
  const [tiposescalas, settiposescalas] = useState([]);
  const [escalas, setescalas] = useState([]);
  useEffect(() => {
    // pseudo-registro de planos terapêuticos (APAGAR!).
    setplanosterapeuticos([
      {
        id: 1,
        idpaciente: idpaciente,
        idplanoterapeutico: idplanoterapeutico,
        data: '12/10/2020',
        linhadecuidado: 1,
        status: 3, // 1 = ativo, 2 = cancelado, 3 = concluído.
      },
      {
        id: 2,
        idpaciente: idpaciente,
        idplanoterapeutico: idplanoterapeutico,
        data: '21/11/2021',
        linhadecuidado: 1,
        status: 1,
      }
    ]);
    setlastplanoterapeutico(planosterapeuticos.slice(-1)); // recuperando último registro de plano terapêutico.
    setidplanoterapeutico(planosterapeuticos.slice(-1).map(item => item.id)); // recuperando a id do último plano terapêutico.
    // pseudo-registro de objetivos (APAGAR!).
    setobjetivos([
      {
        id: 1,
        idpaciente: idpaciente,
        idplanoterapeutico: idplanoterapeutico,
        tipo: 1, // 1 = primário, 2 = secundário.
        objetivo: 'REABILITAR PACIENTE VÍTIMA DE AVE.',
        desfecho: 1 // 0 = pendente de validação, 1 = ativo, 2 = sucesso, 3 = fracasso, 4 = cancelado.
      },
      {
        id: 2,
        idpaciente: idpaciente,
        idplanoterapeutico: idplanoterapeutico,
        tipo: 2,
        objetivo: 'RECUPERAÇÃO PARCIAL OU TOTAL DA FUNÇÃO MOTORA.',
        desfecho: 0
      },
      {
        id: 3,
        idpaciente: idpaciente,
        idplanoterapeutico: idplanoterapeutico,
        tipo: 2,
        objetivo: 'RECUPERAÇÃO PARCIAL OU TOTAL DA FUNÇÃO COGNITIVA. VAMOS POR UM TEXTO GRANDE AQUI PORQUE OS OBJETIVOS PODEM SER GRANDES.',
        desfecho: 2
      }, {
        id: 4,
        idpaciente: idpaciente,
        idplanoterapeutico: idplanoterapeutico,
        tipo: 2,
        objetivo: 'RECUPERAR EM 50% A CONTINÊNCIA URINÁRIA E ESFINCTERIANA.',
        desfecho: 1
      },
    ]);
    // pseudo-registro de metas (APAGAR!).
    setmetas([
      {
        id: 1,
        idpaciente: idpaciente,
        idplanoterapeutico: idplanoterapeutico,
        meta: 'VOLTAR A DEAMBULAR.',
        dominio: 'MOTRICIDADE',
        profissional: 3,
        inicio: '13/11/2021',
        prazo: '30/11/2021',
        nota: 8,
        status: 1,
      },
      {
        id: 2,
        idpaciente: idpaciente,
        idplanoterapeutico: idplanoterapeutico,
        meta: 'REDUZIR O NÚMERO DE MEDICAÇÕES USADAS EM 50%.',
        dominio: 'CLÍNICO',
        profissional: 1,
        inicio: '08/11/2021',
        prazo: '16/12/2021',
        status: 0,
      }
    ]);
    // pseudo-registro de intervenções (APAGAR!).
    setintervencoes([
      {
        id: 1,
        idpaciente: idpaciente,
        idplanoterapeutico: idplanoterapeutico,
        intervencao: 'SESSÕES DE FISIOTERAPIA MOTORA.',
        dominio: 'MOTRICIDADE',
        profissional: 3,
        local: 'GINÁSIO 01',
        inicio: '13/11/2021',
        periodicidade: 'DIÁRIA',
        horainicio: '08',
        horatermino: '10',
        prazo: '30/11/2021',
        status: 1,
      }
    ]);
    // pseudo-registro de tipos de escalas (APAGAR!).
    settiposescalas([
      {
        id: 1,
        tipoescala: 1, // escala MIF.
        nome: 'MIF',
        min: 0, // valores min e max.
        max: 10,
      },
      {
        id: 2,
        tipoescala: 2, // escala PPS.
        nome: 'PPS',
        min: 0,
        max: 100,
      }
    ]);
    // pseudo-registro de escalas (APAGAR!).
    setescalas([
      {
        id: 1,
        idpaciente: idpaciente,
        data: '10/11/2021',
        tipo: 1, // escala MIF.
        valor: 10, // valor da escala.
        profissional: 'JOSÉ MARIA',
      },
      {
        id: 2,
        idpaciente: idpaciente,
        data: '15/11/2021',
        tipo: 1,
        valor: 6,
        profissional: 'JOSÉ MARIA',
      },
      {
        id: 3,
        idpaciente: idpaciente,
        data: '20/11/2021',
        tipo: 1,
        valor: 8,
        profissional: 'JOSÉ MARIA',
      },
      {
        id: 4,
        idpaciente: idpaciente,
        data: '25/11/2021',
        tipo: 1,
        valor: 9,
        profissional: 'JOSÉ MARIA',
      },
      {
        id: 5,
        idpaciente: idpaciente,
        data: '01/10/2021',
        tipo: 2, // escala PPS.
        valor: 90,
        profissional: 'JOSÉ MARIA',
      },
      {
        id: 6,
        idpaciente: idpaciente,
        data: '10/10/2021',
        tipo: 2,
        valor: 70,
        profissional: 'JOSÉ MARIA',
      },
      {
        id: 7,
        idpaciente: idpaciente,
        data: '20/10/2021',
        tipo: 2,
        valor: 90,
        profissional: 'JOSÉ MARIA',
      },
    ]);
  }, []);

  // PLANOS TERAPÊUTICOS.
  // carregamento dos planos terapêuticos e seleção do último correspondente ao paciente atual.
  const [lastplanoterapeutico, setlastplanoterapeutico] = useState([]);
  const [idplanoterapeutico, setidplanoterapeutico] = useState(0);
  const loadPlanosTerapeuticos = () => {
    axios.get(html + "/planoterapeutico").then((response) => {
      var x = [0, 1];
      x = response.data;
      setplanosterapeuticos(x.filter(item => item.idatendimento == idatendimento));
      setlastplanoterapeutico(x.slice(-1)); // recuperando último registro de plano terapêutico.
      setidplanoterapeutico(x.slice(-1).map(item => item.id)); // recuperando a id do último plano terapêutico.
    });
  }
  // lista de planos terapêuticos relativos ao paciente em atendimento (histórico).
  function ListaDePlanosTerapeuticos() {
    return (
      <div className="scroll"
        style={{
          display: 'flex',
          alignSelf: 'center',
          flexDirection: 'row',
          height: 80,
          minHeight: 80,
          width: '100%',
          // width: window.innerWidth > 1024 ? '60vw' : window.innerWidth < 1025 && window.innerWidth > 400 ? '65vw' : '85vw',
          // minWidth: window.innerWidth > 1024 ? '45vw' : window.innerWidth < 1025 && window.innerWidth > 400 ? '65vw' : '85vw',
          margin: 0,
          padding: 0,
          scrollBehavior: 'smooth',
          alignItems: 'center',
          overflowX: 'scroll',
          overflowY: 'hidden',
          borderRadius: 5,
          backgroundColor: 'transparent', borderColor: 'transparent',
        }}
      >
        {planosterapeuticos.map(item => (
          <div className="card" onClick={() => selectIVCF(item)}>
            {item.data}
          </div>
        ))}
      </div>
    )
  }
  // componentes para exibição do plano terapêutico atual e histórico de planos terapêuticos.
  function PlanoTerapeutico() {
    return (
      <div id="PLANO TERAPÊUTICO"
        className="card"
        style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center',
          marginTop: 20,
          padding: 0, paddingBottom: 10,
          width: window.innerWidth < 400 ? '90vw' : window.innerWidth > 400 && window.innerWidth < 1025 ? '70vw' : '78vw',
        }}>
        <div
          className="row"
          style={{
            display: 'flex',
            flexDirection: window.innerWidth > 400 ? 'row' : 'column',
            justifyContent: 'space-between',
            margin: 0, padding: 5, alignSelf: 'center', width: '100%',
            backgroundColor: 'grey',
            borderTopLeftRadius: 5, borderTopRightRadius: 5,
            borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
          }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: window.innerWidth > 400 ? 'row' : 'column', justifyContent: 'center', width: '100%' }}>
              <div className="title5" style={{ width: '100%', textAlign: 'left', justifyContent: 'flex-start' }}>
                {'PLANO TERAPÊUTICO ' + lastplanoterapeutico.map(item => item.id)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button title="INÍCIO" className="blue-button" style={{ width: window.innerWidth > 400 ? '10vw' : 100 }}>
                  {lastplanoterapeutico.map(item => item.data)}
                </button>
                <button title="STATUS" className="green-button" style={{ width: window.innerWidth > 400 ? '10vw' : 100 }}>
                  {lastplanoterapeutico.map(item => item.status) == 1 ? 'ATIVO' :
                    lastplanoterapeutico.map(item => item.status) == 2 ? 'INTERRROMPIDO' :
                      'CONCLUÍDO'
                  }
                </button>
                <button title="INTERROMPER PLANO TERAPÊUTICO" className="animated-yellow-button">
                  !
                </button>
              </div>
            </div>
            <ListaDePlanosTerapeuticos></ListaDePlanosTerapeuticos>
          </div>
        </div>
        <div className="title2center" style={{ margin: 0, marginTop: 5 }}>OBJETIVOS PRIMÁRIOS</div>
        <ObjetivosPrimarios></ObjetivosPrimarios>
        <div className="title2center" style={{ margin: 0 }}>OBJETIVOS SECUNDÁRIOS</div>
        <ObjetivosSecundarios></ObjetivosSecundarios>
        <VisaoCategorias></VisaoCategorias>
      </div>
    )
  }

  function VisaoCategorias() {
    return (
      <div id="atividades por categoria profissional"
        style={{
          display: 'flex',
          flexDirection: window.innerWidth > 1024 ? 'row' : 'column',
          justifyContent: 'center', position: 'relative',
          marginTop: 20,
        }}>
        <MenuCategoria></MenuCategoria>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignSelf: 'center' }}>
          <div id="scrollplanoterapeutico" className="scroll"
            style={{
              alignSelf: 'center',
              flexDirection: 'column',
              backgroundColor: 'transparent', borderColor: 'transparent',
              overflowY: 'hidden', scrollBehavior: 'smooth',
              padding: 0,
              // backgroundColor: 'red', borderColor: 'red',
              height: window.innerWidth > 1024 ? '65vh' : window.innerWidth < 1025 && window.innerWidth > 400 ? '50vh' : '60vh',
              width: window.innerWidth > 1024 ? '60vw' : window.innerWidth < 1025 && window.innerWidth > 400 ? '67vw' : '80vw'
            }}>
            <Metas></Metas>
            <Intervencoes></Intervencoes>
            <Metricas></Metricas>
            <Evolucoes></Evolucoes>
          </div>
          <SpecialScroll></SpecialScroll>
        </div>
      </div>
    )
  }

  // SUBCOMPONENTES DO PLANO TERAPÊUTICO:
  // scroll para rápida visualização dos componentes do plano terapêutico.
  function SpecialScroll() {
    return (
      <div
        id="specialscroll"
        className="specialscroll"
        //onMouseOver={() => document.getElementById("specialscroll").style.opacity = 1}
        //onMouseOut={() => document.getElementById("specialscroll").style.opacity = 0.2}
        style={{
          width: '3w', height: 300,
          display: 'flex', flexDirection: 'row', justifyContent: 'center',
          alignSelf: 'center', alignItems: 'center',
        }}>
        <div
          className="corprincipal"
          style={{
            width: 10, height: '50%', margin: 0, padding: 0,
            borderRadius: 50, position: 'relative', display: 'flex',
            flexDirection: 'column', justifyContent: 'space-between'
          }}>
          <buttom className="corprincipal" title="METAS"
            onClick={() => {
              document.getElementById("scrollplanoterapeutico").scrollTo(0, 0);
            }}
            style={{
              height: 20, minHeight: 20, width: 20, minWidth: 20, borderRadius: 50,
              boxShadow: 'none', marginLeft: -5
            }}>
          </buttom>
          <buttom className="corprincipal" title="INTERVENÇÕES"
            onClick={() => {
              var position = document.getElementById("MEDIDA").offsetHeight;
              document.getElementById("scrollplanoterapeutico").scrollTo(0, position);
            }}
            style={{
              height: 20, minHeight: 20, width: 20, minWidth: 20, borderRadius: 50,
              boxShadow: 'none', marginLeft: -5
            }}>
          </buttom>
          <buttom className="corprincipal" title="MÉTRICAS"
            onClick={() => {
              var position = document.getElementById("MEDIDA").offsetHeight;
              document.getElementById("scrollplanoterapeutico").scrollTo(0, 2 * position);
            }}
            style={{
              height: 20, minHeight: 20, width: 20, minWidth: 20, borderRadius: 50,
              boxShadow: 'none', marginLeft: -5
            }}>
          </buttom>
          <buttom className="corprincipal" title="EVOLUÇÕES"
            onClick={() => {
              var position = document.getElementById("MEDIDA").offsetHeight;
              document.getElementById("scrollplanoterapeutico").scrollTo(0, 3 * position);
            }}
            style={{
              height: 20, minHeight: 20, width: 20, minWidth: 20, borderRadius: 50,
              boxShadow: 'none', marginLeft: -5
            }}>
          </buttom>
        </div>
      </div>
    )
  }

  // MENU DE CATEGORIAS PROFISSIONAIS.
  // 1 = médico, 2 = enfermeiro, 3 = fisioterapeuta, 4 = fono, 5 = to, 6 = psicólogo, 7 = assistente social, 8 = religioso...
  const [categoria, setcategoria] = useState(1);
  // menu que exibe os tipos de profissionais participantes do plano terapêutico.
  const MenuCategoria = useCallback(() => {
    return (
      <div id="lista de profissionais" className="scroll"
        style={{
          display: 'flex',
          alignSelf: 'center',
          // backgroundColor: 'transparent', borderColor: 'transparent',
          flexDirection: window.innerWidth > 1024 ? 'column' : 'row',
          height: window.innerWidth > 1024 ? '65vh' : 80,
          minHeight: 80,
          width: window.innerWidth > 1024 ? '15vw' : window.innerWidth < 1025 && window.innerWidth > 400 ? '65vw' : '85vw',
          minWidth: window.innerWidth > 1024 ? '15vw' : window.innerWidth < 1025 && window.innerWidth > 400 ? '65vw' : '85vw',
          margin: 0,
          scrollBehavior: 'smooth',
          marginTop: window.innerWidth > 1024 ? 0 : 10,
          marginBottom: window.innerWidth > 1024 ? 0 : 10,
          marginRight: window.innerWidth > 1024 ? 0 : 0,
          paddingRight: window.innerWidth > 1024 ? 10 : 5,
          alignItems: 'center',
          overflowX: window.innerWidth > 1024 ? 'hidden' : 'scroll',
          overflowY: window.innerWidth > 1024 ? 'scroll' : 'hidden',
          borderRadius: 5,
        }}>
        <button className={categoria == 1 ? "red-button" : "blue-button"}
          id="btnmedico"
          onClick={() => {
            setcategoria(1);
            if (window.innerWidth < 1240) {
              setTimeout(() => {
                document.getElementById("lista de profissionais").scrollTo(0, 0);
                document.getElementById("btnmedico").style.minWidth = '60vw';
              }, 250);
            }
          }}
          style={{
            pading: 10,
            width: window.innerWidth > 1024 ? '100%' : 150,
            minWidth: 140
          }}>
          MÉDICO
        </button>

        <button className={categoria == 2 ? "red-button" : "blue-button"}
          id="btnenfermeiro"
          onClick={() => {
            setcategoria(2);
            if (window.innerWidth < 1240) {
              setTimeout(() => {
                document.getElementById("btnenfermeiro").style.minWidth = '60vw';
                setTimeout(() => {
                  var position = document.getElementById("btnmedico").offsetWidth + 5;
                  document.getElementById("lista de profissionais").scrollTo(position - 5, 0);
                }, 250);
              }, 250);
            }
          }}
          style={{
            pading: 10,
            width: window.innerWidth > 1024 ? '100%' : 150,
            minWidth: 140
          }}>
          ENFERMEIRO
        </button>

        <button className={categoria == 3 ? "red-button" : "blue-button"}
          id="btnfisioterapia"
          onClick={() => {
            setcategoria(3);
            if (window.innerWidth < 1240) {
              setTimeout(() => {
                document.getElementById("btnfisioterapia").style.minWidth = '60vw';
                setTimeout(() => {
                  var position = document.getElementById("btnmedico").offsetWidth + 5;
                  document.getElementById("lista de profissionais").scrollTo(2 * position - 5, 0);
                }, 250);
              }, 250);
            }
          }}
          style={{
            pading: 10,
            width: window.innerWidth > 1024 ? '100%' : 150,
            minWidth: 140
          }}>
          FISIOTERAPIA
        </button>

        <button className={categoria == 4 ? "red-button" : "blue-button"}
          id="btnfonoaudiologo"
          onClick={() => {
            setcategoria(4);
            if (window.innerWidth < 1240) {
              setTimeout(() => {
                document.getElementById("btnfonoaudiologo").style.minWidth = '60vw';
                setTimeout(() => {
                  var position = document.getElementById("btnmedico").offsetWidth + 5;
                  document.getElementById("lista de profissionais").scrollTo(3 * position - 5, 0);
                }, 250);
              }, 250);
            }
          }}
          style={{
            pading: 10,
            width: window.innerWidth > 1024 ? '100%' : 150,
            minWidth: 140
          }}>
          FONOAUDIÓLOGO
        </button>

        <button className={categoria == 5 ? "red-button" : "blue-button"}
          id="btnterapeutaocupacional"
          onClick={() => {
            setcategoria(5);
            if (window.innerWidth < 1240) {
              setTimeout(() => {
                document.getElementById("btnterapeutaocupacional").style.minWidth = '60vw';
                setTimeout(() => {
                  var position = document.getElementById("btnmedico").offsetWidth + 5;
                  document.getElementById("lista de profissionais").scrollTo(4 * position - 5, 0);
                }, 250);
              }, 250);
            }
          }}
          style={{
            pading: 10,
            width: window.innerWidth > 1024 ? '100%' : 150,
            minWidth: 140
          }}>
          TERAPEUTA OCUPACIONAL
        </button>

        <button className={categoria == 6 ? "red-button" : "blue-button"}
          id="btnpsicologo"
          onClick={() => {
            setcategoria(6);
            if (window.innerWidth < 1240) {
              setTimeout(() => {
                document.getElementById("btnpsicologo").style.minWidth = '60vw';
                setTimeout(() => {
                  var position = document.getElementById("btnmedico").offsetWidth + 5;
                  document.getElementById("lista de profissionais").scrollTo(5 * position - 5, 0);
                }, 250);
              }, 250);
            }
          }}
          style={{
            pading: 10,
            width: window.innerWidth > 1024 ? '100%' : 150,
            minWidth: 140
          }}>
          PSICÓLOGO
        </button>

        <button className={categoria == 7 ? "red-button" : "blue-button"}
          id="btnassistentesocial"
          onClick={() => {
            setcategoria(7);
            if (window.innerWidth < 1240) {
              setTimeout(() => {
                document.getElementById("btnassistentesocial").style.minWidth = '60vw';
                setTimeout(() => {
                  var position = document.getElementById("btnmedico").offsetWidth + 5;
                  document.getElementById("lista de profissionais").scrollTo(6 * position - 5, 0);
                }, 250);
              }, 250);
            }
          }}
          style={{
            pading: 10,
            width: window.innerWidth > 1024 ? '100%' : 150,
            minWidth: 140
          }}>
          ASSISTENTE SOCIAL
        </button>

      </div>
    )
  }, [categoria]);

  // OBJETIVOS PRIMÁRIO E SECUNDÁRIOS DO PLANO TERAPÊUTICO.
  // carregar objetivos primários e secundários relacionados ao plano terapêutico ativo.
  const loadObjetivos = () => {
    axios.get(html + "/objetivos").then((response) => {
      var x = [0, 1];
      x = response.data;
      setobjetivos(x);
    })
  };
  // excluir meta indesejada para o plano terapêutico.
  const deleteObjetivo = (item) => {
    axios.get(html + "/deleteobjetivo/'" + item.id + "'").then(() => {
      loadObjetivos();
    });
  }
  // validar/salvar a meta após definição do prazo (uma vez salva, seu prazo não poderá ser alterado. A meta pode ser excluída).
  const updateObjetivo = (item, valor) => {
    var obj = {
      tipo: item.tipo,
      objetivo: item.objetivo,
      desfecho: valor,
    };
    axios.post(html + '/updateobjetivos/' + item.id, obj).then(() => {
      loadObjetivos();
    });
  }
  // exibição de objetivos primários e secundários.
  function ObjetivosPrimarios() {
    return (
      <div className="scroll"
        style={{
          width: window.innerWidth < 400 ? '85vw' : window.innerWidth > 400 && window.innerWidth < 1025 ? '65vw' : '75vw',
          backgroundColor: "#f2f2f2", borderColor: "#f2f2f2",
        }}
      >
        {objetivos.filter(item => item.tipo == 1).map(item => (
          <div id="ITEM DE OBJETIVO PRIMÁRIO" className="row"
            style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center',
              width: window.innerWidth < 400 ? '80vw' : window.innerWidth > 400 && window.innerWidth > 1025 ? '70vw' : '100%',
            }}>
            <div
              style={{
                display: 'flex',
                flexDirection: window.innerWidth > 400 ? 'row' : 'column',
                width: '100%',
                justifyContent: 'space-between', alignItems: 'center',
              }}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <div className="title2" style={{ alignSelf: 'flex-start', marginLeft: 10, marginRight: 10, padding: 0, marginBottom: 5 }}>
                  {item.objetivo}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div
                  className={item.desfecho == 1 ? "blue-button" : item.desfecho == 2 ? "green-button" : item.desfecho == 3 ? "red-button" : "yellow-button"}
                  style={{ width: 150, display: item.desfecho == 0 ? 'none' : 'flex' }}>
                  {item.desfecho == 1 ? 'ATIVO' : item.desfecho == 2 ? 'SUCESSO' : item.desfecho == 3 ? 'FRACASSO' : 'CANCELADO'}
                </div>
                <button
                  title="EXCLUIR OBJETIVO PRIMÁRIO."
                  style={{ display: item.desfecho == 0 ? 'flex' : 'none' }}
                  className="animated-red-button"
                  onClick={(e) => { deleteObjetivo(item); e.stopPropagation() }}
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
                <button
                  title="CANCELAR OBJETIVO PRIMÁRIO."
                  style={{ display: item.desfecho == 1 ? 'flex' : 'none' }}
                  className="animated-yellow-button"
                  onClick={(e) => { updateObjetivo(item, 4); e.stopPropagation() }} // atualiza o objetivo como cancelado.
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
                <button
                  title="VALIDAR OBJETIVO PRIMÁRIO."
                  style={{ display: item.desfecho == 0 ? 'flex' : 'none' }}
                  className="animated-green-button"
                  onClick={(e) => { updateObjetivo(item, 1); e.stopPropagation() }}
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
        ))}
      </div>
    )
  }
  function ObjetivosSecundarios() {
    return (
      <div className="scroll"
        style={{
          height: 200, backgroundColor: "#f2f2f2", borderColor: "#f2f2f2",
          width: window.innerWidth < 400 ? '85vw' : window.innerWidth > 400 && window.innerWidth < 1025 ? '65vw' : '75vw'
        }}>
        {objetivos.filter(item => item.tipo == 2).map(item => (
          <div id="ITEM DE OBJETIVO SECUNDÁRIO" className="row"
            style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center',
              width: window.innerWidth < 400 ? '80vw' : window.innerWidth > 400 && window.innerWidth > 1025 ? '70vw' : '100%',
              minHeight: window.innerWidth < 400 ? '' : 65,
            }}>
            <div
              style={{
                display: 'flex',
                flexDirection: window.innerWidth > 400 ? 'row' : 'column',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <div className="title2" style={{ alignSelf: 'flex-start', marginLeft: 10, marginRight: 10, padding: 0, marginBottom: 5 }}>
                  {item.objetivo}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div
                  className={item.desfecho == 1 ? "blue-button" : item.desfecho == 2 ? "yellow-button" : item.desfecho == 3 ? "green-button" : "red-button"}
                  style={{ width: 150, display: item.desfecho == 0 ? 'none' : 'flex' }}>
                  {item.desfecho == 1 ? 'ATIVO' : item.desfecho == 2 ? 'SUCESSO' : item.desfecho == 3 ? 'FRACASSO' : 'CANCELADO'}
                </div>
                <button
                  title="EXCLUIR OBJETIVO SECUNDÁRIO."
                  style={{ display: item.desfecho == 0 ? 'flex' : 'none' }}
                  className="animated-red-button"
                  onClick={(e) => { deleteObjetivo(item); e.stopPropagation() }}
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
                <button
                  title="CANCELAR OBJETIVO SECUNDÁRIO."
                  style={{ display: item.desfecho == 1 ? 'flex' : 'none' }}
                  className="animated-yellow-button"
                  onClick={(e) => { updateObjetivo(item, 4); e.stopPropagation() }} // atualiza o objetivo como cancelado.
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
                <button
                  title="VALIDAR OBJETIVO SECUNDÁRIO."
                  style={{ display: item.desfecho == 0 ? 'flex' : 'none' }}
                  className="animated-green-button"
                  onClick={(e) => { updateObjetivo(item, 1); e.stopPropagation() }}
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
        ))}
      </div>
    )
  }

  // METAS DO PLANO TERAPÊUTICO (resultados futuros).
  /*
  status 0 = PENDENTE DE VALIDAÇÃO/SALVAMENTO. 
  status 1 = ATIVA. 
  status 2 = CANCELADA. 
  status 3 = PRAZO ATINGIDO.
  status 4 = ALCANÇADA.
  status 5 = NÃO ALCANÇADA.
  */

  // obtendo as metas relacionadas ao plano terapêutico.
  const loadMetas = () => {
    axios.get(html + "/metas").then((response) => {
      var x = [0, 1];
      x = response.data;
      setmetas(x);
    })
  };
  // excluir meta indesejada para o plano terapêutico.
  const deleteMeta = (item) => {
    axios.get(html + "/deletemeta/'" + item.id + "'").then(() => {
      loadMetas();
    });
  }
  // validar/salvar a meta após definição do prazo (uma vez salva, seu prazo não poderá ser alterado. A meta pode ser excluída).
  const updateMeta = (item, valor, prazo) => {
    var obj = {
      meta: item.meta,
      dominio: item.dominio,
      profissional: item.profissional, // categoria profissional, não o nome do profissional.
      inicio: item.inicio,
      prazo: moment().add(prazo, 'days').format('DD/MM/YYYY'),
      nota: item.nota,
      status: valor,
    };
    axios.post(html + '/updateproblema/' + item.id, obj).then(() => {
      loadMetas();
    });
  }
  // gráfico que exibe o tempo decorrido entre o início da meta e seu prazo.
  var dataChartMetas = [];
  const getMetas = (item) => {
    var prazo = moment(JSON.stringify(item.prazo).substring(1, 10), 'DD/MM/YYYY').diff(moment(JSON.stringify(item.inicio).substring(1, 10), 'DD/MM/YYYY'), 'days');
    var hoje = moment().format('DD/MM/YYYY');
    var feito = moment(hoje, 'DD/MM/YYYY').diff(moment(JSON.stringify(item.inicio).substring(1, 11), 'DD/MM/YYYY'), 'days');
    var remain = prazo - feito;
    // console.log('PRAZO: ' + prazo + ' FEITO: ' + feito);
    dataChartMetas = {
      datasets: [
        {
          data: [feito, remain],
          backgroundColor: ['#52be80', '#ec7063'],
          borderColor: '#ffffff',
          hoverBorderColor: ['#ffffff', '#ffffff'],
        },
      ],
    }
    return (
      <div id="ITEM DE META" className="row"
        style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center',
          width: '100%'
        }}>
        <div
          style={{
            display: 'flex',
            flexDirection: window.innerWidth > 400 ? 'row' : 'column',
            width: '100%',
            justifyContent: 'space-between', alignItems: 'center',
          }}>
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth > 400 ? 'row' : 'column',
            justifyContent: 'center', alignItems: 'center'
          }}>
            <Doughnut
              data={dataChartMetas}
              width={window.innerWidth > 400 ? 75 : 50}
              height={window.innerWidth > 400 ? 75 : 50}
              plugins={ChartDataLabels}
              options={{
                cutoutPercentage: 40,
                plugins: {
                  legend: {
                    display: false
                  },
                  datalabels: {
                    display: false
                  }
                },
                tooltips: {
                  enabled: false,
                },
                hover: { mode: null },
                elements: {
                  arc: {
                    hoverBorderColor: '#E1E5F2',
                    borderColor: '#E1E5F2',
                    borderWidth: 5,
                    width: 50
                  },
                },
                animation: {
                  duration: 500,
                },
                title: {
                  display: false,
                  text: 'PRAZO',
                },
                legend: {
                  display: false,
                  position: 'bottom',
                },
                maintainAspectRatio: true,
                responsive: false,
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginLeft: 5 }}>
              <div className={window.innerWidth > 400 ? "title2" : "title2center"}
                style={{
                  alignSelf: 'flex-start',
                  marginLeft: 0,
                  padding: 0, marginBottom: 5
                }}>
                {item.meta}
              </div>
              <div className={window.innerWidth > 400 ? "title2" : "title2center"}
                style={{
                  fontSize: 12, margin: 0, padding: 0,
                  alignSelf: window.innerWidth > 400 ? 'flex-start' : 'center'
                }}>
                {'DEFINIÇÃO: ' + item.inicio}
              </div>
              <div className={window.innerWidth > 400 ? "title2" : "title2center"}
                style={{
                  display: item.status == 0 ? 'none' : 'flex',
                  fontSize: 12, margin: 0, padding: 0,
                  alignSelf: window.innerWidth > 400 ? 'flex-start' : 'center'
                }}>
                {'PRAZO: ' + item.prazo}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <input
              className="input"
              defaultValue={15}
              autoComplete="off"
              placeholder="QTDE."
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'QTDE.')}
              title="DIAS PARA CONCLUSÃO DA META."
              style={{
                display: item.status == 0 ? 'flex' : 'none',
                width: 50,
                margin: 2.5,
                flexDirection: 'column',
                boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
              }}
              // onKeyUp={(e) => updateItemQtde(e.target.value, item)}
              type="number"
              id="inputPrazo"
              maxLength={3}>
            </input>
            <div
              className={item.status == 1 ? "blue-button" : item.status == 2 ? "yellow-button" : item.status == 3 ? "green-button" : "red-button"}
              style={{ width: 150, display: item.status == 0 ? 'none' : 'flex' }}>
              {item.status == 1 ? 'ATIVA' : item.status == 2 ? 'CANCELADA' : item.status == 3 ? 'ALCANÇADA' : 'NÃO ALCANÇADA'}
            </div>
            <button
              title="EXCLUIR META."
              style={{ display: item.status == 0 ? 'flex' : 'none' }}
              className="red-button"
              onClick={(e) => { deleteMeta(item); e.stopPropagation() }}
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
            <button
              title="CANCELAR META."
              style={{ display: item.status == 1 ? 'flex' : 'none' }}
              className="animated-yellow-button"
              onClick={(e) => { updateMeta(item, 2, document.getElementById("inputPrazo").value); e.stopPropagation() }} // atualiza a meta como cancelada.
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
            <button
              title="VALIDAR META."
              style={{ display: item.status == 0 ? 'flex' : 'none' }}
              className="green-button"
              onClick={(e) => { updateMeta(item, 1, document.getElementById("inputPrazo").value); e.stopPropagation() }}
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
            <div title="AVALIAÇÃO DO RESULTADO" className="green-button"
              style={{ display: item.status == 3 ? 'flex' : 'none', padding: 10, width: 50, opacity: 1 }}>
              {item.nota}
            </div>
            <button
              title="CLASSIFICAR META COMO ALCANÇADA."
              style={{ display: item.status == 3 ? 'flex' : 'none' }}
              className="green-button"
              onClick={(e) => { updateMeta(item, 4, ''); e.stopPropagation() }} // atualiza a meta como alcançada.
            >
              {'ALCANÇADA'}
            </button>
            <button
              title="CLASSIFICAR META COMO NÃO ALCANÇADA."
              style={{ display: item.status == 3 ? 'flex' : 'none' }}
              className="red-button"
              onClick={(e) => { updateMeta(item, 5, ''); e.stopPropagation() }} // atualiza a meta como não alcançada.
            >
              {'NÃO ALCANÇADA'}
            </button>
          </div>
        </div>
      </div>
    )
  }
  // exibição de metas por categoria profissional.
  function Metas() {
    return (
      <div id="MEDIDA"
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center' }}>
        <div id="METAS" className="title4">METAS</div>
        <div id="view das metas" className="scroll"
          style={{
            width: window.innerWidth > 1024 ? '58vw' : window.innerWidth < 1025 && window.innerWidth > 400 ? '65vw' : '75vw',
            height: window.innerWidth > 1024 ? '56vh' : window.innerWidth < 1025 && window.innerWidth > 400 ? '43vh' : '51vh',
            margin: 0,
            backgroundColor: '#f2f2f2', borderColor: '#f2f2f2'
          }}>
          {metas.filter(item => item.profissional == categoria).map(item => getMetas(item))}
        </div>
      </div>
    )
  }

  // INTERVENÇÕES DO PLANO TERAPÊUTICO (medidas terapêuticas definidas para o alcance das metas).
  /*
  status 0 = PENDENTE DE VALIDAÇÃO/SALVAMENTO. 
  status 1 = ATIVA. 
  status 2 = CANCELADA. 
  status 3 = CONCLUÍDA.
  */

  // obtendo as intervenções relacionadas ao plano terapêutico.
  const loadIntervencoes = () => {
    axios.get(html + "/intervencoes").then((response) => {
      var x = [0, 1];
      x = response.data;
      setintervencoes(x);
    })
  };
  // excluir intervenção indesejada para o plano terapêutico.
  const deleteIntervencoes = (item) => {
    axios.get(html + "/deleteintervencoes/'" + item.id + "'").then(() => {
      loadIntervencoes();
    });
  }
  // validar/salvar a intervenção após definição do prazo (uma vez salva, seu prazo não poderá ser alterado. A intervenção pode ser excluída).
  const updateIntervencao = (item, local, inicio, periodicidade, horainicio, horatermino, prazo, status) => {
    var obj = {
      idpaciente: idpaciente,
      idplanoterapeutico: idplanoterapeutico,
      intervencao: item.intervencao,
      dominio: item.dominio,
      profissional: item.profissional,
      local: local == '' ? item.local : local,
      inicio: inicio == '' ? item.inicio : inicio,
      periodicidade: periodicidade == '' ? item.periodicidade : periodicidade,
      horainicio: horainicio == '' ? item.horainicio : horainicio,
      horatermino: horatermino == '' ? item.horatermino : horatermino,
      prazo: prazo,
      status: status,
    };
    axios.post(html + '/updateintervencao/' + item.id, obj).then(() => {
      loadMetas();
    });
  }
  // gráfico que exibe o tempo decorrido entre o início da intervenção e seu prazo.
  var dataChartIntervencoes = [];
  const getIntervencoes = (item) => {
    var prazo = moment(JSON.stringify(item.prazo).substring(1, 10), 'DD/MM/YYYY').diff(moment(JSON.stringify(item.inicio).substring(1, 10), 'DD/MM/YYYY'), 'days');
    var hoje = moment().format('DD/MM/YYYY');
    var feito = moment(hoje, 'DD/MM/YYYY').diff(moment(JSON.stringify(item.inicio).substring(1, 11), 'DD/MM/YYYY'), 'days');
    var remain = prazo - feito;
    // console.log('PRAZO: ' + prazo + ' FEITO: ' + feito);
    dataChartIntervencoes = {
      datasets: [
        {
          data: [feito, remain],
          backgroundColor: ['#52be80', '#ec7063'],
          borderColor: '#ffffff',
          hoverBorderColor: ['#ffffff', '#ffffff'],
        },
      ],
    }
    return (
      <div id="ITEM DE INTERVENÇÃO" className="row"
        style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center',
          width: '100%'
        }}>
        <div
          style={{
            display: 'flex',
            flexDirection: window.innerWidth > 400 ? 'row' : 'column',
            width: '100%',
            justifyContent: 'space-between', alignItems: 'center',
          }}>
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth > 400 ? 'row' : 'column',
            justifyContent: 'center', alignItems: 'center'
          }}>
            <Doughnut
              data={dataChartIntervencoes}
              width={window.innerWidth > 400 ? 75 : 50}
              height={window.innerWidth > 400 ? 75 : 50}
              plugins={ChartDataLabels}
              options={{
                cutoutPercentage: 40,
                plugins: {
                  legend: {
                    display: false
                  },
                  datalabels: {
                    display: false
                  }
                },
                tooltips: {
                  enabled: false,
                },
                hover: { mode: null },
                elements: {
                  arc: {
                    hoverBorderColor: '#E1E5F2',
                    borderColor: '#E1E5F2',
                    borderWidth: 5,
                    width: 50
                  },
                },
                animation: {
                  duration: 500,
                },
                title: {
                  display: false,
                  text: 'PRAZO',
                },
                legend: {
                  display: false,
                  position: 'bottom',
                },
                maintainAspectRatio: true,
                responsive: false,
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginLeft: 5 }}>
              <div className={window.innerWidth > 400 ? "title2" : "title2center"}
                style={{
                  alignSelf: 'flex-start',
                  marginLeft: 0,
                  padding: 0, marginBottom: 5
                }}>
                {item.intervencao}
              </div>
              <div className={window.innerWidth > 400 ? "title2" : "title2center"}
                style={{
                  fontSize: 12, margin: 0, padding: 0,
                  alignSelf: window.innerWidth > 400 ? 'flex-start' : 'center'
                }}>
                {'DEFINIÇÃO: ' + item.inicio}
              </div>
              <div className={window.innerWidth > 400 ? "title2" : "title2center"}
                style={{
                  display: item.status == 0 ? 'none' : 'flex',
                  fontSize: 12, margin: 0, padding: 0,
                  alignSelf: window.innerWidth > 400 ? 'flex-start' : 'center'
                }}>
                {'PRAZO: ' + item.prazo}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <input
              className="input"
              defaultValue={15}
              autoComplete="off"
              placeholder="QTDE."
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'QTDE.')}
              title="DIAS PARA CONCLUSÃO DA INTERVENÇÃO."
              style={{
                display: item.status == 0 ? 'flex' : 'none',
                width: 50,
                margin: 2.5,
                flexDirection: 'column',
                boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
              }}
              // onKeyUp={(e) => updateItemQtde(e.target.value, item)}
              type="number"
              id="inputPrazo"
              maxLength={3}>
            </input>
            <div
              className={item.status == 1 ? "blue-button" : item.status == 2 ? "yellow-button" : item.status == 3 ? "green-button" : "red-button"}
              style={{ width: 150, display: item.status == 0 ? 'none' : 'flex' }}>
              {item.status == 1 ? 'ATIVA' : item.status == 2 ? 'CANCELADA' : 'CONCLUÍDA'}
            </div>
            <button
              title="EXCLUIR INTERVENÇÃO."
              style={{ display: item.status == 0 ? 'flex' : 'none' }}
              className="red-button"
              onClick={(e) => { deleteIntervencoes(item); e.stopPropagation() }}
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
            <button
              title="CANCELAR INTERVENÇÃO."
              style={{ display: item.status == 1 ? 'flex' : 'none' }}
              className="animated-yellow-button"
              onClick={(e) => {
                updateIntervencao(
                  item,
                  item.local,
                  item.inicio,
                  item.periodicidade,
                  item.horainicio,
                  item.horatermino,
                  item.prazo,
                  2
                ); e.stopPropagation()
              }} // atualiza a intervenção como cancelada.
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
            <button
              title="VALIDAR META."
              style={{ display: item.status == 0 ? 'flex' : 'none' }}
              className="green-button"
              onClick={(e) => {
                updateIntervencao(
                  item,
                  document.getElementById("inputLocal").value,
                  document.getElementById("inputInicio").value,
                  document.getElementById("inputPeriodicidade").value,
                  document.getElementById("inputHoraInicio").value,
                  document.getElementById("inputHoraTermino").value,
                  document.getElementById("inputPrazo").value,
                  1
                ); e.stopPropagation()
              }} // atualiza a meta como cancelada.
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
        <div id="AGENDA DA INTERVENÇÃO">
          CODIFICAR AGENDA COM DATAS E HORÁRIOS DAS INTERVENÇÕES...
        </div>
      </div>
    )
  }
  // exibição de metas por categoria profissional.
  function Intervencoes() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center' }}>
        <div id="INTERVENCOES" className="title4">INTERVENÇÕES TERAPÊUTICAS</div>
        <div id="view das intervenções" className="scroll"
          style={{
            width: window.innerWidth > 1024 ? '58vw' : window.innerWidth < 1025 && window.innerWidth > 400 ? '65vw' : '75vw',
            height: window.innerWidth > 1024 ? '56vh' : window.innerWidth < 1025 && window.innerWidth > 400 ? '43vh' : '51vh',
            margin: 0,
            backgroundColor: '#f2f2f2', borderColor: '#f2f2f2'
          }}>
          {intervencoes.filter(item => item.profissional == categoria).map(item => getIntervencoes(item))}
        </div>
      </div>
    )
  }

  // MÉTRICAS.
  /*
  Todas os registros de escala são guardados em uma única tabela. 
  O tipo de tabela é indicado pelo campo tipo.
  A escala IVCF, por sua vez, é armazenada em tabela específica, que armazena também os valores
  usados para preenchimento da mesma (estes são declarados e visualizados no componente específico).
  1 = MIF.
  2 = PPS.
  3 = Braden.
  4 = Morse.
  
  Distribuição das escalas por categoria profissional.
  1. MÉDICO: MIF
  2. ENFERMEIRO: ESCALA DE DOR
  3. FISIOTERAPEUTA: ?
  4. FONOAUDIÓLOGO: ?
  5. TERAPEUTA OCUPACIONAL: ?
  6. PSICÓLOGO: ?
  7. ASSISTENTE SOCIAL: ?
  
  Na maioria das situações, a mensuração não poderá ser feita por escalas,
  mas apenas por um conjunto de perguntas e respostas.
  */

  // carregando todos os tipos de tabelas cadastrados.
  // carregar todos os tipos de escala.
  const loadTiposEscalas = () => {
    axios.get(html + "/tiposescalas").then((response) => {
      var x = [0, 1];
      x = response.data;
      settiposescalas(x);
    })
  };

  // carregando dados de todas as escalas.
  // carregar registros de escala.
  const loadEscalas = () => {
    axios.get(html + "/escalas").then((response) => {
      var x = [0, 1];
      x = response.data;
      setescalas(x);
    })
  };
  // excluir registro de escala.
  const deleteEscala = (item) => {
    axios.get(html + "/deleteescala/'" + item.id + "'").then(() => {
      loadEscalas();
    });
  }
  // inserir registro de escala.
  const insertEscala = (tipo, valor) => {
    var obj = {
      idpaciente: idpaciente,
      data: moment().format('DD/MM/YYYY'),
      tipo: tipo, // define a escala (MIF, etc.)
      valor: valor, // valor da escala.
      profissional: nomeusuario, // nome do profissional que prerencheu a escala.
    };
    axios.post(html + '/insertbalanco', obj);
  }

  // exibição de escalas para mensuração de desempenho, por categoria profissional.
  var effectColors = {
    highlight: 'rgba(255, 255, 255, 0.75)',
    shadow: 'rgba(0, 0, 0, 0.5)',
    glow: 'rgb(255, 255, 0)'
  };

  function Metricas() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center' }}>
        <div id="METRICAS" className="title4">MÉTODOS DE MENSURAÇÃO</div>
        <div id="view das métricas" className="scroll"
          style={{
            width: window.innerWidth > 1024 ? '58vw' : window.innerWidth < 1025 && window.innerWidth > 400 ? '65vw' : '75vw',
            height: window.innerWidth > 1024 ? '56vh' : window.innerWidth < 1025 && window.innerWidth > 400 ? '43vh' : '51vh',
            margin: 0,
            backgroundColor: '#f2f2f2', borderColor: '#f2f2f2'
          }}>
          {tiposescalas.map(item => (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
              <div className="card" style={{ width: '10vw', fontWeight: 'bold' }}>
                {item.nome}
              </div>
              <div>
                {getEscala(item)}
              </div>
            </div>
          ))}
        </div>
      </div >
    )
  }

  // preparando os gráficos em linha para as escalas.
  var dataChartEscalas = [];
  function getEscala(item) {
    var datas = escalas.filter(value => value.tipo == item.tipoescala && value.idpaciente == idpaciente).map(item => item.data);
    var valores = escalas.filter(value => value.tipo == item.tipoescala && value.idpaciente == idpaciente).map(item => parseInt(item.valor));
    console.log('DATAS: ' + datas + ' / ' + ' VALORES: ' + valores);
    dataChartEscalas = {
      labels: datas,
      datasets: [
        {
          lineTension: 0,
          borderRadius: 5,
          // borderWidth: 3,
          boxShadow: '0px 2px 20px 5px rgba(0, 0, 0, 0.1)',
          data: valores,
          pointBackgroundColor: '#52be80',
          fill: true,
          backgroundColor: 'transparent',
          boxShadow: '0px 2px 20px 5px rgba(0, 0, 0, 0.1)',
          borderColor: 'rgba(82, 190, 128, 1)',
          hoverBorderColor: '#E1E5F2',
          shadowOffsetX: 0,
          shadowOffsetY: 2,
          shadowBlur: 10,
          shadowColor: effectColors.shadow
        },
      ],
    }
    return (
      <div
        className="scroll"
        style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',
          margin: 5, padding: 0, paddingRight: 0,
          overflowY: 'hidden', overflowX: 'scroll',
          width: '50vw'
        }}
      >
        <div style={{ alignSelf: 'flex-start' }}>
          <Line
            data={dataChartEscalas}
            padding={10}
            width={valores.length * 0.1 * window.innerWidth}
            height={0.13 * window.innerWidth}
            plugins={ChartDataLabels}
            options={
              {
                layout: {
                  padding: 10
                },
                scales: {
                  xAxes: [
                    {
                      display: window.innerWidth > 400 ? true : false,
                      ticks: {
                        fontColor: '#61636e',
                        fontWeight: 'bold',
                      },
                      gridLines: {
                        zeroLineColor: 'transparent',
                        lineWidth: 0,
                        drawOnChartArea: true,
                      },
                    },
                  ],
                  yAxes: [
                    {
                      display: false,
                      ticks: {
                        suggestedMin: item.min,
                        suggestedMax: item.max + 10,
                        fontColor: '#61636e',
                        fontWeight: 'bold',
                      },
                      gridLines: {
                        zeroLineColor: 'transparent',
                        lineWidth: 0,
                        drawOnChartArea: true,
                      },
                    },
                  ],
                },
                plugins: {
                  datalabels: {
                    display: false,
                    color: '#ffffff',
                    font: {
                      weight: 'bold',
                      size: 16,
                    },
                  },
                },
                tooltips: {
                  enabled: window.innerWidth > 400 ? true : false,
                  displayColors: false,
                },
                hover: { mode: null },
                elements: {},
                animation: {
                  duration: 500,
                },
                title: {
                  display: false,
                  text: 'ESCALA',
                },
                legend: {
                  display: false,
                  position: 'bottom',
                },
                maintainAspectRatio: true,
                responsive: false,
              }}
          />
        </div>
      </div >
    )
  }

  // última evolução por categoria profissional.
  function Evolucoes() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center' }}>
        <div id="EVOLUÇÃO" className="title4">EVOLUÇÃO</div>
        <div id="view das evoluções" className="scroll"
          style={{
            width: window.innerWidth > 1024 ? '58vw' : window.innerWidth < 1025 && window.innerWidth > 400 ? '65vw' : '75vw',
            height: window.innerWidth > 1024 ? '56vh' : window.innerWidth < 1025 && window.innerWidth > 400 ? '43vh' : '51vh',
            margin: 0, marginBottom: 10,
            backgroundColor: '#f2f2f2', borderColor: '#f2f2f2'
          }}>
          {listevolucoes.filter(item => item.idpaciente == idpaciente && item.funcao == categoria).map(item => item.evolucao).slice(-1)}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', height: '100%',
      // width: window.innerWidth < 1024 ? '65vw' : window.innerWidth < 400 ? '100vw' : '82vw',
      width: '100%',
    }}>
      <div
        id="scroll"
        className="scroll"
        style={{
          scrollBehavior: 'smooth',
          width: '100%',
          height: '80vh',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
          alignSelf: 'center', verticalAlign: 'center',
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          paddingRight: 10,
        }}>
        <div className="title4" style={{ margin: 15, marginTop: 15 }}>ESCALA DE MORAES</div>
        <Regua></Regua>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <AvaliacaoDeDeclinioFuncional></AvaliacaoDeDeclinioFuncional>
          <ClassificacaoDeRiscoFuncional></ClassificacaoDeRiscoFuncional>
        </div>
        <DeterminantesDoDeclinioFuncionalEstabelecido></DeterminantesDoDeclinioFuncionalEstabelecido>
        <LinhaDeCuidados></LinhaDeCuidados>
        <PlanoTerapeutico></PlanoTerapeutico>
      </div>
    </div>
  )
}

export default AptPlanoTerapeutico;