import { Command } from '@oclif/command';

import {
  AnalyticsEvent,
  flushAsync as flushAnalyticsAsync,
  initAsync as initAnalyticsAsync,
  logEvent,
} from '../analytics';
import { getUserAsync } from '../user/User';
import { ensureLoggedInAsync } from '../user/actions';

export default abstract class EasCommand extends Command {
  /**
   * When user data is unavailable locally, determines if the command will
   * force the user to log in
   */
  protected requiresAuthentication = true;

  protected abstract runAsync(): Promise<any>;

  // eslint-disable-next-line async-protect/async-suffix
  async init(): Promise<void> {
    await initAnalyticsAsync();

    if (this.requiresAuthentication) {
      await ensureLoggedInAsync();
    } else {
      await getUserAsync();
    }
    logEvent(AnalyticsEvent.ACTION, {
      // id is assigned by oclif in constructor based on the filepath:
      // commands/submit === submit, commands/build/list === build:list
      action: `eas ${this.id}`,
    });
  }

  // eslint-disable-next-line async-protect/async-suffix
  async run(): Promise<any> {
    return this.runAsync();
  }

  // eslint-disable-next-line async-protect/async-suffix
  async finally(err: Error): Promise<any> {
    await flushAnalyticsAsync();
    return super.finally(err);
  }
}
