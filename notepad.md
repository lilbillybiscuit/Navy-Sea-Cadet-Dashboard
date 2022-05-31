# Collections
sessions:
```
{
    token: 100 character token
    expires: Date() object
    access_level: integer (truly define later)
    username: string (duh)
}
```
accounts
```
{
    username: max 50 characters
    password: password in sha256 format
    email: string
    role: admin, moderator, or user
    data: other data
}
```

send all data in json except for the token
creating cadet profiles
send this from client:
```
{
    name: string
    role: string
    description: string
    image: url (idk if needed but can add if needed, just need to bash out a image saving system)
}
```


# HTML Notes
Unread Message Badge:
assign id "unread_messages_count" to tag with number
remove 54 from the element (make the default blank)

Change add announcements hyperlink to "announcements/create_announcement.html" or whatever it is

