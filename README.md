# Bite Studio — três direções

Aplicação Next.js 15, React 19 e TypeScript. Comparativo em `/`, propostas completas em `/versao/1` (Impacto), `/versao/2` (Presença) e `/versao/3` (Instinto). Formulário compartilhado em `/briefing`, com pré-seleção de serviço, revisão e validação.

## Desenvolvimento

Node.js 24 e npm 11 foram usados na validação.

```sh
npm ci
npm run dev
```

Produção: `npm run build` e `npm run start`. Verificação de tipos: `npm run typecheck`. Compatível com o preset Next.js da Vercel. Nenhum segredo é necessário para explorar as versões ou preencher o formulário. O envio devolve erro explícito 503 enquanto a integração não estiver configurada.

## Google Sheets privado

1. No Google Cloud, habilite Google Sheets API e crie uma conta de serviço com uma chave privada. Guarde a chave somente nas configurações seguras do servidor/Vercel, nunca no repositório.
2. Crie uma planilha privada e uma aba chamada `Briefings`. Compartilhe como editora apenas com o e-mail da conta de serviço e com a equipe autorizada.
3. Copie `.env.example` para `.env.local` e configure `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL` e `GOOGLE_PRIVATE_KEY`. Na Vercel, configure essas variáveis no painel, sem prefixo `NEXT_PUBLIC_`. A chave aceita quebras de linha reais ou sequências `\n`.
4. Opcionalmente preencha a primeira linha, de A até T: ID; Data UTC; Nome; E-mail; WhatsApp; Marca; Site; Segmento; Porte; Tempo; Descrição; Público; Serviços; Desafio; Objetivo; Agência; Orçamento; Início; Observações; Consentimento. (São 20 colunas, A:T.)
5. Reinicie o servidor. Envie um briefing de teste e confirme uma única linha privada na planilha. Repita a mesma requisição com o mesmo ID: ela não deve gerar outra linha.

A API assina um JWT no servidor, obtém token OAuth e grava usando `RAW` para impedir interpretação dos textos como fórmulas. Não retorna detalhes de autenticação nem dados privados ao navegador. O sucesso só aparece após resposta positiva da planilha. Falhas de credenciais e gravação produzem mensagem de erro, sem sucesso simulado.

Proteções: validação no servidor, limite de tamanho, honeypot, tempo mínimo, verificação de origem, limite de envios por e-mail na instância, ID de idempotência consultado na planilha e fila local. A fila e o limite em memória são por instância: para alto volume e múltiplas instâncias, adicionar rate limit e trava/idempotência em armazenamento compartilhado, além de CAPTCHA. A leitura da coluna de IDs é adequada a volume inicial, não a bases grandes.

Notificações por e-mail não estão ativadas. Como opção gratuita, um Apps Script privado com gatilho de tempo pode ler linhas não notificadas e usar `MailApp.sendEmail` para `bitestudio.bs@gmail.com`, registrando a notificação em coluna adicional. Gatilhos `onEdit` não são acionados por gravação via API. Essa automação depende de autorização da proprietária e cotas do Google.

## Conteúdo e publicação

Os símbolos SVG foram redesenhados a partir do brandbook fornecido; revisar sua fidelidade com os arquivos vetoriais oficiais antes da publicação final. As fontes livres Unbounded e DM Sans são hospedadas pelo próprio site, sem requisições externas. Os projetos exibidos são estudos ilustrativos, sem clientes ou métricas inventadas. Os textos de privacidade/termos são uma base para revisão da responsável, incluindo retenção e identificação do controlador antes da publicação comercial.

As três versões usam o mesmo conteúdo e fluxo de conversão. Não há analytics, cookies publicitários ou envio automático de dados durante o preenchimento. Respostas permanecem apenas na memória da página até o envio. Alterne versões pela faixa superior, que é um controle de comparação e pode ser removida ao escolher a direção definitiva.
