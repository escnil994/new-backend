# new-backend


const newComment = new Comment(req.body);

      const commentSaved = await newComment.save();

      if (!commentSaved) {
        return res.status(404).json({
          ok: false,
          msg: "El comentario no ha podido guardarse",
        });
      } else {
        send(
          commentSaved.email,
          "Gracias por tu commentario!!!",
          contentHTML(commentSaved)
        );
        send(
          "escnil994@nilson-escobar.com",
          "ALERTA, NUEVO COMENTARIO",
          contenido(commentSaved)
        );

        return res.status(200).json({
          ok: true,
          comment: commentSaved,
        });
      }