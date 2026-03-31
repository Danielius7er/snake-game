# Snake Game

Um jogo clássico da cobra (Snake) implementado com HTML, CSS e JavaScript puro.

## 🎮 Como Jogar

- Use as **setas do teclado** ou as teclas **WASD** para controlar a direção da cobra
- Coma a comida para crescer e ganhar pontos
- Evite colidir com as paredes ou com o próprio corpo da cobra
- Pressione **Enter** ou clique em **Restart** para reiniciar o jogo após game over

## 🚀 Instalação e Execução

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado na sua máquina

### Passos

1. Clone este repositório ou navegue até a pasta do projeto:
   ```bash
   cd /workspace
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abra seu navegador e acesse:
   ```
   http://localhost:3000
   ```

## 🧪 Testes

Execute os testes com:

```bash
npm test
```

## 📁 Estrutura do Projeto

```
/workspace
├── index.html          # Página principal do jogo
├── styles.css          # Estilização do jogo
├── server.js           # Servidor HTTP simples em Node.js
├── package.json        # Configurações do projeto e scripts
├── src/
│   ├── game.js         # Lógica do jogo (regras, movimentos, colisões)
│   └── main.js         # Código que conecta a lógica à interface
└── test/
    └── game.test.js    # Testes da lógica do jogo
```

## 🛠️ Tecnologias

- **HTML5** - Estrutura da página
- **CSS3** - Estilização e layout responsivo
- **JavaScript (ES6+)** - Lógica do jogo e interatividade
- **Node.js** - Servidor HTTP nativo para servir os arquivos estáticos

## 🎯 Funcionalidades

- Controles via teclado (setas e WASD)
- Controles touch para dispositivos móveis
- Sistema de pontuação
- Detecção de colisão com paredes e corpo da cobra
- Estado do jogo (ready, playing, game over, won)
- Design responsivo

## 📄 Licença

Este projeto está licenciado sob a licença descrita no arquivo [LICENSE](LICENSE).
