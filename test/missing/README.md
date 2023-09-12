# Missing 

I've moved tests here that seem to be missing at least part of what they are testing.

In the migration from the QUnit tests, there are some tests where their source didn't come with them. 

For example `omit.test.js` imports an `omit` function from `omit.js`, but that source file is not found in the repo.

## Removed?

I'm not sure if this was a quirk of migrating the tests, or if some of these methods are intentionally removed.

For now they are hanging out in here until I figure out what to do with them.
