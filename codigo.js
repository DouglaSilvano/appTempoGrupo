// A "chave do portão" pra usar a API do OpenWeather
const apiKey = "15d0861f03fe73e8b5e57faf34767def";
let lugar = document.getElementById("abc").value;

// 1. Puxa o clima atual pro telão esquerdo
async function pegarClima() {
    lugar = document.getElementById("abc").value;
    
    // Bate na API pra pegar o clima de agora
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${lugar}&appid=${apiKey}&units=metric&lang=pt_br`);
    const data = await res.json(); 

    // Pega o ID do ícone e monta o link da img em alta resolução (@4x)
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    // Joga os dados na tela (nome, temp arredondada e descrição)
    document.getElementById("nome").innerText = data.name;
    document.getElementById("temp").innerText = Math.round(data.main.temp) + "°C";
    document.getElementById("desc").innerText = data.weather[0].description;
    
    // Joga a imagem do ícone lá e coloca um texto alternativo caso dê ruim
    document.getElementById("icon").src = iconUrl;
    document.getElementById("icon").alt = data.weather[0].description;
    document.getElementById("icon").style.display = "block";
}

// O combo: chama as funções principais de uma vez
function dupla(){
    pegarClima();
    puxaClima_porHora();
}

// 2. Autocompletar: a barra de pesquisa inteligente
async function busca_nome() {
    const termoInput = document.getElementById("abc");
    const listaContainer = document.getElementById("sugestoes");
    const termo = termoInput.value;

    // Só começa a buscar se tiver 3 ou mais letras (pra não bugar a API)
    if (termo.length < 3) {
        listaContainer.innerHTML = "";
        return;
    }

    // Bate na API de geolocalização pra achar as cidades
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${termo}&limit=5&appid=${apiKey}`;

    try {
        const res = await fetch(url);
        const cidades = await res.json();
        listaContainer.innerHTML = ""; // Limpa a lista antiga

        // Pra cada cidade que achar, cria um bloquinho na lista
        cidades.forEach(cidade => {
            const item = document.createElement("div");
            item.className = "sugestao-item"; 

            // Monta o nome bonitinho (Cidade, Estado - País)
            item.innerText = `${cidade.name}${cidade.state ? `, ${cidade.state}` : ""} - ${cidade.country}`;

            // Se o cara clicar na cidade...
            item.onclick = () => {
                termoInput.value = `${cidade.name},${cidade.country}`; // Joga pro input
                listaContainer.innerHTML = ""; // Some com as sugestões
                dupla(); // Atualiza tudo na hora
            };

            listaContainer.appendChild(item); // Gruda o item na tela
        });
    } catch (erro) {
        console.error("Deu ruim ao buscar as cidades!!!", erro);
    }
}

// 3. Bate na API pra prever o futuro
async function puxaClima_porHora(){
    lugar = document.getElementById("abc").value;
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${lugar}&appid=${apiKey}&units=metric&lang=pt_br`);
    const data = await res.json();

    // Manda a bola pras duas funções que desenham a tela
    mostrarCardsFuturo(data);
    mostrarHoje(data);
}

// 4. Monta os Cards do futuro (Dias)
function mostrarCardsFuturo(data) {
    let texto = ""; 
    const horarios = ["15:00:00"]; // Filtro: só quero a tarde

    // Peneira a lista e guarda só as 15h
    const filtro = data.list.filter(item => {
        const hora = item.dt_txt.split(" ")[1];
        return horarios.includes(hora);
    });

    filtro.forEach(item => {
        const hora = item.dt_txt.split(" ")[1].slice(0,5);
        
        // Converte a data da API pra BR (ex: qua, 08/04)
        const dataObj = new Date(item.dt_txt);
        const diaSemana = dataObj.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''); 
        const diaMes = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        
        const icone = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icone}@4x.png`;
        
        // Injeta os dados nas classes do CSS
        texto += `
            <div class="card-previsao">
                <div class="card-previsao-esquerda">
                    <img src="${iconUrl}" alt="ícone" class="card-icone">
                    <div class="card-textos">
                        <span class="card-data">${diaSemana}, ${diaMes}</span>
                        <span class="card-hora">${hora}</span>
                    </div>
                </div>
        
                <div class="card-previsao-direita">
                    <span class="card-temp">${item.main.temp.toFixed(0)}°C</span>
                    <span class="card-desc">${item.weather[0].description}</span>
                </div>
            </div>`;
    });
    
    // Cospe tudo lá na div gamer
    document.getElementById("gamer").innerHTML = texto;
}

// 5. Monta as divzinhas azuis de horário 
function mostrarHoje(a){
    const container = document.getElementById("horarios");
    container.innerHTML = ""; // Limpa antes de injetar novos

    // A API já manda mastigado. Passa a faca e pega só os 5 próximos blocos.
    const limit = a.list.slice(0, 5);

    limit.forEach(item => {
        // Pulo do gato mestre: dt * 1000 pra milissegundos
        const dataLocal = new Date(item.dt * 1000); 
        
        // Pega a hora formatada bonitinha pro fuso local
        const hora = dataLocal.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });

        const temp = item.main.temp;
        const desc = item.weather[0].description;
        const icon = item.weather[0].icon;

        // Cria a div e aplica a classe CSS pra ficar estiloso
        const div = document.createElement("div");
        div.className = "bloco-horario";

        div.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png">
            <p class="bloco-desc">${desc}</p>
            <p class="bloco-temp">${Math.round(temp)}°C</p>
            <p class="bloco-hora">${hora}</p>
        `;

        container.appendChild(div); // Gruda a div nova na tela
    });
}

// Start inicial: roda o combo assim que a página abre
dupla();