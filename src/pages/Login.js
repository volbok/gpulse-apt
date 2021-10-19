/* eslint eqeqeq: "off" */
import axios from 'axios'
import React, { useState } from 'react'
import { useEffect, useContext } from 'react'
import logoinverted from '../images/newlogoinverted.svg'
import logo from '../images/newlogo.svg'
import ghap from '../images/ghap.PNG'
import Toast from '../components/Toast'
import { useHistory } from 'react-router-dom'
import Context from '../Context'

function Login() {
  var html = 'https://pulsarapp-server.herokuapp.com';
  // recuperando estados globais (Context.API).
  const {
    setstateprontuario,
    setidusuario,
    setnomeusuario,
    tipousuario,
    settipousuario,
    setespecialidadeusuario,
    setconselhousuario,
  } = useContext(Context)
  // history (react-router-dom).
  let history = useHistory()

  var usuario = null
  var senha = null

  useEffect(() => {
    // eliminando a visão de listas no prontuário (orientando ao painel principal).
    setstateprontuario(1);
    // limpando os campos de login e senha.
    setwelcome(0)
    document.getElementById('inputUsuario').value = ''
    document.getElementById('inputSenha').value = ''
  }, [])

  /* definindo o valor o tipo de usuário (recepcionista, secretária, gestor,
    plantonista ou especialista), conforme o valor lançado no "inputUsuario". */

  var timeout = null
  const setLogin = () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      usuario = document.getElementById('inputUsuario').value
      // ROTA: SELECT * FROM usuarios WHERE usuario = usuario.
      axios
        .get(html + "/login/'" + usuario.toUpperCase() + "'")
        .then((response) => {
          var x = [0, 1]
          x = response.data
          // mapeando o usuário.
          setidusuario(x.map((item) => item.id))
          setnomeusuario(x.map((item) => item.firstname))
          settipousuario(x.map((item) => item.tipo))
          setespecialidadeusuario(x.map((item) => item.especialidade))
          setconselhousuario(x.map((item) => item.conselho))
          if (x.length > 0) {
            settypeuser('OLÁ, ' + x.map((item) => item.firstname) + '.')
            setwelcome(1)
            document.getElementById('welcome').style.color = '#6163 6e'
          } else {
            settypeuser('USUÁRIO INCORRETO')
            setwelcome(1)
            document.getElementById('welcome').style.color = '#ec7063'
          }
        })
    }, 1000);
  }

  // função que retorna o valor de login ao digitarmos no campo login e busca os hospitais.
  const [welcome, setwelcome] = useState(0)
  const [typeuser, settypeuser] = useState('')
  function Welcome() {
    if (welcome === 1) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            className="title2 fade-in"
            id="welcome"
            style={{
              fontSize: 14,
              height: 50,
              padding: 10,
              marginTop: 10,
              marginBottom: 5,
            }}
          >
            {typeuser}
          </div>
          <button
            onClick={() => checkLogin()}
            className="blue-button"
            style={{ width: 100 }}
          >
            OK
          </button>
        </div>
      )
    } else {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            onClick={() => { }}
            className="title2 fade-in"
            style={{
              fontSize: 14,
              height: 50,
              padding: 10,
              marginTop: 10,
              marginBottom: 5,
              color: 'transparent',
            }}
          >
            {''}
          </div>
          <div>
            <button
              onClick={() => checkLogin()}
              className="blue-button"
              style={{ width: 100 }}
            >
              OK
            </button>
          </div>
        </div>
      )
    }
  }

  // função que busca um registro de login válido no servidor.
  const checkLogin = () => {
    usuario = document.getElementById('inputUsuario').value
    senha = document.getElementById('inputSenha').value
    var obj = {
      usuario: usuario.toUpperCase(),
      senha: senha.toUpperCase(),
    }
    // ROTA: SELECT * FROM usuarios WHERE usuario = usuario AND senha = senha.
    axios
      .post(
        html + "/login/'" + usuario + "'/'" + senha.toUpperCase() + "'",
        obj,
      )
      .then((response) => {
        var x = [0, 1]
        x = response.data
        setTimeout(() => {
          // usuário secretária.
          if (x.length > 0 && tipousuario === 3) {
            history.push('/secretaria')
            // usuário plantonista ou gestor.
          } else if (x.length > 0 && tipousuario !== 3) {
            history.push('/hospitais')
          } else {
            toast(1, '#ec7063', 'ERRO AO EFETUAR LOGIN.', 3000)
          }
        }, 1000)
      })
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
    }, time + 1000)
  }

  // renderização do componente.
  return (
    <div className="main fade-in" style={{ backgroundColor: '#f6f1e4' }}>
      <Toast valor={valor} cor={cor} mensagem={mensagem} tempo={tempo}></Toast>
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: window.innerWidth > 800 ? '50%' : '100%',
          backgroundColor: '#f2f2f2',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          alt=""
          src={logoinverted}
          style={{
            display: window.innerWidth > 800 ? 'flex' : 'none',
            height: '35%',
          }}
        ></img>
        <div
          className="title4" style={{fontSize: 26}}
        >
          gPulse
        </div>
        <div
          className={window.innerWidth < 400 ? "title5" : "title4"}
          style={{
            position: 'absolute',
            bottom: 0,
            margin: 10,
            fontSize: 12,
            zIndex: 90,
          }}
        >
          Powered By GHAP Tecnologia
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: window.innerWidth > 800 ? '50%' : '100%',
          backgroundColor: '#8f9bbc',
          borderRadius: 5,
          margin: window.innerWidth > 800 ? 10 : 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: window.innerWidth > 800 ? '0px 1px 5px 1px rgba(0, 0, 0, 0.3)' : 'none',
        }}
      >
        <img
          alt=""
          src={window.innerWidth > 800 ? ghap : logo}
          style={{
            height: '20%',
            marginTop: window.innerWidth > 800 ? 0 : 0,
            marginBottom: window.innerWidth > 800 ? 0 : 60,
          }}
        ></img>
        <div
          className="logintitle" style={{ marginTop: -40 }}
        >
          gPulse
        </div>
        <div
          style={{
            marginTop: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            backgroundColor: '#ffffff',
            padding: 20,
            boxShadow: '0px 2px 20px 5px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div>
            <input
              autoComplete="off"
              placeholder="LOGIN"
              className="input"
              type="text"
              id="inputUsuario"
              onChange={() => setLogin()}
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'LOGIN')}
              style={{
                marginTop: 10,
                marginBottom: 10,
                width: 200,
                height: 50,
              }}
            ></input>
          </div>
          <div>
            <input
              className="input"
              autoComplete="off"
              placeholder="SENHA"
              type="password"
              id="inputSenha"
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'SENHA')}
              style={{
                marginTop: 0,
                marginBottom: 0,
                width: 200,
                height: 50,
                backgroundColor: '#ffffff'
              }}
            ></input>
          </div>
          <Welcome></Welcome>
        </div>
      </div>
    </div>
  )
}
export default Login
