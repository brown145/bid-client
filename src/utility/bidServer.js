export const uri = (process.env.NODE_ENV === 'production') ?
  'http://ec2-54-244-27-45.us-west-2.compute.amazonaws.com:3333' :
  'http://localhost:3333';

export default { uri };
