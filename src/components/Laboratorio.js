/* eslint eqeqeq: "off" */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import MaskedInput from 'react-maskedinput';
import { useHistory } from "react-router-dom";
import DatePicker from './DatePicker';
import Context from '../Context';

function Laboratorio({ viewlaboratorio }) {
  //servidor.
  var html = 'https://pulsarapp-server.herokuapp.com';

  // recuperando estados globais (Context.API).
  const {
    idatendimento,
    pickdate1, setpickdate1,
    setlistlaboratorio,
    setarraylaboratorio,
  } = useContext(Context)

  // chave para exibição do componente.
  const [viewcomponent, setviewcomponent] = useState(viewlaboratorio);

  useEffect(() => {
    if (viewlaboratorio === 1) {
      loadOptionsLaboratorio();
      showDatePicker(0, 0);
      setpickdate1('');
      setviewcomponent(viewlaboratorio);
      // retornando estados ao padrão.
      setagorabtn(0);
      setrotinabtn(0);
      setagendadobtn(0);
      setViewSearchLab(0);
      // limpando as listas de exames disponíveis e filtrados.
      setselectedlistlab([]);
      setarrayfilterlab([]);
    } else {
    }
  }, [viewlaboratorio])

  const loadLaboratorio = () => {
    axios.get(html + "/lab/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistlaboratorio(x.sort((a, b) => moment(a.datapedido, 'DD/MM/YYYY HH:MM') < moment(b.datapedido, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
      setarraylaboratorio(x.sort((a, b) => moment(a.datapedido, 'DD/MM/YYYY HH:MM') < moment(b.datapedido, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
    });
  }

  // inserindo registro.
  const insertData = (item) => {
    var obj = {
      idatendimento: item.idatendimento,
      codigo: item.codigo,
      exame: item.exame,
      material: item.material,
      resultado: item.resultado,
      referencia: item.referencia,
      status: 1, // 1 = aguardando coleta.
      datapedido: dataPedido,
      dataresultado: item.dataresultado,
    };
    axios.post(html + '/insertlab', obj);
  };

  const [arraylab, setarraylab] = useState([]);
  // inserindo exames coringa na array de exames laboratoriais a serem solicitados (arraylab).
  // FUNÇÃO RENAL.
  const [ureiabtn, setureiabtn] = useState(0);
  const clickUreia = () => {
    if (ureiabtn === 0) {
      setureiabtn(1);
      var ureia =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'URÉIA',
        material: 'SANGUE',
        resultado: '',
        referencia: 'ATÉ 40 MG/DL',
        status: 1,
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(ureia);
      console.log(arraylab.length);
    } else {
      setureiabtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'URÉIA');
      arraylab.splice(x, 1);
    }
  }
  const [creatininabtn, setcreatininabtn] = useState(0);
  const clickCreatinina = () => {
    if (creatininabtn === 0) {
      setcreatininabtn(1);
      var creatinina =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'CREATININA',
        material: 'SANGUE',
        resultado: '',
        referencia: '0.6 A 1.3 MG/DL',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(creatinina);
    } else {
      setcreatininabtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'CREATININA');
      arraylab.splice(x, 1);
    }
  }
  // ELETRÓLITOS.
  const [sodiobtn, setsodiobtn] = useState(0);
  const clickSodio = () => {
    if (sodiobtn === 0) {
      setsodiobtn(1);
      var sodio =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'SÓDIO',
        material: 'SANGUE',
        resultado: '',
        referencia: '135 A 145 MMOL/L',
        status: 1,
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(sodio);
    } else {
      setsodiobtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'SODIO');
      arraylab.splice(x, 1);
    }
  }
  const [potassiobtn, setpotassiobtn] = useState(0);
  const clickPotassio = () => {
    if (potassiobtn === 0) {
      setpotassiobtn(1);
      var potassio =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'POTÁSSIO',
        material: 'SANGUE',
        resultado: '',
        referencia: '3.5 A 5.5 MMOL/L',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(potassio);
    } else {
      setpotassiobtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'POTÁSSIO');
      arraylab.splice(x, 1);
    }
  }
  const [magnesiobtn, setmagnesiobtn] = useState(0);
  const clickMagnesio = () => {
    if (magnesiobtn === 0) {
      setmagnesiobtn(1);
      var magnesio =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'MAGNÉSIO',
        material: 'SANGUE',
        resultado: '',
        referencia: '1.7 A 2.6 MMOL/L',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(magnesio);
    } else {
      setmagnesiobtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'MAGNÉSIO');
      arraylab.splice(x, 1);
    }
  }
  const [fosforobtn, setfosforobtn] = useState(0);
  const clickFosforo = () => {
    if (fosforobtn === 0) {
      setfosforobtn(1);
      var fosforo =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'FÓSFORO',
        material: 'SANGUE',
        resultado: '',
        referencia: '2.5 A 4.5 MG/DL',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(fosforo);
    } else {
      setfosforobtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'FÓSFORO');
      arraylab.splice(x, 1);
    }
  }
  // GASOMETRIAS E LACTATO.
  const [gasoartbtn, setgasoartbtn] = useState(0);
  const clickGasoart = () => {
    if (gasoartbtn === 0) {
      setgasoartbtn(1);
      var gasoart =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'GASOMETRIA ARTERIAL',
        material: 'SANGUE ARTERIAL',
        resultado: '',
        referencia: 'PH 7.35-7.45, BIC: 22-26MEQ/L, PCO2: 35-45MMHG.',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(gasoart);
    } else {
      setgasoartbtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'GASOMETRIA ARTERIAL');
      arraylab.splice(x, 1);
    }
  }
  const [gasovenbtn, setgasovenbtn] = useState(0);
  const clickGasoven = () => {
    if (gasovenbtn === 0) {
      setgasovenbtn(1);
      var gasoven =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'GASOMETRIA VENOSA',
        material: 'SANGUE VENOSO',
        resultado: '',
        referencia: 'PH 7.32-7.42, BIC: 24-25 MEQ/L, PO2 25-40 MMHG, PCO2: 41-51 MMHG.',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(gasoven);
    } else {
      setgasovenbtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'GASOMETRIA VENOSA');
      arraylab.splice(x, 1);
    }
  }
  const [lactatobtn, setlactatobtn] = useState(0);
  const clickLactato = () => {
    if (lactatobtn === 0) {
      setlactatobtn(1);
      var lactato =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'LACTATO ARTERIAL',
        material: 'SANGUE',
        resultado: '',
        referencia: '0.5-1.6 MMOL/L',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(lactato);
    } else {
      setlactatobtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'LACTATO ARTERIAL');
      arraylab.splice(x, 1);
    }
  }
  const [cloretobtn, setcloretobtn] = useState(0);
  const clickCloreto = () => {
    if (cloretobtn === 0) {
      setcloretobtn(1);
      var cloreto =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'CLORETO',
        material: 'SANGUE',
        resultado: '',
        referencia: '98-107 MMOL/L',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(cloreto);
    } else {
      setcloretobtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'CLORETO');
      arraylab.splice(x, 1);
    }
  }
  // HEMOGRAMA E PCR.
  const [hemogramabtn, sethemogramabtn] = useState(0);
  const clickHemograma = () => {
    if (hemogramabtn === 0) {
      sethemogramabtn(1);
      var hemograma =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'HEMOGRAMA',
        material: 'SANGUE',
        resultado: '',
        referencia: 'HGB: 12-16 G/DL, HTO: 36-48%, LT: 4.000-10.000, PLAQ: 150-400.000',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(hemograma);
    } else {
      sethemogramabtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'HEMOGRAMA');
      arraylab.splice(x, 1);
    }
  }
  const [pcrbtn, setpcrbtn] = useState(0);
  const clickPcr = () => {
    if (pcrbtn === 0) {
      setpcrbtn(1);
      var pcr =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'PCR',
        material: 'SANGUE',
        resultado: '',
        referencia: '< 5 MG/DL',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(pcr);
    } else {
      setpcrbtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'PCR');
      arraylab.splice(x, 1);
    }
  }
  // COAGULOGRAMA.
  const [tapbtn, settapbtn] = useState(0);
  const clickTap = () => {
    if (tapbtn === 0) {
      settapbtn(1);
      var tap =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'TAP + RNI',
        material: 'SANGUE',
        resultado: '',
        referencia: 'TAP: 10-14 SEGUNDOS, RNI: 0.8-1.0',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(tap);
    } else {
      settapbtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'TAP + RNI');
      arraylab.splice(x, 1);
    }
  }
  const [pttbtn, setpttbtn] = useState(0);
  const clickPtt = () => {
    if (pttbtn === 0) {
      setpttbtn(1);
      var ptt =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'PTT',
        material: 'SANGUE',
        resultado: '',
        referencia: '24-40 SEGUNDOS',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(ptt);
    } else {
      setpttbtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'PTT');
      arraylab.splice(x, 1);
    }
  }
  // HEPATOGRAMA.
  const [tgobtn, settgobtn] = useState(0);
  const clickTgo = () => {
    if (tgobtn === 0) {
      settgobtn(1);
      var tgo =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'TGO',
        material: 'SANGUE',
        resultado: '',
        referencia: '5-40 U/L',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      var tgp =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'TGP',
        material: 'SANGUE',
        resultado: '',
        referencia: '7-56 U/L',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(tgo, tgp);
    } else {
      settgobtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'TGO');
      arraylab.splice(x, 1);
    }
  }
  const [falbtn, setfalbtn] = useState(0);
  const clickFal = () => {
    if (falbtn === 0) {
      setfalbtn(1);
      var fal =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'FOSFATASE ALCALINA',
        material: 'SANGUE',
        resultado: '',
        referencia: '46-120 U/L',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(fal);
    } else {
      setfalbtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'FOSFATASE ALCALINA');
      arraylab.splice(x, 1);
    }
  }
  const [ggtbtn, setggtbtn] = useState(0);
  const clickGgt = () => {
    if (ggtbtn === 0) {
      setggtbtn(1);
      var ggt =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'GAMA-GT',
        material: 'SANGUE',
        resultado: '',
        referencia: '7-50 U/L',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(ggt);
    } else {
      setggtbtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'GAMA-GT');
      arraylab.splice(x, 1);
    }
  }
  const [btfbtn, setbtfbtn] = useState(0);
  const clickBtf = () => {
    if (btfbtn === 0) {
      setbtfbtn(1);
      var btf =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'BILIRRUBINA TOTAL E FRAÇÕES',
        material: 'SANGUE',
        resultado: '',
        referencia: 'BT: 0.2-1.1 MG/DL, BI: 0.1-0.7 MG/DL, BD: 0.1-0.4 MG/DL',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(btf);
    } else {
      setbtfbtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'BILIRRUBINA TOTAL E FRAÇÕES');
      arraylab.splice(x, 1);
    }
  }
  const [amilasebtn, setamilasebtn] = useState(0);
  const clickAmilase = () => {
    if (amilasebtn === 0) {
      setamilasebtn(1);
      var amilase =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'AMILASE',
        material: 'SANGUE',
        resultado: '',
        referencia: '20-160 U/L',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(amilase);
    } else {
      setamilasebtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'AMILASE');
      arraylab.splice(x, 1);
    }
  }
  const [lipasebtn, setlipasebtn] = useState(0);
  const clickLipase = () => {
    if (lipasebtn === 0) {
      setlipasebtn(1);
      var lipase =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'LIPASE',
        material: 'SANGUE',
        resultado: '',
        referencia: '2-18 U/L',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(lipase);
    } else {
      setlipasebtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'LIPASE');
      arraylab.splice(x, 1);
    }
  }
  // CULTURAS.
  // hemocultura - 1a amostra.
  const [hemoc1btn, sethemoc1btn] = useState(0);
  const clickHemoc1 = () => {
    if (hemoc1btn === 0) {
      sethemoc1btn(1);
      var hemoc =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'HEMOCULTURA (1a AMOSTRA)',
        material: 'SANGUE',
        resultado: '',
        referencia: 'NHCB',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(hemoc);
    } else {
      sethemoc1btn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'HEMOCULTURA (1a AMOSTRA)');
      arraylab.splice(x, 1);
    }
  }
  // hemocultura - 2a amostra.
  const [hemoc2btn, sethemoc2btn] = useState(0);
  const clickHemoc2 = () => {
    if (hemoc2btn === 0) {
      sethemoc2btn(1);
      var hemoc =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'HEMOCULTURA (2a AMOSTRA)',
        material: 'SANGUE',
        resultado: '',
        referencia: 'NHCB',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(hemoc);
    } else {
      sethemoc2btn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'HEMOCULTURA (2a AMOSTRA)');
      arraylab.splice(x, 1);
    }
  }
  // hemocultura - 3a amostra.
  const [hemoc3btn, sethemoc3btn] = useState(0);
  const clickHemoc3 = () => {
    if (hemoc3btn === 0) {
      sethemoc3btn(1);
      var hemoc =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'HEMOCULTURA (3a AMOSTRA)',
        material: 'SANGUE',
        resultado: '',
        referencia: 'NHCB',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(hemoc);
    } else {
      sethemoc3btn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'HEMOCULTURA (3a AMOSTRA)');
      arraylab.splice(x, 1);
    }
  }
  // urocultura.
  const [urocbtn, seturocbtn] = useState(0);
  const clickUroc = () => {
    if (urocbtn === 0) {
      seturocbtn(1);
      var uroc =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'UROCULTURA',
        material: 'URINA',
        resultado: '',
        referencia: 'NHCB',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(uroc);
    } else {
      seturocbtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'UROCULTURA');
      arraylab.splice(x, 1);
    }
  }
  // cultura de aspirado traqueal.
  const [minibalbtn, setminibalbtn] = useState(0);
  const clickMinibal = () => {
    if (minibalbtn === 0) {
      setminibalbtn(1);
      var minibal =
      {
        idatendimento: idatendimento,
        codigo: 11,
        exame: 'CULTURA DE ASPIRADO TRAQUEAL',
        material: 'ASPIRADO TRAQUEAL',
        resultado: '',
        referencia: 'NHCB',
        status: 'AGUARDANDO COLETA',
        datapedido: '',
        dataresultado: '',
      }
      arraylab.push(minibal);
    } else {
      setminibalbtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.exame === 'ASPIRADO TRAQUEAL');
      arraylab.splice(x, 1);
    }
  }

  // inserindo os registros de exames laboratoriais solicitados no banco de dados.
  const insertLab = () => {
    arraylab.map((item) => insertData(item));
    setTimeout(() => {
      loadLaboratorio();
      setViewSearchLab(0);
      fechar();
    }, 2000);
  }

  // botões para definição da data e hora da coleta.
  const [dataPedido, setDatapedido] = useState('');
  const [agorabtn, setagorabtn] = useState(0);
  const [rotinabtn, setrotinabtn] = useState(0);
  const [agendadobtn, setagendadobtn] = useState(0);

  const clickAgorabtn = () => {
    setDatapedido(moment().format('DD/MM/YYYY HH:mm'));
    setagorabtn(1);
    setrotinabtn(0);
    setagendadobtn(0);
  }
  const clickRotinabtn = () => {
    setDatapedido(moment().format('DD/MM/YYYY') + ' 23:00');
    setagorabtn(0);
    setrotinabtn(1);
    setagendadobtn(0);
  }
  const clickAgendadobtn = () => {
    showDatePicker(1, 1);
    setagorabtn(0);
    setrotinabtn(0);
    setagendadobtn(1);
    document.getElementById("inputHora").value = '';
  }

  // carregando lista de opções de exames laboratoriais.
  const [listlab, setlistlab] = useState([])
  const loadOptionsLaboratorio = () => {
    axios.get(html + '/laboratorio_options').then((response) => {
      setlistlab(response.data);
    });
  }

  // array com os exames laboratoriais selecionados.
  const [selectedlistlab, setselectedlistlab] = useState([]);
  // funções e componentes para busca e adição de outros exames.
  const [filterlab, setfilterlab] = useState('');
  var searchlab = '';
  var timeout = null;
  const [arrayfilterlab, setarrayfilterlab] = useState([listlab]);
  const filterLab = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterLab").focus();
    searchlab = document.getElementById("inputFilterLab").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchlab === '') {
        setarrayfilterlab([]);
        document.getElementById("inputFilterLab").value = '';
        document.getElementById("inputFilterLab").focus();
      } else {
        setfilterlab(document.getElementById("inputFilterLab").value.toUpperCase());
        setarrayfilterlab(listlab.filter(item => item.exame.includes(searchlab) === true));
        document.getElementById("inputFilterLab").value = searchlab;
        document.getElementById("inputFilterLab").focus();
      }
    }, 500);
  }
  const addLab = (item) => {
    var exame = item.exame;
    var newlab = {
      idatendimento: idatendimento,
      codigo: item.codigo,
      exame: item.exame,
      material: item.material,
      resultado: '',
      referencia: item.referencia,
      status: 'AGUARDANDO COLETA',
      datapedido: dataPedido,
      dataresultado: '',
    }
    const x = arraylab.indexOf((item) => item.exame === exame);
    console.log(x);
    if (x !== '') {
      arraylab.push(newlab);
      selectedlistlab.push(newlab);
      setarrayfilterlab([]);
      setfilterlab('');
      document.getElementById("inputFilterLab").value = '';
      document.getElementById("inputFilterLab").focus();
    }
  }
  const deleteLab = (item) => {
    var exame = item.exame;
    const x = arraylab.indexOf((item) => item.exame === exame);
    const y = selectedlistlab.indexOf((item) => item.exame === exame);
    arraylab.splice(x, 1);
    selectedlistlab.splice(y, 1);
    setarrayfilterlab([]);
    setfilterlab('');
    document.getElementById("inputFilterLab").value = '';
    document.getElementById("inputFilterLab").focus();
  }
  const [viewSearchLab, setViewSearchLab] = useState(0);
  function ShowSearchLab() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <input
          className="input"
          autoComplete="off"
          placeholder="BUSCAR EXAME..."
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'BUSCAR EXAME...')}
          onChange={() => filterLab()}
          style={{
            width: 0.3 * window.innerWidth,
            margin: 20,
          }}
          type="text"
          id="inputFilterLab"
          defaultValue={filterlab}
          maxLength={100}
        ></input>
        <div
          className="scrolldrop"
          id="LISTA DE EXAMES LABORATORIAIS PARA SELEÇÃO"
          style={{
            display: arrayfilterlab.length > 0 ? 'flex' : 'none',
            height: 200,
            width: 0.4 * window.innerWidth,
            margin: 20,
          }}
        >
          {arrayfilterlab.map((item) => (
            <p
              key={item.id}
              id="item da lista"
              className="row"
            >
              <button
                onClick={() => addLab(item)}
                className="hover-button"
                style={{ width: '100%' }}
              >
                {item.exame}
              </button>
            </p>
          ))}
        </div>
        <div
          className="scrolldrop"
          id="LISTA DE EXAMES LABORATORIAIS PARA SELEÇÃO"
          style={{
            display: arrayfilterlab.length > 0 ? 'none' : 'flex',
            height: 200,
            width: 0.4 * window.innerWidth,
            margin: 20,
          }}
        >
          {selectedlistlab.map((item) => (
            <p
              key={item.id}
              id="item da lista"
              className="row"
            >
              <button
                className="hover-button"
                style={{ width: '100%' }}
              >
                {item.exame}
              </button>
              <button className="red-button"
                onClick={() => deleteLab(item)}
                style={{ marginRight: 0 }}
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
            </p>
          ))}
        </div>
      </div>
    );
  }

  // inserindo a hora no agendamento da coleta de exames.
  const updateDatapedido = () => {
    clearTimeout(timeout);
    setDatapedido(pickdate1);
    var hora = document.getElementById("inputHora").value;
    var timeout = setTimeout(() => {
      setDatapedido(pickdate1 + ' ' + hora);
    }, 3000);
  }

  const fechar = () => {
    setviewcomponent(0);
    window.scrollTo(0, 0);
    document.body.style.overflow = null;
  }

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

  // renderização do componente.
  if (viewcomponent === 1) { // inserir.
    return (
      <div className="menucover fade-in" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <DatePicker valordatepicker={valordatepicker} mododatepicker={mododatepicker} />
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'SOLICITAR EXAME LABORATORIAL'}</div>
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
                onClick={() => insertLab()}
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
            <div className="title2" style={{ fontSize: 14 }}>DATA E HORA DA COLETA:</div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
              <button
                className="blue-button"
                onClick={() => clickAgorabtn()}
                style={{
                  width: 120,
                  margin: 2.5,
                  flexDirection: 'column',
                  opacity: agorabtn === 1 ? 1 : 0.5,
                }}
              >
                AGORA
              </button>
              <button
                className="blue-button"
                onClick={() => clickRotinabtn()}
                style={{
                  width: 120,
                  margin: 2.5,
                  flexDirection: 'column',
                  opacity: rotinabtn === 1 ? 1 : 0.5,
                }}
              >
                ROTINA
              </button>
              <button
                className="blue-button"
                onClick={() => clickAgendadobtn()}
                title="DATA E HORA AGENDADOS PARA COLETA."
                style={{
                  width: 120,
                  margin: 2.5,
                  flexDirection: 'column',
                  opacity: agendadobtn === 1 ? 1 : 0.5,
                }}
              >
                {pickdate1 != '' ? pickdate1 : 'AGENDAR'}
              </button>
              <MaskedInput
                id="inputHora"
                title="HORA DA COLETA."
                placeholder="HORA"
                autoComplete="off"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'HORA')}
                onChange={() => updateDatapedido()}
                className="input"
                defaultValue="23:00"
                style={{
                  display: agendadobtn === 1 ? 'flex' : 'none',
                  margin: 0,
                  marginLeft: 5,
                  width: 100,
                  alignSelf: 'center',
                }}
                mask="11:11"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="title2" style={{ fontSize: 14, marginBottom: 0, marginTop: 15 }}>SELEÇÃO RÁPIDA DE EXAMES:</div>
                <div
                  className="scroll"
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    height: 260,
                    width: 0.4 * window.innerWidth,
                    paddingRight: 5,
                  }}
                >
                  <button
                    className="blue-button"
                    onClick={() => clickHemograma()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      backgroundColor: '#AF7AC5',
                      flexDirection: 'column',
                      opacity: hemogramabtn === 1 ? 1 : 0.5,
                    }}
                  >
                    HEMOGRAMA
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickPcr()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      backgroundColor: '#AF7AC5',
                      flexDirection: 'column',
                      opacity: pcrbtn === 1 ? 1 : 0.5,
                    }}
                  >
                    PCR
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickGasoart()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      flexDirection: 'column',
                      backgroundColor: '#F4D03F',
                      opacity: gasoartbtn === 1 ? 1 : 0.5,
                    }}
                  >
                    GASOMETRIA ARTERIAL
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickGasoven()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      backgroundColor: '#F4D03F',
                      flexDirection: 'column',
                      opacity: gasovenbtn === 1 ? 1 : 0.5,
                    }}
                  >
                    GASOMETRIA VENOSA
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickLactato()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      backgroundColor: '#F4D03F',
                      flexDirection: 'column',
                      opacity: lactatobtn === 1 ? 1 : 0.5,
                    }}
                  >
                    LACTATO
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickCloreto()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      backgroundColor: '#F4D03F',
                      flexDirection: 'column',
                      opacity: cloretobtn === 1 ? 1 : 0.5,
                    }}
                  >
                    CLORETO
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickUreia()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      flexDirection: 'column',
                      opacity: ureiabtn === 1 ? 1 : 0.5,
                    }}
                  >
                    URÉIA
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickCreatinina()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      flexDirection: 'column',
                      opacity: creatininabtn === 1 ? 1 : 0.5,
                    }}
                  >
                    CREATININA
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickSodio()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      flexDirection: 'column',
                      opacity: sodiobtn === 1 ? 1 : 0.5,
                    }}
                  >
                    SÓDIO
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickPotassio()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      flexDirection: 'column',
                      opacity: potassiobtn === 1 ? 1 : 0.5,
                    }}
                  >
                    POTÁSSIO
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickFosforo()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      flexDirection: 'column',
                      opacity: fosforobtn === 1 ? 1 : 0.5,
                    }}
                  >
                    FÓSFORO
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickMagnesio()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      flexDirection: 'column',
                      opacity: magnesiobtn === 1 ? 1 : 0.5,
                    }}
                  >
                    MAGNÉSIO
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickTgo()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      backgroundColor: '#52BE80',
                      flexDirection: 'column',
                      opacity: tgobtn === 1 ? 1 : 0.5,
                    }}
                  >
                    TGO + TGP
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickFal()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      backgroundColor: '#52BE80',
                      flexDirection: 'column',
                      opacity: falbtn === 1 ? 1 : 0.5,
                    }}
                  >
                    FOSFATASE ALCALINA
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickGgt()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      backgroundColor: '#52BE80',
                      flexDirection: 'column',
                      opacity: ggtbtn === 1 ? 1 : 0.5,
                    }}
                  >
                    GAMA-GT
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickBtf()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      backgroundColor: '#52BE80',
                      flexDirection: 'column',
                      opacity: btfbtn === 1 ? 1 : 0.5,
                    }}
                  >
                    BILIRRUBINA TOTAL E FRAÇÕES
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickAmilase()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      backgroundColor: '#52BE80',
                      flexDirection: 'column',
                      opacity: amilasebtn === 1 ? 1 : 0.5,
                    }}
                  >
                    AMILASE
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickTap()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      backgroundColor: '#CD6155',
                      flexDirection: 'column',
                      opacity: tapbtn === 1 ? 1 : 0.5,
                    }}
                  >
                    TAP + RNI
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickPtt()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      backgroundColor: '#CD6155',
                      flexDirection: 'column',
                      opacity: pttbtn === 1 ? 1 : 0.5,
                    }}
                  >
                    PTT
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickHemoc1()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      flexDirection: 'column',
                      backgroundColor: '#EB984E',
                      opacity: hemoc1btn === 1 ? 1 : 0.5,
                    }}
                  >
                    HEMOCULTURA (1a AMOSTRA)
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickHemoc2()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      flexDirection: 'column',
                      backgroundColor: '#EB984E',
                      opacity: hemoc2btn === 1 ? 1 : 0.5,
                    }}
                  >
                    HEMOCULTURA (2a AMOSTRA)
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickHemoc3()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      flexDirection: 'column',
                      backgroundColor: '#EB984E',
                      opacity: hemoc3btn === 1 ? 1 : 0.5,
                    }}
                  >
                    HEMOCULTURA (3a AMOSTRA)
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickUroc()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      flexDirection: 'column',
                      backgroundColor: '#EB984E',
                      opacity: urocbtn === 1 ? 1 : 0.5,
                    }}
                  >
                    UROCULTURA
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickMinibal()}
                    style={{
                      width: '32%',
                      height: 75,
                      margin: 2.5,
                      flexDirection: 'column',
                      backgroundColor: '#EB984E',
                      opacity: minibalbtn === 1 ? 1 : 0.5,
                    }}
                  >
                    ASPIRADO TRAQUEAL
                  </button>
                </div>
              </div>
              <ShowSearchLab></ShowSearchLab>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
export default Laboratorio;