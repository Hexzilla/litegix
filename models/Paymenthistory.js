var mongoose = require("mongoose")

var PaymenthistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, 
                ref: "User", 
                required: [true, "can't be blank"] },
    amount : {type: Number, required: [true, "can't be blank"]},
    type :  {type: String, required: [true, "can't be blank"]},
    date :  {type: Date, required: [true, "can't be blank"]},
    invoice :  {type: String, required: [true, "can't be blank"]},
    receipt :  {type: String, required: [true, "can't be blank"]},
  },
  {
    timestamps: true,
  }
)

PaymenthistorySchema.methods.toJSON = function(){
  return {
    id: this._id,
    userId: this.userId,
    amount: this.amount,
    type: this.type,
    date: this.date,
    invoice: this.invoice,
    receipt: this.receipt,
  };
};

mongoose.model("Paymenthistory", PaymenthistorySchema)
