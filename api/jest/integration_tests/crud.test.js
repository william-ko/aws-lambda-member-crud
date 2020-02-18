const {handler: readHandler} = require('../../handlers/read');
const {handler: listHandler} = require('../../handlers/list');
const {handler: updateHandler} = require('../../handlers/update');
const {handler: createHandler} = require('../../handlers/create');
const {handler: deleteHandler} = require('../../handlers/delete');

const {updateMember, invalidUpdateEmail} = require('../__fixtures__/member-update');
const {newMember, invalidMemberKey, invalidMemberParameter, invalidMemberEmail} = require('../__fixtures__/member-create');

let memberId;
const LambdaTester = require('lambda-tester');

// Create handler test
describe('Create Handler', () => {
  describe('When an event is passed to the create handler with a valid body', () => {
    test('Then a new member from the request body data will be created', async () => {
      const event = {body: JSON.stringify(newMember)};

      await LambdaTester(createHandler)
        .event(event)
        .expectResolve(result => {
          const body = JSON.parse(result.body);

          memberId = body.member.id
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

      await LambdaTester(createHandler)
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

      await LambdaTester(createHandler)
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

      await LambdaTester(createHandler)
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

      await LambdaTester(createHandler)
        .event(event)
        .expectError(result => {
          const error = JSON.parse(result.message);

          expect(error.name).toBe('UnproccessableEntityError');
          expect(error.data.code).toBe(422);
        });
    });
  });
});

// List handler tests
describe('List Handler', () => {
  describe('When a member is queried by its ID', () => {
    test('Then that member will be returned', async () => {

      await LambdaTester(listHandler)
        .event()
        .expectResolve(result => {
          const members = JSON.parse(result.body);

          expect(result.statusCode).toBe(200);
          expect(members.data.Count > 0).toBeTruthy();
        });
    });
  });
});

// Read handler tests
describe('Read Handler', () => {
  describe('When a member is queried by its ID', () => {
    test('Then that member will be returned', async () => {
      const event = {pathParameters: {id: memberId}};

      await LambdaTester(readHandler)
        .event(event)
        .expectResolve(result => {
          const member = JSON.parse(result.body);

          expect(result.statusCode).toBe(200);
          expect(member.data.Item).toBeDefined();
          expect(member.data.Item.id).toBe(memberId);
        });
    });
  });

  describe('When an invalid id is passed', () => {
    test('Then a 404 error will be thrown', async () => {
      const event = {pathParameters: {id: '2abcacef-1c92-4217-b4a5-91110bf563e'}};

      await LambdaTester(readHandler)
        .event(event)
        .expectError(result => {
          const error = JSON.parse(result.message);

          expect(error.name).toBe('ResourceNotFoundError');
          expect(error.data.code).toBe(404);
          expect(error.data.message).toBe('Member not found');
        });
    });
  });
});

// Update handler tests
describe('Update Handler', () => {
  describe('When a put request is made with an ID and the parameter key and value to be updated', () => {
    test('Then the selected field on that member will be updated', async () => {
      const event = {
        pathParameters: {
          id: memberId
        },
        body: JSON.stringify(updateMember)
      };

      await LambdaTester(updateHandler)
        .event(event)
        .expectResolve(result => {
          const body = JSON.parse(result.body);
          
          expect(result.statusCode).toBe(200);
          expect(body.data.firstname).toBe('Matt')
        });
    });
  });

  describe('When an event body is passed to the update handler with an invalid email', () => {
    test('Then a 400 error will be thrown', async () => {
      const event = {
        pathParameters: memberId,
        body: JSON.stringify(invalidUpdateEmail)
      };

      await LambdaTester(updateHandler)
        .event(event)
        .expectError(result => {
          expect(result.name).toBe('BadRequestError');
          expect(result.data.code).toBe(400);
          expect(result.data.message).toBe('Invalid email address');
        });
    });
  });
});

// Delete handler test
describe('Delete Handler', () => {
  describe('When a delete request is made with an ID', () => {
    test('Then that member will be deleted from the db', async () => {
      const event = {pathParameters: {id: memberId}};

      await LambdaTester(deleteHandler)
        .event(event)
        .expectResolve(result => {
          const response = JSON.parse(result.body);

          expect(result.statusCode).toBe(200);
          expect(response.message).toBe(`Member ${memberId} deleted successfully`);
          expect(response.deletedMember).toBeDefined();
        });
    });
  });

  describe('When an invalid id is passed', () => {
    test('Then a 404 error will be thrown', async () => {
      const event = {pathParameters: {id: '3280123123'}};

      await LambdaTester(deleteHandler)
        .event(event)
        .expectError(result => {
          const error = JSON.parse(result.message);

          expect(error.name).toBe('ResourceNotFoundError');
          expect(error.data.code).toBe(404);
          expect(error.data.message).toBe('Member not found');
        });
    });
  });
});