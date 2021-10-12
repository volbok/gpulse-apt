var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var port = process.env.PORT || 3001;
// var port = 3001;

var app = express();
app.use(cors());
app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
 });
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('/'));
app.listen(port);

// criando pool de conexões.
var pool = mysql.createPool({
  // host: 'localhost',
  // port: 3306,
  // user: 'root',
  // password: '',
  // database: 'pulsar',
  host: 'www.pulsar.app.br',
  port: 3306,
  user: 'pulsar45_admin',
  password: '0a1bc2def3',
  database: 'pulsar45_database',
});

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('CONEXÃO FECHADA.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('MUITAS CONEXÕES.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('CONEXÃO RECUSADA.');
    }
  }
  if (connection) connection.release();
  console.log('POOL CONNECTIONS CARREGADO');
  console.log(process.env.PORT);
  return;
});

// TELA LOGIN.
// rota para identificação do tipo de usuário.
app.get('/login/:usuario', (req, res) => {
  var sql = 'SELECT * FROM usuarios WHERE usuario = ' + req.params.usuario;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para login.
app.post('/login/:usuario/:senha', (req, res) => {
  var post = req.body;
  var sql =
    'SELECT * FROM usuarios WHERE usuario = ' +
    req.params.usuario +
    'AND senha = ' +
    req.params.senha;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});

// TELA HOSPITAL.
// rota para lista de hospitais aos quais o usuário tem acesso.
app.get('/hospitais/:idusuario', (req, res) => {
  var sql =
    'SELECT * FROM usuarioxhospital WHERE idusuario = ' +
    req.params.idusuario +
    ' ORDER BY hospital';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para cálculo do total de pacientes internados por hospital.
app.get('/totalpacientes/:hospital', (req, res) => {
  var sql = 'SELECT * FROM atendimentos WHERE hospital = ' +
    req.params.hospital + ' AND ativo > 0';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para cálculo do total de leitos oferecidos por hospital.
app.get('/totalleitos/:hospital', (req, res) => {
  var sql =
    'SELECT * FROM hospitaisxunidades WHERE hospital = ' +
    req.params.hospital;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para cálculo do total de leitos oferecidos por todos os hospitais.
app.get('/leitos', (req, res) => {
  var sql =
    'SELECT * FROM hospitaisxunidades';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// TELA UNIDADES.
// rota para lista de unidades às quais o usuário tem acesso.
app.get('/unidades/:idusuario/:hospital', (req, res) => {
  var sql =
    'SELECT * FROM usuarioxhospitalxunidade WHERE idusuario = ' +
    req.params.idusuario +
    ' AND hospital = ' + req.params.hospital + 'ORDER BY unidade';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para lista de pacientes internados em uma unidade.
app.get('/pacientesunidade/:hospital/:unidade', (req, res) => {
  var sql = 'SELECT * FROM atendimentos WHERE hospital = ' + req.params.hospital + ' AND unidade = ' + req.params.unidade + ' AND ativo > 0 ORDER BY box';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para cálculo do total de leitos oferecidos por unidade.
app.get('/totalleitos', (req, res) => {
  var sql =
    'SELECT * FROM hospitaisxunidades';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// BLOCO ABAIXO DEPRECATED //
// rota para cálculo do total de leitos oferecidos por unidade.
app.get('/totalleitosunidade/:hospital/:unidade', (req, res) => {
  var sql =
    'SELECT * FROM hospitaisxunidades WHERE hospital = ' +
    req.params.hospital + ' AND unidade = ' + req.params.unidade + ' ORDER BY unidade';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// TELA PACIENTES:
// rota para listagem de pacientes na unidade selecionada, estratificados por cor (INSTÁVEIS, EM ALERTA, ESTÁVEIS).
app.get('/pacientesall/:hospital/:unidade', (req, res) => {
  var sql = 'SELECT * FROM atendimentos WHERE hospital = ' + req.params.hospital +
      ' AND unidade = ' + req.params.unidade +
      ' AND ativo > 0';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para listagem de pacientes na unidade selecionada, estratificados por cor (INSTÁVEIS, EM ALERTA, ESTÁVEIS).
app.get('/pacientesred/:hospital/:unidade', (req, res) => {
  var sql = 'SELECT * FROM atendimentos WHERE hospital = ' + req.params.hospital +
      ' AND unidade = ' + req.params.unidade +
      ' AND status = 1 AND ativo > 0';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
app.get('/pacientesyellow/:hospital/:unidade', (req, res) => {
  var sql = 'SELECT * FROM atendimentos WHERE hospital = ' + req.params.hospital +
      ' AND unidade = ' + req.params.unidade +
      ' AND status = 2 AND ativo > 0';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
app.get('/pacientesgreen/:hospital/:unidade', (req, res) => {
  var sql = 'SELECT * FROM atendimentos WHERE hospital = ' + req.params.hospital +
      ' AND unidade = ' + req.params.unidade +
      ' AND status = 3 AND ativo > 0';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// TELA CORRIDA:
// COMPONENTE PRINCIPAL.
// rota para seleção do registro de atendimento.
app.get('/atendimento/:hospital/:unidade/:idatendimento', (req, res) => {
  var sql = 'SELECT * FROM atendimentos WHERE hospital = ' + req.params.hospital +
      ' AND unidade = ' + req.params.unidade +
      ' AND id = ' + req.params.idatendimento +
      ' AND ativo > 0';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para seleção do registro de invasões relacionadas ao atendimento.
app.get('/getinvasoes/:idatendimento', (req, res) => {
  var sql = 'SELECT * FROM invasoes WHERE idatendimento = ' + req.params.idatendimento;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// atualizando registro de invasões.
app.post('/updateinvasoes/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE invasoes SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// rota para seleção do registro de parâmetros ventilatórios relacionados ao atendimento.
app.get('/getvm/:idatendimento', (req, res) => {
  var sql = 'SELECT * FROM ventilacao WHERE idatendimento = ' + req.params.idatendimento;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// atualizando registro de parâmetros ventilatórios.
app.post('/updatevm/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE ventilacao SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// rota para seleção do último registro de evolução + exame físico relacionado ao atendimento.
app.get('/lastevolucao/:idatendimento', (req, res) => {
  var sql = 'SELECT * FROM evolucao WHERE idatendimento = ' + req.params.idatendimento + " AND funcao = 'MED' ORDER BY STR_TO_DATE(data, '%d/%m/%Y %H:%i:%s') DESC LIMIT 1;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para seleção do último registro de evolução + exame físico contendo valor válido para BRADEN.
app.get('/lastbraden/:idatendimento', (req, res) => {
  var sql = 'SELECT * FROM evolucao WHERE idatendimento = ' + req.params.idatendimento + " AND braden > 0 ORDER BY STR_TO_DATE(data, '%d/%m/%Y %H:%i:%s') DESC LIMIT 1;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para seleção do último registro de evolução + exame físico contendo valor válido para MORSE.
app.get('/lastmorse/:idatendimento', (req, res) => {
  var sql = 'SELECT * FROM evolucao WHERE idatendimento = ' + req.params.idatendimento + " AND morse > 0 ORDER BY STR_TO_DATE(data, '%d/%m/%Y %H:%i:%s') DESC LIMIT 1;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// rota para cálculo do bh acumulado.
app.get('/bhacumulado/:idatendimento', (req, res) => {
  var sql =
    'SELECT SUM(bh) AS bhacumulado FROM evolucao WHERE idatendimento = ' +
    req.params.idatendimento;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log(results);
  });
});
// COMPONENTE DIAGNÓSTICOS.
// rota para seleção dos registros de diagnósticos relacionados ao atendimento.
app.get('/diagnosticos', (req, res) => {
  var sql = "SELECT * FROM diagnosticos ORDER BY STR_TO_DATE(inicio, '%d/%m/%Y %H:%i:%s') DESC;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
app.post('/updatediagnostico/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE diagnosticos SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
app.post('/insertdiagnostico', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO diagnosticos SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
app.get('/deletediagnostico/:id', (req, res) => {
  var sql = 'DELETE FROM diagnosticos WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// COMPONENTE PROBLEMAS.
// rota para seleção dos registros de problemas relacionados ao atendimento (incorporação do SOAP em seu aspecto mais útil).
app.get('/problemas', (req, res) => {
  var sql = "SELECT * FROM problemas ORDER BY STR_TO_DATE(inicio, '%d/%m/%Y %H:%i:%s') DESC;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
app.post('/updateproblema/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE problemas SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
app.post('/insertproblema', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO problemas SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
app.get('/deleteproblema/:id', (req, res) => {
  var sql = 'DELETE FROM problemas WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// CID10.
app.get('/cid10', (req, res) => {
  var sql = "SELECT * FROM cid;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});


// COMPONENTE VENTILAÇÃO.
// rota para seleção dos registros de parâmetros ventilatórios relacionados ao atendimento.
app.get('/ventilacao/:idatendimento', (req, res) => {
  var sql = 'SELECT * FROM ventilacao WHERE idatendimento = ' + req.params.idatendimento + 
      " ORDER BY STR_TO_DATE(data, '%d/%m/%Y %H:%i:%s');";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// COMPONENTE EVOLUÇÃO + EXAME FÍSICO.
// rota para seleção das evoluções relacionadas ao atendimento.
app.get('/evolucoes', (req, res) => {
  var sql = "SELECT * FROM evolucao ORDER BY STR_TO_DATE(data, '%d/%m/%Y %H:%i:%s') DESC;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
app.get('/deleteevolucao/:id', (req, res) => {
  var sql = 'DELETE FROM evolucao WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
app.post('/updateevolucao/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE evolucao SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
app.post('/insertevolucao', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO evolucao SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// COMPONENTE PROPOSTAS.
// rota para seleção dos registros de propostas relacionados ao atendimento.
app.get('/propostas/:idatendimento', (req, res) => {
  var sql = 'SELECT * FROM propostas WHERE idatendimento = ' + req.params.idatendimento + 
      " ORDER BY STR_TO_DATE(inicio, '%d/%m/%Y %H:%i:%s') DESC;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
app.post('/insertprop', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO propostas SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
app.get('/deleteprop/:id', (req, res) => {
  var sql = 'DELETE FROM propostas WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
app.post('/updateprop/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE propostas SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// COMPONENTE INTERCONSULTAS.
// rota para seleção dos registros de interconsultas em geral.
app.get('/interconsultasall', (req, res) => {
  var sql = "SELECT * FROM interconsulta ORDER BY STR_TO_DATE(pedido, '%d/%m/%Y %H:%i:%s') DESC;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para seleção dos registros de interconsultas relacionados ao paciente.
app.get('/interconsultas/:idpaciente', (req, res) => {
  var sql = 'SELECT * FROM interconsulta WHERE idpaciente = ' + req.params.idpaciente + 
      " ORDER BY STR_TO_DATE(pedido, '%d/%m/%Y %H:%i:%s') DESC;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para especialidades.
app.get('/especialidades', (req, res) => {
  var sql = 'SELECT * FROM especialidades ORDER BY especialidade';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

app.post('/insertinterconsulta', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO interconsulta SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
app.get('/deleteinterconsulta/:id', (req, res) => {
  var sql = 'DELETE FROM interconsulta WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
app.post('/updateinterconsulta/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE interconsulta SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// COMPONENTE LABORATORIO.
// rota para seleção dos registros de propostas relacionados ao atendimento.
app.get('/lab/:idatendimento', (req, res) => {
  var sql = 'SELECT * FROM laboratorio WHERE idatendimento = ' + req.params.idatendimento + 
      " ORDER BY STR_TO_DATE(datapedido, '%d/%m/%Y %H:%i:%s') DESC;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
app.post('/insertlab', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO laboratorio SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
app.get('/deletelab/:id', (req, res) => {
  var sql = 'DELETE FROM laboratorio WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// lista de opções de exames laboratoriais.
app.get('/laboratorio_options', (req, res) => {
  var sql = 'SELECT * FROM laboratorio_options';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// COMPONENTE IMAGEM.
// rota para seleção dos registros de propostas relacionados ao atendimento.
app.get('/image/:idatendimento', (req, res) => {
  var sql = 'SELECT * FROM imagem WHERE idatendimento = ' + req.params.idatendimento + 
      " ORDER BY STR_TO_DATE(pedido, '%d/%m/%Y %H:%i:%s') DESC;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
app.post('/insertimage', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO imagem SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
app.get('/deleteimage/:id', (req, res) => {
  var sql = 'DELETE FROM imagem WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// lista de opções de exames de imagem.
app.get('/imagem_options', (req, res) => {
  var sql = 'SELECT * FROM imagem_options';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// COMPONENTE HEMOTRANSFUSÃO.
app.post('/hemotransfusao', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO hemotransfusao SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});

// COMPONENTE PRESCRIÇÃO.
// rota para seleção dos registros de prescrição relacionados ao atendimento.
app.get('/prescricoes/:idatendimento', (req, res) => {
  var sql = 'SELECT * FROM prescricao WHERE idatendimento = ' + req.params.idatendimento + 
      " ORDER BY STR_TO_DATE(data, '%d/%m/%Y %H:%i:%s') DESC;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para seleção de todos os itens de prescrição.
app.get('/allitensprescricao', (req, res) => {
  var sql = 'SELECT * FROM prescricao_item ORDER BY grupo ASC, farmaco ASC;';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para seleção dos registros de itens relacionados a uma prescrição.
app.get('/itensprescricao/:idprescricao', (req, res) => {
  var sql = 'SELECT * FROM prescricao_item WHERE idprescricao = ' + req.params.idprescricao + 
      " ORDER BY grupo ASC, farmaco ASC;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para seleção dos componentes relacionados a um item de prescrição.
app.get('/componentesprescricao', (req, res) => {
  var sql = 'SELECT * FROM prescricao_componentes ORDER BY componente ASC';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// # OPÇÕES DE ITENS PARA PRESCRIÇÃO E CONTROLE DE ESTOQUE # //
// rota para seleção de itens a serem inseridos na prescrição (usado também no controle do ESTOQUE).
app.get('/optionsitens', (req, res) => {
  var sql = 'SELECT * FROM options_itens ORDER BY farmaco ASC';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para atualizar opção de item/fármaco para prescrição (usado exclusivamente no controle do ESTOQUE).
app.post('/updateoptionsitens/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE options_itens SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// rota para atualizar valor de estoque de componente (usado exclusivamente no controle do ESTOQUE).
app.post('/updateoptionsitensbyfarmaco/:farmaco', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE options_itens SET ? WHERE farmaco = ' + req.params.farmaco;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});

// rota para exclusão de uma opção de item/fármaco para prescrição (usado também no controle do ESTOQUE).
app.get('/deleteoptionsitens/:id', (req, res) => {
  var sql = 'DELETE FROM options_itens WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para inserir uma opção de item/fármaco para presqcrição (usado exclusivamente no controle de ESTOQUE).
app.post('/insertoptionsitens', (req, res) => {
  var post = req.body;
  var sql = 'INSERT INTO options_itens SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});

// rota para seleção de componentes a serem inseridos na prescrição (usado também no controle do ESTOQUE).
app.get('/optionscomponentes', (req, res) => {
  var sql = 'SELECT * FROM options_componentes ORDER BY farmaco ASC';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para atualizar opção de componentes para prescrição (usado exclusivamente no controle do ESTOQUE).
app.post('/updateoptionscomponentes/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE options_componentes SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// rota para exclusão de uma opção de componente para prescrição (usado também no controle do ESTOQUE).
app.get('/deleteoptionscomponentes/:id', (req, res) => {
  var sql = 'DELETE FROM options_componentes WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para inserir uma opção de componente para prescrição (usado exclusivamente no controle de ESTOQUE).
app.post('/insertoptionscomponentes', (req, res) => {
  var post = req.body;
  var sql = 'INSERT INTO options_componentes SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// rota para inserir os registros de operações com estoque.
app.post('/insertestoquecontrole', (req, res) => {
  var post = req.body;
  var sql = 'INSERT INTO estoque_controle SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});

// atualizando uma prescrição (mudando status 0 para 1).
app.post('/updateprescricao/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE prescricao SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// inserindo registros de prescrição e seus respectivos itens e componentes.
app.post('/insertprescricao', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO prescricao SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
app.post('/insertprescricaoitem', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO prescricao_item SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
app.post('/insertprescricaocomponente', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO prescricao_componentes SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// excluindo resgistros de prescrição e seus respectivos itens e componentes.
app.get('/deleteprescricao/:id', (req, res) => {
  var sql = 'DELETE FROM prescricao WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
app.get('/deleteallitemprescricao/:id', (req, res) => {
  var sql = 'DELETE FROM prescricao_item WHERE idprescricao = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
app.get('/deleteallcomponenteprescricao/:id', (req, res) => {
  var sql = 'DELETE FROM prescricao_componentes WHERE idprescricao = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
app.get('/deleteallchecagemprescricao/:id', (req, res) => {
  var sql = 'DELETE FROM prescricao_checagem WHERE idprescricao = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// excluindo isoladamente um item ou componente de prescrição.
app.get('/deleteitemprescricao/:id', (req, res) => {
  var sql = 'DELETE FROM prescricao_item WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
app.get('/deletecomponenteprescricao/:id', (req, res) => {
  var sql = 'DELETE FROM prescricao_componentes WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// excluindo todos os componentes quando um item de prescrição é excluído.
app.get('/deleteitemcomponentesprescricao/:id', (req, res) => {
  var sql = 'DELETE FROM prescricao_componentes WHERE iditem = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// atualizando um item da prescrição.
app.post('/updateitemprescricao/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE prescricao_item SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// atualizando um componente da prescrição.
app.post('/updatecomponenteprescricao/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE prescricao_componentes SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// obtendo o último registro de prescrição criado, para receber itens copiados de outra prescrição.
app.get('/lastprescricao/:idatendimento', (req, res) => {
  var sql = 'SELECT * FROM prescricao WHERE idatendimento = ' + req.params.idatendimento + ' ORDER BY id DESC LIMIT 1';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// obtendo o último registro de item da prescrição criado, para inserir os componentes pertinentes.
app.get('/lastitem/:idprescricao', (req, res) => {
  var sql = 'SELECT * FROM prescricao_item WHERE idprescricao = ' + req.params.idprescricao + ' ORDER BY id DESC LIMIT 1';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// selecionando um item de prescrição a partir do seu id.
app.get('/getitemprescricao/:id', (req, res) => {
  var sql = 'SELECT * FROM prescricao_item WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// VISÃO DOS COMPONENTES NOS ITENS DE PRESCRIÇÃO (a partir da manipulação dos mesmos os componentes são gerados, atualizados ou excluídos, para cada aprazamento).
// carregar.
app.get('/loadcomponenteview', (req, res) => {
  var sql = 'SELECT * FROM prescricao_componentes_view ORDER BY componente';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// inserir.
app.post('/insertcomponenteview', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO prescricao_componentes_view SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// atualizar.
app.post('/updatecomponenteview/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE prescricao_componentes_view SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// excluir.
app.get('/deletecomponenteview/:id', (req, res) => {
  var sql = 'DELETE FROM prescricao_componentes_view WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// excluir visões ao excluirmos um item de prescrição.
app.get('/deleteallcomponenteview/:iditem', (req, res) => {
  var sql = 'DELETE FROM prescricao_componentes_view WHERE iditem = ' + req.params.iditem;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// excluir visões ao excluirmos uma prescrição.
app.get('/deletefullcomponenteview/:idprescricao', (req, res) => {
  var sql = 'DELETE FROM prescricao_componentes_view WHERE idprescricao = ' + req.params.idprescricao;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});


// PRESCRIÇÃO - CHECAGEM (TÉCNICOS DE ENFERMAGEM).
// rotas para seleção dos itens apresentados na tela prescrição dos técnicos de enfermagem.
app.get('/checagemprescricao/:idprescricao', (req, res) => {
  var sql = 'SELECT * FROM prescricao_checagem WHERE idprescricao = ' + req.params.idprescricao + ' ORDER BY horario ASC';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// PARA FINS DE TESTE (VERIFICANDO A IMPRESSÃO DAS PRESCRIÇÕES).
app.get('/checagemall', (req, res) => {
  var sql = "SELECT * FROM prescricao_checagem ORDER BY horario ASC";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para inserir item de prescrição checável pelo técnico de enfermagem.
app.post('/insertchecagemprescricao', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO prescricao_checagem SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// rota para exclusão dos registros de aprazamento para um determinado item de prescrição.
app.get('/deletechecagemprescricao/:iditem', (req, res) => {
  var sql = 'DELETE FROM prescricao_checagem WHERE iditem = ' + req.params.iditem;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para checagem do item de prescrição pelo técnico de enfermagem.
app.post('/updatechecagemprescricao/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE prescricao_checagem SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// PRECRIÇÃO - MODELOS DE PRESCRIÇÃO.
// rota para seleção de prescrição predefinida - ENFERMARIA.
app.get('/prescricaoenfermaria', (req, res) => {
  var sql = 'SELECT * FROM prescricao_model_enfermaria ORDER BY grupo ASC';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// selecionar prescrições ativas (assinadas) e com data de assinatura superior a 13h do dia anterior (prescrições válidas para checagem de medicações.
app.get('/prescricaoativa/:idatendimento', (req, res) => {
  var sql =
    'SELECT * FROM prescricao WHERE idatendimento = ' +
    req.params.idatendimento +
    " AND status = 1 AND STR_TO_DATE(data, '%d/%m/%Y %H:%i') >= DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL '13:00' HOUR_MINUTE)";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// BALANÇOS (INSERÇÃO DE DADOS VITAIS E BALANÇO HÍDRICO PELO TÉCNICO DE ENFERMAGEM).
// lista de balanços.
app.get('/balancos/:idatendimento', (req, res) => {
  var sql = 'SELECT * FROM balanco WHERE idatendimento = ' + req.params.idatendimento + " ORDER BY STR_TO_DATE(data, '%d/%m/%Y %H:%i:%s') DESC;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// inserindo registro de balanco.
app.post('/insertbalanco', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO balanco SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// deletando um balanço.
app.get('/deletebalanco/:id', (req, res) => {
  var sql = 'DELETE FROM balanco WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send('BALANÇO EXCLUÍDO');
  });
});
// atualizando balanco.
app.post('/updatebalanco/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE balanco SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// lista de todos os ganhos (para somas) para um atendimento.
app.get('/itensganhossoma/:idatendimento', (req, res) => {
  var sql = 'SELECT * FROM balanco_ganhos WHERE idatendimento = ' + req.params.idatendimento;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// lista de todos as perdas (para somas) para um atendimento.
app.get('/itensperdassoma/:idatendimento', (req, res) => {
  var sql = 'SELECT * FROM balanco_perdas WHERE idatendimento = ' + req.params.idatendimento;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// lista de ganhos para cada registro de balanço.
app.get('/itensganhos/:idbalanco', (req, res) => {
  var sql = 'SELECT * FROM balanco_ganhos WHERE idbalanco = ' + req.params.idbalanco;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// lista de perdas para cada registro de balanço.
app.get('/itensperdas/:idbalanco', (req, res) => {
  var sql = 'SELECT * FROM balanco_perdas WHERE idbalanco = ' + req.params.idbalanco;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// inserindo ganho.
app.post('/insertganho', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO balanco_ganhos SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// inserindo perda.
app.post('/insertperda', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO balanco_perdas SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// atualizando ganho.
app.post('/updateganho/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE balanco_ganhos SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// atualizando perda.
app.post('/updateperda/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE balanco_perdas SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// deletando um ganho.
app.get('/deleteganho/:id', (req, res) => {
  var sql = 'DELETE FROM balanco_ganhos WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send('GANHO EXCLUÍDO');
  });
});
// deletando uma perda.
app.get('/deleteperda/:id', (req, res) => {
  var sql = 'DELETE FROM balanco_perdas WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send('PERDA EXCLUÍDA');
  });
});
// deletando todos os ganhos relacionados a um balanço excluído.
app.get('/deleteallganhos/:idbalanco', (req, res) => {
  var sql = 'DELETE FROM balanco_ganhos WHERE idbalanco = ' + req.params.idbalanco;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send('GANHOS DO BALANÇO EXCLUÍDOS');
  });
});
// deletando todas as perdas relacionadas a um balanço excluído.
app.get('/deleteallperdas/:idbalanco', (req, res) => {
  var sql = 'DELETE FROM balanco_perdas WHERE idbalanco = ' + req.params.idbalanco;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send('PERDAS DO BALANÇO EXCLUÍDOS');
  });
});

// DADOS DO USUÁRIO LOGADO.
// obtendo os dados do usuário logado, para identificação das evoluções e prescrições.
app.get('/getusuario/:idusuario', (req, res) => {
  var sql = 'SELECT * FROM usuarios WHERE id = ' + req.params.idusuario;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// COMPONENTE FORMULÁRIOS.
// rota para seleção dos tipos de formulários.
app.get('/tiposformularios', (req, res) => {
  var sql = 'SELECT * FROM formularios_options';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// rota para seleção dos registros de formulários relacionados ao atendimento.
app.get('/formularios/:idpaciente', (req, res) => {
  var sql = 'SELECT * FROM formularios WHERE idpaciente = ' + req.params.idpaciente + 
      " ORDER BY STR_TO_DATE(data, '%d/%m/%Y %H:%i:%s') DESC;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
app.post('/updateformulario/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE formularios SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
app.post('/insertformulario', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO formularios SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
app.get('/deleteformulario/:id', (req, res) => {
  var sql = 'DELETE FROM formularios WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// LESÕES DE PRESSÃO (ESCARA, ÚLCERAS DE DECÚBITO).
// carregando as lesões.
app.get('/getlesoes/:idatendimento', (req, res) => {
  var sql = 'SELECT * FROM lesoes WHERE idatendimento = ' + req.params.idatendimento + 
      " AND termino = '';";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// salvando lesão.
app.post('/insertlesao', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO lesoes SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// atualizando lesão.
app.post('/updatelesao/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE lesoes SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});

// TELA ESCALA:
// lista de médicos em uma unidade.
app.get('/escaladoctors/:hospital/:unidade', (req, res) => {
  var sql =
    'SELECT * FROM usuarioxhospitalxunidade WHERE hospital = ' +
    req.params.hospital +
    ' AND unidade = ' +
    req.params.unidade +
    ' ORDER BY usuario';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log(results);
  });
});
// registros de escala para uma data selecionada.
app.get('/escaladay/:hospital/:unidade/:anterior/:atual/:proximo', (req, res) => {
  var sql =
    'SELECT * FROM escala WHERE hospital = ' + req.params.hospital + ' AND unidade = ' + req.params.unidade + ' AND inicio >= ' + req.params.anterior + ' AND inicio < ' + req.params.proximo + ' AND termino >= ' + req.params.atual + ' ORDER BY inicio';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log(results);
  });
});
// registros de escala para um mês selecionado.
app.get('/escalamonth/:hospital/:unidade/:inicio/:termino', (req, res) => {
  var sql =
    'SELECT * FROM escala WHERE hospital = ' + req.params.hospital + ' AND unidade = ' + req.params.unidade + ' AND inicio >= ' + req.params.inicio + ' AND termino <= ' + req.params.termino + ' ORDER BY inicio';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log(results);
  });
});
// inserindo registro de escala.
app.post('/insertescala', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO escala SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// deletando um registro de escala.
app.get('/deleteescala/:id', (req, res) => {
  var sql = 'DELETE FROM escala WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send('ESCALA EXCLUÍDA');
    console.log(results);
  });
});

// TELA USUÁRIOS:
// lista de todos os usuários (plantonistas) cadastrados para a empresa.
app.get('/usuarios', (req, res) => {
  var sql =
    'SELECT * FROM usuarios WHERE (tipo = 1 OR tipo = 2) ORDER BY usuario';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log(results);
  });
});
// inserindo plantonista na empresa.
app.post('/insertusuario', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO usuarios SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// deletando um plantonista na empresa.
app.get('/deleteusuario/:id', (req, res) => {
  var sql = 'DELETE FROM usuarios WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send('USUÁRIO EXCLUÍDO');
    console.log(results);
  });
});
// lista de hospitais cadastrados para um usuário (plantonista) selecionado.
app.get('/usuarioxhospital/:id', (req, res) => {
  var sql =
    'SELECT * FROM usuarioxhospital WHERE idusuario = ' + req.params.id + ' ORDER BY hospital';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log(results);
  });
});
// lista de unidades cadastradas para um usuario selecionado.
app.get('/usuarioxhospitalxunidade/:idusuario/:idhospital', (req, res) => {
  var sql =
    'SELECT * FROM usuarioxhospitalxunidade WHERE idusuario = ' + req.params.idusuario + ' AND idhospital = ' + req.params.idhospital + ' ORDER BY unidade';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log(results);
  });
});
// deletando um hospital para o plantonista selecionado.
app.get('/deletehospital/:id', (req, res) => {
  var sql = 'DELETE FROM usuarioxhospital WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send('USUÁRIO EXCLUÍDO DE UM HOSPITAL');
    console.log(results);
  });
});
// deletando todos os hospitais para o plantonista selecionado.
app.get('/deletehospitais/:idusuario', (req, res) => {
  var sql = 'DELETE FROM usuarioxhospital WHERE idusuario = ' + req.params.idusuario;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send('USUÁRIO EXCLUÍDO DE TODOS OS HOSPITAIS');
    console.log(results);
  });
});
// deletando uma unidade cadastrada para o plantonista selecionado.
app.get('/deleteunidade/:id', (req, res) => {
  var sql = 'DELETE FROM usuarioxhospitalxunidade WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send('USUÁRIO EXCLUÍDO DE UMA UNIDADE');
    console.log(results);
  });
});
// deletando todas as unidades cadastradas para o plantonista selecionado.
app.get('/deleteunidades/:idusuario', (req, res) => {
  var sql = 'DELETE FROM usuarioxhospitalxunidade WHERE idusuario = ' + req.params.idusuario;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send('USUÁRIO EXCLUÍDO DE TODAS AS UNIDADES');
    console.log(results);
  });
});
// deletando todas as unidades cadastradas para um hospital excluído.
app.get('/deleteunidadeshospital/:idusuario/:idhospital', (req, res) => {
  var sql = 'DELETE FROM usuarioxhospitalxunidade WHERE idusuario = ' + req.params.idusuario + 'AND idhospital = ' + req.params.idhospital;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send('USUÁRIO EXCLUÍDO DE TODAS AS UNIDADES');
    console.log(results);
  });
});
// lista de todos os hospitais cadastrados para a empresa.
app.get('/allhospital', (req, res) => {
  var sql =
    'SELECT * FROM hospitais ORDER BY hospital';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log(results);
  });
});
// cadastrando um novo hospital para o usuário.
app.post('/inserthospital', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO usuarioxhospital SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// checando se o novo plantonista já foi cadastrado antes.
app.get('/checkplantonista/:usuario', (req, res) => {
  var sql =
    'SELECT * FROM usuarios WHERE usuario = ' + req.params.usuario;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log(results);
  });
});
// checando se o novo hospital já foi cadastrado antes.
app.get('/checkhospital/:idusuario/:idhospital', (req, res) => {
  var sql =
    'SELECT * FROM usuarioxhospital WHERE idusuario = ' + req.params.idusuario + ' AND idhospital = ' + req.params.idhospital;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log(results);
  });
});
// checando se a nova unidade já foi cadastrada antes.
app.get('/checkunidade/:idusuario/:idhospital/:unidade', (req, res) => {
  var sql =
    'SELECT * FROM usuarioxhospitalxunidade WHERE idusuario = ' + req.params.idusuario + ' AND idhospital = ' + req.params.idhospital + ' AND unidade = ' + req.params.unidade;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log(results);
  });
});
// cadastrando uma nova unidade para o usuário.
app.post('/insertunidade', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO usuarioxhospitalxunidade SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// lista de unidades disponíveis para o hospital selecionado (exibida na tela inserir unidade).
app.get('/someunidades/:idhospital', (req, res) => {
  var sql =
    'SELECT * FROM hospitaisxunidades WHERE idhospital = ' + req.params.idhospital + ' ORDER BY unidade';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log(results);
  });
});
// atualizando plantonista na empresa.
app.post('/updateusuario/:idusuario', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE usuarios SET ? WHERE id = ' + req.params.idusuario;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});

// TELA ATENDIMENTOS.
// lista de todos os pacientes cadastrados no sistema.
app.get('/pacientes', (req, res) => {
  var sql =
    'SELECT * FROM pacientes ORDER BY nome';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// lista de hospitais para criação de um atendimento ou movimentação do paciente.
app.get('/todoshospitais', (req, res) => {
  var sql =
    'SELECT * FROM hospitais ORDER BY hospital';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// lista de unidades para criação de um atendimento ou movimentação do paciente.
app.get('/todasunidades/:idhospital', (req, res) => {
  var sql =
    'SELECT * FROM hospitaisxunidades WHERE idhospital = ' +
    req.params.idhospital;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// seleção de um registro de atendimento para identificação do hospital e da unidade onde o paciente está internado.
app.get('/atendimentoselect/:idpaciente', (req, res) => {
  var sql =
    'SELECT * FROM atendimentos WHERE idpaciente = ' + req.params.idpaciente + ' AND ativo > 0';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// seleção de um registro de atendimento para identificação do hospital e da unidade onde o paciente está internado.
app.get('/checkatendimento/:idpaciente/:hospital/:unidade', (req, res) => {
  var sql =
    'SELECT * FROM atendimentos WHERE idpaciente = ' + req.params.idpaciente + ' AND hospital = ' + req.params.hospital + ' AND unidade = ' + req.params.unidade + ' AND ativo > 0';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// seleção de todos os atendimentos ativos e não classificados (acolhimento).
app.get('/atendimentos', (req, res) => {
  var sql =
    'SELECT * FROM atendimentos ORDER BY box';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// seleção de todos os descritores/fluxos para classificação de risco (acolhimento).
app.get('/fluxo', (req, res) => {
  var sql =
    'SELECT * FROM fluxo ORDER BY cor ASC, fluxo ASC';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// seleção de todos os atendimentos ativos em uma unidade, para visualização dos box ocupados.
app.get('/todosatendimentos/:hospital/:unidade', (req, res) => {
  var sql =
    'SELECT * FROM atendimentos WHERE hospital = ' + req.params.hospital + ' AND unidade = ' + req.params.unidade + ' AND ativo > 0';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// atualizando o registro de atendimento selecionado (encerra o atendimento alterando o valor de "ativo", ou movimenta o paciente mudando hospital e/ou unidade).
app.post('/updateatendimento/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE atendimentos SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// iniciando um novo atendimento para o paciente selecionado e que não tem registro de atendimento ativo.
app.post('/insertatendimento', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO atendimentos SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// deletando registro de atendimento.
app.get('/deleteatendimento/:id', (req, res) => {
  var sql = 'DELETE FROM atendimentos WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
  });
});
// criando os registros de invasões e de ventilação mecânica para o atendimento criado.
app.post('/insertinvasoes', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO invasoes SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
app.post('/insertvm', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO ventilacao SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// salvando um registro de paciente.
app.post('/insertpaciente', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO pacientes SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// atualizando um registro de paciente.
app.post('/updatepaciente/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE pacientes SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// deletando um registro de paciente.
app.get('/deletepaciente/:id', (req, res) => {
  var sql = 'DELETE FROM pacientes WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
  });
});

// CHAMADA DE PACIENTES (PRONTO-ATENDIMENTO).
// selecionando todos os registros de chamada.
app.get('/calls', (req, res) => {
  var sql =
    'SELECT * FROM calls';
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// inserindo chamada. 
app.post('/insertcall', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO calls SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// excluindo chamada. 
app.get('/deletecall/:id', (req, res) => {
  var sql = 'DELETE FROM calls WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// TELA PASSWORD.
// rota para ATUALIZAR PASSWORD.
app.post('/updatepassword/:usuario', (req, res) => {
  var post = req.body;
  var sql = 'UPDATE login SET ? WHERE user = ' + req.params.usuario;
  pool.query(sql, post, (error) => {
    if (error) throw error;
    res.send('SENHA DO USUÁRIO ATUALIZADA');
  });
});

// ALERTAS.
// fezes - ausentes.
app.get('/fezesausentes/:idatendimento', (req, res) => {
  var sql =
    'SELECT * FROM evolucao WHERE idatendimento = ' +
    req.params.idatendimento +
    " AND fezes = 'AUSENTES' AND STR_TO_DATE(data, '%d/%m/%Y') >= CURDATE() - 3;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// fezes - normais.
app.get('/fezesnormais/:idatendimento', (req, res) => {
  var sql =
    'SELECT * FROM evolucao WHERE idatendimento = ' +
    req.params.idatendimento +
    " AND fezes = 'NORMAIS' AND STR_TO_DATE(data, '%d/%m/%Y') >= CURDATE() - 3;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// fezes - diarréia.
app.get('/fezesdiarreicas/:idatendimento', (req, res) => {
  var sql =
    'SELECT * FROM evolucao WHERE idatendimento = ' +
    req.params.idatendimento +
    " AND fezes = 'DIARRÉIA' AND STR_TO_DATE(data, '%d/%m/%Y') >= CURDATE() - 3;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// lista de antibióticos prescritos.
app.get('/atblist/:idatendimento', (req, res) => {
  var sql =
    'SELECT * FROM prescricao_item WHERE idatendimento = ' +
    req.params.idatendimento +
    " AND grupo = 'ANTIBIOTICOS' ORDER BY STR_TO_DATE(datainicio, '%d/%m/%Y %H:%i:%s');";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log(results);
  });
});

// culturas em aberto (código para culturas: 10).
app.get('/culturaspendentes/:idatendimento', (req, res) => {
  var sql =
    'SELECT * FROM laboratorio WHERE idatendimento = ' +
    req.params.idatendimento +
    " AND codigo = 10 AND dataresultado = '' ORDER BY STR_TO_DATE(datapedido, '%d/%m/%Y %H:%i:%s');";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log(results);
  });
});

// ROTAS PARA ESCALA.
// rota para listar todos os registros de escala.
app.get('/escala/:hospital/:cti', (req, res) => {
  var sql =
    'SELECT * FROM escala WHERE hospital = ' +
    req.params.hospital + ' AND cti = ' +
    req.params.cti + " ORDER BY STR_TO_DATE(data, '%Y/%m/%d');";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log(results);
  });
});

// rota para selecionar um registro de escala.
app.get('/escala/:hospital/:cti/:data', (req, res) => {
  var sql =
    'SELECT * FROM escala WHERE hospital = ' +
    req.params.hospital + ' AND cti = ' +
    req.params.cti + ' AND data = ' +
    req.params.data;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log(results);
  });
});

// rota para inserir escala.
app.post('/insertescala', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO escala SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});

// rota para atualizar escala.
app.post('/updateescala/:id', (req, res) => {
  var post = req.body;
  var sql = 'UPDATE escala SET ? WHERE id = ' + parseInt(req.params.id);
  pool.query(sql, post, (error, results) => {
    if (error) throw error;
    res.send('REGISTRO ATUALIZADO');
    console.log('REGISTRO ATUALIZADO');
  });
});

// rota para escala de plantões (SCHEDULE).
app.get('/schedule/:hospital/:cti/:data', (req, res) => {
  var sql =
    'SELECT * FROM schedule WHERE hospital = ' +
    req.params.hospital + ' AND cti = ' +
    req.params.cti + ' AND inicio >= ' +
    req.params.data;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
    console.log(results);
  });
});

// ## BLOCO CIRÚRGICO ## //
// AGENDA DO BLOCO CIRÚRGICO.
// rota para seleção dos registros de cirurgia.
app.get('/blocoagenda', (req, res) => {
  var sql = "SELECT * FROM bc_agenda ORDER BY STR_TO_DATE(datainicio, '%d/%m/%Y %H:%i:%s') DESC;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// atualizar registro de agenda cirúrgica.
app.post('/updateblocoagenda/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE bc_agenda SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// inserir registro de agenda cirúrgica.
app.post('/insertblocoagenda', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO bc_agenda SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// deletar registro de agenda cirúrgica.
app.get('/deleteblocoagenda/:id', (req, res) => {
  var sql = 'DELETE FROM bc_agenda WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// CHECKLIST BLOCO CIRÚRGICO.
// rota para seleção dos registros de checklist.
app.get('/blocochecklist', (req, res) => {
  var sql = "SELECT * FROM bc_checklist ORDER BY STR_TO_DATE(datainicio, '%d/%m/%Y %H:%i:%s') DESC;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// atualizar registro de checklist.
app.post('/updateblocochecklist/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE bc_checklist SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// inserir registro de checklist.
app.post('/insertblocochecklist', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO bc_checklist SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// deletar registro de checklist.
app.get('/deleteblocochecklist/:id', (req, res) => {
  var sql = 'DELETE FROM bc_checklist WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// EQUIPE BLOCO CIRÚRGICO.
// rota para seleção dos registros de integrantes da equipe cirúrgica.
app.get('/blocostaff', (req, res) => {
  var sql = "SELECT * FROM bc_staff ORDER BY especialidade;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// atualizar registro de integrante da equipe cirúrgica.
app.post('/updateblocostaff/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE bc_staff SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// inserir registro de integrante da equipe cirúrgica.
app.post('/insertblocostaff', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO bc_staff SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// deletar registro de integrante da equipe cirúrgica.
app.get('/deleteblocostaff/:id', (req, res) => {
  var sql = 'DELETE FROM bc_staff WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// AMBULATORIO.
// rota para seleção dos registros de consultas ambulatoriais.
app.get('/consultas', (req, res) => {
  var sql = "SELECT * FROM consultas;";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
// atualizar registro de consulta ambulatorial.
app.post('/updateconsulta/:id', (req, res) => {
  var post = req.body;
  var sql =
    'UPDATE consultas SET ? WHERE id = ' + req.params.id;
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// inserir registro de consulta ambulatorial.
app.post('/insertconsulta', (req, res) => {
  var post = req.body;
  var sql =
    'INSERT INTO consultas SET ?';
  pool.query(sql, post, (error, results) => {
    if (error) throw new Error(error);
    res.send(results);
  });
});
// deletar registro de consulta ambulatorial.
app.get('/deleteconsulta/:id', (req, res) => {
  var sql = 'DELETE FROM consultas WHERE id = ' + req.params.id;
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
