import './App.css'
import './design.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState } from 'react'
import { useEffect } from 'react'
import Context from './Context'
import axios from 'axios'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom'

// importando componentes.
import Toast from './components/Toast'
import DatePicker from './components/DatePicker'

// importando páginas.
import Acolhimento from './pages/Acolhimento'
import Atendimentos from './pages/Atendimentos'
//import Bloco from './pages/Bloco'
import Escala from './pages/Escala'
import Farmacia from './pages/Farmacia'
import Login from './pages/Login'
import Hospitais from './pages/Hospitais'
import Pacientes from './pages/Pacientes'
import Ambulatorio from './pages/Ambulatorio'
import Prontuario from './pages/Prontuario'
//import Secretaria from './pages/Secretaria'
import Unidades from './pages/Unidades'
//import Usuarios from './pages/Usuarios'

// importando componentes.
import UpdateAtendimento from './components/UpdateAtendimento'
import Settings from './components/Settings'

// função que encapsula todos os componentes de páginas e coordena o iddle-timeout.
function IddleTimeOut() {
  /* eslint eqeqeq: 0 */
  var timer = 0
  var interval = null
  let history = useHistory()
  const loadTimeOut = () => {
    interval = setInterval(() => {
      timer = timer + 1
      // console.log(timer)
      if (timer > 900) {
        timer = 0
        setTimeout(() => {
          toast(1, '#ec7063', 'USUÁRIO DESLOGADO POR INATIVIDADE.', 3000)
          history.push('/gpulse-apt')
        }, 3000)
      }
    }, 1000)
  }
  const resetTimeOut = () => {
    clearInterval(interval)
    timer = 0
    loadTimeOut()
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

  // desabilitando zoom ao pressionar duas vezes a tela (mobile devices).
  const disablePinchZoom = (e) => {
    if (e.touches.length > 1) {
      e.preventDefault()
    }
  }

  useEffect(() => {
    loadTimeOut()
    window.onmousemove = function () {
      resetTimeOut()
    }
    // desabilitando zoom nos dispositivos iOs.
    document.addEventListener('gesturestart', function (e) {
      e.preventDefault();
    });
    document.addEventListener('gesturechange', function (e) {
      e.preventDefault();
    });
    document.addEventListener('gestureend', function (e) {
      e.preventDefault();
    });
    document.body.addEventListener('touchmove', function (event) {
      event.preventDefault();
    });
  }, [])

  return (
    <div
      className={"main"}
      translate="no"
      onTouchEnd={(e) => disablePinchZoom(e)}
    >
      <Toast valor={valor} cor={cor} mensagem={mensagem} tempo={tempo} />
      <Toast></Toast>
      <DatePicker></DatePicker>
      <Switch>
        <div id="páginas">
          <Route exact path="/gpulse-apt">
            <Login></Login>
          </Route>
          <Route path="/atendimentos">
            <Atendimentos></Atendimentos>
          </Route>
          <Route path="/hospitais">
            <Hospitais></Hospitais>
          </Route>
          <Route path="/unidades">
            <Unidades></Unidades>
          </Route>
          <Route path="/escala">
            <Escala></Escala>
          </Route>
          <Route path="/pacientes">
            <Pacientes></Pacientes>
          </Route>
          <Route path="/ambulatorio">
            <Ambulatorio></Ambulatorio>
          </Route>
          <Route path="/acolhimento">
            <Acolhimento></Acolhimento>
          </Route>
          <Route path="/prontuario">
            <Prontuario></Prontuario>
          </Route>
          <Route path="/farmacia">
            <Farmacia></Farmacia>
          </Route>
        </div>
        <div id="componentes">
          <Route path="/updateatendimento">
            <UpdateAtendimento></UpdateAtendimento>
          </Route>
        </div>
      </Switch>
    </div>
  )
}

function App() {
  /* eslint eqeqeq: 0 */
  // estados globais (serão usados no Context.API).
  // identificação do usuário logado.
  const [idusuario, setidusuario] = useState(0)
  const [nomeusuario, setnomeusuario] = useState('')
  const [tipousuario, settipousuario] = useState(0)
  const [especialidadeusuario, setespecialidadeusuario] = useState(0)
  const [conselhousuario, setconselhousuario] = useState(0)
  // identificação do atendimento (hospital, unidade de atendimento).
  const [idhospital, setidhospital] = useState(0)
  const [nomehospital, setnomehospital] = useState('')
  const [idunidade, setidunidade] = useState(0)
  const [tipounidade, settipounidade] = useState(0)
  const [nomeunidade, setnomeunidade] = useState('')
  const [box, setbox] = useState('')
  // identificação do paciente.
  const [idpaciente, setidpaciente] = useState(0)
  const [idatendimento, setidatendimento] = useState(0)
  const [nomepaciente, setnomepaciente] = useState('')
  const [dn, setdn] = useState('')
  const [peso, setpeso] = useState(0)
  // datepicker (data).
  const [pickdate1, setpickdate1] = useState('')
  const [pickdate2, setpickdate2] = useState('')
  // estado para alternância das listas que compõem a tela prontuário (principal, evoluções, diagnósticos, etc).
  const [stateprontuario, setstateprontuario] = useState(1)
  // estado para exibição de componentes sobrepostos à tela principal (inserir ou editar registros, etc.).
  const [hemoderivados, sethemoderivados] = useState(0);
  const [printhemoderivados, setprinthemoderivados] = useState(0);
  const [printtermohemoderivados, setprinttermohemoderivados] = useState(0);
  // listas da tela prontuário.
  const [listevolucoes, setlistevolucoes] = useState([]);
  const [arrayevolucao, setarrayevolucao] = useState([]);

  const [listdiagnosticos, setlistdiagnosticos] = useState([]);
  const [arraydiagnosticos, setarraydiagnosticos] = useState([]);

  const [listproblemas, setlistproblemas] = useState([]);
  const [arrayproblemas, setarrayproblemas] = useState([]);

  const [listpropostas, setlistpropostas] = useState([]);
  const [arraypropostas, setarraypropostas] = useState([]);

  const [listinterconsultas, setlistinterconsultas] = useState([]);
  const [arrayinterconsultas, setarrayinterconsultas] = useState([]);

  const [listlaboratorio, setlistlaboratorio] = useState([]);
  const [arraylaboratorio, setarraylaboratorio] = useState([]);

  const [listimagem, setlistimagem] = useState([]);
  const [arrayimagem, setarrayimagem] = useState([]);

  const [listbalancos, setlistbalancos] = useState([]);
  const [listitensprescricao, setlistitensprescricoes] = useState([]);

  const [listformularios, setlistformularios] = useState([]);
  const [arrayformularios, setarrayformularios] = useState([]);

  // INATIVO NO MOMENTO - estado das scrolls (evita o reposicionamento das scrolls para o topo, quando um componente é re-renderizado).
  const [scrollmenu, setscrollmenu] = useState(0) // scroll do menu principal (tela prontuário).
  const [scrolllist, setscrolllist] = useState(0) // listas da tela principal (evolução, diagnósticos, etc.).
  const [scrollprescricao, setscrollprescricao] = useState(0) // scroll da prescrição médica.
  const [scrollitem, setscrollitem] = useState(0) // scroll da lista de componentes de cada item da prescrição.
  const [scrollitemcomponent, setscrollitemcomponent] = useState(0) // scroll da lista de componentes de cada item da prescrição.

  // estados relacionados ao painel de controle (settings), responsável por gerenciar a visualização de componentes do menu e de cards na tela principal.
  // menu.
  const [viewsettings, setviewsettings] = useState(0);
  const [settings, setsettings] = useState([0, 1]);
  const [menuevolucoes, setmenuevolucoes] = useState(1);
  const [menudiagnosticos, setmenudiagnosticos] = useState(1);
  const [menuproblemas, setmenuproblemas] = useState(1);
  const [menupropostas, setmenupropostas] = useState(1);
  const [menuinterconsultas, setmenuinterconsultas] = useState(1);
  const [menulaboratorio, setmenulaboratorio] = useState(1);
  const [menuimagem, setmenuimagem] = useState(1);
  const [menuprescricao, setmenuprescricao] = useState(1);
  const [menuformularios, setmenuformularios] = useState(1);
  // cards.
  const [cardstatus, setcardstatus] = useState(0);
  const [cardalertas, setcardalertas] = useState(0);
  const [cardprecaucao, setcardprecaucao] = useState(0);
  const [carddiasinternacao, setcarddiasinternacao] = useState(0);
  const [cardultimaevolucao, setcardultimaevolucao] = useState(0);
  const [cardinvasoes, setcardinvasoes] = useState(0);
  const [carddiagnosticos, setcarddiagnosticos] = useState(0);
  const [cardlesoes, setcardlesoes] = useState(0);
  const [cardhistoricoatb, setcardhistoricoatb] = useState(0);
  const [cardhistoricoatendimentos, setcardhistoricoatendimentos] = useState(0);
  const [cardanamnese, setcardanamnese] = useState(0);
  // color scheme.
  const [schemecolor, setschemecolor] = useState("purplescheme");
  // APT (IVCF/curva de moraes).
  const [ivcf, setivcf] = useState(0);

  var html = 'https://pulsarapp-server.herokuapp.com';
  const loadSettings = () => {
    axios.get(html + "/settings").then((response) => {
      var x = [0, 1];
      x = response.data;
      setsettings(response.data);
      // definindo as cores da aplicação.
      var paleta = x.filter(valor => valor.componente == "COLORSCHEME").map(valor => valor.view);
      setschemecolor(paleta == 1 ? 'purplescheme' : 'bluescheme');
    });
  }

  useEffect(() => {
    loadSettings();
  }, [])

  return (
    <Context.Provider
      value={{
        // identificação do usuário logado.
        idusuario, setidusuario,
        nomeusuario, setnomeusuario,
        tipousuario, settipousuario,
        especialidadeusuario, setespecialidadeusuario,
        conselhousuario, setconselhousuario,
        // identificação do atendimento (hospital, unidade de atendimento).
        idatendimento, setidatendimento,
        idhospital, setidhospital,
        nomehospital, setnomehospital,
        idunidade, setidunidade,
        tipounidade, settipounidade,
        nomeunidade, setnomeunidade,
        box, setbox,
        // identificação do paciente.
        idpaciente, setidpaciente,
        nomepaciente, setnomepaciente,
        dn, setdn,
        peso, setpeso,
        // datepicker (data).
        pickdate1, setpickdate1,
        pickdate2, setpickdate2,
        // componente ativo do prontuário.
        stateprontuario, setstateprontuario,
        // estados para exibição de telas sobrepostas.
        hemoderivados, sethemoderivados,
        printhemoderivados, setprinthemoderivados,
        printtermohemoderivados, setprinttermohemoderivados,
        // listas do prontuário.
        listevolucoes, setlistevolucoes,
        arrayevolucao, setarrayevolucao,
        listdiagnosticos, setlistdiagnosticos,
        arraydiagnosticos, setarraydiagnosticos,
        listproblemas, setlistproblemas,
        arrayproblemas, setarrayproblemas,
        listpropostas, setlistpropostas,
        arraypropostas, setarraypropostas,
        listinterconsultas, setlistinterconsultas,
        arrayinterconsultas, setarrayinterconsultas,
        listlaboratorio, setlistlaboratorio,
        arraylaboratorio, setarraylaboratorio,
        listimagem, setlistimagem,
        arrayimagem, setarrayimagem,
        listitensprescricao, setlistitensprescricoes,
        listbalancos, setlistbalancos,
        listformularios, setlistformularios,
        arrayformularios, setarrayformularios,
        // estados das scrolls (INATIVO).
        scrollmenu, setscrollmenu,
        scrolllist, setscrolllist,
        scrollprescricao, setscrollprescricao,
        scrollitem, setscrollitem,
        scrollitemcomponent, setscrollitemcomponent,
        // settings (visualização de botões do menu principal e de cards da tela principal).
        viewsettings, setviewsettings,
        settings, setsettings,
        // menu principal.
        menuevolucoes, setmenuevolucoes,
        menudiagnosticos, setmenudiagnosticos,
        menuproblemas, setmenuproblemas,
        menupropostas, setmenupropostas,
        menuinterconsultas, setmenuinterconsultas,
        menulaboratorio, setmenulaboratorio,
        menuimagem, setmenuimagem,
        menuprescricao, setmenuprescricao,
        menuformularios, setmenuformularios,
        // cards da tela principal.
        cardstatus, setcardstatus,
        cardalertas, setcardalertas,
        cardprecaucao, setcardprecaucao,
        carddiasinternacao, setcarddiasinternacao,
        cardultimaevolucao, setcardultimaevolucao,
        cardinvasoes, setcardinvasoes,
        carddiagnosticos, setcarddiagnosticos,
        cardlesoes, setcardlesoes,
        cardhistoricoatb, setcardhistoricoatb,
        cardhistoricoatendimentos, setcardhistoricoatendimentos,
        cardanamnese, setcardanamnese,
        // color scheme.
        schemecolor, setschemecolor,
        // APT ivcf / curva de moraes.
        ivcf, setivcf,
      }}
    >
      <div className={schemecolor}>
        <Router>
          <IddleTimeOut translate="no"></IddleTimeOut>
        </Router>
      </div>
    </Context.Provider>
  )
}

export default App
