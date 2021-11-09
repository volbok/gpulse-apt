/* eslint eqeqeq: "off" */
import React, { useState, useEffect } from 'react';
import moment, { locale } from 'moment';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';

function PrintFormulario(
  { tipo,
    hospital,
    unidade,
    viewprintformulario,
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
    idformulario,
    dataformulario,
    tipoformulario,
    textoformulario,
    statusformulario
  }) {

  const [viewcomponent, setviewcomponent] = useState(viewprintformulario);
  useEffect(() => {
    setviewcomponent(viewprintformulario);
    if (viewcomponent === 1) {
    }
  }, [viewprintformulario])

  const fechar = () => {
    setviewcomponent(0);
  }

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
                  <Text style={{ fontSize: 10, margin: 5 }}>{'RESPONSÁVEL PELO DOCUMENTO: ' + usuario + ' - ' + conselho}</Text>
                  <Text style={{ fontSize: 10, margin: 5 }}>{'DATA DO DOCUMENTO: ' + dataformulario}</Text>
                </View>
                <View style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  width: '100%',
                  marginTop: 5,
                }}>
                  <Text style={{ fontSize: 18, margin: 10, padding: 5, alignSelf: 'center' }}>
                    {tipoformulario}
                  </Text>
                  <Text style={{
                    fontSize: 10,
                    margin: 5,
                    padding: 10,
                    alignSelf: 'center',
                    //backgroundColor: '#EAEDED',
                    borderRadius: 5,
                    width: '100%',
                  }}>
                    {textoformulario}
                  </Text>
                </View>
              </View>
              <View style={{ fontSize: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginBottom: 5 }}>
                <Text style={{ marginTop: 20 }}> _______________________________ </Text>
                <Text style={{ marginTop: 5 }}>{firstname + ' ' + lastname}</Text>
                <Text>{conselho}</Text>
              </View>
            </View>
          </Page>
        </Document >
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
        id="printprescrição"
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

export default PrintFormulario;