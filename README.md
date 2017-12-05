<h1 align="center">:rocket: Mongoose Paranoid Plugin :rocket:</h1>

<div align="center">
  <sub>The little plugin that could. Built with ❤︎ by
  <a href="https://github.com/euqen">Eugene Shilin</a> and
  <a href="https://github.com/euqen/mongoose-paranoid-plugin/graphs/contributors">
    contributors
  </a>
</div>
<br />
  
This plugin allows to apply soft deletion of mongo db documents. It's simple, lightweight and easy to use. Inspired by Sequelize.

## Philosophy

All existing soft deletion plugins doesn't allow to disable quering by non-deleted documents. They all require to use their own-implemented methods. Sometimes you need to get all documents including deleted, sometimes you need to retrieve only non-deleted. All existing plugins provide their own separate methods to do this. It's not flexible, you need to call different methods depending on situations you faced with.

## Installation

Install using npm

```
npm install mongoose-paranoid-plugin
```

## Usage

By default this plugin won't override any methods. To enable soft deletion of your document's you need to pass `paranoid` option into your model options. 

```
const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
  firstName: { type: String },
  lastName: { type: String }
}, {
  paranoid: true,
});

const User = meta.model('users', schema);
```

This will enable soft deletion of your documents. All deleted models will be marked with `deletedAt` field and will not be retrieved by built-in mongoose methods. If you need to include deleted documents you need to call `.paranoid` method before querying.

```
return User.paranoid(false).find(query);
```

The behavior of remove method is also very expicit. If you enabled soft deletion in your schema, `remove` method will mark the document with deletedAt field. Otherwise the document will be completely removed. You can also use `paranoid` method before removing to enable/disable soft deletion.


## Copyright

Copyright (c) 2017 Eugene Shilin See LICENSE for further details.
