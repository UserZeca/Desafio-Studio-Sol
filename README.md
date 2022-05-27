# Studio Sol - [🚀Desafio]

##### *Recomenda-se para uma maior compreensão, visualizar esse arquivo em algum visualizador de arquivos markdown. Extenções do Visual Studio Code como a Markdown Preview Github Styling (Link no final do arquivo) permitem isso.

## Maior número romano em uma palavra
### Desafio

De forma sucinta o desafio proposto era o seguinte: Joaquim necessita identificar dentro de uma frase/palavra qualquer (String) os caracteres alfanuméricos de A a Z que representam números romanos válidos e dentre eles localizar o de maior valor.

`Ex.: Na palavra "IXFCCCYSFDMMMFG" há 4 números romanos: IX(9), CCC(300), D(500) e MMM(3000), portanto, o objetivo de Joaquim seria expor que o número romano MMM, de valor 3000 no sistema númerico decimal, é o maior número.`

### Critérios

Dado o desafio, havia alguns critérios:

- O problema deveria ser resolvido por meio de uma API Web
- A API deveria ser construída seguindo os padrões REST ou GraphQL
- A API deveria ter somente uma rota de método POST que retornaria o maior número romano (number) e seu valor correspondente em decimal (value)
- A Saída da API GraphQL deveria seguir o modelo abaixo:
  
```gql
mutation {
   search("AXXBLX") {
     number
     value
   }
 }
```

### Solução

#### Tecnologias utilizadas

Para solucionar o problema aqui, mesmo sendo mais acostumado a trabalhar com o Modelo REST, me sentir desafiado a fazer diferente, portanto, optei por utilizar o modelo de API ```GraphQL```. A linguagem em que construi a API foi Javascript atráves do Node.js, estruturando todo o servidor com o apoio da biblioteca `apollo-server`.


#### Algoritmo

Antes de iniciar a solução principal do problema pesquisei sobre o funcionamento das regras de construção de um número romano, vale destacar que, como as entradas alfanúmericas vão de A até Z, o maior número romano possível é 3999, pois a partir desse número os caracteres romanos fogem desse escopo possuindo caracteres com elementos sobreescritos (travessão por cima dos caracteres). Um outro ponto **muito importante** são as `regras de soma e subtação na formação de números romanos`.

##### Regras de soma e subtração

Os caracteres romanos possuem alguma regras em sua formação dependendo de como são arrajados os caracteres, por exemplo, o número "XI" equivale a 11, isso porque a operação de conversão para decimal é feita por 10 + 1, ou seja, 11, entretanto, se trocarmos o "I" de lugar com o "X" ficando, portanto, "IX" o valor do número em decimal passa a ser 10 - 1, ou seja, 9. O motivo disso deve-se ao fato de que, quando um caracter maior for colocado na frente de um menor, a operação inverte (vai de soma para subtração), levando o caracter **unitário** de maior prioridade a ser subtraído pelo de menor (quanto maior o valor, maior a prioridade). 

- A `regra para soma` é bem simples, se houver uma sequência em que a ordem de prioridade é decrescente ou se mantém a mesma, a operação que deverá ser feita é a soma. Ex.: "XX", "MD", "XV", "CL", e etc. Só há um especificidade:
  - Somas de caracteres iguais em sequência se limita a 3. Ex.: "XXX"(30) existe como um número só, já "XXXX" seria interpretado como errado ou dividido em dois números "XXX" (30) e "X"(10).
  
- A `regra para subtração` possui algum pontos específicos:
  - Os símbolos M e D admitem somente subtração do valor do símbolo C;
  - Os símbolos C e L admitem somente subtração do valor do símbolo X;
  - Os símbolos X e V admitem somente subtração do valor do símbolo I

A "receita de bolo" utilizada aqui foi a seguinte:
- criar um conjunto de dados (Objeto) que possa conter os números romanos unitários, o valor em decimal de cada e para facilitar um identificador de ordem de prioridade(quanto maior o valor decimal maior a prioridade) para futuras comparações em operações com números romanos (adição e subtração)
- receber a palavra/frase(string),
- identificar dentro da string quais caracteres fazer parte do sistema númerico romano ("I", "V", "X", "L", "C", "D" e "M"),
- separar os números romanos possíveis atráves das regras de soma e subtração de números romanos
- obter o valor em decimal de cada um
- obter o maior número romano e o correspondente em decimal dele
- Retorna a resposta para a rota da API

