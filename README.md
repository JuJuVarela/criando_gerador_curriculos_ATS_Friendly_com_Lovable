# VagaMatch AI: 

**Endereço publicado:** (https://vagamatch-ai-app.lovable.app)

**Prints:** 1. tela de entrada · 2. resultado do exemplo com score e palavras-chave ausentes · 3. currículo gerado com destaques em lilás · 4. arquivo .docx aberto no Word

---

## 1. Problema que o app resolve

Muita gente envia o mesmo currículo para vagas diferentes. Sistemas ATS (Applicant Tracking Systems) filtram candidatos pela presença de palavras-chave da vaga, e um currículo genérico costuma ficar de fora antes de um recrutador ler. Ajustar tudo à mão, vaga por vaga, leva tempo e é fácil perder termos importantes.

O VagaMatch AI faz essa comparação em segundos. Mostra a aderência entre o currículo e a vaga, aponta as palavras-chave que faltam e gera uma versão de coluna única, pronta para sistemas ATS. Não exige login, e o currículo fica salvo no navegador.

## 2. O prompt original e o que mudou até a versão final

**Prompt original.** Foi um briefing completo para um app React com ShadCN UI e Tailwind, com paleta roxa, textos em português do Brasil, acesso livre sem login, leitura de currículo em .pdf, .txt ou .md, motor de análise "100% no frontend" e exportação por cópia, .md e impressão em PDF.

**Como o prompt chegou ao projeto.** Enviei o arquivo como anexo com a instrução "Crie um app com este prompt". O texto original não foi editado. As mudanças vieram nas mensagens seguintes, a partir da primeira versão gerada.

**O que mudou do briefing para a versão final:**

| Tema | Briefing original | Versão final |
|---|---|---|
| Entrada do currículo | Colar texto ou enviar .pdf, .txt ou .md | Inclui também **.docx**, lido no navegador |
| Formatação | Layout ATS limpo, sem regras de correção definidas | Normalização do texto e ajuste de frases para começarem com verbo de ação |
| Exportação | Copiar, baixar .md, imprimir em PDF | Inclui **download em .docx formatado** |
| Backend | "100% no frontend" | Mantido |
| Acesso | Sem login | Mantido, sem login |
| Exemplo de teste | Botão "Carregar Exemplo de Teste" | Mantido |

## 3. Como a análise funciona

1. **Entrada.** A pessoa cola o currículo ou importa um arquivo. O texto é lido no próprio navegador.
2. **Vaga.** A pessoa informa o cargo e cola a descrição completa da vaga.
3. **Palavras-chave da vaga.** O motor procura termos técnicos conhecidos, como SQL, Power BI ou Python, com peso maior. Depois pega as demais palavras, sem stopwords em português e inglês, e mantém até 24 termos. Em vagas curtas, aceita termos que aparecem uma vez.
4. **Comparação com o currículo.** Cada termo é procurado no currículo, sem diferenciar maiúsculas e acentos, e só como palavra inteira. Termos encontrados e ausentes ficam separados.
5. **Score.** A nota é a soma dos pesos encontrados sobre o total de pesos, de 0% a 100%. A classificação segue três faixas: 75% ou mais é "Alta Aderência", de 50% a 74% é "Aderência Moderada" e abaixo de 50% é "Precisa de Ajustes".
6. **Checklist ATS.** Verifica verbos de ação, métricas, formatação limpa e alinhamento do título.
7. **Habilidades que você possui.** Ao marcar uma palavra ausente que é verdadeira para você, ela entra no currículo gerado.
8. **Currículo gerado.** Estrutura em coluna única: cabeçalho, resumo para o cargo, competências, experiência reescrita com verbos de ação e formação. As partes alteradas aparecem em lilás, e você pode editar o texto antes de exportar.
9. **Exportação.** Copiar texto, baixar .md ou .docx, ou imprimir como PDF.

**Limite honesto.** O score mede presença de palavras-chave, não qualidade da experiência. Ele mostra o que a vaga pede e o que falta escrever, e a decisão final sobre o conteúdo continua com quem envia o currículo.

## 4. Ajustes pedidos depois da primeira geração, e por quê

**Ajuste 1: formatação sem tantos retoques manuais.** Na primeira versão, o currículo gerado ainda exigia muitos ajustes à mão. O pedido foi corrigir a formatação para reduzir esse trabalho. Resultado: o texto passa por normalização, frases como "Responsável pelos relatórios" começam com verbo de ação e o item "Formatação limpa" deixou de reprovar linhas de contato separadas por "|".

**Ajuste 2: importar e baixar .docx já formatado.** Quem tem o currículo em Word precisa de um caminho direto. Colar o texto costuma perder a formatação. O pedido foi aceitar .docx na entrada e entregar .docx formatado, com espaçamento e correções básicas de português.

## 5. Exemplo de uso

1. Abrir o app e clicar em **"Carregar Exemplo de Teste"**. O currículo fictício e a vaga real são preenchidos.
2. Clicar em **"Analisar Match & Gerar Currículo ATS"**. O app mostra o score, a classificação, as palavras-chave encontradas e as ausentes.
3. Marcar as habilidades ausentes que a pessoa realmente tem. O currículo gerado atualiza na hora.
4. Revisar o texto gerado, com os trechos alterados destacados em lilás.
5. Baixar em .docx ou imprimir como PDF.

## 6. Uso Real

- O envio de um PDF real e os botões de copiar, baixar e imprimir foram testados em uso real e funcionam perfeitamente
- Algumas correções de formatação foram feitas, mas ao baixar o arquivo em .docx pode-se formatar da forma que preferir.
- Achei melhor copiar e colar o texto do currículo, pois ai podemos corrigir a tabulação antes de dar o match, porque em pdf as linhas se dividiram de forma incorreta.
