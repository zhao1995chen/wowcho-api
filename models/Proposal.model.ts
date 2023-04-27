import { Schema, model } from 'mongoose'
import { IProposal } from '../interfaces/Proposal.interface'

const ProposalSchema = new Schema<IProposal>(
  {
    title: String,
    ownerId: String,
    category: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6],
    },
    image: String,
    video: String,
    summary: String,
    description: String,
    targetPrice: Number,
    startTime: Number,
    endTime:  Number,
    ageLimit: Number,
    customizedUrl: String,
    planIdList: [String],
    contentsId: String,
    messageIdList:  [String],
    faqIdList: [String],
    promiseId: [{
      type: Schema.Types.ObjectId,
      ref: 'promise'
    }],
    placardIdList:  [String],
    liveId:  String,
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const Proposal = model<IProposal>('proposal', ProposalSchema)

export {
  Proposal,
  ProposalSchema
}
