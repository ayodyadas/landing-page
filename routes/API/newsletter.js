var express = require('express');
var router = express.Router();

const Subscriber = require('../../database/model/subscribe');

/* GET users listing. */
router.post('/subscribe', async function(req, res, next) {
  const { email } = req.body;
  const newSubscriber = new Subscriber({ email });
  console.log('Received email:', email);
  try {
    await newSubscriber.save();
    res.status(201).send({ message: 'Subscription successful!' });
  } catch (error) {
    if (error.code === 11000) { // Duplicate email error code
      res.status(400).send({ error: 'Email already subscribed!' });
    } else {
      res.status(500).send({ error: 'Internal server error '+error });
    }
  }
});


router.get('/subscribers', async function(req, res, next) {
  try {
    const subscribers = await Subscriber.find({});
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve subscribers' });
  }
});


module.exports = router;
