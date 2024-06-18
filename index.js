require("dotenv").config();
const grpc = require("@grpc/grpc-js");
const grpcLoader = require("@grpc/proto-loader");
const path = require("path");
const { databaseConnector } = require("./conf/db.conf");
const {
  addFavoriteService,
  deleteFavoriteService,
  retrieveFavoriteByUserService,
  deleteAllFavoriteService,
  retrieveAllFavoriteService,
} = require("./service/favorite.service");

const protoPath = path.join(__dirname, "./favorite.proto");

//=== Load credentials
// const HOST = process.env.HOST;
const PORT = process.env.PORT;

databaseConnector();

//=== define protoLoader object
const loaderOption = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

//=== Create playlist package definition
const FavoritePackageDefinition = grpcLoader.loadSync(protoPath, loaderOption);

//=== Create grpc Object
const definition = grpc.loadPackageDefinition(FavoritePackageDefinition);

//=== Create grpc listen SERVER
const grpcServer = new grpc.Server();

//=== Playlist Service
grpcServer.addService(definition.FavoriteService.service, {
  AddFavorite: addFavoriteService,
  DeleteFavorite: deleteFavoriteService,
  RetrieveFavoriteByUser: retrieveFavoriteByUserService,
  DeleteAllFavorite: deleteAllFavoriteService,
  RetrieveAllFavorite: retrieveAllFavoriteService,
});

//=== Binding Port for grpc server
function callback(Error, __) {
  Error && console.log(Error.message);
  console.log(`GRPC server is being start at : 0.0.0.0:${PORT}`);
}

grpcServer.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  callback
);
