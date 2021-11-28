/* eslint eqeqeq: "off" */
import React, { useState, useContext } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { Doughnut, Line, Bar } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import salvar from '../images/salvar.svg'
import deletar from '../images/deletar.svg'
import Toast from '../components/Toast'
import Header from '../components/Header'
import moment from 'moment'
import Context from '../Context'
import { useHistory } from 'react-router-dom'

// lixo a excluir (insistência de Guilherme).
import { Stuff } from '../components/Stuff'

function Unidades() {
  var html = 'https://pulsarapp-server.herokuapp.com';
  // recuperando estados globais (Context.API).
  const {
    idusuario,
    nomeusuario,
    tipousuario,
    settipounidade,
    setnomeunidade,
    especialidadeusuario,
    nomehospital,
    setidatendimento,
  } = useContext(Context)
  // history (react-router-dom).
  let history = useHistory()

  // carregamento da lista de unidades de atendimento do hospital, nas quais o usuário trabalha.
  const [unidades, setunidades] = useState([])
  const [arrayunidades, setarrayunidades] = useState([])
  const loadUnidades = () => {
    axios
      .get(html + "/unidades/'" + idusuario + "'/'" + nomehospital + "'")
      .then((response) => {
        setunidades(response.data)
        setarrayunidades(response.data)
      })
  }

  // carregando da lista de cirurgias no bloco cirúrgico.
  const [agendabloco, setagendabloco] = useState([])
  const loadAgendaBloco = () => {
    axios.get(html + '/agendabloco').then((response) => {
      var x = [0, 1]
      x = response.data
      // filtrando as cirurgias agendadas para a data atual.
      setagendabloco(
        x.filter(
          (item) =>
            item.hospital == nomehospital &&
            moment(
              JSON.stringify(item.datainicio).substring(1, 9),
              'DD/MM/YY',
            ) == moment().startOf('day'),
        ),
      )
    })
  }

  // TIPOS DE UNIDADES: 1 = pronto-socorro; 2 = demais unidades de internação (CTIs, enfermarias); 3 = bloco cirúrgico; 4 = ambulatórios.
  // montando a lista de unidades.
  function ShowUnidades() {
    return (
      <div
        className="scroll"
        id="LISTA DE UNIDADES"
        style={{
          scrollBehavior: 'smooth',
          height: '82vh', maxHeight: '82vh',
          flexDirection: window.innerWidth < 400 ? 'column' : 'row',
          flexWrap: window.innerWidth < 400 ? 'nowrap' : 'wrap',
          backgroundColor: 'transparent', borderColor: 'transparent'
        }}
      >
        {arrayunidades.map((item) => GetData(item))}
      </div>
    )
  }

  // selecionando uma unidade da lista.
  const selectUnidade = (item) => {
    var tipo = lto.filter(value => value.unidade == item.unidade).map(item => item.tipo)
    settipounidade(lto.filter(value => value.unidade == item.unidade).map(item => item.tipo))
    setnomeunidade(lto.filter(value => value.unidade == item.unidade).map(item => item.unidade))
    if (tipousuario == 6) {
      // farmácia.
      history.push('/farmacia')
    } else if (tipo == 4) {
      history.push('/ambulatorio')
    } else if (tipo == 3) {
      // secretária.
      // nada (secretária não acessa a tela pacientes).
    } else {
      history.push('/pacientes')
    }
  }

  // selecionando unidade de bloco cirúrgico.
  const selectBlocoCirurgico = (item) => {
    history.push('/bloco')
  }

  // selecionando unidade de bloco cirúrgico.
  const selectAmbulatorio = (item) => {
    setnomeunidade(item.unidade)
    history.push('/ambulatorio')
  }

  useEffect(() => {
    // carregando a lista de unidades.
    loadUnidades()
    // carregando a lista de cirurgias.
    loadAgendaBloco()
    // carregando atendmentos (para alimentar os gráficos de consultas).
    loadAtendimentos()
    // carregando a lista de consultas ambulatoriais.
    loadAmbulatorio()
    // carregando as interconsultas.
    loadInterconsultas()
    // preparando os gráficos das unidades.
    mountDataChart()
    // atraso para renderização dos cards com os gráficos (evita o glitch das animações dos doughnuts).
    setTimeout(() => {
      setrenderchart(1);
    }, 1000);
    // eslint-disable-next-line
  }, [])

  const selectEscala = (item) => {
    history.push('/escala')
  }

  // abrindo a lista de interconsultas.
  function showInterconsultas(e) {
    loadPacientes()
    loadAtendimentos()
    loadInterconsultas()
    setviewinterconsultas(1)
    e.stopPropagation()
  }

  // botão para acesso a solicitação de INTERCONSULTAS, para a especialidade do usuário.
  function BtnInterconsultas(hosp, setor) {
    return (
      <button
        className="yellow-button"
        onClick={() => setviewinterconsultas(1)}
        title={
          'INTERCONSULTAS PENDENTES OU PACIENTES EM \n ACOMPANHAMENTO PELA ' +
          especialidadeusuario +
          '.'
        }
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          borderStyle: 'solid',
          borderWidth: 5,
          borderColor: '#ffffff',
          borderRadius: 50,
          width: 50,
          height: 50,
          margin: 0,
          padding: 5,
          opacity: 1,
          boxShadow: 'none',
          display:
            listinterconsultas.filter(
              (item) =>
                item.status != 0 &&
                item.especialidade == especialidadeusuario &&
                item.hospital == hosp &&
                item.unidade == setor,
            ).length > 0
              ? 'flex'
              : 'none',
        }}
        onClick={(e) => showInterconsultas(e)}
      >
        {
          listinterconsultas.filter(
            (item) =>
              item.status !== 0 &&
              item.especialidade == especialidadeusuario &&
              item.hospital === hosp &&
              item.unidade === setor,
          ).length
        }
      </button>
    )
  }

  // lista de interconsultas não atendidas para a especialidade do usuário.
  const [listinterconsultas, setlistinterconsultas] = useState([])
  const loadInterconsultas = () => {
    axios.get(html + '/interconsultasall').then((response) => {
      var x = [0, 1]
      x = response.data
      setlistinterconsultas(x)
    })
  }
  // lista de pacientes.
  const [listpacientes, setlistpacientes] = useState([])
  const loadPacientes = () => {
    axios.get(html + '/pacientes').then((response) => {
      var x = [0, 1]
      x = response.data
      setlistpacientes(x)
    })
  }
  // lista de atendimentos.
  const [listatendimentos, setlistatendimentos] = useState([])
  const loadAtendimentos = () => {
    axios.get(html + '/atendimentos').then((response) => {
      var x = [0, 1]
      x = response.data
      setlistatendimentos(x);
    })
  }
  // lista de consultas ambulatoriais.
  const [ambulatorio, setambulatorio] = useState([])
  const loadAmbulatorio = () => {
    // todos os pacientes agendados para o médico logado.
    axios.get(html + '/atendimentos').then((response) => {
      setambulatorio(response.data)
    })
  }

  var newparecer = ''
  const updateParecer = (value) => {
    newparecer = value
  }

  // atualizando um pedido de interconsulta.
  const updateInterconsulta = (item, value) => {
    var obj = {
      idpaciente: item.idpaciente,
      idatendimento: item.idatendimento,
      pedido: item.pedido,
      especialidade: item.especialidade,
      motivo: item.motivo,
      status: value,
      parecer: value == 2 ? newparecer : item.parecer,
    }
    axios.post(html + '/updateinterconsulta/' + item.id, obj).then(() => {
      toast(1, '#52be80', 'INTERCONSULTA RESPONDIDA COM SUCESSO.', 3000)
      loadInterconsultas()
    })
  }

  // acessando o prontuário do paciente com interconsulta.
  const gotoProntuario = (item) => {
    setviewinterconsultas(0)
    setidatendimento(item.idatendimento)
    history.push('/pacientes')
  }

  // memorizando a posição da scroll nas listas.
  var scrollpos = 0
  const [scrollposition, setscrollposition] = useState(0)
  var timeout
  const scrollPosition = (value) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      scrollpos = document.getElementById(value).scrollTop
      setscrollposition(document.getElementById(value).scrollTop)
      document.getElementById(value).scrollTop = scrollpos
    }, 500)
  }

  // guardando a posição da scroll.
  const keepScroll = (value) => {
    setTimeout(() => {
      document.getElementById(value).scrollTop = scrollposition
    }, 300)
  }

  // exibindo a tela de interconsultas.
  const [viewinterconsultas, setviewinterconsultas] = useState(0)
  function ViewInterconsultas() {
    if (viewinterconsultas === 1) {
      return (
        <div
          className="menucover"
          style={{
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div className="menucontainer">
            <div className="title2">
              {'INTERCONSULTAS: ' + especialidadeusuario + ' / ' + nomehospital}
            </div>
            <div
              className="scroll"
              id="LISTA DE INTERCONSULTAS"
              onScroll={() => scrollPosition('LISTA DE INTERCONSULTAS')}
              onLoad={() => keepScroll('LISTA DE INTERCONSULTAS')}
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                margin: 5,
                padding: 2.5,
                height: 0.7 * window.innerHeight,
                width: 0.8 * window.innerWidth,
              }}
            >
              {listinterconsultas
                .filter((item) => item.status !== 0)
                .map((item) => (
                  <div
                    key={item.id}
                    id="item da lista"
                    className="row"
                    style={{
                      margin: 2.5,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      paddingRight: 10,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection:
                          window.innerWidth < 800 ? 'column' : 'row',
                        justifyContent: 'center',
                        padding: 0,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          width: '100%',
                          margin: 2.5,
                          marginBottom: 0,
                        }}
                      >
                        <button
                          className="blue-button"
                          style={{
                            width:
                              window.innerWidth < 800
                                ? 0.15 * window.innerWidth
                                : 75,
                            maxWidth:
                              window.innerWidth < 800
                                ? 0.15 * window.innerWidth
                                : 75,
                            minWidth:
                              window.innerWidth < 800
                                ? 0.15 * window.innerWidth
                                : 75,
                            margin: 2.5,
                            marginLeft: 0,
                            padding: 5,
                            flexDirection: 'column',
                            backgroundColor: '#1f7a8c',
                          }}
                        >
                          {item.pedido.substring(0, 8)}
                        </button>
                        <button
                          className="blue-button"
                          style={{
                            width:
                              window.innerWidth < 800
                                ? 0.15 * window.innerWidth
                                : 200,
                            maxWidth:
                              window.innerWidth < 800
                                ? 0.15 * window.innerWidth
                                : 200,
                            minWidth:
                              window.innerWidth < 800
                                ? 0.15 * window.innerWidth
                                : 200,
                            height: 50,
                            margin: 2.5,
                            padding: 5,
                            flexDirection: 'column',
                            backgroundColor: '#1f7a8c',
                          }}
                        >
                          {item.unidade +
                            ' BOX ' +
                            listatendimentos
                              .filter(
                                (value) => value.id === item.idatendimento,
                              )
                              .map((value) => value.box)}
                        </button>
                        <button
                          className="blue-button"
                          style={{
                            width: '100%',
                            margin: 2.5,
                            padding: 5,
                            flexDirection: 'column',
                            backgroundColor: '#1f7a8c',
                          }}
                        >
                          {listpacientes
                            .filter((value) => value.id === item.idpaciente)
                            .map((value) => value.nome)}
                        </button>
                        <div
                          id="OCULTA PARA MOBILE"
                          style={{
                            display: window.innerWidth < 800 ? 'none' : 'flex',
                          }}
                        >
                          <button
                            className="blue-button"
                            title="STATUS DA INTERCONSULTA. CLIQUE PARA ACESSAR O PRONTUÁRIO."
                            onClick={
                              item.status === 1
                                ? () => gotoProntuario(item)
                                : ''
                            }
                            style={{
                              width:
                                window.innerWidth < 800
                                  ? 0.4 * window.innerWidth
                                  : 0.15 * window.innerWidth,
                              maxWidth:
                                window.innerWidth < 800
                                  ? 0.4 * window.innerWidth
                                  : 0.15 * window.innerWidth,
                              minWidth:
                                window.innerWidth < 800
                                  ? 0.4 * window.innerWidth
                                  : 0.15 * window.innerWidth,
                              margin: 2.5,
                              padding: 5,
                              flexDirection: 'column',
                              backgroundColor:
                                item.status === 0 || item.status === 1
                                  ? '#ec7063'
                                  : item.status === 2
                                    ? '#f5b041'
                                    : '#52be80',
                            }}
                          >
                            {item.status === 0 || item.status === 1
                              ? 'PENDENTE'
                              : item.status === 2
                                ? 'ACOMPANHANDO'
                                : 'ENCERRADO'}
                          </button>
                          <button
                            className="green-button"
                            onClick={() => updateInterconsulta(item, 2)}
                            title={
                              item.status === 1
                                ? 'SALVAR PARECER E ACOMPANHAR PACIENTE.'
                                : 'INTERCONSULTA JÁ RESPONDIDA.'
                            }
                            style={{
                              display: item.status == 2 ? 'none' : 'flex',
                              opacity:
                                item.status !== 0 && item.status !== 1
                                  ? 0.5
                                  : 1,
                              width:
                                window.innerWidth < 800
                                  ? 0.15 * window.innerWidth
                                  : 50,
                              maxWidth:
                                window.innerWidth < 800
                                  ? 0.15 * window.innerWidth
                                  : 50,
                              minWidth:
                                window.innerWidth < 800
                                  ? 0.15 * window.innerWidth
                                  : 50,
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
                          <button
                            className="red-button"
                            onClick={() => updateInterconsulta(item, 3)}
                            title="ENCERRAR A INTERCONSULTA (ALTA)."
                            style={{
                              opacity: item.status === 2 ? 1 : 0.5,
                              width:
                                window.innerWidth < 800
                                  ? 0.15 * window.innerWidth
                                  : 50,
                              maxWidth:
                                window.innerWidth < 800
                                  ? 0.15 * window.innerWidth
                                  : 50,
                              minWidth:
                                window.innerWidth < 800
                                  ? 0.15 * window.innerWidth
                                  : 50,
                              marginRight: -5,
                            }}
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
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        width: '100%',
                      }}
                    >
                      <div
                        id="EXIBE PARA MOBILE"
                        style={{
                          display: window.innerWidth < 800 ? 'flex' : 'none',
                        }}
                      >
                        <button
                          className="blue-button"
                          title="STATUS DA INTERCONSULTA. CLIQUE PARA ACESSAR O PRONTUÁRIO."
                          onClick={
                            item.status === 1 ? () => gotoProntuario(item) : ''
                          }
                          style={{
                            width: '100%',
                            margin: 2.5,
                            padding: 5,
                            flexDirection: 'column',
                            backgroundColor:
                              item.status === 0 || item.status === 1
                                ? '#ec7063'
                                : item.status === 2
                                  ? '#f5b041'
                                  : '#52be80',
                          }}
                        >
                          {item.status === 0 || item.status === 1
                            ? 'PENDENTE'
                            : item.status === 2
                              ? 'ACOMPANHANDO'
                              : 'ENCERRADO'}
                        </button>
                        <button
                          className="green-button"
                          onClick={() => updateInterconsulta(item, 2)}
                          title={
                            item.status === 1
                              ? 'SALVAR PARECER E ACOMPANHAR PACIENTE.'
                              : 'INTERCONSULTA JÁ RESPONDIDA.'
                          }
                          style={{
                            opacity:
                              item.status !== 0 && item.status !== 1 ? 0.5 : 1,
                            width:
                              window.innerWidth < 800
                                ? 0.15 * window.innerWidth
                                : 50,
                            maxWidth:
                              window.innerWidth < 800
                                ? 0.15 * window.innerWidth
                                : 50,
                            minWidth:
                              window.innerWidth < 800
                                ? 0.15 * window.innerWidth
                                : 50,
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
                        <button
                          className="red-button"
                          onClick={() => updateInterconsulta(item, 3)}
                          title="ENCERRAR A INTERCONSULTA (ALTA)."
                          style={{
                            opacity: item.status === 2 ? 1 : 0.5,
                            width:
                              window.innerWidth < 800
                                ? 0.15 * window.innerWidth
                                : 50,
                            maxWidth:
                              window.innerWidth < 800
                                ? 0.15 * window.innerWidth
                                : 50,
                            minWidth:
                              window.innerWidth < 800
                                ? 0.15 * window.innerWidth
                                : 50,
                            marginRight: -2.5,
                          }}
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
                      <button
                        className="blue-button"
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'left',
                          width: '100%',
                          padding: 10,
                          margin: 2.5,
                        }}
                      >
                        {'MOTIVO: ' + item.motivo}
                      </button>
                      <textarea
                        className="textarea"
                        title="PARECER DO ESPECIALISTA."
                        id="inputParecer"
                        onKeyUp={(e) => updateParecer(e.target.value)}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'left',
                          width: '100%',
                          padding: 10,
                          margin: 2.5,
                        }}
                        type="text"
                        maxLength={200}
                        defaultValue={item.parecer}
                      ></textarea>
                    </div>
                  </div>
                ))}
            </div>
            <button
              className="red-button"
              onClick={() => setviewinterconsultas(0)}
              style={{ marginTop: 20 }}
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
        </div>
      )
    } else {
      return null
    }
  }

  // função para construção dos toasts.
  const [valor, setvalor] = useState(0)
  const [cor, setcor] = useState('transparent')
  const [mensagem, setmensagem] = useState('')
  const [tempo, settempo] = useState(2000)
  const toast = (value, color, message, time) => {
    setvalor(value)
    setcor(color)
    setmensagem(message)
    settempo(time)
    setTimeout(() => {
      setvalor(0)
    }, time)
  }

  const [pct, setpct] = useState([])
  const [lto, setlto] = useState([])
  const mountDataChart = () => {
    // obtendo o total de pacientes internados em todas as unidades.
    axios.get(html + '/atendimentos').then((response) => {
      var x = [0, 1]
      x = response.data
      setpct(
        x.filter(
          (value) => value.ativo !== 0 && value.hospital == nomehospital,
        ),
      )
    })
    // obtendo o total de leitos para a unidade.
    axios.get(html + '/totalleitos').then((response) => {
      var x = [0, 1]
      x = response.data
      setlto(x.filter((value) => value.hospital === nomehospital))
    })
  }

  // efetuando a soma de leitos.
  function somaLeitos(total, num) {
    return total + num
  }

  // CHART.
  /* gráfico em torta que exibe o total de leitos vagos e o total
  de leitos ocupados para cada unidade. */
  var dataChart = []
  var dataChartBlocoCirurgico = []
  var dataChartConsultas = []
  var dataChartMif = []
  var dataChartPlanoTerapeutico = []
  const [renderchart, setrenderchart] = useState(0);

  function GetData(item) {
    // gerando os dados dos gráficos.
    dataChart = {
      labels: [' LIVRES', ' OCUPADOS'],
      datasets: [
        {
          data: [
            lto
              .filter((value) => value.unidade == item.unidade)
              .map((item) => item.leitos) -
            pct.filter((value) => value.unidade == item.unidade).length,
            pct.filter((value) => value.unidade == item.unidade && value.linhadecuidado == 1).length,
            pct.filter((value) => value.unidade == item.unidade && value.linhadecuidado == 2).length,
            pct.filter((value) => value.unidade == item.unidade && value.linhadecuidado == 3).length,
          ],
          backgroundColor: ['grey', '#52be80', '#5DADE2', '#F4D03F'],
          borderColor: '#ffffff',
          hoverBorderColor: ['#ffffff', '#ffffff'],
        },
      ],
    }
    dataChartBlocoCirurgico = {
      labels: [' PROCEDIMENTOS REALIZADOS', ' PROCEDIMENTOS PENDENTES'],
      datasets: [
        {
          data: [
            agendabloco.filter(
              (value) => value.unidade == item.unidade && value.status == 1,
            ).length,
            agendabloco.filter(
              (value) => value.unidade == item.unidade && value.status == 0,
            ).length,
          ],
          backgroundColor: ['#52be80', '#ec7063'],
          borderColor: '#ffffff',
          hoverBorderColor: ['#ffffff', '#ffffff'],
        },
      ],
    }
    var valor1 = listatendimentos.filter(
      (value) =>
        value.unidade == item.unidade &&
        value.assistente == nomeusuario &&
        JSON.stringify(value.admissao).substring(4, 11) ==
        moment().subtract(2, 'months').format('MM/yyyy'),
    ).length
    var valor2 = listatendimentos.filter(
      (value) =>
        value.unidade == item.unidade &&
        value.assistente == nomeusuario &&
        JSON.stringify(value.admissao).substring(4, 11) ==
        moment().subtract(1, 'months').format('MM/yyyy'),
    ).length
    var valor3 = listatendimentos.filter(
      (value) =>
        value.unidade == item.unidade &&
        value.assistente == nomeusuario &&
        JSON.stringify(value.admissao).substring(4, 11) ==
        moment().format('MM/yyyy'),
    ).length
    dataChartConsultas = {
      labels: [
        moment().subtract(2, 'months').format('MM/yy'),
        moment().subtract(1, 'month').format('MM/yy'),
        moment().format('MM/yy'),
      ],
      datasets: [
        {
          data: [valor1, valor2, valor3],
          pointBackgroundColor: ['#52be80', '#52be80', '#52be80'],
          fill: true,
          backgroundColor: 'rgba(82, 190, 128, 0.3)',
          borderColor: 'rgba(82, 190, 128, 1)',
          hoverBorderColor: ['#E1E5F2', '#E1E5F2', '#E1E5F2'],
        },
      ],
    }
    // extrair da tabela MIF, filtrando por hospital e unidade.
    var arraymif = [];
    var count = 0;
    // var arraymif = listmif.filter(valor => valor.unidade == item.unidade).map(item => item.mif);

    var dataMif = [30, 35, 32, 45, 50, 65, 55, 35, 25, 15, 30, 35, 32, 45, 50, 65, 55, 35, 25, 15, 30, 35, 32, 45, 50, 65, 55, 35, 25, 15]
    var colorMif = dataMif.map(item => item < 50 ? '#ec7063' : '#52be80')
    dataChartMif = {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      datasets: [
        {
          data: dataMif,
          fill: true,
          backgroundColor: colorMif,
          borderColor: 'rgba(82, 190, 128, 1)',
          hoverBorderColor: ['#E1E5F2', '#E1E5F2', '#E1E5F2'],
          borderRadius: 5,
        },
      ],
    }
    var dataPlanoTerapeutico = [30, 35, 32, 45, 50, 65, 55, 35, 25, 15, 30, 35, 32, 45, 50, 65, 55, 35, 25, 15, 30, 35, 32, 45, 50, 65, 55, 35, 25, 15]
    var colorPlanoTerapeutico = dataPlanoTerapeutico.map(item => item < 30 ? '#ec7063' : '#52be80')
    dataChartPlanoTerapeutico = {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      datasets: [
        {
          data: dataPlanoTerapeutico,
          fill: true,
          backgroundColor: colorPlanoTerapeutico,
          borderColor: 'rgba(82, 190, 128, 1)',
          hoverBorderColor: ['#E1E5F2', '#E1E5F2', '#E1E5F2'],
        },
      ],
    }
    // renderizando os gráficos.
    if (
      lto
        .filter((value) => value.unidade == item.unidade)
        .map((item) => item.tipo) == 1 ||
      lto
        .filter((value) => value.unidade == item.unidade)
        .map((item) => item.tipo) == 2
    ) {
      return (
        <div id="invólucro"
          style={{
            display: 'flex', flexDirection: 'row',
            backgroundColor: '#ffffff', margin: 10,
            borderRadius: 5,
            boxShadow: '0px 2px 20px 5px rgba(0, 0, 0, 0.1)',
            height: 420, width: window.innerWidth < 400 ? '90vw' : '',
          }}>
          <div id={"hospital" + item.id}
            className="card"
            onClick={() => selectUnidade(item)}
            style={{
              position: 'relative',
              display: renderchart == 1 ? 'flex' : 'none',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              // alignSelf: window.innerWidth > 400 ? 'flex-start' : 'center',
              borderRadius: 5,
              padding: 10,
              width: window.innerWidth < 400 ? '100%' : '21vw',
              minWidth: window.innerWidth < 400 ? '90%' : '21vw',
            }}
          >
            <div
              className="title2"
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                margin: 10,
                padding: 0,
                height: 75,
                width: '100%',
                textAlign: 'center',
              }}
            >
              {item.unidade}
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
              <Doughnut
                data={dataChart}
                width={window.innerWidth > 400 ? 0.13 * window.innerWidth : 200}
                height={window.innerWidth > 400 ? 0.13 * window.innerWidth : 200}
                plugins={ChartDataLabels}
                options={{
                  plugins: {
                    datalabels: {
                      display: function (context) {
                        return context.dataset.data[context.dataIndex] !== 0
                      },
                      color: '#FFFFFF',
                      textShadowColor: 'black',
                      textShadowBlur: 5,
                      font: {
                        weight: 'bold',
                        size: 16,
                      },
                    },
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
                    },
                  },
                  animation: {
                    duration: 500,
                  },
                  title: {
                    display: false,
                    text: 'OCUPAÇÃO DE LEITOS',
                  },
                  legend: {
                    display: false,
                    position: 'bottom',
                  },
                  maintainAspectRatio: true,
                  responsive: false,
                }}
              />
              {BtnInterconsultas(item.hospital, item.unidade)}
              <div id="OCUPAÇÃO">
                <div
                  id="OCUPAÇÃO"
                  className="title2center"
                  style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    alignSelf: 'center',
                    position: 'absolute', top: 5, left: 5, right: 5, bottom: 5,
                    fontWeight: 'bold',
                    margin: 2.5,
                    padding: 0, fontSize: 20
                  }}
                >
                  {
                    Math.ceil(
                      (pct.filter((value) => value.unidade == item.unidade)
                        .length *
                        100) /
                      lto
                        .filter((value) => value.unidade == item.unidade)
                        .map((item) => item.leitos)
                        .reduce(somaLeitos, 0),
                    ) +
                    '%'}
                </div>
              </div>
            </div>
            <div id="LEGENDA"
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                flexWrap: 'wrap',
                marginTop: 5,
                marginBottom: 5,
                boxShadow: 'none',
                width: '100%'
              }}
            >
              <div style={{
                display: window.innerWidth > 800 ? 'flex' : 'none', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center'
              }}>
                <div
                  id="LEITOS VAGOS"
                  className="secondary"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    backgroundColor: 'grey',
                    margin: 2.5,
                    padding: 0,
                  }}
                ></div>
                <p
                  className="title2center"
                  style={{
                    width: '8vw',
                    margin: 2.5,
                    marginRight: 5,
                    padding: 0,
                    fontSize: 10,
                  }}
                >
                  LEITOS VAGOS
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div
                  id="PACIENTES CRÔNICOS"
                  className="secondary"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    backgroundColor: '#52be80',
                    margin: 2.5,
                    padding: 0,
                  }}
                ></div>
                <p
                  className="title2center"
                  style={{
                    width: '8vw',
                    margin: 2.5,
                    marginRight: 5,
                    padding: 0,
                    fontSize: 10,
                  }}
                >
                  CRÔNICOS
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div
                  id="CUIDADOS PALIATIVOS"
                  className="secondary"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    backgroundColor: '#5DADE2',
                    margin: 2.5,
                    padding: 0,
                  }}
                ></div>
                <p
                  className="title2center"
                  style={{
                    width: '8vw',
                    margin: 2.5,
                    marginRight: 5,
                    padding: 0,
                    fontSize: 10,
                  }}
                >
                  PALIATIVOS
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div
                  id="REABILITAÇÃO"
                  className="secondary"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    backgroundColor: '#F4D03F',
                    margin: 2.5,
                    padding: 0,
                  }}
                ></div>
                <p
                  className="title2center"
                  style={{
                    width: '8vw',
                    margin: 2.5,
                    marginRight: 5,
                    padding: 0,
                    fontSize: 10,
                  }}
                >
                  { window.innerWidth < 600 ? 'REAB' : 'REABILITAÇÃO'}
                </p>
              </div>

            </div>

            <div id={"expandbtn" + item.id}
              className="blue-button"
              style={{
                width: 25, minWidth: 25, height: 25, minHeight: 25,
                position: 'absolute', bottom: 5, right: 5
              }}
              onClick={(e) => {
                document.getElementById("hospitaisstuff" + item.id).style.opacity = 0
                document.getElementById("expandbtn" + item.id).style.display = "none"
                document.getElementById("retractbtn" + item.id).style.display = "flex"

                document.getElementById("hospitaisstuff" + item.id).classList = "expandcard";
                setTimeout(() => {
                  var position = document.getElementById("hospital" + item.id).offsetTop;
                  document.getElementById("LISTA DE UNIDADES").scrollTop = position - 245;
                  document.getElementById("hospitaisstuff" + item.id).style.opacity = 1
                }, 500);

                e.stopPropagation();
              }}
            >
              +
            </div>
            <div id={"retractbtn" + item.id}
              className="blue-button"
              onClick={(e) => {
                document.getElementById("hospitaisstuff" + item.id).style.opacity = 0
                setTimeout(() => {
                  document.getElementById("expandbtn" + item.id).style.display = "flex"
                  document.getElementById("retractbtn" + item.id).style.display = "none"
                  document.getElementById("hospitaisstuff" + item.id).className = "retractcard"
                }, 500);
                e.stopPropagation();
              }}
              style={{
                display: 'none',
                width: 25, minWidth: 25, height: 25, minHeight: 25,
                position: 'absolute', bottom: 5, right: 5
              }}
            >
              -
            </div>

          </div>

          <div id={"hospitaisstuff" + item.id} className="retractcard"
            style={{ display: 'flex', flexDirection: 'row' }}>

            <div id="gráficoMIF"
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                width: '15vw', height: '15vw', backgroundColor: "#F2F2F2", borderRadius: 5,
                padding: 10, margin: 10
              }}>
              <div className="title2center">MIF</div>
              <div className="scroll"
                style={{
                  overflowY: 'hidden', overflowX: 'scroll',
                  padding: 5,
                }}
              >
                <div
                  style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    width: '40vw',
                    height: 100,
                    padding: 5, paddingRight: 12
                  }}>
                  <Bar
                    data={dataChartMif}
                    // width={'100%'}
                    // height={100}
                    plugins={ChartDataLabels}
                    options={{
                      scales: {
                        xAxes: [{
                          gridLines: {
                            display: false
                          },
                          ticks: {
                            display: false
                          }
                        }],
                        yAxes: [{
                          gridLines: {
                            display: false
                          },
                          ticks: {
                            display: false,
                            suggestedMin: 0,
                            suggestedMax: 100,
                          }
                        }]
                      },
                      plugins: {
                        datalabels: {
                          display: false,
                        },
                      },
                      tooltips: {
                        enabled: false,
                      },
                      hover: { mode: null },
                      animation: {
                        duration: 500,
                      },
                      title: {
                        display: false,
                      },
                      legend: {
                        display: false,
                        position: 'bottom',
                      },
                      maintainAspectRatio: false,
                      responsive: true,
                    }}
                  />
                </div>
              </div>
            </div>

            <div id="gráficoPlanoTerapeutico"
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                width: '15vw', height: '15vw', backgroundColor: "#F2F2F2", borderRadius: 5,
                padding: 10, margin: 10
              }}>
              <div className="title2center">PLANO TERAPÊUTICO</div>
              <div className="scroll"
                style={{
                  overflowY: 'hidden', overflowX: 'scroll',
                  padding: 5,
                }}
              >
                <div
                  style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    width: '40vw',
                    height: 60,
                    padding: 5, paddingRight: 12
                  }}>
                  <Bar
                    data={dataChartPlanoTerapeutico}
                    // width={'100%'}
                    // height={100}
                    plugins={ChartDataLabels}
                    options={{
                      scales: {
                        xAxes: [{
                          gridLines: {
                            display: false
                          },
                          ticks: {
                            display: false
                          }
                        }],
                        yAxes: [{
                          gridLines: {
                            display: false
                          },
                          ticks: {
                            display: false,
                            suggestedMin: 0,
                            suggestedMax: 100,
                          }
                        }]
                      },
                      plugins: {
                        datalabels: {
                          display: false,
                        },
                      },
                      tooltips: {
                        enabled: false,
                      },
                      hover: { mode: null },
                      animation: {
                        duration: 500,
                      },
                      title: {
                        display: false,
                      },
                      legend: {
                        display: false,
                        position: 'bottom',
                      },
                      maintainAspectRatio: false,
                      responsive: true,
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={(e) => { history.push('/escala'); e.stopPropagation() }}
              className="blue-button"
              style={{
                display: tipousuario == 2 ? 'flex' : 'none',
                minHeight: '15vw', minWidth: '15vw',
                margin: 10, padding: 10, height: 50
              }}
            >
              ESCALA PROFISSIONAL
            </button>

          </div>

        </div>
      )
    } else if (
      lto
        .filter((value) => value.unidade == item.unidade)
        .map((item) => item.tipo) == 4
    ) {
      return (
        <div id="invólucro"
          style={{
            display: 'flex', flexDirection: 'row',
            backgroundColor: '#ffffff', margin: 10,
            borderRadius: 5,
            boxShadow: '0px 2px 20px 5px rgba(0, 0, 0, 0.1)',
            height: 420, width: window.innerWidth < 400 ? '90vw' : '',
          }}>
          <div id={"hospital" + item.id}
            className="card"
            onClick={() => selectUnidade(item)}
            style={{
              position: 'relative',
              display: renderchart == 1 ? 'flex' : 'none',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              // alignSelf: window.innerWidth > 400 ? 'flex-start' : 'center',
              borderRadius: 5,
              padding: 10,
              width: window.innerWidth < 400 ? '' : '21vw',
              minWidth: window.innerWidth < 400 ? '' : '21vw',
            }}
          >
            <div
              className="title2"
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                margin: 10,
                padding: 0,
                height: 100,
                width: '100%',
                textAlign: 'center',
                // flexDirection: 'column',
              }}
            >
              {item.unidade}
            </div>
            <div
              className="title2"
              style={{
                display:
                  agendabloco.filter((value) => value.unidade == item.unidade)
                    .length == 0
                    ? 'flex'
                    : 'none',
                fontSize: 16,
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 10,
                width: '100%',
                color: '#ec7063',
                textAlign: 'center',
              }}
            >
              <div>CONSULTAS AGENDADAS PARA HOJE:</div>
              <div style={{ margin: 5, fontSize: 16 }}>
                {
                  ambulatorio.filter(
                    (value) =>
                      value.assistente == nomeusuario &&
                      value.unidade == item.unidade &&
                      JSON.stringify(value.admissao).substring(1, 11) ==
                      moment().format('DD/MM/YYYY'),
                  ).length
                }
              </div>
            </div>
            <div
              id="gráfico de rendimento no consultório"
              style={{ margin: 0, marginBottom: 50, padding: 0 }}
            >
              <Line
                data={dataChartConsultas}
                padding={10}
                width={window.innerWidth > 400 ? 0.15 * window.innerWidth : 200}
                height={window.innerWidth > 400 ? 150 : 120}
                plugins={ChartDataLabels}
                options={{
                  scales: {
                    xAxes: [
                      {
                        display: true,
                        ticks: {
                          fontColor: '#1f7a8c',
                          fontWeight: 'bold',
                        },
                        gridLines: {
                          zeroLineColor: 'transparent',
                          lineWidth: 0,
                          drawOnChartArea: false,
                        },
                      },
                    ],
                    yAxes: [
                      {
                        display: false,
                        ticks: {
                          suggestedMin: 0,
                          suggestedMax: 30,
                          fontColor: '#1f7a8c',
                          fontWeight: 'bold',
                        },
                        gridLines: {
                          zeroLineColor: 'transparent',
                          lineWidth: 0,
                          drawOnChartArea: false,
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
                    enabled: true,
                    displayColors: false,
                  },
                  hover: { mode: null },
                  elements: {},
                  animation: {
                    duration: 500,
                  },
                  title: {
                    display: false,
                    text: 'CONSULTAS',
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

            <div id={"expandbtn" + item.id}
              className="blue-button"
              style={{
                width: 25, minWidth: 25, height: 25, minHeight: 25,
                position: 'absolute', bottom: 5, right: 5
              }}
              onClick={(e) => {
                document.getElementById("hospitaisstuff" + item.id).style.opacity = 0
                document.getElementById("expandbtn" + item.id).style.display = "none"
                document.getElementById("retractbtn" + item.id).style.display = "flex"

                document.getElementById("hospitaisstuff" + item.id).classList = "expandcard";
                setTimeout(() => {
                  var position = document.getElementById("hospital" + item.id).offsetTop;
                  document.getElementById("LISTA DE UNIDADES").scrollTop = position - 245;
                  document.getElementById("hospitaisstuff" + item.id).style.opacity = 1
                }, 500);

                e.stopPropagation();
              }}
            >
              +
            </div>
            <div id={"retractbtn" + item.id}
              className="blue-button"
              onClick={(e) => {
                document.getElementById("hospitaisstuff" + item.id).style.opacity = 0
                setTimeout(() => {
                  document.getElementById("expandbtn" + item.id).style.display = "flex"
                  document.getElementById("retractbtn" + item.id).style.display = "none"
                  document.getElementById("hospitaisstuff" + item.id).className = "retractcard"
                }, 500);
                e.stopPropagation();
              }}
              style={{
                display: 'none',
                width: 25, minWidth: 25, height: 25, minHeight: 25,
                position: 'absolute', bottom: 5, right: 5
              }}
            >
              -
            </div>

          </div>

          <div id={"hospitaisstuff" + item.id} className="retractcard"
            style={{ display: 'flex', flexDirection: 'row' }}>



            <div id="gráficoMIF"
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                width: '20vw', height: '30vh', backgroundColor: "#F2F2F2", borderRadius: 5,
                padding: 10, margin: 10
              }}>
              <div className="title2center">MIF</div>
              <div className="scroll"
                style={{
                  overflowY: 'hidden', overflowX: 'scroll',
                  padding: 5,
                }}
              >
                <div
                  style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    width: '40vw',
                    height: 100,
                    padding: 5, paddingRight: 12
                  }}>
                  <Bar
                    data={dataChartMif}
                    // width={'100%'}
                    // height={100}
                    plugins={ChartDataLabels}
                    options={{
                      scales: {
                        xAxes: [{
                          gridLines: {
                            display: false
                          },
                          ticks: {
                            display: false
                          }
                        }],
                        yAxes: [{
                          gridLines: {
                            display: false
                          },
                          ticks: {
                            display: false,
                            suggestedMin: 0,
                            suggestedMax: 100,
                          }
                        }]
                      },
                      plugins: {
                        datalabels: {
                          display: false,
                        },
                      },
                      tooltips: {
                        enabled: false,
                      },
                      hover: { mode: null },
                      animation: {
                        duration: 500,
                      },
                      title: {
                        display: false,
                      },
                      legend: {
                        display: false,
                        position: 'bottom',
                      },
                      maintainAspectRatio: false,
                      responsive: true,
                    }}
                  />
                </div>
              </div>
            </div>
            <div id="gráficoPlanoTerapeutico"
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                width: '20vw', height: '30vh', backgroundColor: "#F2F2F2", borderRadius: 5,
                padding: 10, margin: 10
              }}>
              <div className="title2center">PLANO TERAPÊUTICO</div>
              <div className="scroll"
                style={{
                  overflowY: 'hidden', overflowX: 'scroll',
                  padding: 5,
                }}
              >
                <div
                  style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    width: '40vw',
                    height: 100,
                    padding: 5, paddingRight: 12
                  }}>
                  <Bar
                    data={dataChartPlanoTerapeutico}
                    // width={'100%'}
                    // height={100}
                    plugins={ChartDataLabels}
                    options={{
                      scales: {
                        xAxes: [{
                          gridLines: {
                            display: false
                          },
                          ticks: {
                            display: false
                          }
                        }],
                        yAxes: [{
                          gridLines: {
                            display: false
                          },
                          ticks: {
                            display: false,
                            suggestedMin: 0,
                            suggestedMax: 100,
                          }
                        }]
                      },
                      plugins: {
                        datalabels: {
                          display: false,
                        },
                      },
                      tooltips: {
                        enabled: false,
                      },
                      hover: { mode: null },
                      animation: {
                        duration: 500,
                      },
                      title: {
                        display: false,
                      },
                      legend: {
                        display: false,
                        position: 'bottom',
                      },
                      maintainAspectRatio: false,
                      responsive: true,
                    }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      )
    } else {
      return null
    }
  }

  function Escala(item) {
    if (tipousuario === 2 || tipousuario === 3) {
      // tipos 2 (gestor) e 3 (secretária).
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <button
            className="blue-button"
            style={{ width: 150, alignSelf: 'center' }}
            onClick={() => selectEscala(item)}
          >
            {'ESCALA'}
          </button>
        </div>
      )
    } else {
      return null
    }
  }

  // abrindo a tela de acolhimento (classificação de risco).
  const clickAcolhimento = (item) => {
    settipounidade(lto.filter(value => value.unidade == item.unidade).map(item => item.tipo))
    setnomeunidade(lto.filter(value => value.unidade == item.unidade).map(item => item.unidade))
    history.push('/acolhimento')
  }

  // botão para acesso ao painel do gestor.
  const [painelgestor, setpainelgestor] = useState(0);
  function PainelDoGestorBtn() {
    return (
      <button
        className={painelgestor == 1 ? "red-button" : "green-button"}
        style={{
          display: window.innerWidth > 400 ? 'flex' : 'none',
          width: '8vw', minHeight: '8vw',
          alignSelf: 'flex-start',
          position: 'absolute',
          bottom: 10, left: 10, zIndex: 5,
        }}
        onClick={painelgestor == 1 ? () => setpainelgestor(0) : () => setpainelgestor(1)}
      >
        PAINEL DO GESTOR
      </button>
    )
  }

  function PainelDoGestor() {
    return (
      <div className="scroll fade-in"
        style={{
          position: 'absolute', top: 20, bottom: 20, right: 20,
          backgroundColor: 'darkgray',
          borderRadius: 5,
          padding: 10,
          display: painelgestor == 1 ? 'flex' : 'none',
          width: '30vw',
          opacity: 1,
          zIndex: 2,
          boxShadow: '0px 2px 10px 5px rgba(0, 0, 0, 0.5)'
        }}>
        <Stuff></Stuff>
      </div>
    )
  }

  const [filterunidade, setfilterunidade] = useState('');
  var searchunidade = '';
  var timeout = null;

  const filterUnidade = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterUnidade").focus();
    searchunidade = document.getElementById("inputFilterUnidade").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchunidade == '') {
        setarrayunidades(unidades);
        document.getElementById("inputFilterUnidade").value = '';
        document.getElementById("inputFilterUnidade").focus();
      } else {
        setfilterunidade(document.getElementById("inputFilterUnidade").value.toUpperCase());
        setarrayunidades(unidades.filter(item => item.unidade.includes(searchunidade) == true));
        document.getElementById("inputFilterUnidade").value = searchunidade;
        document.getElementById("inputFilterUnidade").focus();
      }
    }, 500);
  }

  // filtro de unidades...
  function FilterUnidades() {
    return (
      <input
        className="input"
        autoComplete="off"
        placeholder="BUSCAR UNIDADE..."
        onFocus={(e) => (e.target.placeholder = '')}
        onBlur={(e) => (e.target.placeholder = 'BUSCAR UNIDADE...')}
        onChange={() => filterUnidade()}
        style={{
          width: '60vw',
          padding: 20,
          margin: 20,
          alignSelf: 'center',
          textAlign: 'center'
        }}
        type="text"
        id="inputFilterUnidade"
        defaultValue={filterunidade}
        maxLength={100}
      ></input>
    )
  }

  // renderização do componente.
  return (
    <div
      className="main fade-in"
      style={{
        display: renderchart == 1 ? 'flex' : 'none',
      }}
    >
      <PainelDoGestor></PainelDoGestor>
      <Header link={'/hospitais'} titulo={nomehospital}></Header>
      <Toast valor={valor} cor={cor} mensagem={mensagem} tempo={tempo} />
      <PainelDoGestorBtn></PainelDoGestorBtn>
      <FilterUnidades></FilterUnidades>
      <ShowUnidades></ShowUnidades>
      <ViewInterconsultas></ViewInterconsultas>
    </div>
  )
}
export default Unidades
