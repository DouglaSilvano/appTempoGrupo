const apiKey = "15d0861f03fe73e8b5e57faf34767def";
let lugar = document.getElementById("abc").value;

async function pegarClima() {
    lugar = document.getElementById("abc").value;
    
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${lugar}&appid=${apiKey}&units=metric&lang=pt_br`);
    const data = await res.json();
    
    document.getElementById("temp").innerText = data.main.temp + "°C";
    document.getElementById("desc").innerText = data.weather[0].description;
    document.getElementById("nomeCidade").innerText = "Cidade: " + data.name;

   
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    
    let imgIcon = document.getElementById("clima-icone-principal");
    if (!imgIcon) {
        imgIcon = document.createElement("img");
        imgIcon.id = "clima-icone-principal";
        document.getElementById("quadradoMaior").appendChild(imgIcon); // Adiciona ao quadrado vermelho
    }
    imgIcon.src = iconUrl;
    
}


async function puxaClima_porHora(){
    lugar = document.getElementById("abc").value;
    let texto = "";
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${lugar}&appid=${apiKey}&units=metric&lang=pt_br`);
    const data = await res.json();

    const horarios = ["15:00:00"];

    const filtro = data.list.filter(item => {
        const hora = item.dt_txt.split(" ")[1];
        return horarios.includes(hora);
    });

    filtro.forEach(item => {
        const hora = item.dt_txt.split(" ")[1].slice(0,5);
        const icone = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icone}@4x.png`;
        
        texto += `
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                <img src="${iconUrl}" alt="ícone" style="width: 40px;">
                <span>${hora} - ${item.main.temp}°C - ${item.weather[0].description}</span>
            </div>`;
    });
    
    document.getElementById("gamer").innerHTML = texto;

}

pegarClima();
puxaClima_porHora();
