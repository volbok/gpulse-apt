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

function Problemas(
  {
    viewproblema,
    inicio,
    idproblema,
    problema,
  }) {
  //servidor.
  var html = 'https://pulsarapp-server.herokuapp.com';
  const {
    idatendimento,
    setpickdate1,
    pickdate1,
    nomeusuario,
    setlistproblemas,
    setarrayproblemas,
  } = useContext(Context)
  // history (react-router-dom).
  let history = useHistory()

  // chave para exibição do componente.
  const [viewcomponent, setviewcomponent] = useState(viewproblema);

  useEffect(() => {
    if (viewproblema !== 0) {
      setvalordatepicker(0);
      setviewcomponent(viewproblema);
      if (viewproblema == 1) {
        setpickdate1(moment().format('DD/MM/YYYY'));
      } else {
        setpickdate1(inicio);
      }
    } else {
    }
  }, [viewproblema])

  const loadProblemas = () => {
    axios.get(html + "/problemas").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistproblemas(x.sort((a, b) => moment(a.inicio, 'DD/MM/YYYY') < moment(b.inicio, 'DD/MM/YYYY') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
      setarrayproblemas(x.sort((a, b) => moment(a.inicio, 'DD/MM/YYYY') < moment(b.inicio, 'DD/MM/YYYY') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
    });
  }

  // inserindo registro.
  const insertData = () => {
    var problema = document.getElementById("inputProblema").value.toUpperCase();
    if (problema != '') {
      var obj = {
        inicio: pickdate1 ? pickdate1 : moment().format('DD/MM/YYYY'),
        idatendimento: idatendimento,
        problema: problema,
        usuario: nomeusuario,
        status: 1,
        registro: moment().format('DD/MM/YYYY') + ' ÀS ' + moment().format('HH:mm')
      };
      axios.post(html + '/insertproblema', obj).then(() => {
        toast(1, '#52be80', 'PROBLEMA REGISTRADO COM SUCESSO.', 3000);
        setTimeout(() => {
          loadProblemas();
          fechar();
        }, 3000);
      });
    } else {
      toast(1, '#ec7063', 'CAMPOS OBRIGATÓRIOS EM BRANCO.', 6000);
    }
  };

  // atualizando registro.
  const updateData = () => {
    var problema = document.getElementById("inputProblema").value.toUpperCase();
    if (inicio != '' && problema != '') {
      var obj = {
        inicio: pickdate1,
        idatendimento: idatendimento,
        problema: problema,
        usuario: nomeusuario,
        status: 1,
        registro: moment().format('DD/MM/YYYY') + ' ÀS ' + moment().format('HH:mm')
      };
      axios.post(html + '/updateproblema/' + idproblema, obj).then(() => {
        toast(1, '#52be80', 'PROBLEMA ATUALIZADO COM SUCESSO.', 3000);
        setTimeout(() => {
          loadProblemas();
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

  const fechar = () => {
    setviewcomponent(0);
    window.scrollTo(0, 0);
    document.body.style.overflow = null;
  }

  // renderização do componente.
  if (viewcomponent != 0) {
    return (
      <div className="menucover fade-in"
        style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <DatePicker valordatepicker={valordatepicker} mododatepicker={mododatepicker} />
        <Toast valortoast={valortoast} cor={cor} mensagem={mensagem} tempo={tempo} />
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{viewcomponent == 1 ? 'INSERIR PROBLEMA' : 'EDITAR PROBLEMA'}</div>
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
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label className="title2">
                INÍCIO:
              </label>
              <button
                autoComplete="off"
                className="input"
                title="DATA APROXIMADA DE INÍCIO DO PROBLEMA."
                onClick={() => showDatePicker(1, 1)}
                style={{
                  width: window.innerWidth > 800 ? 150 : 75,
                }}
                type="text"
                maxLength={5}
                id="inputInicio"
              >
                {pickdate1}
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label className="title2">
                PROBLEMA:
              </label>
              <textarea
                autoComplete="off"
                className="textarea"
                placeholder="PROBLEMA..."
                defaultValue={viewcomponent == 2 ? problema : ''}
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'PROBLEMA...')}
                title="PROBLEMA."
                style={{
                  width: 0.4 * window.innerWidth,
                  height: 100,
                }}
                type="text"
                maxLength={200}
                id="inputProblema"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default Problemas;