# Security Spec

1.  **Data Invariants**:
    *   A `user` can only read/update their own profile, unless they are an admin.
    *   A `trip` can be read by anyone, but only created/updated/deleted by an admin.
    *   A `booking` can be created by an authenticated user. The user can only list/read/delete their own bookings. Admins can read/delete all bookings.
    *   A `notification` can be read by the recipient user or an admin.

2.  **The "Dirty Dozen" Payloads**:
    *   *Payload 1*: Create user with someone else's ID.
    *   *Payload 2*: Update `role` to 'admin' as a normal user.
    *   *Payload 3*: Update a trip as a non-admin.
    *   *Payload 4*: Create a booking for another user.
    *   *Payload 5*: Read another user's booking.
    *   *Payload 6*: Delete a trip as a non-admin.
    *   *Payload 7*: Inject a huge string as an ID.
    *   *Payload 8*: Create a booking with an invalid trip ID.
    *   *Payload 9*: Read all users as a non-admin.
    *   *Payload 10*: Read notifications for another user.
    *   *Payload 11*: Update a booking's cost without proper structure.
    *   *Payload 12*: Spoof email field during signup.
