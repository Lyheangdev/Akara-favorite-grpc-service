const schema = require("mongoose");
const uuid = require("node-uuid");

const favoriteSchema = new schema.Schema(
  {
    _id: {
      type: String,
      default: function getUUID() {
        return uuid.v1();
      },
    },
    podcastId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
  }
);

//--- modify on updatedAt field

favoriteSchema.pre("updateOne", function (next) {
  this.updatedAt = Date.now();
  next();
});

const FavoriteModel = schema.model("FavoriteModel", favoriteSchema);

exports.FavoriteModel = FavoriteModel;
