## Additional Setup for Mac Users

In some cases, Mac users might need to configure npm to manage global packages without requiring superuser privileges. This is particularly useful for running a local server like `http-server`.

### Configure npm's Global Installation Path

Set npm to use a directory in your home folder for global installations. Open a terminal and run the following command:

step 1:
```sh
mkdir "${HOME}/.npm-global"
```
step 2:
```sh
npm config set prefix "${HOME}/.npm-global"
```

Create the .zshrc file using the nano text editor (or any text editor you prefer):
```sh
nano ~/.zshrc
```
Once in the nano editor, add the following line to set up your npm configuration:
```sh
export PATH="${HOME}/.npm-global/bin:$PATH"
```
1.Press Ctrl + O to write the changes to the file.
2.Press Enter to confirm the file name.
3.Press Ctrl + X to exit nano.

 Source .zshrc to Apply Changes:
```sh
source ~/.zshrc
```
