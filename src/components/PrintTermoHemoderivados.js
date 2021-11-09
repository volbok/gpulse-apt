/* eslint eqeqeq: "off" */
import React, { useContext } from 'react';
import moment, { locale } from 'moment';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import Context from '../Context';

function PrintTermoHemoderivados() {
  // recuperando estados globais (Context.API).
  const {
    nomehospital,
    nomeunidade,
    nomeusuario, tipousuario, conselhousuario, especialidadeusuario,
    idatendimento,
    idpaciente,
    nomepaciente, box, dn,
    peso, setpeso,
    pickdate1,
    hemoderivados, sethemoderivados,
    setprinttermohemoderivados, printtermohemoderivados
  } = useContext(Context)

  const fechar = () => {
    setprinttermohemoderivados(0);
    sethemoderivados(0);
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
                  <Text style={{ fontSize: 10, margin: 5 }}>{'RESPONSÁVEL PELO DOCUMENTO: ' + nomeusuario + ' - ' + especialidadeusuario}</Text>
                  <Text style={{ fontSize: 10, margin: 5 }}>{'DATA DO DOCUMENTO: ' + moment().format('DD/MM/YYYY')}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Text style={{ width: '100%', marginTop: 10, marginBottom: 5, display: 'flex', flexDirection: 'row', justifyContent: 'center', textAlign: 'center', fontSize: 12 }}>TERMO DE AUTORIZAÇÃO DE TRANSFUSÃO</Text>
                  <Text style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', fontSize: 8, textAlign: 'justify' }}>
                    {'O presente Termo de Consentimento Esclarecido tem o objetivo de cumprir o dever ético de informar ao paciente e/ou responsável os ' +
                      'principais aspectos relacionados com a Transfusão e/ou Procedimentos Hemoterápicos à(s) qual(is) poderá ser submetido, complementando ' +
                      'as informações prestradas pelo usuário médico e pela equipe de funcionários e prestadores de serviços do Hospital ' + nomehospital + '.' +
                      'Autorizo o Instituto de Hemoterapia, credenciado pelo Hospital, a realizar a(s) transfusão(ões) de hemocomponente(s) ou ' +
                      'procedimentos hemoterápicos prescritos pelo(a) Dr(a) ' + nomeusuario + ' e sua equipe.' +
                      'A proposta da Transfusão de Sangue/Hemocomponentes e/ou Procedimentos Hemoterápicos a que poderei ser submetido(a), seus benefícios, ' +
                      'riscos, complicações potenciais e alternativas me foram explicados claramente pelo médico solicitante. Tiv a oportunidade de fazer ' +
                      'perguntas, que foram respondidas satisfatoriamente. Entendo que não existe garantia absoluta sobre os resultados a serem obtidos, mas que ' +
                      'serão utilizados todos os recursos, técnicas laboratoriais, medicamentos e equipamentos disponíveis no hospital para ser obtido o melhor ' +
                      'resultado. Também estou ciente de que podem ocorrer complicações durante e/ou após a Transfusão de Sangue/Hemocomponentes e/ou ' +
                      'Procedimentos Hemoterápicos, assim como pode ser necessária a modificação da proposta inicial em virtude de situações imprevistas.' +
                      'Confirmo que recebi o Material Informativo para Receptor de Sangue/Hemocomponentes e/ou Procedimentos Hemoterápicos, li, compreendi e concordo ' +
                      'com tudo que me foi esclarecido e que me foi concedida a oportunidade de negar, anular, questionar ou alterar qualquer espaço em branco, parágrafos ' +
                      'ou palavras com as quais não concordasse. Estou ciente que o Banco de Sangue adota todo os procedimentos de qualidade do(s) Hemocomponente(s) ' +
                      'disponibilizado(s), de acordo com a legislação vigente (RDC no. 153, de 14 de junho de 2004) preconizada pela ANVISA, assim como dos riscos inerentes ' +
                      'à transfusão, do tempo necessário para a instalação do(s) Hemocomponente(s), cuidados e exames prévios realziados no meu sangue e do doador(es). ' +
                      'Portanto, autorizo a Transfusão de Hemocomponente(s) e/ou Procedimento(s) Hemoterápico(s) conforme prescrição médica.'
                    }
                  </Text>
                  <Text style={{ marginTop: 10, marginBottom: 5, fontSize: 8 }}>{'SE O PACIENTE AUTORIZA A TRANSFUSÃO.'}</Text>
                  <Text style={{ fontSize: 8 }}>{'Paciente: ' + nomeusuario + '.'}</Text>
                  <Text style={{ fontSize: 8 }}>{'Assinatura: _______________________________________________________ '}</Text>
                  <Text style={{ marginTop: 10, marginBottom: 5, fontSize: 8 }}>{'SE O PACIENTE NÃO AUTORIZA A TRANSFUSÃO.'}</Text>
                  <Text style={{ fontSize: 8 }}>{'Assinatura do Responsável: _______________________________________________________ Grau de parentesco: ______________________ '}</Text>
                  <Text style={{ marginTop: 10, marginBottom: 5, fontSize: 8 }}>{'Belo Horizonte, ' + moment().format('DD/MM/YYYY')}</Text>
                  <Text style={{ marginTop: 10, marginBottom: 5, fontSize: 8, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    {'Expliquei todo o processo transfusional ao paciente acima identificado e/ou ao seu responsável, sobre os benefícios, riscos e alternativas, tendo ' +
                      'respondido às perguntas formuladas pelos mesmos. De acordo com o meu entendimento, o(a) paciente e/ou seu responsável está (ão) em condições de compreender ' +
                      'o que lhes foi informado.'
                    }
                  </Text>
                  <Text style={{ fontSize: 8 }}>{'Enfermeiro(a): _______________________________________________________ COREN: ___________________'}</Text>

                  <Text style={{ marginTop: 10, marginBottom: 5, fontSize: 8, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    {'CIRCUNSTÂNCIAS DE EMERGÊNCIA/RISCO DE MORTE - preencher este consentimento informado "não obtido": Declaro que, devido ao estado clínico do paciente ou à ' +
                      'emergência/risco de morte identificado, sem a rpesença de um responsável, não foi possível fornecer ao paciente as informações necessárias para obtenção deste ' +
                      'consentimento informado. Por este motivo, na tentativa de afastar os riscos prejudiciais à saúde e à vida, solicitei transfusão de hemocomponentes em quantidade ' +
                      'suficiente para melhorar a situação clínica do paciente, com base em avaliação técnica.'
                    }
                  </Text>
                  <Text style={{ fontSize: 8 }}>{'Médico solicitante: ' + nomeusuario + ' CRM-MG: ' + conselhousuario}</Text>
                </View>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
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
  if (printtermohemoderivados === 1) {
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

export default PrintTermoHemoderivados;