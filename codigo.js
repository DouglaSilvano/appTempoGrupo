const apiKey = "15d0861f03fe73e8b5e57faf34767def";
let lugar = document.getElementById("abc").value;

async function pegarClima() {
    lugar = document.getElementById("abc").value;
    
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${lugar}&appid=${apiKey}&units=metric&lang=pt_br`);
    const data = await res.json();

    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    document.getElementById("nome").innerText = data.name;
    document.getElementById("temp").innerText = Math.round(data.main.temp) + "°C";
    document.getElementById("desc").innerText = data.weather[0].description;
    
    document.getElementById("icon").src = iconUrl;
    document.getElementById("icon").alt = data.weather[0].description;
}

function dupla(){
    pegarClima();
    puxaClima_porHora();
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

            item.onclick = () => {
                termoInput.value = `${cidade.name},${cidade.country}`;
                listaContainer.innerHTML = ""; 
                dupla(); 
            };

            listaContainer.appendChild(item); 
        });
    } catch (erro) {
        console.error("Erro ao buscar cidades!!!", erro);
    }
}

async function puxaClima_porHora(){
    lugar = document.getElementById("abc").value;
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${lugar}&appid=${apiKey}&units=metric&lang=pt_br`);
    const data = await res.json();

    mostrarHoje(data);
}

function mostrarHoje(a){
  const container = document.getElementById("horarios");
  container.innerHTML = "";

    // A API já manda a lista em ordem cronológica (a cada 3 horas).
    // Pegamos direto os 5 próximos blocos de previsão.
    const limit = a.list.slice(0, 5);

    limit.forEach(item => {
        // item.dt é o tempo em segundos. Multiplicamos por 1000 para virar milissegundos (padrão JS)
        const dataLocal = new Date(item.dt * 1000); 
        
        // Formata a hora no padrão local automaticamente (ex: "18:00")
        const hora = dataLocal.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });

        const temp = item.main.temp;
        const desc = item.weather[0].description;
        const icon = item.weather[0].icon;

        const div = document.createElement("div");

        div.innerHTML = `
        <section>
        <img class="t" src="https://openweathermap.org/img/wn/${icon}.png">
        <div class="miniDiv">
            <p class="interior_horarios" id="desc_direita">${desc}</p>
            <p class="interior_horarios" id="temp_direita">${Math.round(temp)}°C</p>
            <p class="interior_horarios">${hora}</p>
        </div>
        </section>`;

    container.appendChild(div);
    });
}


pegarClima();
puxaClima_porHora();


