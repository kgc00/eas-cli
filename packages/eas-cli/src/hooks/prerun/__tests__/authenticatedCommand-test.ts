import { flushAsync, initAsync, logEvent } from '../../../analytics';
import { jester as mockJester } from '../../../credentials/__tests__/fixtures-constants';
import { getUserAsync } from '../../../user/User';
import { ensureLoggedInAsync } from '../../../user/actions';
import getCredentialsAndTrack from '../getCredentialsAndTrack';
import TestCommand from './TestCommand';

describe(TestCommand.name, () => {
  beforeAll(() => {
    jest.mock('../../user/actions', () => ({ ensureLoggedInAsync: jest.fn(() => mockJester) }));
    jest.mock('../../user/User', () => ({ getUserAsync: jest.fn(() => mockJester) }));
    jest.mock('../../analytics', () => {
      const { AnalyticsEvent } = jest.requireActual('../../analytics');
      return {
        AnalyticsEvent,
        logEvent: jest.fn(),
        initAsync: jest.fn(),
        flushAsync: jest.fn(),
      };
    });
  });

  afterEach(() => {
    (ensureLoggedInAsync as jest.Mock).mockClear();
    (initAsync as jest.Mock).mockClear();
    (flushAsync as jest.Mock).mockClear();
    (logEvent as jest.Mock).mockClear();
    (getUserAsync as jest.Mock).mockClear();
  });

  describe('without exceptions', () => {
    it('ensures the user is logged in', async () => {
      (TestCommand as any).requiresLogin = true;
      await (getCredentialsAndTrack as any)({
        Command: { ...TestCommand, requiresLogin: true },
        argv: [],
        config: {},
      });

      expect(ensureLoggedInAsync).toHaveReturnedWith(mockJester);
    });

    it('ensures the user is logged in', async () => {
      await (getCredentialsAndTrack as any)({
        Command: { ...TestCommand, requiresLogin: false },
        argv: [],
        config: {},
      });

      expect(getUserAsync).toHaveReturnedWith(mockJester);
    });

    it('initializes analytics', async () => {
      await (getCredentialsAndTrack as any)({
        Command: TestCommand,
        argv: [],
        config: {},
      });

      expect(initAsync).toHaveBeenCalled();
    });

    // not sure how to test this logic as it's now in `bin/run`
    it.skip('flushes analytics', async () => {
      await (getCredentialsAndTrack as any)({
        Command: { ...TestCommand, requiresLogin: false },
        argv: [],
        config: {},
      });

      expect(flushAsync).toHaveBeenCalled();
    });

    it('logs events', async () => {
      await (getCredentialsAndTrack as any)({
        Command: { ...TestCommand, requiresLogin: false },
        argv: [],
        config: {},
      });

      expect(logEvent).toHaveBeenCalledWith('action', {
        action: `eas ${TestCommand.id}`,
      });
    });
  });

  // not sure how to test this logic as it's now in `bin/run`
  describe.skip('after exceptions', () => {
    it.skip('flushes analytics', async () => {
      try {
        await (getCredentialsAndTrack as any)({
          Command: { ...TestCommand, requiresLogin: false },
          argv: [],
          config: {},
        });
      } catch (error) {}

      expect(flushAsync).toHaveBeenCalled();
    });
  });
});
