/* eslint eqeqeq: "off" */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../images/logo.png';
import Header from './Header';
import {Link} from "react-router-dom";

function Secretaria() {
  var html = 'https://pulsarapp-server.herokuapp.com';
  // var html = '//localhost:3001';

  const changeState = useDispatch();
  const viewSecretaria = useSelector((state) => state.secretaria);

  // recuperando estados atualizados.
  const loginid = useSelector((state) => state.idusuario);
  const loginnome = useSelector((state) => state.nomeusuario);
  const logintipo = useSelector((state) => state.tipo);

  // selecionando a tela de atendimentos (apenas secretária).
  const selectAtendimento = (item) => {
    changeState({
      type: 'ATENDIMENTO_ON',
      // payloads.
      payloadIdusuario: loginid,
      payloadNomeusuario: loginnome,
      payloadTipo: logintipo,
    });
  }

  // selecionando a tela de hospitais.
  const selectHospitais = (item) => {
    changeState({
      type: 'HOSPITAL_ON',
      // payloads.
      payloadIdusuario: loginid,
      payloadNomeusuario: loginnome,
      payloadTipo: logintipo,
    });
  }

  // exibindo card para gerenciamento de atendimentos.
  function Atendimentos() {
    if (logintipo === 3) {
      return (
        <div
          className="blue-button"
          style={{ height: 280, width: 280, flexDirection: 'column' }}
          onClick={() => selectAtendimento()}>
          <div className="title2" style={{ color: '#ffffff', fontSize: 18 }}>
            {'ATENDIMENTOS'}
          </div>
          <div className="title2" style={{ color: '#ffffff', fontSize: 14, width: 200, opacity: 0.6, textAlign: 'center' }}>
            {'CADASTRO E MOVIMENTAÇÃO DE PACIENTES'}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  // exibindo card para gerenciamento de escalas.
  function Hospitais() {
    if (logintipo === 3) {
      return (
        <div
          className="blue-button"
          style={{ height: 280, width: 280, flexDirection: 'column' }}
          onClick={() => selectHospitais()}>
          <div className="title2" style={{ color: '#ffffff', fontSize: 18 }}>
            {'ESCALAS'}
          </div>
          <div className="title2" style={{ display: logintipo === 'ENF' ? 'none' : 'flex', color: '#ffffff', fontSize: 14, width: 200, opacity: 0.6, textAlign: 'center' }}>
            {'GERENCIAMENTO DA ESCALA DOS PLANTONISTAS'}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  // renderização do componente.
  if (viewSecretaria === 1) {
    return (
      <div
        className="main fade-in"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          overflowX: 'hidden',
          overflowY: 'hidden',
          width: '100%',
          margin: 0,
          padding: 0,
        }}
      >
        <Header link={"/pages/"} titulo={'PAINEL DE CONTROLE DA SECRETÁRIA'}></Header>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: window.innerHeight - 155,
            maxHeight: window.innerHeight - 155,
          }}>
          <Atendimentos></Atendimentos>
          <Hospitais></Hospitais>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
export default Secretaria;
