import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    query: { id },
  } = req;
  const profile = await client.user.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      receivedReviews: {
        select: {
          id: true,
          createdBy: {
            select: {
              avatar: true,
              name: true,
            },
          },
          socre: true,
          review: true,
        },
      },
    },
  });
  res.status(200).json({
    ok: true,
    profile,
  });
};

export default withApiSession(withHandler({ methods: ["GET"], handler }));
