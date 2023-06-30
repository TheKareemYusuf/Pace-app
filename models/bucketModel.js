const mongoose = require("mongoose");

const BucketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  subject: {
    type: String,
    required: true,
  },
  batchNumber: {
    type: Number,
    default: 1,
  },
  questionsAnswered: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Question"
      },
    ],
    default: [],
  },
});

BucketSchema.pre("save", function(next) {
  const doc = this;
  const maxBatchSize = 20;

  Bucket.findOne(
    { userId: doc.userId, subject: doc.subject },
    null,
    { sort: { batchNumber: -1 }, limit: 1 },
    function(err, bucket) {
      if (err) {
        return next(err);
      }

      if (bucket) {
        if (bucket.batchNumber < maxBatchSize) {
          doc.batchNumber = bucket.batchNumber + 1;
        } else {
          const newBucket = new Bucket({
            userId: doc.userId,
            subject: doc.subject,
            batchNumber: bucket.batchNumber + 1
          });
          newBucket.save(function(err) {
            if (err) {
              return next(err);
            }
          });
        }
      } else {
        doc.batchNumber = 1;
      }
      next();
    }
  );
});


const Bucket = mongoose.model("Bucket", BucketSchema);

module.exports = Bucket;
