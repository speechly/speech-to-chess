# Voice-enabled Chess Tutorial

This is a GitHub repository for SpeechToChess tutorial. You can clone the repository and try it out or [follow the tutorial](https://docs.speechly.com/client-libraries/web-client/tutorial/).

## About Speechly

Speechly is a developer tool for building real-time multimodal voice user interfaces. It enables developers and designers to enhance their current touch user interface with voice functionalities for better user experience. Speechly key features:

#### Speechly key features

- Fully streaming API
- Multi modal from the ground up
- Easy to configure for any use case
- Fast to integrate to any touch screen application
- Supports natural corrections such as "Show me red – i mean blue t-shirts"
- Real time visual feedback encourages users to go on with their voice

|                  Example application                  | Description                                                                                                                                                                                                                                                                                                                               |
| :---------------------------------------------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://i.imgur.com/v9o1JHf.gif" width=50%> | Instead of using buttons, input fields and dropdowns, Speechly enables users to interact with the application by using voice. <br />User gets real-time visual feedback on the form as they speak and are encouraged to go on. If there's an error, the user can either correct it by using traditional touch user interface or by voice. |

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
