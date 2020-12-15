# Lof_POS Magento
### This is a project base on Electron (a cross-platform desktop app with Javascript)
## Installation Environment

### For Linux System

#### Required install node ~12.x

```bash
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install nodejs
```


#### Required install yarn 1.2x.x

```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn
```
### For Window System
#### Required Node 12.x download
[Node 12.x download](https://nodejs.org/dist/latest-v12.x/win-x64/node.exe)

#### Required Yarn 1.2x.x download
[Yarn 1.2x.x download](https://classic.yarnpkg.com/latest.msi)

### For MacOS System
#### Required Node 12.x download
[Node 12.x download](https://nodejs.org/dist/latest-v12.x/node-v12.20.0.pkg)

#### Required Yarn 1.2x.x download

##### Installed homebrew first

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)
```
after that
```bash
brew install yarn
```


## Check Environment

Check node version 
```bash
node -v 
```
Check yarn version 
```bash
yarn -v 
```


## Develop Lof_POS app 

#### Install node packages first
```bash
yarn install
```

#### Run develop app

```bash
yarn dev
```

## Production Lof_POS app

### Run bundler for POS to package

#### For custom build platform

For window
```bash
yarn package-win
```

For linux
```bash
yarn package-linux
```


#### Note: For the bundle for macOS (macOS machine required)
 
#### Bundle all package file supported (macOS, linux, windows)
```bash
yarn package-all
``` 
#### That takes a long time



### With success all package stored at 

```bash
/release
*.exe(windows)
*.deb(linux)
*.dmg(macOS)
```


## Lof_POS license 
[Landofcoder license](https://landofcoder.com/license)
