/* eslint eqeqeq: "off" */
import React, { useContext } from 'react';
import moment, { locale } from 'moment';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import Context from '../Context';

function PrintHemoderivados(
  { hgb, hto, plaq, rni, ptt, fibrinogenio, reacaotransfusional, coagulacao,
    indicacao, ultimatransfusao, ch, cplaq, plasma, criop, statustransfusao, reserva,
    hemaciasdeleucocitadas, hemaciasfenotipadas, hemaciaslavadas, hemaciasirradiadas,
    plaquetasdeleucocitadas, plaquetasirradiadas,
  }) {
  // recuperando estados globais (Context.API).
  const {
    nomehospital,
    nomeunidade,
    nomeusuario, tipousuario, conselhousuario,
    idatendimento,
    idpaciente,
    nomepaciente, box, dn,
    peso, setpeso,
    pickdate1,
    hemoderivados, sethemoderivados,
    setprinthemoderivados, printhemoderivados,
    setprinttermohemoderivados
  } = useContext(Context)

  const fechar = () => {
    setprinthemoderivados(0);
    setprinttermohemoderivados(1);
  }

  function Pdf() {
    return (
      <PDFViewer style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, width: window.innerWidth, height: window.innerHeight, fontSize: 10 }}>
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
                    <Text style={{ fontSize: 10, margin: 0, padding: 5 }}>{'SETOR: ' + nomeunidade + ' - BOX: ' + box}</Text>
                  </View>
                  <Text style={{ fontSize: 12, margin: 5, fontWeight: 'bold' }}>{'PACIENTE: ' + nomepaciente}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 10, margin: 5 }}>{'DN: ' + dn}</Text>
                    <Text style={{ fontSize: 10, margin: 5 }}>{'(' + moment().diff(moment(dn, 'DD/MM/YYYY'), 'years') + ' ANOS)'}</Text>
                  </View>
                  <Text style={{ fontSize: 10, margin: 5 }}>{'RESPONSÁVEL PELO DOCUMENTO: ' + nomeusuario + ' - ' + conselhousuario}</Text>
                  <Text style={{ fontSize: 10, margin: 5 }}>{'DATA DO DOCUMENTO: ' + moment().format('DD/MM/YYYY')}</Text>
                </View>
                <View style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                  margin: 0,
                  paddingRight: 5,
                }}>
                  <Text style={{ fontSize: 14, margin: 5, padding: 5, alignSelf: 'center' }}>
                    {'REQUISIÇÃO DE TRANSFUSÃO'}
                  </Text>
                  <View style={{ width: '100%', borderColor: '#000000', borderWidth: 1, borderRadius: 5, }}>
                    <View id="INFORMAÇÕES CLÍNICAS" style={{ fontSize: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', width: '100%', margin: 5 }}>
                      <View style={{ fontSize: 8, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '90%', textAlign: 'center', verticalAlign: 'center' }}>
                        <View style={{ margin: 2.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 75, height: 50, borderRadius: 5, backgroundColor: '#EAEDED' }}>
                          <Text style={{ margin: 2.5 }}>{'HEMOGLOBINA: \n' + hgb + ' g%'}</Text>
                        </View>
                        <View style={{ fontSize: 8, margin: 2.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 75, height: 50, borderRadius: 5, backgroundColor: '#EAEDED' }}>
                          <Text style={{ margin: 2.5 }}>{'HEMATÓCRITO: \n' + hto + ' %'}</Text>
                        </View>
                        <View style={{ fontSize: 8, margin: 2.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 75, height: 50, borderRadius: 5, backgroundColor: '#EAEDED' }}>
                          <Text style={{ margin: 2.5 }}>{'PLAQUETAS: \n' + plaq + ' /mm3'}</Text>
                        </View>
                        <View style={{ fontSize: 8, margin: 2.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 75, height: 50, borderRadius: 5, backgroundColor: '#EAEDED' }}>
                          <Text style={{ margin: 2.5 }}>{'RNI: \n' + rni}</Text>
                        </View>
                        <View style={{ fontSize: 8, margin: 2.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 75, height: 50, borderRadius: 5, backgroundColor: '#EAEDED' }}>
                          <Text style={{ margin: 2.5 }}>{'PTT: \n' + ptt + ' s'}</Text>
                        </View>
                        <View style={{ fontSize: 8, margin: 2.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 75, height: 50, borderRadius: 5, backgroundColor: '#EAEDED' }}>
                          <Text style={{ margin: 2.5 }}>{'FIBRINOGÊNIO: \n' + fibrinogenio + ' mg/dl'}</Text>
                        </View>
                      </View>
                      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: 5, borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5 }}>
                        <Text style={{ display: ultimatransfusao !== 'NÃO' ? 'flex' : 'none', margin: 2.5, width: 120, textAlign: 'center' }}>{ultimatransfusao !== 'NÃO' ? 'ÚLTIMA TRANSFUSÃO: ' + ultimatransfusao : ''}</Text>
                        <Text style={{ margin: 2.5, width: 200, textAlign: 'center' }}>{reacaotransfusional === 1 ? 'REAÇÃO TRANSFUSIONAL: SIM' : 'REAÇÃO TRANSFUSIONAL: NÃO'}</Text>
                        <Text style={{ margin: 2.5, width: 200, textAlign: 'center' }}>{coagulacao === 1 ? 'DISTÚRBIO DE COAGULAÇÃO: SIM' : 'DISTÚRBIO DE COAGULAÇÃO: NÃO'}</Text>
                      </View>
                      <Text style={{ display: 'flex', flexDirection: 'center', justifyContent: 'center', margin: 2.5, padding: 5, textAlign: 'justify', width: '100%' }}>{'INDICAÇÃO CLÍNICA: ' + indicacao}</Text>
                    </View>
                    <View id="HEMOCOMPONENTES SOLICITADOS" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: 5, alignItems: 'center', margin: 0 }}>
                      <Text style={{ fontSize: 12, margin: 2.5, padding: 0, textDecoration: 'underline' }}>{'HEMOCOMPONENTE(S) SOLICITADO(S):'}</Text>
                      <View style={{ fontSize: 8, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '90%', textAlign: 'center', verticalAlign: 'center' }}>
                        <View style={{ display: ch > 0 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', margin: 5, width: 100, height: 50, backgroundColor: '#EAEDED', borderRadius: 5, padding: 5 }}>
                          <Text>{ch > 0 ? 'CONCENTRADO DE\n HEMÁCIAS: ' + ch + ' UN (300ML)' : ''}</Text>
                        </View>
                        <View style={{ display: cplaq > 0 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', margin: 5, width: 100, height: 50, backgroundColor: '#EAEDED', borderRadius: 5, padding: 5 }}>
                          <Text style={{ margin: 5 }}>{cplaq > 0 ? 'CONCENTRADO DE\n PLAQUETAS: ' + cplaq + ' UN (20ML)' : ''}</Text>
                        </View>
                        <View style={{ display: plasma > 0 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', margin: 5, width: 100, height: 50, backgroundColor: '#EAEDED', borderRadius: 5, padding: 5 }}>
                          <Text style={{ margin: 5 }}>{plasma > 0 ? 'PLASMA FRESCO\n CONGELADO: ' + plasma + ' UN (200ML)' : ''}</Text>
                        </View>
                        <View style={{ display: criop > 0 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', margin: 5, width: 100, height: 50, backgroundColor: '#EAEDED', borderRadius: 5, padding: 5 }}>
                          <Text style={{ margin: 5 }}>{criop > 0 ? 'CRIOPRECIPITADO: ' + criop + ' UN (20ML)' : ''}</Text>
                        </View>
                      </View>
                    </View>
                    <View id="TIPO DE ATENDIMENTO/RESERVA" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: 5, borderRadius: 5, backgroundColor: '#EAEDED' }}>
                        <Text style={{ fontSize: 10, margin: 5, padding: 5, textAlign: 'justify' }}>{
                          statustransfusao === 1 ? 'TIPO DE ATENDIMENTO: NÃO URGENTE' :
                            statustransfusao === 2 ? 'TIPO DE ATENDIMENTO: URGENTE' : 'TIPO DE ATENDIMENTO: EXTREMA URGÊNCIA'
                        }</Text>
                      </View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: 5, borderRadius: 5, backgroundColor: '#EAEDED' }}>
                        <Text style={{ fontSize: 10, margin: 5, padding: 5 }}>{'RESERVA: ' + reserva}</Text>
                      </View>
                    </View>
                    <View id="AGÊNCIA TRANSFUSIONAL" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: 5 }}>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '20%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5 }}>
                        <Text style={{ fontSize: 8, margin: 5, padding: 5, textAlign: 'center' }}>{'ETIQUETA DE AMOSTRA'}</Text>
                      </View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '20%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5 }}>
                        <Text style={{ fontSize: 8, margin: 5, padding: 5, textAlign: 'center' }}>{'NÚMERO DA AMOSTRA'}</Text>
                      </View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '20%' }}>
                        <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '100%', height: 50, borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5 }}>
                          <Text style={{ fontSize: 8, margin: 5, padding: 5, textAlign: 'center' }}>{'ABO-RH ANTERIOR'}</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '100%', height: 50, borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5 }}>
                          <Text style={{ fontSize: 8, margin: 5, padding: 5, textAlign: 'center' }}>{'ABO-RH NOVO'}</Text>
                        </View>
                      </View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '20%', marginLeft: 5, }}>
                        <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '100%', height: 50, borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5 }}>
                          <Text style={{ fontSize: 8, margin: 5, padding: 5, textAlign: 'center' }}>{'PAI ANTERIOR'}</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '100%', height: 50, borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5 }}>
                          <Text style={{ fontSize: 8, margin: 5, padding: 5, textAlign: 'center' }}>{'PAI NOVO'}</Text>
                        </View>
                      </View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '15%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5, marginLeft: 7.5 }}>
                        <Text style={{ fontSize: 8, margin: 5, padding: 5, textAlign: 'center' }}>{'OBSERVAÇÃO'}</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 8, margin: 5, padding: 5, textAlign: 'center' }}>{'RESPONSÁVEL PELA ENTREGA: ________________________________  DATA E HORA: _____/____/____ - ____ : ____'}</Text>
                    <Text style={{ fontSize: 10, margin: 0, marginTop: 5, padding: 0, textAlign: 'center' }}>{'ESPAÇO RESERVADO PARA O SETOR TÉCNICO DA AGÊNCIA TRANSFUSIONAL'}</Text>
                    <View id="AGÊNCIA TRANSFUSIONAL" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: 0 }}>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '30%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5 }}>
                        <Text style={{ fontSize: 8, margin: 5, padding: 5, textAlign: 'center' }}>{'HEMODERIVADOS ENVIADOS'}</Text>
                      </View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '10%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5 }}>
                        <Text style={{ fontSize: 8, margin: 5, padding: 5, textAlign: 'center' }}>{'GS/RH'}</Text>
                      </View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '15%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5 }}>
                        <Text style={{ fontSize: 8, margin: 5, padding: 5, textAlign: 'center' }}>{'N. DE BOLSAS'}</Text>
                      </View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '15%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5 }}>
                        <Text style={{ fontSize: 8, margin: 5, padding: 5, textAlign: 'center' }}>{'VALIDADE'}</Text>
                      </View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '25%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5 }}>
                        <Text style={{ fontSize: 8, margin: 0, padding: 5, textAlign: 'center' }}>{'ASSINATURA (ENF)'}</Text>
                      </View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '30%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5, marginTop: 0, height: 25 }}></View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '10%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5, marginTop: 0, height: 25 }}></View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '15%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5, marginTop: 0, height: 25 }}></View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '15%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5, marginTop: 0, height: 25 }}></View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '25%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5, marginTop: 0, height: 25 }}></View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '30%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5, marginTop: 0, height: 25 }}></View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '10%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5, marginTop: 0, height: 25 }}></View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '15%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5, marginTop: 0, height: 25 }}></View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '15%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5, marginTop: 0, height: 25 }}></View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '25%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5, marginTop: 0, height: 25 }}></View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '30%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5, marginTop: 0, height: 25 }}></View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '10%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5, marginTop: 0, height: 25 }}></View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '15%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5, marginTop: 0, height: 25 }}></View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '15%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5, marginTop: 0, height: 25 }}></View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '25%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5, marginTop: 0, height: 25 }}></View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '30%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5, marginTop: 0, height: 25 }}></View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '10%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5, marginTop: 0, height: 25 }}></View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '15%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5, marginTop: 0, height: 25 }}></View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '15%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5, marginTop: 0, height: 25 }}></View>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '25%', borderColor: 'black', border: 'solid', borderWidth: 1, borderRadius: 5, margin: 2.5, marginTop: 0, height: 25 }}></View>
                    </View>
                  </View>
                </View>
                <View style={{ fontSize: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginBottom: 5 }}>
                  <Text style={{ marginTop: 20 }}> _______________________________ </Text>
                  <Text style={{ marginTop: 5 }}>{nomeusuario}</Text>
                  <Text>{conselhousuario}</Text>
                </View>
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
  if (printhemoderivados === 1) {
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

export default PrintHemoderivados;