import React, { useState, useContext, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/pt-br';
import Context from '../Context';

// import setaesquerda from '../images/arrowleft.svg';
// import setadireita from '../images/arrowright.svg';

function AptPlanoTerapeutico() {
  // recuperando estados globais (Context.API).
  const {
    idatendimento
  } = useContext(Context)
  var html = 'https://pulsarapp-server.herokuapp.com';

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

  const [planoterapeutico, setplanoterapeutico] = useState([])
  const loadPlanoTerapeutico = () => {
    axios.get(html + "/planoterapeutico").then((response) => {
      var x = [0, 1];
      x = response.data;
      setplanoterapeutico(x.filter(item => item.idatendimento == idatendimento));
    });
  }

  function ListaDePlanosTerapeuticos() {
    return (
      <div className="scroll">
        {planoterapeutico.map(item => (
          <div className="row">
            <button onClick={() => selectPlanoTerapeutico(item)}>{item.data}</button>
          </div>
        ))}
      </div>
    )
  }

  const selectPlanoTerapeutico = (item) => {
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

  const createPlanoTerapeutico = () => {
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
    axios.post(html + '/createplanoterapeutico', obj).then(() => {
    });
  }

  const updatePlanoTerapeutico = (item) => {
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
    axios.post(html + '/updateplanoterapeutico/' + item.id, obj).then(() => {
    });
  }

  const deletePlanoTerapeutico = (item) => {
    axios.get(html + "/deleteplanoterapeutico/'" + item.id + "'").then(() => {
    });
  }

  function Regua() {
    return (
      <div id="ESCALA">
        <div id="setas fragilidade x vitalidade"
          style={{
            padding: 5, margin: 5, backgroundImage: 'linear-gradient(to right, #ec7063, #f5b041, #52be80)',
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderRadius: 5,
            height: 25,
          }}
        >
          <div id="fragilidade"
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <div className="title2" style={{ color: 'white', height: 30, textShadow: '0px 0px 3px black' }}>{'FRAGILIDADE'}</div>
          </div>
          <div id="vitalidade"
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <div className="title2" style={{ color: 'white', height: 30, textShadow: '0px 0px 3px black' }}>{'VITALIDADE'}</div>
          </div>
        </div>
        <div id="regua"
          style={{
            width: '100%', padding: 5, margin: 5,
            display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly',
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
      <div id="AVALIAÇÃO DE DECLÍNIO FUNCIONAL - ADF">
        <div className="title2">AVALIAÇÃO DE DECLÍNIO FUNCIONAL</div>
        <div id="ADF - opções" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: 5, marginTop: 0 }}>
          <button style={{ width: '8vw', height: 90, opacity: adf == 1 ? 1 : 0.3 }} className="green-button" onClick={() => setadf(1)}>
            AUSENTE
          </button>
          <button style={{ width: '9vw', height: 90, opacity: adf == 2 ? 1 : 0.3 }} className="yellow-button" onClick={() => setadf(2)}>
            IMINENTE
          </button>
          <button style={{ width: adf != 3 ? '9vw' : '20vw', height: 90, opacity: adf == 3 ? 1 : 0.3 }} className="red-button" onClick={() => setadf(3)}>
            <div>ESTABELECIDO</div>
            <div id="ADF - opções - estabelecido" style={{ display: adf == 3 ? 'flex' : 'none', justifyContent: 'space-evenly' }}>
              <button className="softred-button"
                style={{
                  maxHeight: 40,
                  borderColor: adfbasica == 1 ? 'white' : 'transparent', borderWidth: 3,
                  borderStyle: 'solid', width: '9vw', fontSize: 12, padding: 5, opacity: adfbasica == 1 ? 1 : 0.5
                }}
                onClick={adfbasica == 1 ? () => setadfbasica(0) : () => setadfbasica(1)}>
                AVD BÁSICA
              </button>
              <button className="softred-button"
                style={{
                  maxHeight: 40,
                  borderColor: adfinstrumental == 1 ? 'white' : 'transparent', borderWidth: 3,
                  borderStyle: 'solid', width: '9vw', fontSize: 12, padding: 5, opacity: adfinstrumental == 1 ? 1 : 0.5,
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
        <div className="title2">CLASSIFICAÇÃO DE RISCO FUNCIONAL</div>
        <div id="CRF - opções" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: 5, marginTop: 0 }}>
          <button style={{ width: '8vw', height: 90, opacity: crf == 1 ? 1 : 0.3 }} className="green-button" onClick={() => setcrf(1)}>
            PACIENTE ROBUSTO
          </button>
          <button style={{ width: '9vw', height: 90, opacity: crf == 2 ? 1 : 0.3, maxHeight: 200 }} className="yellow-button" onClick={() => setcrf(2)}>
            RISCO DE FRAGILIZAÇÃO
          </button>
          <button style={{ width: crf != 3 ? '9vw' : '20vw', height: 90, opacity: crf == 3 ? 1 : 0.3 }} className="red-button" onClick={() => setcrf(3)}>
            PACIENTE FRÁGIL
            <div id="CRF - opções - paciente frágil" style={{ display: crf == 3 ? 'flex' : 'none', justifyContent: 'space-evenly' }}>
              <button
                style={{
                  width: '9vw', fontSize: 12, padding: 5, opacity: crfpctefragil == 1 ? 1 : 0.5,
                  borderColor: crfpctefragil == 1 ? 'white' : 'transparent', borderWidth: 3,
                  borderStyle: 'solid', width: '9vw'
                }}
                className="softred-button" onClick={() => setcrfpctefragil(1)}>
                BAIXA COMPLEXIDADE
              </button>
              <button
                style={{
                  width: '45%', fontSize: 12, padding: 5, opacity: crfpctefragil == 2 ? 1 : 0.5,
                  borderColor: crfpctefragil == 2 ? 'white' : 'transparent', borderWidth: 3,
                  borderStyle: 'solid', width: '9vw'
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
      <div id="DETERMINANTES DO DECLÍNIO FUNCIONAL ESTABELECIDO - DDFE" style={{ display: adf == 3 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="title2">DETERMINANTES DO DECLÍNIO FUNCIONAL ESTABELECIDO</div>
        <div id="DDFE - opções" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: 5, margin: -10 }}>
          <div className="card" style={{ flexDirection: 'column', justifyContent: 'center', width: '15vw' }}>
            <div className="title2center" style={{ fontSize: 14, height: 50 }}>COGNIÇÃO</div>
            <div id="DFE - opções - cognição" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', marginBottom: 10 }}>
              <button className={ddfecognicao == 1 ? "red-button" : "blue-button"} onClick={() => setddfecognicao(1)}>
                L
              </button>
              <button className={ddfecognicao == 2 ? "red-button" : "blue-button"} onClick={() => setddfecognicao(2)}>
                M
              </button>
              <button className={ddfecognicao == 3 ? "red-button" : "blue-button"} onClick={() => setddfecognicao(3)}>
                G
              </button>
            </div>
          </div>
          <div className="card" style={{ flexDirection: 'column', justifyContent: 'center', width: '15vw' }}>
            <div className="title2center" style={{ fontSize: 14, height: 50 }}>HUMOR E COMPORTAMENTO</div>
            <div id="DFE - opções - humor e comportamento" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', marginBottom: 10 }}>
              <button className={ddfehumor == 1 ? "red-button" : "blue-button"} onClick={() => setddfehumor(1)}>
                L
              </button>
              <button className={ddfehumor == 2 ? "red-button" : "blue-button"} onClick={() => setddfehumor(2)}>
                M
              </button>
              <button className={ddfehumor == 3 ? "red-button" : "blue-button"} onClick={() => setddfehumor(3)}>
                G
              </button>
            </div>
          </div>
          <div className="card" style={{ flexDirection: 'column', justifyContent: 'center', width: '15vw' }}>
            <div className="title2center" style={{ fontSize: 14, height: 50 }}>MOBILIDADE</div>
            <div id="DFE - opções - mobilidade" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', marginBottom: 10 }}>
              <button className={ddfemobilidade == 1 ? "red-button" : "blue-button"} onClick={() => setddfemobilidade(1)}>
                L
              </button>
              <button className={ddfemobilidade == 2 ? "red-button" : "blue-button"} onClick={() => setddfemobilidade(2)}>
                M
              </button>
              <button className={ddfemobilidade == 3 ? "red-button" : "blue-button"} onClick={() => setddfemobilidade(3)}>
                G
              </button>
            </div>
          </div>
          <div className="card" style={{ flexDirection: 'column', justifyContent: 'center', width: '15vw' }}>
            <div className="title2center" style={{ fontSize: 14, height: 50 }}>COMUNICAÇÃO</div>
            <div id="DFE - opções - comunicação" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', marginBottom: 10 }}>
              <button className={ddfecomunicacao == 1 ? "red-button" : "blue-button"} onClick={() => setddfecomunicacao(1)}>
                L
              </button>
              <button className={ddfecomunicacao == 2 ? "red-button" : "blue-button"} onClick={() => setddfecomunicacao(2)}>
                M
              </button>
              <button className={ddfecomunicacao == 3 ? "red-button" : "blue-button"} onClick={() => setddfecomunicacao(3)}>
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
        <div className="title2">LINHA DE CUIDADOS</div>
        <div id="LINHA DE CUIDADOS" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', paddingLeft: 7.5, paddingRight: 7.5 }}>
          <button style={{ width: '22vw' }} className={linhasdecuidados == 1 ? "red-button" : "blue-button"} onClick={() => setlinhasdecuidados(1)}>
            REABILITAÇÃO
          </button>
          <button style={{ width: '22vw' }} className={linhasdecuidados == 2 ? "red-button" : "blue-button"} onClick={() => setlinhasdecuidados(2)}>
            CUIDADOS CRÔNICOS
          </button>
          <button style={{ width: '22vw' }} className={linhasdecuidados == 3 ? "red-button" : "blue-button"} onClick={() => setlinhasdecuidados(3)}>
            CUIDADOS PALIATIVOS
          </button>
        </div>
      </div>
    )
  }

  function MetasTerapeuticas() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="title2">METAS TERAPÊUTICAS</div>
        <div id="METAS TERAPÊUTICAS" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', paddingLeft: 7.5, paddingRight: 7.5, marginBottom: 10 }}>
          <button style={{ width: '22vw' }} className={metasterapeuticas == 1 ? "red-button" : "blue-button"} onClick={() => setmetasterapeuticas(1)}>
            PRIMÁRIAS
          </button>
          <button style={{ width: '22vw' }} className={metasterapeuticas == 2 ? "red-button" : "blue-button"} onClick={() => setmetasterapeuticas(2)}>
            SECUNDÁRIAS
          </button>
          <button style={{ width: '22vw' }} className={metasterapeuticas == 3 ? "red-button" : "blue-button"} onClick={() => setmetasterapeuticas(3)}>
            TERCIÁRIAS
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', width: '78vw' }}>
        <Regua></Regua>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <AvaliacaoDeDeclinioFuncional></AvaliacaoDeDeclinioFuncional>
          <ClassificacaoDeRiscoFuncional></ClassificacaoDeRiscoFuncional>
        </div>
        <DeterminantesDoDeclinioFuncionalEstabelecido></DeterminantesDoDeclinioFuncionalEstabelecido>
        <LinhaDeCuidados></LinhaDeCuidados>
        <MetasTerapeuticas></MetasTerapeuticas>
      </div>
    </div>
  )
}

export default AptPlanoTerapeutico;