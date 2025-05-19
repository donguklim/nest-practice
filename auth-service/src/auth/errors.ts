export class DuplicateUsernameError extends Error {
  constructor(username: string) {
    super(`user name ${username} already exists!`);
  }
}

export class InvalidLogin extends Error {
  constructor(username: string) {
    super(`user name ${username} or password is wrong!`);
  }
}


export class DeceasedUserError extends Error {
  constructor(username: string) {
    super(`user ${username} is no longer active!`);
  }
}
