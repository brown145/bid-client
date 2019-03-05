const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio-client');
const io = require('socket.io-client');
const auth = require('@feathersjs/authentication-client');
const bidServer = require('../utility/bidServer');

const socket = io(bidServer.uri);
const client = feathers();

// Set up Socket.io client with the socket
client.configure(socketio(socket));
client.configure(auth());

export const login = client.authenticate;
export const logout = client.logout;

const userService = client.service('users');
const roomService = client.service('rooms');
const issueService = client.service('issues');
const bidService = client.service('bids');

export const users = {
  all: () => userService.find(),
  byRoom: ({ roomId }) => userService.find({ query: { roomId }}),
  joinRoom: ({ user, roomId }) => {
    return userService.patch('currentUser', { roomId })
  },
  on: {
    remove: (handler) => {
      userService.on('removed', handler);
      return () => userService.removeListener('removed', handler);
    },
    update: (handler) => {
      userService.on('patched', handler);
      return () => userService.removeListener('patched', handler);
    },
    leaveRoom: (handler) => {
      userService.on('leaveRoom', handler);
      return () => userService.removeListener('leaveRoom', handler);
    },
    joinRoom: (handler) => {
      userService.on('joinRoom', handler);
      return () => userService.removeListener('joinRoom', handler);
    }
  }
}

export const rooms = {
  byName: ({ name }) => roomService.find({ query: { name }}),
  create: ({ name }) => roomService.create({ name })
}

export const issues = {
  all: () => issueService.find(),
  byRoom: ({ roomId }) => issueService.find({ query: { roomId }}),
  create: ({ name }) => issueService.create({ name }),
  update: ({ id, status }) => issueService.patch(id, { status }),
  remove: ({ id }) => issueService.remove(id),
  on: {
    create: (handler) => {
      issueService.on('created', handler);
      return () => issueService.removeListener('created', handler);
    },
    update: (handler) => {
      issueService.on('patched', handler);
      return () => issueService.removeListener('patched', handler);
    },
    remove: (handler) => {
      issueService.on('removed', handler);
      return () => issueService.removeListener('removed', handler);
    }
  }
}

export const bids = {
  all: () => bidService.find(),
  byIssue: ({ issueId }) => bidService.find({ query: { issueId } }),
  create: ({ issueId, value }) => bidService.create({ issueId, value }),
  on: {
    createForIssue: ({ handler, issueId }) => bidService.on('created', handler, { query: { issueId }})
  }
}

export default {
  bids,
  issues,
  login,
  logout,
  rooms,
  users
}
