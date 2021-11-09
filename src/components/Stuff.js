// PAINEL DE CONTROLE (MAR/21)
export function Stuff() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingTop: 7.5, paddingBottom: 7.5,
      }}>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'INTERNAÇÕES NO DIA: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {10}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'ALTAS PROGRAMADAS: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {12}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'CIRURGIAS REALIZADAS: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {22}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'NÚMERO DE COLABORADORES NECESSÁRIOS: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {350}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'ÓBITOS NO DIA: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {1}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'INFECÇÕES REGISTRADAS: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {3}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'PACIENTES COM RISCO DE SEPSE: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {2}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'TICKET MÉDIO DE TEMPO DE INTERNAÇÃO: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {'3 DIAS'}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'INTERNAÇÕES ORIUNDAS DA URGÊNCIA: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {5}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'REINTERNAÇÕES NAS ÚLTIMAS 24H: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {'2'}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'MÉDIA DE OCUPAÇÃO: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {'60/100'}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'TOTAL DE LEITOS: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {'100'}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'LEITOS OCUPADOS: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {60}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'LEITOS VAGOS:'}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {40}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'LEITOS EM LIMPEZA:'}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {2}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'LEITOS INTERDITADOS:'}
        </div>
        <div style={{ flexDirection: 'column', color: '#yellow' }}>
          {0}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'LEITOS EM MANUTENÇÃO:'}
        </div>
        <div style={{ flexDirection: 'column', color: '#yellow' }}>
          {0}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'LEITOS DESATIVADOS:'}
        </div>
        <div style={{ flexDirection: 'column', color: '#yellow' }}>
          {0}
        </div>
      </button>
    </div>
  );
}