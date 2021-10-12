/* eslint eqeqeq: "off" */
import React, { useState, useEffect } from 'react';

function APT1() {
  const [viewapt1, setviewapt1] = useState(0);
  useEffect(() => {

  }, [viewapt1])

  if (viewapt1 === 1) {
    return (
      <div className="menucontainer">
        <div
          className="secondary"
          style={{
            alignItems: 'center',
            textAlign: 'center',
            padding: 25,
            minHeight: 50,
            maxHeight: 300,
            minWidth: 100,
            maxWidth: 300,
            color: '#1f7a8c',
            fontWeight: 'bold',
          }}>
          {mensagem}
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <button
            className="red-button"
            onClick={() => viewtoast(0)}
            style={{
              marginTop: 35,
            }}
          >
            CANCELAR
          </button>
          <button
            className="green-button"
            onClick={() => codigo}
            style={{
              marginTop: 35,
              marginRight: 0,
            }}
          >
            CONFIRMAR
          </button>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default APT1;
