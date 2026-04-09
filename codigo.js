const apiKey = "15d0861f03fe73e8b5e57faf34767def";

// Funcao principal
async function pegarClima() {
    // Pega o que tá escrito no input
    let lugar = document.getElementById("abc").value;
    
    // Busca na API e devolve o clima do lugar
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${lugar}&appid=${apiKey}&units=metric&lang=pt_br`);
    const data = await res.json(); // Transforma em JSON
    
    // Puxa a temperatura e joga na tela com o numero arredondado
    const elTemp = document.getElementById("temp");
    if (elTemp) elTemp.innerText = Math.round(data.main.temp) + "°C";

    // Puxa o clima atual
    const elDesc = document.getElementById("desc");
    if (elDesc) elDesc.innerText = data.weather[0].description;

    // Puxa o nome da cidade
    const elNome = document.getElementById("nomeCidade");
    if (elNome) elNome.innerText = data.name;

    // Pega o código do ícone e monta a URL da imagem correspondente, depois joga na tela
    const iconCode = data.weather[0].icon;
    const imgIcon = document.getElementById("icon");
    if (imgIcon) {
        imgIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        imgIcon.style.display = "block";
    }
}

// Puxa os dados  dos horarios subsequentes
async function puxaClima_porHora(){
    let lugar = document.getElementById("abc").value;
    // Bate na API de PREVISÃO (forecast)
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${lugar}&appid=${apiKey}&units=metric&lang=pt_br`);
    const data = await res.json();

    // Manda os dados pras funções que vão desenhar a tela
    mostrarCardsFuturo(data);
    mostrarBloquinhosHorario(data);
}

// Monta os Cards dos próximos dias na direita
function mostrarCardsFuturo(data) {
    let texto = ""; 
    const horarios = ["15:00:00"]; // Filtro: horario da tarde

    // Roda a lista toda da API e separa só o que for 15h
    const filtro = data.list.filter(item => {
        const hora = item.dt_txt.split(" ")[1];
        return horarios.includes(hora);
    });

    // Pra cada item filtrado, monta um Card
    filtro.forEach(item => {
        const hora = item.dt_txt.split(" ")[1].slice(0,5);
        
        // Loucura de transformacao para dia e semana.
        const dataObj = new Date(item.dt_txt);
        const diaSemana = dataObj.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''); 
        const diaMes = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        
        const icone = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icone}@4x.png`;
        
        // Loucura de montar o texto do Card com HTML e os dados da API e são estilizados no CSS
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
    
    // Joga tudo de uma vez lá na div com ID gamer
    document.getElementById("gamer").innerHTML = texto;
}

//  Monta os bloquinhos azuis de horário (hoje e amanhã)
function mostrarBloquinhosHorario(data) {
    const container = document.getElementById("horarios");
    container.innerHTML = ""; 

    
    const hoje = new Date().toISOString().split("T")[0];
    const amanhaDate = new Date();
    amanhaDate.setDate(amanhaDate.getDate() + 1);
    const amanha = amanhaDate.toISOString().split("T")[0];

    
    const hojeLista = data.list.filter(item => item.dt_txt.startsWith(hoje));
    const amanhaLista = data.list.filter(item => item.dt_txt.startsWith(amanha)).slice(0, 3); 
    
    
    const limit = [...hojeLista, ...amanhaLista].slice(0, 5);

    
    limit.forEach(item => {
        const hora = item.dt_txt.split(" ")[1].slice(0,5);
        const temp = item.main.temp;
        const desc = item.weather[0].description;
        const icon = item.weather[0].icon;

        const div = document.createElement("div");
        div.innerHTML = `
            <section style="display: flex; flex-direction: column; background-color: #373374; width: 9rem; height: 12rem; justify-content: center; align-items: center; text-align: center; padding: 10px; border-radius: 15px; color: white;">
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" style="width: 70px;">
                <p style="font-size: 14px; text-transform: capitalize; margin-bottom: 5px;">${desc}</p>
                <p style="font-size: 20px; font-weight: bold; margin-bottom: 5px;">${Math.round(temp)}°C</p>
                <p>${hora}</p>
            </section>`;
        container.appendChild(div);
    });
}


async function busca_nome() {
    const termoInput = document.getElementById("abc");
    const listaContainer = document.getElementById("sugestoes");
    const termo = termoInput.value;

    
    if (termo.length < 3) {
        listaContainer.innerHTML = "";
        return;
    }

    
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${termo}&limit=5&appid=${apiKey}`;

    try {
        const res = await fetch(url);
        const cidades = await res.json();
        listaContainer.innerHTML = ""; 

        
        cidades.forEach(cidade => {
            const item = document.createElement("div");
            item.className = "sugestao-item"; 
            item.innerText = `${cidade.name}${cidade.state ? `, ${cidade.state}` : ""} - ${cidade.country}`;

           .
            item.onclick = () => {
                termoInput.value = `${cidade.name},${cidade.country}`; 
                listaContainer.innerHTML = ""; 
                dupla(); 
            };
            listaContainer.appendChild(item); 
        });
    } catch (erro) {
        console.error("Erro ao buscar cidades!!! deu ruim aqui:", erro);
    }
}


function dupla(){
    pegarClima();
    puxaClima_porHora();
}


dupla();