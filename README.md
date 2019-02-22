# gitnotes
Create release notes from git log

When user stories are referenced in your commit message with a hashtag+number (e.g. #0000)  they will be listed in the user story column

# Install
`npm install gitnotes -g`

# CLI Usage

```
Usage: gitnotes [options] <gitrepo path> <output path>

Options:
  -s, --since <since>  Only show commits since date provided e.g."2019-01-01 12:00:00"
  -h, --help           output usage information

Example: 
  gitnotes ../gitrepo ./releasenotes.md -s 2019-01-01
```

