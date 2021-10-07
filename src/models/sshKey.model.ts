var mongoose = require('mongoose')

var SSHKeySchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "can't be blank"],
    },
    name: { type: String, required: [true, "can't be blank"] },
    publicKey: { type: String, required: [true, "can't be blank"] },
  },
  {
    timestamps: true,
  }
)

mongoose.model('SSHKey', SSHKeySchema)
