import express from 'express'
import { ProposalController } from '../controllers/Proposal.controller'

export const proposalRouter = express.Router()

proposalRouter
  .get('/', ProposalController.getList)
  .get('/details', ProposalController.get)
  .get('/cart', ProposalController.getCart)
  .get('/search', ProposalController.getSearch)
  .get('/userProposal', ProposalController.getUserProposal)
  