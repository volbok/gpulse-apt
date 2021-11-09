/* eslint eqeqeq: "off" */
import React, { useState, useEffect } from 'react';
import moment, { locale } from 'moment';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';
import fontbold from '../fonts/Roboto-Bold.ttf';

function PrintEvolucao(
  { tipo,
    hospital,
    unidade,
    viewprintevolucao,
    idevolucao,
    data,
    idatendimento,
    idusuario,
    usuario,
    funcao,
    conselho,
    idusuariologado,
    box,
    nome,
    dn,
    evolucao,
    pas,
    pad,
    fc,
    fr,
    sao2,
    tax,
    diu,
    fezes,
    bh,
    acv,
    ar,
    abdome,
    outros,
    glasgow,
    rass,
    ramsay,
    hd,
    uf,
    heparina,
    braden,
    morse,
  }) {

  const [viewcomponent, setviewcomponent] = useState(viewprintevolucao);
  useEffect(() => {
    setviewcomponent(viewprintevolucao);
    if (viewcomponent === 1) {
    }
  }, [viewprintevolucao])

  const fechar = () => {
    setviewcomponent(0);
  }

  // registro de fontes para o react-pdf (a lib não aceita ajustar fontWeight).
  Font.register({
    family: 'Roboto',
    src: fontbold,
  });

  function Pdf() {
    return (
      <PDFViewer style={{ width: window.innerWidth, height: window.innerHeight, fontSize: 10 }}>
        <Document>
          <Page size="A4">
            <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <View style={{ margin: 20 }}>
                <View id="CABEÇALHO" style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', borderRadius: 5, padding: 10,
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
                  <Text style={{ fontSize: 10, margin: 5 }}>{'RESPONSÁVEL PELA EVOLUÇÃO: ' + usuario + ' - ' + conselho}</Text>
                  <Text style={{ fontSize: 10, margin: 5 }}>{'DATA DA EVOLUÇÃO: ' + data}</Text>
                </View>
                <View style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  width: '100%',
                  //borderColor: '#000000',
                  //borderWidth: 1,
                  //borderRadius: 5,
                  marginTop: 5,
                  height: '78vh',
                }}>
                  <Text style={{ fontSize: 18, margin: 10, padding: 5, alignSelf: 'center' }}>
                    {funcao < 3 ? 'EVOLUÇÃO MÉDICA' : funcao == 5 ? 'EVOLUÇÃO DE ENFERMAGEM' : 'EVOLUÇÃO MULTIPROFFISIONAL'}
                  </Text>
                  <View id="CONTEÚDO" style={{ flexDirection: 'column', justifyContent: 'center', fontSize: 10, width: '100%' }}>
                    <View style={{
                      display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
                      backgroundColor: '#EAEDED', borderRadius: 5, textAlign: 'left', margin: 0, padding: 5, minHeight: 50, maxHeight: 100
                    }}>
                      <Text style={{ padding: 2.5 }}>{evolucao}</Text>
                      <Text style={{
                        display: hd === 1 ? 'flex' : 'none', padding: 2.5,
                        backgroundColor: "#D6DBDF", borderRadius: 5, padding: 5, width: 230
                      }}>
                        {hd === 1 && heparina === 1 ? 'REALIZADA HD, UF: ' + uf + 'ML,  COM HEPARINA' : hd === 1 && heparina === 0 ? 'REALIZADA HD, UF: ' + uf + 'ML,  SEM HEPARINA' : ''}</Text>
                    </View>
                    <Text style={{
                      textAlign: 'justify', textDecoration: 'underline', alignSelf: 'center',
                      margin: 5, marginTop: 15
                    }}>
                      ESCALAS:
                    </Text>
                    <View style={{
                      display: funcao < 3 || funcao == 5 ? 'flex' : 'none', flexDirection: 'row',
                      justifyContent: 'center', margin: 0,
                    }}>
                      <Text
                        style={{
                          display: glasgow !== '' ? 'flex' : 'none',
                          width: 80,
                          backgroundColor: '#EAEDED',
                          textAlign: 'center',
                          borderRadius: 5, padding: 5, margin: 2.5
                        }}>
                        {glasgow !== '' ? 'GLASGOW: ' + glasgow : ''}</Text>
                      <Text
                        style={{
                          display: ramsay !== '' ? 'flex' : 'none',
                          width: 80,
                          backgroundColor: '#EAEDED',
                          textAlign: 'center',
                          borderRadius: 5, padding: 5, margin: 2.5
                        }}>
                        {ramsay !== '' ? 'RAMSAY: ' + ramsay : ''}</Text>
                      <Text
                        style={{
                          display: rass !== '' ? 'flex' : 'none',
                          width: 80,
                          backgroundColor: '#EAEDED',
                          textAlign: 'center',
                          borderRadius: 5, padding: 5, margin: 2.5
                        }}>
                        {rass !== '' ? 'RASS: ' + rass : ''}</Text>
                      <Text
                        style={{
                          display: braden !== '' ? 'flex' : 'none',
                          width: 80,
                          backgroundColor: '#EAEDED',
                          textAlign: 'center',
                          borderRadius: 5, padding: 5, margin: 2.5
                        }}>
                        {braden !== '' ? 'BRADEN: ' + braden : ''}</Text>
                      <Text
                        style={{
                          display: morse !== '' ? 'flex' : 'none',
                          width: 80,
                          backgroundColor: '#EAEDED',
                          textAlign: 'center',
                          borderRadius: 5, padding: 5, margin: 2.5
                        }}>
                        {morse !== '' ? 'MORSE: ' + morse : ''}</Text>
                    </View>
                    <Text style={{ textAlign: 'justify', textDecoration: 'underline', margin: 0, marginTop: 10, marginBottom: 5, alignSelf: 'center' }}>DADOS CLÍNICOS:</Text>
                    <View style={{ display: funcao < 3 || funcao == 5 ? 'flex' : 'none', flexDirection: 'column', width: '100%' }}>
                      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: 0, width: '100%' }}>
                        <Text style={{ width: 100, textAlign: 'center', backgroundColor: '#EAEDED', borderRadius: 5, padding: 5, margin: 2.5 }}>{'PA: ' + pas + '/' + pad + ' mmHg'}</Text>
                        <Text style={{ width: 100, textAlign: 'center', backgroundColor: '#EAEDED', borderRadius: 5, padding: 5, margin: 2.5 }}>{'FC: ' + fc + ' BPM'}</Text>
                        <Text style={{ width: 100, textAlign: 'center', backgroundColor: '#EAEDED', borderRadius: 5, padding: 5, margin: 2.5 }}>{'FR: ' + fr + ' IRPM'}</Text>
                        <Text style={{ width: 100, textAlign: 'center', backgroundColor: '#EAEDED', borderRadius: 5, padding: 5, margin: 2.5 }}>{'SAO2: ' + sao2 + '%'}</Text>
                        <Text style={{ width: 100, textAlign: 'center', backgroundColor: '#EAEDED', borderRadius: 5, padding: 5, margin: 2.5 }}>{'TAX: ' + tax + '°C'}</Text>
                      </View>
                      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: 0, width: '100%' }}>
                        <Text style={{ width: 170, textAlign: 'center', backgroundColor: '#EAEDED', borderRadius: 5, padding: 5, margin: 2.5 }}>{'EVACUAÇÕES: ' + fezes}</Text>
                        <Text style={{ width: 170, textAlign: 'center', backgroundColor: '#EAEDED', borderRadius: 5, padding: 5, margin: 2.5 }}>{'DIURESE: ' + diu + 'ML/12H'}</Text>
                        <Text style={{ width: 170, textAlign: 'center', backgroundColor: '#EAEDED', borderRadius: 5, padding: 5, margin: 2.5 }}>{'BH: ' + bh + 'ML/12H'}</Text>
                      </View>
                    </View>
                    <Text style={{ display: funcao < 3 ? 'flex' : 'none', textAlign: 'center', textDecoration: 'underline', margin: 0, marginTop: 5, padding: 5 }}>EXAME FÍSICO:</Text>
                    <View style={{
                      display: funcao < 3 || funcao == 5 ? 'flex' : 'none', flexDirection: 'row',
                      justifyContent: 'space-between', margin: 0,
                    }}>
                      <Text
                        style={{
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          width: 272.5,
                          height: 100,
                          textAlign: 'left',
                          padding: 5,
                          margin: 2.5,
                          borderRadius: 5,
                          backgroundColor: '#EAEDED'
                        }}>
                        {acv !== '' ? 'APARELHO CARDIOVASCULAR: ' + acv : 'APARELHO CARDIOVASCULAR: -x-'}
                      </Text>
                      <Text
                        style={{
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          width: 272.5,
                          height: 100,
                          textAlign: 'left',
                          padding: 5,
                          margin: 2.5,
                          borderRadius: 5,
                          backgroundColor: '#EAEDED'
                        }}>
                        {ar !== '' ? 'APARELHO RESPIRATÓRIO: ' + ar : 'APARELHO RESPIRATÓRIO: -x-'}
                      </Text>
                    </View>
                    <View style={{
                      display: funcao < 3 || funcao == 5 ? 'flex' : 'none', flexDirection: 'row',
                      justifyContent: 'space-between', margin: 0,
                    }}>
                      <Text
                        style={{
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          width: 272.5,
                          height: 100,
                          textAlign: 'left',
                          padding: 5,
                          margin: 2.5,
                          borderRadius: 5,
                          backgroundColor: '#EAEDED'
                        }}>
                        {abdome !== '' ? 'ABDOME: ' + abdome : 'ABDOME: -x-'}
                      </Text>
                      <Text
                        style={{
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          width: 272.5,
                          height: 100,
                          textAlign: 'left',
                          padding: 5,
                          margin: 2.5,
                          borderRadius: 5,
                          backgroundColor: '#EAEDED'
                        }}>
                        {outros !== '' ? 'OUTROS: ' + outros : 'OUTROS: -x-'}
                      </Text>
                    </View>
                  </View>
                  <View style={{ fontSize: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginBottom: 5 }}>
                    <Text style={{ marginTop: 20 }}> _______________________________ </Text>
                    <Text>{usuario}</Text>
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

export default PrintEvolucao;