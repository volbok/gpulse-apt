/* eslint eqeqeq: "off" */
import React, { useState, useEffect } from 'react';

function Toast({ valortoast, cor, mensagem }) {
  const [viewtoast, setviewtoast] = useState(0);
  useEffect(() => {
    setviewtoast(valortoast);
  }, [valortoast])

  if (viewtoast === 1) {
    return (
      <div
        className="toast"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: 0,
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          height: '100%',
          width: '100%',
          marginTop: 0,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0,
          zIndex: 9,
        }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent'
          }}>
          <div
            className="secondary"
            style={{
              alignItems: 'center',
              textAlign: 'center',
              backgroundColor: cor,
              padding: 25,
              minHeight: 50,
              maxHeight: 300,
              minWidth: 100,
              maxWidth: 300,
              color: '#ffffff',
              fontWeight: 'bold',
            }}>
            {mensagem}
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default Toast;
