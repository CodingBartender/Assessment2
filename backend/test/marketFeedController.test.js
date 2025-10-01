const { expect } = require('chai');
const sinon = require('sinon');
const marketFeedController = require('../controllers/marketFeedController');
const EventHub = require('../observer/EventHub');

describe('marketFeedController.stream', () => {
  afterEach(() => sinon.restore());

  it('delegates to EventHub.instance.subscribe(res)', () => {
    const res = {};
    const subscribe = sinon.spy();
    sinon.stub(EventHub, 'instance').get(() => ({ subscribe }));

    marketFeedController.stream({}, res);

    expect(subscribe.calledOnceWith(res)).to.equal(true);
  });
});