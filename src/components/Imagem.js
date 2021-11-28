/* eslint eqeqeq: "off" */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import Context from '../Context';

function Imagem(
  { viewimagem,
    idatendimento,
  }) {
  //servidor.
  var html = 'https://pulsarapp-server.herokuapp.com';

  // recuperando estados globais (Context.API).
  const {
    setlistimagem,
    setarrayimagem,
  } = useContext(Context)

  // chave para exibição do componente.
  const [viewcomponent, setviewcomponent] = useState(viewimagem);

  useEffect(() => {
    if (viewimagem === 1) {
      loadOptionsImagens();
      setviewcomponent(viewimagem);
      // limpando as listas de exames disponíveis e filtrados.
      setselectedlistimagem([]);
      setarrayfilterimagem([]);
      setfilterimagem('');
    } else {
    }
  }, [viewimagem])

  const loadImagem = () => {
    axios.get(html + "/image/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistimagem(x.sort((a, b) => moment(a.datapedido, 'DD/MM/YYYY HH:MM') < moment(b.datapedido, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
      setarrayimagem(x.sort((a, b) => moment(a.datapedido, 'DD/MM/YYYY HH:MM') < moment(b.datapedido, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
    });
  }

  // inserindo registro.
  const insertData = (item) => {
    var obj = {
      idatendimento: item.idatendimento,
      codigo: item.codigo,
      exame: item.exame,
      laudo: item.laudo,
      justificativa: justify.toUpperCase(),
      status: 1,
      pedido: moment().format('DD/MM/YY HH:mm'),
      resultado: item.resultado,
    };
    axios.post(html + '/insertimage', obj);
  };

  const [arrayimg, setarrayimg] = useState([]);
  // inserindo os registros de exames de imagem solicitados no banco de dados.
  const insertImagem = () => {
    arrayimg.map((item) => insertData(item));
    setTimeout(() => {
      loadImagem();
      fechar();
    }, 2000);
  }

  // carregando lista de opções de exames de imagem.
  const [listimg, setlistimg] = useState([])
  const loadOptionsImagens = () => {
    axios.get(html + '/imagem_options').then((response) => {
      setlistimg(response.data);
    });
  }

  // array com os exames de imagem selecionados.
  const [selectedlistimagem, setselectedlistimagem] = useState([]);
  // funções e componentes para busca e adição de outros exames.
  const [filterimagem, setfilterimagem] = useState('');
  var searchimagem = '';
  var timeout = null;
  const [arrayfilterimagem, setarrayfilterimagem] = useState([listimg]);
  const filterImagem = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterImagem").focus();
    searchimagem = document.getElementById("inputFilterImagem").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchimagem === '') {
        setarrayfilterimagem([]);
        document.getElementById("inputFilterImagem").value = '';
        document.getElementById("inputFilterImagem").focus();
      } else {
        setfilterimagem(document.getElementById("inputFilterImagem").value.toUpperCase());
        setarrayfilterimagem(listimg.filter(item => item.exame.includes(searchimagem) === true));
        document.getElementById("inputFilterImagem").value = searchimagem;
        document.getElementById("inputFilterImagem").focus();
      }
    }, 500);
  }
  const addImagem = (item) => {
    var exame = item.exame;
    var newimagem = {
      idatendimento: idatendimento,
      codigo: item.codigo,
      exame: item.exame,
      laudo: item.laudo,
      status: 'PENDENTE',
      pedido: moment().format('DD/MM/YY HH:mm'),
      resultado: '',
    }
    const x = arrayimg.indexOf((item) => item.exame === exame);
    if (x !== '') {
      arrayimg.push(newimagem);
      selectedlistimagem.push(newimagem);
      setarrayfilterimagem([]);
      setfilterimagem('');
      document.getElementById("inputFilterImagem").value = '';
      document.getElementById("inputFilterImagem").focus();
    }
  }
  const deleteImagem = (item) => {
    var exame = item.exame;
    const x = arrayimg.indexOf((item) => item.exame === exame);
    const y = selectedlistimagem.indexOf((item) => item.exame === exame);
    arrayimg.splice(x, 1);
    selectedlistimagem.splice(y, 1);
    setarrayfilterimagem([]);
    setfilterimagem('');
    document.getElementById("inputFilterImagem").value = '';
    document.getElementById("inputFilterImagem").focus();
  }

  var justify = '';
  const setJustificativa = () => {
    justify = document.getElementById("inputJustificativa").value;
  }

  function ShowSearchImagem() {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
      }}>
        <input
          className="input"
          autoComplete="off"
          placeholder="BUSCAR EXAME..."
          onClick={() => document.getElementById("inputJustificativa").style.display = "none"}
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'BUSCAR EXAME...')}
          onChange={() => { filterImagem(); document.getElementById("inputJustificativa").style.display = "none" }}
          style={{
            width: window.innerWidth > 400 ? '60vw' : '75vw',
            margin: 20,
          }}
          type="text"
          id="inputFilterImagem"
          defaultValue={filterimagem}
          maxLength={100}
        ></input>
        <div
          className="scroll"
          id="LISTA DE EXAMES DE IMAGEM DISPONÍVEIS"
          style={{
            display: arrayfilterimagem.length > 0 ? 'flex' : 'none',
            height: '30vh',
            width: window.innerWidth > 400 ? '60vw' : '75vw',
            margin: 20,
          }}
        >
          {arrayfilterimagem.map((item) => (
            <p
              key={item.id}
              id="item da lista"
              className="row"
            >
              <button
                onClick={() => { addImagem(item); document.getElementById("inputJustificativa").style.display = "flex" }}
                className="hover-button"
                style={{
                  width: '100%',
                }}
              >
                {item.exame}
              </button>
            </p>
          ))}
        </div>
        <div
          className="scroll"
          id="LISTA DE EXAMES DE IMAGEM SELECIONADOS"
          style={{
            display: arrayfilterimagem.length > 0 ? 'none' : 'flex',
            height: '30vh',
            width: window.innerWidth > 400 ? '60vw' : '75vw',
            margin: 20,
          }}
        >
          {selectedlistimagem.map((item) => (
            <div
              key={item.id}
              id="item da lista"
              className="row"
            >
              <button
                className="hover-button"
                style={{
                  width: '100%',
                }}
              >
                {item.exame}
              </button>
              <button className="animated-red-button"
                onClick={() => deleteImagem(item)}
                style={{ marginRight: 0, height: 'calc(100% - 5px)' }}
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
        <textarea
          className="textarea"
          autoComplete="off"
          placeholder="JUSTIFICATIVA"
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'JUSTIFICATIVA')}
          onChange={() => setJustificativa()}
          style={{
            height: '20vh',
            width: window.innerWidth > 400 ? '60vw' : '75vw',
            margin: 20,
            marginTop: 0
          }}
          type="text"
          id="inputJustificativa"
          maxLength={300}
        ></textarea>
      </div>
    );
  }

  const fechar = () => {
    setviewcomponent(0);
    window.scrollTo(0, 0);
    document.body.style.overflow = null;
  }

  // renderização do componente.
  if (viewcomponent != 0) {
    return (
      <div className="menucover fade-in" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer"
          onClick={(e) => { document.getElementById("inputJustificativa").style.display = "flex"; e.stopPropagation() }}
        >
          <div className="menucontainer">
            <div id="cabeçalho" className="cabecalho">
              <div className="title5">{'SOLICITAR EXAME DE IMAGEM'}</div>
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
                <button className="green-button"
                  onClick={() => insertImagem()}
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
              <ShowSearchImagem></ShowSearchImagem>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
export default Imagem;