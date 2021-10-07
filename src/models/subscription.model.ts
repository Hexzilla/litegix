var mongoose = require('mongoose')

var SubscriptionSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "can't be blank"],
    },
    serverplan: {
      count: { type: Number, required: [true, "can't be blank"] },
      price: { type: Number, required: [true, "can't be blank"] },
    },
    backupplan: {
      count: { type: Number, required: [true, "can't be blank"] },
      price: { type: Number, required: [true, "can't be blank"] },
    },
    userbalance: { type: Number, required: [false, "can't be blank"] },
  },
  {
    timestamps: true,
  }
)

SubscriptionSchema.methods.toJSON = function () {
  return {
    id: this._id,
    userId: this.userId,
    serverplan: this.serverplan,
    backupplan: this.backupplan,
    userbalance: this.userbalance,
  }
}

mongoose.model('Subscription', SubscriptionSchema)
