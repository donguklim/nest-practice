export class DuplicateUsernameError extends Error {
  constructor(username: string) {
    super(`user name ${username} already exists!`);
  }
}

export class NonExistingUserError extends Error {
  constructor(username: string) {
    super(`user name ${username} does not exists!`);
  }
}


export class DeceasedUserError extends Error {
  constructor(username: string) {
    super(`user ${username} is no longer active!`);
  }
}
