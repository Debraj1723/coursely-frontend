import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-south-1_vil3y0pUM',
      userPoolClientId: '2c4s7kgki4cot8n4s9u22qr108',
    },
  },
});

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
