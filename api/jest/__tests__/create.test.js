const {handler} = require('../../handlers/create');
const {newMember, invalidMemberKey, invalidMemberParameter, invalidMemberEmail} = require('../__fixtures__/member');

const LambdaTester = require('lambda-tester');

describe('Create Handler', () => {
  describe('When an event is passed to the create handler with a valid body', () => {
    test('Then a new member from the request body data will be created', async () => {
      const event = {body: JSON.stringify(newMember)};

      await LambdaTester(handler)
        .event(event)
        .expectResolve(result => {
          const body = JSON.parse(result.body);

          expect(result.statusCode).toBe(201);
          expect(body.member.id).toBeDefined();
          expect(body.member.createdAt.split('T')[0]).toEqual(new Date().toISOString().split('T')[0]);
          expect(body.member.firstname).toBe('Michael');
          expect(body.member.lastname).toBe('Jacobs');
          expect(body.member.username).toBe('purplestarfish9283');
          expect(body.member.email).toBe('m.jacobs@fake.com');
        });
    });
  });

  describe('When an event is passed to the create handler with a no body', () => {
    test('Then a new random member will be created', async () => {
      const event = {body: JSON.stringify({})};

      await LambdaTester(handler)
        .event(event)
        .expectResolve(result => {
          const body = JSON.parse(result.body);

          expect(result.statusCode).toBe(201);
          expect(body.member.id).toBeDefined();
          expect(body.member.createdAt.split('T')[0]).toEqual(new Date().toISOString().split('T')[0]);
          expect(body.member.firstname).toBeDefined();
          expect(body.member.lastname).toBeDefined();
          expect(body.member.username).toBeDefined();
          expect(body.member.email).toBeDefined();
        });
    });
  });

  describe('When an event is passed to the create handler with an invalid value in the body', () => {
    test('Then an 400 error will be thrown', async () => {
      const event = {body: JSON.stringify(invalidMemberParameter)};

      await LambdaTester(handler)
        .event(event)
        .expectError(result => {
          const error = JSON.parse(result.message);

          expect(error.name).toBe('BadRequestError');
          expect(error.data.code).toBe(400);
        });
    });
  });

  describe('When an event is passed to the create handler with an invalid email', () => {
    test('Then an 400 error will be thrown', async () => {
      const event = {body: JSON.stringify(invalidMemberEmail)};

      await LambdaTester(handler)
        .event(event)
        .expectError(result => {
          const error = JSON.parse(result.message);

          expect(error.name).toBe('BadRequestError');
          expect(error.data.code).toBe(400);
          expect(error.data.message).toBe('Invalid email address');
        });
    });
  });

  describe('When an event is passed to the create handler with an invalid key', () => {
    test('Then a 422 error will be thrown', async () => {
      const event = {body: JSON.stringify(invalidMemberKey)};

      await LambdaTester(handler)
        .event(event)
        .expectError(result => {
          const error = JSON.parse(result.message);

          expect(error.name).toBe('UnproccessableEntityError');
          expect(error.data.code).toBe(422);
        });
    });
  });
});
