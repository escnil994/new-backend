const nodemailer = require('nodemailer')

function contenido(commentSaved) {
    return `
  <div style="width: auto; color: black; margin: 20px; text-align: center; font-family: Arial, Helvetica, sans-serif; font-weight: bold; background-color: rgb(196, 244, 250);">
      <h1>${commentSaved.name}</h1>
      <h4>${commentSaved.email}</h4>

      <span style="color:green;">"${commentSaved.comment}"</span>


      <br>
      <br>
      <strong>
          <a href="http://localhost:3100/api/comment/autorize-comment/${commentSaved._id}">Para aprovar comentario haga clic aqui</a>
          <br>
          <a href="http://localhost:4200/comments/autorize-comment/${commentSaved._id}">Para aprovar comentario haga clic aqui</a>

      </strong>
      
  </div>
  `;
}




function contentHTML(comment) {
    return `
  <div style="width: auto; color: black; margin: 20px; text-align: center; font-family: Arial, Helvetica, sans-serif; font-weight: bold; background-color: white;">
      <h1>${comment.name}</h1>
      <h4>Gracias por tu comentario</h4>

      <span style="color:green;">"${comment.comment}"</span>


      <br>
      <br>
      <span>Si tienes dudas, sugerencias, o necesitas contactarme, aqui te dejo algunos
          medios.</span>

      <br><br>
      <a href="${'https://wa.me/50375068027/'}" style="color: green;"><strong>Whatsapp</strong></a>
      <br><br>
      <a href="${'https://facebook.com/escnil994/'}" style="color: blue;"><strong>facebook</strong></a>

      <p> puedes encontrar mas en mi web en la pestaña
          <strong>
              <a href="https://escnil994.com/contacts">contactame</a>
          </strong></p>

      <span> Tambien puedes responder directamente a este correo</span>

      <br>
      <br><br>

      <span style="color:#002a4a; font-size: 25px;"> Att. ${'Nilson Escobar - Escnil994'}</span>
  </div>
  `;

}
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: 'escnil994@nilson-escobar.com',
        serviceClient: process.env.CLIENT_ID_MAIL,
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCt2b/aUVZQSuXb\npcgij/8t/W5EUiiPVKtbjGy1kQpd5FNYTNheC91OHmlzo9FqnCUMY1+cfmOJxkiC\nSXZ8DAZ5yPcFRuWMzHzvNP0zQ7DchBV8KEeVfRuG8Ic4bqh5fKO+GlN9JDnq4Q8g\nZoTi+PTToYeiec6kOupxafyjPNzSCJWa1R0uxxmAUq/MCpF2IWSdhKoB2nnn8XCw\nPHpmNlXNpHPFncshf2o0AjAS96V+CsUSEuUBPScVfqJl0QHOc6FWsCoOMPqn9wRM\nSOyEhDYd+r+UQzBm39lU2yMTUVnaBXBo5G6YSJxBZAN0GOPeTiYln4I9090R+e5H\nP43qBSENAgMBAAECggEABUU+3TyuXAnL6nrzVHo+wg4Bq/LnsDdgvd+bI21YaJyg\nRY2ILmBitFhqBFZOO31XXDGeYkKsptkgNUmf3MaKjbeg0YP4N+qydkK00xCKyeym\nhW3n2amCI6GiynxZrDEx+knsXQoI8szMO28QOUdTOMqYBOjMxyAoH7RsXdCIYJpS\n3QLz/aWl980mCo4yLHZh/ed0mv7BAPtJTELSlC6Emrf/v+9QTpoDu19wgp//3Nxs\nndVcAJ7TexqjuBsZNlBweSQCU8kAUrlNtE4WC7xfuthvA5bbjbr+jiWnfRtKBNwr\nqvEUGSwlEkqsryy4ZDecsJQiVv8W3TCkkIqSzQQjCwKBgQDitDk8tbpWCG/tVAd4\nqKBq82b32AYkvGx/f4bSZ0W0aQj0mW82cLC1f5zKwdyj26K7JHKtV4ZiRHZ3o0t+\nx5EvZYwjf/XMkAHeGeZvCr4PkdYF9na6JEA722xTOh36tubX/5XK9PB0pYrcTT6a\n4i9qszX6eDmslOPevy1jS4AolwKBgQDEUQorr5Pjmdf/5zL0ue7eAtW2JIAWaXq6\nJP2H/3xfWWfgKTBVAfC+RoJm1U1zudzdNMZQMI3jr0eVSSYECWYnx4vnJKQBcKy+\n6TRWtx26llgnU+Y2k440jVsaI4gjOZm/zY/1yhiqYF/jayIRB6FJ+LHeIFeSRRnJ\nMxlm/prz+wKBgQDen0aZ1IeQVqa7M0pG9ajaff1+oxedWZ9eMPhPg/SSbpbJxCbP\nGiidgxyQi4FFM7kA95DZolqoAz0mzSek7wsmtRzB+7V/1WbQGTUNlEoB9h9rKZV7\nw3+EiDw/GpI4EwZr1GPfs1qx4aKUJhK1fCo+KJB4TzmrvWZr5ecHXCwVLwKBgQCQ\nYu4xDTSfHEJiQ2AV4D6P6NPX3+aZFUEfcR9LDBwkYLRmiMS0cPXobCFykoUhjVyl\nETCeP+fLwtnKMX+VTnhk333FJgy9xmo3C3vkH0/tMLBrVGioUUQw4JpVkjaJec7b\n48tywg38GV/M+rmWft8gcZoYPf9KZCo/8aZIOxAqSwKBgQDQoVuOyf9BgglT0CCL\nr9IMJlVJ5i50sVX31W6wOC8k8ipuO0l9shmtBaHk87Mi+thvtJzZqxdGFoLS+v/q\nYkMQaFh822+E9OT373QY1wtO4ilMFaqmKc7EhDUYDK0dWrDNhMj3qg8pcutG9pDL\nUUVoHFgJl0pf9H+GXcc0jAt4vg==\n-----END PRIVATE KEY-----\n"
    },
});


function send(email, subj, cont) {
    try {
        transporter.verify();
        transporter.sendMail({
            from: 'escnil994@nilson-escobar.com',
            to: email,
            subject: subj,
            html: cont
        });
    } catch (err) {
        console.log(err);
    }

}

function isValidObjectId(id) {

    if (ObjectId.isValid(id)) {
        if ((String)(new ObjectId(id)) === id)
            return true;
        return false;
    }
    return false;
}




function passwordUpdated (data) {
    return `
  <div style="width: auto; color: black; margin: 20px; text-align: center; font-family: Arial, Helvetica, sans-serif; font-weight: bold; background-color: rgb(196, 244, 250);">
      <h1>${data.name}</h1>
      <h4>${data.email}</h4>

      <span style="color:red;">"Password, has been Updated"</span>


      <br>
      <br>
      <strong>
          <a href="http://localhost:3100/api/auth/reset-password/${data._id}">If you did not do this, please reset your password here</a>
          <br>
      </strong>
      
  </div>
  `;
}





module.exports = {
    send,
    contentHTML,
    contenido, 
    isValidObjectId, 
    passwordUpdated

}