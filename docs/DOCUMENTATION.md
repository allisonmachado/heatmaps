# High Level Backend Features

## List a user habits

> listUserHabits(user);

Parameters:
- user: The logged user for which the habits should be retrieved

This api queries the `habit` table and returns all the habits for the given user.

## Create a user habit

> createUserHabit(user, title, color, type);

Parameters:
- user: The logged user for which the habits should be retrieved
- title: The title string for the habit
- color: The hex value for the habit displayed color
- type: The type of the habit (timer, binary)

The record is inserted into the `habit` table.

## Update a user habit

> updateUserHabit(user, habit, title, color);

Parameters:
- user: The logged user for which the habits should be retrieved
- habit: The habit that should be updated
- title: The title string for the habit
- color: The hex value for the habit displayed color

The record is updated into the `habit` table.

The habit type should not be altered after it's creation.

## Delete a user habit

> deleteUserHabit(user, habit);

Parameters:
- user: The logged user for which the habits should be retrieved
- habit: The habit that should be deleted

This is a hard delete.

The logs related to this habit should be deleted in a cascade fashion.

This api deletes records in the `habit` and `habit_log` table.

## List a user habit log

> listUserHabitLog(user, habit, startDate, endDate);

Parameters:
- user: The logged user for which the logs should be retrieved
- habit: The habit for which the logs should be retrieved
- startDate: The date for the minimum habit log, defaults to one year behind today.
- startDate: The date for the maximum habit log, defaults to today.

This interface queries the `habit_log` table and returns all the logs for the given user and habit that are in the time range passed.

## Register a user habit log

> logUserHabit(user, habit, date, value);

Parameters:
- user: The logged user for which the logs should be registered
- habit: The habit for which the logs should be registered
- date: The date in which the user is practicing the habit
- value: The value to be tracked
    - The value data type can vary depending on the habit

The logs are saved in the `habit_log` table.

Important validation:
- Check if the habit belongs to the user
- Check if the payload type correspond to the habit type

## Authenticate a user

> loginUser(user);

Parameters:
- user: The logged user for which the authentication token should be retrieved

This method should only be called to issue a token if the username and password are correct

The authentication flow and implementation follows the [nestjs][1] reference.

# Links

- [NestJS Authentication][1]

[1]: https://docs.nestjs.com/security/authentication