// import Cookie from 'js-cookie';

const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio-client');
const io = require('socket.io-client');
const auth = require('@feathersjs/authentication-client');

const socket = io('http://localhost:3030');
const client = feathers();

// Set up Socket.io client with the socket
client.configure(socketio(socket));
client.configure(auth());

export const login = client.authenticate;

const userService = client.service('users');
const issueService = client.service('issues');
const bidService = client.service('bids');

export const issues = {
  all: () => issueService.find(),
  create: ({ name }) => issueService.create({ name }),
  update: ({ id, status }) => issueService.patch(id, { status }),
  remove: ({ id }) => issueService.remove(id),
  on: {
    create: (handler) => issueService.on('created', handler),
    update: (handler) => issueService.on('patched', handler),
    remove: (handler) => issueService.on('removed', handler)
  }
}

export const users = {
  all: () => userService.find(),
  on: {
    create: (handler) => userService.on('created', handler)
  }
}

export const bids = {
  all: () => bidService.find(),
  byIssue: ({ issueId }) => bidService.find({ query: { issueId } }),
  create: ({ issueId, value }) => bidService.create({ issueId, value }),
  on: {
    create: (handler) => bidService.on('created', handler)
  }
}

export default {
  bids,
  issues,
  login,
  users
}
