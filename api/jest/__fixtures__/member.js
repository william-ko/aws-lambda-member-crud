const newMember = {
  firstname: 'Michael',
  lastname: 'Jacobs',
  username: 'purplestarfish9283',
  email: 'm.jacobs@fake.com',
};

const invalidMemberKey = {
  wrongkey: 'Michael',
  lastname: 'Jacobs',
  username: 'purplestarfish9283',
  email: 'm.jacobs@fake.com',
};

const invalidMemberEmail = {
  firstname: 'Michael',
  lastname: 'Jacobs',
  username: 'purplestarfish9283',
  email: 'm.jacobsfake.com',
};

const invalidMemberParameter = {
  firstname: 'Michael',
  lastname: 'Jacobs',
  username: 'purplestarfish9283',
  email: 'm.jacobsfake.com',
  test: 5,
};

module.exports = {
  newMember,
  invalidMemberKey,
  invalidMemberEmail,
  invalidMemberParameter,
};
