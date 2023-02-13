import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    query: { id },
    body,
    session: { user },
  } = req;
  const message = await client.chatMessage.create({
    data: {
      message: body.message,
      user: {
        connect: {
          id: user?.id,
        },
      },
      chatroom: {
        connect: {
          id: Number(id),
        },
      },
    },
  });
  res.status(200).json({
    ok: true,
    // message,
  });
};

export default withApiSession(withHandler({ methods: ["POST"], handler }));
