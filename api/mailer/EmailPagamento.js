
let pack = []

const pacotes = {
    Vinyasa: ["https://pag.ae/7YugqoVM5", "/qrCodes/vinyasaQR.jpeg"],
    HathaYoga: ["https://pag.ae/7Yugq7B2J", "/qrCodes/hathaQR.jpeg"],
    YogaLunar: ["https://pag.ae/7YugpFJ-r", "/qrCodes/lunarQR.jpeg"],
    HathaLunar: ["https://pag.ae/7YugqT_b6", "/qrCodes/hathaLunarQR.jpeg"],
    HataVinyasa: ["https://pag.ae/7YugusPKn", "/qrCodes/hathaVinyasaQR.jpeg"],
    VinyasaLunar: ["https://pag.ae/7Yugu2Q13", "/qrCodes/vinyasaLunarQR.jpeg"],
    Todas: ["", "../qrCodes/todosQR.jpeg"],
    Personal: ["https://pag.ae/7YugpFJ-r", "/qrCodes/vinyasaQR.jpeg"]
}

const attachments = (pacote) => {
    Object.keys(pacotes).map( i => {
        if (i === pacote) {
            pack.push(...pacotes[i])
        }
    })
    return [{
        filename: pacote+"QR.jpeg",
        path: __dirname+pack[1],
        cid: 'qrcode'
    }]
    
} 

const emailPayment = (nome, pacote, token) => {
    Object.keys(pacotes).map( i => {
        if (i === pacote) {
            pack.push(...pacotes[i])
        }
    })
    return `<p>Olá ${nome}, será um prazer compartilhar essa jornada contigo! <br/><br/>Segue abaixo o QRCODE para pagamento da mensalidade via PIX. Caso queira pagar no cartão, acesse o seguinte link: <a href="${pack[0]}">${pack[0]}</a> <br/><br/><a href="${'http://localhost:3000/confirmacao/'+token}">Clique aqui para confirmar seu e-mail.</a> <br/><br/></p>Jaya ${String.fromCodePoint(0x1f64f)} <br/><br/>
    <img src="cid:qrcode" style="width:300px;height:300px;"/>`
}

const emailPassRecover = (nome, token) => {
    return `<p> Olá ${nome}, aqui está o link para recuperar sua senha: <br/><br/> <a href=${'http://localhost:3000/novasenha/'+token}> Clique aqui</a></p>`
}

module.exports = {emailPayment, attachments, emailPassRecover}