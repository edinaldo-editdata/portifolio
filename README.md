# EditData Soluções Inteligentes

## Sobre

Site institucional da EditData Soluções Inteligentes, empresa especializada em:

- 🔧 **Automações Google Sheets** - Planilhas inteligentes com fórmulas avançadas e macros
- 🔌 **Integrações com APIs** - Conectando sistemas e automatizando fluxos de dados
- 📝 **Scripts Google** - Soluções personalizadas para Google Workspace
- 📊 **Tratamento de Dados** - Análise, limpeza e estruturação de dados

## Funcionalidades do Site

- ✅ Design responsivo e moderno
- ✅ Formulário de solicitação de orçamento
- ✅ Integração preparada para Coda (tabela de clientes)
- ✅ Informações de contato (WhatsApp e email)
- ✅ Seções detalhadas sobre serviços
- ✅ Otimizado para GitHub Pages

## Estrutura do Projeto

├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # JavaScript e interatividade
└── README.md           # Este arquivo

## Como Usar no GitHub Pages

1. **Faça upload dos arquivos** para seu repositório GitHub
2. **Ative o GitHub Pages**:
   - Vá em Settings > Pages
   - Selecione "Deploy from a branch"
   - Escolha "main" branch e "/ (root)"
3. **Acesse seu site** em: `https://seuusuario.github.io/nome-do-repositorio`

## Integração com Coda

O formulário está preparado para integração com Coda. Para conectar:

1. **Configure a API do Coda** em sua tabela de clientes
2. **Substitua a função `simulateFormSubmission`** no `script.js` pela integração real
3. **Adicione suas credenciais** da API do Coda

### Exemplo de integração com Coda

```javascript
async function submitToCoda(data) {
    const response = await fetch('https://coda.io/apis/v1/docs/YOUR_DOC_ID/tables/YOUR_TABLE_ID/rows', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_API_TOKEN',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rows: [{
                cells: [
                    { column: 'Nome', value: data.name },
                    { column: 'Email', value: data.email },
                    { column: 'Empresa', value: data.company },
                    { column: 'Telefone', value: data.phone },
                    { column: 'Serviço', value: data.service },
                    { column: 'Orçamento', value: data.budget },
                    { column: 'Prazo', value: data.timeline },
                    { column: 'Descrição', value: data.description },
                    { column: 'Solução Atual', value: data['current-solution'] },
                    { column: 'Data', value: data.timestamp }
                ]
            }]
        })
    });
    
    if (!response.ok) {
        throw new Error('Erro ao enviar para Coda');
    }
    
    return response.json();
}
```

## Contato

- **WhatsApp**: +55 11 98235 4531
- **Email**: <contato@editdata.com.br>

## Tecnologias Utilizadas

- HTML5 semântico
- CSS3 com Flexbox e Grid
- JavaScript ES6+
- Font Awesome (ícones)
- Google Fonts (Inter)
- Design responsivo mobile-first

## Personalização

### Cores principais

- Azul primário: `#2563eb`
- Verde destaque: `#10b981`
- Cinza texto: `#64748b`
- Fundo claro: `#f8fafc`

### Modificar informações

1. **Textos**: Edite diretamente no `index.html`
2. **Estilos**: Modifique o `styles.css`
3. **Funcionalidades**: Ajuste o `script.js`

---

**EditData Soluções Inteligentes** - Transformando dados em resultados
