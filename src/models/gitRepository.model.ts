import { Document, Schema, model } from 'mongoose'

export interface GitRepository extends Document {
  provider: string
  gitHost: string
  gitUser: string
}

const GitRepositorySchema = new Schema<GitRepository>(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
    },
    provider: {
      type: String,
      required: [true, "can't be blank"],
    },
    gitHost: { type: String, default: null },
    gitUser: { type: String, default: null },
    branch: { type: String, required: [true, "can't be blank"] },
    repositoryData: {
      url: String,
      repo: String,
    },
    atomic: { type: Boolean, default: false },
    atomic_project_id: { type: Number, default: null },
    autoDeploy: { type: Boolean, default: false },
    deployScript: { type: String, default: null },
  },
  {
    timestamps: false,
  }
)

model<GitRepository>('GitRepository', GitRepositorySchema)
