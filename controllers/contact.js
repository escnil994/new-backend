const {send, ContactForMe, contactToYou} = require("../utils/utils");


const contactToMe = async (request, response) => {

    const  {name, email, message } = request.body


    try{

        send(
            email,
            "Thanks for your message!!!",
            contactToYou(request.body)
        );
        send(
            "escnil994@nilson-escobar.com",
            "Someone wants get You",
            ContactForMe(request.body)
        );


        return response.status(200).json({
            ok: true,
            msg: 'Email has been sent',
            info: request.name
        })



    }
    catch (e) {
        console.log(e)
        return response.json({
            ok: false,
            msg: 'Error'
        })

    }





}

module.exports = {
    contactToMe
}