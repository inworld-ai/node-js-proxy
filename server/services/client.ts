

class ClientService {

  private _service;

  constructor({
    service
  }) {
    this._service = service
  }

  // async _getEmailTokensByTokenId(tokenId) {
  //   const tokens = await new Promise((resolve, reject) => {
  //     this._emailTokenModel
  //       .query(tokenId)
  //       .exec((err, result) => {
  //         if (err) return reject(err);
  //         resolve(result.Items);
  //       });
  //   });
  //   return tokens.map((token) => EmailTokenModel.toJSON(token));
  // }

}

export default ClientService
