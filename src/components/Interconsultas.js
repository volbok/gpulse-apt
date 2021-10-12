/* eslint eqeqeq: "off" */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import Toast from './Toast';
import { useHistory } from "react-router-dom";
import Context from '../Context';

function Interconsultas(
  { viewinterconsulta,
    hospital,
    unidade,
    idpaciente,
    idatendimento,
    idinterconsulta,
    pedido,
    especialidade,
    motivo,
    status,
    parecer,
  }) {
  //servidor.
  var html = 'https://pulsarapp-server.herokuapp.com';
  const {
    setlistinterconsultas,
    setarrayinterconsultas
  } = useContext(Context)

  // chave para exibição do componente.
  const [viewcomponent, setviewcomponent] = useState(viewinterconsulta);

  useEffect(() => {
    if (viewinterconsulta !== 0) {
      setviewcomponent(viewinterconsulta);
      loadEspecialidades();
      if (viewinterconsulta === 1) {
        setselectedespecialidade('SELECIONE UMA ESPECIALIDADE');
      } else {
        setselectedespecialidade(especialidade);
      }
    } else {
    }
  }, [viewinterconsulta])

  // carregando lista de especialidades.
  const [especialidades, setespecialidades] = useState([]);
  const loadEspecialidades = () => {
    axios.get(html + "/especialidades").then((response) => {
      setespecialidades(response.data);
    });
  }

  // tela para seleção da especialidade.
  const [showespecialidades, setshowespecialidades] = useState(0);
  function ShowEspecialidades() {
    if (showespecialidades === 1) {
      return (
        <div
          className="menucover"
          onClick={() => setshowespecialidades(0)}
          style={{
            zIndex: 9,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <div className="menucontainer" style={{ padding: 30 }}>
            <div className="scrolldrop"
              id="LISTA DE ESPECIALIDADES"
              style={{
                padding: 0, paddingRight: 5,
                height: 0.4 * window.innerHeight,
              }}
            >
              <div style={{ width: '100%' }}>
                {especialidades.map((item) => (
                  <button
                    className="blue-button"
                    style={{
                      width: 0.3 * window.innerWidth,
                      margin: 10,
                    }}
                    onClick={(e) => { selectEspecialidade(item.especialidade); e.stopPropagation() }}
                  >
                    {item.especialidade}
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

  // selecionando uma especialidade.
  const selectEspecialidade = (value) => {
    setselectedespecialidade(value);
    setshowespecialidades(0);
  }

  const loadInterconsultas = (idpaciente) => {
    axios.get(html + "/interconsultas/'" + idpaciente + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistinterconsultas(x.sort((a, b) => moment(a.pedido, 'DD/MM/YYYY HH:MM') < moment(b.pedido, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
      setarrayinterconsultas(x.sort((a, b) => moment(a.pedido, 'DD/MM/YYYY HH:MM') < moment(b.pedido, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
    });
  }

  // inserindo registro.
  const [selectedespecialidade, setselectedespecialidade] = useState();
  const insertData = () => {
    var motivo = document.getElementById("inputMotivo").value.toUpperCase();
    if (motivo !== '' && selectedespecialidade !== 'SELECIONE UMA ESPECIALIDADE') {
      var obj = {
        idpaciente: idpaciente,
        hospital: hospital,
        unidade: unidade,
        idatendimento: idatendimento,
        pedido: moment().format('DD/MM/YY HH:mm'),
        especialidade: selectedespecialidade,
        motivo: motivo,
        status: 0,
        parecer: ''
      };
      axios.post(html + '/insertinterconsulta', obj).then(() => {
        toast(1, '#52be80', 'INTERCONSULTA REGISTRADA COM SUCESSO.', 5000);
        setTimeout(() => {
          loadInterconsultas(idpaciente);
          fechar();
        }, 3000);
      });
    } else {
      toast(1, '#ec7063', 'CAMPOS OBRIGATÓRIOS EM BRANCO.', 5000);
    }
  };

  // atualizando registro.
  const updateData = () => {
    var motivo = document.getElementById("inputMotivo").value.toUpperCase();
    if (motivo !== '' && selectedespecialidade !== '') {
      var obj = {
        idpaciente: idpaciente,
        hospital: hospital,
        unidade: unidade,
        idatendimento: idatendimento,
        pedido: pedido,
        especialidade: selectedespecialidade,
        motivo: motivo,
        status: status,
        parecer: parecer,
      };
      axios.post(html + '/updateinterconsulta/' + idinterconsulta, obj).then(() => {
        toast(1, '#52be80', 'INTERCONSULTA ATUALIZADA COM SUCESSO.', 5000);
        setTimeout(() => {
          loadInterconsultas(idpaciente);
          fechar();
        }, 3000);
      });
    } else {
      toast(1, '#ec7063', 'CAMPOS OBRIGATÓRIOS EM BRANCO.', 5000);
    }
  };

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

  const fechar = () => {
    setviewcomponent(0);
    window.scrollTo(0, 0);
    document.body.style.overflow = null;
  }

  // renderização do componente.
  if (viewcomponent !== 0) {
    return (
      <div className="menucover" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <ShowEspecialidades></ShowEspecialidades>
        <Toast valortoast={valortoast} cor={cor} mensagem={mensagem} tempo={tempo} />
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{viewcomponent == 1 ? 'INSERIR INTERCONSULTA' : 'EDITAR INTERCOSULTA'}</div>
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
            <button
              className="blue-button"
              style={{
                width: 250,
                padding: 10,
              }}
              onClick={() => setshowespecialidades(1)}
            >
              {selectedespecialidade}
            </button>
            <label className="title2" style={{ marginTop: 15, fontSize: 14 }}>
              MOTIVO:
            </label>
            <textarea
              autoComplete="off"
              className="textarea"
              placeholder="MOTIVO."
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'MOTIVO.')}
              title="MOTIVO DA INTERCONSULTA."
              style={{
                width: 0.4 * window.innerWidth,
                minWidth: 400,
                minHeight: 125,
              }}
              type="text"
              maxLength={200}
              id="inputMotivo"
              defaultValue={viewcomponent == 2 ? motivo : ''}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
export default Interconsultas;