const mongoose = require('mongoose');

mongoose
  .connect(process.env.DATABASE_NAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('database created successfully');
  })
  .catch((err) => {
    console.log(err);
  });
