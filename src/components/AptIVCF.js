// componente visual (não setável).
function AptIVCF() {
  return (
    <div id="IVCF" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div id="título"
        className="title4">FRAGILIDADE CLINICO-FUNCIONAL
      </div>
      <div id="fundo"
        style={{
          opacity: 1,
          position: 'relative',
          //width: '70vw',
          //height: '20vw',
          margin: 15,
          boxShadow: '0px 2px 20px 5px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#f5b041',
          borderRight: '70vw solid transparent',
          borderBottom: '15vw solid #52be80',
          display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
        }}>        
          <button className="green-button" style={{
            position: 'absolute', width: 30, height: 30, minWidth: 30, minHeight: 30,
            borderRadius: 50, top: '0vw', left: '2vw'
          }}>
            01
          </button>
          <button className="green-button" style={{
            position: 'absolute', width: 30, height: 30, minWidth: 30, minHeight: 30,
            borderRadius: 50, top: '1.1vw', left: '9vw'
          }}>
            02
          </button>
          <button className="green-button" style={{
            position: 'absolute', width: 30, height: 30, minWidth: 30, minHeight: 30,
            borderRadius: 50, top: '2.6vw', left: '16vw'
          }}>
            03
          </button>
          <button className="yellow-button" style={{
            position: 'absolute', width: 30, height: 30, minWidth: 30, minHeight: 30,
            borderRadius: 50, top: '4.1vw', left: '23vw'
          }}>
            04
          </button>
          <button className="yellow-button" style={{
            position: 'absolute', width: 30, height: 30, minWidth: 30, minHeight: 30,
            borderRadius: 50, top: '5.6vw', left: '30vw'
          }}>
            05
          </button>
          <button className="red-button" style={{
            position: 'absolute', width: 30, height: 30, minWidth: 30, minHeight: 30,
            borderRadius: 50, top: '7.1vw', left: '37vw'
          }}>
            06
          </button>
          <button className="red-button" style={{
            position: 'absolute', width: 30, height: 30, minWidth: 30, minHeight: 30,
            borderRadius: 50, top: '8.6vw', left: '44vw'
          }}>
            07
          </button>
          <button className="red-button" style={{
            position: 'absolute', width: 30, height: 30, minWidth: 30, minHeight: 30,
            borderRadius: 50, top: '10.1vw', left: '51vw'
          }}>
            08
          </button>
          <button className="red-button" style={{
            position: 'absolute', width: 30, height: 30, minWidth: 30, minHeight: 30,
            borderRadius: 50, top: '11.6vw', left: '58vw'
          }}>
            09
          </button>
          <button className="red-button" style={{
            position: 'absolute', width: 30, height: 30, minWidth: 30, minHeight: 30,
            borderRadius: 50, top: '13.1vw', left: '65vw'
          }}>
            10
          </button>
      </div>
      <div id="legenda"
        style={{
          width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
          height: 50, backgroundColor: 'linear-gradient(to right, green, yellow)',
        }}>
        <div className="title2">ENVELHECIMENTO FISIOLÓGICO (SENESCÊNCIA)</div>
        <div className="title2">ENVELHECIMENTO PATOLÓGICO (SENILIDADE)</div>
      </div>
      <div id="estratos"
        style={{
          width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center',
        }}>
        <button className="green-button" style={{ width: '30%', height: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="title2center" style={{ color: '#ffffff' }}>IDOSO ROBUSTO</div>
          <div className="title2center" style={{ color: '#ffffff' }}>AUSÊNCIA DE DECLÍNIO FUNCIONAL</div>
        </button>
        <button className="yellow-button" style={{ width: '30%', height: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="title2center" style={{ color: '#ffffff' }}>IDOSO EM RISCO DE FRAGILIZAÇÃO</div>
          <div className="title2center" style={{ color: '#ffffff' }}>DECLÍNIO FUNCIONAL IMINENTE</div>
        </button>
        <button className="red-button" style={{ width: '60%', height: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="title2center" style={{ color: '#ffffff' }}>IDOSO FRÁGIL</div>
          <div className="title2center" style={{ color: '#ffffff' }}>DECLÍNIO FUNCIONAL ESTABELECIDO</div>
        </button>
      </div>
    </div>
  )
}

export default AptIVCF;