# Release A acceptance criteria

Release A passes only when all automated checks are true:

- official schedule discovers at least one game;
- first import reports zero game failures;
- at least one completed game is present;
- all completed games have final scores;
- any game with verified innings 1-5 has a valid F5 score;
- inning rows exist;
- starter rows exist;
- duplicate `gamePk` count is zero;
- the second import does not increase the stored game count;
- the second import creates zero new game rows;
- the second import reports zero game failures.

A postponed game on the selected date may exist without innings. This does not invalidate completed-game data, but select a normal completed slate for the clearest test.
