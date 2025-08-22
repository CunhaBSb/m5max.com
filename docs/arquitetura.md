## 🧱 **Arquitetura de Pastas do Projeto (Explicada para Leigos)**

m5max/
├── public/                          # Arquivos públicos visíveis por qualquer navegador
│   └── assets/                      # Logotipos, favicon, imagens estáticas
│
├── src/                             # Onde fica todo o código do site
│   ├── assets/                      # Imagens e vídeos usados dentro dos componentes
│
│   ├── components/                  # Componentes reutilizáveis em todo o site
│   │   ├── ui/                      # Botões, campos, ícones — os "blocos" básicos
│   │   └── layout/                  # Cabeçalho, rodapé, containers — a estrutura visual
│
│   ├── features/                    # Cada público/segmento tem sua área separada
│   │   ├── b2b/                     # Conteúdo para empresas (eventos grandes)
│   │   │   ├── pages/               # Páginas do segmento B2B
│   │   │   └── components/          # Componentes exclusivos do B2B
│   │   ├── cha/                     # Conteúdo para chá revelação
│   │   │   ├── pages/
│   │   │   └── components/
│   │   └── kits/                    # Conteúdo para kits DIY
│   │       ├── pages/
│   │       └── components/
│
│   ├── forms/                       # Formulários com validação e regras inteligentes
│
│   ├── hooks/                       # Funções do React que ajudam a reaproveitar lógica
│
│   ├── layouts/                     # Modelos de página com estrutura fixa (ex: menu fixo)
│
│   ├── lib/                         # Integrações com ferramentas externas (GA4, WhatsApp, etc.)
│
│   ├── router/                      # Arquivo que define as rotas (endereços) do site
│
│   ├── styles/                      # Arquivos de estilo geral, como TailwindCSS
│
│   ├── types/                       # Tipos de dados usados no projeto (ex: Lead, Evento)
│
│   ├── utils/                       # Funções auxiliares como formatar datas, textos, etc.
│
│   ├── App.tsx                      # Componente principal que une tudo
│   ├── main.tsx                     # Ponto de entrada do React
│   └── index.css                    # Ativa TailwindCSS (estilo base do site)
│
├── tailwind.config.js              # Configuração do Tailwind (cores, fontes, etc.)
├── postcss.config.js               # Configuração para processar CSS
├── tsconfig.json                   # Configuração do TypeScript
├── vite.config.ts                  # Configuração do Vite (build, dev server)
└── README.md                       # Documento explicando o projeto (inicial)

---

### 📁 **public/**

📌 Onde ficam arquivos públicos, como logotipo, ícones e imagens visíveis antes do carregamento do site.

> Ex: Favicon do navegador, imagens abertas por link.

---

### 📁 **src/**

📌 Pasta principal onde todo o **código do site** é organizado.

---

#### 📁 **assets/**

📌 Imagens, vídeos e ícones **internos** usados no site.

> Ex: Fotos de fogos, vídeos promocionais, ícones usados nos botões.

---

#### 📁 **components/**

📌 **Peças reutilizáveis** do site.

> Ex: Botões, Modal de orçamento, cabeçalho (menu), rodapé, cards.

---

#### 📁 **features/**

📌 Áreas separadas por **tipo de cliente**:

* `b2b/` → empresas, prefeituras
* `cha/` → chá revelação
* `kits/` → kits para festas pequenas

> Dentro de cada pasta ficam páginas e componentes específicos daquele público.

---

#### 📁 **forms/**

📌 Formulários do site (como orçamento, compra de kit, etc.) com regras de validação.

> Ex: Verifica se a pessoa preencheu a cidade ou escolheu um orçamento.

---

#### 📁 **hooks/**

📌 Funções inteligentes do React que **reaproveitam comportamentos**.

> Ex: Detectar rolagem da página ou clique em botão.

---

#### 📁 **layouts/**

📌 **Modelos de página**: definem a estrutura que se repete (menu + conteúdo + rodapé).

> Ex: Todas as páginas B2B usam o mesmo layout.

---

#### 📁 **lib/**

📌 Integrações e **conexões com sistemas externos**.

> Ex: Enviar dados para o Google Analytics, WhatsApp ou Meta Pixel.

---

#### 📁 **pages/**

📌 Onde estão as páginas reais do site.

> Ex: `Home.tsx`, `Contato.tsx`, `Sobre.tsx`.

---

#### 📁 **router/**

📌 Define as **rotas de navegação** do site.

> Ex: Quando alguém vai para `/kits`, o site sabe qual conteúdo mostrar.

---

#### 📁 **styles/**

📌 Arquivos de estilo geral (cores, fontes, etc.), incluindo o TailwindCSS.

> Ex: O que define se os botões são azuis ou o fundo é branco.

---

#### 📁 **types/**

📌 Tipos de dados usados no projeto para garantir que o código funcione corretamente.

> Ex: Definir como é um "Lead", o que tem num "Kit", etc.

---

#### 📁 **utils/**

📌 **Funções auxiliares** para coisas do dia a dia.

> Ex: Converter uma data para o formato brasileiro, formatar telefone, etc.

---

#### 📄 **App.tsx**

📌 O “esqueleto” principal da aplicação — conecta todas as partes.

---

#### 📄 **main.tsx**

📌 Onde o React começa a rodar o site.

---

#### 📄 **index.css**

📌 Arquivo que ativa o TailwindCSS — responsável por todos os estilos básicos.

---

### Arquivos de configuração do projeto

* **tailwind.config.js** → configurações do Tailwind (cores, temas, etc.)
* **tsconfig.json** → configurações do TypeScript
* **vite.config.ts** → configurações do Vite (a ferramenta que roda o projeto)
* **README.md** → instruções gerais do projeto

