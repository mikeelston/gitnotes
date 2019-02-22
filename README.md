# gitnotes
Create release notes from git log

# Install
`npm install -g`

# CLI Usage

```
Usage: gitnotes [options] <gitrepo path> <output path>

Options:
  -s, --since <since>  Only show commits since date provided e.g."2019-01-01 12:00:00"
  -h, --help           output usage information

Example: 
  gitnotes ../gitrepo ./releasenotes.md -s 2019-01-01
```