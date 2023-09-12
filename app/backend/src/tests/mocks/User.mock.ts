const user = {
  id: 1,
  username: 'Admin',
  role: 'admin',
  email: 'admin@admin.com',
  password: 'secret_admin',
};

const user2 = {
  id: 2,
  username: 'User',
  role: 'user',
  email: 'user@user.com',
  password: 'secret_user',
}

const userWithoutPassword = {
  id: 1,
  username: 'Admin',
  email: 'admin@admin.com',
};

const wrongPassUser = {
  id: 2,
  username: 'User',
  role: 'undefined',
  email: 'user@xablau.com',
  password: 'senha_invalida',
};

const users = [
  {
    id: 1,
    username: 'Admin',
    role: 'admin',
    email: 'admin@admin.com',
    password: 'secret_admin',
  },
  {
    id: 2,
    username: 'User',
    role: 'user',
    email: 'user@user.com',
    password: 'secret_user',
  },
];

const validLoginBody = { email: 'admin@admin.com', password: 'secret_admin' };
const invalidPasswordLoginBody = { email: 'jondoe@email.com', password: 'Jon' };
const invalidEmailLoginBody = { email: 'invalid_email', password: 'JonDoe' };
const userRegistered = { ...user, password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW' };

export {
  user,
  userWithoutPassword,
  users,
  invalidEmailLoginBody,
  invalidPasswordLoginBody,
  validLoginBody,
  wrongPassUser,
  userRegistered,
};
