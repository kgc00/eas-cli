import { Hook } from '@oclif/config';

import { flushAsync } from '../../analytics';

const flushAnalytics: Hook<'postrun'> = async function (opts) {
  await flushAsync();
};

export default flushAnalytics;
