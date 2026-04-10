const apiKey = "15d0861f03fe73e8b5e57faf34767def";
let lugar = document.getElementById("abc").value;

//  Puxa o clima atual pro telão esquerdo
async function pegarClima() {
    lugar = document.getElementById("abc").value;
    
    // Bate na API pra pegar o clima de agora
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${lugar}&appid=${apiKey}&units=metric&lang=pt_br`);
    const data = await res.json(); 

    // Pega o ID do ícone e monta o link da img em alta resolução (@4x)
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    // Bota os dados na tela (nome, temp arredondada e descrição)
    document.getElementById("nome").innerText = data.name;
    document.getElementById("temp").innerText = Math.round(data.main.temp) + "°C";
    document.getElementById("desc").innerText = data.weather[0].description;
    
    // Joga a imagem do ícone lá e coloca um texto alternativo caso de errado
    document.getElementById("icon").src = iconUrl;
    document.getElementById("icon").alt = data.weather[0].description;
    document.getElementById("icon").style.display = "block";
}

// Chama as funções principais de uma vez
function dupla(){
    pegarClima();
    puxaClima_porHora();
}

// Barra de pesquisa automatica
async function busca_nome() {
    const termoInput = document.getElementById("abc");
    const listaContainer = document.getElementById("sugestoes");
    const termo = termoInput.value;

    // So começa a buscar se tiver 3 ou mais letras, pra não lotar a tela de sugestões irrelevantes, mas mesmo assim ta enchendo, melhorar isso dps
    if (termo.length < 3) {
        listaContainer.innerHTML = "";
        return;
    }

    // Procura pra achar as cidades
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${termo}&limit=5&appid=${apiKey}`;

    try {
        const res = await fetch(url);
        const cidades = await res.json();
        listaContainer.innerHTML = ""; 

        // Pra cada cidade que achar, cria um bloquinho na lista
        cidades.forEach(cidade => {
            const item = document.createElement("div");
            item.className = "sugestao-item"; 

            // Monta o nome bonitinho (Cidade, country)
            item.innerText = `${cidade.name}${cidade.state ? `, ${cidade.state}` : ""} - ${cidade.country}`;

            // Onclick pra fazer acontecer
            item.onclick = () => {
                termoInput.value = `${cidade.name},${cidade.country}`; 
                listaContainer.innerHTML = ""; 
                dupla(); 
            };

            listaContainer.appendChild(item); 
        });
    } catch (erro) {
        console.error("Deu ruim ao buscar as cidades!!!", erro); //erro que nao é pra cair nunca
    }
}

//  Bate na API pra "prever" o futuro
async function puxaClima_porHora(){
    lugar = document.getElementById("abc").value;
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${lugar}&appid=${apiKey}&units=metric&lang=pt_br`);
    const data = await res.json();

    //  duas funções que desenham a tela
    mostrarCardsFuturo(data);
    mostrarHoje(data);
}

// Monta os Cards dos proximos dias
function mostrarCardsFuturo(data) {
    let texto = ""; 
    const horarios = ["15:00:00"];

    // filtra a lista da API pra pegar só os horários que a gente quer (15:00:00), 
    // ja que a API manda de 3 em 3 horas e não tem como escolher só um horário específico, 
    // então a gente pega só o que interessa pra mostrar um resumo do dia
    const filtro = data.list.filter(item => {
        const hora = item.dt_txt.split(" ")[1];
        return horarios.includes(hora);
    });

    filtro.forEach(item => {
        const hora = item.dt_txt.split(" ")[1].slice(0,5);
        
        // Converte a data da API pra BR (ex: sex, 10/04)
        const dataObj = new Date(item.dt_txt);
        const diaSemana = dataObj.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''); 
        const diaMes = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        
        const icone = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icone}@4x.png`;
        
        // Faz a magia acontecer com o CSS
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
    
    // Cospe tudo na div gamer
    document.getElementById("gamer").innerHTML = texto;
}

// Monta as divzinhas azuis de horário 
function mostrarHoje(a){
    const container = document.getElementById("horarios");
    container.innerHTML = "";

    // A API já manda mastigado. Corta e pega só os 5 próximos blocos.
    const limit = a.list.slice(0, 5);

    limit.forEach(item => {
        // Sacada de fazer dt * 1000 pra milissegundos
        const dataLocal = new Date(item.dt * 1000); 
        
        // Pega a hora formatada bonitinha pro fuso local
        const hora = dataLocal.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });

        const temp = item.main.temp;
        const desc = item.weather[0].description;
        const icon = item.weather[0].icon;

        // Cria a div e aplica a classe CSS pra ficar bonitin
        const div = document.createElement("div");
        div.className = "bloco-horario";

        div.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png">
            <p class="bloco-desc">${desc}</p>
            <p class="bloco-temp">${Math.round(temp)}°C</p>
            <p class="bloco-hora">${hora}</p>
        `;

        container.appendChild(div); 
    });
}

//Roda o código todo de uma vez só
dupla();