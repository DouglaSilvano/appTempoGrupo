const apiKey = "15d0861f03fe73e8b5e57faf34767def";
let lugar = document.getElementById("abc").value;

async function pegarClima() {
    lugar = document.getElementById("abc").value;
    
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${lugar}&appid=${apiKey}&units=metric&lang=pt_br`);
    const data = await res.json();
    
    const elTemp = document.getElementById("temp");
    if (elTemp) {
        elTemp.innerText = data.main.temp + "°C";
    }

    const elDesc = document.getElementById("desc");
    if (elDesc) {
        elDesc.innerText = data.weather[0].description;
    }

    const elNome = document.getElementById("nomeCidade");
    if (elNome) {
        elNome.innerText = "Cidade: " +data.name;
    }

   
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
        //pegando os dias e datas
        const dataObj = new Date(item.dt_txt);
        const diaSemana = dataObj.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''); 
        const diaMes = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        const icone = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icone}@4x.png`;
        
        texto += `
            <div style="display: flex; align-items: center; justify-content: space-between; background-color: rgba(255, 255, 255, 0.2); padding: 10px 20px; margin-bottom: 15px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                
                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="${iconUrl}" alt="ícone" style="width: 80px; height: 80px;">
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 1.2rem; font-weight: bold; text-transform: capitalize;">${diaSemana}, ${diaMes}</span>
                        <span style="font-size: 1rem;">${hora}</span>
                    </div>
                </div>

                <div style="text-align: right; display: flex; flex-direction: column;">
                    <span style="font-size: 1.5rem; font-weight: bold;">${item.main.temp.toFixed(1)}°C</span>
                    <span style="font-size: 1rem; text-transform: capitalize;">${item.weather[0].description}</span>
                </div>

            </div>`;
    });
    
    document.getElementById("gamer").innerHTML = texto;

}

pegarClima();
puxaClima_porHora();
