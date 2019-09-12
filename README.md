# [LiveCode](https://ctcuff.github.io/LiveCode)
LiveCode is a website built using Vue that lets you edit code online collaboratively. It uses Microsoft's [monaco editor](https://github.com/microsoft/monaco-editor) to deliver a text-editing experience that feels just like using VSCode. Note that Monaco Editor [isn't supported on mobile devices](https://github.com/Microsoft/monaco-editor/issues/246) so because of this, [Ace](https://ace.c9.io/) is used on mobile instead.

<p align="center">
<img src="https://user-images.githubusercontent.com/7400747/64821681-685e0380-d581-11e9-9050-48b61b80dbfd.gif">
</p>

# How do I build this?

0. Go to Google's [Firebase site](https://firebase.google.com/) to create a new project.
1. In project settings copy the config and place it in a file named `firebaseConfig.js` in the `src` directory. It sould look something like this:
```javascript
export default {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: ''
};
```
2. Navigate to the Authentication section and enable sign-in with Google and sign-in with GitHub (you'll need to register the app on GitHub, [which you can read about here](https://firebase.google.com/docs/auth/web/github-auth?authuser=0)).
3. Run `yarn install` or `npm install` to install the required dependiencies.
4. Run `npm run serve` to start the project.
