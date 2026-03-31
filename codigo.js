const apiKey = "15d0861f03fe73e8b5e57faf34767def";
let lugar = document.getElementById("abc").value;

async function pegarClima() {
    lugar = document.getElementById("abc").value;
    
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${lugar}&appid=${apiKey}&units=metric&lang=pt_br`);
    const data = await res.json();
    
    document.getElementById("temp").innerText = data.main.temp + "°C";
    document.getElementById("desc").innerText = data.weather[0].description;
    document.getElementById("teste").innerText = "Cidade: " + data.name;
}


async function puxaClima_porHora(){
    lugar = document.getElementById("abc").value;
    let texto = "";
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${lugar}&appid=${apiKey}&units=metric&lang=pt_br`);
    const data = await res.json();

    const horarios = ["09:00:00", "12:00:00", "15:00:00", "18:00:00", "21:00:00", "00:00:00"];

    const filtro = data.list.filter(item => {
        const hora = item.dt_txt.split(" ")[1];
        return horarios.includes(hora);
    });

    filtro.forEach(item => {
        const hora = item.dt_txt.split(" ")[1].slice(0,5);
        texto += `${hora} - ${item.dt_txt} - ${item.main.temp} + "ºC" - ${item.weather[0].description}\n`;
    });
    
    document.getElementById("gamer").innerText = texto;

}

pegarClima();
puxaClima_porHora();
