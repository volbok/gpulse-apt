/* eslint eqeqeq: "off" */
import React, { useContext } from 'react'
import logo from '../images/newlogo.svg';
import logoff from '../images/power.svg'
import back from '../images/back.svg'
import foto from '../images/3x4.jpg'
import { Link } from 'react-router-dom'
import Context from '../Context'

function Header({ link, titulo }) {
  // estados globais.
  // recuperando estados globais.
  const {
    nomeusuario,
  } = useContext(Context)

  // renderização do componente.
  return (
    <div
      id="HEADER"
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '18vh',
        backgroundColor: 'grey',
        boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.3)',
      }}
    >
      <img
        alt=""
        id="logo"
        src={logo}
        style={{
          display: link !== "/prontuario" && window.innerWidth > 400 ? 'flex' : 'none',
          margin: 5, marginLeft: 10,
          padding: 10,
          height: 0.15 * window.innerHeight,
          borderRadius: 50,
        }}
      ></img>
      <img
        alt=""
        id="logo"
        src={foto}
        style={{
          display: link === "/prontuario" ? 'flex' : 'none',
          margin: 0,
          marginLeft: 5,
          marginRight: 5,
          padding: 0,
          borderRadius: 5,
          height: 0.15 * window.innerHeight,
        }}
      ></img>
      <div
        className="title1"
        style={{
          alignSelf: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: '#ffffff',
          width: '100%',
          padding: 5,
        }}
      >
        {titulo}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'right',
          margin: 10
        }}
      >
        <div
          className="title2"
          // style={{position: 'absolute', top: 10, right: 10, fontSize: 14}}
          style={{
            justifyContent: 'flex-end', marginRight: 0,
            height: window.innerWidth > 400 ? 30 : 20,
            maxHeight: window.innerWidth > 400 ? 20 : 30,
            verticalAlign: 'center',
            width: window.innerWidth > 400 ? 200 : 100,
            color: '#ffffff', textAlign: 'right',
          }}
        >
          {'OLÁ, ' + JSON.stringify(nomeusuario).substring(2, JSON.stringify(nomeusuario).length - 2).split(" ").slice(0, 1)}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          }}
        >
          <Link
            to={link}
            className="blue-button"
            title="VOLTAR."
            style={{
              width: 50,
              height: 50,
              margin: 2.5,
              padding: 20,
            }}
          >
            <img
              alt=""
              src={back}
              style={{
                margin: 5,
                height: 25,
                width: 25,
              }}
            ></img>
          </Link>
          <Link
            to="/gpulse-web"
            className="blue-button"
            title="FAZER LOGOFF."
            style={{
              display: 'flex',
              width: 50,
              height: 50,
              margin: 2.5,
              padding: 20,
            }}
          >
            <img
              alt=""
              src={logoff}
              style={{
                margin: 5,
                height: 25,
                width: 25,
              }}
            ></img>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Header
