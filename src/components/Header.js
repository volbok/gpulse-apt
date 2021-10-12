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
        width: '100%',
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
          display: link !== "/prontuario" ? 'flex' : 'none',
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
          color: '#ffffff',
          fontSize: window.innerWidth < 800 ? 18 : 22,
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
          style={{ fontSize: 14, color: '#ffffff', textAlign: 'right' }}
        >
          {'OLÁ, ' + nomeusuario}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
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
            to="/gpulse"
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
