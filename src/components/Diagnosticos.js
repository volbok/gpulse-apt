/* eslint eqeqeq: "off" */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import deletar from '../images/deletar.svg';
import save from '../images/salvar.svg';
import Toast from './Toast';
import { useHistory } from "react-router-dom";
import DatePicker from '../components/DatePicker';
import Context from '../Context';
import moment from 'moment';

function Diagnostico(
  {
    usuario,
    viewdiagnostico,
    iddiagnostico,
    iniciodiag,
    terminodiag,
    cid,
    diagnostico,
  }) {
  //servidor.
  var html = 'https://pulsarapp-server.herokuapp.com';
  // api para CID10:
  var cid10 = 'https://cid10-api.herokuapp.com/cid10';
  // recuperando estados globais (Context.API).
  const {
    idatendimento,
    idpaciente,
    setpickdate1,
    pickdate1,
    setpickdate2,
    pickdate2,
    setlistdiagnosticos,
    setarraydiagnosticos,
  } = useContext(Context)
  // history (react-router-dom).
  let history = useHistory()

  // chave para exibição do componente.
  const [viewcomponent, setviewcomponent] = useState(viewdiagnostico);

  // lista de diagnósticos CID10.
  const [listcid, setlistcid] = useState([]);
  const loadCid = (idpaciente) => {
    axios.get(html + "/cid10").then((response) => {
      setlistcid(response.data);
    });
  }

  // filtros para cid e diagnósticos.
  const [filtercid, setfiltercid] = useState('');
  const [filterdiagnostico, setfilterdiagnostico] = useState('');
  var searchcid = '';
  var searchdiagnostico = '';
  var timeout = null;
  const [arraydiagnostico, setarraydiagnostico] = useState([]);
  const filterCid = () => {
    setvalordatepicker(0);
    clearTimeout(timeout);
    document.getElementById("inputDiagnostico").value = '';
    searchdiagnostico = '';
    document.getElementById("inputCid").focus();
    searchcid = document.getElementById("inputCid").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchcid === '') {
        setarraydiagnostico([]);
        document.getElementById("inputCid").value = '';
        document.getElementById("inputCid").focus();
      } else {
        setfiltercid(document.getElementById("inputCid").value.toUpperCase());
        setarraydiagnostico(listcid.filter(item => item.codigo.includes(searchcid) === true));
        document.getElementById("inputCid").value = searchcid;
        document.getElementById("inputCid").focus();
      }
    }, 500);
  }
  const filterDiagnostico = () => {
    setvalordatepicker(0);
    clearTimeout(timeout);
    document.getElementById("inputCid").value = '';
    searchcid = '';
    document.getElementById("inputDiagnostico").focus();
    searchdiagnostico = document.getElementById("inputDiagnostico").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchdiagnostico === '') {
        setarraydiagnostico([]);
        document.getElementById("inputDiagnostico").value = '';
        document.getElementById("inputDiagnostico").focus();
      } else {
        setfilterdiagnostico(document.getElementById("inputDiagnostico").value.toUpperCase());
        setarraydiagnostico(listcid.filter(item => item.nome.toUpperCase().includes(searchdiagnostico) === true));
        document.getElementById("inputDiagnostico").value = searchdiagnostico;
        document.getElementById("inputDiagnostico").focus();
      }
    }, 500);
  }

  useEffect(() => {
    if (viewdiagnostico !== 0) {
      setvalordatepicker(0);
      // carregando a lista de diagnósticos do sistema.
      loadCid();
      setviewcomponent(viewdiagnostico);
      if (viewdiagnostico == 1) {
        setpickdate1(moment().format('DD/MM/YYYY'));
        setpickdate2('');
      } else {
        setpickdate1(iniciodiag);
        setpickdate2(terminodiag);
      }
    } else {
    }
  }, [viewdiagnostico])

  const loadDiagnosticos = (idpaciente) => {
    axios.get(html + "/diagnosticos").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistdiagnosticos(x.sort((a, b) => moment(a.inicio, 'DD/MM/YYYY') < moment(b.inicio, 'DD/MM/YYYY') ? 1 : -1).filter(item => item.idpaciente == idpaciente));
      setarraydiagnosticos(x.sort((a, b) => moment(a.inicio, 'DD/MM/YYYY') < moment(b.inicio, 'DD/MM/YYYY') ? 1 : -1).filter(item => item.idpaciente == idpaciente));
    });
  }

  // inserindo registro.
  const insertData = () => {
    var cid = document.getElementById("inputCid").value.toUpperCase();
    var diagnostico = document.getElementById("inputDiagnostico").value.toUpperCase();
    if (pickdate1 != '' && cid != '' && diagnostico != '') {
      var obj = {
        idpaciente: idpaciente,
        idatendimento: idatendimento,
        cid: cid,
        diagnostico: diagnostico,
        inicio: pickdate1,
        termino: pickdate2,
        usuario: usuario,
      };
      axios.post(html + '/insertdiagnostico', obj).then(() => {
        toast(1, '#52be80', 'DIAGNÓSTICO REGISTRADO COM SUCESSO.', 3000);
        setTimeout(() => {
          loadDiagnosticos(idpaciente);
          fechar();
        }, 3000);
      });
    } else {
      toast(1, '#ec7063', 'CAMPOS OBRIGATÓRIOS EM BRANCO.', 6000);
    }
  };

  // atualizando registro.
  const updateData = () => {
    var cid = document.getElementById("inputCid").value.toUpperCase();
    var diagnostico = document.getElementById("inputDiagnostico").value.toUpperCase();
    if (iniciodiag != '' && cid != '' && diagnostico != '') {
      var obj = {
        id: iddiagnostico,
        idpaciente: idpaciente,
        idatendimento: idatendimento,
        cid: cid,
        diagnostico: diagnostico,
        inicio: pickdate1,
        termino: pickdate2,
        usuario: usuario,
      };
      axios.post(html + '/updatediagnostico/' + iddiagnostico, obj).then(() => {
        toast(1, '#52be80', 'DIAGNÓSTICO ATUALIZADO COM SUCESSO.', 3000);
        setTimeout(() => {
          loadDiagnosticos(idpaciente);
          fechar();
        }, 3000);
      });
    } else {
      toast(1, '#ec7063', 'CAMPOS OBRIGATÓRIOS EM BRANCO.', 6000);
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

  const [selectcid, setselectcid] = useState(0);
  const selectDiagnostico = (item) => {
    setselectcid(item.codigo);
    document.getElementById("inputCid").value = item.codigo;
    document.getElementById("inputDiagnostico").value = item.nome;
  }

  const salvar = () => {
    if (viewcomponent == 1) {
      insertData();
    } else if (viewcomponent == 2) {
      updateData();
    } else {

    }
  }

  const fechar = () => {
    setviewcomponent(0);
    window.scrollTo(0, 0);
    document.body.style.overflow = null;
  }

  // renderização do componente.
  if (viewcomponent !== 0) {
    return (
      <div className="menucover fade-in" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <DatePicker valordatepicker={valordatepicker} mododatepicker={mododatepicker} />
        <Toast valortoast={valortoast} cor={cor} mensagem={mensagem} tempo={tempo} />
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{viewcomponent == 1 ? 'INSERIR DIAGNÓSTICO' : 'EDITAR DIAGNÓSTICO'}</div>
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
                onClick={viewcomponent == 1 ? () => insertData() : () => updateData()}
              >
                <img
                  alt=""
                  src={save}
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
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                width: '100%',
              }}
            >
            </div>
            <div id="FILTROS DE DIAGNÓSTICOS" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label className="title2">
                  DATA DO DIAGNÓSTICO:
                </label>
                <label
                  style={{ width: 200 }}
                  autoComplete="off"
                  className="input"
                  placeholder="INÍCIO"
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'INÍCIO')}
                  title="DATA DO DIAGNÓSTICO."
                  onClick={() => showDatePicker(1, 1)}
                  defaultValue={viewcomponent == 2 ? iniciodiag : moment().format('DD/MM/YYYY')}
                  type="text"
                  maxLength={5}
                  id="inputInicio"
                >
                  {pickdate1}
                </label>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <label className="title2">
                  CID:
                </label>
                <input
                  autoComplete="off"
                  className="input"
                  placeholder="CID..."
                  defaultValue={viewcomponent == 2 ? cid : ''}
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'CID...')}
                  onChange={() => filterCid()}
                  title="CID."
                  style={{
                    width: 100
                  }}
                  type="text"
                  maxLength={5}
                  id="inputCid"
                ></input>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                <label className="title2">
                  DIAGNÓSTICO:
                </label>
                <input
                  autoComplete="off"
                  className="input"
                  placeholder="DIAGNÓSTICO..."
                  defaultValue={viewcomponent == 2 ? diagnostico : ''}
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'DIAGNÓSTICO...')}
                  onChange={() => filterDiagnostico()}
                  title="DIAGNÓSTICO."
                  type="text"
                  maxLength={200}
                  id="inputDiagnostico"
                ></input>
              </div>
            </div>
            <div
              className="scroll"
              id="LISTA DE DIAGNÓSTICOS"
              style={{ width: 0.6 * window.innerWidth, height: 0.3 * window.innerHeight, marginTop: 20 }}
            >
              {arraydiagnostico.map((item) => (
                <p
                  key={item.id}
                  id="item da lista"
                  className="row"
                  onClick={() => selectDiagnostico(item)}
                  style={{ margin: 5, marginTop: 2.5, marginBottom: 2.5 }}
                >
                  <button
                    className={item.codigo == selectcid ? "red-button" : "blue-button"}
                    style={{
                      display: window.innerWidth > 800 ? 'flex' : 'none',
                      width: 100,
                      margin: 2.5,
                      flexDirection: 'column',
                    }}
                  >
                    <div>{item.codigo}</div>
                  </button>
                  <button
                    className={item.codigo == selectcid ? "red-button" : "hover-button"}
                    style={{
                      width: window.innerWidth > 800 ? '100%' : 200,
                      margin: 2.5,
                      padding: 5,
                      flexDirection: 'column',
                    }}
                  >
                    <div>{item.nome.toUpperCase()}</div>
                  </button>
                </p>
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

export default Diagnostico;
