/* eslint eqeqeq: "off" */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import Toast from './Toast';
import { useHistory } from "react-router-dom";
import DatePicker from '../components/DatePicker';
import Context from '../Context';

function Propostas(
  { viewproposta,
    idproposta,
    proposta,
    inicio,
    termino,
  }) {
  //servidor.
  var html = 'https://pulsarapp-server.herokuapp.com';
  // recuperando estados globais (Context.API).
  const {
    idatendimento,
    setpickdate1,
    pickdate1,
    setlistpropostas,
    setarraypropostas,
  } = useContext(Context)
  // history (react-router-dom).
  let history = useHistory()

  // chave para exibição do componente.
  const [viewcomponent, setviewcomponent] = useState(viewproposta);

  useEffect(() => {
    if (viewproposta == 1) {
      setviewcomponent(viewproposta);
      setvalordatepicker(0);
      setpickdate1(moment().format('DD/MM/YYYY'));
    } else if (viewproposta == 2) {
      setviewcomponent(viewproposta);
      setvalordatepicker(0);
      setpickdate1(moment().format(inicio));
    } else {
    }
  }, [viewproposta])

  const loadPropostas = () => {
    // ROTA: SELECT * FROM propostas WHERE idatendimento = idatendimento.
    axios.get(html + "/propostas/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistpropostas(x.sort((a, b) => moment(a.inicio, 'DD/MM/YYYY') < moment(b.inicio, 'DD/MM/YYYY') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
      setarraypropostas(x.sort((a, b) => moment(a.inicio, 'DD/MM/YYYY') < moment(b.inicio, 'DD/MM/YYYY') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
    });
  }

  // inserindo registro.
  const insertData = () => {
    var proposta = document.getElementById("inputProposta").value.toUpperCase();
    if (pickdate1 != '' && proposta != '') {
      var obj = {
        idatendimento: idatendimento,
        inicio: pickdate1,
        termino: '',
        proposta: proposta,
        registro: moment().format('DD/MM/YYYY') + ' ÀS ' + moment().format('HH:mm')
      };
      axios.post(html + '/insertprop', obj).then(() => {
        toast(1, '#52be80', 'PROPOSTA REGISTRADA COM SUCESSO.', 3000);
        setTimeout(() => {
          loadPropostas();
          fechar();
        }, 3000);
      });
    } else {
      toast(1, '#ec7063', 'CAMPOS OBRIGATÓRIOS EM BRANCO.', 3000);
    }
  };

  // atualizando registro.
  const updateData = () => {
    var proposta = document.getElementById("inputProposta").value.toUpperCase();
    if (pickdate1 != '' && proposta != '') {
      var obj = {
        id: idproposta,
        idatendimento: idatendimento,
        inicio: pickdate1,
        termino: termino,
        proposta: proposta,
        registro: moment().format('DD/MM/YYYY') + ' ÀS ' + moment().format('HH:mm')
      };
      axios.post(html + '/updateprop/' + idproposta, obj).then(() => {
        toast(1, '#52be80', 'PROPOSTA ATUALIZADA COM SUCESSO.', 3000);
        setTimeout(() => {
          loadPropostas();
          fechar();
        }, 3000);
      });
    } else {
      toast(1, '#ec7063', 'CAMPOS OBRIGATÓRIOS EM BRANCO.', 3000);
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
  if (viewcomponent !== 0) {
    return (
      <div className="menucover fade-in" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <DatePicker valordatepicker={valordatepicker} mododatepicker={mododatepicker} />
        <Toast valortoast={valortoast} cor={cor} mensagem={mensagem} tempo={tempo} />
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{viewcomponent == 1 ? 'INSERIR PROPOSTA' : 'EDITAR PROPOSTA'}</div>
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
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <label className="title2">
                DATA DE DEFINIÇÃO:
              </label>
              <label
                autoComplete="off"
                className="input"
                placeholder="DATA"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'DATA')}
                title="DATA DE DEFINIÇÃO DA PROPOSTA."
                onClick={() => showDatePicker(1, 1)}
                defaultValue={moment().format('DD/MM/YY')}
                style={{
                  alignSelf: 'center',
                  width: 150,
                }}
                type="text"
                maxLength={5}
                id="inputInicio"
              >
                {pickdate1}
              </label>
              <label className="title2">
                PROPOSTA:
              </label>
              <textarea
                autoComplete="off"
                className="textarea"
                placeholder="PROPOSTA."
                defaultValue={proposta}
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'PROPOSTA...')}
                title="PROPOSTA."
                style={{
                  width: '100%',
                  height: 100,
                  alignSelf: 'center',
                }}
                type="text"
                maxLength={200}
                id="inputProposta"
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
export default Propostas;