import { GUESTS_PASSWORD, SECRET_TOKEN } from "@/config";
import db from "@/lib/client";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, secret } = req.body;

    const database = await db;

    if (!database) throw new Error("Database is not connected");

    const collection = db.collection("guests");
    const result = await collection.findOne({ name });

    if (!result) {
      res.status(200).json({
        message:
          "Você não está na lista de convidades ://, manda um zap para Yas pra ela te convidar!",
      });

      return;
    }

    if (result.isAdmin && result.password !== secret) {
      res.status(200).json({
        message:
          "Senha incorreta, você deve utilizar a senha de administrador.",
      });
      return;
    }

    if (!result.isAdmin && GUESTS_PASSWORD !== secret.toLowerCase()) {
      res
        .status(200)
        .json({ message: "iiih errou a senha secreta, tenta novamente ae!" });
      return;
    }

    const token = jwt.sign({ result }, SECRET_TOKEN);

    const cookieExpiresInSeconds = 60 * 60 * 24 * 30;

    res.status(201).json({
      token,
      cookieExpiresInSeconds,
      user: {
        name,
        status: result.status,
        _id: result._id,
        receivedInvitation: result.receivedInvitation,
      },
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
}
