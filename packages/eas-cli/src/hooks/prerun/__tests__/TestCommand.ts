import Command from '@oclif/command';

export default class TestCommand extends Command {
  async run() {}
}

TestCommand.id = 'TestAuthenticatedCommand'; // normally oclif will assign ids, but b/c this is located outside the commands folder it will not
