# Projeto: VagaMatch AI — Matchmaking de Empregos & Otimizador de Currículo ATS

Atue como um Engenheiro de Software Full-Stack Sênior e Product Designer especialista em React, TypeScript, Tailwind CSS e ShadCN UI. Crie uma aplicação web completa, funcional e interativa chamada **VagaMatch AI**, focada em analisar a compatibilidade entre o currículo de um candidato e a descrição de uma vaga, gerando automaticamente uma versão otimizada do currículo para sistemas ATS (Applicant Tracking Systems).

---

## 1. Design System & Identidade Visual
* **Biblioteca de Componentes:** Utilize estritamente **ShadCN UI** (Cards, Tabs, Progress, Badges, Textarea, Button, Dialog, Accordion, Separator, Toast, ScrollArea) e ícones da biblioteca **Lucide React**.
* **Paleta de Cores (Modo Claro Limpo e Moderno):**
  * **Fundo Principal (`background`):** Branco puro (`#FFFFFF`) e cinza/lilás ultra suave (`#FAF8FF`) para áreas de destaque.
  * **Superfícies / Cards:** Branco (`#FFFFFF`) com bordas sutis em lilás claro (`#E9D5FF` / `purple-200`) e sombras suaves.
  * **Cor Primária (`primary`):** Roxo vibrante e profissional (`#7C3AED` / `violet-600`), com hover em `#6D28D9` (`violet-700`).
  * **Cor Secundária / Destaque (`secondary` / `accent`):** Lilás claro (`#F3E8FF` / `purple-100`) com texto em roxo escuro (`#581C87` / `purple-900`).
  * **Tipografia:** Inter ou Plus Jakarta Sans, com excelente hierarquia visual, alto contraste (`#1E1B4B` para títulos e `#4B5563` para textos de apoio).
* **Idioma da Interface:** Todo o aplicativo, labels, placeholders, botões e feedbacks devem estar em **Português do Brasil (PT-BR)**.
* **Acesso Livre (Sem Autenticação):** O aplicativo **não deve exigir login, cadastro, autenticação ou contas de usuário** em nenhuma tela ou rota. Ao acessar a URL, qualquer pessoa entra diretamente no fluxo principal e já pode usar todas as funcionalidades imediatamente.

---

## 2. Arquitetura e Fluxo da Aplicação

Crie uma experiência de página única (SPA) dividida em etapas claras ou navegação por abas/painéis inteligentes, contendo:

### A. Cabeçalho (Navbar)
* Logo moderno com ícone de estrela/alvo em roxo + nome **VagaMatch AI**.
* Badge discreto em lilás claro: *"Otimizado para ATS"*.
* Botão de ação rápida: *"Carregar Exemplo de Teste"* (preenche automaticamente um currículo fictício e uma descrição de vaga real para que o usuário possa testar o sistema com 1 clique).

### B. Seção 1: Entrada de Dados (Input Hub)
Layout em duas colunas (responsivo para mobile) usando **ShadCN Cards**:
1. **Coluna Esquerda — Seu Currículo Base:**
   * Opção de colar o texto do currículo em um `Textarea` amplo OU fazer upload de arquivo `.pdf`, `.txt` ou `.md` (com extração/leitura imediata do texto no navegador via `pdfjs-dist` para PDFs e `FileReader API` para arquivos de texto, com fallback amigável e orientação caso o PDF seja escaneado/imagem sem camada de texto).
   * Contador de palavras e indicador de status (*"Currículo carregado"*).
2. **Coluna Direita — A Vaga Desejada:**
   * Campo `Input` para o **Título do Cargo** (ex: *Analista de Dados Pleno*).
   * Campo `Textarea` para colar a **Descrição Completa da Vaga** (requisitos, responsabilidades, diferenciais).
3. **Botão Principal (CTA):**
   * Botão largo em roxo (`#7C3AED`): **"Analisar Match & Gerar Currículo ATS"** com estado de carregamento animado (*"Extraindo palavras-chave..."*, *"Calculando aderência ATS..."*, *"Reestruturando experiências..."*).

