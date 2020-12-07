# SpeechToChess tutorial

Let’s play chess by using voice!

## How to run
- Add your appId to the client options
```
const client = new Client({
  appId: 'HereIs-AppId-From-The-Dashbord',
  language: 'en-US',
});
```
- `yarn`
- `yarn webpack`
- `open dist/index.html`
- Say `e4 e5 knight f3`