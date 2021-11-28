/* eslint eqeqeq: "off" */
import React, { useState } from 'react'
import { useEffect, useContext } from 'react'
import axios from 'axios'
import { Doughnut, Bar } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import Header from '../components/Header'
import Context from '../Context'
import { useHistory } from 'react-router-dom'
import change from '../images/change.svg'
import AptTransicaoDeServicos from '../components/AptTransicaoDeServicos'

function Hospitais() {
  var html = 'https://pulsarapp-server.herokuapp.com';
  // recuperando estados globais (Context.API).
  const { idusuario, tipousuario, setnomehospital } = useContext(Context)
  // history (react-router-dom).
  let history = useHistory()

  // carregamento da lista de convênios.
  const [convenios, setconvenios] = useState([])
  const loadConvenios = () => {
    // ROTA: SELECT * FROM usuarioxhospital WHERE idusuario = loginid.
    axios.get(html + "/convenios").then((response) => {
      setconvenios(response.data)
    })
  }

  // carregamento da lista de hospitais nos quais o usuário trabalha.
  const [hospitais, setHospitais] = useState([])
  const loadHospitais = () => {
    // ROTA: SELECT * FROM usuarioxhospital WHERE idusuario = loginid.
    axios.get(html + "/hospitais/'" + idusuario + "'").then((response) => {
      setHospitais(response.data)
    })
  }
  // montando a lista de hospitais.
  function ShowHospitais() {
    return (
      <div
        className="scroll"
        id="LISTA DE HOSPITAIS"
        style={{
          scrollBehavior: 'smooth',
          height: '82vh', maxHeight: '82vh',
          flexDirection: window.innerWidth < 400 ? 'column' : 'row',
          flexWrap: window.innerWidth < 400 ? 'nowrap' : 'wrap',
          backgroundColor: 'transparent', borderColor: 'transparent'
        }}
      >
        {hospitais.map((item) => GetData(item))}
      </div>
    )
  }

  // selecionando um hospital da lista.
  const selectHospital = (item) => {
    setnomehospital(item.hospital)
    history.push('/unidades')
  }
  // selecionando a tela de atendimentos (apenas secretária).
  const selectAtendimento = (item) => {
    history.push('/secretaria')
  }

  useEffect(() => {
    // scroll to top on render (importante para as versões mobile).
    window.scrollTo(0, 0)
    // carregando convênios.
    loadConvenios();
    // carregando registros de atendimentos e de leitos para geração dos gráficos.
    loadAtendimentos()
    loadLeitos()
    // carregando a lista de hospitais.
    loadHospitais()
    // atraso para renderização dos cards com os gráficos (evita o glitch das animações dos doughnuts).
    setTimeout(() => {
      setrenderchart(1);
    }, 1000);
  }, [])

  // carregando regitro de atendimentos.
  const [pct, setpct] = useState([])
  const loadAtendimentos = () => {
    axios.get(html + '/atendimentos').then((response) => {
      var x = [0, 1]
      x = response.data
      setpct(x.filter((value) => value.ativo !== 0))
    })
  }

  // carregando totais de leitos.
  const [lto, setlto] = useState([10, 20, 30])
  const loadLeitos = () => {
    axios.get(html + '/leitos').then((response) => {
      var x = [0, 1]
      x = response.data
      setlto(response.data)
    })
  }

  // efetuando a soma de leitos.
  function somaLeitos(total, num) {
    return total + num
  }

  // CHART.
  /* gráfico em torta que exibe o total de leitos vagos e o total
  de leitos ocupados para cada hospital. */
  var dataChart = []
  const [renderchart, setrenderchart] = useState(0);
  function GetData(item) {
    // gerando os dados do gráfico.
    console.log(
      'LEITOS: ' +
      lto
        .filter((value) => value.hospital == item.hospital)
        .map((item) => item.leitos)
        .reduce(somaLeitos, 0),
    )
    console.log(
      'INTERNADOS: ' +
      pct.filter((value) => value.hospital == item.hospital).length,
    )
    dataChart = {
      labels: [' LEITOS LIVRES', ' PACIENTE CRÔNICO', ' CUIDADOS PALIATIVOS', ' REABILITAÇÃO'],
      datasets: [
        {
          data: [
            lto
              .filter((value) => value.hospital == item.hospital)
              .map((item) => item.leitos)
              .reduce(somaLeitos, 0) -
            pct.filter((value) => value.hospital == item.hospital).length,

            pct.filter((value) => value.hospital == item.hospital && value.linhadecuidado == 1).length,
            pct.filter((value) => value.hospital == item.hospital && value.linhadecuidado == 2).length,
            pct.filter((value) => value.hospital == item.hospital && value.linhadecuidado == 3).length,
          ],
          backgroundColor: ['grey', '#52be80', '#5DADE2', '#F4D03F'],
          borderWidth: 5,
          borderColor: '#ffffff',
          hoverBorderColor: ['#ffffff', '#ffffff'],
        },
      ],
    }
    return (
      <div id="invólucro"
        style={{
          display: 'flex', flexDirection: 'row',
          backgroundColor: '#ffffff', margin: 10,
          borderRadius: 5,
          boxShadow: '0px 2px 20px 5px rgba(0, 0, 0, 0.1)',
          height: 450, width: window.innerWidth < 400 ? '90vw' : '',
        }}>
        <div
          id={"hospital" + item.id}
          className="card"
          onClick={() => selectHospital(item)}
          style={{
            position: 'relative',
            display: renderchart == 1 ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'center',
            alignSelf: window.innerWidth > 400 ? 'flex-start' : 'center',
            borderRadius: 5,
            padding: 10,
            width: window.innerWidth < 400 ? '100%' : '21vw',
            minWidth: window.innerWidth < 400 ? '90%' : '21vw',
            height: 420
          }}
        >
          <div
            className="title2center"
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
            {JSON.stringify(item.hospital).length > 40 ? JSON.stringify(item.hospital).substring(1, 38) + '...' : item.hospital}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
            <Doughnut
              data={dataChart}
              width={window.innerWidth > 400 ? 0.13 * window.innerWidth : 200}
              height={window.innerWidth > 400 ? 0.13 * window.innerWidth : 200}
              maintainAspectRatio={true}
              responsive={true}
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
                    hoverBorderColor: 'rgba(143, 155, 188, 0.3)',
                    borderColor: 'rgba(143, 155, 188, 0.3)',
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
                    (pct.filter((value) => value.hospital == item.hospital)
                      .length *
                      100) /
                    lto
                      .filter((value) => value.hospital == item.hospital)
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
                  display: 'flex',
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
                {window.innerWidth > 400 ? 'REABILITAÇÃO' : 'REAB'}
              </p>
            </div>
          </div>
          <div
            className="blue-button"
            id={"expandbtn" + item.id}
            style={{
              width: 25, minWidth: 25, height: 25, minHeight: 25,
              position: 'absolute', bottom: 5, right: 5
            }}
            onClick={(e) => {
              document.getElementById("hospitaisstuff" + item.id).style.opacity = 0
              document.getElementById("expandbtn" + item.id).style.display = "none"
              document.getElementById("retractbtn" + item.id).style.display = "flex"

              //var botoes = document.getElementById("LISTA DE HOSPITAIS").getElementsByClassName("expandcard");
              //for (var i = 0; i < botoes.length; i++) {
              //botoes.item(i).className = "retractcard";
              //}
              document.getElementById("hospitaisstuff" + item.id).classList = "expandcard";
              setTimeout(() => {
                var position = document.getElementById("hospital" + item.id).offsetTop;
                document.getElementById("LISTA DE HOSPITAIS").scrollTop = position - 155;
                document.getElementById("hospitaisstuff" + item.id).style.opacity = 1
              }, 500);

              e.stopPropagation();
            }}
          >
            +
          </div>
          <div
            className="blue-button"
            id={"retractbtn" + item.id}
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
        <div id={"hospitaisstuff" + item.id} className="retractcard" style={{ display: 'flex', flexDirection: 'row' }}>
          {convenios.map(valor => (
            <div className="card" style={{ flexDirection: 'column', width: '9.5vw', height: '13vw', justifyContent: 'space-between' }}>
              <div className="title2center">{valor.convenio == 1 ? 'UNIMED' : valor.convenio == 2 ? 'BRADESCO' : valor.convenio == 3 ? 'HAPVIDA' : valor.convenio == 4 ? 'FUSEX' : valor.convenio == 5 ? 'CASSI' : valor.convenio == 6 ? 'YOKO' : 'PARTICULAR'}</div>
              <div style={{ margin: 10 }}>
                <Doughnut
                  data={{
                    labels: [
                      'CRÔNICOS',
                      'PALIATIVO',
                      'REABILITAÇÃO',
                    ],
                    datasets: [
                      {
                        data: [
                          pct.filter(value => value.hospital == item.hospital && value.convenio == valor.convenio && value.linhadecuidado == 1).length,
                          pct.filter(value => value.hospital == item.hospital && value.convenio == valor.convenio && value.linhadecuidado == 2).length,
                          pct.filter(value => value.hospital == item.hospital && value.convenio == valor.convenio && value.linhadecuidado == 3).length,
                        ],
                        fill: true,
                        backgroundColor: ['#52be80', '#5DADE2', '#F4D03F'],
                        borderColor: 'white',
                        hoverBorderColor: ['#E1E5F2', '#E1E5F2', '#E1E5F2'],
                      },
                    ],
                  }}
                  padding={10}
                  width={window.innerWidth > 400 ? '100%' : 150}
                  height={window.innerWidth > 400 ? '80%' : 150}
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
                        hoverBorderColor: 'rgba(143, 155, 188, 0.3)',
                        borderColor: 'rgba(143, 155, 188, 0.3)',
                        borderWidth: 2.5,
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
              </div>
            </div>
          ))}
          <button className="green-button"
            style={{ flexDirection: 'column', width: '9.5vw', height: '13vw', margin: 15, padding: 5 }}
            onClick={() => {
              settransition(0);
              setTimeout(() => {
                settransition(1);
              }, 500);
            }}
          >
            <img alt="" src={change} style={{ height: 50, width: 50 }}></img>
            <div className="title2center"
              style={{
                display: window.innerWidth > 800 ? 'flex' : 'none',
                color: '#ffffff', fontSize: 12, margin: 0, padding: 0
              }}>
              PACIENTES EM TRANSIÇÃO DE SERVIÇOS:</div>
            <div className="title2center" style={{ color: '#ffffff', fontSize: 16, marginTop: 0 }}>12</div>
          </button>
        </div>
      </div>
    )
  }

  // tela que permite a transição de pacientes entre os serviços oferecidos (ex: hospital >> atendimento domiciliar).
  const [transition, settransition] = useState(0);

  // renderização do componente.
  return (
    <div
      className="main fade-in"
      style={{
        display: renderchart == 1 ? 'flex' : 'none',
      }}
    >
      <Header link={'/gpulse-apt'} titulo={'SERVIÇOS'}></Header>
      <ShowHospitais></ShowHospitais>
      <AptTransicaoDeServicos transition={transition}></AptTransicaoDeServicos>
    </div>
  )
}
export default Hospitais