### C. Seção 2: Dashboard de Matchmaking (Resultados da Análise)
Exibido logo após o processamento, organizado com componentes ShadCN:
1. **Score de Compatibilidade (Hero Card):**
   * Indicador visual de porcentagem (0% a 100%) usando `Progress` bar estilizada e destaque tipográfico.
   * Classificação dinâmica via `Badge` (ex: *Alta Aderência*, *Aderência Moderada*, *Precisa de Ajustes*).
   * Resumo diagnóstico curto explicando os pontos fortes e gargalos.
2. **Análise de Palavras-Chave (Grid em 2 colunas):**
   * **Palavras-Chave Encontradas (Match):** Lista de `Badges` em lilás/roxo mostrando hard skills e termos da vaga que já existem no currículo.
   * **Palavras-Chave Ausentes (Gaps):** Lista de `Badges` com borda tracejada indicando termos importantes da vaga que faltam no currículo (com opção clicável para o usuário marcar quais dessas habilidades ele realmente possui para incluí-las na geração).
3. **Checklist de Boas Práticas ATS:**
   * Verificação rápida com ícones (Ex: *Verbos de ação fortes*, *Métricas quantificáveis*, *Formatação limpa sem tabelas complexas*, *Alinhamento de título*).

### D. Seção 3: Gerador de Currículo ATS-Friendly (Editor & Preview)
Utilize o componente `Tabs` do ShadCN com duas abas principais:
1. **Aba 1: Visualização Limpa (Formato ATS):**
   * Renderiza o novo currículo reescrito e estruturado em layout de coluna única, sem gráficos, colunas múltiplas ou elementos que quebram robôs de triagem.
   * **Estrutura obrigatória do currículo gerado:**
     * Cabeçalho (Nome, Contato, LinkedIn/Portfólio).
     * **Resumo Profissional** (adaptado especificamente para o cargo alvo).
     * **Competências Técnicas / Hard Skills** (priorizando as palavras-chave da vaga).
     * **Experiência Profissional** (bullet points reescritos com foco em resultados, verbos de ação e integração natural das palavras-chave selecionadas).
     * **Formação Acadêmica & Certificações**.
   * **Destaque Visual Inteligente:** Um toggle (`Switch` do ShadCN) chamado *"Destacar otimizações feitas"*, que sublinha em lilás claro (`#F3E8FF`) os trechos e palavras-chave que foram adicionados ou aprimorados em relação ao currículo original.
2. **Aba 2: Editar & Ajustar Texto:**
   * Permite ao usuário editar diretamente o texto gerado antes de exportar.

### E. Barra de Exportação (Ações Finais)
* **Copiar Texto Limpo:** Copia o currículo formatado para a área de transferência com notificação via `Toast` (*"Currículo copiado!"*).
* **Baixar em Markdown (.md):** Gera e baixa o arquivo `.md` instantaneamente.
* **Imprimir / Salvar como PDF:** Abre a janela de impressão nativa (`window.print()`) com CSS `@media print` perfeitamente configurado (ocultando botões, menus e cores de fundo, deixando apenas o documento branco/preto impecável para salvar em PDF).

---

## 3. Lógica de Funcionamento (100% Funcional no Frontend)
* Implemente um motor inteligente em TypeScript (`src/utils/atsEngine.ts`) que:
  1. Extrai termos técnicos, ferramentas, verbos de ação e requisitos da descrição da vaga (ignorando stopwords em português).
  2. Compara com o texto do currículo original para calcular o score real de compatibilidade.
  3. Reestrutura o currículo original aplicando templates de alta conversão ATS, reorganizando a seção de habilidades e adaptando o resumo profissional com base no título da vaga e nas palavras-chave selecionadas pelo usuário.
* Inclua um utilitário dedicado (`src/utils/pdfExtractor.ts`) utilizando `pdfjs-dist` para extrair o texto de arquivos `.pdf` enviados pelo usuário diretamente no navegador, preservando quebras de linha e exibindo feedback claro durante a leitura do arquivo.
* Mantenha o estado salvo no `localStorage` para que o usuário não perca seu currículo base caso atualize a página.