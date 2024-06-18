const { FavoriteModel } = require("../schema");

module.exports = {
  addFavoriteService: async function (Request, Response) {
    const requestPayload = Request?.request;

    if (!Boolean(requestPayload?.user_id && requestPayload?.podcast_id)) {
      return Response(null, {
        error: true,
        message: "Missed required fields.",
        status: 4,
      });
    }

    const findFavorite = await FavoriteModel.findOne({
      $and: [
        { userId: { $eq: requestPayload?.user_id } },
        { podcastId: { $eq: requestPayload?.podcast_id } },
      ],
    });

    if (Boolean(findFavorite)) {
      Response(null, {
        error: false,
        message: "This podcast is already added to favorite.",
        status: 0,
      });
      return;
    }

    await FavoriteModel.create({
      userId: requestPayload?.user_id,
      podcastId: requestPayload?.podcast_id,
    });

    Response(null, {
      error: false,
      message: "This podcast is added to favorite.",
      status: 1,
    });

    return;
  },
  deleteFavoriteService: async function (Request, Response) {
    if (!Boolean(Request?.request?.favorite_id)) {
      return Response(null, {
        error: true,
        status: 4,
        message: "Missed required field.",
      });
    }

    const findFavorite = await FavoriteModel.findOne({
      _id: Request?.request?.favorite_id,
    });

    if (!Boolean(findFavorite)) {
      Response(null, {
        error: false,
        message: "There is no this podcast yet.",
        status: 2,
      });
      return;
    }

    await FavoriteModel.deleteOne({ _id: Request?.request?.favorite_id });

    Response(null, {
      error: false,
      message: "This podcast is deleted from favorite.",
      status: 1,
    });

    return;
  },
  retrieveFavoriteByUserService: async function (Request, Response) {
    const requestPayload = Request?.request;

    if (!Boolean(requestPayload?.user_id)) {
      return Response(null, {
        error: true,
        message: "Missed required filed.",
        status: 4,
      });
    }

    const data = (
      await FavoriteModel.find({
        $and: [{ userId: { $eq: requestPayload?.user_id } }],
      })
    ).map((x) => ({
      favorite_id: x._id,
      user_id: x.userId,
      podcast_id: x.podcastId,
      created_at: x.createdAt.toISOString(),
      updated_at: x.updatedAt.toISOString(),
    }));

    Response(null, {
      error: false,
      message: "retrieve favorite podcast Ok",
      status: 1,
      data,
    });

    return;
  },
  deleteAllFavoriteService: async function (__, Response) {
    
    await FavoriteModel.deleteMany({});

    Response(null, {
      error: false,
      message: "All favorites deleted.",
      status: 1,
    });

    return;
  },
  retrieveAllFavoriteService: async function (__, Response) {
    const data = (await FavoriteModel.find({})).map((x) => ({
      favorite_id: x._id,
      user_id: x.userId,
      podcast_id: x.podcastId,
      created_at: x.createdAt.toISOString(),
      updated_at: x.updatedAt.toISOString(),
    }));

    Response(null, {
      error: false,
      message: "Request Accept",
      status: 1,
      data: data,
    });

    return;
  },
};
