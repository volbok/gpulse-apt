/* eslint eqeqeq: "off" */
import React, { useState } from 'react'
import { useEffect, useContext } from 'react'
import axios from 'axios'
import { Doughnut, Bar } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import Header from '../components/Header'
import Context from '../Context'
import { useHistory } from 'react-router-dom'

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
      <div className="pulsewidgethospitais" style={{ flexDirection: 'row', width: '98vw' }}>
        <div
          id="hospital"
          className="card"
          onClick={() => selectHospital(item)}
          style={{
            position: 'relative',
            display: renderchart == 1 ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'center',
            alignSelf: window.innerWidth > 400 ? 'flex-start' : 'center',
            borderRadius: 5,
            padding: 20,
            width: window.innerWidth < 400 ? '' : '21vw',
            minWidth: window.innerWidth < 400 ? '' : '21vw',
          }}
        >
          <div
            className="title2center"
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignSelf: 'center',
              fontSize: 18,
              fontWeight: 'bold',
              margin: 5,
              marginBottom: 10,
              padding: 0,
              minWidth: 200,
              width: '90%',
              height: 80,
              minHeight: 80,
            }}
          >
            {JSON.stringify(item.hospital).length > 40 ? JSON.stringify(item.hospital).substring(1, 38) + '...' : item.hospital}
          </div>
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
          ></Doughnut>
          <div>
            <div>
              <div
                id="OCUPAÇÃO"
                className="title2center"
                style={{
                  fontWeight: 'bold',
                  margin: 2.5,
                  padding: 0,
                }}
              >
                {'OCUPAÇÃO: ' +
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
            <div id="LEGENDA"
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginTop: 5,
                marginBottom: 5,
                boxShadow: 'none',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
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
                  REABILITAÇÃO
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll"
          style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', height: '100%', width: '100%' }}>
          {convenios.map(valor => (
            <div className="card" style={{ flexDirection: 'column', width: '20%' }}>
              <div className="title2center">{valor.convenio == 1 ? 'UNIMED' : valor.convenio == 2 ? 'BRADESCO' : 'HAPVIDA'}</div>
              <Bar
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
                      borderColor: 'rgba(82, 190, 128, 1)',
                      hoverBorderColor: ['#E1E5F2', '#E1E5F2', '#E1E5F2'],
                    },
                  ],
                }}
                padding={10}
                width={window.innerWidth > 400 ? 0.1 * window.innerWidth : 150}
                //height={window.innerWidth > 400 ? 80 : 150}
                plugins={ChartDataLabels}
                options={{
                  scales: {
                    xAxes: [
                      {
                        display: false,
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
                          fontColor: '#61636e',
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
                      display: function (context) {
                        return context.dataset.data[context.dataIndex] !== 0
                      },
                      anchor: 'end',
                      align: 'end',
                      color: '#61636e',
                      textShadowColor: 'white',
                      textShadowBlur: 5,
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
          ))}
        </div>
      </div>
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
      <Header link={'/gpulse'} titulo={'SERVIÇOS'}></Header>
      <ShowHospitais></ShowHospitais>
    </div>
  )
}
export default Hospitais