#### Estrutura do projeto

A estrutura do projeto é dividida em 4 arquivos que estão dentro da pasta `src`, são eles:

- `./server.js` => Possui a estrutura do servidor, com referência aos resolvers e os typeDefs (schema graphql)
- `./resolvers` => Possui a estrutura da construção da mutation `search`, similiar a uma rota no modelo REST
- `./typeDefs` => Possui as estruturas dos tipos de dados de entrada e saída, ou seja, configura que tipo de dados entra na API e que tipos de dados pode ser retornado
- `./script` => Possui as funções e estruturas que combinadas geram a resposta para a API

<hr/>

#### Código

- ##### Estrutura de Dados
  Para implementar o algoritmo, criei uma estrutura de dados (Objeto) chamada `romanValue` e esta auxilia na aplicação das regras de Soma e Subtração dos Números Romanos. Essa estrutura possui todos os caracteres de valor unitário do sistema númerico romano, o seu correspodente decimal e um campo de ordem de prioridade.

  ```js
    let romanValue = [
    {
        character: "I",
        value: 1,
        order: 1
    
    },
    ...

    }
  ```

<hr/>

- ##### Funções

  Com intuito de facilitar a resolução e o entendimento, quebrei o problema em várias partes e as transformei em funções:

  - `findRomanCharacter` => Verifica se determinado caracter é um caracter presente no sistema númerico romano, retorna verdadeiro caso se confirme a verificação se não retorna falso;
  - `searchRomanCharacterValue` => Procura pelo valor decimal do caracter passado (com base no valor decimal de cada caracter unitário, presente no Objeto "romanValue" ), retorna o valor em decimal do caracter caso ele esteja presente no sistema númerico romano, caso contrário retorna indefinido.
  - `searchRomanCharacterObject` => Procura pelo objeto que represente o caracter passado (com auxilio da estrutura "romanValue"), caso o caracter esteja presente no sitema númerico romano, retorna o objeto que contém as informações daquele caracter(valor em decimal, valor em romano, e a ordem de prioridade), caso contrário retorna nulo.
  - `applyRoles` => Recebe dois caracteres e o valor decimal da soma da cadeia de número romanos até ali (ex.: Tenho um string "XXI" mas estou analisando a parte "XI" logo minha soma até ali é 20 e os caracteres passados para função são "X" e "I"). A função aplica praticamente todas as regras de soma e subtração de números romanos (não aplica a regra de limite de números romanos somados);
  - `convertFromRomanToDecimal` => Recebe a string a ser convertida para decimal, percorre toda string verificado quais são os caracteres romanos existentes, aplica as regras necessárias de soma e subtração(nessa função é aplicado a regra),e salva os números romanos em uma lista ("decimalValueList") e seus correspondentes e seus correspondentes em decimal em outra ("romanValueList). Se a string passada conter algum caracter romano, retorna um objeto contendo uma lista com valores decimais (values) e o valores em números romanos, caso contrário retorna uma lista vazia.
  - `maxRomanNumber` => Função principal, recebe a string passada pela chamada da API, converte os possíveis números romanos presentes na string para números decimais, atráves da função "convertFromRomanToDecimal", recebendo, portanto,  um objeto com os números decimais e romanos, procura pelo maior número na lista de números decimais, e por fim, para achar seu correspondente na lista de números romanos obtém-se também o index do maior número na lista de números decimais, já que como são correspondentes, o valor, por exemplo, no index 0 da lista de números decimais será correspondente ao valor no mesmo index da list de números romanos.


<hr/>

### Como executar o programa

Primeiro deve-se verificar se o `Node.js` está instalado, caso não esteja segue o link abaixo para a instalação:

[Download Node js](https://nodejs.org/en/download/)

Com o Node instalado, abra o terminal(cmd) e rode o comando abaixo no diretório raíz do projeto para instalar as dependências e bibliotecas:

```bash
  npm install 
```

Para rodar o projeto execute o comando baixo:

```bash
  npm run start 
```

Por fim abra seu navegador e digite o endereço mostrado por mensagem em seu terminal(cmd), algo como `http://localhost:4000/`. Observação: A porta em que o servidor está rodando pode variar então verifique com atenção no teminal qual a porta está identificada no endereço correto.

### Extenções

[GraphQL](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)

[Markdown Preview Github Styling](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-preview-github-styles) 

### Autor

@Ezequias Kluyvert de Oliveira Lemos
