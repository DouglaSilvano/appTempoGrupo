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

const hoje = new Date().toISOString().split("T")[0];

const amanhaDate = new Date();
amanhaDate.setDate(amanhaDate.getDate() + 1);
const amanha = amanhaDate.toISOString().split("T")[0];

const hojeLista = a.list.filter(item => 
    item.dt_txt.startsWith(hoje)
);

const amanhaLista = a.list.filter(item => 
    item.dt_txt.startsWith(amanha)
).slice(0, 3); 

const final = [...hojeLista, ...amanhaLista];

const limit = final.slice(0,5);

limit.forEach(item => {
        const hora = item.dt_txt.split(" ")[1].slice(0,5);
        const temp = item.main.temp;
        const desc = item.weather[0].description;
        const icon = item.weather[0].icon

        const div = document.createElement("div");

        div.innerHTML = `
            <section>
            <img class = "t" src="https://openweathermap.org/img/wn/${icon}.png">
            <p class = "interior_horarios">${desc}</p>
            <p class = "interior_horarios">${Math.round(temp)}°C</p>
            <p class = "interior_horarios">${hora}</p>
            </section>`;

            container.appendChild(div);

    });
}


pegarClima();
puxaClima_porHora();


