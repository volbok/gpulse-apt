/* eslint eqeqeq: "off" */
import React, { useState, useEffect } from 'react';
import moment, { locale } from 'moment';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';
import fontbold from '../fonts/Roboto-Bold.ttf';
import axios from 'axios';

function PrintPrescricao(
  { tipo,
    hospital,
    unidade,
    viewprintprescricao,
    idprescricao,
    data,
    idatendimento,
    idusuario,
    usuario,
    firstname,
    lastname,
    funcao,
    conselho,
    box,
    nome,
    dn,
    alergias,
    precaucao,
  }) {

  const [viewcomponent, setviewcomponent] = useState(viewprintprescricao);
  var listaantibioticos = [];
  useEffect(() => {
    setviewcomponent(viewprintprescricao);
    //registerFont();
    loadItens();
    loadComponents();
    loadHorarios();
    loadAntibioticos();
  }, [viewprintprescricao])

  var html = 'https://pulsarapp-server.herokuapp.com';

  // caregando os itens da prescrição. 
  const [listitens, setlistitens] = useState([]);
  const loadItens = () => {
    axios.get(html + "/itensprescricao/'" + idprescricao + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistitens(x.filter((item) => item.grupo !== 'ANTIBIOTICOS' && item.status === 0));
    });
  }

  // carregando os componentes de todos os itens da prescrição.
  const [listcomponentes, setlistcomponentes] = useState([]);
  const loadComponents = () => {
    axios.get(html + "/loadcomponenteview").then((response) => {
      setlistcomponentes(response.data);
    });
  }

  // carregando os horários de adminitração para todos os itens da prescrição.
  const [listhorarios, setlisthorarios] = useState([]);
  const loadHorarios = () => {
    axios.get(html + "/checagemall").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlisthorarios(x);
    });
  }

  // carregamento dos itens de antibióticos (todas as prescrições).
  const [listantibioticos, setlistantibioticos] = useState([]);
  const loadAntibioticos = () => {
    axios.get(html + "/allitensprescricao").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistantibioticos(
        x.filter((item) => item.grupo === 'ANTIBIOTICOS' &&
          item.status === 0 &&
          item.idatendimento === idatendimento &&
          moment((item.datatermino).toString().substring(0, 8), 'DD/MM/YY') > moment().startOf('day').add(1, 'day').add(13, 'hours')));
    });
  }

  // fechar visualização de impressão da prescrição.
  const fechar = () => {
    setviewcomponent(0);
  }

  function Pdf() {
    return (
      <PDFViewer style={{ width: window.innerWidth, height: window.innerHeight, fontSize: 10 }}>
        <Document>
          <Page size="A4">
            <View style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '100%',
              //alignSelf: 'center'
            }}>
              <View style={{ margin: 0, /* fontFamily: 'Roboto-Bold' */ }}>
                <View fixed id="CABEÇALHO" style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '95%', borderRadius: 5, padding: 10,
                  alignSelf: 'center',
                  margin: 10,
                  borderColor: '#000000',
                  borderWidth: 1,
                  borderRadius: 5,
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 2.5 }}>
                    <Text style={{ fontSize: 10, margin: 0, padding: 5, backgroundColor: '#D5DBDB', borderRadius: 5 }}>{'ATENDIMENTO: ' + idatendimento}</Text>
                    <Text style={{ fontSize: 10, margin: 0, padding: 5 }}>{'SETOR: ' + unidade + ' - BOX: ' + box}</Text>
                  </View>
                  <Text style={{ fontSize: 12, margin: 5, fontWeight: 'bold' }}>{'PACIENTE: ' + nome}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 10, margin: 5 }}>{'DN: ' + dn}</Text>
                    <Text style={{ fontSize: 10, margin: 5 }}>{'(' + moment().diff(moment(dn, 'DD/MM/YYYY'), 'years') + ' ANOS)'}</Text>
                  </View>
                  <Text style={{ fontSize: 10, margin: 5 }}>{'RESPONSÁVEL PELA PRESCRIÇÃO: ' + usuario + ' - ' + conselho}</Text>
                  <Text style={{ fontSize: 10, margin: 5 }}>{'DATA DA PRESCRIÇÃO: ' + data}</Text>
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 12, margin: 5, borderRadius: 5, backgroundColor: '#BDBABB', padding: 10 }}>{'ALERGIAS: ' + alergias}</Text>
                    <Text style={{ display: precaucao !== 1 ? 'flex' : 'none', fontSize: 12, margin: 5, borderRadius: 5, backgroundColor: '#BDBABB', padding: 10 }}>
                      {precaucao == 1 ? '' : precaucao == 2 ? 'PRECAUÇÃO DE CONTATO' : precaucao == 3 ? 'PRECAUÇÃO PARA GOTÍCULAS' : 'PRECAUÇÃO PARA AEROSSOL'}
                    </Text>
                  </View>
                </View>
                <View style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignSelf: 'center',
                  width: '95%',
                  borderRadius: 5,
                  marginTop: 0,
                }}>
                  <Text style={{ fontSize: 18, margin: 10, padding: 5, alignSelf: 'center' }}>
                    {'PRESCRIÇÃO MÉDICA'}
                  </Text>
                  <View id="CONTEÚDO" style={{
                    flexDirection: 'column', justifyContent: 'flex-start', alignSelf: 'center',
                    fontSize: 10, width: '100%',
                  }}>
                    <View style={{
                      display: 'flex', flexDirection: 'column',
                      justifyContent: 'flex-start',
                      width: '100%', alignSelf: 'center',
                    }}>
                      {listantibioticos.map((item) => (
                        <View wrap={false}
                          key={item}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            margins: 2.5,
                            padding: 5,
                            borderRadius: 5,
                            width: '95%',
                            backgroundColor: (listantibioticos.indexOf(item) + 1) % 2 !== 0 ? '#EAEDED' : '#FFFFFF',
                          }}>
                          <View style={{
                            display: 'flex', flexDirection: 'row', justifyContent: 'left',
                            marginBottom: 10, fontSize: 12
                          }}>
                            <Text>{(listantibioticos.indexOf(item)) + 1 + ' - '}</Text>
                            <Text style={{ textDecoration: 'underline' }}>{item.farmaco}</Text>
                          </View>
                          <Text style={{ marginLeft: 5 }}>{item.observacao}</Text>
                          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '50%' }}>
                              <Text style={{ marginLeft: 5, marginTop: 10, textDecoration: 'underline' }}>
                                {listcomponentes.filter((valorcomponente) => valorcomponente.iditem === item.id).length > 0 ? 'COMPONENTES:' : ''}
                              </Text>
                              {listcomponentes.filter((valorcomponente) => valorcomponente.iditem === item.id).map((valorcomponente) => (
                                <View
                                  key={valorcomponente.id}
                                  style={{
                                    display: valorcomponente.iditem === item.id && valorcomponente.idprescricao === item.idprescricao ? 'flex' : 'none',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    width: '100%',
                                    flexWrap: 'wrap',
                                    margins: 2.5,
                                    padding: 5,
                                    borderRadius: 5,
                                  }}>
                                  <Text>{valorcomponente.componente + ' - ' + valorcomponente.quantidade + 'UNIDADE(S)'}</Text>
                                </View>
                              ))}
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '50%' }}>
                              <Text style={{ marginLeft: 5, marginTop: 10, textDecoration: 'underline' }}>
                                {listhorarios.filter((valorhorario) => valorhorario.iditem === item.id &&
                                  moment(valorhorario.horario, 'DD/MM/YY HH:mm') > moment().startOf('day').add(13, 'hours') &&
                                  moment(valorhorario.horario, 'DD/MM/YY HH:mm') < moment().startOf('day').add(1, 'day').add(13, 'hours')
                                ).length > 0 ? 'CHECAGEM:' : ''}
                              </Text>
                              <View style={{
                                display: 'flex', flexDirection: 'row', justifyContent: 'left',
                                width: 200, flexWrap: 'wrap',
                              }}>
                                {listhorarios.filter((valorhorario) => valorhorario.iditem === item.id &&
                                  moment(valorhorario.horario, 'DD/MM/YY HH:mm') > moment().startOf('day').add(13, 'hours') &&
                                  moment(valorhorario.horario, 'DD/MM/YY HH:mm') < moment().startOf('day').add(1, 'day').add(13, 'hours')
                                ).map((valorhorario) => (
                                  <View
                                    key={valorhorario.id}
                                    style={{
                                      display: valorhorario.iditem === item.id && valorhorario.idprescricao === item.idprescricao ? 'flex' : 'none',
                                      flexDirection: 'row',
                                      justifyContent: 'flex-start',
                                      width: 100,
                                      flexWrap: 'wrap',
                                      margins: 2.5,
                                      padding: 5,
                                      borderRadius: 5,
                                    }}>
                                    <Text>{valorhorario.horario}</Text>
                                  </View>
                                ))}
                              </View>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                    <View>
                      {listitens.map((item) => (
                        <View wrap={false}
                          key={item.id}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            margins: 2.5,
                            padding: 5,
                            backgroundColor: (listitens.indexOf(item) + 1 + listantibioticos.length) % 2 !== 0 ? '#EAEDED' : '#FFFFFF',
                            borderRadius: 5,
                            width: '95%'
                          }}>
                          <View style={{
                            display: 'flex', flexDirection: 'row', justifyContent: 'left',
                            marginBottom: 10, fontSize: 12
                          }}>
                            <Text>{(listitens.indexOf(item) + 1) + listantibioticos.length + ' - '}</Text>
                            <Text style={{ textDecoration: 'underline' }}>{item.farmaco}</Text>
                          </View>
                          <Text style={{ marginLeft: 5 }}>{item.observacao}</Text>
                          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '50%' }}>
                              <Text style={{ marginLeft: 5, marginTop: 10, textDecoration: 'underline' }}>
                                {listcomponentes.filter((valorcomponente) => valorcomponente.iditem === item.id).length > 0 ? 'COMPONENTES:' : ''}
                              </Text>
                              {listcomponentes.filter((valorcomponente) => valorcomponente.iditem === item.id).map((valorcomponente) => (
                                <View
                                  key={valorcomponente.id}
                                  style={{
                                    display: valorcomponente.iditem === item.id && valorcomponente.idprescricao === item.idprescricao ? 'flex' : 'none',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    width: '100%',
                                    flexWrap: 'wrap',
                                    margins: 2.5,
                                    padding: 5,
                                    borderRadius: 5,
                                  }}>
                                  <Text>{valorcomponente.componente + ' - ' + valorcomponente.quantidade + 'UNIDADE(S)'}</Text>
                                </View>
                              ))}
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '50%' }}>
                              <Text style={{ marginLeft: 5, marginTop: 10, textDecoration: 'underline' }}>
                                {listhorarios.filter((valorhorario) => valorhorario.iditem === item.id).length > 0 ? 'CHECAGEM:' : ''}
                              </Text>
                              <View style={{
                                display: 'flex', flexDirection: 'row', justifyContent: 'left',
                                width: 200, flexWrap: 'wrap',
                              }}>
                                {listhorarios.filter((valorhorario) => valorhorario.iditem === item.id).map((valorhorario) => (
                                  <View
                                    key={valorhorario.id}
                                    style={{
                                      display: valorhorario.iditem === item.id && valorhorario.idprescricao === item.idprescricao ? 'flex' : 'none',
                                      flexDirection: 'row',
                                      justifyContent: 'flex-start',
                                      width: 100,
                                      flexWrap: 'wrap',
                                      margins: 2.5,
                                      padding: 5,
                                      borderRadius: 5,
                                    }}>
                                    <Text>{valorhorario.horario}</Text>
                                  </View>
                                ))}
                              </View>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={{
                    fontSize: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    alignItems: 'center', width: '100%', marginBottom: 5, marginTop: 20, marginBottom: 20
                  }}>
                    <Text style={{ margin: 5 }}> _______________________________ </Text>
                    <Text>{firstname + ' ' + lastname}</Text>
                    <Text>{conselho}</Text>
                  </View>
                </View>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer >
    )
  }

  function BackButton() {
    return (
      <div style={{ position: 'absolute', left: 20, bottom: 20, zIndex: 21 }}>
        <button
          className="green-button"
          onClick={() => fechar()}
          style={{
            width: 120,
            height: 50,
            margin: 2.5,
            padding: 5,
          }}
        >
          VOLTAR
      </button>
      </div>
    );
  }

  // renderização do componente.
  if (viewcomponent === 1) {
    return (
      <div
        className="menucover"
        id="printevolucao"
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-start',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          borderColor: 'transparent',
          padding: 0,
          borderWidth: 0,
          borderRadius: 0,
          zIndex: 900,
        }}>
        <Pdf></Pdf>
        <BackButton></BackButton>
      </div>
    )
  } else {
    return null
  }
}

export default PrintPrescricao;